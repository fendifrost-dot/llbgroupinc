import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CourseCard } from "@/components/course/CourseCard";
import { COURSES } from "@/content/catalog";
import { courseCover } from "@/content/media";

const programs = [
  {
    type: "Certification Programs",
    items: [
      {
        title: "Wellness Strategy Certification",
        duration: "12 weeks",
        format: "Hybrid",
        description:
          "Comprehensive certification for HR leaders, organizational consultants, and wellness professionals. Designed for practitioners seeking to implement structured wellness frameworks within institutions.",
      },
      {
        title: "Leadership Performance Practitioner",
        duration: "8 weeks",
        format: "Online",
        description:
          "Advanced training for professionals advising executive clients on sustainable performance practices. Focused on methodology, assessment, and long-term integration.",
      },
    ],
  },
  {
    type: "Executive Education",
    items: [
      {
        title: "Executive Resilience Intensive",
        duration: "3 days",
        format: "In-Person",
        description:
          "Immersive program for senior executives focused on performance sustainability, decision-making capacity, and leadership longevity within high-pressure environments.",
      },
      {
        title: "Board Wellness Governance",
        duration: "1 day",
        format: "Virtual",
        description:
          "Specialized session for board members addressing wellness oversight, organizational liability, and strategic governance of workforce well-being.",
      },
    ],
  },
  {
    type: "Digital Learning",
    items: [
      {
        title: "Foundations of Organizational Wellness",
        duration: "Self-paced",
        format: "On-Demand",
        description:
          "Introductory program covering core frameworks, implementation principles, and assessment methodologies for organizational wellness strategy.",
      },
      {
        title: "Leadership Under Pressure",
        duration: "Self-paced",
        format: "On-Demand",
        description:
          "Structured learning on executive resilience, stress management systems, and sustainable performance practices for leaders and their teams.",
      },
    ],
  },
];

const Education = () => {
  return (
    <Layout>
      <PageHeader
        overline="Education"
        title="Structured Learning & Scalable Curriculum"
        description="LLB Group develops certifications, executive programs, and digital learning assets designed for institutional adoption, licensing, and long-term organizational deployment."
      />

      {/* Programs */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          {programs.map((category) => (
            <div key={category.type} className="mb-16 last:mb-0">
              <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground mb-8">
                {category.type}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {category.items.map((item) => (
                  <div
                    key={item.title}
                    className="p-8 bg-card border border-border rounded-sm"
                  >
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="px-3 py-1 bg-secondary rounded-sm">
                        {item.duration}
                      </span>
                      <span className="px-3 py-1 bg-secondary rounded-sm">
                        {item.format}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Self-Paced Programs — additive integration point for the course
          storefront. The institutional copy above and the licensing section
          below are unchanged. */}
      <section className="py-20 lg:py-28 bg-card border-y border-border">
        <div className="section-container">
          <div className="max-w-2xl mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground">
              Self-Paced Programs
            </h2>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Selected curriculum is adapted for individual practitioners as
              structured, self-paced programs — six modules of video and audio
              instruction with a companion workbook.
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
                priceCents={course.priceCents}
                tags={["6 Modules", "Self-paced"]}
              />
            ))}
          </div>

          <div className="mt-12">
            <Button variant="hero-outline" asChild>
              <Link to="/courses">
                View All Programs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Licensing */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground mb-6">
                Institutional Licensing
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                LLB Group curricula are designed for institutional deployment. 
                Organizations can license our education programs for internal 
                use—building in-house capacity without developing proprietary content.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Licensing is available to enterprises, universities, healthcare 
                systems, and professional development organizations seeking 
                scalable, structured learning assets.
              </p>
              <Button variant="hero-outline" asChild>
                <Link to="/book">
                  Discuss Licensing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="p-8 bg-background border border-border rounded-sm">
              <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                Licensing Includes
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                  Complete course materials and facilitator guides
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                  Train-the-trainer certification program
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                  Ongoing content updates and advisory support
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                  Optional custom branding and co-development
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground mb-6">
              Program Inquiries
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Contact us for program details, enrollment timelines, or to discuss 
              institutional deployment and licensing opportunities.
            </p>
            <Button variant="hero" asChild>
              <Link to="/book">
                Request Program Information
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Education;
