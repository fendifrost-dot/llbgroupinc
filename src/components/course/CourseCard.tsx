import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/content/catalog";

interface CourseCardProps {
  to: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  priceCents: number;
  tags?: string[];
  cta?: string;
}

/**
 * Catalog card. Deliberately the same shape as the Education page's existing
 * program cards (p-8, bg-card, border-border, rounded-sm, serif title) so the
 * storefront reads as native to the approved baseline.
 */
export function CourseCard({
  to,
  title,
  subtitle,
  description,
  priceCents,
  tags = [],
  cta = "View Program",
}: CourseCardProps) {
  return (
    <Link
      to={to}
      className="group flex flex-col p-8 bg-card border border-border rounded-sm transition-colors duration-300 hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <h3 className="font-serif text-xl font-medium text-foreground mb-2">{title}</h3>
      {subtitle && (
        <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
      )}
      {description && (
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">{description}</p>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-6">
          {tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-secondary rounded-sm">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
        <span className="text-sm text-foreground">{formatPrice(priceCents)}</span>
        <span className="inline-flex items-center text-xs tracking-widest uppercase text-primary">
          {cta}
          <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
