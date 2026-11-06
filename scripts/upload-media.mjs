#!/usr/bin/env node
/**
 * Course media uploader and verifier.
 *
 * Puts delivered course files into the private storage buckets at the paths
 * the database expects, and proves they are reachable afterwards. Nothing is
 * hard-coded per file: the targets come from the `modules` and `courses`
 * tables, and a delivered file is matched to its row by the video pipeline's
 * naming convention, so a new course, module or version works unchanged once
 * its rows exist (seed migration or SQL).
 *
 *   LLB_C{n}_M{m}_v{v}.mp4 / .mp3   -> modules.video_path / audio_path  (course-media)
 *   LLB_C{n}_WORKBOOK_v{v}.pdf       -> courses.workbook_path            (course-docs)
 *   LLB_C{n}_TRAILER_v{v}.mp4        -> courses.trailer_url              (course-public)
 *   LLB_C{n}_TRAILER_v{v}-poster.jpg -> next to the trailer              (course-public)
 *   LLB_EBOOK_7_PRINCIPLES_v{v}.pdf  -> course-docs/ebook/LLB_EBOOK_7_PRINCIPLES_v1.pdf (fixed key read by get-media-url)
 *   LLB_EBOOK_CHAPTER_1_v{v}.pdf     -> course-docs/samples/LLB_EBOOK_CHAPTER_1_v1.pdf   (fixed key read by lead-magnet)
 *
 * The course number {n} is read from the row's own stored path, so it never
 * depends on sort order. If a delivered version differs from the stored one,
 * the row's path is updated to the delivered file after a successful upload.
 *
 * Usage (from the repo root, after `npm install`):
 *
 *   SUPABASE_SERVICE_ROLE_KEY=... node scripts/upload-media.mjs --source "/path/to/delivered/files"
 *
 * Options:
 *   --source <dir>         Folder to scan recursively for delivered files.
 *   --dry-run              Plan and report; upload and update nothing.
 *   --verify-only          Skip uploading; only check what the database points at.
 *   --force                Re-upload even when an object of the same size exists.
 *   --verify-as <email:password>
 *                          Also sign in as that student and call get-media-url for
 *                          every module, workbook and the e-book, exactly as the
 *                          player does. The account must own the programs.
 *
 * Environment:
 *   SUPABASE_SERVICE_ROLE_KEY   required (Lovable Cloud -> backend settings). Never commit it.
 *   SUPABASE_URL                optional; defaults to VITE_SUPABASE_URL from .env
 *   SUPABASE_PUBLISHABLE_KEY    optional (for --verify-as); defaults to VITE_SUPABASE_PUBLISHABLE_KEY from .env
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export { classify, parseStored, retarget, plan, FIXED_KEYS };

// ---------------------------------------------------------------------------
// Arguments and environment
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};

const SOURCE = option("--source");
const DRY_RUN = flag("--dry-run");
const VERIFY_ONLY = flag("--verify-only");
const FORCE = flag("--force");
const VERIFY_AS = option("--verify-as");

function readDotEnv() {
  const values = {};
  for (const file of [".env", ".env.local"]) {
    try {
      for (const line of readFileSync(resolve(file), "utf8").split("\n")) {
        const match = /^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/.exec(line);
        if (match) values[match[1]] = match[2];
      }
    } catch {
      // optional
    }
  }
  return values;
}

const dotenv = readDotEnv();
const SUPABASE_URL = process.env.SUPABASE_URL ?? dotenv.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY ?? dotenv.VITE_SUPABASE_PUBLISHABLE_KEY;

function die(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

let admin;
function connect() {
  if (!SUPABASE_URL) die("SUPABASE_URL is not set and VITE_SUPABASE_URL was not found in .env");
  if (!SERVICE_ROLE_KEY) die("SUPABASE_SERVICE_ROLE_KEY is required (Lovable Cloud backend settings)");
  if (!SOURCE && !VERIFY_ONLY) die("--source <dir> is required unless --verify-only is given");
  admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });
}

// ---------------------------------------------------------------------------
// Naming convention
// ---------------------------------------------------------------------------

const CONTENT_TYPES = {
  ".mp4": "video/mp4",
  ".mp3": "audio/mpeg",
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

/** Fixed keys that edge functions read by name rather than from a row. */
const FIXED_KEYS = {
  ebook: "course-docs/ebook/LLB_EBOOK_7_PRINCIPLES_v1.pdf",
  sample: "course-docs/samples/LLB_EBOOK_CHAPTER_1_v1.pdf",
};

/** Classify a delivered file by its name. Returns null for anything else. */
function classify(file) {
  const name = basename(file);
  let match;
  if ((match = /^LLB_C(\d+)_M(\d+)_v(\d+)\.(mp4|mp3)$/i.exec(name))) {
    return { kind: match[4].toLowerCase() === "mp4" ? "video" : "audio", course: +match[1], module: +match[2], version: +match[3], name };
  }
  if ((match = /^LLB_C(\d+)_WORKBOOK_v(\d+)\.pdf$/i.exec(name))) {
    return { kind: "workbook", course: +match[1], version: +match[2], name };
  }
  if ((match = /^LLB_C(\d+)_TRAILER_v(\d+)-poster\.(jpe?g|png)$/i.exec(name))) {
    return { kind: "poster", course: +match[1], version: +match[2], name };
  }
  if ((match = /^LLB_C(\d+)_TRAILER_v(\d+)\.mp4$/i.exec(name))) {
    return { kind: "trailer", course: +match[1], version: +match[2], name };
  }
  if ((match = /^LLB_EBOOK_7_PRINCIPLES_v(\d+)\.pdf$/i.exec(name))) {
    return { kind: "ebook", version: +match[1], name };
  }
  if ((match = /^LLB_EBOOK_CHAPTER_1_v(\d+)\.pdf$/i.exec(name))) {
    return { kind: "sample", version: +match[1], name };
  }
  return null;
}

/** "course-media/c1/LLB_C1_M2_v1.mp4" -> { bucket, key, dir, name, course, version } */
function parseStored(stored) {
  if (!stored) return null;
  const slash = stored.indexOf("/");
  if (slash <= 0) return null;
  const bucket = stored.slice(0, slash);
  const key = stored.slice(slash + 1);
  const name = basename(key);
  const dir = key.slice(0, key.length - name.length);
  const course = /LLB_C(\d+)_/i.exec(name)?.[1];
  const version = /_v(\d+)(?:-poster)?\.[a-z0-9]+$/i.exec(name)?.[1];
  return { bucket, key, dir, name, course: course ? +course : null, version: version ? +version : null };
}

/** The same stored path with the delivered file's name in place of the old one. */
function retarget(stored, deliveredName) {
  const parsed = parseStored(stored);
  return `${parsed.bucket}/${parsed.dir}${deliveredName}`;
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith(".")) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Database targets
// ---------------------------------------------------------------------------

async function loadTargets() {
  const { data: courses, error: coursesError } = await admin
    .from("courses")
    .select("id, slug, title, trailer_url, workbook_path");
  if (coursesError) throw coursesError;
  const { data: modules, error: modulesError } = await admin
    .from("modules")
    .select("id, course_id, sort, title, video_path, audio_path")
    .order("sort");
  if (modulesError) throw modulesError;

  // Course number comes from the row's own paths, never from sort order.
  const courseNumber = (course) => {
    const fromWorkbook = parseStored(course.workbook_path)?.course;
    const fromTrailer = parseStored(course.trailer_url)?.course;
    const fromModule = modules
      .filter((module) => module.course_id === course.id)
      .map((module) => parseStored(module.video_path)?.course ?? parseStored(module.audio_path)?.course)
      .find(Boolean);
    return fromWorkbook ?? fromTrailer ?? fromModule ?? null;
  };

  const byCourse = new Map();
  for (const course of courses) {
    const number = courseNumber(course);
    if (number === null) {
      console.warn(`skip: course ${course.slug} has no LLB_C{n} path to match on`);
      continue;
    }
    byCourse.set(number, course);
  }

  const byModule = new Map();
  for (const module of modules) {
    const number = parseStored(module.video_path)?.course ?? parseStored(module.audio_path)?.course;
    const index = /_M(\d+)_/i.exec(module.video_path ?? module.audio_path ?? "")?.[1];
    if (number === null || number === undefined || !index) {
      console.warn(`skip: module "${module.title}" has no LLB_C{n}_M{m} path to match on`);
      continue;
    }
    byModule.set(`C${number}_M${+index}`, module);
  }

  return { courses, modules, byCourse, byModule };
}

// ---------------------------------------------------------------------------
// Planning
// ---------------------------------------------------------------------------

/** One upload: { file, bucket, key, table, id, column, stored, newStored } */
function plan(files, targets) {
  const uploads = [];
  const unmatched = [];

  for (const file of files) {
    const info = classify(file);
    if (!info) {
      unmatched.push({ file, reason: "name does not follow the LLB_C{n}_... convention" });
      continue;
    }

    if (info.kind === "video" || info.kind === "audio") {
      const module = targets.byModule.get(`C${info.course}_M${info.module}`);
      if (!module) {
        unmatched.push({ file, reason: `no module row for course ${info.course}, module ${info.module}` });
        continue;
      }
      const column = info.kind === "video" ? "video_path" : "audio_path";
      const stored = module[column] ?? retarget(module.video_path ?? module.audio_path, info.name);
      const newStored = retarget(stored, info.name);
      uploads.push({ file, ...parseStored(newStored), table: "modules", id: module.id, column, stored, newStored, label: `module ${info.course}.${info.module} ${info.kind}` });
      continue;
    }

    if (info.kind === "workbook" || info.kind === "trailer" || info.kind === "poster") {
      const course = targets.byCourse.get(info.course);
      if (!course) {
        unmatched.push({ file, reason: `no course row for course ${info.course}` });
        continue;
      }
      if (info.kind === "workbook") {
        const stored = course.workbook_path ?? `course-docs/workbooks/${info.name}`;
        const newStored = retarget(stored, info.name);
        uploads.push({ file, ...parseStored(newStored), table: "courses", id: course.id, column: "workbook_path", stored, newStored, label: `${course.slug} workbook` });
      } else if (info.kind === "trailer") {
        const stored = course.trailer_url ?? `course-public/trailers/${info.name}`;
        const newStored = retarget(stored, info.name);
        uploads.push({ file, ...parseStored(newStored), table: "courses", id: course.id, column: "trailer_url", stored, newStored, label: `${course.slug} trailer` });
      } else {
        // The poster sits beside the trailer and is found by name, no column.
        const stored = course.trailer_url ?? `course-public/trailers/${info.name}`;
        const newStored = retarget(stored, info.name);
        uploads.push({ file, ...parseStored(newStored), table: null, label: `${course.slug} trailer poster` });
      }
      continue;
    }

    // Fixed keys: the delivered version is uploaded under the key the edge
    // functions read, whatever version number the file carries.
    const key = FIXED_KEYS[info.kind];
    uploads.push({ file, ...parseStored(key), table: null, label: info.kind === "ebook" ? "e-book" : "chapter one sample", renamed: info.name !== basename(key) });
  }

  return { uploads, unmatched };
}

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------

async function existingSize(bucket, dir, name) {
  const { data, error } = await admin.storage.from(bucket).list(dir.replace(/\/$/, ""), { search: name, limit: 100 });
  if (error) return null;
  const hit = data?.find((object) => object.name === name);
  return hit?.metadata?.size ?? null;
}

async function upload(item) {
  const size = statSync(item.file).size;
  const current = await existingSize(item.bucket, item.dir, item.name);
  if (current === size && !FORCE) return { status: "skipped", detail: "same size already in storage" };
  if (DRY_RUN) return { status: "planned", detail: `${(size / 1e6).toFixed(1)} MB -> ${item.bucket}/${item.key}` };

  const body = readFileSync(item.file);
  const contentType = CONTENT_TYPES[extname(item.file).toLowerCase()] ?? "application/octet-stream";
  const { error } = await admin.storage.from(item.bucket).upload(item.key, body, { contentType, upsert: true });
  if (error) return { status: "failed", detail: error.message };
  return { status: "uploaded", detail: `${(size / 1e6).toFixed(1)} MB` };
}

async function updateRow(item) {
  if (!item.table || item.stored === item.newStored) return false;
  if (DRY_RUN) return true;
  const { error } = await admin.from(item.table).update({ [item.column]: item.newStored }).eq("id", item.id);
  if (error) throw new Error(`could not update ${item.table}.${item.column}: ${error.message}`);
  return true;
}

/** Signed URL plus a HEAD request: the same check get-media-url performs, then a real fetch. */
async function reachable(stored) {
  const parsed = parseStored(stored);
  if (!parsed) return { ok: false, detail: "malformed path" };
  const { data, error } = await admin.storage.from(parsed.bucket).createSignedUrl(parsed.key, 60);
  if (error || !data) return { ok: false, detail: "no object" };
  try {
    const response = await fetch(data.signedUrl, { method: "HEAD" });
    if (!response.ok) return { ok: false, detail: `HTTP ${response.status}` };
    const length = response.headers.get("content-length");
    return { ok: true, detail: length ? `${(+length / 1e6).toFixed(1)} MB` : "ok" };
  } catch (error) {
    return { ok: false, detail: error.message };
  }
}

// ---------------------------------------------------------------------------
// Verification through the real edge function, as a student
// ---------------------------------------------------------------------------

async function verifyAsStudent(targets) {
  if (!VERIFY_AS) return;
  if (!PUBLISHABLE_KEY) {
    console.warn("--verify-as needs SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY in .env)");
    return;
  }
  const [email, password] = VERIFY_AS.split(":");
  const student = createClient(SUPABASE_URL, PUBLISHABLE_KEY, { auth: { persistSession: false } });
  const { error } = await student.auth.signInWithPassword({ email, password });
  if (error) {
    console.warn(`--verify-as: sign-in failed for ${email}: ${error.message}`);
    return;
  }

  console.log(`\nget-media-url as ${email}`);
  const call = async (body) => {
    const { data, error } = await student.functions.invoke("get-media-url", { body });
    if (error) return `error: ${error.message}`;
    if (data?.url) return "url issued";
    return `no url (${data?.code ?? data?.error ?? "unknown"})`;
  };

  for (const course of targets.courses) {
    console.log(`  ${course.slug} workbook: ${await call({ kind: "workbook", courseSlug: course.slug })}`);
    for (const module of targets.modules.filter((row) => row.course_id === course.id)) {
      const video = await call({ kind: "video", moduleId: module.id });
      const audio = await call({ kind: "audio", moduleId: module.id });
      console.log(`  ${course.slug} module ${module.sort}: video ${video}; audio ${audio}`);
    }
  }
  console.log(`  e-book: ${await call({ kind: "ebook" })}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  connect();
  const targets = await loadTargets();
  console.log(`database: ${targets.courses.length} courses, ${targets.modules.length} modules`);

  if (!VERIFY_ONLY) {
    const files = walk(resolve(SOURCE));
    const { uploads, unmatched } = plan(files, targets);
    console.log(`source: ${files.length} files, ${uploads.length} matched, ${unmatched.length} unmatched${DRY_RUN ? " (dry run)" : ""}\n`);

    let failures = 0;
    for (const item of uploads) {
      const result = await upload(item);
      if (result.status === "failed") failures += 1;
      let line = `${result.status.padEnd(9)} ${item.label}: ${item.bucket}/${item.key} (${result.detail})`;
      if (item.renamed) line += ` [stored under the fixed key]`;
      if (result.status !== "failed") {
        const changed = await updateRow(item);
        if (changed) line += ` [${item.table}.${item.column}: ${basename(item.stored)} -> ${item.name}]`;
      }
      console.log(line);
    }
    for (const miss of unmatched) console.log(`unmatched ${basename(miss.file)}: ${miss.reason}`);
    if (failures) console.log(`\n${failures} upload(s) failed`);
  }

  // Re-read so the report reflects any path updates, then prove every object exists.
  const fresh = await loadTargets();
  console.log("\nverification (signed URL + HEAD, as get-media-url does)");
  let missing = 0;
  const check = async (label, stored) => {
    if (!stored) {
      console.log(`  ${label}: no path stored`);
      return;
    }
    const result = await reachable(stored);
    if (!result.ok) missing += 1;
    console.log(`  ${result.ok ? "ok     " : "MISSING"} ${label}: ${stored} (${result.detail})`);
  };
  for (const course of fresh.courses) {
    await check(`${course.slug} workbook`, course.workbook_path);
    await check(`${course.slug} trailer`, course.trailer_url);
    for (const module of fresh.modules.filter((row) => row.course_id === course.id)) {
      await check(`${course.slug} module ${module.sort} video`, module.video_path);
      await check(`${course.slug} module ${module.sort} audio`, module.audio_path);
    }
  }
  await check("e-book", FIXED_KEYS.ebook);
  await check("chapter one sample", FIXED_KEYS.sample);
  console.log(missing ? `\n${missing} object(s) still missing` : "\nevery stored path resolves to an object");

  await verifyAsStudent(fresh);
  process.exit(missing ? 2 : 0);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
