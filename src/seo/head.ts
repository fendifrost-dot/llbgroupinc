/**
 * Turns a RouteMeta into concrete <head> tags. Pure: used by the runtime
 * <Seo /> component (as DOM nodes) and by the build plugin (as HTML).
 */

import { ORGANIZATION, SITE_NAME } from "../content/site";
import { abs, type RouteMeta } from "./routes";

export interface HeadTag {
  tag: "title" | "meta" | "link" | "script";
  attrs?: Record<string, string>;
  text?: string;
}

export function headTags(meta: RouteMeta, origin: string): HeadTag[] {
  const url = abs(origin, meta.path);
  const image = abs(origin, meta.image.path);
  const robots = meta.noindex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  const tags: HeadTag[] = [
    { tag: "title", text: meta.title },
    { tag: "meta", attrs: { name: "description", content: meta.description } },
    { tag: "meta", attrs: { name: "robots", content: robots } },
    { tag: "link", attrs: { rel: "canonical", href: url } },
    { tag: "meta", attrs: { property: "og:site_name", content: SITE_NAME } },
    { tag: "meta", attrs: { property: "og:type", content: meta.ogType } },
    { tag: "meta", attrs: { property: "og:url", content: url } },
    { tag: "meta", attrs: { property: "og:title", content: meta.title } },
    { tag: "meta", attrs: { property: "og:description", content: meta.description } },
    { tag: "meta", attrs: { property: "og:image", content: image } },
    { tag: "meta", attrs: { property: "og:image:width", content: String(meta.image.width) } },
    { tag: "meta", attrs: { property: "og:image:height", content: String(meta.image.height) } },
    { tag: "meta", attrs: { property: "og:image:alt", content: meta.image.alt } },
    { tag: "meta", attrs: { property: "og:locale", content: "en_US" } },
    { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
    { tag: "meta", attrs: { name: "twitter:title", content: meta.title } },
    { tag: "meta", attrs: { name: "twitter:description", content: meta.description } },
    { tag: "meta", attrs: { name: "twitter:image", content: image } },
    { tag: "meta", attrs: { name: "twitter:image:alt", content: meta.image.alt } },
    { tag: "meta", attrs: { name: "author", content: ORGANIZATION.name } },
  ];

  for (const node of meta.jsonLd(origin)) {
    tags.push({
      tag: "script",
      attrs: { type: "application/ld+json" },
      // "</" inside a <script> would end the element early.
      text: JSON.stringify(node).replace(/<\//g, "<\\/"),
    });
  }

  return tags;
}

const escapeAttr = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escapeText = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;");

/** Serialize the tags as HTML. Every tag carries data-seo so the runtime can replace it. */
export function renderHeadTags(meta: RouteMeta, origin: string): string {
  return headTags(meta, origin)
    .map((tag) => {
      const attrs = Object.entries({ ...tag.attrs, "data-seo": "" })
        .map(([key, value]) => (value === "" ? key : `${key}="${escapeAttr(value)}"`))
        .join(" ");
      if (tag.tag === "title") return `<title ${attrs}>${escapeText(tag.text ?? "")}</title>`;
      if (tag.tag === "script") return `<script ${attrs}>${tag.text ?? ""}</script>`;
      return `<${tag.tag} ${attrs} />`;
    })
    .join("\n    ");
}
