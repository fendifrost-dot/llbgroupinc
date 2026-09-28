import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="section-container">
        <div className="relative p-12 lg:p-20 bg-card border border-border rounded-sm">
          {/* Subtle accent line */}
          <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-foreground mb-6">
              Partner With LLB Group
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
              LLB Group works with organizations, institutions, and leaders committed to 
              building sustainable performance without short-term tradeoffs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/book">
                  Engage LLB
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/book">Book a Conversation</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
