import { cn } from "@/lib/utils";
import { useImageAvailable } from "@/hooks/useImageAvailable";

interface OptionalImageProps {
  src: string;
  alt: string;
  /** Classes for the wrapper, which sets the frame and aspect ratio. */
  className?: string;
  /** Classes for the <img> itself, e.g. object-contain for mockups. */
  imgClassName?: string;
}

/** Renders nothing until the image exists, so empty slots leave no gap. */
export function OptionalImage({ src, alt, className, imgClassName }: OptionalImageProps) {
  const available = useImageAvailable(src);
  if (!available) return null;

  return (
    <div className={cn("overflow-hidden", className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </div>
  );
}
