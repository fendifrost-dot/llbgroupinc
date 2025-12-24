const credibilityMarkers = [
  "Fortune 500 Clients",
  "Healthcare Systems",
  "Academic Institutions",
  "Government Agencies",
  "Professional Sports",
  "Global Nonprofits",
];

export function CredibilitySection() {
  return (
    <section className="py-16 lg:py-24 bg-card border-y border-border">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Trusted by Leaders Across Sectors
          </p>
        </div>

        {/* Credibility Markers */}
        <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
          {credibilityMarkers.map((marker) => (
            <div
              key={marker}
              className="px-6 py-3 border border-border rounded-sm text-sm text-muted-foreground"
            >
              {marker}
            </div>
          ))}
        </div>

        {/* Speaking & Media Row */}
        <div className="mt-16 pt-12 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="font-serif text-2xl font-medium text-foreground">100+</p>
              <p className="mt-2 text-sm text-muted-foreground">Keynotes Delivered</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-medium text-foreground">Featured In</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Major Business & Wellness Publications
              </p>
            </div>
            <div>
              <p className="font-serif text-2xl font-medium text-foreground">Advisory Roles</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Corporate & Institutional Boards
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
