import { Link } from "react-router-dom";
import { ArrowRight, Download } from "lucide-react";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useCourses, useProducts } from "@/hooks/useCatalog";
import { requestMediaUrl, useEntitlements, useProgress } from "@/hooks/useEntitlements";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { CatalogModule } from "@/integrations/supabase/types";

/** Module rows for every course the student owns, used for the progress bars. */
function useAllModules(courseIds: string[]) {
  return useQuery({
    queryKey: ["catalog", "modules-for", [...courseIds].sort().join(",")],
    enabled: courseIds.length > 0 && Boolean(supabase),
    queryFn: async (): Promise<CatalogModule[]> => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from("catalog_modules")
        .select("*")
        .in("course_id", courseIds);
      if (error) return [];
      return (data as CatalogModule[]) ?? [];
    },
  });
}

const Learn = () => {
  const { user } = useAuth();
  const { data: entitlements, isLoading: entitlementsLoading } = useEntitlements();
  const { data: courses } = useCourses();
  const { data: products } = useProducts();
  const { data: progress } = useProgress();

  const ownedProductIds = new Set(entitlements?.map((row) => row.product_id) ?? []);
  const ownedCourses = (courses ?? []).filter((course) => ownedProductIds.has(course.product_id));
  const { data: modules } = useAllModules(ownedCourses.map((course) => course.id));

  const ebookProduct = products?.find((product) => product.slug === "ebook-7-principles");
  const ownsEbook = Boolean(ebookProduct && ownedProductIds.has(ebookProduct.id));

  const completedModuleIds = new Set(progress?.map((row) => row.module_id) ?? []);

  async function downloadEbook() {
    try {
      const url = await requestMediaUrl({ kind: "ebook" });
      if (!url) {
        toast.info("The e-book is being prepared. It will appear here shortly.");
        return;
      }
      window.open(url, "_blank", "noopener");
    } catch {
      toast.error("We could not open that download. Please try again.");
    }
  }

  return (
    <Layout>
      <PageHeader
        overline="Your Programs"
        title="Learning Dashboard"
        description={user?.email ?? undefined}
      />

      <section className="py-20 lg:py-28">
        <div className="section-container">
          {entitlementsLoading ? (
            <p className="text-sm text-muted-foreground">Loading your programs…</p>
          ) : ownedCourses.length === 0 && !ownsEbook ? (
            <div className="max-w-2xl">
              <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground mb-4">
                No Programs Yet
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Your account does not have an enrolled program. If you have just
                completed a purchase, it may take a moment to appear — refresh
                this page shortly.
              </p>
              <Button variant="hero" asChild>
                <Link to="/courses">
                  Browse Programs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {ownedCourses.map((course) => {
                const courseModules = (modules ?? []).filter(
                  (module) => module.course_id === course.id,
                );
                const completed = courseModules.filter((module) =>
                  completedModuleIds.has(module.id),
                ).length;
                const percent = courseModules.length
                  ? Math.round((completed / courseModules.length) * 100)
                  : 0;

                return (
                  <div
                    key={course.id}
                    className="p-8 bg-card border border-border rounded-sm"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex-1">
                        <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                          {course.title}
                        </h3>
                        {course.subtitle && (
                          <p className="text-sm text-muted-foreground mb-6">
                            {course.subtitle}
                          </p>
                        )}
                        <div className="max-w-md">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                            <span>
                              {completed} of {courseModules.length} modules complete
                            </span>
                            <span className="tabular-nums">{percent}%</span>
                          </div>
                          <Progress value={percent} className="h-1" />
                        </div>
                      </div>
                      <Button variant="hero" className="shrink-0" asChild>
                        <Link to={`/learn/${course.slug}`}>
                          {completed === 0 ? "Start Program" : "Continue"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}

              {ownsEbook && (
                <div className="p-8 bg-card border border-border rounded-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                      Living Life Balanced
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      7 Principles to Restore Faith, Purpose, and Wellness — PDF
                    </p>
                  </div>
                  <Button variant="hero-outline" className="shrink-0" onClick={downloadEbook}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Learn;
