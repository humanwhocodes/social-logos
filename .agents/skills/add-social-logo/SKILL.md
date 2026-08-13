---
name: add-social-logo
description: Add a new logo to @humanwhocodes/social-logos, whether it comes from simple-icons or has to be vendored by hand from a brand's own materials or another icon set. Use when adding, replacing, or removing a brand logo in this package.
---

# Add a logo

There are two paths, depending on whether `simple-icons` already carries the
mark. Check first:

```bash
node -e "import('simple-icons').then(m=>{const q=process.argv[1].toLowerCase();for(const i of Object.values(m))if(i?.title&&(i.title.toLowerCase().includes(q)||i.slug.includes(q)))console.log(i.title,'->',i.slug)})" BRANDNAME
```

## Path A — the logo is in simple-icons

Add an entry to `scripts/manifest.js`, in alphabetical order by `label`:

```js
{
    icon: "<simple-icons slug>",
    collection: "simple-icons",
    slug: "<kebab-case file name>",
    component: "<PascalCase>Logo",
    label: "<Brand Name>",
    url: "<official brand/trademark page>",
},
```

Then:

```bash
npm run update:vendor && npm run build && npm test
```

That's all — the artwork, the SVG file, the React component, the export, and
`LOGOS.md` are all generated from that entry.

## Path B — the logo is not in simple-icons

You are vendoring artwork by hand, so you own the licensing decision. Work
through it in this order.

### 1. Find artwork with a usable license

Preferred sources, best first:

- The brand's own official SVG, from the page listed in `official_links.md`.
  Be aware many brands ship **PNG only** — LinkedIn does, which is why its
  artwork is pinned from an old simple-icons release rather than re-sourced.
- Another permissively licensed set: Bootstrap Icons (MIT), Font Awesome free
  brands (CC BY 4.0 — attribution required).
- An older `simple-icons` release, if the mark was removed upstream. CC0 is
  irrevocable. Use the `update-social-logos` skill instead; that is Path A
  with pinning, not this path.

**The license must be Apache-2.0 compatible.** The test suite enforces an
allowlist (currently `CC0-1.0` and `MIT`) and will fail with
`X has incompatible license Y` if you skip this. That failure is the guardrail
working — widen the allowlist in `tests/logos.test.js` only after deciding the
new license is genuinely compatible, and record it in `NOTICE.md`.

Copyleft artwork (GPL, CC BY-SA) does not belong here; it would contaminate the
package license. This is exactly why the Automattic social-logos sprite was
abandoned.

### 2. Normalize the artwork

The file must be:

- a `0 0 24 24` viewBox — a test enforces this, so rescale if needed
- a single color, with **no `fill` attribute on the geometry** (the generator
  rejects hardcoded fills, since they would defeat the `fill` prop)
- no background `<rect>`
- built only from `<path>`, `<circle>`, or `<g>` elements

Save it to `vendor/logos/<icon>.svg`.

### 3. Compute its checksum

```bash
node -e "import('./scripts/collections.js').then(async m=>console.log(await m.checksum(require('fs').readFileSync('vendor/logos/<icon>.svg','utf8'))))"
```

### 4. Add the manifest entry

Use the `vendored` collection, which has no default license, so the entry must
declare its own:

```js
{
    icon: "<icon>",
    collection: "vendored",
    slug: "<kebab-case file name>",
    component: "<PascalCase>Logo",
    label: "<Brand Name>",
    url: "<official brand/trademark page>",
    artwork: {
        version: "<version or date of the source>",
        source: "<exact URL the artwork came from>",
        license: "<SPDX identifier>",
        sha256: "<checksum from step 3>",
    },
},
```

If the artwork comes from a different npm icon package that you want to track
over time, add a proper collection with a `load` function to
`scripts/collections.js` instead of pinning — see how `simple-icons` does it.
That gives you real updates rather than a frozen file.

### 5. Build and verify

```bash
npm run update:vendor && npm run build && npm test
```

Then render the new SVG at 40px alongside the others and confirm it matches the
set's visual weight. Marks drawn by different projects often differ in optical
size even at the same viewBox.

### 6. Record it

Update the pinned-artwork table in `NOTICE.md` with the logo, its license, and
why it is vendored rather than fetched.

## Removing a logo

Delete its manifest entry and run `npm run update:vendor && npm run build`. The
orphaned file under `vendor/logos/` is pruned automatically. Also drop any
mention of it from `NOTICE.md`.

## Trademark check

Inclusion is a judgment call, not just a licensing one. The artwork license
never grants rights to the mark. Before adding a brand, consider whether it has
objected to inclusion in icon sets — Amazon, CodePen, Eventbrite, and LinkedIn
were all removed from simple-icons for that reason. If it has, raise it rather
than adding it silently.
