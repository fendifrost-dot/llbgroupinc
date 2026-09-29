import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, PlayCircle, Sparkles } from "lucide-react";

const pillars = [
  {
    title: "Consulting",
    description:
      "Custom wellness strategy and organizational performance solutions designed for your mission and metrics.",
    link: "/consulting",
    cta: "Learn more",
    icon: Sparkles,
  },
  {
    title: "Education",
    description:
      "World-class learning experiences that build capability and elevate leadership at every level.",
    link: "/education",
    cta: "Explore programs",
    icon: BookOpen,
  },
  {
    title: "Media",
    description:
      "Insightful content and thought leadership shaping the future of human performance—reinforced by products and experiences.",
    link: "/media",
    cta: "Discover media",
    icon: PlayCircle,
  },
];

export function PillarsSection() {
  return (
    <section className="py-16 lg:py-24 border-t border-border/40">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-10 lg:mb-14">
          <p className="text-[11px] sm:text-xs tracking-[0.35em] uppercase text-primary mb-4">
            Three pillars. One outcome.
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight text-foreground mb-4">
            What LLB Group Does
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            LLB Group operates as a wellness consulting, education, and media platform focused on
            sustainable human performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={pillar.title}
                to={pillar.link}
                className="group relative flex flex-col p-8 lg:p-10 bg-card border border-border rounded-sm hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_12px_40px_-16px_hsl(332_26%_11%_/_0.15)] transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-primary/25 bg-primary/5 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>

                <h3 className="font-serif text-xl lg:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {pillar.title}
                </h3>

                <p className="mt-3 flex-1 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>

                <div className="mt-8 flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-primary">
                  <span>{pillar.cta}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
