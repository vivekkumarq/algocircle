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

export interface Course {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  sections: CourseSection[];
}
