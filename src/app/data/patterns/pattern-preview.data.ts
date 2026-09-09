/**
 * A compact slice of the pattern library used by the landing page. The full
 * pattern pages (Phase 2) extend these same records.
 */
export interface PatternPreview {
  slug: string;
  name: string;
  signals: string[];
  coreIdea: string;
  template: string;
  complexity: string;
}

export const PATTERN_PREVIEWS: PatternPreview[] = [
  {
    slug: 'sliding-window',
    name: 'Sliding Window',
    signals: [
      'longest / shortest contiguous ...',
      'subarray or substring',
      'at most K distinct',
      'window of fixed size K',
    ],
    coreIdea:
      'Keep a window over a contiguous range. Extend it from the right; while it violates the invariant, shrink it from the left. Every element enters and leaves once.',
    template: `left = 0
for right in 0 .. n-1:
    add(a[right])
    while not valid(window):
        remove(a[left]); left += 1
    best = max(best, right - left + 1)`,
    complexity: 'O(n) time, O(k) space',
  },
  {
    slug: 'two-pointers',
    name: 'Two Pointers',
    signals: [
      'sorted input',
      'pair or triplet with a target',
      'in-place partition or dedupe',
      'compare from both ends',
    ],
    coreIdea:
      'Move two indices under a rule that never rewinds. Sorting first makes the comparison monotonic, so each step can safely discard one side of the search space.',
    template: `lo, hi = 0, n - 1
while lo < hi:
    s = a[lo] + a[hi]
    if s == target: return (lo, hi)
    if s < target: lo += 1
    else: hi -= 1`,
    complexity: 'O(n) after sorting, O(1) space',
  },
  {
    slug: 'binary-search-on-answer',
    name: 'Binary Search on Answer',
    signals: [
      'minimise the maximum ...',
      'maximise the minimum ...',
      'smallest capacity / speed / days',
      'answer is monotonic',
    ],
    coreIdea:
      'The answer itself is the search space. Write a feasibility check that is false below the answer and true above it, then binary search the boundary.',
    template: `lo, hi = min_answer, max_answer
while lo < hi:
    mid = (lo + hi) // 2
    if feasible(mid): hi = mid
    else: lo = mid + 1
return lo`,
    complexity: 'O(n log(range)) time',
  },
  {
    slug: 'monotonic-stack',
    name: 'Monotonic Stack',
    signals: [
      'next greater / previous smaller',
      'span or waiting-days questions',
      'largest rectangle',
      'nearest boundary element',
    ],
    coreIdea:
      'Keep a stack whose values stay sorted. An element that breaks the order resolves every pending element it dominates, so each index is pushed and popped once.',
    template: `stack = []
for i in 0 .. n-1:
    while stack and a[stack[-1]] < a[i]:
        answer[stack.pop()] = i
    stack.append(i)`,
    complexity: 'O(n) time, O(n) space',
  },
  {
    slug: 'bfs',
    name: 'Breadth-First Search',
    signals: [
      'shortest path, unweighted',
      'minimum number of steps',
      'level by level',
      'spreading from several sources',
    ],
    coreIdea:
      'Explore the graph in rings of increasing distance. The first time BFS reaches a node it has used the fewest possible edges, which is why it answers shortest-path questions on unweighted graphs.',
    template: `queue = [start]; dist[start] = 0
while queue:
    node = queue.pop_front()
    for nb in neighbours(node):
        if dist[nb] is unset:
            dist[nb] = dist[node] + 1
            queue.push_back(nb)`,
    complexity: 'O(V + E) time',
  },
  {
    slug: 'dynamic-programming',
    name: 'Dynamic Programming',
    signals: [
      'count the number of ways',
      'optimal value over choices',
      'the same subproblem recurs',
      'choose or skip at each index',
    ],
    coreIdea:
      'Name the state, write the transition, then decide how to store it. Memoisation caches the recursion; tabulation replays it in dependency order without the call stack.',
    template: `def solve(i, cap):
    if i == n or cap == 0: return 0
    if (i, cap) in memo: return memo[(i, cap)]
    skip = solve(i + 1, cap)
    take = value[i] + solve(i + 1, cap - w[i]) if w[i] <= cap else 0
    memo[(i, cap)] = max(skip, take)
    return memo[(i, cap)]`,
    complexity: 'O(states x transitions)',
  },
];
