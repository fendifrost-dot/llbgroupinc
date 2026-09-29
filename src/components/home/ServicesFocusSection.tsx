import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Leaf, LineChart } from "lucide-react";

const services = [
  {
    title: "Leadership & Performance Consulting",
    description:
      "Supporting leaders and teams with systems that improve clarity, execution, and resilience.",
    icon: LineChart,
  },
  {
    title: "Organizational Wellness Strategy",
    description:
      "Designing infrastructure that aligns well-being with operational and cultural goals.",
    icon: Leaf,
  },
  {
    title: "Education & Training Programs",
    description:
      "Structured courses, workshops, frameworks, and learning experiences that build capability and sustain impact.",
    icon: BookOpen,
  },
];

export function ServicesFocusSection() {
  return (
    <section className="py-20 lg:py-28 bg-secondary/40">
      <div className="section-container">
        <div className="max-w-2xl mb-12 lg:mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">What we do</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-foreground mb-5">
            Our Areas of Focus
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            At the intersection of wellness strategy, leadership development, and human
            performance, we design solutions that strengthen organizations and elevate human
            potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group flex flex-col p-8 lg:p-9 bg-card border border-border rounded-sm hover:border-primary/30 transition-all duration-400"
              >
                <div className="mb-5 text-primary">
                  <Icon className="h-8 w-8" strokeWidth={1.25} />
                </div>
                <h3 className="font-serif text-lg lg:text-xl font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12">
          <Button variant="hero" size="xl" asChild>
            <Link to="/consulting">
              Explore Consulting
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
