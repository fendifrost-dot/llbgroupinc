import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const programs = [
  {
    type: "Certification Programs",
    items: [
      {
        title: "Wellness Strategy Certification",
        duration: "12 weeks",
        format: "Hybrid",
        description:
          "Comprehensive certification for HR leaders and wellness professionals seeking to design and implement organizational wellness programs.",
      },
      {
        title: "Leadership Performance Practitioner",
        duration: "8 weeks",
        format: "Online",
        description:
          "Advanced training for coaches and consultants working with executive clients on sustainable performance practices.",
      },
    ],
  },
  {
    type: "Executive Education",
    items: [
      {
        title: "C-Suite Wellness Intensive",
        duration: "3 days",
        format: "In-Person",
        description:
          "Immersive program for senior executives focused on personal performance optimization and organizational wellness leadership.",
      },
      {
        title: "Board Wellness Governance",
        duration: "1 day",
        format: "Virtual",
        description:
          "Specialized session for board members on wellness oversight, liability, and strategic governance.",
      },
    ],
  },
  {
    type: "Digital Learning",
    items: [
      {
        title: "Foundations of Organizational Wellness",
        duration: "Self-paced",
        format: "On-Demand",
        description:
          "Introductory course covering core concepts, frameworks, and implementation basics for organizational wellness.",
      },
      {
        title: "Stress Resilience for Leaders",
        duration: "Self-paced",
        format: "On-Demand",
        description:
          "Evidence-based techniques for building personal resilience and managing high-pressure environments.",
      },
    ],
  },
];

const Education = () => {
  return (
    <Layout>
      <PageHeader
        overline="Education"
        title="Structured Learning Programs"
        description="LLB Group offers certifications, executive education, and digital curricula designed to build internal capacity for sustainable performance practices."
      />

      {/* Programs */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          {programs.map((category) => (
            <div key={category.type} className="mb-16 last:mb-0">
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-8">
                {category.type}
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {category.items.map((item) => (
                  <div
                    key={item.title}
                    className="p-8 bg-card border border-border rounded-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-serif text-xl font-medium text-foreground">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="px-3 py-1 bg-secondary rounded-sm">
                        {item.duration}
                      </span>
                      <span className="px-3 py-1 bg-secondary rounded-sm">
                        {item.format}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Licensing */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
                Institutional Licensing
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground mb-6">
                Scale Our Curriculum at Your Organization
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                License LLB Group curricula for internal deployment. Ideal for 
                large enterprises, universities, and healthcare systems seeking 
                to build in-house wellness education capacity.
              </p>
              <Button variant="hero-outline" asChild>
                <Link to="/book">Discuss Licensing</Link>
              </Button>
            </div>
            <div className="p-8 bg-background border border-border rounded-sm">
              <h3 className="font-serif text-xl font-medium text-foreground mb-4">
                Licensing Includes
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                  Complete course materials and facilitator guides
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                  Train-the-trainer certification program
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                  Ongoing content updates and support
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                  Custom branding options
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground mb-6">
              Ready to Build Internal Capacity?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Contact us to learn more about our education programs and find 
              the right fit for your organization or professional development goals.
            </p>
            <Button variant="hero" asChild>
              <Link to="/book">Request Program Information</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Education;
