import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";

const categories = [
  {
    name: "Supplements",
    description: "Performance and recovery formulations supporting consulting and education work.",
  },
  {
    name: "Wellness Products",
    description: "Curated tools for daily practice and sustainable habit integration.",
  },
  {
    name: "Merchandise",
    description: "Professional apparel and accessories.",
  },
];

const Shop = () => {
  return (
    <Layout>
      <PageHeader
        overline="Shop"
        title="Products & Merchandise"
        description="Supporting products designed to reinforce LLB Group's consulting and education methodology in practice."
      />

      {/* Categories */}
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="max-w-2xl mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground">
              Product Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div
                key={category.name}
                className="p-8 bg-card border border-border rounded-sm"
              >
                <h3 className="font-serif text-xl font-medium text-foreground mb-3">
                  {category.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {category.description}
                </p>
                <span className="inline-block px-4 py-2 border border-border rounded-sm text-xs text-muted-foreground">
                  Coming Soon
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
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-foreground mb-6">
              Product Availability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              LLB Group products are in development and will be available for 
              purchase in a future release. Product offerings are designed to 
              support—not replace—our consulting and education work.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
