import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

/**
 * Same chrome as every other page, and marked noindex through the route
 * metadata so a dead link never becomes an indexed page.
 */
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <PageHeader
        overline="404"
        title="Page Not Found"
        description="The page you requested does not exist, or it has moved."
      />
      <section className="py-20 lg:py-28">
        <div className="section-container">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" asChild>
              <Link to="/">
                Return Home
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="hero-outline" asChild>
              <Link to="/courses">Browse Programs</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
