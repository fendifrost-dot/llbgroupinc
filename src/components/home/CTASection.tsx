import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="section-container">
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 p-10 lg:p-14 bg-card border border-border rounded-sm">
          <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="max-w-xl">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight text-foreground mb-3">
              Partner With LLB Group
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Let's build strategies and capabilities that unlock potential and drive
              lasting results.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button variant="hero" size="xl" asChild>
              <Link to="/solutions">
                View Solutions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/book">Book a Conversation</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
