export interface Pattern {
  slug: string;
  name: string;
  /** One line: what the pattern is. */
  tagline: string;
  /** The phrases in a problem statement that give it away. */
  signals: string[];
  /** Why it works, in two or three sentences. */
  idea: string;
  template: string;
  variations: string[];
  mistakes: string[];
  complexity: string;
  /** Topic slug that teaches it. */
  topic: string;
  /** How often it shows up in interviews. */
  frequency: 'Very high' | 'High' | 'Medium' | 'Situational';
}

/**
 * The recurring problem shapes. Worked problems reference these by slug, so
 * each pattern page can list exactly which problems drill it.
 */
export const PATTERNS: Pattern[] = [
  {
    slug: 'two-pointers',
    name: 'Two Pointers',
    tagline: 'Two indices moving under a rule that never rewinds.',
    signals: ['sorted input', 'pair or triplet with a target', 'compare from both ends', 'in-place removal or partition'],
    idea: 'Each move must eliminate candidates permanently. On sorted data, if the sum at the two ends is too small, the left value cannot pair with anything smaller — so it is discarded forever, and one pass suffices.',
    template: `lo, hi = 0, n - 1
while lo < hi:
    s = a[lo] + a[hi]
    if s == target: return (lo, hi)
    if s < target: lo += 1
    else: hi -= 1`,
    variations: ['Opposite ends moving inward', 'Same direction with a write pointer', 'Fast and slow pointers for cycles and midpoints', 'Three pointers for a three-way partition'],
    mistakes: ['Using it when the relation is not monotonic', 'Sorting when the original indices are required', 'Mishandling duplicates in three-sum'],
    complexity: 'O(n) after sorting, O(1) space',
    topic: 'two-pointers',
    frequency: 'Very high',
  },
  {
    slug: 'sliding-window',
    name: 'Sliding Window',
    tagline: 'A window over a contiguous range, maintained incrementally.',
    signals: ['longest or shortest substring', 'subarray or substring', 'at most K distinct', 'window of fixed size K', 'contiguous'],
    idea: 'Keep a window and a property of its contents. Extend from the right; while the property is violated, shrink from the left. Both pointers only move forward, so every element enters and leaves once.',
    template: `left = 0
for right in 0 .. n-1:
    add(a[right])
    while not valid(window):
        remove(a[left]); left += 1
    best = max(best, right - left + 1)`,
    variations: ['Fixed size: add one, drop one', 'Variable size with an invariant', 'Exactly K as atMost(K) - atMost(K-1)', 'Window plus a monotonic deque for extremes'],
    mistakes: ['Recording the answer in the wrong place for shortest vs longest', 'Leaving zero-count keys in the map so `size()` lies', 'Using it with negative numbers and a sum condition'],
    complexity: 'O(n) time, O(k) space',
    topic: 'sliding-window',
    frequency: 'Very high',
  },
  {
    slug: 'prefix-sum',
    name: 'Prefix Sum',
    tagline: 'Pay once so every range query is a subtraction.',
    signals: ['many range sum queries', 'subarray sums', 'immutable array', 'count subarrays with property'],
    idea: 'Precompute running totals with `prefix[0] = 0`. A range is then the difference of two prefixes. Paired with a hash map it also counts subarrays matching a condition in one pass.',
    template: `prefix[0] = 0
for i in 0 .. n-1: prefix[i+1] = prefix[i] + a[i]

sum(l, r) = prefix[r+1] - prefix[l]`,
    variations: ['Prefix XOR for XOR ranges', 'Prefix counts for character problems', '2D prefix sums for submatrices', 'Difference array for the mirror problem: range updates'],
    mistakes: ['Sizing the array n instead of n+1 and special-casing l = 0', 'Forgetting to seed the map with {0: 1}', 'Overflowing an int on large sums'],
    complexity: 'O(n) build, O(1) per query',
    topic: 'arrays',
    frequency: 'Very high',
  },
  {
    slug: 'difference-array',
    name: 'Difference Array',
    tagline: 'Many range updates, applied once at the end.',
    signals: ['add v to everything between l and r', 'many updates then one read', 'booking or reservation counts'],
    idea: 'Record the change only at the two boundaries, then rebuild the array with one running sum. Each update is constant time and the materialisation is linear, no matter how many updates there were.',
    template: `# add v to a[l..r]
diff[l] += v
diff[r + 1] -= v

running = 0
for i in 0 .. n-1:
    running += diff[i]
    a[i] += running`,
    variations: ['2D difference array for submatrix updates', 'Sweep line over events sorted by time'],
    mistakes: ['Forgetting the `r + 1` bound and sizing the array n instead of n+1', 'Reading the array before materialising it'],
    complexity: 'O(1) per update, O(n) to materialise',
    topic: 'arrays',
    frequency: 'Medium',
  },
  {
    slug: 'hashing',
    name: 'Hash Lookup',
    tagline: 'Compute where a value must be instead of searching for it.',
    signals: ['find a pair with a relation', 'have I seen this before', 'count occurrences', 'group things that belong together'],
    idea: 'Whenever a nested loop is searching for one specific value, that search can be a lookup. Storing what you have already seen converts a quadratic scan into a single pass.',
    template: `seen = {}
for i in 0 .. n-1:
    need = target - a[i]
    if need in seen: return (seen[need], i)
    seen[a[i]] = i    # after the check, so an element cannot pair with itself`,
    variations: ['Frequency map for counting', 'Canonical key for grouping', 'Running aggregate plus a map for subarrays', 'Set for membership only'],
    mistakes: ['Claiming O(1) without saying "on average"', 'Inserting before checking, so an element pairs with itself', 'Using a mutable object as a key'],
    complexity: 'O(n) time, O(n) space',
    topic: 'hashing',
    frequency: 'Very high',
  },
  {
    slug: 'frequency-counting',
    name: 'Frequency Counting',
    tagline: 'Count first, then the question becomes easy.',
    signals: ['anagram', 'most or least frequent', 'appears more than n/2 times', 'small fixed alphabet'],
    idea: 'One pass builds the counts; a second answers the question. When the value range is small and known, an array indexed by the value beats a hash map on every axis.',
    template: `count = [0] * 26
for c in s: count[c - 'a'] += 1
# now compare, rank, or scan for the first with count == 1`,
    variations: ['26-slot array for letters', 'Bucket by frequency for top-K in linear time', 'Count vector as a canonical key', 'Boyer-Moore voting for majority in O(1) space'],
    mistakes: ['Using a map where a fixed array is faster and simpler', 'Comparing sizes without removing zero-count keys'],
    complexity: 'O(n) time, O(alphabet) space',
    topic: 'hashing',
    frequency: 'High',
  },
  {
    slug: 'binary-search',
    name: 'Binary Search',
    tagline: 'Halve a monotonic search space.',
    signals: ['sorted array', 'find first or last occurrence', 'insertion point', 'rotated sorted array'],
    idea: 'The requirement is monotonicity, not sortedness: the answer to "left or right?" must be consistent everywhere. One half-open template finds the boundary between false and true; every variant is a different condition.',
    template: `lo, hi = 0, n            # hi exclusive
while lo < hi:
    mid = lo + (hi - lo) // 2
    if condition(a[mid]): hi = mid
    else: lo = mid + 1
return lo                    # first index where condition holds`,
    variations: ['Lower and upper bound', 'First and last occurrence', 'Rotated arrays: one half is always sorted', 'Peak finding with no sorted data at all'],
    mistakes: ['`(lo + hi) / 2` overflowing', 'A branch that does not shrink the range, so it hangs', 'Getting `<=` versus `<` wrong at the final element'],
    complexity: 'O(log n) time, O(1) space',
    topic: 'binary-search',
    frequency: 'Very high',
  },
  {
    slug: 'binary-search-on-answer',
    name: 'Binary Search on the Answer',
    tagline: 'Search the answer itself, not the array.',
    signals: ['minimise the maximum', 'maximise the minimum', 'smallest capacity, speed or number of days', 'can it be done within X'],
    idea: 'When the answer is a number in a known range and feasibility is monotone — if X works then X+1 works — binary search the boundary. The feasibility check is usually a simple greedy scan.',
    template: `lo, hi = smallest_possible, largest_possible
while lo < hi:
    mid = lo + (hi - lo) // 2
    if feasible(mid): hi = mid
    else: lo = mid + 1
return lo`,
    variations: ['Capacity, speed or time as the searched value', 'Floating-point with a fixed iteration count', 'Counting with a staircase walk inside feasible()'],
    mistakes: ['A feasibility check that is not actually monotone', 'Bounds that exclude the true answer', 'Forgetting that feasible() itself costs O(n)'],
    complexity: 'O(n log(range))',
    topic: 'binary-search',
    frequency: 'High',
  },
  {
    slug: 'fast-slow-pointers',
    name: 'Fast & Slow Pointers',
    tagline: 'Two walkers at different speeds.',
    signals: ['linked list cycle', 'find the middle', 'nth node from the end', 'happy number'],
    idea: 'Inside a cycle the gap between a one-step and a two-step walker changes by exactly one each round, so it cannot skip zero — they must meet. Resetting one to the head then finds the cycle entry.',
    template: `slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow is fast: return True   # cycle
return False`,
    variations: ['Middle of a list', 'Nth from the end with a fixed gap', 'Cycle entry by resetting to the head', 'Palindrome list: middle, reverse, compare'],
    mistakes: ['Checking `fast.next` before `fast`', 'Landing on the wrong middle for even lengths', 'Starting both at head when splitting for merge sort'],
    complexity: 'O(n) time, O(1) space',
    topic: 'linked-lists',
    frequency: 'High',
  },
  {
    slug: 'in-place-reversal',
    name: 'In-place Reversal',
    tagline: 'Flip links or elements without extra memory.',
    signals: ['reverse a list or a section of it', 'reorder in place', 'rotate by k', 'O(1) space required'],
    idea: 'Three pointers — what came before, where you are, what comes next — move in lockstep, flipping one link per step. On arrays, three reversals achieve a rotation.',
    template: `previous, current = None, head
while current:
    ahead = current.next
    current.next = previous
    previous, current = current, ahead
return previous`,
    variations: ['Reverse in groups of k', 'Reverse a sublist between two positions', 'Array rotation by three reversals', 'Reverse the second half for palindrome checks'],
    mistakes: ['Overwriting `next` before saving it', 'Leaving a dangling link that should be null', 'Recursive reversal on a list too long for the stack'],
    complexity: 'O(n) time, O(1) space',
    topic: 'linked-lists',
    frequency: 'High',
  },
  {
    slug: 'monotonic-stack',
    name: 'Monotonic Stack',
    tagline: 'A stack whose values stay sorted.',
    signals: ['next greater element', 'previous smaller element', 'span or waiting days', 'largest rectangle', 'trapping water'],
    idea: 'An arriving element resolves every pending element it dominates. Each index is pushed once and popped at most once, so despite the inner loop the whole scan is linear.',
    template: `stack = []
for i in 0 .. n-1:
    while stack and a[stack[-1]] < a[i]:
        answer[stack.pop()] = i
    stack.append(i)`,
    variations: ['Increasing vs decreasing stack', 'Scan from the right for previous-side answers', 'Sentinel element to flush the stack', 'Histogram boundaries from one pass'],
    mistakes: ['Choosing the wrong comparison direction', 'Forgetting to flush what remains at the end', 'Storing values instead of indices when positions are needed'],
    complexity: 'O(n) time, O(n) space',
    topic: 'stacks-queues',
    frequency: 'High',
  },
  {
    slug: 'monotonic-queue',
    name: 'Monotonic Deque',
    tagline: 'The maximum of every window, in linear total time.',
    signals: ['maximum in each window of size K', 'sliding window extremes', 'shortest subarray with sum at least K'],
    idea: 'Keep indices in decreasing order of value. A smaller, older value can never be the maximum again while a larger, newer one is in the window, so it is dropped forever. The front is always the answer.',
    template: `deque = []
for i in 0 .. n-1:
    while deque and a[deque[-1]] <= a[i]: deque.pop()
    deque.append(i)
    if deque[0] <= i - k: deque.popleft()
    if i >= k - 1: report(a[deque[0]])`,
    variations: ['Minimum instead of maximum', 'Deque over prefix sums for negative-friendly window sums', '0-1 BFS using a deque as the frontier'],
    mistakes: ['Storing values so you cannot tell when one leaves the window', 'Dropping the front before pushing the new index'],
    complexity: 'O(n) time, O(k) space',
    topic: 'stacks-queues',
    frequency: 'Medium',
  },
  {
    slug: 'merge-intervals',
    name: 'Merge Intervals',
    tagline: 'Sort by an endpoint, then sweep once.',
    signals: ['overlapping intervals', 'meeting rooms', 'insert into sorted intervals', 'minimum arrows or platforms'],
    idea: 'Choosing the sort key is the algorithm. Sort by start to merge or sweep; sort by end to select the most non-overlapping intervals, because finishing earliest leaves the most room.',
    template: `intervals.sort(key=start)
for interval in intervals:
    if merged and interval.start <= merged[-1].end:
        merged[-1].end = max(merged[-1].end, interval.end)
    else:
        merged.append(interval)`,
    variations: ['Sort by end to maximise the count kept', 'Heap of end times for peak concurrency', 'Sweep line over separate start and end events'],
    mistakes: ['Sorting by the wrong endpoint for the question asked', 'Using `<` instead of `<=` when touching intervals should merge'],
    complexity: 'O(n log n) time',
    topic: 'greedy',
    frequency: 'High',
  },
  {
    slug: 'heap-top-k',
    name: 'Heap / Top-K',
    tagline: 'Keep only the k candidates that still matter.',
    signals: ['top K', 'kth largest or smallest', 'k closest', 'merge k sorted', 'median of a stream'],
    idea: 'For the k largest, use a min-heap of size k: its root is the weakest current champion, exactly the element to evict. The heap never grows past k, which is why the log factor is log k rather than log n.',
    template: `heap = MinHeap()
for value in stream:
    heap.push(value)
    if len(heap) > k: heap.pop()
# heap holds the k largest; its root is the kth largest`,
    variations: ['Max-heap for the k smallest', 'Two heaps for a running median', 'Heap of one candidate per list for a k-way merge', 'Heap of end times for scheduling'],
    mistakes: ['Reaching for the max-heap when you need the min-heap', 'Forgetting your language default is the opposite', 'Using a heap where quickselect or bucketing is linear'],
    complexity: 'O(n log k) time, O(k) space',
    topic: 'heaps',
    frequency: 'High',
  },
  {
    slug: 'bfs',
    name: 'Breadth-First Search',
    tagline: 'Explore in rings of increasing distance.',
    signals: ['shortest path, unweighted', 'fewest steps or moves', 'level by level', 'spreading from several sources'],
    idea: 'The first time BFS reaches a vertex it has used the fewest possible edges. That is only true when every edge costs the same — with weights, Dijkstra replaces it.',
    template: `queue = [start]; dist[start] = 0
while queue:
    node = queue.popleft()
    for nb in neighbours(node):
        if dist[nb] is unset:
            dist[nb] = dist[node] + 1
            queue.append(nb)`,
    variations: ['Multi-source: seed every source at distance 0', 'Level-by-level with a size snapshot', '0-1 BFS with a deque', 'Bidirectional BFS from both ends'],
    mistakes: ['Marking visited on dequeue instead of enqueue', 'Using BFS when edge costs differ', 'Forgetting to loop over every start in a disconnected graph'],
    complexity: 'O(V + E) time, O(V) space',
    topic: 'graphs',
    frequency: 'Very high',
  },
  {
    slug: 'dfs',
    name: 'Depth-First Search',
    tagline: 'Follow one path as far as it goes, then back up.',
    signals: ['connected components', 'cycle detection', 'flood fill', 'all paths', 'islands'],
    idea: 'DFS gives structure rather than distance. Entry and exit times, back edges and low-link values all come from the order in which it descends and returns.',
    template: `def dfs(node):
    visited.add(node)
    for nb in neighbours(node):
        if nb not in visited:
            dfs(nb)`,
    variations: ['Iterative with an explicit stack', 'Grid flood fill over four neighbours', 'Three-colour marking for directed cycles', 'Post-order for topological sort'],
    mistakes: ['Recursing deeper than the stack allows', 'Undirected cycle checks without a parent argument', 'Not restoring the visited mark in backtracking searches'],
    complexity: 'O(V + E) time, O(V) space',
    topic: 'graphs',
    frequency: 'Very high',
  },
  {
    slug: 'topological-sort',
    name: 'Topological Sort',
    tagline: 'Order a DAG so every edge points forward.',
    signals: ['prerequisites', 'build or task order', 'can all be finished', 'dependency resolution'],
    idea: 'Repeatedly take a vertex with no remaining incoming edges. If fewer than V vertices come out, the leftovers are stuck in a cycle — so the algorithm is also the cycle detector.',
    template: `queue = [v for v in vertices if indegree[v] == 0]
while queue:
    node = queue.popleft(); order.append(node)
    for nb in adjacency[node]:
        indegree[nb] -= 1
        if indegree[nb] == 0: queue.append(nb)

if len(order) != V: raise CycleError`,
    variations: ['DFS finishing order, reversed', 'Lexicographically smallest order with a heap', 'Longest path in a DAG by relaxing in this order'],
    mistakes: ['Skipping the final size check, so cycles go unnoticed', 'Building edges in the wrong direction'],
    complexity: 'O(V + E)',
    topic: 'graphs',
    frequency: 'High',
  },
  {
    slug: 'union-find',
    name: 'Union Find',
    tagline: 'Connectivity that only ever merges.',
    signals: ['are these connected', 'number of components', 'redundant connection', 'minimum spanning tree'],
    idea: 'Path compression flattens the tree during lookups and union by size keeps it shallow. Together they make both operations effectively constant, which is what turns Kruskal into six lines.',
    template: `def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]   # path compression
        x = parent[x]
    return x

def union(a, b):
    ra, rb = find(a), find(b)
    if ra == rb: return False           # already together
    if size[ra] < size[rb]: ra, rb = rb, ra
    parent[rb] = ra; size[ra] += size[rb]
    return True`,
    variations: ['Counting components as you merge', 'Kruskal for minimum spanning trees', 'Union by rank instead of size', 'Detecting the edge that creates a cycle'],
    mistakes: ['Skipping path compression and degrading to a linked list', 'Assuming it can split groups — it cannot'],
    complexity: 'Near O(1) amortised per operation',
    topic: 'graphs',
    frequency: 'Medium',
  },
  {
    slug: 'backtracking',
    name: 'Backtracking',
    tagline: 'Choose, explore, un-choose.',
    signals: ['all combinations or permutations', 'generate every valid arrangement', 'N-Queens, Sudoku, word search', 'small n with an exponential answer'],
    idea: 'Recursion over partial solutions. Making a choice, recursing, then undoing it keeps one mutable state for the whole search. Pruning is what decides whether it finishes.',
    template: `def backtrack(state):
    if complete(state): record(copy(state)); return
    for choice in candidates(state):
        if not valid(choice, state): continue
        apply(choice, state)
        backtrack(state)
        undo(choice, state)`,
    variations: ['Subsets by include/exclude', 'Permutations with a used[] array', 'Combination sum with reuse allowed', 'Grid search marking and restoring cells'],
    mistakes: ['Recording a reference instead of a copy', 'Forgetting to undo after recursing', 'Skipping duplicates with `i > 0` instead of `i > start`'],
    complexity: 'Exponential, far less after pruning',
    topic: 'recursion',
    frequency: 'High',
  },
  {
    slug: 'dynamic-programming',
    name: 'Dynamic Programming',
    tagline: 'Recursion that remembers.',
    signals: ['count the number of ways', 'minimum or maximum over choices', 'the same subproblem recurs', 'take it or skip it'],
    idea: 'Name the state, write the transition, fix the order. Memoisation caches the recursion; tabulation replays it in dependency order without the call stack. Most failures are a state that carries too little information.',
    template: `def solve(i, cap):
    if i == n or cap == 0: return 0
    if (i, cap) in memo: return memo[(i, cap)]
    skip = solve(i + 1, cap)
    take = value[i] + solve(i + 1, cap - w[i]) if w[i] <= cap else 0
    memo[(i, cap)] = max(skip, take)
    return memo[(i, cap)]`,
    variations: ['1D over an index', '2D over a grid or two strings', 'Knapsack over index and capacity', 'Interval DP by increasing length', 'State-machine DP for stock problems'],
    mistakes: ['An incomplete state', 'Iterating capacity forwards and accidentally allowing reuse', 'Counting permutations when combinations were asked'],
    complexity: 'O(states x transitions)',
    topic: 'dynamic-programming',
    frequency: 'Very high',
  },
  {
    slug: 'greedy',
    name: 'Greedy',
    tagline: 'Take the locally best choice — and prove it is safe.',
    signals: ['maximum number of non-overlapping things', 'minimum removals', 'fractions or divisible items allowed', 'schedule or assign'],
    idea: 'Greedy needs the greedy choice property: some optimal solution contains the choice you are making. The exchange argument proves it — swap your choice into any optimal solution and show it is no worse.',
    template: `items.sort(key=the_right_key)
for item in items:
    if compatible(item, state):
        take(item); update(state)`,
    variations: ['Sort by end time for interval selection', 'Sort by ratio for fractional knapsack', 'Heap for a choice that changes as you go', 'Running balance with a reset, as in gas station'],
    mistakes: ['Choosing the wrong sort key', 'Assuming it works because the sample passed', 'Using greedy where a choice can block a better combination'],
    complexity: 'Usually O(n log n) from the sort',
    topic: 'greedy',
    frequency: 'High',
  },
  {
    slug: 'divide-and-conquer',
    name: 'Divide & Conquer',
    tagline: 'Split, solve both halves, combine.',
    signals: ['sort or merge', 'count inversions', 'closest pair', 'the answer combines two halves'],
    idea: 'The work is in the combine step. Merge sort divides for free and pays on the merge; quick sort pays on the partition and combines for free. The recurrence tells you the cost.',
    template: `def solve(lo, hi):
    if hi - lo <= 1: return base_case
    mid = (lo + hi) // 2
    left = solve(lo, mid)
    right = solve(mid, hi)
    return combine(left, right)`,
    variations: ['Merge sort and its inversion count', 'Quickselect, discarding one side', 'Binary search as a degenerate case', 'Tree recursion combining child answers'],
    mistakes: ['A base case that never shrinks, giving infinite recursion', 'Forgetting the O(n) combine when quoting the complexity'],
    complexity: 'Usually O(n log n)',
    topic: 'sorting',
    frequency: 'Medium',
  },
  {
    slug: 'bit-manipulation',
    name: 'Bit Manipulation',
    tagline: 'Treat the number as a row of switches.',
    signals: ['appears twice except one', 'subsets with n at most 20', 'power of two', 'XOR of a range', 'flags or a small set'],
    idea: 'XOR cancels duplicates and ignores order. `n & (n-1)` clears the lowest set bit and `n & -n` isolates it. An n-bit integer is exactly one subset, which is what makes bitmask enumeration work.',
    template: `# test / set / clear / toggle bit i
(n >> i) & 1
n | (1 << i)
n & ~(1 << i)
n ^ (1 << i)

# enumerate every subset of n elements
for mask in 0 .. (1 << n) - 1: ...`,
    variations: ['XOR to find the unpaired value', 'Bitmask DP over subsets', 'Binary trie for maximum XOR', 'Counting set bits with n & (n-1)'],
    mistakes: ['Shifting by more than the word size', 'Forgetting operator precedence around & and ==', 'Sign extension on a right shift'],
    complexity: 'O(1) per operation',
    topic: 'mathematics',
    frequency: 'Medium',
  },
  {
    slug: 'trie',
    name: 'Trie / Prefix Tree',
    tagline: 'Index strings by their prefixes.',
    signals: ['autocomplete', 'starts with', 'dictionary of words', 'word search in a grid', 'maximum XOR pair'],
    idea: 'One node per prefix means lookup costs the length of the query, not the number of stored words. Words sharing a prefix share a path, which is both the speed and the memory saving.',
    template: `class Node: children = {}; isWord = False

def insert(word):
    node = root
    for c in word:
        node = node.children.setdefault(c, Node())
    node.isWord = True`,
    variations: ['Binary trie over bits for XOR queries', 'Trie plus DFS to prune a grid word search', 'Aho-Corasick for many patterns at once'],
    mistakes: ['Using a trie where a hash set is enough', 'Forgetting the end-of-word flag, so prefixes count as words'],
    complexity: 'O(length) per operation',
    topic: 'advanced',
    frequency: 'Medium',
  },
];

export function patternBySlug(slug: string): Pattern | undefined {
  return PATTERNS.find((pattern) => pattern.slug === slug);
}
