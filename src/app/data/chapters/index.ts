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
import { REAL_WORLD } from './real-world.data';

function withRealWorld(chapter: Chapter): Chapter {
  const guide = REAL_WORLD[chapter.slug];
  if (!guide) {
    throw new Error(`Missing real-world guide for topic ${chapter.slug}`);
  }

  const [first, ...rest] = chapter.sections;
  const opening = [
    { kind: 'callout' as const, tone: 'why' as const, title: 'In a real project', text: guide.projectHook },
    ...first.blocks.slice(0, 1),
    ...(guide.extra ?? []),
    ...first.blocks.slice(1),
  ];

  return {
    ...chapter,
    readingMinutes: chapter.readingMinutes + 3,
    sections: [
      { ...first, blocks: opening },
      ...rest,
      {
        id: 'in-the-wild',
        title: 'Where this is used in real products',
        blocks: [
          {
            kind: 'para',
            text: guide.intro,
          },
          {
            kind: 'table',
            caption: 'Popular systems, not toy examples — the same idea as this topic, in production.',
            headers: ['Product / system', 'How this topic shows up'],
            rows: guide.uses,
          },
          {
            kind: 'callout',
            tone: 'key',
            title: 'Take this into an interview',
            text: 'If someone asks “where would you use this?”, pick one row from the table and say the structure, the operation, and why the slow alternative would miss the latency budget.',
          },
        ],
      },
    ],
  };
}

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
].map(withRealWorld);

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
