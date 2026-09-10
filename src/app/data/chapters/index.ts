import { Chapter } from '../../core/models/chapter.models';
import { WHY_DSA } from './why-dsa.chapter';
import { FOUNDATIONS } from './foundations.chapter';
import { COMPLEXITY } from './complexity.chapter';
import { MATHEMATICS } from './mathematics.chapter';
import { ARRAYS } from './arrays.chapter';
import { STRINGS } from './strings.chapter';
import { HASHING } from './hashing.chapter';
import { TWO_POINTERS } from './two-pointers.chapter';
import { SLIDING_WINDOW } from './sliding-window.chapter';
import { BINARY_SEARCH } from './binary-search.chapter';
import { SORTING } from './sorting.chapter';
import { RECURSION } from './recursion.chapter';
import { LINKED_LISTS } from './linked-lists.chapter';
import { STACKS_QUEUES } from './stacks-queues.chapter';
import { TREES } from './trees.chapter';
import { HEAPS } from './heaps.chapter';
import { GRAPHS } from './graphs.chapter';
import { GREEDY } from './greedy.chapter';
import { DYNAMIC_PROGRAMMING } from './dynamic-programming.chapter';
import { ADVANCED } from './advanced.chapter';

/**
 * The curriculum, in reading order. This array is the single source of truth:
 * the sidebar, the topic index and the previous/next links all derive from it.
 */
export const CHAPTERS: Chapter[] = [
  WHY_DSA,
  FOUNDATIONS,
  COMPLEXITY,
  MATHEMATICS,
  ARRAYS,
  STRINGS,
  HASHING,
  TWO_POINTERS,
  SLIDING_WINDOW,
  BINARY_SEARCH,
  SORTING,
  RECURSION,
  LINKED_LISTS,
  STACKS_QUEUES,
  TREES,
  HEAPS,
  GRAPHS,
  GREEDY,
  DYNAMIC_PROGRAMMING,
  ADVANCED,
];

export function chapterBySlug(slug: string): Chapter | undefined {
  return CHAPTERS.find((chapter) => chapter.slug === slug);
}

export function chapterIndex(slug: string): number {
  return CHAPTERS.findIndex((chapter) => chapter.slug === slug);
}

export const TOTAL_SECTIONS = CHAPTERS.reduce(
  (total, chapter) => total + chapter.sections.length,
  0,
);

export const TOTAL_READING_MINUTES = CHAPTERS.reduce(
  (total, chapter) => total + chapter.readingMinutes,
  0,
);
