import { Check } from "lucide-react";

const valuePoints = [
  "Repeatable wellness and performance frameworks",
  "Multi-channel delivery across consulting, education, and media",
  "Scalable intellectual property and curriculum",
  "Product-supported ecosystem reinforcing long-term adoption",
];

export function ValueCreationSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="section-container">
        <div className="max-w-4xl">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-foreground mb-8">
            Designed for Scale
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-3xl">
            LLB Group operates at the intersection of strategy, education, and human performance. 
            Our work is built on repeatable frameworks, modular delivery, and multi-channel 
            distribution—allowing impact to scale across organizations, communities, and markets.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {valuePoints.map((point, index) => (
              <div 
                key={index} 
                className="flex items-start gap-4 p-6 bg-card border border-border rounded-sm"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-foreground leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
