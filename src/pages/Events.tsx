import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const upcomingEvents = [
  {
    date: "2025-02-15",
    title: "Leadership Wellness Summit",
    location: "Chicago, IL",
    type: "Conference Keynote",
  },
  {
    date: "2025-03-08",
    title: "Healthcare Executive Forum",
    location: "Boston, MA",
    type: "Panel Discussion",
  },
  {
    date: "2025-04-22",
    title: "Corporate Wellness Conference",
    location: "San Francisco, CA",
    type: "Workshop",
  },
];

const speakingTopics = [
  {
    title: "The Business Case for Wellness Infrastructure",
    description:
      "How to build the financial and operational case for enterprise wellness investment.",
  },
  {
    title: "Leadership Under Pressure",
    description:
      "Sustainable performance strategies for executives navigating high-stakes environments.",
  },
  {
    title: "Scaling Wellness Programs",
    description:
      "Frameworks for taking wellness initiatives from pilot to enterprise-wide adoption.",
  },
  {
    title: "The Future of Workplace Wellness",
    description:
      "Emerging trends and evidence-based predictions for organizational health.",
  },
];

const Events = () => {
  return (
    <Layout>
      <PageHeader
        overline="Events & Speaking"
        title="Keynotes, Workshops & Appearances"
        description="LLB Group leadership speaks at corporate events, industry conferences, and academic institutions on topics related to wellness strategy and human performance."
      />

      {/* Upcoming Events */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-2xl mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
              Calendar
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground">
              Upcoming Appearances
            </h2>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.date}
                className="p-6 lg:p-8 bg-card border border-border rounded-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                  <div className="text-sm text-primary font-medium">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-medium text-foreground">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {event.location} · {event.type}
                    </p>
                  </div>
                </div>
                <span className="px-4 py-2 border border-border rounded-sm text-xs text-muted-foreground">
                  Booked
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Speaking Topics */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="section-container">
          <div className="max-w-2xl mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
              Topics
            </p>
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
                <h3 className="font-serif text-xl font-medium text-foreground mb-3">
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

      {/* Booking Inquiry */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
              Book a Speaker
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground mb-6">
              Interested in Booking LLB for Your Event?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We accept a limited number of speaking engagements each year. 
              Submit an inquiry to check availability and discuss your event.
            </p>
            <Button variant="hero" asChild>
              <Link to="/book">Submit Speaking Inquiry</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Events;
