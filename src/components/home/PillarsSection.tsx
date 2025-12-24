import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const pillars = [
  {
    number: "01",
    title: "Consulting",
    description:
      "Strategic advisory services for organizations seeking to integrate wellness infrastructure into their operations. We design frameworks that scale.",
    link: "/consulting",
  },
  {
    number: "02",
    title: "Education",
    description:
      "Structured learning programs, certifications, and digital curricula designed to build internal capacity for sustainable performance practices.",
    link: "/education",
  },
  {
    number: "03",
    title: "Products & Experiences",
    description:
      "Curated wellness products, live events, and immersive experiences that extend our methodology beyond traditional consulting engagements.",
    link: "/shop",
  },
];

export function PillarsSection() {
  return (
    <section className="py-20 lg:py-32 bg-card">
      <div className="section-container">
        {/* Section Header */}
        <div className="max-w-2xl mb-16 lg:mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
            Our Approach
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight text-foreground">
            Three Pillars of
            <br />
            Sustainable Performance
          </h2>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {pillars.map((pillar, index) => (
            <Link
              key={pillar.number}
              to={pillar.link}
              className="group relative p-8 lg:p-10 bg-background border border-border rounded-sm hover:border-primary/30 transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Number */}
              <span className="text-xs text-muted-foreground tracking-widest">
                {pillar.number}
              </span>
              
              {/* Title */}
              <h3 className="mt-6 font-serif text-2xl lg:text-3xl font-medium text-foreground group-hover:text-primary transition-colors duration-300">
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
