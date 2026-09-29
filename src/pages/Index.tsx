import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/course/CourseCard";
import { LeadMagnetForm } from "@/components/course/LeadMagnetForm";
import { OptionalImage } from "@/components/shared/OptionalImage";
import { BUNDLE, COURSES, EBOOK, INSTRUCTOR } from "@/content/catalog";
import { EBOOK_MOCKUP, courseCover } from "@/content/media";
import { MAIN_SITE } from "@/content/site";

/**
 * Landing page for the learn. platform. It sells the programs and the e-book
 * and nothing else; LLB Group's own story, services and booking live on the
 * main site, linked at the bottom.
 */
const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary" />
        <div
          className="pointer-events-none absolute -top-24 right-0 h-[70%] w-[55%] opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at 70% 30%, hsl(36 42% 50% / 0.18) 0%, transparent 55%)",
          }}
        />

        <div className="section-container relative z-10 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-center">
            <div className="max-w-xl">
              <p className="fade-in-up text-xs tracking-[0.3em] uppercase text-primary mb-6">
                LLB Group · Self-Paced Programs
              </p>

              <h1 className="fade-in-up stagger-1 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-6xl font-semibold leading-[1.08] tracking-[0.04em] text-foreground mb-8">
                Living Life
                <br />
                <span className="text-gradient-gold">Balanced</span>
              </h1>

              <p className="fade-in-up stagger-2 text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10">
                Three programs with {INSTRUCTOR.name} for resilience, justice and faith. Each
                is six video lessons with an audio edition and a companion workbook, at your
                own pace, with lifetime access.
              </p>

              <div className="fade-in-up stagger-3 flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/courses">
                    Explore the Programs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="hero-outline" size="xl" asChild>
                  <Link to="/signin">Student Sign In</Link>
                </Button>
              </div>
            </div>

            <div className="fade-in-up stagger-2 relative">
              <div className="relative aspect-video overflow-hidden rounded-sm border border-border/60 shadow-[0_20px_60px_-20px_hsl(332_26%_11%_/_0.35)]">
                <img
                  src={courseCover(BUNDLE.slug)}
                  alt="Living Life Balanced: Balanced Living Blueprint, Justice Advocacy and Faith Over Fear"
                  className="h-full w-full object-cover"
                  width={1792}
                  height={1008}
                  loading="eager"
                  fetchPriority="high"
                />
              </div>

              <div className="absolute -bottom-5 left-4 sm:left-6 fade-in-up stagger-4 glass-chip px-4 py-3 sm:px-5 sm:py-4">
                <div className="flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.15em] uppercase text-muted-foreground mb-1">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Three Programs
                </div>
                <div className="font-serif text-lg sm:text-xl font-semibold text-foreground tracking-[0.04em] uppercase">
                  Eighteen Lessons
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20 lg:py-28 border-t border-border/40">
        <div className="section-container">
          <div className="max-w-2xl mb-12 lg:mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">The Programs</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-foreground mb-5">
              Choose Your Path
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Each program stands on its own. Start with the one that meets you where you are.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {COURSES.map((course) => (
              <CourseCard
                key={course.slug}
                to={`/courses/${course.slug}`}
                image={courseCover(course.slug)}
                title={course.title}
                subtitle={course.subtitle}
                description={course.description}
                priceCents={course.priceCents}
                tags={["6 Modules", "Self-paced"]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bundle and e-book */}
      <section className="py-20 lg:py-28 bg-secondary/40">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CourseCard
              to={`/courses/${BUNDLE.slug}`}
              image={courseCover(BUNDLE.slug)}
              imageAspect="aspect-video"
              title={BUNDLE.title}
              subtitle={BUNDLE.subtitle}
              description={BUNDLE.description}
              priceCents={BUNDLE.priceCents}
              tags={["18 Modules", "3 Workbooks", "E-Book Included"]}
              cta="View Bundle"
            />

            <div className="flex flex-col p-8 bg-card border border-border rounded-sm">
              <OptionalImage
                src={EBOOK_MOCKUP}
                alt={`${EBOOK.title} e-book cover`}
                className="-mx-8 -mt-8 mb-6 aspect-video border-b border-border bg-[hsl(var(--band))]"
                imgClassName="object-contain"
              />
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">The E-Book</p>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{EBOOK.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{EBOOK.subtitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">{EBOOK.description}</p>
              <div className="mt-auto">
                <LeadMagnetForm source="home-ebook" />
                <Link
                  to="/shop#ebook"
                  className="mt-6 inline-flex items-center text-xs tracking-widest uppercase text-primary"
                >
                  Get the E-Book
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to the main site */}
      <section className="py-16 lg:py-20">
        <div className="section-container">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-10 lg:p-14 bg-card border border-border rounded-sm">
            <div className="max-w-xl">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold leading-tight text-foreground mb-3">
                Speaking, Workshops and Consulting
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                These programs are part of LLB Group. For speaking engagements, workshops and
                organizational work, visit the main site.
              </p>
            </div>
            <Button variant="hero-outline" size="xl" className="shrink-0" asChild>
              <a href={MAIN_SITE}>
                Visit LLB Group
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
