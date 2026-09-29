import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { MAIN_SITE } from "@/content/site";

// Learn platform only. LLB Group's own pages live on the main site.
const navigation = [
  { name: "Programs", href: "/courses" },
  { name: "E-Book", href: "/shop#ebook" },
  { name: "Shop", href: "/shop" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const account = user
    ? { name: "My Learning", href: "/learn" }
    : { name: "Sign In", href: "/signin" };

  const isActive = (href: string) =>
    location.pathname + location.hash === href ||
    (href === "/courses" && location.pathname.startsWith("/courses/"));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <nav className="section-container flex items-center justify-between py-4 lg:py-5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <span className="font-serif text-2xl font-semibold tracking-[0.04em] text-foreground">
            LLB
          </span>
          <span className="hidden sm:inline text-xs text-muted-foreground tracking-widest uppercase">
            Learn
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "text-sm tracking-wide transition-colors duration-200 link-underline",
                isActive(item.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
          <a
            href={MAIN_SITE}
            className="inline-flex items-center gap-1 text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            LLB Group
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <Button variant="hero" asChild>
            <Link to={account.href}>{account.name}</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-b border-border">
          <div className="section-container py-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block text-lg py-2 transition-colors",
                  isActive(item.href) ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
            <a
              href={MAIN_SITE}
              className="flex items-center gap-1 text-lg py-2 text-muted-foreground"
            >
              LLB Group
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <div className="pt-4 border-t border-border">
              <Button variant="hero" className="w-full" asChild>
                <Link to={account.href} onClick={() => setMobileMenuOpen(false)}>
                  {account.name}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
