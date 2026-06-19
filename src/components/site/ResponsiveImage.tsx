import type { ImgHTMLAttributes } from "react";
import { RESPONSIVE_WIDTHS } from "@/lib/cms";

/**
 * Renders an <img> with a srcset/sizes pair when `src` follows the
 * cropped-variant pattern produced by uploadResponsiveVariants:
 *
 *   .../cms-media/<folder>/responsive/<uuid>/w{N}.jpg
 *
 * The smaller sibling widths (480 / 768 / 1200) are derived by URL
 * substitution — no extra network calls are needed. URLs that don't
 * match the pattern (legacy uploads, external URLs, defaults) render
 * unchanged.
 */
const VARIANT_RE = /\/responsive\/([^/]+)\/w(\d+)\.jpg(\?.*)?$/;

export type ResponsiveImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** Sizes attribute — defaults to full viewport width. */
  sizes?: string;
};

export function ResponsiveImage({ src, sizes = "100vw", ...rest }: ResponsiveImageProps) {
  if (!src || typeof src !== "string") {
    return <img src={src} {...rest} />;
  }
  const match = src.match(VARIANT_RE);
  if (!match) {
    return <img src={src} {...rest} />;
  }
  const maxWidth = Number(match[2]);
  const widths = RESPONSIVE_WIDTHS.filter((w) => w <= maxWidth);
  if (widths.length <= 1) {
    return <img src={src} {...rest} />;
  }
  const srcSet = widths
    .map((w) => `${src.replace(/w\d+\.jpg/, `w${w}.jpg`)} ${w}w`)
    .join(", ");
  const largest = src.replace(/w\d+\.jpg/, `w${widths[widths.length - 1]}.jpg`);
  return <img src={largest} srcSet={srcSet} sizes={sizes} {...rest} />;
}