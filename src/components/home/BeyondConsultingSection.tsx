import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const areas = [
  {
    title: "Events & Speaking",
    description: "Executive talks, workshops, and institutional engagements.",
    link: "/events",
    cta: "View Events",
  },
  {
    title: "Education",
    description: "Courses, workshops, and digital learning experiences.",
    link: "/education",
    cta: "View Education",
  },
  {
    title: "Media",
    description: "Curated content, insights, and thought leadership.",
    link: "/media",
    cta: "View Media",
  },
];

export function BeyondConsultingSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="section-container">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight text-foreground mb-16 lg:mb-20">
          Beyond Consulting
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {areas.map((area, index) => (
            <div 
              key={index}
              className="p-8 lg:p-10 bg-card border border-border rounded-sm flex flex-col"
            >
              <h3 className="font-serif text-xl lg:text-2xl font-medium text-foreground mb-4">
                {area.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">
                {area.description}
              </p>
              <Button variant="hero-outline" size="lg" asChild className="w-fit">
                <Link to={area.link}>
                  {area.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
