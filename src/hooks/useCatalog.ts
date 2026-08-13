import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CatalogCourse, CatalogModule, CatalogProduct } from "@/integrations/supabase/types";
import { BUNDLE, COURSES, EBOOK, type CatalogEntry } from "@/content/catalog";

/**
 * Catalog reads.
 *
 * Every hook falls back to the static content in src/content/catalog.ts when
 * the backend is absent or erroring. The sales pages are marketing surfaces:
 * they must render for a signed-out visitor even if the database is down.
 * Pricing shown is therefore best-effort-live, authoritative-at-checkout —
 * create-checkout always reprices server-side from the products table.
 */

const FALLBACK_PRODUCTS: CatalogProduct[] = [
  ...COURSES.map((course, index) => ({
    id: `fallback-${course.productSlug}`,
    slug: course.productSlug,
    title: course.title,
    subtitle: course.subtitle,
    type: course.type,
    price_cents: course.priceCents,
    sort: index + 1,
  })),
  {
    id: `fallback-${BUNDLE.productSlug}`,
    slug: BUNDLE.productSlug,
    title: BUNDLE.title,
    subtitle: BUNDLE.subtitle,
    type: BUNDLE.type,
    price_cents: BUNDLE.priceCents,
    sort: 4,
  },
  {
    id: `fallback-${EBOOK.productSlug}`,
    slug: EBOOK.productSlug,
    title: EBOOK.title,
    subtitle: EBOOK.subtitle,
    type: EBOOK.type,
    price_cents: EBOOK.priceCents,
    sort: 5,
  },
];

export function useProducts() {
  return useQuery({
    queryKey: ["catalog", "products"],
    queryFn: async (): Promise<CatalogProduct[]> => {
      if (!supabase) return FALLBACK_PRODUCTS;
      const { data, error } = await supabase
        .from("catalog_products")
        .select("*")
        .order("sort", { ascending: true });
      if (error || !data?.length) return FALLBACK_PRODUCTS;
      return data as CatalogProduct[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(slug: string | undefined) {
  const { data: products, ...rest } = useProducts();
  return { ...rest, data: products?.find((product) => product.slug === slug) };
}

export function useCourse(slug: string | undefined) {
  return useQuery({
    queryKey: ["catalog", "course", slug],
    enabled: Boolean(slug),
    queryFn: async (): Promise<CatalogCourse | null> => {
      if (!supabase || !slug) return null;
      const { data, error } = await supabase
        .from("catalog_courses")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) return null;
      return (data as CatalogCourse) ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCourses() {
  return useQuery({
    queryKey: ["catalog", "courses"],
    queryFn: async (): Promise<CatalogCourse[]> => {
      if (!supabase) return [];
      const { data, error } = await supabase.from("catalog_courses").select("*");
      if (error) return [];
      return (data as CatalogCourse[]) ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useModules(courseId: string | undefined) {
  return useQuery({
    queryKey: ["catalog", "modules", courseId],
    enabled: Boolean(courseId),
    queryFn: async (): Promise<CatalogModule[]> => {
      if (!supabase || !courseId) return [];
      const { data, error } = await supabase
        .from("catalog_modules")
        .select("*")
        .eq("course_id", courseId)
        .order("sort", { ascending: true });
      if (error) return [];
      return (data as CatalogModule[]) ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Curriculum for a sales page: live module rows when they exist, otherwise the
 * static copy. Shape is identical either way so the accordion does not care.
 */
export function useCurriculum(content: CatalogEntry | undefined, courseId: string | undefined) {
  const { data: liveModules } = useModules(courseId);
  if (liveModules?.length) {
    return liveModules.map((module) => ({
      id: module.id,
      sort: module.sort,
      title: module.title,
      summary: module.summary ?? "",
      durationSeconds: module.duration_seconds,
    }));
  }
  return (content?.modules ?? []).map((module) => ({
    id: `${content?.slug}-${module.sort}`,
    sort: module.sort,
    title: module.title,
    summary: module.summary,
    durationSeconds: module.durationSeconds,
  }));
}
