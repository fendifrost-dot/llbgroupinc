import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

const CheckoutCancelled = () => (
  <Layout>
    <PageHeader
      overline="Checkout"
      title="Enrollment Not Completed"
      description="No payment was taken and nothing was charged to your card."
    />

    <section className="py-20 lg:py-28">
      <div className="section-container">
        <div className="max-w-2xl">
          <p className="text-muted-foreground leading-relaxed mb-8">
            You can return to the program whenever you are ready. If something
            went wrong during checkout, or you have a question before enrolling,
            we are glad to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" asChild>
              <Link to="/courses">Browse Programs</Link>
            </Button>
            <Button variant="hero-outline" asChild>
              <Link to="/book">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default CheckoutCancelled;
