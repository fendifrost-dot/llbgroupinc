# LLB Course Platform — Handover

For Ken and Shawnie. This is the one document to work from. Status as of
28 Sep 2026.

---

## 1. Delivered and live

The course platform is merged into `main` and published by Lovable
(Lovable's sync commit `cb7b126`, "Synced and published to main").
Live preview: https://llbgroupinc.lovable.app

| Area | What's there |
|---|---|
| Corporate site | `/`, `/about`, `/consulting`, `/solutions`, `/events`, `/education`, `/media`, `/shop`, `/book` |
| Course storefront | `/courses` (catalog) and `/courses/<slug>` (one sales page per course) |
| Student area | `/signin`, `/account`, `/learn`, `/learn/<course>` (gated player) |
| Checkout pages | `/checkout/success`, `/checkout/cancelled` |
| Backend code | Database schema, row-level security, private storage buckets and catalog seed (`supabase/migrations/`), plus four edge functions: checkout, Stripe webhook, signed media URLs, lead magnet (`supabase/functions/`) |

The backend isn't switched on yet (see §4). Until it is, the site runs in a
safe mode: all pages render, sales pages show the course catalog, the Enroll
button shows "enrollment is not open yet", and `/learn` says student
accounts are being prepared. Nothing errors.

---

## 2. DNS for `learn.livinglifebalancedllb.com`

**The domain is `livinglifebalancedllb.com`, with a "d" in "balanced".**
Earlier emails spelled it `livinglifebalancellb.com`, which doesn't exist.

**Add these records in Squarespace DNS.** The domain's nameservers are
`nsd1–4.squarespacedns.com`, so records added in Vercel or anywhere else
do nothing.

| Type | Host | Value |
|---|---|---|
| A | `learn` | `185.158.133.1` |
| TXT | `_lovable.learn` | `lovable_verify=2477e53fa4d7b56f70119ea179e234c56d5d426fae9f39d2aeb31996afafa991` |

**Why `_lovable.learn` and not `_lovable`:** Lovable's domain guidance puts
the TXT record at `_lovable` for a root domain and at `_lovable.<subdomain>`
for a subdomain (for example `_lovable.blog`). Here the subdomain is
`learn`. Lovable's panel shows `_lovable` because it was displaying the root
domain view. Squarespace adds the root domain to the end of every host
automatically, so type `_lovable.learn` only, not the full domain.

**How sure we are:** this comes from Lovable's own documentation as
summarised in search results. We couldn't open the page itself from the
build environment to quote it word for word. If Lovable still says
"unverified" 24 hours after the records are added, **also** add a TXT
record with host `_lovable` and the same value. An extra TXT record does
no harm, so this covers both readings.

Once the records are in: Lovable → Project → Settings → Domains →
`learn.livinglifebalancedllb.com` → Verify.

---

## 3. Course trailer

`ALONZO BUSINESS/LLB/Video/LLB_C1_TRAILER_v4.mp4`

Once the backend is on, it goes in the public `course-public` bucket as
`trailers/LLB_C1_TRAILER_v1.mp4`. Alternatively, keep the v4 name and update
`trailer_path` on the course row to match.

---

## 4. Remaining configuration

The full step-by-step is in `docs/COURSE_PLATFORM_SETUP.md`. In order:

1. **Turn on the backend.** Enable Lovable Cloud on the project. This
   creates the database and connects the site to it.
2. **Apply the five database migrations**, in filename order, in the SQL
   editor. Then run Lovable's security scan and fix anything it flags.
3. **Stripe products.** Create the five products and prices in Stripe
   **test** mode and link their price IDs to the database. This depends on
   the pricing decision in §5.
4. **Secrets.** Set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` and
   `SITE_URL` as edge function secrets.
5. **Deploy and connect Stripe.** Deploy the four edge functions and
   register the Stripe webhook.
6. **Upload course media** (video, audio, workbooks, e-book) as the video
   pipeline delivers it.
7. **Run the acceptance test script** at the end of the setup doc.
8. **Go live:** switch to live Stripe keys and prices. This depends on the
   Stripe account decision in §5.

Also needed before taking real payments:
- `/privacy` and `/terms` are linked from the footer but have no pages.
- A refund doesn't remove the buyer's course access automatically. It has to
  be removed by hand.
- The course copy (outcomes, FAQs, module summaries) is draft wording. It
  needs to be replaced with the final copy.
- Alonzo needs to approve his instructor bio on the sales pages.

---

## 5. Blocked on the client

Nothing in this section can move until the client decides. These three
block steps 3 and 8 above and the lead capture follow-up.

1. **Approved pricing.** The prices in the catalog are placeholders: $127
   per course, $267 for the bundle, $19 for the e-book. They are **not
   approved**. Alonzo needs to confirm or replace every figure.
2. **Stripe account holder.** Decide whose Stripe account the money goes to:
   LLB Group, Inc. or another holder. Live keys, live products and the live
   webhook all come from that account.
3. **HubSpot vs GoHighLevel.** Decide which CRM receives leads and buyers.
   Until this is decided, leads from the chapter-one download form are
   stored in the database and exported by hand. No CRM connection has been
   built.

---

## 6. Open items on our side

- **Live-site check pending.** Before publishing, the brand refresh and all
  nine key routes were checked in a local browser against the production
  build. Every route renders, headings compute to Cinzel 700, the background
  is `#0b0b0b`, the nav leads with Courses and E-Book, Enroll shows
  "enrollment is not open yet", and the console is clean. The same check on
  the live Lovable URL still has to be run from a machine that can reach it.
- **Lovable security scan.** Lovable flags the scan as stale on the current
  commit, and it has to be re-run from the Lovable dashboard. For now, a
  dependency audit (`npm audit --omit=dev`) reports 12 known
  vulnerabilities (10 high, 1 moderate, 1 low). The one that affects the
  live site is in `react-router-dom` (an XSS via open redirects). The
  others (`postcss`, `glob`, `minimatch`, `lodash` and similar) only affect
  the build tools. An update is available for all of them. We also checked
  for secret keys in the frontend code (Stripe `sk_`/`whsec_`, Supabase
  `service_role`) and found none.
