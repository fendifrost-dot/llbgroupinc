# LLB Course Platform — Setup Runbook

Everything in this repo is code. Nothing here is live yet. This document lists
the steps that must happen **outside** the repo — in Lovable, in Supabase, and
in Stripe — and who has to do them.

Stripe is **Lovable Payments** (Lovable's managed Stripe account) in **test
mode**. There is no Stripe secret key to enter anywhere; sections 3, 4, 5 and
7 below describe the original own-keys plan and are superseded by the
"Lovable Payments" notes inside each. Go-live happens in Lovable's Payments
tab (section 7).

---

## 0. Current state

| Piece | Status |
|---|---|
| Schema, RLS, storage buckets, seed | **Applied 6 Nov 2026** through Lovable's SQL access |
| Edge functions | Rewritten for Lovable Payments 6 Nov 2026; Lovable deploys them from the repo |
| Storefront, player, auth UI | Built and building cleanly |
| Lovable Cloud (Supabase) backend | **Enabled 8 Oct 2026** (ref `wqxmggowtlapqeaomdxg`), schema still empty |
| Stripe products / prices | **Created 6 Nov 2026 in Lovable's built-in Payments account (test mode)**, no images, not connected to the site. See `CLAUDE_AGENT_HANDOFF.md` §0. |
| Course media (video, audio, workbooks, e-book) | **Not delivered yet** — separate video pipeline |

Until Lovable Cloud is enabled, the site runs in a degraded-but-safe mode: the
nine baseline marketing pages and all four sales pages render from
`src/content/catalog.ts`, checkout shows "enrollment is not open yet", and
`/learn` says student accounts are being prepared. Nothing 500s.

---

## 1. Enable the backend (Fendi — Lovable)

1. Connect this GitHub repo (`fendifrost-dot/llbgroupinc`) to the Lovable
   project `e4112375-5da8-4110-ab30-5a884d7e48a2` if it is not already.
2. In Lovable, **enable Lovable Cloud**. This provisions the Supabase project
   and injects `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` into the
   build. The client reads either those names or
   `VITE_SUPABASE_PROJECT_URL` / `VITE_SUPABASE_ANON_KEY`.
3. Put the project ref into `supabase/config.toml` (`project_id`).

**This is a hard prerequisite for everything below.**

---

## 2. Apply the migrations (Fendi — Lovable SQL editor)

Run the files in `supabase/migrations/` in filename order:

1. `20260812090000_course_platform_schema.sql` — tables, helpers, triggers
2. `20260812090100_course_platform_rls.sql` — RLS, column grants, catalog views
3. `20260812090200_storage_buckets.sql` — private buckets
4. `20260812090300_seed_catalog.sql` — products, courses, all 18 modules
5. `20260812090400_auth_lookup_helper.sql` — webhook's email→user lookup

All five are idempotent (`if not exists` / `on conflict do update`), so a
re-run is safe.

Afterwards, run **Lovable's security scan / Supabase advisors** and confirm a
clean report. The design deliberately avoids the two things that most often
trip it: there are no `SECURITY DEFINER` views (the catalog views use
`security_invoker = true`), and every table has RLS enabled.

---

## 3. Stripe products (done by Lovable Payments, 6 Nov 2026)

**Lovable Payments note:** the products and prices below already exist in
the test environment with lookup keys `<slug with underscores>_onetime`,
and `products.stripe_price_id` holds those keys. Nothing to paste. The SQL
below is kept for a rebuild.

In **test mode**, one product and one one-time price per row:

| Product slug | Product | Price |
|---|---|---|
| `balanced-living-blueprint` | Balanced Living Blueprint | $200.00 |
| `justice-advocacy` | Justice Advocacy | $200.00 |
| `faith-based-transformation` | Faith Over Fear | $200.00 |
| `llb-complete` | LLB Complete Bundle | $550.00 |
| `ebook-7-principles` | Living Life Balanced (e-book) | $19.99 |

> These are the figures Fendi gave Lovable on 6 Nov 2026 and they match
> `src/content/catalog.ts` and the seed migration. They were approved the same
> day and `PRICES_APPROVED` is on. They live in the `products` table and can
> be changed there without a code change.

**Give every Stripe product an image.** Stripe Checkout shows the product
image beside the price. Use the covers the site already serves, as absolute
URLs on the published origin:

| Product | Image URL (replace the origin with the learn domain once live) |
|---|---|
| Balanced Living Blueprint | `https://llbgroupinc.lovable.app/images/courses/balanced-living-blueprint.jpg` |
| Justice Advocacy | `https://llbgroupinc.lovable.app/images/courses/justice-advocacy.jpg` |
| Faith Over Fear | `https://llbgroupinc.lovable.app/images/courses/faith-based-transformation.jpg` |
| LLB Complete Bundle | `https://llbgroupinc.lovable.app/images/courses/llb-complete.jpg` |
| Living Life Balanced (e-book) | `https://llbgroupinc.lovable.app/images/ebook/living-life-balanced.jpg` |

`create-checkout` sets the image on the Stripe product automatically the
first time a product is bought in an environment, using the cover on the
origin that served the page, so no manual step is needed once the site is
published.

Then paste the test price ids in:

```sql
update public.products set stripe_price_id = 'price_...' where slug = 'balanced-living-blueprint';
update public.products set stripe_price_id = 'price_...' where slug = 'justice-advocacy';
update public.products set stripe_price_id = 'price_...' where slug = 'faith-based-transformation';
update public.products set stripe_price_id = 'price_...' where slug = 'llb-complete';
update public.products set stripe_price_id = 'price_...' where slug = 'ebook-7-principles';
```

This step is optional for a first test: `create-checkout` falls back to inline
price data built from `price_cents`, so test checkout works before the Stripe
products exist.

**Open question for Fendi/Alonzo, parked deliberately:** which Stripe account
the money lands in — LLB Group, Inc. or Fendi's. Test mode does not force this
decision; section 7 does.

---

## 4. Secrets

**Lovable Payments note:** Lovable sets `STRIPE_SANDBOX_API_KEY`,
`PAYMENTS_SANDBOX_WEBHOOK_SECRET` and `LOVABLE_API_KEY` itself, and adds
`STRIPE_LIVE_API_KEY` and `PAYMENTS_LIVE_WEBHOOK_SECRET` at go-live. The
only secret set by hand is:

| Secret | Value | Notes |
|---|---|---|
| `SITE_URL` | `https://llbgroupinc.lovable.app`, later `https://learn.livinglifebalancedllb.com` | Used for the password-set link in the invite email. |

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are
injected automatically. The service role key is used only inside edge
functions and must never reach the browser.

---

## 5. Deploy the functions and register the webhook (Fendi)

**Lovable Payments note:** Lovable deploys the four functions
(`create-checkout`, `payments-webhook`, `get-media-url`, `lead-magnet`) from
the repo on sync, and it already registered the webhook endpoint
`https://wqxmggowtlapqeaomdxg.supabase.co/functions/v1/payments-webhook?env=sandbox`
in Stripe with the checkout and subscription events. `charge.refunded` is
not in the default set; ask Lovable to add it if refund status should
reach the `purchases` table. Nothing else to do here.

---

## 6. Upload media (Fendi, once the video pipeline delivers)

**Use the uploader, not the storage UI.** `scripts/upload-media.mjs` reads
every target path from the `modules` and `courses` tables, matches the
delivered files by the pipeline's names, uploads them to the private
buckets, updates a row's path when a newer version is delivered, and then
proves every stored path resolves to an object, the same way `get-media-url`
does. Nothing is hard-coded per file, so a new course, module or version
works unchanged once its rows exist.

```bash
# from the repo root, after npm install; the key is in Lovable Cloud's backend settings
SUPABASE_SERVICE_ROLE_KEY=... npm run media:upload -- --source "/path/to/delivered/files" --dry-run
SUPABASE_SERVICE_ROLE_KEY=... npm run media:upload -- --source "/path/to/delivered/files"
# check only (no files needed)
SUPABASE_SERVICE_ROLE_KEY=... npm run media:verify
# also exercise get-media-url as a real student who owns the programs
SUPABASE_SERVICE_ROLE_KEY=... npm run media:verify -- --verify-as "student@example.com:password"
```

It scans the folder recursively, so the pipeline's export folder can be
passed as is. Recognised names: `LLB_C{n}_M{m}_v{v}.mp4|.mp3`,
`LLB_C{n}_WORKBOOK_v{v}.pdf`, `LLB_C{n}_TRAILER_v{v}.mp4` and its
`-poster.jpg`, `LLB_EBOOK_7_PRINCIPLES_v{v}.pdf`,
`LLB_EBOOK_CHAPTER_1_v{v}.pdf`. Anything else is listed as unmatched and
left alone. Files whose size already matches the stored object are
skipped (`--force` re-uploads). The e-book and the chapter-one sample are
stored under the fixed keys the edge functions read, whatever version the
file name carries. Exit code 2 means at least one stored path still has no
object. Never commit the service role key.

Buckets and expected paths — the seed already points at these:

| Bucket | Public? | Contents |
|---|---|---|
| `course-public` | Yes | `trailers/LLB_C{n}_TRAILER_v1.mp4` and poster frames |
| `course-media` | **No** | `c{n}/LLB_C{n}_M{m}_v{v}.mp4` and `.mp3` |
| `course-docs` | **No** | `workbooks/LLB_C{n}_WORKBOOK_v1.pdf`, `ebook/LLB_EBOOK_7_PRINCIPLES_v1.pdf`, `samples/LLB_EBOOK_CHAPTER_1_v1.pdf` |

If a version other than `v1` ships, the uploader updates `video_path` /
`audio_path` / `workbook_path` / `trailer_url` itself after the upload
succeeds. Until an object exists, the player says the lesson is being
prepared rather than erroring, and `get-media-url` answers
`{"url": null, "code": "no_asset"}`.

---

## 7. Going live (Fendi only — do this last)

In Lovable, **Payments tab → Live**:

1. Claim the Stripe account (create a Stripe login or link an existing one).
2. Activate it in Stripe: business details, payout bank account, two-step
   login. When Stripe asks what to copy, copy everything including the
   Lovable app.
3. Lovable then creates the live keys and the `?env=live` webhook, stores
   the live secrets and writes `.env.production` with the `pk_live_` token.
4. Publish. Products and prices sync to live by lookup key.

No application code changes. Purchases carry a `livemode` flag so test and
live rows are distinguishable. Check that the product images carried over
to live; if not, the first live purchase of each product sets them again.

---

## Acceptance test script (test mode)

Use Stripe test card `4242 4242 4242 4242`, any future expiry, any CVC, on
the published site or the Lovable preview (both are in test mode until
go-live). Checkout opens in a dialog on the page; closing it is the cancel
path.

1. **Signed-out purchase.** Open `/courses/balanced-living-blueprint` → Enroll
   Now → pay. Expect: return to `/checkout/success` with the "check your
   email" copy; an invite email arrives; a `purchases` row with `status='paid'`
   and one `entitlements` row.
2. **Bundle fan-out.** Buy `llb-complete`. Expect **four** entitlement rows —
   the three courses and the e-book.
3. **Signed-in purchase.** Sign in first, then buy. Expect the entitlement to
   attach to the existing user via `client_reference_id`, with no second account.
4. **Idempotency.** Resend the `checkout.session.completed` event from the
   Stripe dashboard. Expect no duplicate purchase and no duplicate entitlement.
   Also check the Stripe product now has the cover image set.
5. **Gating.** Signed out, open `/learn` → redirected to `/signin`. Signed in
   without an entitlement, open `/learn/justice-advocacy` → "Enrollment
   Required", and the video element never receives a source.
6. **Direct media access fails.** Copy a `course-media` object URL and open it
   in a private window → denied. Let a signed URL sit for over 30 minutes →
   expires.
7. **Column lockdown.** As an anonymous caller, request
   `/rest/v1/modules?select=video_path` → permission denied, not a path.
8. **Lead magnet.** Submit the chapter-one form → a `leads` row appears and a
   signed URL comes back. Confirm the browser cannot insert into `leads`
   directly.
9. **Progress.** Mark modules complete; confirm the dashboard progress bar and
   the player's autoresume both follow.

---

## Known gaps / deliberate omissions

- **Refunds do not revoke entitlements.** `charge.refunded` marks the purchase
  refunded; removing the entitlement row is a manual step. Automating it was
  out of scope for v1.
- **Lead export is manual** (`select * from public.leads`) — §9 puts email
  automation out of scope.
- **Instructor bio needs Fendi's sign-off.** The About page names no
  individuals, only roles. The handoff asked for an Alonzo Waheed bio on the
  sales pages, so `src/content/catalog.ts` carries a short professional one —
  confirm the wording, and confirm that naming him on course pages while the
  corporate pages stay role-only is the intended contrast.
- **Course copy is placeholder-grade.** Outcomes, FAQs, and module summaries in
  `src/content/catalog.ts` were written from the video pipeline's module
  titles and source lessons. The handoff says Fendi supplies final copy files;
  swap them in there.
- **`/privacy` and `/terms`** are linked from the footer but have no routes —
  pre-existing, not introduced here. Worth fixing before taking payments.
