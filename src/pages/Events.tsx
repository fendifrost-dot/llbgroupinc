import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const upcomingEvents = [
  {
    date: "2025-02-15",
    title: "Leadership Resilience Forum",
    location: "Chicago, IL",
    type: "Executive Keynote",
  },
  {
    date: "2025-03-08",
    title: "Healthcare Leadership Conference",
    location: "Boston, MA",
    type: "Panel Discussion",
  },
  {
    date: "2025-04-22",
    title: "Institutional Wellness Summit",
    location: "San Francisco, CA",
    type: "Workshop",
  },
];

const speakingTopics = [
  {
    title: "Building Wellness Infrastructure at Scale",
    description:
      "Strategic frameworks for integrating wellness into organizational operations and leadership systems.",
  },
  {
    title: "Executive Performance & Resilience",
    description:
      "Sustainable approaches to leadership effectiveness in high-pressure institutional environments.",
  },
  {
    title: "Organizational Capacity & Long-Term Execution",
    description:
      "Designing systems that support workforce adaptability, retention, and sustained performance.",
  },
  {
    title: "The Business Case for Human Performance",
    description:
      "Aligning wellness investment with operational outcomes, governance, and institutional strategy.",
  },
];

const engagementTypes = [
  {
    title: "Executive Keynotes",
    description:
      "Strategic presentations for leadership audiences at conferences, summits, and institutional events.",
  },
  {
    title: "Workshops & Facilitation",
    description:
      "Interactive sessions for executive teams, boards, or organizational leadership groups.",
  },
  {
    title: "Panel Participation",
    description:
      "Expert contribution to industry panels and executive roundtables.",
  },
];

const Events = () => {
  return (
    <Layout>
      <PageHeader
        overline="Events & Speaking"
        title="Executive Talks & Institutional Engagements"
        description="LLB Group delivers keynotes, workshops, and facilitated sessions for organizations seeking thought leadership on wellness strategy and human performance."
      />

      {/* Engagement Types */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-2xl mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground">
              Engagement Types
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {engagementTypes.map((type) => (
              <div
                key={type.title}
                className="p-8 bg-card border border-border rounded-sm"
              >
                <h3 className="font-serif text-xl font-medium text-foreground mb-3">
                  {type.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {type.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Speaking Topics */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="section-container">
          <div className="max-w-2xl mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground">
              Speaking Topics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {speakingTopics.map((topic) => (
              <div
                key={topic.title}
                className="p-6 bg-background border border-border rounded-sm"
              >
                <h3 className="font-serif text-lg font-medium text-foreground mb-3">
                  {topic.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {topic.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-2xl mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground">
              Scheduled Appearances
            </h2>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Confirmed engagements for the current period.
            </p>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.date}
                className="p-6 lg:p-8 bg-card border border-border rounded-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                  <div className="text-sm text-primary font-medium w-24">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-foreground">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {event.location} · {event.type}
                    </p>
                  </div>
                </div>
                <span className="px-4 py-2 border border-border rounded-sm text-xs text-muted-foreground">
                  Confirmed
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Inquiry */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground mb-6">
              Booking Inquiries
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              LLB Group accepts a limited number of speaking engagements annually. 
              Submit an inquiry to discuss availability, format, and alignment with 
              your event objectives.
            </p>
            <Button variant="hero" asChild>
              <Link to="/book">
                Submit Speaking Inquiry
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Events;
