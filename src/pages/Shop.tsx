import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/course/CourseCard";
import { LeadMagnetForm } from "@/components/course/LeadMagnetForm";
import { EnrollButton } from "@/components/course/EnrollButton";
import { BUNDLE, COURSES, EBOOK, formatPrice } from "@/content/catalog";
import { useProducts } from "@/hooks/useCatalog";

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
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground">
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
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
                Complete Curriculum
              </p>
              <h3 className="font-serif text-2xl font-medium text-foreground mb-3">
                {BUNDLE.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                {BUNDLE.description}
              </p>
              <div className="mt-auto pt-6 border-t border-border flex items-center justify-between gap-4">
                <span className="text-sm text-foreground">
                  {formatPrice(priceFor(BUNDLE.productSlug, BUNDLE.priceCents))}
                </span>
                {/* Navigates to the sales page — the bundle has one. The
                    e-book below does not, so it buys directly. */}
                <Button variant="hero-outline" asChild>
                  <Link to={`/courses/${BUNDLE.slug}`}>View Bundle</Link>
                </Button>
              </div>
            </div>

            <div className="p-8 bg-background border border-border rounded-sm flex flex-col">
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
                Publication
              </p>
              <h3 className="font-serif text-2xl font-medium text-foreground mb-1">
                {EBOOK.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{EBOOK.subtitle}</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                {EBOOK.description}
              </p>
              <div className="mt-auto pt-6 border-t border-border flex items-center justify-between gap-4">
                <span className="text-sm text-foreground">
                  {formatPrice(priceFor(EBOOK.productSlug, EBOOK.priceCents))}
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
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground mb-6">
              Institutional Deployment
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              These programs are designed to support—not replace—LLB Group's
              consulting and education work. Organizations seeking to license
              this curriculum for internal use should begin with the Education
              page's licensing enquiry.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
