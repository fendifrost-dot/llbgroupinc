import { useEffect, useState } from "react";

// Results are shared across components and pages, so an image that has
// already loaded (or already failed) is not probed again.
const cache = new Map<string, boolean>();

/**
 * True once `src` has loaded as a real image. A missing file never shows up
 * as a broken image: the static host answers unknown paths with the app's
 * index.html, which fails to decode, so it resolves to false.
 */
export function useImageAvailable(src: string | null | undefined): boolean {
  const [available, setAvailable] = useState(() => (src ? cache.get(src) ?? false : false));

  useEffect(() => {
    if (!src) {
      setAvailable(false);
      return;
    }
    const known = cache.get(src);
    if (known !== undefined) {
      setAvailable(known);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      const ok = img.naturalWidth > 0;
      cache.set(src, ok);
      if (!cancelled) setAvailable(ok);
    };
    img.onerror = () => {
      cache.set(src, false);
      if (!cancelled) setAvailable(false);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return available;
}
