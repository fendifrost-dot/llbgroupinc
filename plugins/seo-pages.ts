/**
 * Vite build plugin: static SEO output for a single-page app.
 *
 * After the client bundle is written it:
 *  1. rewrites dist/index.html's <head> block for the home page,
 *  2. writes dist/<route>/index.html for every other public route with that
 *     route's title, description, canonical, Open Graph tags, JSON-LD and a
 *     <noscript> summary, so crawlers that do not run JavaScript still see
 *     the page's content, and
 *  3. writes sitemap.xml, robots.txt and llms.txt.
 *
 * Hosts that serve a directory's index.html for a clean URL will hand the
 * route-specific shell to crawlers; hosts that fall back to the root
 * index.html for every path lose nothing, because <Seo /> applies the same
 * tags at runtime. Absolute URLs use VITE_SITE_URL when it is set, otherwise
 * the Lovable preview origin.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Plugin, ResolvedConfig } from "vite";
import { DEFAULT_ORIGIN } from "../src/content/site";
import { renderHeadTags } from "../src/seo/head";
import { PUBLIC_ROUTES, type RouteMeta } from "../src/seo/routes";
import { renderLlmsTxt, renderRobots, renderSitemap } from "../src/seo/static";

const START = "<!-- seo:start -->";
const END = "<!-- seo:end -->";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function noscript(meta: RouteMeta): string {
  const links = PUBLIC_ROUTES.filter((route) => route.path !== meta.path)
    .map((route) => `<li><a href="${route.path}">${escapeHtml(route.title)}</a></li>`)
    .join("");
  return [
    "<noscript>",
    `<h1>${escapeHtml(meta.title)}</h1>`,
    `<p>${escapeHtml(meta.description)}</p>`,
    ...meta.summary.map((line) => `<p>${escapeHtml(line)}</p>`),
    `<ul>${links}</ul>`,
    "</noscript>",
  ].join("");
}

export function seoPages(options: { origin?: string } = {}): Plugin {
  let config: ResolvedConfig;
  return {
    name: "llb-seo-pages",
    apply: "build",
    configResolved(resolved) {
      config = resolved;
    },
    closeBundle() {
      const outDir = config.build.outDir;
      const origin = (options.origin ?? DEFAULT_ORIGIN).replace(/\/$/, "");
      const template = readFileSync(join(outDir, "index.html"), "utf8");
      const start = template.indexOf(START);
      const end = template.indexOf(END);
      if (start === -1 || end === -1) {
        this.warn("index.html has no <!-- seo:start --> / <!-- seo:end --> markers; skipping static SEO pages");
        return;
      }

      const shell = (meta: RouteMeta) =>
        template.slice(0, start) +
        renderHeadTags(meta, origin) +
        template.slice(end + END.length).replace("</body>", `${noscript(meta)}</body>`);

      for (const route of PUBLIC_ROUTES) {
        const dir = route.path === "/" ? outDir : join(outDir, route.path.slice(1));
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, "index.html"), shell(route));
      }

      const today = new Date().toISOString().slice(0, 10);
      writeFileSync(join(outDir, "sitemap.xml"), renderSitemap(origin, today));
      writeFileSync(join(outDir, "robots.txt"), renderRobots(origin));
      writeFileSync(join(outDir, "llms.txt"), renderLlmsTxt(origin));
      config.logger.info(`[seo] wrote ${PUBLIC_ROUTES.length} route shells, sitemap.xml, robots.txt, llms.txt for ${origin}`);
    },
  };
}
