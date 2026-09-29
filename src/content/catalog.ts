/**
 * Marketing copy for the course storefront.
 *
 * Two jobs:
 *  1. Holds the copy that has no home in the database (outcomes, FAQ, the
 *     "what's included" list, instructor framing).
 *  2. Acts as the render source when the backend is unreachable, so the sales
 *     pages stay up rather than showing an empty catalog.
 *
 * Prices here mirror the seed migration and are the handoff's placeholders —
 * the database is authoritative once it is connected. Tone follows Handoff
 * §0.3: warmer than the corporate pages, still dignified. No hype, no emojis.
 */

import type { ProductType } from "@/integrations/supabase/types";

export interface CatalogModuleContent {
  sort: number;
  title: string;
  summary: string;
  durationSeconds: number;
}

export interface CatalogEntry {
  slug: string;
  productSlug: string;
  type: ProductType;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  priceCents: number;
  outcomes: string[];
  modules: CatalogModuleContent[];
  faq: { question: string; answer: string }[];
  /** Trailer shipped as a static file in public/, used until the backend serves one. */
  trailerSrc?: string;
}

export const INCLUDED = [
  "Seven videos — one program overview plus six lessons",
  "Audio version of every lesson for offline listening",
  "Downloadable workbook (PDF)",
  "Lifetime access, including future revisions",
];

export const INSTRUCTOR = {
  name: "Alonzo Waheed",
  role: "Founder & Chief Executive, LLB Group, Inc.",
  bio: "Alonzo Waheed leads LLB Group's wellness strategy and leadership development practice, advising organizations on sustainable performance and building the curricula behind its education programs. These courses adapt that institutional methodology for individuals.",
};

export const COURSES: CatalogEntry[] = [
  {
    slug: "balanced-living-blueprint",
    productSlug: "balanced-living-blueprint",
    trailerSrc: "/media/trailers/LLB_C1_TRAILER_v4.mp4",
    type: "course",
    eyebrow: "Wellness Education",
    title: "Balanced Living Blueprint",
    subtitle: "Overcoming Stress, Burnout & Self-Doubt",
    description:
      "A six-module program for high achievers and caregivers carrying more than they let on. Understand the root of burnout, rebuild the mindset underneath it, and leave with a written plan for a sustainable life.",
    priceCents: 12700,
    outcomes: [
      "Identify what is actually driving your burnout, rather than managing its symptoms",
      "Interrupt the second thought — the one you can still choose",
      "Build daily practices that survive the weeks when you have nothing left to give",
      "Set boundaries without the guilt that usually undoes them",
      "Treat rest as part of the work instead of a reward you never earn",
      "Leave with a written, specific plan for a balanced life",
    ],
    modules: [
      { sort: 1, title: "Understanding the Root of Burnout", summary: "What burnout actually is, why the strongest people are most at risk, and how to name what you are carrying.", durationSeconds: 210 },
      { sort: 2, title: "Mastering the Mindset Shift", summary: "You cannot stop the first thought. The second one belongs to you — how to take it back.", durationSeconds: 210 },
      { sort: 3, title: "Daily Wellness Practices", summary: "Small, repeatable practices that hold up on the days you have nothing left to give.", durationSeconds: 210 },
      { sort: 4, title: "Boundaries & Balance", summary: "Saying no without guilt, and protecting the capacity that everything else depends on.", durationSeconds: 210 },
      { sort: 5, title: "Rest as Resistance", summary: "Why rest is not a reward you earn, and how to treat recovery as part of the work.", durationSeconds: 210 },
      { sort: 6, title: "Your Balanced Life Plan", summary: "Assemble everything into a written plan you can actually keep.", durationSeconds: 240 },
    ],
    faq: [
      { question: "How long does the program take?", answer: "The six lessons run roughly three to four minutes each, and the workbook exercises add about twenty minutes per module. Most participants complete it across two weeks, though access does not expire." },
      { question: "Is this a substitute for therapy or medical care?", answer: "No. This is an educational program on stress, recovery, and sustainable performance. It is not clinical treatment, and it is not a replacement for care from a licensed professional." },
      { question: "Who is it designed for?", answer: "Professionals, caregivers, and leaders who are functioning well by every external measure and depleted by every internal one." },
      { question: "Do I keep access?", answer: "Yes. Enrollment includes lifetime access to the videos, audio, and workbook, along with any future revisions." },
      { question: "Can my organization license this?", answer: "Yes. Institutional licensing is handled separately. Start that conversation through the booking page on the LLB Group site, livinglifebalancedllb.com." },
    ],
  },
  {
    slug: "justice-advocacy",
    productSlug: "justice-advocacy",
    type: "course",
    eyebrow: "Advocacy Education",
    title: "Justice Advocacy",
    subtitle: "From Struggle to Strategy",
    description:
      "A six-module program for returning citizens, grassroots leaders, and advocates. Turn lived experience into credibility, and credibility into policy change — with a campaign plan and templates you can use immediately.",
    priceCents: 12700,
    outcomes: [
      "Tell your story as a credential rather than a confession",
      "Read how justice systems are actually structured, and where leverage exists",
      "Build a platform and standing without waiting for a title",
      "Move from individual voice to organized coalition",
      "Sustain yourself in work that does not end",
      "Convert public pressure into written policy — with a campaign plan you finish in the course",
    ],
    modules: [
      { sort: 1, title: "The Power of Your Story", summary: "Your story is not your shame — it is your credential. The struggle, breakthrough, vision framework.", durationSeconds: 210 },
      { sort: 2, title: "Understanding Justice Systems", summary: "How the system is actually structured, and where an individual advocate has real leverage.", durationSeconds: 210 },
      { sort: 3, title: "Building Your Platform", summary: "Establishing credibility and reach without waiting for a title or an institution.", durationSeconds: 210 },
      { sort: 4, title: "Organizing for Change", summary: "Moving from individual voice to organized effort — coalitions, meetings, and momentum.", durationSeconds: 210 },
      { sort: 5, title: "Wellness in Advocacy", summary: "Sustaining yourself in work that does not end, so the mission outlives your burnout.", durationSeconds: 210 },
      { sort: 6, title: "From Protest to Policy", summary: "Turning pressure into legislation — your campaign plan, letters, and the rooms that decide.", durationSeconds: 240 },
    ],
    faq: [
      { question: "Do I need existing advocacy experience?", answer: "No. The program is built for people starting from lived experience rather than from an organizational role." },
      { question: "What do I actually leave with?", answer: "A completed campaign plan, a set of correspondence templates, and a mapped list of the decision-makers relevant to your issue." },
      { question: "Is this legal advice?", answer: "No. The program covers advocacy strategy and how justice systems operate. It is not legal advice and does not create an attorney-client relationship." },
      { question: "Does it apply outside Illinois?", answer: "The structural material is general; the worked examples draw on Chicago and Illinois. The campaign framework transfers to any jurisdiction." },
      { question: "Do I keep access?", answer: "Yes — lifetime access to the videos, audio, and workbook, including future revisions." },
    ],
  },
  {
    slug: "faith-based-transformation",
    productSlug: "faith-based-transformation",
    type: "course",
    eyebrow: "Faith & Purpose",
    title: "Faith Over Fear",
    subtitle: "Faith-Based Transformation",
    description:
      "A six-module, explicitly Christian program on rediscovering God-given identity, silencing fear and self-doubt, and building a faith-driven life plan that outlasts the season you are in.",
    priceCents: 12700,
    outcomes: [
      "Build on a foundation that does not move with your circumstances",
      "Silence the voice that says you are disqualified",
      "Work through forgiveness as release rather than approval",
      "Let the hardest chapter become the reason you can reach someone else",
      "Establish a daily rhythm of devotion and practice",
      "Write a faith-driven life plan, and consider what it leaves behind",
    ],
    modules: [
      { sort: 1, title: "Faith as Foundation", summary: "Building on what does not move, in the seasons when everything else does.", durationSeconds: 210 },
      { sort: 2, title: "Overcoming Self-Doubt", summary: "Silencing the voice that says you are disqualified, and recovering your God-given identity.", durationSeconds: 210 },
      { sort: 3, title: "Healing Through Forgiveness", summary: "Forgiveness as release rather than approval — including forgiving yourself.", durationSeconds: 210 },
      { sort: 4, title: "Purpose Over Pain", summary: "Letting the hardest chapter become the reason you can reach someone else.", durationSeconds: 210 },
      { sort: 5, title: "Living Life Balanced in Christ", summary: "Daily rhythm, devotion, and practice — faith that shows up on ordinary Tuesdays.", durationSeconds: 210 },
      { sort: 6, title: "Walking in Legacy", summary: "Your faith-driven life plan, and what you leave behind for the people after you.", durationSeconds: 240 },
    ],
    faq: [
      { question: "Is this program explicitly Christian?", answer: "Yes. It is taught from a Christian perspective and draws on scripture throughout. The other two programs are not faith-based if you would prefer that framing." },
      { question: "Does it require a particular denomination?", answer: "No. The material is scriptural rather than denominational." },
      { question: "Is it pastoral counselling?", answer: "No. It is an educational program on faith, identity, and purpose. It is not counselling or clinical care." },
      { question: "What is included beyond the lessons?", answer: "A devotional companion and a journal built into the workbook, alongside the audio version of each lesson." },
      { question: "Do I keep access?", answer: "Yes — lifetime access, including future revisions." },
    ],
  },
];

export const BUNDLE = {
  slug: "llb-complete",
  productSlug: "llb-complete",
  type: "bundle" as ProductType,
  eyebrow: "Complete Program",
  title: "LLB Complete Bundle",
  subtitle: "All three programs plus the e-book",
  description:
    "The full curriculum: Balanced Living Blueprint, Justice Advocacy, and Faith Over Fear, together with the Living Life Balanced e-book. Eighteen lessons, three workbooks, lifetime access.",
  priceCents: 26700,
  savingsCents: 12700 * 3 + 1900 - 26700,
};

export const EBOOK = {
  slug: "ebook-7-principles",
  productSlug: "ebook-7-principles",
  type: "download" as ProductType,
  title: "Living Life Balanced",
  subtitle: "7 Principles to Restore Faith, Purpose, and Wellness",
  description:
    "The written foundation the programs are built on — seven principles for restoring balance across faith, purpose, and wellness. Delivered as a PDF download.",
  priceCents: 1900,
};

export function findCourseContent(slug: string): CatalogEntry | undefined {
  return COURSES.find((course) => course.slug === slug);
}

/**
 * The prices in this file and in the seed migration are placeholders that
 * have not been approved. Until Alonzo signs them off, no price is shown
 * anywhere on the site. Flip this to true once final prices are confirmed.
 */
export const PRICES_APPROVED = false;

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return "—";
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
}
