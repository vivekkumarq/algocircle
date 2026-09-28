import { Chapter } from '../../core/models/chapter.models';
import { enrichChapter } from './enrich';

/**
 * One loader per lesson, so reading a topic downloads that topic only. Each
 * `import()` is its own chunk; importing `./index` instead would pull in all
 * twenty lessons (about 630 KB) to show one.
 */
const LOADERS: Record<string, () => Promise<Chapter>> = {
  'why-dsa': () => import('./why-dsa.chapter').then((m) => m.WHY_DSA),
  foundations: () => import('./foundations.chapter').then((m) => m.FOUNDATIONS),
  complexity: () => import('./complexity.chapter').then((m) => m.COMPLEXITY),
  mathematics: () => import('./mathematics.chapter').then((m) => m.MATHEMATICS),
  arrays: () => import('./arrays.chapter').then((m) => m.ARRAYS),
  strings: () => import('./strings.chapter').then((m) => m.STRINGS),
  hashing: () => import('./hashing.chapter').then((m) => m.HASHING),
  'two-pointers': () => import('./two-pointers.chapter').then((m) => m.TWO_POINTERS),
  'sliding-window': () => import('./sliding-window.chapter').then((m) => m.SLIDING_WINDOW),
  'binary-search': () => import('./binary-search.chapter').then((m) => m.BINARY_SEARCH),
  sorting: () => import('./sorting.chapter').then((m) => m.SORTING),
  recursion: () => import('./recursion.chapter').then((m) => m.RECURSION),
  'linked-lists': () => import('./linked-lists.chapter').then((m) => m.LINKED_LISTS),
  'stacks-queues': () => import('./stacks-queues.chapter').then((m) => m.STACKS_QUEUES),
  trees: () => import('./trees.chapter').then((m) => m.TREES),
  heaps: () => import('./heaps.chapter').then((m) => m.HEAPS),
  graphs: () => import('./graphs.chapter').then((m) => m.GRAPHS),
  greedy: () => import('./greedy.chapter').then((m) => m.GREEDY),
  'dynamic-programming': () => import('./dynamic-programming.chapter').then((m) => m.DYNAMIC_PROGRAMMING),
  advanced: () => import('./advanced.chapter').then((m) => m.ADVANCED),
};

export const LOADABLE_SLUGS = Object.keys(LOADERS);

/** The lesson for a slug, fetched on demand; undefined for an unknown slug. */
export async function loadChapter(slug: string): Promise<Chapter | undefined> {
  const load = LOADERS[slug];
  return load ? enrichChapter(await load()) : undefined;
}
