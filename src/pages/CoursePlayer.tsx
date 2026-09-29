import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Download, Lock } from "lucide-react";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCourse, useModules } from "@/hooks/useCatalog";
import {
  requestMediaUrl,
  useHasEntitlement,
  useMediaUrl,
  useProgress,
  useToggleProgress,
} from "@/hooks/useEntitlements";
import { formatDuration } from "@/content/catalog";

/**
 * Gated course player — Handoff §4.6.
 *
 * Media never has a client-known URL: every video and audio source is a signed
 * URL minted by get-media-url after a server-side entitlement check. If a user
 * reached this page without an entitlement, the players simply never receive a
 * source.
 */
const CoursePlayer = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const { data: course, isLoading: courseLoading } = useCourse(courseSlug);
  const { data: modules } = useModules(course?.id);
  const { data: progress } = useProgress();
  const { hasEntitlement, isLoading: entitlementLoading } = useHasEntitlement(course?.product_id);
  const toggleProgress = useToggleProgress();

  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  const completedIds = useMemo(
    () => new Set(progress?.map((row) => row.module_id) ?? []),
    [progress],
  );

  // Autoresume: first incomplete module, or the last one if everything is done.
  useEffect(() => {
    if (activeModuleId || !modules?.length || !progress) return;
    const next = modules.find((module) => !completedIds.has(module.id));
    setActiveModuleId(next?.id ?? modules[modules.length - 1].id);
  }, [activeModuleId, modules, progress, completedIds]);

  const activeIndex = modules?.findIndex((module) => module.id === activeModuleId) ?? -1;
  const activeModule = activeIndex >= 0 ? modules![activeIndex] : undefined;
  const isComplete = activeModule ? completedIds.has(activeModule.id) : false;

  const gated = hasEntitlement && Boolean(activeModule);
  const { data: videoUrl, isLoading: videoLoading } = useMediaUrl(
    gated ? { kind: "video", moduleId: activeModule!.id } : null,
  );
  const { data: audioUrl } = useMediaUrl(
    gated ? { kind: "audio", moduleId: activeModule!.id } : null,
  );

  async function downloadWorkbook() {
    if (!courseSlug) return;
    try {
      const url = await requestMediaUrl({ kind: "workbook", courseSlug });
      if (!url) {
        toast.info("The workbook is being prepared. It will appear here shortly.");
        return;
      }
      window.open(url, "_blank", "noopener");
    } catch {
      toast.error("We could not open that download. Please try again.");
    }
  }

  if (courseLoading || entitlementLoading) {
    return (
      <Layout>
        <section className="py-32">
          <div className="section-container">
            <p className="text-sm text-muted-foreground">Loading…</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <section className="py-32">
          <div className="section-container max-w-xl">
            <h1 className="font-serif text-3xl font-semibold text-foreground mb-4">
              Program Not Found
            </h1>
            <Button variant="hero-outline" asChild>
              <Link to="/learn">Back to Your Programs</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  if (!hasEntitlement) {
    return (
      <Layout>
        <section className="py-32">
          <div className="section-container max-w-xl">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Enrollment Required</p>
            <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground mb-4">
              {course.title}
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Your account is not enrolled in this program. If you have just
              purchased it, refresh this page in a moment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" asChild>
                <Link to={`/courses/${course.slug}`}>View Program</Link>
              </Button>
              <Button variant="hero-outline" asChild>
                <Link to="/learn">Your Programs</Link>
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  const moduleLabel = (index: number, title: string) =>
    `${String(index + 1).padStart(2, "0")} — ${title}`;

  return (
    <Layout>
      <section className="py-12 lg:py-16">
        <div className="section-container">
          <Link
            to="/learn"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Your Programs
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
            {/* Module rail (desktop) */}
            <aside className="hidden lg:block">
              <h2 className="text-xs font-bold tracking-widest uppercase text-foreground mb-4">
                {course.title}
              </h2>
              <nav aria-label="Modules">
                <ul className="space-y-1">
                  {(modules ?? []).map((module, index) => {
                    const done = completedIds.has(module.id);
                    const active = module.id === activeModuleId;
                    return (
                      <li key={module.id}>
                        <button
                          type="button"
                          onClick={() => setActiveModuleId(module.id)}
                          aria-current={active ? "true" : undefined}
                          className={cn(
                            "w-full text-left px-4 py-3 rounded-sm text-sm transition-colors flex items-start gap-3",
                            active
                              ? "bg-secondary text-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                          )}
                        >
                          <span className="mt-0.5 flex-shrink-0">
                            {done ? (
                              <Check className="h-4 w-4 text-primary" aria-label="Completed" />
                            ) : (
                              <span className="block h-4 w-4 rounded-full border border-border" />
                            )}
                          </span>
                          <span className="leading-snug">
                            {moduleLabel(index, module.title)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mt-8 pt-8 border-t border-border">
                <Button variant="hero-outline" className="w-full" onClick={downloadWorkbook}>
                  <Download className="mr-2 h-4 w-4" />
                  Workbook
                </Button>
              </div>
            </aside>

            {/* Module dropdown (mobile) */}
            <div className="lg:hidden">
              <label htmlFor="module-select" className="block text-sm text-foreground mb-2">
                Module
              </label>
              <Select value={activeModuleId ?? undefined} onValueChange={setActiveModuleId}>
                <SelectTrigger id="module-select" className="bg-card border-border">
                  <SelectValue placeholder="Select a module" />
                </SelectTrigger>
                <SelectContent>
                  {(modules ?? []).map((module, index) => (
                    <SelectItem key={module.id} value={module.id}>
                      {completedIds.has(module.id) ? "✓ " : ""}
                      {moduleLabel(index, module.title)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Player */}
            <div>
              {activeModule ? (
                <>
                  <div className="rounded-sm border border-border bg-card overflow-hidden">
                    {videoUrl ? (
                      <video
                        key={activeModule.id}
                        controls
                        preload="metadata"
                        playsInline
                        controlsList="nodownload"
                        className="w-full aspect-video bg-black"
                        aria-label={activeModule.title}
                      >
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support embedded video.
                      </video>
                    ) : (
                      <div className="aspect-video flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                          {videoLoading
                            ? "Preparing your lesson…"
                            : "This lesson is being prepared and will appear here shortly."}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8">
                    <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">
                      Module {String(activeIndex + 1).padStart(2, "0")} ·{" "}
                      {formatDuration(activeModule.duration_seconds)}
                    </p>
                    <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground mb-4">
                      {activeModule.title}
                    </h1>
                    {activeModule.summary && (
                      <p className="text-muted-foreground leading-relaxed max-w-2xl">
                        {activeModule.summary}
                      </p>
                    )}
                  </div>

                  {audioUrl && (
                    <div className="mt-8 p-6 bg-card border border-border rounded-sm">
                      <p className="text-xs font-medium tracking-widest uppercase text-foreground mb-4">
                        Audio Version
                      </p>
                      <audio
                        key={`${activeModule.id}-audio`}
                        controls
                        preload="none"
                        className="w-full"
                        aria-label={`${activeModule.title} — audio`}
                      >
                        <source src={audioUrl} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Button
                      variant={isComplete ? "hero-outline" : "hero"}
                      disabled={toggleProgress.isPending}
                      onClick={() =>
                        toggleProgress.mutate({
                          moduleId: activeModule.id,
                          completed: !isComplete,
                        })
                      }
                    >
                      {isComplete ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Completed
                        </>
                      ) : (
                        "Mark Complete"
                      )}
                    </Button>
                    <Button
                      variant="hero-outline"
                      className="lg:hidden"
                      onClick={downloadWorkbook}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Workbook
                    </Button>
                  </div>

                  {/* Prev / next */}
                  <div className="mt-12 pt-8 border-t border-border flex items-center justify-between gap-4">
                    {activeIndex > 0 ? (
                      <button
                        type="button"
                        onClick={() => setActiveModuleId(modules![activeIndex - 1].id)}
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                      </button>
                    ) : (
                      <span />
                    )}
                    {modules && activeIndex < modules.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setActiveModuleId(modules[activeIndex + 1].id)}
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    ) : (
                      <span />
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  This program's modules are being prepared.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CoursePlayer;
