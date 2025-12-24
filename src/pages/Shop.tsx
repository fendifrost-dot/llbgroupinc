import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

const categories = [
  {
    name: "Supplements",
    description: "Research-backed formulations for performance and recovery.",
    count: "Coming Soon",
  },
  {
    name: "Wellness Products",
    description: "Curated tools for daily practice and sustainable habits.",
    count: "Coming Soon",
  },
  {
    name: "Merchandise",
    description: "Premium apparel and accessories.",
    count: "Coming Soon",
  },
];

const Shop = () => {
  return (
    <Layout>
      <PageHeader
        overline="Shop"
        title="Products & Merchandise"
        description="Curated wellness products, supplements, and merchandise from LLB Group."
      />

      {/* Categories */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div
                key={category.name}
                className="p-8 bg-card border border-border rounded-sm text-center"
              >
                <div className="w-16 h-16 bg-secondary rounded-sm mx-auto mb-6" />
                <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                  {category.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {category.description}
                </p>
                <span className="inline-block px-4 py-2 border border-border rounded-sm text-xs text-muted-foreground">
                  {category.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop Notice */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
              Coming Soon
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground mb-6">
              Our Shop is Launching Soon
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We're carefully curating our product offerings to ensure they meet 
              the same standards of quality and evidence-based practice that define 
              all LLB Group services.
            </p>
            <Button variant="hero-outline" disabled>
              Notify Me When Available
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
