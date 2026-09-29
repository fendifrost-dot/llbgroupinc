/**
 * Where product imagery lives. Files go in public/ at these exact paths; each
 * slot on the site shows its image once the file exists and stays as it is
 * today until then (see useImageAvailable).
 */

/** Program cover, 1600x1000. Slugs: the three courses and "llb-complete". */
export const courseCover = (slug: string) => `/images/courses/${slug}.jpg`;

/** Workbook spread built from the real workbook PDF, 1600x1000. */
export const courseWorkbook = (slug: string) => `/images/courses/${slug}-workbook.jpg`;

/** 3D mockup of the real e-book cover, 1200x1200. */
export const EBOOK_MOCKUP = "/images/ebook/living-life-balanced-3d.jpg";

/** Poster frame for a trailer: same path as the video with a -poster.jpg suffix. */
export const trailerPoster = (trailerSrc: string) => trailerSrc.replace(/\.mp4$/i, "-poster.jpg");
