# LLB Course Platform — Setup Runbook

Everything in this repo is code. Nothing here is live yet. This document lists
the steps that must happen **outside** the repo — in Lovable, in Supabase, and
in Stripe — and who has to do them.

Stripe stays in **TEST MODE** throughout. No live keys are needed to complete
sections 1–5, and no live keys should be entered until section 7.

---

## 0. Current state

| Piece | Status |
|---|---|
| Schema, RLS, storage buckets, seed | Written as migrations, **not yet applied** |
| Edge functions | Written, **not yet deployed** |
| Storefront, player, auth UI | Built and building cleanly |
| Lovable Cloud (Supabase) backend | **Not enabled on this project yet** |
| Stripe products / prices | **Not created yet** |
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

## 3. Create the Stripe products (Fendi — Stripe dashboard, TEST mode)

In **test mode**, create one product and one one-time price per row:

| Product slug | Product | Price |
|---|---|---|
| `balanced-living-blueprint` | Balanced Living Blueprint | $127.00 |
| `justice-advocacy` | Justice Advocacy | $127.00 |
| `faith-based-transformation` | Faith Over Fear | $127.00 |
| `llb-complete` | LLB Complete Bundle | $267.00 |
| `ebook-7-principles` | Living Life Balanced (e-book) | $19.00 |

> **Prices are the handoff's placeholders. Confirm them with Alonzo before
> launch.** They live in the `products` table and can be changed there without
> a code change.

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

## 4. Set the secrets (Fendi — Lovable / Supabase edge function secrets)

| Secret | Value | Notes |
|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_...` | **Test key.** Never in the repo, never client-side. |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | From the webhook endpoint created in section 5. |
| `SITE_URL` | `https://llbgroupinc.com` (or the Lovable preview URL) | Used for the password-set link in the invite email. |

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are
injected automatically. The service role key is used only inside edge
functions and must never reach the browser.

---

## 5. Deploy the functions and register the webhook (Fendi)

1. Redeploy edge functions from Lovable. Four functions:
   `create-checkout`, `stripe-webhook`, `get-media-url`, `lead-magnet`.
   `supabase/config.toml` already sets `verify_jwt` correctly for each.
2. In Stripe (test mode) → Developers → Webhooks → add endpoint:
   `https://<project-ref>.supabase.co/functions/v1/stripe-webhook`
3. Subscribe to: `checkout.session.completed`,
   `checkout.session.async_payment_succeeded`,
   `checkout.session.async_payment_failed`, `charge.refunded`.
4. Copy the signing secret into `STRIPE_WEBHOOK_SECRET` and redeploy.

---

## 6. Upload media (Fendi, once the video pipeline delivers)

Buckets and expected paths — the seed already points at these:

| Bucket | Public? | Contents |
|---|---|---|
| `course-public` | Yes | `trailers/LLB_C{n}_TRAILER_v1.mp4` and poster frames |
| `course-media` | **No** | `c{n}/LLB_C{n}_M{m}_v{v}.mp4` and `.mp3` |
| `course-docs` | **No** | `workbooks/LLB_C{n}_WORKBOOK_v1.pdf`, `ebook/LLB_EBOOK_7_PRINCIPLES_v1.pdf`, `samples/LLB_EBOOK_CHAPTER_1_v1.pdf` |

If a version other than `v1` ships, update `video_path` / `audio_path` /
`workbook_path` in the `modules` and `courses` tables to match. Until an
object exists, the player says the lesson is being prepared rather than
erroring.

---

## 7. Going live (Fendi only — do this last)

1. Confirm final prices with Alonzo.
2. Decide the Stripe account (the parked question in section 3).
3. Create the same products/prices in Stripe **live** mode.
4. Replace `STRIPE_SECRET_KEY` with the live key, create a live webhook
   endpoint, and replace `STRIPE_WEBHOOK_SECRET` with its signing secret.
5. Update `stripe_price_id` on the five product rows to the live price ids.
6. Redeploy edge functions.

No application code changes at any point in this step. Purchases carry a
`livemode` flag so test and live rows are distinguishable.

---

## Acceptance test script (test mode)

Use Stripe test card `4242 4242 4242 4242`, any future expiry, any CVC.

1. **Signed-out purchase.** Open `/courses/balanced-living-blueprint` → Enroll
   Now → pay. Expect: redirect to `/checkout/success` with the "check your
   email" copy; an invite email arrives; a `purchases` row with `status='paid'`
   and one `entitlements` row.
2. **Bundle fan-out.** Buy `llb-complete`. Expect **four** entitlement rows —
   the three courses and the e-book.
3. **Signed-in purchase.** Sign in first, then buy. Expect the entitlement to
   attach to the existing user via `client_reference_id`, with no second account.
4. **Idempotency.** Resend the `checkout.session.completed` event from the
   Stripe dashboard. Expect no duplicate purchase and no duplicate entitlement.
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
