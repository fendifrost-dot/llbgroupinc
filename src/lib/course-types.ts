/**
 * Row shapes for the course platform.
 *
 * These used to sit inside the generated `src/integrations/supabase/types.ts`,
 * which Lovable Cloud rewrites from the live database — and the live database
 * has no course tables yet (the schema is still migrations waiting to be
 * applied, docs/COURSE_PLATFORM_SETUP.md §2). They live here so a
 * regeneration cannot delete them again.
 *
 * Field names match the columns in `supabase/migrations/`, so switching to
 * generated types after the migrations land is a drop-in replacement.
 */

export type ProductType = "course" | "bundle" | "download";

export interface CatalogProduct {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  type: ProductType;
  price_cents: number;
  sort: number;
}

export interface CatalogCourse {
  id: string;
  product_id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  trailer_url: string | null;
  product_slug: string;
  price_cents: number;
  product_type: ProductType;
}

export interface CatalogModule {
  id: string;
  course_id: string;
  sort: number;
  title: string;
  summary: string | null;
  duration_seconds: number | null;
}

export interface Entitlement {
  id: string;
  user_id: string;
  product_id: string;
  source_purchase: string | null;
  created_at: string;
}

export interface ProgressRow {
  user_id: string;
  module_id: string;
  completed_at: string;
}

export type MediaKind = "video" | "audio" | "workbook" | "ebook";
