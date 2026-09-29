import { ReactNode, useState } from "react";
import { useImageAvailable } from "@/hooks/useImageAvailable";
import { BookOpen, Headphones, Infinity as InfinityIcon, PlayCircle } from "lucide-react";

interface ShowcaseModule {
  id: string;
  sort: number;
  title: string;
}

interface CourseShowcaseProps {
  title: string;
  subtitle: string;
  modules: ShowcaseModule[];
  /** Trailer URL, if one exists. A missing or unplayable file falls back quietly. */
  trailerSrc?: string | null;
  /** Still shown before the trailer plays; used only if the file exists. */
  posterSrc?: string | null;
  cta?: ReactNode;
}

const FEATURES = [
  { icon: PlayCircle, label: "Six video lessons" },
  { icon: Headphones, label: "Audio edition of every lesson" },
  { icon: BookOpen, label: "Companion workbook" },
  { icon: InfinityIcon, label: "Lifetime access" },
];

/**
 * The sales page's second section. It always shows what the buyer is getting,
 * so it never falls back to a "coming soon" placeholder. When a trailer is
 * available it plays above the program overview; if the file is missing or
 * can't be played, the video is dropped and only the overview shows.
 */
export function CourseShowcase({ title, subtitle, modules, trailerSrc, posterSrc, cta }: CourseShowcaseProps) {
  const [trailerFailed, setTrailerFailed] = useState(false);
  const showTrailer = Boolean(trailerSrc) && !trailerFailed;
  const hasPoster = useImageAvailable(showTrailer ? posterSrc : null);

  return (
    <div className="space-y-8">
      {showTrailer && (
        <video
          src={trailerSrc!}
          poster={hasPoster ? posterSrc! : undefined}
          controls
          preload="metadata"
          playsInline
          onError={() => setTrailerFailed(true)}
          className="w-full aspect-video border border-border bg-[hsl(var(--band))]"
          aria-label={`${title} program trailer`}
        />
      )}

      <div className="band-dark relative overflow-hidden border border-border/20">
        {/* Hairline brass frame, inset, echoing the print materials */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 sm:inset-4 border border-primary/40"
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 p-8 sm:p-12 lg:p-16">
          <div className="lg:col-span-2 flex flex-col">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">
              Inside the Program
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold tracking-[0.04em] leading-tight">
              {title}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{subtitle}</p>

            <ul className="mt-8 space-y-4">
              {FEATURES.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm">
                  <Icon className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>

            {cta && <div className="mt-10">{cta}</div>}
          </div>

          <ol className="lg:col-span-3 divide-y divide-[hsl(var(--band-foreground)/0.15)]">
            {modules.map((module) => (
              <li key={module.id} className="flex items-baseline gap-5 py-4 first:pt-0 last:pb-0">
                <span className="font-serif text-2xl text-primary tabular-nums w-10 flex-shrink-0">
                  {String(module.sort).padStart(2, "0")}
                </span>
                <span className="font-serif text-lg tracking-[0.04em] uppercase leading-snug">
                  {module.title}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
