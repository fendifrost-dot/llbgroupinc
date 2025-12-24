import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90 rounded-md",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 rounded-md",
        outline: "border border-border bg-transparent text-foreground hover:bg-secondary hover:text-foreground rounded-md",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 rounded-md",
        ghost: "text-foreground hover:bg-secondary hover:text-foreground rounded-md",
        link: "text-primary underline-offset-4 hover:underline",
        // Custom variants for LLB
        hero: "bg-primary text-primary-foreground font-medium tracking-wide uppercase text-xs px-8 py-4 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 rounded-sm",
        "hero-outline": "border border-foreground/20 bg-transparent text-foreground font-medium tracking-wide uppercase text-xs px-8 py-4 hover:border-foreground/40 hover:bg-foreground/5 rounded-sm",
        nav: "text-muted-foreground hover:text-foreground bg-transparent text-sm tracking-wide",
        minimal: "text-foreground/70 hover:text-foreground bg-transparent text-sm underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
