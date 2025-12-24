import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";

const pressItems = [
  {
    type: "Feature",
    outlet: "Harvard Business Review",
    title: "The New Business Case for Wellness Infrastructure",
    date: "2024",
  },
  {
    type: "Interview",
    outlet: "Forbes",
    title: "How Top CEOs Maintain Performance Under Pressure",
    date: "2024",
  },
  {
    type: "Article",
    outlet: "Inc. Magazine",
    title: "Building Resilient Organizations in Uncertain Times",
    date: "2024",
  },
];

const podcasts = [
  {
    show: "The Leadership Lab",
    episode: "Sustainable Performance at Scale",
    date: "December 2024",
  },
  {
    show: "Executive Health Podcast",
    episode: "Wellness as Competitive Advantage",
    date: "November 2024",
  },
  {
    show: "Future of Work",
    episode: "Organizational Resilience Frameworks",
    date: "October 2024",
  },
];

const Media = () => {
  return (
    <Layout>
      <PageHeader
        overline="Media"
        title="Press, Podcasts & Publications"
        description="Featured coverage, thought leadership, and media appearances from LLB Group."
      />

      {/* Press Section */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-2xl mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
              Press Coverage
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground">
              Featured In
            </h2>
          </div>

          <div className="space-y-4">
            {pressItems.map((item, index) => (
              <div
                key={index}
                className="p-6 lg:p-8 bg-card border border-border rounded-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                  <div className="text-sm text-primary font-medium w-20">
                    {item.type}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {item.outlet}
                    </p>
                    <h3 className="font-serif text-lg font-medium text-foreground">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Podcasts Section */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="section-container">
          <div className="max-w-2xl mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
              Podcast Appearances
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground">
              Listen
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {podcasts.map((podcast, index) => (
              <div
                key={index}
                className="p-6 bg-background border border-border rounded-sm"
              >
                <p className="text-xs text-muted-foreground mb-2">
                  {podcast.show}
                </p>
                <h3 className="font-serif text-lg font-medium text-foreground mb-4">
                  {podcast.episode}
                </h3>
                <p className="text-sm text-muted-foreground">{podcast.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Content */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-2xl mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
              Video
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground">
              Featured Presentations
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-video bg-card border border-border rounded-sm flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Video content coming soon</p>
            </div>
            <div className="aspect-video bg-card border border-border rounded-sm flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Video content coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Media Inquiries */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground mb-6">
              Media Inquiries
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              For press inquiries, interview requests, or media kit access, 
              please contact our communications team.
            </p>
            <p className="text-foreground">press@llbgroup.com</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Media;
