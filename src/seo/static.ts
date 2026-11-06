/**
 * Static crawler files written into dist/ by plugins/seo-pages.ts:
 * sitemap.xml, robots.txt and llms.txt. Pure string builders.
 */

import { INSTRUCTOR } from "../content/catalog";
import { MAIN_SITE, MAIN_SITE_BOOK, ORGANIZATION, SITE_NAME } from "../content/site";
import { PUBLIC_ROUTES, abs } from "./routes";

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function renderSitemap(origin: string, lastmod: string): string {
  const urls = PUBLIC_ROUTES.map((route) => {
    const priority = route.path === "/" ? "1.0" : route.path.startsWith("/courses") ? "0.9" : route.path === "/shop" ? "0.8" : "0.3";
    const changefreq = route.path === "/privacy" || route.path === "/terms" ? "yearly" : "monthly";
    return [
      "  <url>",
      `    <loc>${escapeXml(abs(origin, route.path))}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      `    <image:image>`,
      `      <image:loc>${escapeXml(abs(origin, route.image.path))}</image:loc>`,
      `      <image:title>${escapeXml(route.image.alt)}</image:title>`,
      `    </image:image>`,
      "  </url>",
    ].join("\n");
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}

/**
 * Search engines, social previews and AI crawlers are all welcome on the
 * public pages. Student, account and checkout pages are excluded; they are
 * also noindex, so this is a courtesy rather than the control.
 */
export function renderRobots(origin: string): string {
  const disallow = ["/account", "/learn", "/checkout/", "/signin"];
  const agents = [
    "*",
    "Googlebot",
    "Bingbot",
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-SearchBot",
    "Claude-User",
    "anthropic-ai",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot",
    "Applebot-Extended",
    "DuckAssistBot",
    "Amazonbot",
    "meta-externalagent",
    "Bytespider",
    "CCBot",
    "cohere-ai",
    "YouBot",
    "Twitterbot",
    "facebookexternalhit",
    "LinkedInBot",
  ];
  const blocks = agents.map((agent) =>
    [`User-agent: ${agent}`, "Allow: /", ...disallow.map((path) => `Disallow: ${path}`)].join("\n"),
  );
  return [...blocks, `Sitemap: ${abs(origin, "/sitemap.xml")}`, ""].join("\n\n");
}

/** https://llmstxt.org: a plain-language guide for language models. */
export function renderLlmsTxt(origin: string): string {
  const [home, ...rest] = PUBLIC_ROUTES;
  const pages = rest.map((route) => `- [${route.title.replace(` | ${SITE_NAME}`, "")}](${abs(origin, route.path)}): ${route.description}`);
  return [
    `# ${SITE_NAME}`,
    "",
    `> ${home.description}`,
    "",
    `${SITE_NAME} (learn.) is the self-paced learning platform of ${ORGANIZATION.name}, ${ORGANIZATION.streetAddress}, ${ORGANIZATION.addressLocality}, ${ORGANIZATION.addressRegion} ${ORGANIZATION.postalCode}. The programs are taught by ${INSTRUCTOR.name}, ${INSTRUCTOR.role.replace(/\.$/, "")}. Each program is six modules of video and audio instruction with a companion workbook and lifetime access; enrollment is a one-time payment. ${ORGANIZATION.shortName}'s speaking, consulting, coaching and booking live on the main site, ${MAIN_SITE}; enquiries go to ${MAIN_SITE_BOOK}.`,
    "",
    "## Pages",
    "",
    ...pages,
    "",
    "## Programs in detail",
    "",
    ...home.summary.map((line) => `- ${line}`),
    "",
    "## Optional",
    "",
    `- [LLB Group main site](${MAIN_SITE}): speaking, workshops, consulting and booking.`,
    `- [Sitemap](${abs(origin, "/sitemap.xml")})`,
    "",
  ].join("\n");
}
