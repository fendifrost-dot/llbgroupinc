/**
 * Where product imagery lives. Files go in public/ at these exact paths; each
 * slot on the site shows its image once the file exists and stays as it is
 * today until then (see useImageAvailable).
 */

/** Program cover. Courses are portrait (2:3); "llb-complete" is landscape (16:9). */
export const courseCover = (slug: string) => `/images/courses/${slug}.jpg`;

/** Workbook spread built from the real workbook PDF, 1600x1000. */
export const courseWorkbook = (slug: string) => `/images/courses/${slug}-workbook.jpg`;

/** E-book cover art, portrait (2:3). */
export const EBOOK_MOCKUP = "/images/ebook/living-life-balanced.jpg";

/** Poster frame for a trailer: same path as the video with a -poster.jpg suffix. */
export const trailerPoster = (trailerSrc: string) => trailerSrc.replace(/\.mp4$/i, "-poster.jpg");
