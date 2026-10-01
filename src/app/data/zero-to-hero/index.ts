import { Course } from '../course/course.model';
import { HOW_TO_THINK } from './method.lessons';
import { BASICS_A } from './basics-a.lessons';
import { BASICS_B } from './basics-b.lessons';
import { ARRAY_PATTERNS } from './arrays.lessons';
import { LIST_PATTERNS, SEARCH_PATTERNS, STACK_PATTERNS } from './search.lessons';
import { GRAPH_PATTERNS, ORDER_PATTERNS } from './structures.lessons';
import { BIT_PATTERNS, OPTIMISATION_PATTERNS, RECURSION_PATTERNS } from './strategies.lessons';

/**
 * Zero to Hero: for the reader who knows some syntax but freezes in front of
 * a problem. It teaches one method (by hand, one sentence, brute force, what
 * repeats, the better version, dry run) and drills it from a first loop to
 * every pattern in the library, with every line of code explained.
 */
export const ZERO_TO_HERO: Course = {
  slug: 'zero-to-hero',
  path: 'zero-to-hero',
  name: 'Zero to Hero: Logic to Code',
  shortName: 'Zero to Hero',
  tagline:
    'Learn to think through a problem and turn that thinking into code, one commented line at a time.',
  description:
    'For anyone who reads a problem and cannot see where to start, or knows the idea but cannot write it. You learn one method (solve it by hand, say the rule in a sentence, write the slow version, find what it repeats, write the better one) and practise it from your first loop to the interview patterns. Every line of code says **why** it is there, in Java and Python.',
  topicLabel: 'Related topic',
  aside: { label: 'Read the full guide', link: '/guide/build-logic' },
  finish: { label: 'Finished Zero to Hero', title: 'Work the Core List', link: '/list/core-75' },
  footnote:
    'Do the lessons in order and type every line yourself. After each lesson, solve one practice problem with the seven steps before moving on, and come back three days later to write it again from memory.',
  sections: [
    {
      name: 'Start here',
      blurb: 'The seven-step method the rest of the course repeats, and what to do when you are stuck.',
      lessons: [HOW_TO_THINK],
    },
    {
      name: 'Logic building',
      blurb: 'Make the language disappear: plan in English, then translate. Loops, conditions, digits, patterns, strings, arrays and functions.',
      lessons: [...BASICS_A, ...BASICS_B],
    },
    {
      name: 'Array and string patterns',
      blurb: 'The six shapes behind most array questions: two ends, a sliding block, running totals, range marks, instant lookup and counting.',
      lessons: ARRAY_PATTERNS,
    },
    {
      name: 'Searching',
      blurb: 'Halving what is left: in a sorted array, and over the possible answers themselves.',
      lessons: SEARCH_PATTERNS,
    },
    {
      name: 'Linked lists',
      blurb: 'Two runners at different speeds, and turning arrows around without losing the list.',
      lessons: LIST_PATTERNS,
    },
    {
      name: 'Stacks and queues',
      blurb: 'Elements that wait for an answer, and windows that remember only the candidates that can still win.',
      lessons: STACK_PATTERNS,
    },
    {
      name: 'Intervals and heaps',
      blurb: 'Sorting so that overlaps sit side by side, and keeping only the best k of many.',
      lessons: ORDER_PATTERNS,
    },
    {
      name: 'Trees and graphs',
      blurb: 'Going deep, going wide, doing things in dependency order, tracking groups, and storing words by their letters.',
      lessons: GRAPH_PATTERNS,
    },
    {
      name: 'Recursion',
      blurb: 'Splitting a problem into halves, and exploring every choice with one list you undo as you go.',
      lessons: RECURSION_PATTERNS,
    },
    {
      name: 'Greedy and dynamic programming',
      blurb: 'When the best choice now is safe, and when you must remember every smaller answer instead.',
      lessons: OPTIMISATION_PATTERNS,
    },
    {
      name: 'Bits',
      blurb: 'The algebra of XOR and friends, for answers in constant memory.',
      lessons: BIT_PATTERNS,
    },
  ],
};
