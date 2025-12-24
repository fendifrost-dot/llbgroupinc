import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const methodologySteps = [
  {
    phase: "Assess",
    title: "Organizational Diagnostic",
    description:
      "Comprehensive evaluation of current wellness infrastructure, leadership capacity, and performance gaps.",
  },
  {
    phase: "Design",
    title: "Strategic Framework",
    description:
      "Development of customized frameworks aligned with organizational objectives and scalability requirements.",
  },
  {
    phase: "Implement",
    title: "Phased Deployment",
    description:
      "Structured rollout with embedded training, change management, and stakeholder alignment.",
  },
  {
    phase: "Sustain",
    title: "Continuous Optimization",
    description:
      "Ongoing measurement, refinement, and capacity building for long-term institutional adoption.",
  },
];

export function MethodologySection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Content */}
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
              Methodology
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight text-foreground mb-6">
              A Structured Approach to Sustainable Change
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our methodology is built on repeatable frameworks and evidence-based 
              practices. We don't offer one-size-fits-all solutions—we engineer 
              systems designed for your specific organizational context and scale requirements.
            </p>
            <Button variant="hero-outline" asChild>
              <Link to="/consulting">Explore Our Process</Link>
            </Button>
          </div>

          {/* Right Column - Steps */}
          <div className="space-y-8">
            {methodologySteps.map((step, index) => (
              <div
                key={step.phase}
                className="group flex gap-6 p-6 bg-card border border-border rounded-sm hover:border-border/80 transition-colors"
              >
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-primary/30 text-primary text-sm font-medium">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase text-primary mb-2">
                    {step.phase}
                  </p>
                  <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
