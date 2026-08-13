/**
 * @fileoverview The canonical list of logos included in this package.
 *
 * Every entry corresponds to a brand listed in the upstream `official_links.md`:
 * https://github.com/Automattic/social-logos/blob/trunk/official_links.md
 *
 * - `icon` is the artwork name within its collection, and the file name used
 *   under `vendor/logos/`.
 * - `collection` is where the artwork comes from. See `scripts/collections.js`.
 * - `artwork` is required for pinned collections and omitted otherwise. It
 *   records the version the artwork came from, where it came from, its license
 *   when the collection has no single one, and a checksum of the committed file.
 * - `slug` is the file name used under `src/svg/` (and under `src/logos/`).
 * - `component` is the exported React component name.
 * - `label` is the human-readable brand name.
 * - `url` is the brand's official logo and trademark page.
 *
 * To drop a logo, delete its entry and rebuild. To add one, add an entry whose
 * `icon` exists in the named collection, then run `npm run update:vendor &&
 * npm run build`.
 */

/**
 * @typedef {object} LogoEntry
 * @property {string} icon Artwork name within its collection.
 * @property {string} collection Collection the artwork comes from.
 * @property {string} slug File name (without extension) used for the SVG.
 * @property {string} component Exported React component name.
 * @property {string} label Human-readable brand name.
 * @property {string} url Official brand resource URL.
 * @property {ArtworkInfo} [artwork] Required for pinned collections.
 */

/**
 * @typedef {object} ArtworkInfo
 * @property {string} version Version of the source the artwork came from.
 * @property {string} [source] Where the artwork came from. Defaults to the
 *   collection's URL.
 * @property {string} [license] SPDX identifier. Defaults to the collection's.
 * @property {string} sha256 Checksum of the committed file, with line endings
 *   normalized and surrounding whitespace trimmed.
 */

/** @type {LogoEntry[]} */
export const logos = [
	{
		icon: "behance",
		collection: "simple-icons",
		slug: "behance",
		component: "BehanceLogo",
		label: "Behance",
		url: "https://www.behance.net/",
	},
	{
		icon: "blogger",
		collection: "simple-icons",
		slug: "blogger",
		component: "BloggerLogo",
		label: "Blogger",
		url: "https://about.google/brand-resource-center/",
	},
	{
		icon: "bluesky",
		collection: "simple-icons",
		slug: "bluesky",
		component: "BlueskyLogo",
		label: "Bluesky",
		url: "https://bsky.social/about/blog/press-faq",
	},
	{
		icon: "deezer",
		collection: "simple-icons",
		slug: "deezer",
		component: "DeezerLogo",
		label: "Deezer",
		url: "https://deezerbrand.com/",
	},
	{
		icon: "digg",
		collection: "simple-icons",
		slug: "digg",
		component: "DiggLogo",
		label: "Digg",
		url: "https://digg.com/",
	},
	{
		icon: "discord",
		collection: "simple-icons",
		slug: "discord",
		component: "DiscordLogo",
		label: "Discord",
		url: "https://discord.com/branding",
	},
	{
		icon: "dribbble",
		collection: "simple-icons",
		slug: "dribbble",
		component: "DribbbleLogo",
		label: "Dribbble",
		url: "https://dribbble.com/",
	},
	{
		icon: "dropbox",
		collection: "simple-icons",
		slug: "dropbox",
		component: "DropboxLogo",
		label: "Dropbox",
		url: "https://www.dropbox.com/branding",
	},
	{
		icon: "facebook",
		collection: "simple-icons",
		slug: "facebook",
		component: "FacebookLogo",
		label: "Facebook",
		url: "https://about.meta.com/brand/resources/",
	},
	{
		icon: "rss",
		collection: "simple-icons",
		slug: "rss-feed",
		component: "RssFeedLogo",
		label: "RSS feed",
		url: "https://www.rssboard.org/rss-specification",
	},
	{
		icon: "flickr",
		collection: "simple-icons",
		slug: "flickr",
		component: "FlickrLogo",
		label: "Flickr",
		url: "https://www.flickrhelp.com/hc/en-us/articles/4404071066260-Brand-guidelines",
	},
	{
		icon: "foursquare",
		collection: "simple-icons",
		slug: "foursquare",
		component: "FoursquareLogo",
		label: "Foursquare",
		url: "https://foursquare.com/legal/trademark",
	},
	{
		icon: "ghost",
		collection: "simple-icons",
		slug: "ghost",
		component: "GhostLogo",
		label: "Ghost",
		url: "https://ghost.org/docs/logos/",
	},
	{
		icon: "git",
		collection: "simple-icons",
		slug: "git",
		component: "GitLogo",
		label: "Git",
		url: "https://git-scm.com/downloads/logos",
	},
	{
		icon: "github",
		collection: "simple-icons",
		slug: "github",
		component: "GitHubLogo",
		label: "GitHub",
		url: "https://github.com/logos",
	},
	{
		icon: "google",
		collection: "simple-icons",
		slug: "google",
		component: "GoogleLogo",
		label: "Google",
		url: "https://about.google/brand-resource-center/",
	},
	{
		icon: "instagram",
		collection: "simple-icons",
		slug: "instagram",
		component: "InstagramLogo",
		label: "Instagram",
		url: "https://about.meta.com/brand/resources/",
	},
	{
		icon: "line",
		collection: "simple-icons",
		slug: "line",
		component: "LineLogo",
		label: "LINE",
		url: "https://line.me/en/logo",
	},
	{
		icon: "linkedin",
		collection: "simple-icons-archived",
		slug: "linkedin",
		component: "LinkedInLogo",
		label: "LinkedIn",
		url: "https://brand.linkedin.com/",
		artwork: {
			version: "13.21.0",
			source:
				"https://github.com/simple-icons/simple-icons/blob/13.21.0/icons/linkedin.svg",
			sha256:
				"2687ac468d96bd03e748dc8646ef6465cb4cc7f34b96e1d0bc86fcb3dd79121a",
		},
	},
	{
		icon: "mastodon",
		collection: "simple-icons",
		slug: "mastodon",
		component: "MastodonLogo",
		label: "Mastodon",
		url: "https://joinmastodon.org/branding",
	},
	{
		icon: "medium",
		collection: "simple-icons",
		slug: "medium",
		component: "MediumLogo",
		label: "Medium",
		url: "https://medium.design/logos-and-brand-guidelines-f1a01a733592",
	},
	{
		icon: "messenger",
		collection: "simple-icons",
		slug: "messenger",
		component: "MessengerLogo",
		label: "Messenger",
		url: "https://about.meta.com/brand/resources/",
	},
	{
		icon: "microdotblog",
		collection: "simple-icons",
		slug: "micro-blog",
		component: "MicroBlogLogo",
		label: "Micro.blog",
		url: "https://micro.blog/",
	},
	{
		icon: "nextdoor",
		collection: "simple-icons",
		slug: "nextdoor",
		component: "NextdoorLogo",
		label: "Nextdoor",
		url: "https://about.nextdoor.com/nextdoor-brand-use-guidelines/",
	},
	{
		icon: "patreon",
		collection: "simple-icons",
		slug: "patreon",
		component: "PatreonLogo",
		label: "Patreon",
		url: "https://www.patreon.com/brand",
	},
	{
		icon: "pinterest",
		collection: "simple-icons",
		slug: "pinterest",
		component: "PinterestLogo",
		label: "Pinterest",
		url: "https://business.pinterest.com/brand-guidelines/",
	},
	{
		icon: "quora",
		collection: "simple-icons",
		slug: "quora",
		component: "QuoraLogo",
		label: "Quora",
		url: "https://www.quora.com/",
	},
	{
		icon: "reddit",
		collection: "simple-icons",
		slug: "reddit",
		component: "RedditLogo",
		label: "Reddit",
		url: "https://www.redditinc.com/brand",
	},
	{
		icon: "snapchat",
		collection: "simple-icons",
		slug: "snapchat",
		component: "SnapchatLogo",
		label: "Snapchat",
		url: "https://snap.com/brand-guidelines",
	},
	{
		icon: "soundcloud",
		collection: "simple-icons",
		slug: "soundcloud",
		component: "SoundCloudLogo",
		label: "SoundCloud",
		url: "https://soundcloud.com/",
	},
	{
		icon: "spotify",
		collection: "simple-icons",
		slug: "spotify",
		component: "SpotifyLogo",
		label: "Spotify",
		url: "https://developer.spotify.com/documentation/design",
	},
	{
		icon: "squarespace",
		collection: "simple-icons",
		slug: "squarespace",
		component: "SquarespaceLogo",
		label: "Squarespace",
		url: "https://www.squarespace.com/brand-guidelines",
	},
	{
		icon: "stackexchange",
		collection: "simple-icons",
		slug: "stack-exchange",
		component: "StackExchangeLogo",
		label: "Stack Exchange",
		url: "https://policies.stackoverflow.co/company/trademark-guidance/",
	},
	{
		icon: "stackoverflow",
		collection: "simple-icons",
		slug: "stack-overflow",
		component: "StackOverflowLogo",
		label: "Stack Overflow",
		url: "https://policies.stackoverflow.co/company/trademark-guidance/",
	},
	{
		icon: "substack",
		collection: "simple-icons",
		slug: "substack",
		component: "SubstackLogo",
		label: "Substack",
		url: "https://substack.com/brand",
	},
	{
		icon: "telegram",
		collection: "simple-icons",
		slug: "telegram",
		component: "TelegramLogo",
		label: "Telegram",
		url: "https://telegram.org/",
	},
	{
		icon: "threads",
		collection: "simple-icons",
		slug: "threads",
		component: "ThreadsLogo",
		label: "Threads",
		url: "https://about.meta.com/brand/resources/",
	},
	{
		icon: "tiktok",
		collection: "simple-icons",
		slug: "tiktok",
		component: "TikTokLogo",
		label: "TikTok",
		url: "https://tiktokbrandbook.com/d/HhXfjVK1Poj9/brand-guidelines",
	},
	{
		icon: "tripadvisor",
		collection: "simple-icons",
		slug: "tripadvisor",
		component: "TripadvisorLogo",
		label: "Tripadvisor",
		url: "https://tripadvisor.mediaroom.com/logo-guidelines",
	},
	{
		icon: "tumblr",
		collection: "simple-icons",
		slug: "tumblr",
		component: "TumblrLogo",
		label: "Tumblr",
		url: "https://www.tumblr.com/logo",
	},
	{
		icon: "twitch",
		collection: "simple-icons",
		slug: "twitch",
		component: "TwitchLogo",
		label: "Twitch",
		url: "https://brand.twitch.com/",
	},
	{
		icon: "untappd",
		collection: "simple-icons",
		slug: "untappd",
		component: "UntappdLogo",
		label: "Untappd",
		url: "https://untappd.com/",
	},
	{
		icon: "vimeo",
		collection: "simple-icons",
		slug: "vimeo",
		component: "VimeoLogo",
		label: "Vimeo",
		url: "https://vimeo.com/",
	},
	{
		icon: "vk",
		collection: "simple-icons",
		slug: "vk",
		component: "VkLogo",
		label: "VK",
		url: "https://vk.company/en/press/identity/",
	},
	{
		icon: "whatsapp",
		collection: "simple-icons",
		slug: "whatsapp",
		component: "WhatsAppLogo",
		label: "WhatsApp",
		url: "https://about.meta.com/brand/resources/",
	},
	{
		icon: "woocommerce",
		collection: "simple-icons",
		slug: "woocommerce",
		component: "WooCommerceLogo",
		label: "WooCommerce",
		url: "https://woocommerce.com/brand-and-logo-guidelines/",
	},
	{
		icon: "wordpress",
		collection: "simple-icons",
		slug: "wordpress",
		component: "WordPressLogo",
		label: "WordPress",
		url: "https://wordpress.org/about/logos/",
	},
	{
		icon: "x",
		collection: "simple-icons",
		slug: "x",
		component: "XLogo",
		label: "X",
		url: "https://about.x.com/en/who-we-are/brand-toolkit",
	},
	{
		icon: "youtube",
		collection: "simple-icons",
		slug: "youtube",
		component: "YouTubeLogo",
		label: "YouTube",
		url: "https://about.google/brand-resource-center/",
	},
];
