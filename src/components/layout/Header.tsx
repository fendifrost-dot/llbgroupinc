import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "About", href: "/about" },
  { name: "Consulting", href: "/consulting" },
  { name: "Solutions", href: "/solutions" },
  { name: "Events", href: "/events" },
  { name: "Education", href: "/education" },
  { name: "Media", href: "/media" },
  { name: "Shop", href: "/shop" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <nav className="section-container flex items-center justify-between py-4 lg:py-5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            LLB
          </span>
          <span className="hidden sm:inline text-xs text-muted-foreground tracking-widest uppercase">
            Group
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
                location.pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <Button variant="hero" asChild>
            <Link to="/book">Engage LLB</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
                  location.pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-border">
              <Button variant="hero" className="w-full" asChild>
                <Link to="/book" onClick={() => setMobileMenuOpen(false)}>
                  Engage LLB
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
