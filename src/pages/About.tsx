import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";

const values = [
  {
    title: "Evidence-Based Practice",
    description:
      "Every recommendation is grounded in research and validated through measurable outcomes.",
  },
  {
    title: "Scalable Systems",
    description:
      "We design frameworks that grow with your organization, not solutions that create dependency.",
  },
  {
    title: "Institutional Integrity",
    description:
      "We maintain the highest standards of professional conduct and confidentiality.",
  },
  {
    title: "Sustainable Impact",
    description:
      "Our goal is lasting organizational change, not temporary interventions.",
  },
];

const About = () => {
  return (
    <Layout>
      <PageHeader
        overline="About LLB Group"
        title="Building the Infrastructure for Human Performance"
        description="LLB Group is a wellness consulting, education, and media company dedicated to helping organizations build sustainable systems for leadership effectiveness and human performance."
      />

      {/* Mission Section */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We partner with organizations to design, implement, and scale wellness 
                infrastructure that drives measurable improvements in leadership capacity, 
                organizational resilience, and sustained performance.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Unlike traditional wellness providers focused on individual interventions, 
                LLB Group takes an institutional approach—building systems that create 
                lasting change across entire organizations.
              </p>
            </div>
            <div className="bg-card border border-border rounded-sm p-8 lg:p-12">
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
                Headquarters
              </p>
              <address className="not-italic text-foreground leading-relaxed mb-8">
                69 W. Washington Street<br />
                Suite 1240<br />
                Chicago, IL 60602
              </address>
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
                Founded
              </p>
              <p className="text-foreground">2009</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="section-container">
          <div className="max-w-2xl mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
              Our Values
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground">
              Principles That Guide Our Work
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-8 bg-background border border-border rounded-sm"
              >
                <h3 className="font-serif text-xl font-medium text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-2xl mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
              Leadership
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground">
              Executive Team
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-card border border-border rounded-sm">
              <div className="w-16 h-16 bg-secondary rounded-full mb-6" />
              <h3 className="font-serif text-xl font-medium text-foreground mb-1">
                Founder & CEO
              </h3>
              <p className="text-sm text-muted-foreground">
                Strategic leadership and vision
              </p>
            </div>
            <div className="p-8 bg-card border border-border rounded-sm">
              <div className="w-16 h-16 bg-secondary rounded-full mb-6" />
              <h3 className="font-serif text-xl font-medium text-foreground mb-1">
                Chief Strategy Officer
              </h3>
              <p className="text-sm text-muted-foreground">
                Enterprise partnerships and growth
              </p>
            </div>
            <div className="p-8 bg-card border border-border rounded-sm">
              <div className="w-16 h-16 bg-secondary rounded-full mb-6" />
              <h3 className="font-serif text-xl font-medium text-foreground mb-1">
                Director of Programs
              </h3>
              <p className="text-sm text-muted-foreground">
                Education and curriculum development
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
