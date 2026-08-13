/**
 * Hand-authored row types for the course platform tables.
 *
 * Only the columns the browser is actually GRANTed are listed here — the
 * private storage paths (video_path / audio_path / workbook_path) and
 * stripe_price_id are absent on purpose. If you find yourself wanting to add
 * one, that is the signal to go through the get-media-url edge function
 * instead. See supabase/migrations/*_course_platform_rls.sql.
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
