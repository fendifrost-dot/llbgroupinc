const audiences = [
  {
    title: "Organizations",
    description:
      "Enterprise teams seeking sustainable performance, leadership alignment, and cultural resilience.",
  },
  {
    title: "Institutions",
    description:
      "Public and private entities focused on long-term workforce well-being and operational sustainability.",
  },
  {
    title: "Communities",
    description: "Programs designed to support balance, education, and empowerment at scale.",
  },
  {
    title: "Individuals",
    description:
      "High-performing leaders and professionals seeking structured growth and alignment.",
  },
];

export function WhoWeServeSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-start mb-12">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-foreground mb-5">
              Who We Partner With
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              We work with organizations, institutions, communities, and individuals committed to
              sustainable performance and human-centered leadership.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 content-start pt-1 lg:pt-3">
            {audiences.map((a) => (
              <span
                key={a.title}
                className="inline-flex items-center rounded-full border border-border bg-card px-5 py-2.5 text-sm text-foreground shadow-sm"
              >
                {a.title}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((audience) => (
            <div
              key={audience.title}
              className="p-6 lg:p-8 bg-card border border-border rounded-sm hover:border-primary/25 transition-colors duration-300"
            >
              <h3 className="font-serif text-lg font-semibold text-foreground mb-3">
                {audience.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
