# LLB Learn Platform — Handover

For Ken and Shawnie. This is the one document to work from. Status as of
29 Sep 2026.

**Scope.** This project is the learn platform only: the programs, the
e-book, student accounts and checkout, intended for
`learn.livinglifebalancedllb.com`. LLB Group's own site (speaking,
consulting, coaching, story, booking) is Ken's at livinglifebalancedllb.com.
This project doesn't duplicate it; it links to it.

**What is handed over:** the Lovable project
(`lovable.dev/projects/e4112375-5da8-4110-ab30-5a884d7e48a2`) and the GitHub
repo (`fendifrost-dot/llbgroupinc`, branch `main`). Domains, DNS and the
switch-over are yours; §2 has everything needed for them.

---

## 1. What's in the project

Preview: https://llbgroupinc.lovable.app

The design matches livinglifebalancedllb.com: a warm ivory background
(`#E8DDCF`), blackened plum text (`#24151C`) and antique brass buttons
(`#B58A4A`). Headings are Cinzel 600 in uppercase and body text is
Montserrat, so `learn.` reads as part of the same brand.

| Area | Pages |
|---|---|
| Landing page | `/`: the three programs, the bundle and the e-book |
| Course storefront | `/courses` (catalog) and `/courses/<slug>`, one sales page each for Balanced Living Blueprint, Justice Advocacy, Faith Over Fear and the Complete Bundle |
| Shop | `/shop`: all programs, the bundle and the e-book (`/shop#ebook`) |
| Student area | `/signin`, `/account`, `/learn`, `/learn/<course>` (gated player) |
| Checkout pages | `/checkout/success`, `/checkout/cancelled` |
| Legal | `/privacy`, `/terms` (marked "pending legal review", see §5) |
| Backend code | Database schema, row-level security, private storage buckets and catalog seed (`supabase/migrations/`), plus four edge functions: checkout, Stripe webhook, signed media URLs, lead magnet (`supabase/functions/`) |

**Links to the main site.** The header's "LLB Group" link and the footer
point to livinglifebalancedllb.com. Every "Contact" and "Book a
Consultation" link points to livinglifebalancedllb.com/book, so enquiries
reach Ken's booking form and GoHighLevel. This project has no booking form
of its own.

**Removed on 29 Sep.** An earlier corporate site in this Lovable project
duplicated Ken's pages (`/about`, `/consulting`, `/solutions`,
`/education`, `/media`, `/events`, `/book`). Those pages have been deleted.
They now return "page not found".

**Imagery.** Final covers for the three programs, the bundle graphic and
the e-book art are in `public/images/courses/` and `public/images/ebook/`.

**Prices are hidden.** No price appears anywhere on the site until the
figures are approved (§5). One setting turns them on: `PRICES_APPROVED` in
`src/content/catalog.ts`.

The backend isn't switched on yet (§4). Until it is, every page still
renders. The Enroll button shows "enrollment is not open yet", and `/learn`
says student accounts are being prepared.

---

## 2. Pointing `learn.livinglifebalancedllb.com` at this project (for Ken)

**The domain is `livinglifebalancedllb.com`, with a "d" in "balanced".**
Earlier emails spelled it `livinglifebalancellb.com`, which doesn't exist.

**Add these records in Squarespace DNS.** The domain's nameservers are
`nsd1–4.squarespacedns.com`, so records added in Vercel or anywhere else
do nothing.

| Type | Host | Value |
|---|---|---|
| A | `learn` | `185.158.133.1` |
| TXT | `_lovable.learn` | `lovable_verify=76b5454c769c4a57e57de9eed838563df72f27fd2f9ccec565ee0341aa4acabf` |

**Why `_lovable.learn` and not `_lovable`:** Lovable's domain guidance puts
the TXT record at `_lovable` for a root domain and at `_lovable.<subdomain>`
for a subdomain (for example `_lovable.blog`). Here the subdomain is
`learn`. Lovable's panel shows `_lovable` because it was displaying the root
domain view. Squarespace adds the root domain to the end of every host
automatically, so type `_lovable.learn` only, not the full domain.

**How sure we are: confirmed.** These exact values were read on 28 September
directly out of the `learn.livinglifebalancedllb.com` entry in Lovable's own
domains panel. Lovable's documentation agrees on the host: "The verification
`TXT` record uses the host `_lovable` for a root domain or `_lovable.<prefix>`
for a subdomain."

**Do not substitute the other token.** The same panel shows a different
verification token, `lovable_verify=2477e53f...`, against host `_lovable`.
That one belongs to the old, offline `livinlifebalanced.com` entry. Every
domain gets its own token, so the root domain's value will never verify here
no matter which host it is filed under.

**Current DNS state (29 September): none of these records exist yet.**
`learn.livinglifebalancedllb.com` (A), `_lovable.learn.livinglifebalancedllb.com`
(TXT) and `_lovable.livinglifebalancedllb.com` (TXT) all return NXDOMAIN.
Nameservers are `nsd1-4.squarespacedns.com`, so the records go in Squarespace.

Once the records are in: Lovable → Project → Settings → Domains →
`learn.livinglifebalancedllb.com` → Verify.

**Nothing in the code has to change for the switch.** Checkout, sign-in and
email links all build their return address from whatever domain the site is
served on. No `lovable.app` address is hard-coded. Two backend settings do
have to include the new address, once the backend is on:

1. **`SITE_URL`** (edge function secret) = `https://learn.livinglifebalancedllb.com`.
   The welcome email's set-password link uses it.
2. **Supabase Auth → URL Configuration.** Add
   `https://learn.livinglifebalancedllb.com` to the allowed redirect URLs,
   or sign-in links will bounce.

**Linking from the main site.** Use plain links to pages on the subdomain,
for example `learn.livinglifebalancedllb.com/courses` for "Courses" in the
main site's navigation. Nothing needs to be embedded.

---

## 3. Course trailer

`ALONZO BUSINESS/LLB/Video/LLB_C1_TRAILER_v4.mp4`

**To show it now, without the backend:** add the file to the repo at
`public/media/trailers/LLB_C1_TRAILER_v4.mp4`. The Balanced Living Blueprint
sales page already points there and starts playing it on the next publish.
Keep the file under 100 MB, which is GitHub's limit for a single file.

Until a trailer exists, every course page shows a program overview in its
place: the course title, what's included, and all six module titles, with an
Enroll button. There is no "coming soon" placeholder. Justice Advocacy (C2)
and Faith Over Fear (C3) have no trailer yet.

Once the backend is on, trailers can instead live in the public
`course-public` bucket (`trailers/LLB_C{n}_TRAILER_v1.mp4`, or update
`trailer_url` on the course row to match the file name). The database value
takes priority over the file in the repo.

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
- `/privacy` and `/terms` exist and describe current practice, but they
  show a "pending legal review" notice. Counsel must review them, and the
  refund terms must be written. Don't remove the notice until then.
- A refund doesn't remove the buyer's course access automatically. It has to
  be removed by hand.
- The course copy (outcomes, FAQs, module summaries) is draft wording. It
  needs to be replaced with the final copy.
- Alonzo needs to approve his instructor bio on the sales pages.

---

## 5. Blocked on the client

Nothing in this section can move until the client decides. The first three
block steps 3 and 8 above and the lead capture follow-up.

1. **Approved pricing.** The prices in the catalog are placeholders: $127
   per course, $267 for the bundle, $19 for the e-book. They are **not
   approved** and are hidden on the site until they are. Alonzo needs to
   confirm or replace every figure.
2. **Stripe account holder.** Decide whose Stripe account the money goes to:
   LLB Group, Inc. or another holder. Live keys, live products and the live
   webhook all come from that account.
3. **HubSpot vs GoHighLevel.** Decide which CRM receives leads and buyers.
   Until this is decided, leads from the chapter-one download form are
   stored in the database and exported by hand. No CRM connection has been
   built.
4. **Which legal pages govern the learn platform.** Either keep this
   project's `/privacy` and `/terms`, limited to accounts, purchases and
   course access, or link to the main site's pages instead.
5. **Where the e-book sells.** The 31 Aug plan puts e-books on Shopify.
   This project can also sell it through Stripe. Pick one; the other path
   comes out.

---

## 6. Open items on our side

- **Verified 29 Sep on the production build**, in a local browser:
  - all 14 remaining routes render with no console errors;
  - every image loads and every internal link points to a page that exists;
  - no price shows anywhere;
  - the removed pages return "page not found";
  - Contact and Book links go to livinglifebalancedllb.com/book;
  - no horizontal scroll at 390px mobile width.
- **Lovable security scan.** Lovable flags the scan as stale on the current
  commit, and it has to be re-run from the Lovable dashboard. For now, a
  dependency audit (`npm audit --omit=dev`) reports 12 known
  vulnerabilities (10 high, 1 moderate, 1 low). The one that affects the
  live site is in `react-router-dom` (an XSS via open redirects). The
  others (`postcss`, `glob`, `minimatch`, `lodash` and similar) only affect
  the build tools. An update is available for all of them. We also checked
  for secret keys in the frontend code (Stripe `sk_`/`whsec_`, Supabase
  `service_role`) and found none.
