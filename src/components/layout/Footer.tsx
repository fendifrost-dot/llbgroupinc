import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { COURSES, BUNDLE } from "@/content/catalog";
import { MAIN_SITE, MAIN_SITE_BOOK } from "@/content/site";

const footerLinks = {
  programs: [
    ...COURSES.map((course) => ({ name: course.title, href: `/courses/${course.slug}` })),
    { name: BUNDLE.title, href: `/courses/${BUNDLE.slug}` },
  ],
  store: [
    { name: "All Programs", href: "/courses" },
    { name: "E-Book", href: "/shop#ebook" },
    { name: "Shop", href: "/shop" },
  ],
  students: [
    { name: "Sign In", href: "/signin" },
    { name: "My Learning", href: "/learn" },
    { name: "Account", href: "/account" },
  ],
};

// LLB Group's own pages live on the main site; we link out, never duplicate.
const externalLinks = [
  { name: "LLB Group", href: MAIN_SITE },
  { name: "Book a Consultation", href: MAIN_SITE_BOOK },
  { name: "Contact", href: MAIN_SITE_BOOK },
];

const linkClass = "text-sm text-muted-foreground hover:text-foreground transition-colors";

function FooterColumn({ title, links }: { title: string; links: { name: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-xs font-bold tracking-widest uppercase text-foreground mb-4">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <Link to={link.href} className={linkClass}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="band-dark border-t border-border/20">
      <div className="section-container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-semibold tracking-[0.04em] text-foreground">
                LLB
              </span>
              <span className="ml-2 text-xs text-muted-foreground tracking-widest uppercase">
                Learn
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Self-paced programs from LLB Group, Inc., with Alonzo Waheed.
            </p>
            <address className="mt-6 text-sm text-muted-foreground not-italic leading-relaxed">
              69 W. Washington Street<br />
              Suite 1240<br />
              Chicago, IL 60602
            </address>
          </div>

          <FooterColumn title="Programs" links={footerLinks.programs} />
          <FooterColumn title="Store" links={footerLinks.store} />
          <FooterColumn title="Students" links={footerLinks.students} />

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-foreground mb-4">
              LLB Group
            </h4>
            <ul className="space-y-3">
              {externalLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className={`${linkClass} inline-flex items-center gap-1`}>
                    {link.name}
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </a>
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
