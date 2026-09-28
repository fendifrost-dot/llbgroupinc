import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";

const pressItems = [
  {
    type: "Feature",
    outlet: "Harvard Business Review",
    title: "The Business Case for Organizational Wellness Infrastructure",
    date: "2024",
  },
  {
    type: "Interview",
    outlet: "Forbes",
    title: "Executive Performance in High-Pressure Environments",
    date: "2024",
  },
  {
    type: "Commentary",
    outlet: "Inc. Magazine",
    title: "Building Institutional Resilience for Long-Term Execution",
    date: "2024",
  },
];

const podcasts = [
  {
    show: "The Leadership Lab",
    episode: "Sustainable Performance at Organizational Scale",
    date: "December 2024",
  },
  {
    show: "Executive Health Podcast",
    episode: "Wellness as Strategic Infrastructure",
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
        title="Press, Publications & Appearances"
        description="Selected coverage, thought leadership, and media contributions from LLB Group."
      />

      {/* Press Section */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-2xl mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
              Press Coverage
            </h2>
          </div>

          <div className="space-y-4">
            {pressItems.map((item, index) => (
              <div
                key={index}
                className="p-6 lg:p-8 bg-card border border-border rounded-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                  <div className="text-sm text-primary font-medium w-24">
                    {item.type}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {item.outlet}
                    </p>
                    <h3 className="font-serif text-lg font-bold text-foreground">
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
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
              Podcast Appearances
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
                <h3 className="font-serif text-lg font-bold text-foreground mb-4">
                  {podcast.episode}
                </h3>
                <p className="text-sm text-muted-foreground">{podcast.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles & Video Section */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Articles & Publications
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Selected written contributions on wellness strategy, leadership 
                performance, and organizational resilience.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Publication archive available upon request.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Video & Presentations
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Recorded keynotes, conference presentations, and institutional 
                talks available for preview.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Video library access available for qualified inquiries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Media Inquiries */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Media Inquiries
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              For press inquiries, interview requests, or media kit access, 
              contact our communications team.
            </p>
            <p className="text-foreground">press@llbgroup.com</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Media;
