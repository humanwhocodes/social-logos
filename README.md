# @humanwhocodes/social-logos

by [Nicholas C. Zakas](https://humanwhocodes.com)

Social media logos as standalone SVG files and tree-shakeable React components.

- **49 logos** ([full list](./LOGOS.md))
- **Raw SVG files** under the `/svg` entrypoint, with no baked-in dimensions
- **React components** from the main entrypoint, one module per logo so bundlers
  drop the ones you don't use
- **`currentColor` by default**, no background fill, ESM-only, TypeScript
  types included
- **Apache-2.0**, no runtime dependencies

The SVG files and the React components are both generated from the same vendored
artwork, so the two can never drift apart.

## Installation

```bash
npm install @humanwhocodes/social-logos
```

React is an optional peer dependency, needed only for the component entrypoint.

## Usage

### React components

Import just the logos you need:

```jsx
import { GitHubLogo, MastodonLogo, RssFeedLogo } from "@humanwhocodes/social-logos";

export function Footer() {
	return (
		<footer>
			<a href="https://github.com/humanwhocodes">
				<GitHubLogo size={24} alt="GitHub" />
			</a>
			<a href="https://mastodon.social/@slicknet">
				<MastodonLogo size={24} alt="Mastodon" />
			</a>
			<a href="/feed.xml">
				<RssFeedLogo size={24} alt="RSS feed" />
			</a>
		</footer>
	);
}
```

Component names are the brand name in Pascal case followed by `Logo`, like
`GitHubLogo`, `WordPressLogo`, and `XLogo`. See [LOGOS.md](./LOGOS.md) for the
complete list.

#### Props

| Prop        | Type               | Default        | Description                                                 |
| ----------- | ------------------ | -------------- | ----------------------------------------------------------- |
| `size`      | `number \| string` | `"1em"`        | Sets both `width` and `height`.                             |
| `fill`      | `string`           | `currentColor` | Color of the logo.                                          |
| `className` | `string`           | —              | Class applied to the `<svg>`.                               |
| `alt`       | `string`           | —              | Accessible name, applied as `aria-label` with `role="img"`. |

Any other valid `<svg>` attribute (`onClick`, `style`, `data-*`, `id`, and so
on) is passed straight through, and is applied last so it overrides the
built-in attributes.

#### Sizing

`size` defaults to `1em`, so a logo matches the size of the text around it
without any configuration. Pass `size` to set an explicit dimension in any CSS
unit:

```jsx
<GitHubLogo />            {/* 1em — scales with font-size */}
<GitHubLogo size={24} />  {/* 24px */}
<GitHubLogo size="2rem" />
```

`size` sets `width` and `height` together. To size the axes independently, pass
`width` and `height` directly — they're applied after `size` and override it.

#### Color

Logos inherit the surrounding text color through `currentColor`, so they follow
your theme for free:

```jsx
<span style={{ color: "rebeccapurple" }}>
	<GitHubLogo size={24} />
</span>
```

Pass `fill` to override it:

```jsx
<GitHubLogo size={24} fill="#181717" />
```

#### Accessibility

Pass `alt` when the logo carries meaning on its own — it becomes an `aria-label`
with `role="img"`:

```jsx
<a href="https://github.com/humanwhocodes">
	<GitHubLogo size={24} alt="GitHub" />
</a>
```

Leave `alt` off when the logo is decorative, such as when it sits beside a text
label. The logo is then marked `aria-hidden` so screen readers don't announce it
twice:

```jsx
<a href="https://github.com/humanwhocodes">
	<GitHubLogo size={24} /> GitHub
</a>
```

### SVG files

The raw SVG files are published under the `/svg` entrypoint, with or without the
extension:

```js
import githubLogo from "@humanwhocodes/social-logos/svg/github.svg";
import githubLogo from "@humanwhocodes/social-logos/svg/github";
```

How that import behaves depends on your bundler's SVG loader — a URL with Vite's
default, a React component with SVGR, an inline string with `?raw`. The files
are plain `.svg` on disk, so you can also read them directly:

```js
import { readFileSync } from "node:fs";

const path = import.meta.resolve("@humanwhocodes/social-logos/svg/github.svg");
const svg = readFileSync(new URL(path), "utf8");
```

Unlike the React components, the SVG files carry **no `width` or `height` at
all** — just a `viewBox` and `fill="currentColor"`, so you control sizing
entirely:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="…"/></svg>
```

Every logo uses a `0 0 24 24` viewBox, so they line up with each other at any
size.

File names are the kebab-case brand name, like `github.svg`, `rss-feed.svg`, and
`stack-overflow.svg`. See [LOGOS.md](./LOGOS.md) for the complete list.

## Licensing and trademarks

This package is **Apache-2.0**, and all of the logo artwork it vendors is
**CC0-1.0** from [simple-icons](https://github.com/simple-icons/simple-icons) — a
public domain dedication with no conditions attached. There is no copyleft
anywhere in the chain.

**Neither license gives you the right to use the marks themselves.** Every logo
here is a trademark of its owner, and trademark rights are untouched by both CC0
and Apache-2.0. Most brands publish rules about color, spacing,
minimum size, and modification — and the `fill` and `size` props make those
rules easy to break by accident. [LOGOS.md](./LOGOS.md) links each brand to its
official guidelines. Read them first, and see [NOTICE.md](./NOTICE.md) for
details.

## Coverage

The brands are those listed in the
[`official_links.md`](https://github.com/Automattic/social-logos/blob/trunk/official_links.md)
inventory. Seven are absent because simple-icons no longer carries them: Amazon,
CodePen, Eventbrite, Fediverse, JSON Feed, StumbleUpon, and Xanga.

LinkedIn is included, but its artwork is pinned rather than fetched: simple-icons
published it through v13.21.0 and dropped it in v14.0.0. CC0 is irrevocable, so
the file remains freely usable; it's committed under `vendor/logos/` and a test
asserts it byte-for-byte. LinkedIn itself publishes **no vector version of its
logo at all** — both downloads on
[brand.linkedin.com](https://brand.linkedin.com/downloads) are PNG only. See
[NOTICE.md](./NOTICE.md).

## How it works

`vendor/logos/` holds the artwork and is the single source of truth for every
logo's geometry. At build time, `scripts/generate.js` reads it once and writes
both outputs:

```
vendor/logos/<icon>.svg
  ├── src/svg/<slug>.svg     published as-is under the /svg entrypoint
  └── src/logos/<slug>.tsx   compiled into the React entrypoint
```

Each generated component holds nothing but its own geometry and defers to a
shared `<Logo>` wrapper for sizing, color, and accessibility. That keeps every
logo in its own module — which is what makes the package tree-shakeable — while
defining the behavior in exactly one place. The generator rejects any artwork
with a hardcoded `fill`, since that would silently defeat the `fill` prop.

Which logos are included, what they're called, and where their official
guidelines live is defined in `scripts/manifest.js`. Nothing is generated for
artwork that isn't listed there.

### Maintenance skills

Two Claude Code skills in `.claude/skills/` cover the maintenance work. They
encode the failure modes and licensing decisions that aren't obvious from the
commands alone, so prefer them over doing it by hand.

| Skill | Use it when |
| ----- | ----------- |
| `update-social-logos` | Refreshing artwork from simple-icons, bumping the dependency, or recovering from a logo that upstream removed. |
| `add-social-logo` | Adding, replacing, or removing a brand — including logos simple-icons doesn't carry. |

Invoke one by name in Claude Code:

```
/update-social-logos
```

The sections below describe the same work manually.

### Updating the logos

```bash
npm run update:vendor   # re-vendor artwork from the simple-icons devDependency
npm run build           # regenerate SVG files and components
npm test
```

Review the diff under `vendor/` before committing. `vendor/provenance.json`
records, for each mark, the collection it came from, the version and license of
that artwork, and the URL it was sourced from.

`update:vendor` is transactional: it resolves and validates everything before
writing, so a failure leaves `vendor/` untouched. That matters because pinned
artwork can't be re-fetched if it's lost. It also prunes files whose manifest
entries have been deleted.

To add a logo, add an entry to `scripts/manifest.js` naming an `icon` and a
`collection` from `scripts/collections.js`, then re-vendor and rebuild. See the
`add-social-logo` skill, which walks through the licensing checks for artwork
that simple-icons doesn't carry.

### Pinned artwork

Most logos are fetched from the `simple-icons` devDependency. A logo that
upstream has dropped — or that never existed there — is *pinned* instead: its
file is committed under `vendor/logos/` and its manifest entry carries an
`artwork` block recording the version, source, license, and a SHA-256 checksum.

Because nothing can re-fetch pinned artwork to check it, the checksum is the
only thing guarding it. Both `update:vendor` and the test suite verify it, so a
stray edit fails loudly instead of shipping. Version and license live on the
entry rather than the collection, since logos are removed upstream at different
times and hand-vendored artwork can carry different terms.

## Development

```bash
npm install
npm run build   # generate, then compile
npm test        # builds first, then runs the test suite
```

`src/svg/`, `src/logos/`, `src/index.ts`, and `dist/` are generated and are not
committed. `vendor/` **is** committed — it's the artwork source of truth — and so
is `LOGOS.md` (generated, but the README links to it).

The published package contains only `dist/` and `src/svg/`, which are what the
two entrypoints resolve to.

## License

Apache-2.0. See [LICENSE](./LICENSE) and [NOTICE.md](./NOTICE.md).
