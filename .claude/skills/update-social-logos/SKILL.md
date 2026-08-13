---
name: update-social-logos
description: Refresh the vendored logo artwork in @humanwhocodes/social-logos from upstream simple-icons, including handling logos that upstream has removed. Use when updating logos, bumping the simple-icons dependency, or when `npm run update:vendor` fails with "simple-icons has no icon named".
---

# Update social logos from simple-icons

Refreshes vendored artwork from the installed `simple-icons` devDependency.
Every logo except the pinned ones is re-fetched and rewritten under
`vendor/logos/`, then the SVG files and React components are regenerated.

## Steps

1. Bump the dependency if the point is to pick up upstream changes:

   ```bash
   npm install --save-dev simple-icons@latest
   ```

2. Re-vendor, rebuild, and test:

   ```bash
   npm run update:vendor && npm run build && npm test
   ```

3. Review the diff under `vendor/logos/`. Each changed file is a real artwork
   change — a brand restyle, a redraw, or a path optimization. Confirm the
   changes look intentional rather than corrupt.

4. Check the rendering before committing. Generate a contact sheet of all
   logos at 40px from `src/svg/`, open it, and confirm every mark still reads
   correctly. Path data can change substantially without breaking the build.

5. Commit `vendor/logos/`, `vendor/provenance.json`, `LOGOS.md`, and the
   `package.json` / `package-lock.json` dependency bump. Generated output
   (`src/svg/`, `src/logos/`, `src/index.ts`, `dist/`) is gitignored.

## If update:vendor fails

The script is transactional: it resolves and validates everything before
writing, so a failure leaves `vendor/` untouched. Fix the cause and re-run.

### "simple-icons has no icon named X"

Upstream removed the icon. This has already happened once (LinkedIn), and it
usually follows a request from the brand owner.

The existing artwork under `vendor/logos/X.svg` is still there and still
usable — CC0 is an irrevocable dedication. To pin it:

1. Compute its checksum:

   ```bash
   node -e "import('./scripts/collections.js').then(async m=>console.log(await m.checksum(require('fs').readFileSync('vendor/logos/X.svg','utf8'))))"
   ```

2. In `scripts/manifest.js`, change that entry's `collection` to
   `"simple-icons-archived"` and add an `artwork` block:

   ```js
   artwork: {
       version: "<last simple-icons version that shipped it>",
       source: "https://github.com/simple-icons/simple-icons/blob/<version>/icons/X.svg",
       sha256: "<checksum from step 1>",
   },
   ```

   To find the last version that shipped it, check whether the file exists at
   `https://cdn.jsdelivr.net/npm/simple-icons@<version>/icons/X.svg` — a 404
   means that version had already dropped it.

3. Re-run `npm run update:vendor && npm run build && npm test`.

Record the real version. It is per-logo precisely because different logos are
removed at different times, and provenance that claims otherwise is wrong.

Alternatively, if the brand objected to its inclusion, consider dropping the
logo instead: delete the manifest entry and re-run. `update:vendor` prunes the
orphaned file automatically.

### "X.svg does not match the checksum in the manifest"

Pinned artwork changed on disk. Either it was edited by mistake — restore it —
or the change was deliberate, in which case recompute the checksum as above and
update `artwork.sha256`.

### "X is pinned but its manifest entry is missing artwork.version/sha256"

A pinned entry needs both. See the pinning steps above.

## Things to know

- Pinned logos are deliberately frozen. They will not pick up upstream
  restyles, so the set can drift stylistically over time.
- Never hand-edit `vendor/provenance.json`, `src/svg/`, `src/logos/`, or
  `src/index.ts` — all are generated and will be overwritten.
- A slug rename upstream looks identical to a removal. Before pinning, check
  whether the icon still exists under a different slug, and if so just update
  `icon` in the manifest.
