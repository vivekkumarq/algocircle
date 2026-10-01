import { Course, CourseLesson, lessonsOf } from './course.model';
import { ARRAY_LESSONS } from './arrays.lessons';
import {
  FAST_SLOW,
  ITERATIVE_DFS,
  SEGMENT_TREE,
  TRIE,
  TWO_HEAPS,
  UNION_FIND,
} from './structures.lessons';
import { BACKTRACKING_LESSONS } from './backtracking.lessons';
import { GRAPH_LESSONS } from './graphs.lessons';
import { DP_LESSONS } from './dp.lessons';

/**
 * The advanced course: one lesson per technique, in the order a reader can
 * absorb them. It sits alongside the curriculum rather than replacing it — the
 * chapters teach a subject, a lesson here teaches a single move in depth.
 */
export const ADVANCED_COURSE: Course = {
  slug: 'advanced-algorithms',
  path: 'course',
  name: 'Advanced Algorithms',
  shortName: 'Advanced Algorithms',
  tagline: 'The techniques that turn a correct solution into an optimal one.',
  description:
    'Twenty-two techniques, each one lesson: what it is for, why it is correct, the code in Java and Python, the cost, the trap, and the problems that drill it. Work through it after the core topics — every lesson assumes you already know the data structure it uses.',
  topicLabel: 'Assumes',
  aside: { label: 'Core topics first', link: '/learn' },
  finish: { label: 'Finished the course', title: 'Work the Core List', link: '/list/core-75' },
  footnote:
    'Every lesson states the technique, why it is correct, what it costs, and the mistake people make — then sends you straight to problems that need it. Read them in order, or jump to the one blocking you.',
  sections: [
    {
      name: 'Arrays',
      blurb: 'Linear scans that replace nested loops. The highest return on effort in the whole subject.',
      lessons: ARRAY_LESSONS,
    },
    {
      name: 'Linked lists',
      blurb: 'Two pointers at different speeds, and what that single difference buys you.',
      lessons: [FAST_SLOW],
    },
    {
      name: 'Trees',
      blurb: 'Traversal without recursion, and the control it gives you over when a node is finished.',
      lessons: [ITERATIVE_DFS],
    },
    {
      name: 'Advanced structures',
      blurb: 'Three structures that answer a question no array can: prefixes, connectivity, and live ranges.',
      lessons: [TRIE, UNION_FIND, SEGMENT_TREE],
    },
    {
      name: 'Heaps',
      blurb: 'Keeping the middle of a moving dataset in sight.',
      lessons: [TWO_HEAPS],
    },
    {
      name: 'Backtracking',
      blurb: 'Searching a decision tree: choose, recurse, undo — and prune before you descend.',
      lessons: BACKTRACKING_LESSONS,
    },
    {
      name: 'Graphs',
      blurb: 'Weighted shortest paths, minimum spanning trees, and dependency order.',
      lessons: GRAPH_LESSONS,
    },
    {
      name: 'Dynamic programming',
      blurb: 'The two tables — capacity and two-string — that most DP problems reduce to.',
      lessons: DP_LESSONS,
    },
  ],
};

/** Every lesson in reading order, flattened across the sections. */
export const COURSE_LESSONS: CourseLesson[] = lessonsOf(ADVANCED_COURSE);

export const TOTAL_COURSE_LESSONS = COURSE_LESSONS.length;

export const TOTAL_COURSE_MINUTES = COURSE_LESSONS.reduce(
  (total, lesson) => total + lesson.minutes,
  0,
);

export type { Course, CourseLesson, CourseSection } from './course.model';
