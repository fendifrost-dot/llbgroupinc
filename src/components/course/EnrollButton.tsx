import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/useCheckout";
import { useHasEntitlement } from "@/hooks/useEntitlements";
import { useAuth } from "@/hooks/useAuth";

interface EnrollButtonProps {
  productSlug: string;
  productId?: string;
  /** Course slug, so an owner can be sent straight into the player. */
  courseSlug?: string;
  label?: string;
  variant?: "hero" | "hero-outline";
  className?: string;
}

/**
 * One button, three states: already own it, ready to buy, or purchase in
 * flight. The owned state is a rendering nicety — access itself is enforced by
 * RLS and the media edge function, not here.
 */
export function EnrollButton({
  productSlug,
  productId,
  courseSlug,
  label = "Enroll Now",
  variant = "hero",
  className,
}: EnrollButtonProps) {
  const { user } = useAuth();
  const { hasEntitlement } = useHasEntitlement(productId);
  const { startCheckout, isPending } = useCheckout();

  if (user && hasEntitlement) {
    return (
      <Button variant={variant} className={className} asChild>
        <Link to={courseSlug ? `/learn/${courseSlug}` : "/learn"}>
          Continue Program
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      className={className}
      disabled={isPending(productSlug)}
      onClick={() => startCheckout(productSlug)}
    >
      {isPending(productSlug) ? "Opening checkout…" : label}
    </Button>
  );
}
