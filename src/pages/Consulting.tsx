import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const services = [
  {
    title: "Leadership Wellness Strategy",
    description:
      "Executive-level consulting to integrate wellness practices into leadership development programs and succession planning.",
    outcomes: [
      "Enhanced decision-making capacity",
      "Improved stress resilience",
      "Sustainable performance patterns",
    ],
  },
  {
    title: "Organizational Wellness Architecture",
    description:
      "Design and implementation of enterprise-wide wellness infrastructure aligned with business objectives.",
    outcomes: [
      "Reduced healthcare costs",
      "Improved retention metrics",
      "Enhanced productivity indicators",
    ],
  },
  {
    title: "Institutional Program Development",
    description:
      "Custom program design for healthcare systems, academic institutions, and government agencies.",
    outcomes: [
      "Scalable delivery models",
      "Compliance-ready frameworks",
      "Measurable outcome tracking",
    ],
  },
];

const approach = [
  {
    phase: "Discovery",
    description:
      "Deep organizational assessment including stakeholder interviews, data analysis, and cultural evaluation.",
  },
  {
    phase: "Strategy",
    description:
      "Development of tailored recommendations with clear implementation roadmap and success metrics.",
  },
  {
    phase: "Implementation",
    description:
      "Hands-on support during rollout including training, change management, and stakeholder communication.",
  },
  {
    phase: "Optimization",
    description:
      "Ongoing measurement, refinement, and capacity building for sustained organizational adoption.",
  },
];

const Consulting = () => {
  return (
    <Layout>
      <PageHeader
        overline="Consulting Services"
        title="Strategic Wellness Advisory"
        description="LLB Group provides strategic consulting services for organizations seeking to integrate wellness infrastructure into their operations at scale."
      />

      {/* Services Section */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-2xl mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
              Service Areas
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground">
              What We Solve
            </h2>
          </div>

          <div className="space-y-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="p-8 lg:p-12 bg-card border border-border rounded-sm"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <h3 className="font-serif text-2xl font-medium text-foreground mb-4">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
                      Key Outcomes
                    </p>
                    <ul className="space-y-2">
                      {service.outcomes.map((outcome) => (
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

      {/* Approach Section */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="section-container">
          <div className="max-w-2xl mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
              Our Approach
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground">
              A Structured Engagement Model
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {approach.map((step, index) => (
              <div key={step.phase} className="relative">
                <div className="p-6 bg-background border border-border rounded-sm h-full">
                  <span className="text-4xl font-serif text-primary/30 font-medium">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-serif text-xl font-medium text-foreground">
                    {step.phase}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground mb-6">
              Ready to Discuss Your Organization's Needs?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Schedule a consultation to explore how LLB Group can support your 
              wellness strategy and leadership development objectives.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/book">
                Schedule Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Consulting;
