import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EnrollButton } from "@/components/course/EnrollButton";
import { CourseCard } from "@/components/course/CourseCard";
import { LeadMagnetForm } from "@/components/course/LeadMagnetForm";
import { CourseShowcase } from "@/components/course/CourseShowcase";
import {
  BUNDLE,
  COURSES,
  INCLUDED,
  INSTRUCTOR,
  findCourseContent,
  formatDuration,
  formatPrice,
} from "@/content/catalog";
import { useCourse, useCurriculum, useProduct } from "@/hooks/useCatalog";
import { publicStorageUrl } from "@/integrations/supabase/client";

/**
 * One template, four instances: three courses and the bundle.
 * Section order follows Handoff §4.2 exactly. Everything is built from the
 * baseline design language — no new colors, no new type scale.
 */
const CourseSales = () => {
  const { slug } = useParams<{ slug: string }>();
  const isBundle = slug === BUNDLE.slug;
  const content = findCourseContent(slug ?? "");

  const { data: course } = useCourse(isBundle ? undefined : slug);
  const { data: product } = useProduct(isBundle ? BUNDLE.productSlug : content?.productSlug);
  const curriculum = useCurriculum(content, course?.id);

  if (!content && !isBundle) return <Navigate to="/courses" replace />;

  const title = isBundle ? BUNDLE.title : course?.title ?? content!.title;
  const subtitle = isBundle ? BUNDLE.subtitle : course?.subtitle ?? content!.subtitle;
  const description = isBundle
    ? BUNDLE.description
    : course?.description ?? content!.description;
  const eyebrow = isBundle ? BUNDLE.eyebrow : content!.eyebrow;
  const priceCents = product?.price_cents ?? (isBundle ? BUNDLE.priceCents : content!.priceCents);
  const productSlug = isBundle ? BUNDLE.productSlug : content!.productSlug;
  // The database trailer wins once the backend is live; until then the
  // catalog can point at a file shipped in public/.
  const trailerUrl = publicStorageUrl(course?.trailer_url) ?? content?.trailerSrc ?? null;

  return (
    <Layout>
      {/* 1. Hero */}
      <section className="py-20 lg:py-28 bg-card border-b border-border">
        <div className="section-container">
          <div className="max-w-3xl">
            <p className="fade-in-up text-xs tracking-[0.3em] uppercase text-primary mb-4">
              {eyebrow}
            </p>
            <h1 className="fade-in-up stagger-1 font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-[0.04em] text-foreground">
              {title}
            </h1>
            <p className="fade-in-up stagger-2 mt-6 text-lg text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
            <p className="fade-in-up stagger-2 mt-6 text-muted-foreground leading-relaxed max-w-2xl">
              {description}
            </p>

            <div className="fade-in-up stagger-3 mt-10 flex flex-col sm:flex-row sm:items-center gap-6">
              <p className="font-serif text-3xl font-medium text-foreground">
                {formatPrice(priceCents)}
                {isBundle && BUNDLE.savingsCents > 0 && (
                  <span className="ml-3 align-middle text-sm font-sans text-muted-foreground">
                    Save {formatPrice(BUNDLE.savingsCents)}
                  </span>
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <EnrollButton
                  productSlug={productSlug}
                  productId={product?.id}
                  courseSlug={isBundle ? undefined : slug}
                />
                <Button variant="hero-outline" asChild>
                  <a href="#curriculum">View Curriculum</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trailer and program overview. Never a placeholder. */}
      {!isBundle && (
        <section className="py-20 lg:py-28">
          <div className="section-container">
            <div className="max-w-5xl mx-auto">
              <CourseShowcase
                title={title}
                subtitle={subtitle}
                modules={curriculum}
                trailerSrc={trailerUrl}
                cta={
                  <EnrollButton
                    productSlug={productSlug}
                    productId={product?.id}
                    courseSlug={slug}
                  />
                }
              />
            </div>
          </div>
        </section>
      )}

      {/* 3. What You'll Learn */}
      {!isBundle && (
        <section className="py-20 lg:py-28 bg-card">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
              <div>
                <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground mb-6">
                  What You'll Learn
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Each module builds on the last. By the end you will have worked
                  through the material and produced something you can use.
                </p>
              </div>
              <ul className="space-y-4">
                {content!.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                    <span className="leading-relaxed">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* 4. Curriculum */}
      <section id="curriculum" className="py-20 lg:py-28 scroll-mt-24">
        <div className="section-container">
          <div className="max-w-2xl mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground">
              Curriculum
            </h2>
            <p className="text-muted-foreground leading-relaxed mt-4">
              {isBundle
                ? "Three programs, eighteen modules, three workbooks, plus the e-book."
                : "Six modules of video and audio instruction with a companion workbook."}
            </p>
          </div>

          {isBundle ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {COURSES.map((included) => (
                <CourseCard
                  key={included.slug}
                  to={`/courses/${included.slug}`}
                  title={included.title}
                  subtitle={included.subtitle}
                  description={included.description}
                  priceCents={included.priceCents}
                  tags={["6 Modules"]}
                />
              ))}
            </div>
          ) : (
            <Accordion type="single" collapsible className="max-w-3xl">
              {curriculum.map((module) => (
                <AccordionItem key={module.id} value={module.id} className="border-border">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="flex items-center gap-4 pr-4">
                      <span className="text-xs tabular-nums text-muted-foreground w-6">
                        {String(module.sort).padStart(2, "0")}
                      </span>
                      <span className="font-serif text-lg font-medium text-foreground">
                        {module.title}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-10 pb-2">
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {module.summary}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="px-3 py-1 bg-secondary rounded-sm">
                          {formatDuration(module.durationSeconds)}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Lock className="h-3 w-3" aria-hidden="true" />
                          Unlocks with enrollment
                        </span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>

      {/* 5. What's Included */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground mb-6">
                What's Included
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isBundle
                  ? "Everything in all three programs, plus the e-book."
                  : "Enrollment is a one-time payment. There is no subscription and no renewal."}
              </p>
            </div>
            <ul className="space-y-3">
              {(isBundle
                ? [
                    "Three complete programs — eighteen lessons in total",
                    "Audio version of every lesson for offline listening",
                    "Three downloadable workbooks (PDF)",
                    "The Living Life Balanced e-book",
                    "Lifetime access, including future revisions",
                  ]
                : INCLUDED
              ).map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-1 h-1 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Instructor */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
              Instructor
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground mb-2">
              {INSTRUCTOR.name}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">{INSTRUCTOR.role}</p>
            <p className="text-muted-foreground leading-relaxed">{INSTRUCTOR.bio}</p>
          </div>
        </div>
      </section>

      {/* 7. Bundle upsell — hidden on the bundle page itself */}
      {!isBundle && (
        <section className="py-16 bg-card border-y border-border">
          <div className="section-container">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground mb-3">
                  {BUNDLE.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  All three programs plus the e-book for {formatPrice(BUNDLE.priceCents)} —
                  {" "}{formatPrice(BUNDLE.savingsCents)} less than buying separately.
                </p>
              </div>
              <Button variant="hero-outline" className="shrink-0" asChild>
                <Link to={`/courses/${BUNDLE.slug}`}>
                  View Bundle
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* 8. FAQ + final CTA */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground mb-8">
                Common Questions
              </h2>
              <Accordion type="single" collapsible>
                {(content?.faq ?? BUNDLE_FAQ).map((item) => (
                  <AccordionItem
                    key={item.question}
                    value={item.question}
                    className="border-border"
                  >
                    <AccordionTrigger className="text-left hover:no-underline font-sans text-base text-foreground">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="space-y-8">
              <div className="p-8 bg-card border border-border rounded-sm">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                  Enroll in {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  One-time payment of {formatPrice(priceCents)}. Lifetime access.
                </p>
                <EnrollButton
                  productSlug={productSlug}
                  productId={product?.id}
                  courseSlug={isBundle ? undefined : slug}
                  className="w-full sm:w-auto"
                />
              </div>

              <LeadMagnetForm source={`course-sales-${slug}`} />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

const BUNDLE_FAQ = [
  {
    question: "Can I buy the programs individually instead?",
    answer:
      "Yes. Each program is available on its own. The bundle exists for people who want the full curriculum, and it costs less than the four purchases separately.",
  },
  {
    question: "Do I have to take them in order?",
    answer:
      "No. The three programs are independent. Many participants start with Balanced Living Blueprint, but nothing requires it.",
  },
  {
    question: "Is the e-book included?",
    answer: "Yes. The bundle includes the Living Life Balanced e-book as a PDF download.",
  },
  {
    question: "How long do I have access?",
    answer:
      "Lifetime access to everything in the bundle, including any future revisions to the material.",
  },
];

export default CourseSales;
