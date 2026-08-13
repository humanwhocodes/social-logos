/**
 * @fileoverview Public prop types shared by every logo component.
 */

import type { SVGProps } from "react";

/**
 * Props accepted by every logo component.
 *
 * Any other valid `<svg>` attribute is passed straight through, and is applied
 * after the built-in attributes so it always wins.
 */
export interface LogoProps
	extends Omit<SVGProps<SVGSVGElement>, "children" | "ref"> {
	/**
	 * Sets both `width` and `height` on the `<svg>` element. Defaults to `1em`,
	 * so the logo scales with the surrounding font size.
	 */
	size?: number | string;

	/**
	 * Accessible name for the logo, applied as `aria-label` alongside
	 * `role="img"`. When omitted, the logo is treated as decorative and hidden
	 * from assistive technology with `aria-hidden`.
	 */
	alt?: string;

	/**
	 * Color of the logo. Defaults to `currentColor` so the logo inherits the
	 * surrounding text color.
	 */
	fill?: string;

	/**
	 * Class name applied to the `<svg>` element.
	 */
	className?: string;
}
