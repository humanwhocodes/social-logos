# Notices

## Package

Copyright Nicholas C. Zakas

Licensed under the Apache License, Version 2.0. See [LICENSE](./LICENSE).

The Apache-2.0 license covers **this package's own work**: the build scripts,
the React wrapper, the type definitions, and the tests. It does not, and cannot,
grant you rights to the brand marks themselves — see Trademarks below.

## Logo artwork

All artwork comes from [simple-icons](https://github.com/simple-icons/simple-icons),
released under [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/),
a public domain dedication that imposes no conditions on reuse. simple-icons
sources each mark from the brand's own materials and records the URL it used.

The artwork is vendored under `vendor/logos/` rather than fetched at build time,
so builds are reproducible and any change to a mark appears as a reviewable
diff. [`vendor/provenance.json`](./vendor/provenance.json) records, for every
logo, which collection it came from, that collection's version and license, and
the URL the artwork was originally sourced from.

`simple-icons` is a devDependency used only by `npm run update:vendor`. This
package has no runtime dependencies, and the collection is not redistributed —
only the individual marks listed in `scripts/manifest.js`.

### Pinned artwork

One mark is pinned rather than fetched from the installed package:

| Logo     | License  | Source                            |
| -------- | -------- | --------------------------------- |
| LinkedIn | CC0-1.0  | simple-icons v13.21.0, removed in v14.0.0 |

CC0 is an irrevocable dedication, so artwork released under it stays freely
usable after the collection stops shipping it. The file is committed under
`vendor/logos/` and left untouched by `npm run update:vendor`.

Each pinned entry records its own version, source, license, and SHA-256
checksum in `scripts/manifest.js` — per entry rather than per collection,
because logos are removed upstream at different times and hand-vendored artwork
can carry different terms. Both the vendoring script and the test suite verify
the checksum, so pinned artwork cannot drift unnoticed.

LinkedIn is pinned rather than re-sourced because **LinkedIn publishes no vector
version of its logo.** Both downloads on
[brand.linkedin.com](https://brand.linkedin.com/downloads) — `in-logo.zip` and
`linkedin-logo.zip` — contain PNG files only.

LinkedIn was removed from simple-icons following a request from LinkedIn. Its
inclusion here is a deliberate choice, and the trademark caveats below apply with
particular force.

## Trademarks

**Every logo in this package is a trademark of its respective owner, and no
license in this repository grants you any right to use those marks.** CC0 covers
the drawings; it says nothing about trademark. Apache-2.0 covers this package's
code; it says nothing about trademark either. Trademark rights are held by the
brand owners and are unaffected by both.

Most brands publish rules governing color, spacing, minimum size, and
modification. This package's `fill` and `size` props make those rules easy to
break by accident. [`LOGOS.md`](./LOGOS.md) links every brand to its official
guidelines. **Review them before using a mark.**

## Coverage

The brands covered are those listed in
[`official_links.md`](https://github.com/Automattic/social-logos/blob/trunk/official_links.md).
Seven are not included, because simple-icons no longer carries them: Amazon,
CodePen, Eventbrite, Fediverse, JSON Feed, StumbleUpon, and Xanga. Several were
removed following objections from the brand owners, so their absence is
deliberate rather than an oversight.
