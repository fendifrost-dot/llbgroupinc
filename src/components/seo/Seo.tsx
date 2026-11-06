import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { headTags } from "@/seo/head";
import { getRouteMeta } from "@/seo/routes";

/**
 * Keeps the document head in step with the route: title, description,
 * canonical, Open Graph, Twitter and JSON-LD. The canonical origin is the one
 * the page is actually served from, so nothing changes at the domain switch.
 *
 * The build also writes these tags statically into each route's HTML shell
 * (plugins/seo-pages.ts); this component replaces those on navigation.
 */
export function Seo() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const meta = getRouteMeta(pathname);
    const origin = window.location.origin;
    const head = document.head;

    head.querySelectorAll("[data-seo]").forEach((node) => node.remove());

    for (const tag of headTags(meta, origin)) {
      if (tag.tag === "title") {
        document.title = tag.text ?? "";
        continue;
      }
      const element = document.createElement(tag.tag);
      for (const [key, value] of Object.entries(tag.attrs ?? {})) element.setAttribute(key, value);
      if (tag.text) element.textContent = tag.text;
      element.setAttribute("data-seo", "");
      head.appendChild(element);
    }
  }, [pathname]);

  return null;
}
