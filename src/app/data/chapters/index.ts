import { Chapter } from '../../core/models/chapter.models';
import { WHY_DSA } from './why-dsa.chapter';
import { FOUNDATIONS } from './foundations.chapter';
import { COMPLEXITY } from './complexity.chapter';
import { ARRAYS } from './arrays.chapter';

/**
 * Written chapters, in reading order. A roadmap stage without an entry here
 * renders its syllabus outline instead, so the curriculum is never a blank page.
 */
export const CHAPTERS: Chapter[] = [WHY_DSA, FOUNDATIONS, COMPLEXITY, ARRAYS];

export function chapterBySlug(slug: string): Chapter | undefined {
  return CHAPTERS.find((chapter) => chapter.slug === slug);
}

export function chapterIndex(slug: string): number {
  return CHAPTERS.findIndex((chapter) => chapter.slug === slug);
}

/** Sections across all written chapters — the honest "lessons published" count. */
export const TOTAL_SECTIONS = CHAPTERS.reduce(
  (total, chapter) => total + chapter.sections.length,
  0,
);

export const TOTAL_READING_MINUTES = CHAPTERS.reduce(
  (total, chapter) => total + chapter.readingMinutes,
  0,
);
