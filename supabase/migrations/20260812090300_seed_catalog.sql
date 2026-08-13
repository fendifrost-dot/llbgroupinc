-- LLB Course Platform — catalog seed
-- Handoff §2. Prices are the handoff's placeholders — CONFIRM BEFORE LAUNCH.
-- stripe_price_id is intentionally NULL: Fendi creates the Stripe products and
-- pastes the price ids in (see docs/COURSE_PLATFORM_SETUP.md §3).
-- Media paths follow the video pipeline's LLB_C{n}_M{m}_v{v} naming convention
-- and point at objects that do not exist yet — the player degrades gracefully
-- until the assets land.

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
insert into public.products (slug, title, subtitle, type, price_cents, sort) values
  ('balanced-living-blueprint',
   'Balanced Living Blueprint',
   'Overcoming Stress, Burnout & Self-Doubt',
   'course', 12700, 1),
  ('justice-advocacy',
   'Justice Advocacy',
   'From Struggle to Strategy',
   'course', 12700, 2),
  ('faith-based-transformation',
   'Faith Over Fear',
   'Faith-Based Transformation',
   'course', 12700, 3),
  ('llb-complete',
   'LLB Complete Bundle',
   'All three programs plus the e-book',
   'bundle', 26700, 4),
  ('ebook-7-principles',
   'Living Life Balanced',
   '7 Principles to Restore Faith, Purpose, and Wellness',
   'download', 1900, 5)
on conflict (slug) do update
  set title       = excluded.title,
      subtitle    = excluded.subtitle,
      type        = excluded.type,
      price_cents = excluded.price_cents,
      sort        = excluded.sort;

-- Bundle composition: all three courses + the e-book.
insert into public.bundle_items (bundle_product_id, child_product_id)
select b.id, c.id
from public.products b
join public.products c
  on c.slug in ('balanced-living-blueprint', 'justice-advocacy',
                'faith-based-transformation', 'ebook-7-principles')
where b.slug = 'llb-complete'
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Courses
-- ---------------------------------------------------------------------------
insert into public.courses (product_id, slug, title, subtitle, description, trailer_url, workbook_path)
select p.id, v.slug, v.title, v.subtitle, v.description, v.trailer_url, v.workbook_path
from (values
  ('balanced-living-blueprint',
   'balanced-living-blueprint',
   'Balanced Living Blueprint',
   'Overcoming Stress, Burnout & Self-Doubt',
   'A six-module program for high achievers and caregivers carrying more than they let on. Understand the root of burnout, rebuild the mindset underneath it, and leave with a written plan for a sustainable life.',
   'course-public/trailers/LLB_C1_TRAILER_v1.mp4',
   'course-docs/workbooks/LLB_C1_WORKBOOK_v1.pdf'),
  ('justice-advocacy',
   'justice-advocacy',
   'Justice Advocacy',
   'From Struggle to Strategy',
   'A six-module program for returning citizens, grassroots leaders, and advocates. Turn lived experience into credibility, and credibility into policy change — with a campaign plan and templates you can use immediately.',
   'course-public/trailers/LLB_C2_TRAILER_v1.mp4',
   'course-docs/workbooks/LLB_C2_WORKBOOK_v1.pdf'),
  ('faith-based-transformation',
   'faith-based-transformation',
   'Faith Over Fear',
   'Faith-Based Transformation',
   'A six-module, explicitly Christian program on rediscovering God-given identity, silencing fear and self-doubt, and building a faith-driven life plan that outlasts the season you are in.',
   'course-public/trailers/LLB_C3_TRAILER_v1.mp4',
   'course-docs/workbooks/LLB_C3_WORKBOOK_v1.pdf')
) as v(product_slug, slug, title, subtitle, description, trailer_url, workbook_path)
join public.products p on p.slug = v.product_slug
on conflict (slug) do update
  set title         = excluded.title,
      subtitle      = excluded.subtitle,
      description   = excluded.description,
      trailer_url   = excluded.trailer_url,
      workbook_path = excluded.workbook_path;

-- ---------------------------------------------------------------------------
-- Modules (titles are final, from the video pipeline handover)
-- ---------------------------------------------------------------------------
insert into public.modules (course_id, sort, title, summary, video_path, audio_path, duration_seconds)
select c.id, v.sort, v.title, v.summary, v.video_path, v.audio_path, v.duration_seconds
from (values
  -- Course 1
  ('balanced-living-blueprint', 1, 'Understanding the Root of Burnout',
   'What burnout actually is, why the strongest people are most at risk, and how to name what you are carrying.',
   'course-media/c1/LLB_C1_M1_v1.mp4', 'course-media/c1/LLB_C1_M1_v1.mp3', 210),
  ('balanced-living-blueprint', 2, 'Mastering the Mindset Shift',
   'You cannot stop the first thought. The second one belongs to you — how to take it back.',
   'course-media/c1/LLB_C1_M2_v1.mp4', 'course-media/c1/LLB_C1_M2_v1.mp3', 210),
  ('balanced-living-blueprint', 3, 'Daily Wellness Practices',
   'Small, repeatable practices that hold up on the days you have nothing left to give.',
   'course-media/c1/LLB_C1_M3_v1.mp4', 'course-media/c1/LLB_C1_M3_v1.mp3', 210),
  ('balanced-living-blueprint', 4, 'Boundaries & Balance',
   'Saying no without guilt, and protecting the capacity that everything else depends on.',
   'course-media/c1/LLB_C1_M4_v1.mp4', 'course-media/c1/LLB_C1_M4_v1.mp3', 210),
  ('balanced-living-blueprint', 5, 'Rest as Resistance',
   'Why rest is not a reward you earn, and how to treat recovery as part of the work.',
   'course-media/c1/LLB_C1_M5_v1.mp4', 'course-media/c1/LLB_C1_M5_v1.mp3', 210),
  ('balanced-living-blueprint', 6, 'Your Balanced Life Plan',
   'Assemble everything into a written plan you can actually keep.',
   'course-media/c1/LLB_C1_M6_v1.mp4', 'course-media/c1/LLB_C1_M6_v1.mp3', 240),

  -- Course 2
  ('justice-advocacy', 1, 'The Power of Your Story',
   'Your story is not your shame — it is your credential. The struggle → breakthrough → vision framework.',
   'course-media/c2/LLB_C2_M1_v1.mp4', 'course-media/c2/LLB_C2_M1_v1.mp3', 210),
  ('justice-advocacy', 2, 'Understanding Justice Systems',
   'How the system is actually structured, and where an individual advocate has real leverage.',
   'course-media/c2/LLB_C2_M2_v1.mp4', 'course-media/c2/LLB_C2_M2_v1.mp3', 210),
  ('justice-advocacy', 3, 'Building Your Platform',
   'Establishing credibility and reach without waiting for a title or an institution.',
   'course-media/c2/LLB_C2_M3_v1.mp4', 'course-media/c2/LLB_C2_M3_v1.mp3', 210),
  ('justice-advocacy', 4, 'Organizing for Change',
   'Moving from individual voice to organized effort — coalitions, meetings, and momentum.',
   'course-media/c2/LLB_C2_M4_v1.mp4', 'course-media/c2/LLB_C2_M4_v1.mp3', 210),
  ('justice-advocacy', 5, 'Wellness in Advocacy',
   'Sustaining yourself in work that does not end, so the mission outlives your burnout.',
   'course-media/c2/LLB_C2_M5_v1.mp4', 'course-media/c2/LLB_C2_M5_v1.mp3', 210),
  ('justice-advocacy', 6, 'From Protest to Policy',
   'Turning pressure into legislation — your campaign plan, letters, and the rooms that decide.',
   'course-media/c2/LLB_C2_M6_v1.mp4', 'course-media/c2/LLB_C2_M6_v1.mp3', 240),

  -- Course 3
  ('faith-based-transformation', 1, 'Faith as Foundation',
   'You can lock up a body, but not a purpose God still has plans for. Building on what does not move.',
   'course-media/c3/LLB_C3_M1_v1.mp4', 'course-media/c3/LLB_C3_M1_v1.mp3', 210),
  ('faith-based-transformation', 2, 'Overcoming Self-Doubt',
   'Silencing the voice that says you are disqualified, and recovering your God-given identity.',
   'course-media/c3/LLB_C3_M2_v1.mp4', 'course-media/c3/LLB_C3_M2_v1.mp3', 210),
  ('faith-based-transformation', 3, 'Healing Through Forgiveness',
   'Forgiveness as release rather than approval — including forgiving yourself.',
   'course-media/c3/LLB_C3_M3_v1.mp4', 'course-media/c3/LLB_C3_M3_v1.mp3', 210),
  ('faith-based-transformation', 4, 'Purpose Over Pain',
   'Letting the hardest chapter become the reason you can reach someone else.',
   'course-media/c3/LLB_C3_M4_v1.mp4', 'course-media/c3/LLB_C3_M4_v1.mp3', 210),
  ('faith-based-transformation', 5, 'Living Life Balanced in Christ',
   'Daily rhythm, devotion, and practice — faith that shows up on ordinary Tuesdays.',
   'course-media/c3/LLB_C3_M5_v1.mp4', 'course-media/c3/LLB_C3_M5_v1.mp3', 210),
  ('faith-based-transformation', 6, 'Walking in Legacy',
   'Your faith-driven life plan, and what you leave behind for the people after you.',
   'course-media/c3/LLB_C3_M6_v1.mp4', 'course-media/c3/LLB_C3_M6_v1.mp3', 240)
) as v(course_slug, sort, title, summary, video_path, audio_path, duration_seconds)
join public.courses c on c.slug = v.course_slug
on conflict (course_id, sort) do update
  set title            = excluded.title,
      summary          = excluded.summary,
      video_path       = excluded.video_path,
      audio_path       = excluded.audio_path,
      duration_seconds = excluded.duration_seconds;
