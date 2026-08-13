/**
 * @fileoverview Vendors the logo artwork from the upstream collections.
 *
 * The artwork is committed under `vendor/logos/` rather than pulled at build
 * time so that builds are reproducible and offline-friendly, and so that any
 * change to a logo shows up as a reviewable diff. Collection packages are
 * devDependencies used only here; nothing at build or run time depends on them.
 *
 * This runs in two phases. Everything is resolved and validated first, and only
 * once all of it succeeds does anything on disk change. A failure part-way
 * through therefore leaves `vendor/` exactly as it was, which matters because
 * pinned artwork can't be re-fetched if it's lost.
 *
 * `vendor/provenance.json` records, for every logo, which collection it came
 * from, the version and license of that artwork, and where it was sourced from.
 *
 * Run with `npm run update:vendor`, then `npm run build` and review the diff.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checksum, collections, installedVersion } from "./collections.js";
import { logos } from "./manifest.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vendorDir = path.join(root, "vendor");
const logosDir = path.join(vendorDir, "logos");

//-----------------------------------------------------------------------------
// Phase 1: resolve and validate. Nothing is written yet.
//-----------------------------------------------------------------------------

const unknown = logos.filter(logo => !collections[logo.collection]);

if (unknown.length > 0) {
	throw new Error(
		`Unknown collection for: ${unknown.map(logo => logo.icon).join(", ")}`,
	);
}

/** Versions of the installed collection packages, looked up once each. */
const versions = new Map();

for (const collection of Object.values(collections)) {
	if (collection.load && !versions.has(collection.package)) {
		versions.set(
			collection.package,
			await installedVersion(root, collection.package),
		);
	}
}

/** @type {Array<{file: string, svg: string|null, record: object, icon: string}>} */
const resolved = [];

for (const logo of logos) {
	const collection = collections[logo.collection];
	const file = path.join(logosDir, `${logo.icon}.svg`);
	const info = logo.artwork;

	if (collection.load) {
		const artwork = await collection.load(root, logo.icon);

		resolved.push({
			icon: logo.icon,
			file,
			svg: `${artwork.svg.trim()}\n`,
			record: {
				collection: logo.collection,
				license: info?.license ?? collection.license,
				version: info?.version ?? versions.get(collection.package),
				source: info?.source ?? artwork.source,
			},
		});

		continue;
	}

	// Pinned artwork is committed by hand, so it must carry its own metadata:
	// there's no package to read a version from and no fetch to re-check it.
	if (!info?.version || !info?.sha256) {
		throw new Error(
			`${logo.icon} uses pinned collection "${logo.collection}" but its manifest ` +
				`entry is missing \`artwork.version\` and/or \`artwork.sha256\`.`,
		);
	}

	if (collection.license === "LicenseRef-See-Entry" && !info.license) {
		throw new Error(
			`${logo.icon} uses collection "${logo.collection}", which has no default ` +
				`license, so its manifest entry must declare \`artwork.license\`.`,
		);
	}

	const existing = await fs.readFile(file, "utf8").catch(() => null);

	if (existing === null) {
		throw new Error(
			`${logo.icon}.svg is pinned to "${logo.collection}" but missing from vendor/logos/.`,
		);
	}

	const actual = await checksum(existing);

	if (actual !== info.sha256) {
		throw new Error(
			`${logo.icon}.svg does not match the checksum in the manifest.\n` +
				`  expected ${info.sha256}\n  actual   ${actual}\n` +
				`If you changed the artwork on purpose, update \`artwork.sha256\`.`,
		);
	}

	resolved.push({
		icon: logo.icon,
		file,
		svg: null,
		record: {
			collection: logo.collection,
			license: info.license ?? collection.license,
			version: info.version,
			source: info.source ?? collection.url,
		},
	});
}

//-----------------------------------------------------------------------------
// Phase 2: everything validated, so it's safe to touch the disk.
//-----------------------------------------------------------------------------

await fs.mkdir(logosDir, { recursive: true });

for (const { file, svg } of resolved) {
	if (svg !== null) {
		await fs.writeFile(file, svg, "utf8");
	}
}

// Drop anything that's no longer in the manifest.
const expected = new Set(logos.map(logo => `${logo.icon}.svg`));

for (const file of await fs.readdir(logosDir)) {
	if (!expected.has(file)) {
		await fs.rm(path.join(logosDir, file));
		console.log(`Pruned ${file}.`);
	}
}

/** @type {Record<string, object>} */
const used = {};

for (const logo of logos) {
	const collection = collections[logo.collection];

	used[logo.collection] ??= {
		...(collection.package ? { package: collection.package } : {}),
		license: collection.license,
		url: collection.url,
		pinned: !collection.load,
		...(collection.note ? { note: collection.note } : {}),
	};
}

await fs.writeFile(
	path.join(vendorDir, "provenance.json"),
	`${JSON.stringify(
		{
			$comment:
				"Generated by scripts/update-vendor.js. Artwork licenses cover the drawings only; the marks themselves remain trademarks of their owners. See NOTICE.md.",
			collections: used,
			icons: Object.fromEntries(
				resolved.map(({ icon, record }) => [icon, record]),
			),
		},
		null,
		"\t",
	)}\n`,
	"utf8",
);

const fetched = resolved.filter(entry => entry.svg !== null).length;

console.log(
	`Vendored ${resolved.length} logos: ${fetched} fetched, ${resolved.length - fetched} pinned.`,
);
