/**
 * @fileoverview Internal base component shared by every generated logo.
 *
 * Keeping the `<svg>` wrapper here means the generated components contain
 * nothing but the logo geometry, so there's exactly one place where sizing,
 * color, and accessibility behavior are defined.
 */

import type { ReactNode } from "react";
import type { LogoProps } from "./types.js";

export interface LogoBaseProps extends LogoProps {
	/** The `viewBox` of the underlying SVG. */
	viewBox: string;

	/** The geometry of the logo. */
	children: ReactNode;
}

/**
 * Renders the `<svg>` wrapper around a logo's geometry.
 * @param props Props for the logo.
 * @returns The rendered logo.
 */
export function Logo({
	viewBox,
	size = "1em",
	alt,
	fill = "currentColor",
	children,
	...rest
}: LogoBaseProps) {
	// A logo without an accessible name is decorative, so hide it entirely.
	const a11y = alt
		? { role: "img", "aria-label": alt }
		: { "aria-hidden": true, focusable: false };

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox={viewBox}
			fill={fill}
			width={size}
			height={size}
			{...a11y}
			{...rest}
		>
			{children}
		</svg>
	);
}
