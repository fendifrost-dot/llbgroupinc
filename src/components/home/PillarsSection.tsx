import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const pillars = [
  {
    title: "Consulting",
    description:
      "We advise organizations on wellness strategy, leadership performance, and cultural systems that support long-term execution and resilience.",
    link: "/consulting",
  },
  {
    title: "Education",
    description:
      "We develop structured courses, workshops, and learning frameworks designed to scale knowledge, alignment, and performance.",
    link: "/education",
  },
  {
    title: "Products & Experiences",
    description:
      "We support our consulting and education work through curated products, events, and media that reinforce sustainable balance in practice.",
    link: "/shop",
  },
];

export function PillarsSection() {
  return (
    <section className="py-20 lg:py-32 bg-card">
      <div className="section-container">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight text-foreground mb-6">
            What LLB Group Does
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            LLB Group operates as a wellness consulting, education, and media platform 
            focused on sustainable human performance.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {pillars.map((pillar, index) => (
            <Link
              key={pillar.title}
              to={pillar.link}
              className="group relative p-8 lg:p-10 bg-background border border-border rounded-sm hover:border-primary/30 transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Title */}
              <h3 className="font-serif text-2xl lg:text-3xl font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                {pillar.title}
              </h3>
              
              {/* Description */}
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
              
              {/* Arrow */}
              <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                <span>Learn more</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
