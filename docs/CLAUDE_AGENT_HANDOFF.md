# Claude agent handoff: LLB learn platform

For the next Claude agent working on `fendifrost-dot/llbgroupinc`. Read this
first, then `docs/HANDOVER.md` (the client-facing handover) and
`docs/COURSE_PLATFORM_SETUP.md` (the backend runbook). State as of
29 Sep 2026, `main` at `04f7e17` or later.

---

## 0. Status update, 6 Nov 2026 (read before §3 and §4)

Lovable has now done three things that §3 and §4 below still describe as
pending. Those sections are kept for history; this section is current.

**Backend is on.** Lovable Cloud was enabled on 8 Oct (project ref
`wqxmggowtlapqeaomdxg`, in `supabase/config.toml`). The `public` schema is
still **empty**: none of the five migrations in `supabase/migrations/` has
been applied, so there are no `products`, `courses`, `purchases` or
`entitlements` tables, no storage buckets, and the four edge functions have
nothing to read. Enabling Cloud regenerated `src/integrations/supabase/
client.ts` and `types.ts`; the hand-written helpers now live in
`src/lib/supabase-app.ts` and `src/lib/course-types.ts`. The generated client
throws at import time when `VITE_SUPABASE_URL` is missing, and a publish
built outside Lovable's sandbox crashed on exactly that on 6 Nov, so the
public client values (project URL, publishable key) are now **committed in
`.env`**. They are not secrets; they ship in every browser bundle.

**Stripe is Lovable's built-in Payments, not the repo's own keys.** On
8 Oct Lovable enabled its managed Stripe account ("Lovable Payments",
test mode, tax handling on). On 6 Nov it created these products and prices
in that account:

| Payments product id | Price id | Amount |
|---|---|---|
| `balanced_living_blueprint` | `balanced_living_blueprint_onetime` | $200.00 |
| `justice_advocacy` | `justice_advocacy_onetime` | $200.00 |
| `faith_based_transformation` | `faith_based_transformation_onetime` | $200.00 |
| `llb_complete` | `llb_complete_onetime` | $550.00 |
| `ebook_7_principles` | `ebook_7_principles_onetime` | $19.99 |
| `llb_membership` (not on the site) | `llb_membership_monthly`, `llb_membership_yearly` | $39/month, $390/year |

None of these products has an image. Lovable also committed the new prices
to `src/content/catalog.ts` (`7e6e320`) and wrote `VITE_PAYMENTS_CLIENT_TOKEN`
(a Stripe publishable key, `pk_test_...`) into `.env.development`. Nothing in
the app reads that token yet.

**Checkout is wired to Lovable Payments (6 Nov, evening).** The site now
uses Lovable's managed Stripe account through its connector gateway; the
repo holds no Stripe secret key and never will. The moving parts:

| Piece | Where |
|---|---|
| Gateway client and webhook verification | `supabase/functions/_shared/stripe.ts` |
| Checkout session (Embedded Checkout, `managed_payments` tax path) | `supabase/functions/create-checkout/index.ts` |
| Purchase + entitlement writer (Stripe posts to `/functions/v1/payments-webhook?env=sandbox`, and `?env=live` after go-live) | `supabase/functions/payments-webhook/index.ts` |
| Browser: publishable key, environment, Stripe.js | `src/lib/stripe.ts` |
| Browser: checkout dialog, opened by `EnrollButton` through `useCheckout` | `src/components/course/CheckoutDialog.tsx` |
| Product to price mapping | `products.stripe_price_id` holds the Payments **lookup key** (`<slug with underscores>_onetime`), same in test and live |

The old `stripe-webhook` function (own secret key, redirect checkout) is
deleted. Secrets are set by Lovable: `STRIPE_SANDBOX_API_KEY`,
`PAYMENTS_SANDBOX_WEBHOOK_SECRET`, `LOVABLE_API_KEY`, and the `_LIVE_`
pair at go-live. `SITE_URL` is still ours to set (the invite email's link).
`supabase/config.toml` turns off the gateway JWT check for all four
functions; each one authenticates its caller itself.

**Database: migrations applied, catalog seeded (6 Nov).** All five
migrations ran through Lovable's SQL access in order: nine tables, three
views, three buckets, five products with lookup keys, three courses,
eighteen modules, four bundle items, and the three helper functions.
`supabase/migrations/` is now the record of what is live, not a to-do.

**Guest checkout is kept.** A signed-in buyer is attached to a Stripe
Customer tagged with their user id; a guest is resolved by email in the
webhook, which invites them (set-password email) or creates the account.

**Environments.** The browser picks `sandbox` or `live` from the prefix of
`VITE_PAYMENTS_CLIENT_TOKEN`. Lovable writes the `pk_test_` key to
`.env.development` and the `pk_live_` key to `.env.production` at go-live.
**Verified 6 Nov on the published site:** the course page renders with
prices, Enroll opens the Stripe form, and the dialog says "Test mode: no
real card is charged", so the published build currently carries the test
token. Anyone can complete a test purchase there with card 4242 4242 4242
4242 and receive a real entitlement; nothing is charged. Go-live is done in
Lovable's Payments tab (claim the Stripe account, activate it, publish); no
code changes. A build with no token at all shows "Checkout is not available
on this site yet".

**Verified through Lovable's agent (6 Nov):** all four functions deployed;
`create-checkout` returned a client secret for all five products; all five
Stripe products now carry their cover image; `charge.refunded` was added to
the webhook; `/sitemap.xml`, `/robots.txt` and `/llms.txt` are served; the
published course page shows prices and opens the Stripe form.

**Post-purchase test (6 Nov, evening, by the user on the learn domain):** a
signed-out test purchase completed, the invite email arrived, the link
landed on `/account` (so `SITE_URL` is set and correct), the purchase and
entitlement rows were written, and `/learn` showed the program. What it
surfaced was fixed the same evening: the account page now has a focused
"finish creating your account" state for invite and reset links
(`src/lib/authLanding.ts` records the link type before supabase-js strips
the hash; saving a password writes `password_set` into user metadata and
goes to `/learn`), enrollment cards link into the player or download the
e-book, and checkout plus the success page explain that the account is
created from the checkout email. The success copy assumes Supabase's
default invite template (subject "You have been invited", button "Accept
the invite"); adjust it if the template is customised.

**Not done yet, in order:** (1) course media: storage holds no objects, so
every lesson says it is being prepared; upload with
`scripts/upload-media.mjs` (setup doc §6); (2) Stripe go-live in the
Payments tab; (3) the membership product has no page and its subscription
events are logged and ignored by the webhook.

**Product images in Stripe.** The site's price layouts already show every
cover. Lovable's payments tools cannot set a product image, so
`create-checkout` sets it on the Stripe product itself the first time a
product is bought in an environment (`products.update` with the cover URL on
the serving origin). The cover must be public over https, which the
published site provides.

**SEO/GEO.** `src/seo/` holds the route metadata, JSON-LD, sitemap, robots
and llms.txt builders; `plugins/seo-pages.ts` writes a static HTML shell per
public route at build time; `<Seo />` (mounted in `Layout`) keeps the head in
step at runtime. The canonical origin at runtime is `window.location.origin`;
the build uses `VITE_SITE_URL` or falls back to the lovable.app origin. Set
`VITE_SITE_URL=https://learn.livinglifebalancedllb.com` in Lovable's
environment at the domain switch. Course `offers` appear in JSON-LD only while
`PRICES_APPROVED` is true.

## 1. What this project is, and isn't

**It is the learn platform only**: course storefront, e-book, student
accounts, checkout and the gated course player. It's intended to be served
at `learn.livinglifebalancedllb.com`.

**It is not LLB Group's website.** The main site
(livinglifebalancedllb.com: speaking, consulting, coaching, story, booking)
belongs to Ken, on Next.js/Vercel. Ken wrote this scope down on 31 Aug,
LaQuisha repeated it on 4 Sep, and Ken again on 24 Sep. This project links
out to the main site and never duplicates it.

History you need so you don't repeat it: this Lovable project started in
Dec 2025 as a full corporate site. The course platform was built on top of
it in August. On 28 and 29 Sep the whole thing was restyled to match Ken's
brand, which turned a stale duplicate into a polished clone of his site. It
was then cut back to learn-only (`765ff09`). **Before you add any page, ask
whether it belongs on the main site instead.** If it does, it doesn't go
here.

## 2. How this user works

- **All code goes through GitHub.** Commit and push straight to `main`.
  Merges and pushes are pre-authorized; don't ask before committing. Never
  rebase or force-push `main`. Branches other people push to (Grok, other
  agents) are merged, not rewritten.
- **Lovable is used only to sync, redeploy and publish**, plus the rare
  change only Lovable can make. Never edit code in Lovable chat, because it
  writes commits that fight the repo.
- **Supabase work** happens in Lovable Cloud's SQL editor, driven by a
  browser agent, or through files in the repo. Never in a standalone
  Supabase project.
- **The site isn't public-facing yet.** Publishing is the user's call and
  isn't urgent. Still, anyone with the lovable.app address can reach the
  published build, so say so when it's stale.
- **Other agents work on this repo too** (Grok, ChatGPT reviews, Claude in
  Chrome on the user's Mac). Fetch before you work, and look at *commits*
  on existing branches, not just branch names. Missing that once hid two
  image commits.
- The user makes the product calls and states them tersely. When they
  decide, carry it out; don't re-argue it.

## 3. Current state

**Pages (14):** `/`, `/courses`, `/courses/:slug` (the three programs plus
`llb-complete`), `/shop` (with `#ebook`), `/signin`, `/account`, `/learn`,
`/learn/:courseSlug`, `/checkout/success`, `/checkout/cancelled`,
`/privacy`, `/terms`, and a 404 page.

**Design:** matches Ken's site. Ivory `#E8DDCF`, plum `#24151C`, brass
`#B58A4A`, oxblood accent, Cinzel 600 uppercase headings, Montserrat body,
radius 0, dark plum band for page headers and the footer. The tokens are
in `src/index.css`.

**Key files:**

| File | What it controls |
|---|---|
| `src/content/catalog.ts` | Course, bundle and e-book copy, the placeholder prices, and `PRICES_APPROVED` |
| `src/content/media.ts` | Image paths: covers, workbook spreads, e-book art, trailer poster |
| `src/content/site.ts` | `MAIN_SITE` and `MAIN_SITE_BOOK`, used for every link out to Ken's site |
| `src/hooks/useImageAvailable.ts` and `src/components/shared/OptionalImage.tsx` | Image slots that render only once their file exists |
| `src/components/course/CourseShowcase.tsx` | The trailer and program overview on the sales pages |
| `src/hooks/useCheckout.ts` | The client-side checkout guard |
| `supabase/functions/create-checkout/index.ts` | The server-side checkout guard for live Stripe keys |
| `supabase/migrations/*` | Schema, row-level security, storage buckets, catalog seed. **Not applied yet.** |

**Images on `main`:**
- Three portrait (2:3) program covers, the 16:9 bundle graphic and the
  e-book art. All are the user's finals.
- Three workbook spreads, from Grok, approved by the user.
- Still missing: the C1 trailer video and its poster.

**Prices are hidden and checkout is blocked on purpose.** Two settings,
both off, and both must be turned on only after Alonzo approves prices:
1. `PRICES_APPROVED` in `src/content/catalog.ts`, which shows prices and
   opens checkout on the site.
2. The `PRICES_APPROVED` edge function secret, set to `"true"`. Until then,
   `create-checkout` refuses live Stripe keys. Test keys still work.

**Backend:** not enabled. Lovable Cloud is off, migrations aren't applied
and the functions aren't deployed. The front end detects this and falls
back gracefully: Enroll says "Enrollment is not open yet", and `/learn`
says student accounts are being prepared.

## 4. Next steps, in order

### Ready now (no client input needed)

1. **Publish in Lovable.** The published build at llbgroupinc.lovable.app
   is stale. It still has the corporate pages and the old `/book` form,
   which showed a success message but sent nothing. The user clicks
   **Publish → Publish changes**. A GitHub sync alone doesn't publish.
   Afterwards, re-run the checks in §6 against the live URL (needs network
   access to `lovable.app`; see §7).
2. **Delete the `redesign/homepage-alive` branch, but only if the user
   says so.** Everything kept from it (the three workbook spreads) is on
   `main`. Its other images were reviewed and rejected: its covers
   duplicate the finals, two of its images use photos from Ken's site, the
   e-book 3D is a different design, and the poster isn't a real trailer
   frame. This environment couldn't push an archive tag, so if the user
   wants the branch preserved, keep it rather than deleting it.
3. **C1 trailer.** The file is on the user's Mac at
   `ALONZO BUSINESS/LLB/Video/LLB_C1_TRAILER_v4.mp4`. It isn't in Google
   Drive or the repo. It goes at
   `public/media/trailers/LLB_C1_TRAILER_v4.mp4`, and GitHub's limit for a
   single file is 100 MB. The Balanced Living Blueprint page already points
   there. Once it's in, make the poster from a real frame (ffmpeg, around
   the 2 to 5 second mark, 1920x1080 JPG) at
   `public/media/trailers/LLB_C1_TRAILER_v4-poster.jpg`. Don't use a
   generated or stock poster.
4. **Copy cleanup (optional).** About 29 em dashes remain in
   `src/content` and `src/pages`. An earlier request asked for dashes to be
   removed from the copy. Rewrite each sentence rather than swapping in a
   hyphen.

### Blocked on the client (don't guess)

5. **Approved pricing.** The seed prices ($127 ×3, $267, $19) are
   placeholders. **Never change them, and never show them, until Alonzo
   signs off.** After sign-off, update `catalog.ts` and the seed
   migration, then turn on both `PRICES_APPROVED` settings.
6. **The Stripe account holder**, which blocks live keys, live products
   and the live webhook.
7. **HubSpot vs GoHighLevel**, which blocks the CRM integration. Leads
   currently go to the `leads` table and are exported by hand.
8. **Which legal pages govern the platform:** this project's `/privacy`
   and `/terms` (with their "pending legal review" notice), or links to
   Ken's pages. Never remove the notice or invent refund terms.
9. **Where the e-book sells.** The 31 Aug plan says Shopify; the code sells
   it through Stripe. Once decided, remove the other path.
10. **A support email address.** Checkout pages currently point to
    livinglifebalancedllb.com/book. `info@llbgroup.com` is **not** a
    verified LLB address, so don't reintroduce it.

### After those decisions

11. **Backend setup:** `docs/COURSE_PLATFORM_SETUP.md` sections 1–5, in
    test mode: enable Lovable Cloud, apply the migrations in the SQL
    editor, create the Stripe test products, set the secrets, deploy the
    functions and register the webhook. Then run the acceptance test script
    at the end of that document. Watch that enabling Lovable Cloud doesn't
    regenerate `src/integrations/supabase/client.ts` or `types.ts`, which
    are hand-written; other code imports `isBackendConfigured`,
    `requireSupabase`, `callFunction` and `publicStorageUrl` from them.
12. **Domain switch-over is Ken's job, not ours.** We hand over the
    Lovable project and the repo. `HANDOVER.md` §2 has the records and the
    two backend settings that must include the new domain: `SITE_URL`, and
    Supabase Auth's allowed redirect URLs. Nothing in the code changes.

## 5. Rules

- **No invented claims.** No statistics, testimonials, ratings, student
  counts, press logos or "as seen in" badges unless the client supplies
  them. A "+24% resilience" chip once slipped in from a design mockup and
  was removed.
- **No photos from Ken's site** without his permission. No generated video
  of a presenter; trailers come from the real video pipeline.
- **People in imagery** must read as illustrative. Never caption them as
  LLB staff or clients.
- **Don't touch the book PDFs.** They're finished and live outside this
  repo.
- **Don't email anyone.** Emails to Shawnie, Alonzo and Ken went out on
  28 Sep.
- **Don't do Stripe, Supabase or CRM work** until the §4 decisions are in.
- When the user pastes a script or patch, **run it as written**, then
  report and fix any gaps it leaves (earlier examples: exact colour
  values, a stale Tailwind font setting). Don't redo work that's already
  done.

## 6. Verifying changes

```bash
npm ci && npm run build        # ~1790 modules, must be clean; the build also prints a [seo] line
# A local build needs VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
# (any syntactically valid values) or the generated Supabase client throws.
npx tsc --noEmit -p tsconfig.app.json
npx eslint src                 # 2 pre-existing errors in ui/command.tsx and ui/textarea.tsx are known
```

For UI changes, serve the build and check it in headless Chromium:
- `npx vite preview --host 127.0.0.1 --port 4173 --strictPort`. It needs
  `--host 127.0.0.1`, because IPv6 `::` fails in the cloud container.
- Playwright is preinstalled at `/opt/node-tools/node_modules/playwright`
  (import it by that path). Don't run `playwright install`.
- Full-page screenshots show lazy images below the fold as blank boxes;
  scroll the page once before capturing, or check `naturalWidth` instead.
- Check: every route renders; the console is clean (Google Fonts are
  blocked in the sandbox, so ignore font errors, and the page falls back
  to a serif font); every image in `main` has `naturalWidth > 0`; no `$`
  price appears while `PRICES_APPROVED` is false; internal links resolve;
  no horizontal overflow at 390px.
- Always say whether you checked a **local build** or the **published
  site**. They differ until someone publishes.

## 7. Environment gotchas (Claude Code on the web)

- **The network policy blocks** `lovable.app`, `lovable.dev`,
  `docs.lovable.dev` and DNS-over-HTTPS. Live-site and DNS checks need
  the user to allow those hosts, or a Claude in Chrome agent on their Mac.
- **Files attached in the Claude app don't reach the container.** Only
  image uploads saved under `/root/.claude/uploads/` do. For other files,
  ask the user to paste the text, put it in Google Drive (the Drive
  connector can read it) or push it to a branch.
- **Git tags can't be pushed** from this environment. Branch pushes work.
- **Don't run `pkill -f "vite preview"`** in the same shell command that
  mentions `vite preview`. It kills its own shell (exit 144). Stop the
  server by its PID, or as a separate command.
- **Lovable's sync may push its own commits** to `main` (for example,
  reformatting the TypeScript configs). Pull before you work.
- **Image optimization:** `sharp` installs fine from npm into the
  scratchpad. Target about 150–350 KB per image, using mozjpeg at quality
  80.
