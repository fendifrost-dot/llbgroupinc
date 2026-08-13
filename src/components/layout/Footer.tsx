import { Link } from "react-router-dom";

const footerLinks = {
  company: [
    { name: "About", href: "/about" },
    { name: "Consulting", href: "/consulting" },
    { name: "Solutions", href: "/solutions" },
    { name: "Media", href: "/media" },
  ],
  programs: [
    { name: "Education", href: "/education" },
    { name: "Self-Paced Programs", href: "/courses" },
    { name: "Events & Speaking", href: "/events" },
    { name: "Shop", href: "/shop" },
  ],
  connect: [
    { name: "Book a Consultation", href: "/book" },
    { name: "Contact", href: "/book" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="section-container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                LLB
              </span>
              <span className="ml-2 text-xs text-muted-foreground tracking-widest uppercase">
                Group, Inc.
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Wellness strategy, human performance, and leadership development at scale.
            </p>
            <address className="mt-6 text-sm text-muted-foreground not-italic leading-relaxed">
              69 W. Washington Street<br />
              Suite 1240<br />
              Chicago, IL 60602
            </address>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase text-foreground mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs Links */}
          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase text-foreground mb-4">
              Programs
            </h4>
            <ul className="space-y-3">
              {footerLinks.programs.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Links */}
          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase text-foreground mb-4">
              Connect
            </h4>
            <ul className="space-y-3">
              {footerLinks.connect.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} LLB Group, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {/* Student access lives here, not in the corporate header nav. */}
            <Link to="/signin" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Student Sign In
            </Link>
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
