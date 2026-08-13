/**
 * @fileoverview Where the vendored logo artwork comes from.
 *
 * Each collection is a permissively licensed source of artwork. Adding one is a
 * licensing decision: only sources whose terms are compatible with this
 * package's Apache-2.0 license belong here, and the test suite enforces an
 * allowlist of acceptable licenses.
 *
 * A collection either fetches artwork (it has a `load` function) or is pinned
 * (it doesn't). Pinned artwork is committed under `vendor/logos/` by hand and
 * verified against the checksum recorded in the manifest, because nothing can
 * re-fetch it to check it.
 *
 * Note that no artwork license grants any right to the trademarks themselves.
 * See NOTICE.md.
 */

import fs from "node:fs/promises";
import path from "node:path";

/**
 * @typedef {object} Artwork
 * @property {string} svg The raw SVG markup.
 * @property {string} source Where the artwork was originally taken from.
 */

/**
 * @typedef {object} Collection
 * @property {string} [package] The npm package providing the artwork. Omitted
 *   for artwork that isn't installed.
 * @property {string} license Default SPDX identifier for artwork in this
 *   collection. A manifest entry can override it.
 * @property {string} url Homepage for the collection.
 * @property {string} [note] Why this collection exists, recorded in provenance.
 * @property {(root: string, icon: string) => Promise<Artwork>} [load] Reads one
 *   icon. Omitted for pinned collections, whose files are committed by hand.
 */

/**
 * simple-icons is CC0-1.0, a public domain dedication with no conditions. It
 * records the official brand URL each mark was taken from, which is preserved
 * in the provenance file.
 * @type {Collection}
 */
const simpleIcons = {
	package: "simple-icons",
	license: "CC0-1.0",
	url: "https://github.com/simple-icons/simple-icons",
	async load(root, icon) {
		// simple-icons exports one named export per icon, so index them once.
		simpleIcons.icons ??= new Map(
			Object.values(await import("simple-icons"))
				.filter(candidate => candidate?.slug)
				.map(candidate => [candidate.slug, candidate]),
		);

		const match = simpleIcons.icons.get(icon);

		if (!match) {
			throw new Error(
				`simple-icons has no icon named "${icon}". If it was removed upstream, ` +
					`move this entry to the "simple-icons-archived" collection and give it ` +
					`an \`artwork\` block. See .claude/skills/update-social-logos.`,
			);
		}

		return { svg: match.svg, source: match.source };
	},
};

/**
 * Artwork that simple-icons published under CC0-1.0 and has since dropped.
 *
 * CC0 is irrevocable, so these files stay usable, but they can't be re-fetched
 * from the installed package. Each entry records, in its own `artwork` block,
 * the simple-icons version it was last published in — that differs per logo,
 * so it can't live on the collection.
 * @type {Collection}
 */
const simpleIconsArchived = {
	package: "simple-icons",
	license: "CC0-1.0",
	url: "https://github.com/simple-icons/simple-icons",
	note: "Pinned. Published by simple-icons under CC0-1.0 and later removed; CC0 is irrevocable, so the artwork stays usable.",
};

/**
 * Artwork vendored by hand from somewhere other than an installed package —
 * a brand's own materials, or another permissively licensed set.
 *
 * There's no single license covering this collection, so every entry must
 * declare its own `license` in its `artwork` block.
 * @type {Collection}
 */
const vendored = {
	license: "LicenseRef-See-Entry",
	url: "https://github.com/humanwhocodes/social-logos/blob/main/NOTICE.md",
	note: "Pinned. Vendored by hand; see each icon's own license and source.",
};

/** @type {Record<string, Collection>} */
export const collections = {
	"simple-icons": simpleIcons,
	"simple-icons-archived": simpleIconsArchived,
	vendored,
};

/**
 * Reads the installed version of a package.
 * @param {string} root The repository root.
 * @param {string} name The npm package name.
 * @returns {Promise<string>} The installed version.
 */
export async function installedVersion(root, name) {
	// Icon packages generally don't expose ./package.json through `exports`,
	// so read it off disk rather than resolving it.
	const file = path.join(root, "node_modules", name, "package.json");
	const { version } = JSON.parse(await fs.readFile(file, "utf8"));

	return version;
}

/**
 * Hashes artwork for the checksum recorded against pinned entries. Line endings
 * and surrounding whitespace are normalized so the hash survives a checkout on
 * any platform.
 * @param {string} svg The SVG markup.
 * @returns {Promise<string>} The hex-encoded SHA-256 digest.
 */
export async function checksum(svg) {
	const { createHash } = await import("node:crypto");

	return createHash("sha256")
		.update(svg.replace(/\r\n/gu, "\n").trim(), "utf8")
		.digest("hex");
}
