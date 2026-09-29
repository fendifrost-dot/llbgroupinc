import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { CourseCard } from "@/components/course/CourseCard";
import { LeadMagnetForm } from "@/components/course/LeadMagnetForm";
import { BUNDLE, COURSES, EBOOK, formatPrice } from "@/content/catalog";
import { useProducts } from "@/hooks/useCatalog";
import { courseCover } from "@/content/media";

const Courses = () => {
  const { data: products } = useProducts();
  const priceFor = (slug: string, fallback: number) =>
    products?.find((product) => product.slug === slug)?.price_cents ?? fallback;

  return (
    <Layout>
      <PageHeader
        overline="Programs"
        title="Self-Paced Programs"
        description="Structured, self-paced programs adapted from LLB Group's institutional curriculum for individual practitioners. Each program is six modules of video and audio instruction with a companion workbook."
      />

      {/* Course catalog */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-2xl mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground">
              Individual Programs
            </h2>
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

      {/* Bundle */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
                Complete Curriculum
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground mb-6">
                {BUNDLE.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {BUNDLE.description}
              </p>
              <CourseCard
                to={`/courses/${BUNDLE.slug}`}
                image={courseCover(BUNDLE.slug)}
                title={BUNDLE.title}
                subtitle={BUNDLE.subtitle}
                priceCents={priceFor(BUNDLE.productSlug, BUNDLE.priceCents)}
                tags={["18 Modules", "3 Workbooks", "E-Book Included"]}
                cta="View Bundle"
              />
            </div>

            <div className="p-8 bg-background border border-border rounded-sm">
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                {EBOOK.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{EBOOK.subtitle}</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {EBOOK.description}
              </p>
              <p className="text-sm text-foreground mb-8">
                {formatPrice(priceFor(EBOOK.productSlug, EBOOK.priceCents))}
              </p>
              <LeadMagnetForm source="courses-catalog" />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Courses;
