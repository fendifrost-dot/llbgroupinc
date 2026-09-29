import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";

const operatingPrinciples = [
  {
    title: "Framework-Driven Delivery",
    description:
      "All engagements are structured around repeatable methodologies designed for measurable outcomes and institutional adoption.",
  },
  {
    title: "Scalable Infrastructure",
    description:
      "We design systems that grow with your organization—building capacity, not dependency.",
  },
  {
    title: "Multi-Channel Distribution",
    description:
      "Our work spans consulting, education, and media—allowing impact to reach organizations, communities, and individuals at scale.",
  },
  {
    title: "Long-Term Alignment",
    description:
      "We prioritize sustainable outcomes over short-term interventions, partnering for lasting organizational change.",
  },
];

const About = () => {
  return (
    <Layout>
      <PageHeader
        overline="About"
        title="LLB Group, Inc."
        description="LLB Group is a wellness consulting, education, and media company focused on sustainable human performance at organizational scale."
      />

      {/* Overview Section */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground mb-6">
                What We Do
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                LLB Group, Inc. operates at the intersection of wellness strategy, leadership 
                development, and human performance. We partner with organizations to design, 
                implement, and scale infrastructure that drives measurable gains in 
                leadership effectiveness, workforce resilience, and long-term execution.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our work is delivered through three integrated channels: strategic consulting 
                for institutions, structured education programs, and supporting products and 
                experiences—each reinforcing the others to create sustainable adoption.
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
                Legal Entity
              </p>
              <p className="text-foreground">LLB Group, Inc.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Exist Section */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="section-container">
          <div className="max-w-3xl">
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground mb-6">
              Why LLB Group Exists
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Organizations face increasing pressure to sustain performance while 
              preserving the well-being of their leadership and workforce. Traditional 
              approaches to wellness remain fragmented—isolated initiatives that fail 
              to integrate with operational strategy or scale across the enterprise.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              LLB Group was founded to address this gap: building the infrastructure, 
              frameworks, and education systems that allow wellness and performance to 
              operate as a unified, scalable function within institutions.
            </p>
          </div>
        </div>
      </section>

      {/* Operating Principles Section */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-2xl mb-16">
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground">
              How We Operate
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {operatingPrinciples.map((principle) => (
              <div
                key={principle.title}
                className="p-8 bg-card border border-border rounded-sm"
              >
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                  {principle.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="section-container">
          <div className="max-w-3xl">
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground mb-6">
              Long-Term Vision
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              LLB Group is building toward a future where wellness infrastructure 
              is a standard component of organizational strategy—integrated into 
              leadership development, operational planning, and institutional 
              governance.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Through our consulting, education, and product ecosystem, we aim 
              to establish repeatable frameworks and scalable intellectual property 
              that can be adopted, licensed, and distributed across industries, 
              institutions, and markets.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-2xl mb-16">
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground">
              Leadership
            </h2>
            <p className="text-muted-foreground leading-relaxed mt-4">
              LLB Group is led by a team with experience spanning executive advisory, 
              organizational development, and wellness strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-card border border-border rounded-sm">
              <div className="w-16 h-16 bg-secondary rounded-full mb-6" />
              <h3 className="font-serif text-xl font-semibold text-foreground mb-1">
                Founder & Chief Executive
              </h3>
              <p className="text-sm text-muted-foreground">
                Strategic direction and institutional partnerships
              </p>
            </div>
            <div className="p-8 bg-card border border-border rounded-sm">
              <div className="w-16 h-16 bg-secondary rounded-full mb-6" />
              <h3 className="font-serif text-xl font-semibold text-foreground mb-1">
                Chief Strategy Officer
              </h3>
              <p className="text-sm text-muted-foreground">
                Enterprise development and operational growth
              </p>
            </div>
            <div className="p-8 bg-card border border-border rounded-sm">
              <div className="w-16 h-16 bg-secondary rounded-full mb-6" />
              <h3 className="font-serif text-xl font-semibold text-foreground mb-1">
                Director of Education
              </h3>
              <p className="text-sm text-muted-foreground">
                Curriculum development and program delivery
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
