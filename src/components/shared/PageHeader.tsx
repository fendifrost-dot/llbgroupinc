interface PageHeaderProps {
  overline?: string;
  title: string;
  description?: string;
}

export function PageHeader({ overline, title, description }: PageHeaderProps) {
  return (
    <section className="py-20 lg:py-28 bg-card border-b border-border">
      <div className="section-container">
        <div className="max-w-3xl">
          {overline && (
            <p className="fade-in-up text-xs tracking-[0.3em] uppercase text-primary mb-4">
              {overline}
            </p>
          )}
          <h1 className="fade-in-up stagger-1 font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="fade-in-up stagger-2 mt-6 text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
