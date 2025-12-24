import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const solutions = [
  {
    category: "Enterprise",
    items: [
      {
        title: "Executive Wellness Programs",
        description:
          "Comprehensive wellness programs designed specifically for C-suite and senior leadership teams.",
        audience: "Fortune 500, Private Equity Portfolio Companies",
      },
      {
        title: "Organizational Resilience Framework",
        description:
          "System-wide approach to building adaptive capacity and stress resilience across all levels.",
        audience: "Large Enterprises, Government Agencies",
      },
    ],
  },
  {
    category: "Healthcare & Academia",
    items: [
      {
        title: "Provider Wellness Initiative",
        description:
          "Specialized programs addressing burnout and sustainable practice in healthcare settings.",
        audience: "Health Systems, Medical Groups, Academic Medical Centers",
      },
      {
        title: "Institutional Curriculum Integration",
        description:
          "Wellness and performance curriculum designed for academic institutions and professional schools.",
        audience: "Universities, Professional Development Programs",
      },
    ],
  },
  {
    category: "Emerging Platforms",
    items: [
      {
        title: "Startup Founder Support",
        description:
          "Performance optimization for founders and early-stage leadership teams.",
        audience: "Venture-Backed Companies, Accelerators",
      },
      {
        title: "Sports Performance Consulting",
        description:
          "Holistic performance frameworks for professional and collegiate athletic organizations.",
        audience: "Professional Teams, Athletic Departments",
      },
    ],
  },
];

const Solutions = () => {
  return (
    <Layout>
      <PageHeader
        overline="Solutions"
        title="Tailored for Your Sector"
        description="LLB Group delivers specialized solutions designed to meet the unique demands of different industries and organizational contexts."
      />

      {/* Solutions Grid */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          {solutions.map((category) => (
            <div key={category.category} className="mb-16 last:mb-0">
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-8">
                {category.category}
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {category.items.map((item) => (
                  <div
                    key={item.title}
                    className="group p-8 bg-card border border-border rounded-sm hover:border-primary/30 transition-colors"
                  >
                    <h3 className="font-serif text-xl lg:text-2xl font-medium text-foreground mb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {item.audience}
                      </p>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Solutions */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
              Custom Engagements
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground mb-6">
              Need Something Different?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We design custom solutions for organizations with unique requirements. 
              Contact us to discuss your specific needs and objectives.
            </p>
            <Button variant="hero" asChild>
              <Link to="/book">Discuss Custom Solutions</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Solutions;
