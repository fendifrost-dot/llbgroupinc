import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Atmosphere: soft cream gradient + warm light */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary" />
      <div
        className="pointer-events-none absolute -top-24 right-0 h-[70%] w-[55%] opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 70% 30%, hsl(36 42% 50% / 0.18) 0%, transparent 55%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-[40%] w-[40%] opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 20% 80%, hsl(33 45% 92% / 0.9) 0%, transparent 60%)",
        }}
      />

      <div className="section-container relative z-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Copy */}
          <div className="max-w-xl">
            <p className="fade-in-up text-xs tracking-[0.3em] uppercase text-primary mb-6">
              Wellness Strategy & Human Performance
            </p>

            <h1 className="fade-in-up stagger-1 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-6xl font-semibold leading-[1.08] tracking-[0.04em] text-foreground mb-8">
              Building Sustainable
              <br />
              <span className="text-gradient-gold">Performance</span>
              <br />
              at Scale
            </h1>

            <p className="fade-in-up stagger-2 text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10">
              LLB Group, Inc. partners with organizations to design and implement wellness
              infrastructure that drives measurable gains in leadership effectiveness,
              organizational resilience, and long-term human performance.
            </p>

            <div className="fade-in-up stagger-3 flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/solutions">
                  View Solutions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/book">Engage LLB</Link>
              </Button>
            </div>
          </div>

          {/* Visual + proof chip */}
          <div className="fade-in-up stagger-2 relative">
            <div className="relative aspect-[4/3] lg:aspect-[5/4] overflow-hidden rounded-sm border border-border/60 shadow-[0_20px_60px_-20px_hsl(332_26%_11%_/_0.25)]">
              <img
                src="/images/hero-leaders.jpg"
                alt="Three professionals looking ahead in warm light"
                className="h-full w-full object-cover object-[center_20%]"
                width={1600}
                height={1000}
                loading="eager"
                fetchPriority="high"
              />
              {/* Soft scrim for chip readability */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
            </div>

            {/* Floating focus chip. Deliberately not a statistic: no outcome figure
                is shown until LLB has measured data to substantiate it. */}
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 fade-in-up stagger-4 glass-chip px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.15em] uppercase text-muted-foreground mb-1">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Our Focus
              </div>
              <div className="font-serif text-lg sm:text-xl font-semibold text-foreground tracking-[0.04em] uppercase">
                Sustainable Performance
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
