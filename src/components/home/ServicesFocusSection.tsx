import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const services = [
  {
    title: "Leadership & Performance Consulting",
    description: "Supporting leaders and teams with systems that improve clarity, execution, and resilience.",
  },
  {
    title: "Organizational Wellness Strategy",
    description: "Designing infrastructure that aligns well-being with operational and cultural goals.",
  },
  {
    title: "Education & Training Programs",
    description: "Delivering structured learning experiences built for scalability and long-term adoption.",
  },
];

export function ServicesFocusSection() {
  return (
    <section className="py-20 lg:py-32 bg-card">
      <div className="section-container">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-foreground mb-16 lg:mb-20">
          Our Areas of Focus
        </h2>
        
        <div className="space-y-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className="flex flex-col lg:flex-row lg:items-center justify-between p-8 lg:p-10 bg-background border border-border rounded-sm gap-6"
            >
              <div className="max-w-2xl">
                <h3 className="font-serif text-xl lg:text-2xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
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
