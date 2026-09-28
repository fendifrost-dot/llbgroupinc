const metrics = [
  { label: "Programs Delivered" },
  { label: "Engagements Supported" },
  { label: "Educational Initiatives" },
  { label: "Communities Reached" },
];

export function ExecutionSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="section-container">
        <div className="max-w-2xl mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-foreground mb-6">
            Execution in Practice
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our work spans consulting engagements, educational programs, and speaking 
            initiatives across multiple environments.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-border/50">
          {metrics.map((metric, index) => (
            <div key={index}>
              <div className="h-1 w-12 bg-primary/30 mb-6" />
              <p className="text-sm text-muted-foreground tracking-wide">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
