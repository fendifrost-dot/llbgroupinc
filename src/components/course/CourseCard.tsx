import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PRICES_APPROVED, formatPrice } from "@/content/catalog";
import { OptionalImage } from "@/components/shared/OptionalImage";

interface CourseCardProps {
  to: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  priceCents: number;
  tags?: string[];
  cta?: string;
  /** Cover image path; the card shows it once the file exists. */
  image?: string;
  /** Aspect class for the cover; course covers are portrait, the bundle is 16:9. */
  imageAspect?: string;
}

/**
 * Catalog card. Deliberately the same shape as the original site's
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
  image,
  imageAspect = "aspect-[2/3]",
}: CourseCardProps) {
  return (
    <Link
      to={to}
      className="group flex flex-col p-8 bg-card border border-border rounded-sm transition-colors duration-300 hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      {image && (
        <OptionalImage
          src={image}
          alt={`${title} program cover`}
          className={`-mx-8 -mt-8 mb-6 ${imageAspect} border-b border-border`}
          imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
        />
      )}
      <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{title}</h3>
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
        <span className="text-sm text-foreground">{PRICES_APPROVED ? formatPrice(priceCents) : ""}</span>
        <span className="inline-flex items-center text-xs tracking-widest uppercase text-primary">
          {cta}
          <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
