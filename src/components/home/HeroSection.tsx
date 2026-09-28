import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card/30" />
      
      <div className="section-container relative z-10 py-20 lg:py-32">
        <div className="max-w-4xl">
          {/* Overline */}
          <p className="fade-in-up text-xs tracking-[0.3em] uppercase text-primary mb-6">
            Wellness Strategy & Human Performance
          </p>
          
          {/* Main Headline */}
          <h1 className="fade-in-up stagger-1 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-foreground mb-8">
            Building Sustainable
            <br />
            <span className="text-gradient">Performance at Scale</span>
          </h1>
          
          {/* Subheadline */}
          <p className="fade-in-up stagger-2 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-12">
            LLB Group, Inc. partners with organizations to design and implement wellness 
            infrastructure that drives measurable gains in leadership effectiveness, 
            organizational resilience, and long-term human performance.
          </p>
          
          {/* CTA Buttons */}
          <div className="fade-in-up stagger-3 flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/solutions">
                View Solutions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/book">
                Engage LLB
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
