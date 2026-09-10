import { Level } from '../core/models';

export interface TopicMeta {
  order: number;
  slug: string;
  title: string;
  /** Short name for the sidebar and previous/next links. */
  label: string;
  level: Level;
  minutes: number;
  sections: number;
  summary: string;
}

/**
 * Metadata for every topic, without the lesson text. The header, footer, sidebar
 * and landing page read this so the chapters themselves stay in a lazy chunk.
 * `topics.spec.ts` fails the build if it ever drifts from the chapters.
 */
export const TOPICS: TopicMeta[] = [
  {
    order: 1,
    slug: 'why-dsa',
    title: 'Why DSA? Start here',
    label: 'Why DSA',
    level: 'Foundations',
    minutes: 18,
    sections: 11,
    summary:
      'Before any code: what data structures and algorithms actually are, why a slow program stays slow no matter how fast your laptop is, and what changes once you can reason about cost.',
  },
  {
    order: 2,
    slug: 'foundations',
    title: 'Programming Foundations',
    label: 'Foundations',
    level: 'Foundations',
    minutes: 26,
    sections: 10,
    summary:
      'The machinery every algorithm is written with: how values live in memory, what a reference really is, why an array is fast, and what the call stack is doing while your recursion runs.',
  },
  {
    order: 3,
    slug: 'complexity',
    title: 'Complexity Analysis',
    label: 'Complexity',
    level: 'Foundations',
    minutes: 28,
    sections: 10,
    summary:
      'How to predict the cost of code before running it: Big-O and its siblings, the four rules that cover most analysis, amortised cost, recurrences, and reading the constraints to decide what you are allowed to write.',
  },
  {
    order: 4,
    slug: 'mathematics',
    title: 'Mathematics for DSA',
    label: 'Mathematics',
    level: 'Foundations',
    minutes: 26,
    sections: 9,
    summary:
      'The number theory, combinatorics and bit tricks that turn brute-force problems into one-line formulas: GCD, primes, modular arithmetic, counting and XOR.',
  },
  {
    order: 5,
    slug: 'arrays',
    title: 'Arrays',
    label: 'Arrays',
    level: 'Core',
    minutes: 30,
    sections: 11,
    summary:
      'The structure everything else is built on: index arithmetic, in-place work, and the prefix, difference and running-best techniques that collapse nested loops into a single pass.',
  },
  {
    order: 6,
    slug: 'strings',
    title: 'Strings',
    label: 'Strings',
    level: 'Core',
    minutes: 28,
    sections: 8,
    summary:
      'Character-level reasoning first — frequency, anagrams, palindromes — then the matching algorithms that beat the naive scan: rolling hash, KMP, Z and Manacher.',
  },
  {
    order: 7,
    slug: 'hashing',
    title: 'Hashing',
    label: 'Hashing',
    level: 'Core',
    minutes: 24,
    sections: 8,
    summary:
      'How a hash table turns a search into a single memory access, what collisions really cost, and the handful of patterns — complement lookup, grouping, prefix hashing — that collapse quadratic solutions to linear.',
  },
  {
    order: 8,
    slug: 'two-pointers',
    title: 'Two Pointers',
    label: 'Two Pointers',
    level: 'Core',
    minutes: 22,
    sections: 8,
    summary:
      'Two indices moving under a rule that never rewinds. The cheapest way to turn a nested loop into a single pass — and the foundation the sliding window is built on.',
  },
  {
    order: 9,
    slug: 'sliding-window',
    title: 'Sliding Window',
    label: 'Sliding Window',
    level: 'Core',
    minutes: 24,
    sections: 7,
    summary:
      'One window over a contiguous range, maintained incrementally. Almost every "longest", "shortest" or "at most K" question about a contiguous run is this single idea.',
  },
  {
    order: 10,
    slug: 'binary-search',
    title: 'Binary Search',
    label: 'Binary Search',
    level: 'Core',
    minutes: 26,
    sections: 7,
    summary:
      'Halving a monotonic search space — first over a sorted array, then over the answer itself, which is what turns many "minimise the maximum" problems from impossible into routine.',
  },
  {
    order: 11,
    slug: 'sorting',
    title: 'Sorting & Selection',
    label: 'Sorting',
    level: 'Core',
    minutes: 28,
    sections: 9,
    summary:
      'How each classic sort works and what it costs, why comparison sorting cannot beat `n log n`, when counting beats comparing, and how to select the kth element without sorting at all.',
  },
  {
    order: 12,
    slug: 'recursion',
    title: 'Recursion & Backtracking',
    label: 'Recursion',
    level: 'Core',
    minutes: 28,
    sections: 8,
    summary:
      'Defining a problem in terms of itself, drawing the recursion tree to see the cost, and pruning a search that would otherwise explode. Trees, graphs and dynamic programming are all this chapter with extra bookkeeping.',
  },
  {
    order: 13,
    slug: 'linked-lists',
    title: 'Linked Lists',
    label: 'Linked Lists',
    level: 'Core',
    minutes: 26,
    sections: 9,
    summary:
      'Pointer surgery: reversing, finding the middle, detecting cycles and rebuilding lists without losing a reference. The clearest test of whether you can reason precisely about references.',
  },
  {
    order: 14,
    slug: 'stacks-queues',
    title: 'Stacks & Queues',
    label: 'Stacks & Queues',
    level: 'Core',
    minutes: 26,
    sections: 8,
    summary:
      'Two containers defined by the order they give things back, and the monotonic variants that answer "next greater element" style questions in a single pass instead of a nested loop.',
  },
  {
    order: 15,
    slug: 'trees',
    title: 'Trees',
    label: 'Trees',
    level: 'Core',
    minutes: 32,
    sections: 8,
    summary:
      'Hierarchies, the four traversal orders, and the habit of returning an answer up from the children that solves most tree problems. Then binary search trees, where the ordering does the work.',
  },
  {
    order: 16,
    slug: 'heaps',
    title: 'Heaps & Priority Queues',
    label: 'Heaps',
    level: 'Core',
    minutes: 24,
    sections: 9,
    summary:
      'A partial order that hands you the extreme element in constant time and restores itself in logarithmic time. Top-K, k-way merges, streaming medians and scheduling all reduce to picking the right heap.',
  },
  {
    order: 17,
    slug: 'graphs',
    title: 'Graphs',
    label: 'Graphs',
    level: 'Advanced',
    minutes: 38,
    sections: 13,
    summary:
      'Modelling relationships and traversing them: BFS and DFS, cycles and components, topological order, shortest paths, minimum spanning trees and disjoint sets. Many hard-looking problems are ordinary graph problems in disguise.',
  },
  {
    order: 18,
    slug: 'greedy',
    title: 'Greedy Algorithms',
    label: 'Greedy',
    level: 'Advanced',
    minutes: 24,
    sections: 7,
    summary:
      'Making the locally best choice — and, more importantly, proving the local choice is safe. Greedy is short to write and easy to get wrong; the exchange argument is what separates the two.',
  },
  {
    order: 19,
    slug: 'dynamic-programming',
    title: 'Dynamic Programming',
    label: 'Dynamic Programming',
    level: 'Advanced',
    minutes: 40,
    sections: 10,
    summary:
      'Recursion with memory. Define the state, write the transition, then trade the call stack for a table. Every classic DP — knapsack, LCS, edit distance, LIS — is that same three-step recipe with a different state.',
  },
  {
    order: 20,
    slug: 'advanced',
    title: 'Advanced Structures',
    label: 'Advanced',
    level: 'Expert',
    minutes: 30,
    sections: 9,
    summary:
      'What to reach for when the core toolkit runs out of speed: tries for prefixes, Fenwick and segment trees for range queries, sparse tables for immutable ranges, and the specialised structures behind real systems.',
  },
];

export const TOTAL_TOPIC_SECTIONS = TOPICS.reduce((n, t) => n + t.sections, 0);

export const TOTAL_TOPIC_MINUTES = TOPICS.reduce((n, t) => n + t.minutes, 0);
