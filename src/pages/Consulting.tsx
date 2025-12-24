import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const engagementAreas = [
  {
    title: "Leadership & Executive Performance Strategy",
    description:
      "Advisory services supporting executive teams with performance systems that enhance decision-making capacity, stress resilience, and leadership continuity.",
    outcomes: [
      "Improved executive clarity and decision quality",
      "Reduced burnout and performance volatility",
      "Stronger leadership alignment and succession readiness",
    ],
  },
  {
    title: "Organizational Wellness Infrastructure",
    description:
      "Design and implementation of wellness frameworks embedded into organizational culture, operations, and long-term strategy.",
    outcomes: [
      "Sustainable workforce performance",
      "Improved organizational resilience",
      "Alignment between well-being and operational goals",
    ],
  },
  {
    title: "Culture, Capacity & Resilience Programs",
    description:
      "Consulting engagements focused on strengthening internal systems that support adaptability, engagement, and long-term execution.",
    outcomes: [
      "Increased team capacity and retention",
      "Reduced organizational friction and fatigue",
      "More consistent performance under pressure",
    ],
  },
];

const process = [
  {
    phase: "Assessment & Alignment",
    description:
      "We begin with structured discovery to understand leadership dynamics, organizational stressors, and performance constraints.",
  },
  {
    phase: "Strategy & Framework Design",
    description:
      "We develop tailored frameworks aligned to leadership goals, culture, and operational realities.",
  },
  {
    phase: "Implementation & Integration",
    description:
      "We support execution through advisory sessions, leadership workshops, and ongoing consultation designed for long-term adoption.",
  },
];

const Consulting = () => {
  return (
    <Layout>
      <PageHeader
        overline="Consulting"
        title="Strategic Wellness & Human Performance Consulting"
        description="LLB Group, Inc. provides strategic consulting services to organizations seeking to integrate wellness, performance, and resilience into leadership development and operational systems. Our engagements are designed to align human performance with organizational outcomes—at scale."
      />

      {/* Engagement Areas Section */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-2xl mb-16">
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground">
              Consulting Engagement Areas
            </h2>
          </div>

          <div className="space-y-8">
            {engagementAreas.map((area) => (
              <div
                key={area.title}
                className="p-8 lg:p-12 bg-card border border-border rounded-sm"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <h3 className="font-serif text-2xl font-medium text-foreground mb-4">
                      {area.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {area.description}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
                      Key Outcomes
                    </p>
                    <ul className="space-y-2">
                      {area.outcomes.map((outcome) => (
                        <li
                          key={outcome}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="section-container">
          <div className="max-w-2xl mb-16">
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground">
              How Our Consulting Engagements Work
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {process.map((step, index) => (
              <div key={step.phase} className="relative">
                <div className="p-8 bg-background border border-border rounded-sm h-full">
                  <span className="text-4xl font-serif text-primary/30 font-medium">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-serif text-xl font-medium text-foreground">
                    {step.phase}
                  </h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Structure Section */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-3xl">
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground mb-6">
              Engagement Structure
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              LLB Group consulting engagements are structured as advisory relationships, 
              workshops, or retained strategic partnerships depending on organizational 
              needs and scope. All engagements are customized and designed for measurable, 
              sustainable impact.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Pricing is engagement-based and determined following an initial consultation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground mb-6">
              Engage LLB Group
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10">
              LLB Group works with organizations, institutions, and leadership teams 
              committed to integrating performance, resilience, and well-being into 
              long-term strategy.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/book">
                  Engage LLB
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/book">Request a Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Consulting;
