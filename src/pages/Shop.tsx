import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/course/CourseCard";
import { LeadMagnetForm } from "@/components/course/LeadMagnetForm";
import { EnrollButton } from "@/components/course/EnrollButton";
import { BUNDLE, COURSES, EBOOK, PRICES_APPROVED, formatPrice } from "@/content/catalog";
import { useProducts } from "@/hooks/useCatalog";
import { EBOOK_MOCKUP, courseCover } from "@/content/media";
import { OptionalImage } from "@/components/shared/OptionalImage";
import { MAIN_SITE_BOOK } from "@/content/site";

/**
 * Handoff §4.8: the five real products replace the placeholder categories, but
 * the page keeps its restrained, subordinate positioning — it supports the
 * consulting and education work rather than becoming a storefront.
 */
const Shop = () => {
  const { data: products } = useProducts();
  const priceFor = (slug: string, fallback: number) =>
    products?.find((product) => product.slug === slug)?.price_cents ?? fallback;
  const ebookProduct = products?.find((product) => product.slug === EBOOK.productSlug);
  const { hash } = useLocation();

  // The header's E-Book link lands here as /shop#ebook. On a client-side
  // navigation the section is not laid out yet when this first runs, and the
  // header is fixed, so scrollIntoView alone either no-ops or hides the
  // heading behind the nav. Retry across a few frames, then offset.
  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    let frames = 0;
    let raf = 0;
    const HEADER_OFFSET = 96;
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top, behavior: "smooth" });
        return;
      }
      if (frames++ < 60) raf = requestAnimationFrame(tryScroll);
    };
    raf = requestAnimationFrame(tryScroll);
    return () => cancelAnimationFrame(raf);
  }, [hash]);

  return (
    <Layout>
      <PageHeader
        overline="Shop"
        title="Programs & Publications"
        description="Digital programs and publications designed to reinforce LLB Group's consulting and education methodology in individual practice."
      />

      {/* Programs */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-2xl mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground">
              Self-Paced Programs
            </h2>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Six modules of video and audio instruction with a companion
              workbook. One-time enrollment, lifetime access.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {COURSES.map((course) => (
              <CourseCard
                key={course.slug}
                to={`/courses/${course.slug}`}
                image={courseCover(course.slug)}
                title={course.title}
                subtitle={course.subtitle}
                description={course.description}
                priceCents={priceFor(course.productSlug, course.priceCents)}
                tags={["6 Modules", "Self-paced"]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bundle + e-book */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 bg-background border border-border rounded-sm flex flex-col">
              <OptionalImage
                src={courseCover(BUNDLE.slug)}
                alt={`${BUNDLE.title} cover`}
                className="-mx-8 -mt-8 mb-6 aspect-video border-b border-border"
              />
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
                Complete Curriculum
              </p>
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">
                {BUNDLE.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                {BUNDLE.description}
              </p>
              <div className="mt-auto pt-6 border-t border-border flex items-center justify-between gap-4">
                <span className="text-sm text-foreground">
                  {PRICES_APPROVED && formatPrice(priceFor(BUNDLE.productSlug, BUNDLE.priceCents))}
                </span>
                {/* Navigates to the sales page — the bundle has one. The
                    e-book below does not, so it buys directly. */}
                <Button variant="hero-outline" asChild>
                  <Link to={`/courses/${BUNDLE.slug}`}>View Bundle</Link>
                </Button>
              </div>
            </div>

            <div id="ebook" className="scroll-mt-24 p-8 bg-background border border-border rounded-sm flex flex-col">
              <OptionalImage
                src={EBOOK_MOCKUP}
                alt={`${EBOOK.title} e-book cover`}
                className="-mx-8 -mt-8 mb-6 aspect-video border-b border-border bg-[hsl(var(--band))]"
                imgClassName="object-contain"
              />
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
                Publication
              </p>
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-1">
                {EBOOK.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{EBOOK.subtitle}</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                {EBOOK.description}
              </p>
              <div className="mt-auto pt-6 border-t border-border flex items-center justify-between gap-4">
                <span className="text-sm text-foreground">
                  {PRICES_APPROVED && formatPrice(priceFor(EBOOK.productSlug, EBOOK.priceCents))}
                </span>
                <EnrollButton
                  productSlug={EBOOK.productSlug}
                  productId={ebookProduct?.id}
                  label="Buy E-Book"
                  variant="hero-outline"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 max-w-2xl">
            <LeadMagnetForm source="shop-ebook" />
          </div>
        </div>
      </section>

      {/* Positioning notice — the page stays subordinate to the practice. */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground mb-6">
              Institutional Deployment
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              These programs support LLB Group's consulting and education work
              rather than replace it. Organizations seeking to license this
              curriculum for internal use can start that conversation on the{" "}
              <a href={MAIN_SITE_BOOK} className="text-foreground underline underline-offset-4">
                LLB Group site
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
