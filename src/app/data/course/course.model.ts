import { Block } from '../../core/models/chapter.models';

/**
 * A course lesson is a single technique, written as the same typed blocks as a
 * chapter. Chapters teach a whole subject; a lesson here teaches one move and
 * then points at the problems that drill it.
 */
export interface CourseLesson {
  slug: string;
  title: string;
  /** One line, shown in the lesson list and the page header. */
  tagline: string;
  /** Curriculum topic this assumes, linked as the prerequisite. */
  topic: string;
  /** Pattern-library slug, when the lesson teaches one of the patterns. */
  pattern?: string;
  minutes: number;
  blocks: Block[];
  /** Problem slugs from the catalogue that drill this technique. */
  practice: string[];
}

export interface CourseSection {
  name: string;
  blurb: string;
  lessons: CourseLesson[];
}

/**
 * One page component serves every course; what differs between them is data.
 * A course is handed to the page by its route, so each loads in its own chunk.
 */
export interface Course {
  slug: string;
  /** Served at `/<path>` (overview) and `/<path>/:slug` (a lesson). */
  path: string;
  name: string;
  /** For the breadcrumb, where the full name would wrap on a phone. */
  shortName: string;
  tagline: string;
  description: string;
  /** How a lesson header introduces its `topic`: "Assumes", "Related topic". */
  topicLabel: string;
  /** The overview's second button, beside "Start with …". */
  aside: { label: string; link: string };
  /** Where "next" points from the last lesson. */
  finish: { label: string; title: string; link: string };
  footnote: string;
  sections: CourseSection[];
}

/** Every lesson in reading order, flattened across the sections. */
export function lessonsOf(course: Course): CourseLesson[] {
  return course.sections.flatMap((section) => section.lessons);
}

export function lessonBySlug(course: Course, slug: string): CourseLesson | undefined {
  return lessonsOf(course).find((lesson) => lesson.slug === slug);
}

/** The section a lesson belongs to, for the breadcrumb. */
export function sectionOf(course: Course, slug: string): string | undefined {
  return course.sections.find((section) => section.lessons.some((lesson) => lesson.slug === slug))
    ?.name;
}

/** Previous and next lesson in reading order, for the pager. */
export function neighbours(
  course: Course,
  slug: string,
): { previous?: CourseLesson; next?: CourseLesson } {
  const lessons = lessonsOf(course);
  const index = lessons.findIndex((lesson) => lesson.slug === slug);
  if (index < 0) return {};

  return { previous: lessons[index - 1], next: lessons[index + 1] };
}
