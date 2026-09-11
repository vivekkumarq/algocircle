import { PROBLEMS } from './index';

export interface ListGroup {
  name: string;
  /** Problem slugs, in the order they should be attempted. */
  slugs: string[];
}

export interface CuratedList {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  groups: ListGroup[];
}

/**
 * Curated practice lists. The groups are the classic interview categories
 * used by every well-known 75-problem list; the problems and their write-ups
 * are this project's own.
 */
export const CORE_75: CuratedList = {
  slug: 'core-75',
  name: 'The Core List',
  tagline: 'The shortest set of problems that covers every technique worth knowing.',
  description:
    'Grouped the way the classic interview lists are, and ordered so each group builds on the one before. Work down it and you will meet every pattern in the library at least once. Each row opens the full write-up: statement, graded hints, brute force, the optimal approach, then Java and Python.',
  groups: [
    {
      name: 'Arrays & Hashing',
      slugs: [
        'two-sum',
        'group-anagrams',
        'top-k-frequent',
        'product-except-self',
        'longest-consecutive',
        'valid-sudoku',
        'subarray-sum-k',
        'max-subarray-sum',
      ],
    },
    {
      name: 'Two Pointers',
      slugs: ['valid-palindrome-one-delete', 'three-sum', 'container-most-water', 'trapping-rain-water', 'sort-colours'],
    },
    {
      name: 'Sliding Window',
      slugs: ['longest-unique-substring', 'at-most-k-distinct', 'min-size-subarray-sum', 'min-window-substring', 'max-in-each-window'],
    },
    {
      name: 'Stack',
      slugs: ['valid-parentheses', 'min-stack', 'daily-temperatures', 'largest-rectangle-histogram'],
    },
    {
      name: 'Binary Search',
      slugs: ['first-last-occurrence', 'search-rotated', 'ship-within-days', 'median-two-sorted'],
    },
    {
      name: 'Linked List',
      slugs: ['reverse-linked-list', 'merge-k-lists', 'linked-list-cycle-start', 'lru-cache'],
    },
    {
      name: 'Trees',
      slugs: ['tree-diameter', 'validate-bst', 'lowest-common-ancestor', 'serialise-tree'],
    },
    {
      name: 'Tries & Bit Manipulation',
      slugs: ['implement-trie', 'maximum-xor-pair', 'single-number', 'swap-without-temp'],
    },
    {
      name: 'Heap / Priority Queue',
      slugs: ['kth-largest', 'k-closest-points', 'task-scheduler', 'running-median', 'sliding-window-median'],
    },
    {
      name: 'Backtracking',
      slugs: ['generate-subsets', 'combination-sum', 'permutations', 'n-queens'],
    },
    {
      name: 'Graphs',
      slugs: ['number-of-islands', 'course-schedule', 'word-ladder', 'network-delay'],
    },
    {
      name: 'Dynamic Programming',
      slugs: ['climbing-stairs', 'coin-change', 'longest-increasing-subsequence', 'edit-distance', 'longest-palindromic-substring'],
    },
    {
      name: 'Greedy',
      slugs: ['gas-station', 'jump-game-ii', 'partition-labels'],
    },
    {
      name: 'Intervals',
      slugs: ['merge-intervals-problem', 'non-overlapping-intervals', 'meeting-rooms'],
    },
    {
      name: 'Sorting & Selection',
      slugs: ['count-inversions', 'largest-number', 'rotate-array', 'reverse-array-in-place'],
    },
    {
      name: 'Maths',
      slugs: ['count-primes', 'gcd-of-array', 'power-mod', 'count-digits'],
    },
    {
      name: 'Range Queries',
      slugs: ['range-sum-mutable'],
    },
    {
      name: 'Reading the constraints',
      slugs: ['constraints-to-approach', 'classify-loops', 'amortised-append', 'recursion-cost', 'fizz-trace'],
    },
  ],
};

export const CURATED_LISTS: CuratedList[] = [CORE_75];

export function listBySlug(slug: string): CuratedList | undefined {
  return CURATED_LISTS.find((list) => list.slug === slug);
}

/** Number of problems in a list, counting only slugs that actually resolve. */
export function listSize(list: CuratedList): number {
  const known = new Set(PROBLEMS.map((problem) => problem.slug));
  return list.groups.reduce(
    (total, group) => total + group.slugs.filter((slug) => known.has(slug)).length,
    0,
  );
}
