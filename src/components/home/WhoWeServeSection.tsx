const audiences = [
  {
    title: "Organizations",
    description: "Enterprise teams seeking sustainable performance, leadership alignment, and cultural resilience.",
  },
  {
    title: "Institutions",
    description: "Public and private entities focused on long-term workforce well-being and operational sustainability.",
  },
  {
    title: "Communities",
    description: "Programs designed to support balance, education, and empowerment at scale.",
  },
  {
    title: "Individuals",
    description: "High-performing leaders and professionals seeking structured growth and alignment.",
  },
];

export function WhoWeServeSection() {
  return (
    <section className="py-20 lg:py-32 bg-card">
      <div className="section-container">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-foreground mb-16 lg:mb-20">
          Who We Partner With
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {audiences.map((audience, index) => (
            <div 
              key={index}
              className="p-8 bg-background border border-border rounded-sm"
            >
              <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                {audience.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
