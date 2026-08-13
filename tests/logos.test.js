/**
 * @fileoverview Tests for the React components and the generated SVG files.
 */

import assert from "node:assert";
import { describe, it } from "node:test";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { logos } from "../scripts/manifest.js";
import { checksum, collections } from "../scripts/collections.js";
import * as pkg from "../dist/index.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

/**
 * Renders a component to a static HTML string.
 * @param {Function} Component The component to render.
 * @param {object} [props] Props to pass.
 * @returns {string} The rendered markup.
 */
function render(Component, props = {}) {
	return renderToStaticMarkup(createElement(Component, props));
}

/**
 * Reads the generated provenance record.
 * @returns {Promise<object>} The parsed provenance file.
 */
async function readProvenance() {
	return JSON.parse(
		await fs.readFile(path.join(root, "vendor", "provenance.json"), "utf8"),
	);
}

describe("exports", () => {
	it("exports a component for every logo in the manifest", () => {
		for (const logo of logos) {
			assert.strictEqual(
				typeof pkg[logo.component],
				"function",
				`Missing export: ${logo.component}`,
			);
		}
	});

	it("exports nothing beyond the manifest", () => {
		const expected = new Set(logos.map(logo => logo.component));

		for (const name of Object.keys(pkg)) {
			assert.ok(expected.has(name), `Unexpected export: ${name}`);
		}
	});

	it("exports exactly one component per logo", () => {
		assert.strictEqual(Object.keys(pkg).length, logos.length);
	});
});

describe("rendering", () => {
	it("renders every logo without throwing", () => {
		for (const logo of logos) {
			const html = render(pkg[logo.component]);

			assert.match(
				html,
				/^<svg /u,
				`${logo.component} did not render an <svg>`,
			);
			assert.ok(
				html.includes("<path") || html.includes("<circle"),
				`${logo.component} rendered no geometry`,
			);
		}
	});

	it("defaults fill to currentColor", () => {
		assert.match(render(pkg.GitHubLogo), /fill="currentColor"/u);
	});

	it("defaults size to 1em so it scales with font size", () => {
		const html = render(pkg.GitHubLogo);

		assert.match(html, /width="1em"/u);
		assert.match(html, /height="1em"/u);
	});

	it("has no background fill", () => {
		for (const logo of logos) {
			const html = render(pkg[logo.component]);

			assert.ok(
				!/<rect/u.test(html),
				`${logo.component} contains a background rect`,
			);
		}
	});
});

describe("props", () => {
	it("applies size to both width and height", () => {
		const html = render(pkg.GitHubLogo, { size: 32 });

		assert.match(html, /width="32"/u);
		assert.match(html, /height="32"/u);
	});

	it("accepts a string size", () => {
		const html = render(pkg.GitHubLogo, { size: "2rem" });

		assert.match(html, /width="2rem"/u);
		assert.match(html, /height="2rem"/u);
	});

	it("applies fill", () => {
		assert.match(render(pkg.GitHubLogo, { fill: "#f00" }), /fill="#f00"/u);
	});

	it("applies className", () => {
		assert.match(
			render(pkg.GitHubLogo, { className: "icon" }),
			/class="icon"/u,
		);
	});

	it("applies alt as an aria-label with role=img", () => {
		const html = render(pkg.GitHubLogo, { alt: "GitHub" });

		assert.match(html, /role="img"/u);
		assert.match(html, /aria-label="GitHub"/u);
		assert.ok(!html.includes("aria-hidden"));
	});

	it("hides the logo from assistive tech when alt is omitted", () => {
		const html = render(pkg.GitHubLogo);

		assert.match(html, /aria-hidden="true"/u);
		assert.ok(!html.includes("aria-label"));
	});

	it("passes arbitrary SVG attributes through", () => {
		const html = render(pkg.GitHubLogo, { "data-testid": "gh", id: "logo" });

		assert.match(html, /data-testid="gh"/u);
		assert.match(html, /id="logo"/u);
	});

	it("lets explicit attributes override the defaults", () => {
		const html = render(pkg.GitHubLogo, {
			size: 32,
			width: 64,
			"aria-hidden": false,
		});

		assert.match(html, /width="64"/u);
		assert.match(html, /height="32"/u);
		assert.ok(!html.includes('aria-hidden="true"'));
	});
});

describe("svg files", () => {
	it("writes one file per logo", async () => {
		const files = await fs.readdir(path.join(root, "src", "svg"));

		assert.deepStrictEqual(
			files.sort(),
			logos.map(logo => `${logo.slug}.svg`).sort(),
		);
	});

	it("has no width or height and uses currentColor", async () => {
		for (const logo of logos) {
			const svg = await fs.readFile(
				path.join(root, "src", "svg", `${logo.slug}.svg`),
				"utf8",
			);

			assert.ok(
				!/\swidth=/u.test(svg),
				`${logo.slug}.svg has a width attribute`,
			);
			assert.ok(
				!/\sheight=/u.test(svg),
				`${logo.slug}.svg has a height attribute`,
			);
			assert.match(svg, /fill="currentColor"/u);
			assert.match(svg, /viewBox="[^"]+"/u);
			assert.ok(!/<rect/u.test(svg), `${logo.slug}.svg has a background`);
		}
	});

	it("matches the geometry rendered by the React component", async () => {
		for (const logo of logos) {
			const svg = await fs.readFile(
				path.join(root, "src", "svg", `${logo.slug}.svg`),
				"utf8",
			);
			const html = render(pkg[logo.component]);

			// Compare the `d` attribute of every path in both outputs.
			const paths = source =>
				[...source.matchAll(/\sd="([^"]+)"/gu)].map(match => match[1]);

			assert.deepStrictEqual(
				paths(html),
				paths(svg),
				`${logo.slug} geometry differs between SVG and React`,
			);
		}
	});
});

describe("vendored artwork", () => {
	it("has a vendored file for every logo in the manifest", async () => {
		const files = await fs.readdir(path.join(root, "vendor", "logos"));

		assert.deepStrictEqual(
			files.sort(),
			logos.map(logo => `${logo.icon}.svg`).sort(),
		);
	});

	it("records provenance for every logo", async () => {
		const provenance = await readProvenance();

		for (const logo of logos) {
			const record = provenance.icons[logo.icon];

			assert.ok(record, `No provenance for ${logo.icon}`);
			assert.strictEqual(record.collection, logo.collection);
			assert.ok(record.source, `No recorded source for ${logo.icon}`);
			assert.ok(record.license, `No recorded license for ${logo.icon}`);

			// Version is per-icon: pinned artwork predates the installed
			// package, so a single collection-wide version would be a lie.
			assert.ok(record.version, `No recorded version for ${logo.icon}`);

			if (logo.artwork?.version) {
				assert.strictEqual(record.version, logo.artwork.version);
			}
		}
	});

	it("uses only Apache-2.0-compatible artwork licenses", async () => {
		const provenance = await readProvenance();

		// Anything copyleft here would contaminate the package license. Widening
		// this set is a deliberate licensing decision, not a formality.
		const allowed = new Set(["CC0-1.0", "MIT"]);

		// Checked per icon, since a pinned entry can override its collection.
		for (const [icon, record] of Object.entries(provenance.icons)) {
			assert.ok(
				allowed.has(record.license),
				`${icon} has incompatible license ${record.license}`,
			);
		}
	});

	it("is Apache-2.0 with no runtime dependency", async () => {
		const pkgJson = JSON.parse(
			await fs.readFile(path.join(root, "package.json"), "utf8"),
		);

		assert.strictEqual(pkgJson.license, "Apache-2.0");
		assert.ok(!pkgJson.dependencies, "should have no runtime dependencies");

		// The icon collection is a build-time-only artwork source.
		assert.ok(
			"simple-icons" in pkgJson.devDependencies,
			"simple-icons should be a devDependency",
		);
	});

	it("matches the recorded checksum for pinned artwork", async () => {
		// Pinned files can't be re-fetched, so the manifest checksum is the
		// only thing standing between a silent edit and a shipped logo.
		const pinned = logos.filter(logo => logo.artwork?.sha256);

		assert.ok(pinned.length > 0, "expected at least one pinned logo");

		for (const logo of pinned) {
			const svg = await fs.readFile(
				path.join(root, "vendor", "logos", `${logo.icon}.svg`),
				"utf8",
			);

			assert.strictEqual(
				await checksum(svg),
				logo.artwork.sha256,
				`${logo.icon}.svg does not match its recorded checksum`,
			);
		}
	});

	it("requires version and checksum on every pinned logo", () => {
		for (const logo of logos) {
			if (collections[logo.collection].load) {
				continue;
			}

			assert.ok(
				logo.artwork?.version,
				`${logo.icon} is pinned but has no artwork.version`,
			);
			assert.ok(
				logo.artwork?.sha256,
				`${logo.icon} is pinned but has no artwork.sha256`,
			);
		}
	});

	it("uses a 24x24 viewBox for every logo", async () => {
		for (const logo of logos) {
			const svg = await fs.readFile(
				path.join(root, "src", "svg", `${logo.slug}.svg`),
				"utf8",
			);

			assert.match(
				svg,
				/viewBox="0 0 24 24"/u,
				`${logo.slug}.svg is not 24x24`,
			);
		}
	});
});

describe("entrypoints", () => {
	it("resolves SVG files through the /svg export", () => {
		const { exports: map } = require("../package.json");

		assert.ok(map["./svg/*.svg"], "missing ./svg/*.svg export");
		assert.ok(map["./svg/*"], "missing ./svg/* export");
	});
});
