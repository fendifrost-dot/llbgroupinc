/**
 * This project is the learn. platform only. Everything about LLB Group
 * itself (speaking, consulting, coaching, booking) lives on the main site,
 * which Ken owns; we link out to it rather than duplicating it.
 */
export const MAIN_SITE = "https://livinglifebalancedllb.com";
export const MAIN_SITE_BOOK = `${MAIN_SITE}/book`;

/** Brand name used in page titles and structured data. */
export const SITE_NAME = "Living Life Balanced";

/**
 * The origin this build is served from, used only where an absolute URL is
 * unavoidable at build time (sitemap, robots, llms.txt, the static <head>).
 * At runtime the canonical URL is always derived from window.location, so the
 * site is correct on whichever host serves it. Set VITE_SITE_URL in the
 * Lovable environment once learn.livinglifebalancedllb.com is live.
 */
export const DEFAULT_ORIGIN = "https://llbgroupinc.lovable.app";

/** Legal entity behind the platform. Used in Organization structured data. */
export const ORGANIZATION = {
  name: "LLB Group, Inc.",
  shortName: "LLB Group",
  url: MAIN_SITE,
  streetAddress: "69 W. Washington Street, Suite 1240",
  addressLocality: "Chicago",
  addressRegion: "IL",
  postalCode: "60602",
  addressCountry: "US",
};
