import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const solutions = [
  {
    title: "Executive Performance Framework",
    description:
      "A structured methodology for aligning leadership wellness with organizational strategy. Designed for executive teams and boards seeking sustainable performance infrastructure.",
    delivery: "Consulting + Education",
    link: "/consulting",
  },
  {
    title: "Organizational Resilience Program",
    description:
      "A modular program addressing workforce capacity, cultural alignment, and long-term operational sustainability. Scalable across enterprise, institutional, and community contexts.",
    delivery: "Consulting + Education",
    link: "/consulting",
  },
  {
    title: "Wellness Strategy Certification",
    description:
      "A structured learning program for HR leaders, wellness professionals, and organizational consultants. Designed for internal deployment or professional development.",
    delivery: "Education",
    link: "/education",
  },
  {
    title: "Leadership Development Curriculum",
    description:
      "A licensable curriculum package for institutions seeking to integrate wellness and performance into existing leadership development pipelines.",
    delivery: "Education + Licensing",
    link: "/education",
  },
  {
    title: "Institutional Speaking & Workshops",
    description:
      "Executive talks, workshops, and facilitated sessions for conferences, off-sites, and internal leadership events. Topics span leadership, resilience, and organizational wellness.",
    delivery: "Events",
    link: "/events",
  },
  {
    title: "Supporting Products & Experiences",
    description:
      "Curated supplements, wellness tools, and experiential offerings designed to reinforce consulting and education work in daily practice.",
    delivery: "Products",
    link: "/shop",
  },
];

const Solutions = () => {
  return (
    <Layout>
      <PageHeader
        overline="Solutions"
        title="Packaged Frameworks & Programs"
        description="Structured, repeatable solutions designed to integrate wellness and performance into organizational systems. Each offering ladders into LLB Group's consulting, education, or product channels."
      />

      {/* Solutions Grid */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="space-y-6">
            {solutions.map((solution) => (
              <Link
                key={solution.title}
                to={solution.link}
                className="group block p-8 lg:p-10 bg-card border border-border rounded-sm hover:border-primary/30 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="max-w-2xl">
                    <h3 className="font-serif text-xl lg:text-2xl font-medium text-foreground mb-3 group-hover:text-primary transition-colors">
                      {solution.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {solution.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 lg:flex-shrink-0">
                    <span className="px-4 py-2 bg-secondary text-xs text-muted-foreground rounded-sm">
                      {solution.delivery}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Solutions */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground mb-6">
              Custom Engagements
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              For organizations with unique requirements or multi-channel needs, 
              LLB Group designs custom engagement structures tailored to scope, 
              timeline, and strategic objectives.
            </p>
            <Button variant="hero" asChild>
              <Link to="/book">
                Discuss Custom Solutions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Solutions;
