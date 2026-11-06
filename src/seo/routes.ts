/**
 * Page metadata and structured data for every public route.
 *
 * One source of truth, used twice:
 *  - at runtime by <Seo /> (src/components/seo/Seo.tsx), which updates the
 *    document head on every navigation, and
 *  - at build time by plugins/seo-pages.ts, which writes a static HTML shell
 *    per route plus sitemap.xml, robots.txt and llms.txt, so crawlers that do
 *    not execute JavaScript (most AI crawlers) still see the right title,
 *    description and JSON-LD.
 *
 * This module must stay free of browser globals and of `import.meta.env`
 * because the build plugin imports it under Node. Use relative imports only.
 */

import {
  BUNDLE,
  BUNDLE_FAQ,
  COURSES,
  EBOOK,
  INCLUDED,
  INSTRUCTOR,
  PRICES_APPROVED,
  type CatalogEntry,
} from "../content/catalog";
import { MAIN_SITE, MAIN_SITE_BOOK, ORGANIZATION, SITE_NAME } from "../content/site";
import { EBOOK_MOCKUP, courseCover } from "../content/media";

export interface SeoImage {
  /** Site-relative path, e.g. /images/courses/llb-complete.jpg */
  path: string;
  width: number;
  height: number;
  alt: string;
}

export interface RouteMeta {
  /** Canonical path, no trailing slash (except "/"). */
  path: string;
  /** Full document title. */
  title: string;
  description: string;
  image: SeoImage;
  ogType: "website" | "article";
  /** Gated or transactional pages are kept out of search engines. */
  noindex?: boolean;
  /** Plain-text summary for non-JS crawlers and llms.txt. */
  summary: string[];
  /** JSON-LD nodes. `origin` is the absolute origin the page is served from. */
  jsonLd: (origin: string) => Record<string, unknown>[];
}

type JsonLd = Record<string, unknown>;

const DEFAULT_IMAGE: SeoImage = {
  path: courseCover(BUNDLE.slug),
  width: 1792,
  height: 1008,
  alt: "Living Life Balanced: Balanced Living Blueprint, Justice Advocacy and Faith Over Fear",
};

const EBOOK_IMAGE: SeoImage = {
  path: EBOOK_MOCKUP,
  width: 1152,
  height: 1728,
  alt: `${EBOOK.title} e-book cover`,
};

const coverImage = (course: CatalogEntry): SeoImage => ({
  path: courseCover(course.slug),
  width: 1152,
  height: 1728,
  alt: `${course.title} program cover`,
});

export const abs = (origin: string, path: string) => `${origin.replace(/\/$/, "")}${path}`;

const money = (cents: number) => (cents / 100).toFixed(2);

/** ISO 8601 duration, e.g. PT2H30M. */
export function isoDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.round((totalSeconds % 3600) / 60);
  return `PT${hours ? `${hours}H` : ""}${minutes ? `${minutes}M` : hours ? "" : "0M"}`;
}

/** Lesson video time plus roughly twenty minutes of workbook per module. */
export function courseWorkloadSeconds(course: CatalogEntry): number {
  return course.modules.reduce((sum, module) => sum + module.durationSeconds + 20 * 60, 0);
}

// ---------------------------------------------------------------------------
// Shared nodes
// ---------------------------------------------------------------------------

const orgId = (origin: string) => `${abs(origin, "/")}#organization`;
const personId = (origin: string) => `${abs(origin, "/")}#alonzo-waheed`;
const siteId = (origin: string) => `${abs(origin, "/")}#website`;

export function organizationNode(origin: string): JsonLd {
  return {
    "@type": "Organization",
    "@id": orgId(origin),
    name: ORGANIZATION.name,
    alternateName: ORGANIZATION.shortName,
    url: ORGANIZATION.url,
    logo: abs(origin, DEFAULT_IMAGE.path),
    address: {
      "@type": "PostalAddress",
      streetAddress: ORGANIZATION.streetAddress,
      addressLocality: ORGANIZATION.addressLocality,
      addressRegion: ORGANIZATION.addressRegion,
      postalCode: ORGANIZATION.postalCode,
      addressCountry: ORGANIZATION.addressCountry,
    },
    founder: { "@id": personId(origin) },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: MAIN_SITE_BOOK,
    },
  };
}

export function personNode(origin: string): JsonLd {
  return {
    "@type": "Person",
    "@id": personId(origin),
    name: INSTRUCTOR.name,
    jobTitle: INSTRUCTOR.role,
    description: INSTRUCTOR.bio,
    worksFor: { "@id": orgId(origin) },
    url: MAIN_SITE,
  };
}

export function websiteNode(origin: string): JsonLd {
  return {
    "@type": "WebSite",
    "@id": siteId(origin),
    name: SITE_NAME,
    alternateName: `${SITE_NAME} by ${ORGANIZATION.shortName}`,
    url: abs(origin, "/"),
    inLanguage: "en-US",
    publisher: { "@id": orgId(origin) },
  };
}

function webPageNode(origin: string, meta: Pick<RouteMeta, "path" | "title" | "description" | "image">): JsonLd {
  return {
    "@type": "WebPage",
    "@id": abs(origin, meta.path),
    url: abs(origin, meta.path),
    name: meta.title,
    description: meta.description,
    isPartOf: { "@id": siteId(origin) },
    primaryImageOfPage: abs(origin, meta.image.path),
    inLanguage: "en-US",
  };
}

function breadcrumbNode(origin: string, items: { name: string; path: string }[]): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: abs(origin, item.path),
    })),
  };
}

function faqNode(faq: { question: string; answer: string }[]): JsonLd {
  return {
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

function offerNode(origin: string, path: string, priceCents: number): JsonLd {
  return {
    "@type": "Offer",
    url: abs(origin, path),
    price: money(priceCents),
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    category: "Paid",
    seller: { "@id": orgId(origin) },
  };
}

/** Offers are only published once the prices are approved and visible on the site. */
const offers = (origin: string, path: string, priceCents: number) =>
  PRICES_APPROVED ? { offers: offerNode(origin, path, priceCents) } : {};

export function courseNode(origin: string, course: CatalogEntry): JsonLd {
  const path = `/courses/${course.slug}`;
  return {
    "@type": "Course",
    "@id": `${abs(origin, path)}#course`,
    name: course.title,
    alternateName: course.subtitle,
    description: course.description,
    url: abs(origin, path),
    image: abs(origin, courseCover(course.slug)),
    provider: { "@id": orgId(origin) },
    publisher: { "@id": orgId(origin) },
    inLanguage: "en",
    isAccessibleForFree: false,
    educationalLevel: "Beginner",
    coursePrerequisites: "None",
    teaches: course.outcomes,
    about: course.eyebrow,
    syllabusSections: course.modules.map((module) => ({
      "@type": "Syllabus",
      name: `${module.sort}. ${module.title}`,
      description: module.summary,
      timeRequired: isoDuration(module.durationSeconds),
    })),
    hasCourseInstance: [
      {
        "@type": "CourseInstance",
        courseMode: "Online",
        courseWorkload: isoDuration(courseWorkloadSeconds(course)),
        instructor: { "@id": personId(origin) },
      },
    ],
    ...offers(origin, path, course.priceCents),
  };
}

export function ebookNode(origin: string): JsonLd {
  const path = "/shop#ebook";
  return {
    "@type": "Book",
    "@id": `${abs(origin, "/shop")}#ebook`,
    name: EBOOK.title,
    alternateName: EBOOK.subtitle,
    description: EBOOK.description,
    url: abs(origin, path),
    image: abs(origin, EBOOK_MOCKUP),
    author: { "@id": personId(origin) },
    publisher: { "@id": orgId(origin) },
    bookFormat: "https://schema.org/EBook",
    inLanguage: "en",
    ...offers(origin, path, EBOOK.priceCents),
  };
}

export function bundleNode(origin: string): JsonLd {
  const path = `/courses/${BUNDLE.slug}`;
  return {
    "@type": "Product",
    "@id": `${abs(origin, path)}#bundle`,
    name: BUNDLE.title,
    description: BUNDLE.description,
    url: abs(origin, path),
    image: abs(origin, courseCover(BUNDLE.slug)),
    brand: { "@id": orgId(origin) },
    category: "Online course bundle",
    isRelatedTo: [
      ...COURSES.map((course) => ({ "@id": `${abs(origin, `/courses/${course.slug}`)}#course` })),
      { "@id": `${abs(origin, "/shop")}#ebook` },
    ],
    ...offers(origin, path, BUNDLE.priceCents),
  };
}

function courseListNode(origin: string, name: string): JsonLd {
  return {
    "@type": "ItemList",
    name,
    itemListElement: COURSES.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: abs(origin, `/courses/${course.slug}`),
      name: course.title,
    })),
  };
}

const graph = (nodes: JsonLd[]): JsonLd[] => [{ "@context": "https://schema.org", "@graph": nodes }];

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

const PROGRAM_SUMMARY = [
  `${SITE_NAME} is the self-paced learning platform of ${ORGANIZATION.name}, led by ${INSTRUCTOR.name}.`,
  `Three six-module programs: ${COURSES.map((course) => `${course.title} (${course.subtitle})`).join("; ")}.`,
  `Every program includes: ${INCLUDED.join("; ")}.`,
  `${BUNDLE.title}: ${BUNDLE.subtitle}.`,
  `${EBOOK.title}: ${EBOOK.subtitle}, delivered as a PDF.`,
  `Speaking, consulting and booking are on the main site, ${MAIN_SITE}.`,
];

function courseRoute(course: CatalogEntry): RouteMeta {
  const path = `/courses/${course.slug}`;
  return {
    path,
    title: `${course.title}: ${course.subtitle} | ${SITE_NAME}`,
    description: course.description,
    image: coverImage(course),
    ogType: "article",
    summary: [
      `${course.title}: ${course.subtitle}. ${course.description}`,
      `Instructor: ${INSTRUCTOR.name}, ${INSTRUCTOR.role}.`,
      `Modules: ${course.modules.map((module) => `${module.sort}. ${module.title}`).join("; ")}.`,
      `What you will learn: ${course.outcomes.join("; ")}.`,
      `Included: ${INCLUDED.join("; ")}.`,
      ...course.faq.map((item) => `${item.question} ${item.answer}`),
    ],
    jsonLd: (origin) =>
      graph([
        organizationNode(origin),
        personNode(origin),
        websiteNode(origin),
        webPageNode(origin, { path, title: `${course.title}: ${course.subtitle}`, description: course.description, image: coverImage(course) }),
        breadcrumbNode(origin, [
          { name: "Home", path: "/" },
          { name: "Programs", path: "/courses" },
          { name: course.title, path },
        ]),
        courseNode(origin, course),
        faqNode(course.faq),
      ]),
  };
}

const HOME: RouteMeta = {
  path: "/",
  title: `${SITE_NAME} | Self-Paced Programs with ${INSTRUCTOR.name} | ${ORGANIZATION.shortName}`,
  description: `Self-paced programs from ${ORGANIZATION.shortName} with ${INSTRUCTOR.name}: Balanced Living Blueprint, Justice Advocacy and Faith Over Fear. Video lessons, audio editions and companion workbooks, with lifetime access.`,
  image: DEFAULT_IMAGE,
  ogType: "website",
  summary: PROGRAM_SUMMARY,
  jsonLd: (origin) =>
    graph([
      organizationNode(origin),
      personNode(origin),
      websiteNode(origin),
      webPageNode(origin, HOME),
      courseListNode(origin, "Programs"),
      ...COURSES.map((course) => courseNode(origin, course)),
      bundleNode(origin),
      ebookNode(origin),
    ]),
};

const COURSES_ROUTE: RouteMeta = {
  path: "/courses",
  title: `Self-Paced Programs | ${SITE_NAME}`,
  description: `Three six-module programs adapted from ${ORGANIZATION.shortName}'s institutional curriculum: Balanced Living Blueprint, Justice Advocacy and Faith Over Fear. Video and audio instruction with a companion workbook, plus the complete bundle.`,
  image: DEFAULT_IMAGE,
  ogType: "website",
  summary: PROGRAM_SUMMARY,
  jsonLd: (origin) =>
    graph([
      organizationNode(origin),
      personNode(origin),
      websiteNode(origin),
      webPageNode(origin, COURSES_ROUTE),
      breadcrumbNode(origin, [
        { name: "Home", path: "/" },
        { name: "Programs", path: "/courses" },
      ]),
      courseListNode(origin, "Self-Paced Programs"),
      ...COURSES.map((course) => courseNode(origin, course)),
      bundleNode(origin),
    ]),
};

const BUNDLE_ROUTE: RouteMeta = {
  path: `/courses/${BUNDLE.slug}`,
  title: `${BUNDLE.title}: ${BUNDLE.subtitle} | ${SITE_NAME}`,
  description: BUNDLE.description,
  image: DEFAULT_IMAGE,
  ogType: "article",
  summary: [
    `${BUNDLE.title}: ${BUNDLE.subtitle}. ${BUNDLE.description}`,
    `Includes: ${COURSES.map((course) => course.title).join(", ")} and the ${EBOOK.title} e-book.`,
    ...BUNDLE_FAQ.map((item) => `${item.question} ${item.answer}`),
  ],
  jsonLd: (origin) =>
    graph([
      organizationNode(origin),
      personNode(origin),
      websiteNode(origin),
      webPageNode(origin, BUNDLE_ROUTE),
      breadcrumbNode(origin, [
        { name: "Home", path: "/" },
        { name: "Programs", path: "/courses" },
        { name: BUNDLE.title, path: `/courses/${BUNDLE.slug}` },
      ]),
      bundleNode(origin),
      ...COURSES.map((course) => courseNode(origin, course)),
      ebookNode(origin),
      faqNode(BUNDLE_FAQ),
    ]),
};

const SHOP: RouteMeta = {
  path: "/shop",
  title: `Programs & Publications | ${SITE_NAME}`,
  description: `Digital programs and publications from ${ORGANIZATION.shortName}: the three self-paced programs, the ${BUNDLE.title}, and the ${EBOOK.title} e-book (${EBOOK.subtitle}).`,
  image: EBOOK_IMAGE,
  ogType: "website",
  summary: [
    ...PROGRAM_SUMMARY,
    `${EBOOK.title}: ${EBOOK.description}`,
  ],
  jsonLd: (origin) =>
    graph([
      organizationNode(origin),
      personNode(origin),
      websiteNode(origin),
      webPageNode(origin, SHOP),
      breadcrumbNode(origin, [
        { name: "Home", path: "/" },
        { name: "Shop", path: "/shop" },
      ]),
      courseListNode(origin, "Self-Paced Programs"),
      bundleNode(origin),
      ebookNode(origin),
    ]),
};

const legalRoute = (path: string, name: string, description: string): RouteMeta => {
  const meta: RouteMeta = {
    path,
    title: `${name} | ${SITE_NAME}`,
    description,
    image: DEFAULT_IMAGE,
    ogType: "website",
    summary: [description],
    jsonLd: (origin) => graph([organizationNode(origin), websiteNode(origin), webPageNode(origin, meta)]),
  };
  return meta;
};

const PRIVACY = legalRoute(
  "/privacy",
  "Privacy Policy",
  `How ${ORGANIZATION.name} handles information collected through the ${SITE_NAME} learning platform.`,
);

const TERMS = legalRoute(
  "/terms",
  "Terms of Service",
  `The terms that apply when you use the ${SITE_NAME} learning platform or enrol in an ${ORGANIZATION.shortName} program.`,
);

const privateRoute = (path: string, name: string, description: string): RouteMeta => ({
  path,
  title: `${name} | ${SITE_NAME}`,
  description,
  image: DEFAULT_IMAGE,
  ogType: "website",
  noindex: true,
  summary: [description],
  jsonLd: () => [],
});

/** Public, indexable routes. Order is the sitemap order. */
export const PUBLIC_ROUTES: RouteMeta[] = [
  HOME,
  COURSES_ROUTE,
  ...COURSES.map(courseRoute),
  BUNDLE_ROUTE,
  SHOP,
  PRIVACY,
  TERMS,
];

const PRIVATE_ROUTES: RouteMeta[] = [
  privateRoute("/signin", "Student Sign In", `Sign in to your ${SITE_NAME} student account.`),
  privateRoute("/account", "Account", "Manage your student account."),
  privateRoute("/learn", "Learning Dashboard", "Your enrolled programs."),
  privateRoute("/checkout/success", "Enrollment Confirmed", "Your payment was received."),
  privateRoute("/checkout/cancelled", "Enrollment Not Completed", "No payment was taken."),
];

export const NOT_FOUND: RouteMeta = privateRoute("/404", "Page Not Found", "The page you requested does not exist.");

const ALL_ROUTES = [...PUBLIC_ROUTES, ...PRIVATE_ROUTES];

/** Strip a trailing slash so "/courses/" and "/courses" share one canonical. */
export function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function getRouteMeta(pathname: string): RouteMeta {
  const path = normalizePath(pathname);
  const exact = ALL_ROUTES.find((route) => route.path === path);
  if (exact) return exact;
  if (path.startsWith("/learn/")) {
    return privateRoute(path, "Course Player", "Your program lessons.");
  }
  return { ...NOT_FOUND, path };
}
