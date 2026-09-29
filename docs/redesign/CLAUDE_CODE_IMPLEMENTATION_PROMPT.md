# LLB Group Homepage Redesign — Claude Code Implementation Brief

You are implementing a visual redesign of the LLB Group marketing site (React + Vite + Tailwind, likely shadcn). Keep **all existing routes, copy, business logic, auth, checkout, and CMS data**. Only upgrade presentation: layout, atmosphere, photography, motion, and hierarchy to match the design references in this folder.

## Design references (in this folder)
- `00-current-site-reference.png` — current live hero (before)
- `01-hero-desktop.jpg` — target hero redesign (primary reference)
- `02-midpage-desktop.jpg` — target mid-page sections
- `03-hero-motion.mp4` — motion direction (subtle; match energy, not frame-perfect)
- `04-hero-photo.jpg` — production hero photograph (use as real image asset)

## Brand tokens (DO NOT change hue family)
Keep existing CSS variables; enhance usage only:
- Background: warm cream `hsl(33.6 35.2% 86.1%)` / `--background`
- Foreground: deep plum `hsl(332 26.3% 11.2%)` / `--foreground`
- Primary (bronze-gold): `hsl(36 42% 50%)` / `--primary`
- Accent deep burgundy: `hsl(351 53% 19%)`
- Secondary/muted cream: `hsl(33 45% 92%)`
- Border: `hsl(33 30% 77%)`
- Serif headings (`font-serif`), generous tracking on display type
- Buttons: solid primary "hero" + outline "hero-outline"

## Homepage structure to implement (map to existing components)

### 1. Hero (`EO` or equivalent Home hero section)
- **Layout:** two-column on `lg+`: left copy (~50%), right photography with overlay (~50%). Stack on mobile (photo below or subtle full-bleed behind).
- **Overline:** `WELLNESS STRATEGY & HUMAN PERFORMANCE` — `text-xs tracking-[0.3em] uppercase text-primary`
- **H1:** "Building Sustainable" + line break + gradient word "Performance" + " at Scale"
  - Apply gold gradient to the word **Performance** only (e.g. `bg-gradient-to-r from-primary via-[#c9a35a] to-primary bg-clip-text text-transparent` or existing `text-gradient` class if present)
- **Body:** keep existing partner sentence exactly
- **CTAs:** primary `View Solutions` → `/solutions`; outline `Engage LLB` or `Book a Conversation` → `/book` (match existing routes/labels)
- **Visual:** use `04-hero-photo.jpg` (or optimized WebP). Soft radial golden light / vignette via CSS overlays so it blends with cream.
- **Proof chip:** floating glass card over the photo:
  - Label: Resilience
  - Value: +24% vs. baseline
  - Style: `backdrop-blur-md bg-card/70 border border-border/40 rounded-lg shadow-sm`
- **Atmosphere:** optional absolute decorative soft golden blobs / gradient mesh behind content at low opacity (primary/10). Keep accessible contrast.

### 2. Three pillars strip (immediately under hero)
- Eyebrow: `THREE PILLARS. ONE OUTCOME.`
- Three cards: **Consulting** · **Education** · **Media**
- Copy should map to existing site language:
  - Consulting → wellness strategy & organizational performance
  - Education → courses / workshops / learning frameworks
  - Media → content & thought leadership
- Links: `/consulting` or `/solutions`, `/education` or `/courses`, `/media`
- Cards: cream/white card on slightly deeper band, thin gold top accent or icon in primary, `rounded-sm`, hover: slight lift + border-primary/30

### 3. What We Do / Areas of Focus (mid-page)
- Match `02-midpage-desktop.jpg` structure:
  - Section title + short paragraph (use existing copy from About/Home)
  - Three focus cards: Leadership & Performance Consulting | Organizational Wellness Strategy | Education & Training Programs
- Icons: simple line icons in primary gold (lucide: `TrendingUp`, `Leaf` or custom lotus-like, `BookOpen`)

### 4. Who We Partner With
- Soft band background (`bg-secondary` or muted cream)
- Short paragraph + pill tags: Enterprise · Healthcare · Institutions · Leadership Teams
- Keep existing partner messaging if present

### 5. Partner CTA band
- Serif headline: Partner With LLB Group (or existing CTA heading)
- Dual buttons: View Solutions + Book a Conversation

## Motion (subtle; respect `prefers-reduced-motion`)
Reuse existing `fade-in-up` / stagger classes if present. Add:
- Hero children stagger 80–120ms
- Proof chip: short float-in; optional count-up once when in view
- Pillar cards: stagger fade-up
- Hover: `transition-all duration-300`, translate-y -1 or -2, soft shadow
- Optional ambient CSS gradient shift only if lightweight — do NOT autoplay heavy video as background by default (use static photo; video reference is for feel only)

## Technical constraints
1. Do **not** break routing, auth, Stripe/checkout, Supabase, or learn portal.
2. Prefer editing existing Home page components rather than rewriting the app shell.
3. Put new images in `public/` or `src/assets/hero/` and import or reference with Vite-friendly paths.
4. Optimize images: export WebP + JPG fallback if easy; max hero ~1600–1920w.
5. Keep mobile nav / existing header behavior; only polish styles to match cream/gold.
6. A11y: alt text on hero photo, sufficient contrast on text over photo (use gradient scrim if needed).
7. Do not invent new legal copy or change Privacy/Terms.

## Implementation order
1. Place `04-hero-photo.jpg` in assets and wire Hero image.
2. Restyle Hero layout + gradient word + proof chip.
3. Add/adjust Three Pillars strip under hero.
4. Align mid-page sections to the card grid in reference 02.
5. Polish Partner band + final CTA.
6. Motion polish + reduced-motion check.
7. Visual QA vs references 01 and 02 at 1280 and 1440 widths.

## Success criteria
- Side-by-side with `01-hero-desktop.jpg`: same hierarchy, colors, and energy.
- All original information and links still present.
- No regression on `/book`, `/courses`, `/signin`, checkout.
- Lighthouse still reasonable (no giant unoptimized PNG).

When done, summarize files changed and any copy you had to adapt.
