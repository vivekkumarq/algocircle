import { CourseLesson } from '../course/course.model';
import { walkthrough } from './build';

const MERGE_INTERVALS: CourseLesson = {
  slug: 'merge-intervals',
  title: 'Merge intervals',
  tagline:
    'Sort the intervals by where they start. Overlapping ones then sit side by side, and one pass glues them together.',
  topic: 'sorting',
  pattern: 'merge-intervals',
  minutes: 14,
  practice: ['merge-intervals-problem', 'non-overlapping-intervals', 'meeting-rooms'],
  blocks: walkthrough({
    plain:
      'Intervals in a random order are hard to compare: any one might overlap any other. Sorted by start, an interval can only overlap the group just before it. So sort first, then walk once, either stretching the current group or starting a new one.',
    problem: 'Given a list of intervals `[start, end]`, merge every set of overlapping intervals and return the result, sorted by start.',
    example: '`[[1, 3], [8, 10], [2, 6], [15, 18]]` → `[[1, 6], [8, 10], [15, 18]]`.',
    understand: [
      '**Input:** intervals in any order. **Output:** non-overlapping intervals, sorted by start.',
      'Touching counts as overlapping: `[1, 4]` and `[4, 5]` become `[1, 5]`.',
      'One interval can swallow another completely: `[1, 10]` and `[2, 3]` become `[1, 10]`.',
      'An empty list gives an empty list.',
    ],
    byHand: [
      { kind: 'para', text: 'Draw them on a number line, in order of where they start. Overlaps become obvious:' },
      {
        kind: 'diagram',
        art: `0    2    4    6    8    10   12   14   16   18
 [1==3]
   [2=======6]
                 [8===10]
                                  [15=====18]
 [1=========6]   [8===10]         [15=====18]   <- merged`,
        caption: 'Sorted by start, each interval only needs comparing with the group just before it.',
      },
    ],
    rule:
      'Sort by start; walk through the intervals, and if one starts before the current group ends, stretch the group\'s end; otherwise close the group and start a new one.',
    brute: {
      idea: 'Keep looking for any two intervals that overlap and replace them with one, until no pair overlaps.',
      java: `// Finds one overlapping pair, merges it, and reports whether it did.
boolean mergeOnePair(List<int[]> list) {
    for (int i = 0; i < list.size(); i++) {
        for (int j = i + 1; j < list.size(); j++) {
            int[] a = list.get(i), b = list.get(j);
            // Two intervals overlap when each starts before the other ends.
            if (a[0] <= b[1] && b[0] <= a[1]) {
                a[0] = Math.min(a[0], b[0]);
                a[1] = Math.max(a[1], b[1]);
                list.remove(j);
                return true;
            }
        }
    }
    return false;
}

int[][] mergeBrute(int[][] intervals) {
    List<int[]> list = new ArrayList<>();
    for (int[] iv : intervals) list.add(new int[] { iv[0], iv[1] });
    // Keep merging pairs until a full search finds nothing to merge.
    while (mergeOnePair(list)) { }
    list.sort((x, y) -> Integer.compare(x[0], y[0]));
    return list.toArray(new int[0][]);
}`,
      python: `def merge_one_pair(items: list[list[int]]) -> bool:
    # Finds one overlapping pair, merges it, and reports whether it did.
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            a, b = items[i], items[j]
            # Two intervals overlap when each starts before the other ends.
            if a[0] <= b[1] and b[0] <= a[1]:
                a[0], a[1] = min(a[0], b[0]), max(a[1], b[1])
                items.pop(j)
                return True
    return False


def merge_brute(intervals: list[list[int]]) -> list[list[int]]:
    items = [list(iv) for iv in intervals]
    # Keep merging pairs until a full search finds nothing to merge.
    while merge_one_pair(items):
        pass
    return sorted(items)`,
      cost: 'Each search compares every pair, `O(n²)`, and there can be `n` merges: `O(n³)`.',
    },
    repeated:
      'Every search compares every pair again, including pairs that are nowhere near each other. Sorting by start removes that: after sorting, an interval can only overlap the group directly before it. Each interval then needs **one** comparison.',
    better: {
      idea: 'Sort, then one pass. The group being built is always the last one in the answer list.',
      java: `int[][] merge(int[][] intervals) {
    // Sort a copy by start, so overlapping intervals end up next to each other.
    int[][] sorted = intervals.clone();
    Arrays.sort(sorted, (a, b) -> Integer.compare(a[0], b[0]));

    List<int[]> merged = new ArrayList<>();
    for (int[] iv : sorted) {
        // The group we are building is the last one added (if any).
        int[] last = merged.isEmpty() ? null : merged.get(merged.size() - 1);

        if (last != null && iv[0] <= last[1]) {
            // iv starts before the group ends: it overlaps, so stretch the group.
            // max, because iv may end inside the group (swallowed completely).
            last[1] = Math.max(last[1], iv[1]);
        } else {
            // A gap before iv: the old group is finished; iv starts a new one.
            // A copy, so stretching it later never changes the caller's array.
            merged.add(new int[] { iv[0], iv[1] });
        }
    }
    return merged.toArray(new int[0][]);
}`,
      python: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    merged = []
    # Sort by start, so overlapping intervals end up next to each other.
    for start, end in sorted(intervals):
        # The group we are building is merged[-1] (if any).
        if merged and start <= merged[-1][1]:
            # It starts before the group ends: it overlaps, so stretch the group.
            # max, because it may end inside the group (swallowed completely).
            merged[-1][1] = max(merged[-1][1], end)
        else:
            # A gap: the old group is finished; this interval starts a new one.
            merged.append([start, end])
    return merged`,
      cost: '`O(n log n)` for the sort, then `O(n)` for the pass.',
    },
    dryRun: {
      headers: ['Interval (sorted)', 'Current group', 'Starts before it ends?', 'Groups after'],
      rows: [
        ['`[1, 3]`', '—', '—', '`[1, 3]`'],
        ['`[2, 6]`', '`[1, 3]`', '2 ≤ 3, yes', '`[1, 6]`'],
        ['`[8, 10]`', '`[1, 6]`', '8 > 6, no', '`[1, 6]`, `[8, 10]`'],
        ['`[15, 18]`', '`[8, 10]`', '15 > 10, no', '`[1, 6]`, `[8, 10]`, `[15, 18]`'],
      ],
    },
    trap: 'Setting the group\'s end to the new interval\'s end instead of the **larger** of the two. With `[1, 10]` followed by `[2, 3]`, that shrinks the group to `[1, 3]` and silently loses `4..10`. Always `max(groupEnd, end)`.',
    signals: [
      'Intervals, meetings, bookings, time ranges.',
      '"Overlapping", "merge", "free time", "how many rooms".',
      'Insert a new interval into an already sorted list.',
      'Keep as many non-overlapping events as possible (sort by **end** instead).',
    ],
    check: {
      question: 'Minimum number of meeting rooms: how would you adapt this?',
      answer: 'Sort meetings by start. Keep the end times of meetings in progress in a min-heap. For each new meeting, if the earliest-ending meeting has finished by its start, that room is reused (pop it); then push the new end time. The largest heap size along the way is the number of rooms.',
    },
  }),
};

const TOP_K: CourseLesson = {
  slug: 'top-k-with-a-heap',
  title: 'Top K with a heap',
  tagline:
    'To keep the k best of many numbers, hold k of them in a min-heap. The weakest of your top k is always on top, ready to be replaced.',
  topic: 'heaps',
  pattern: 'heap-top-k',
  minutes: 14,
  practice: [
    'kth-largest',
    'top-k-frequent',
    'k-closest-points',
    'task-scheduler',
    'merge-k-lists',
    'running-median',
    'sliding-window-median',
  ],
  blocks: walkthrough({
    plain:
      'A heap is a bag that always hands you its smallest item quickly. Keep the k largest numbers seen so far in one. Each newcomer either beats the smallest of your top k, and replaces it, or is ignored. At the end, the smallest one in the bag is the kth largest overall.',
    problem: 'Return the `k`th largest element of an unsorted array. Repeated values count separately.',
    example: '`[3, 2, 1, 5, 6, 4]`, `k = 2` → `5`.',
    understand: [
      '**Input:** an array and `k`, with `1 ≤ k ≤ n`. **Output:** one value.',
      'Repeats count: in `[3, 3, 3]` the 2nd largest is `3`.',
      'We need the **value**, not its position.',
      'The data could be huge, or arrive as a stream we see only once.',
    ],
    byHand: [
      {
        kind: 'para',
        text: 'Think of a contest where only the top 2 win a prize. Keep 2 prize slots and compare every newcomer with the **weakest** current winner:',
      },
      {
        kind: 'table',
        headers: ['Arrives', 'Weakest winner', 'Then', 'Winners'],
        rows: [
          ['3', '—', 'free slot', '3'],
          ['2', '—', 'free slot', '3, 2'],
          ['1', '2', '1 < 2, ignored', '3, 2'],
          ['5', '2', '5 beats 2, replaces it', '3, 5'],
          ['6', '3', '6 beats 3, replaces it', '5, 6'],
          ['4', '5', '4 < 5, ignored', '5, 6'],
        ],
      },
      { kind: 'para', text: 'The weakest of the top 2 is `5`: the 2nd largest.' },
    ],
    rule:
      'Keep the `k` largest values seen so far; each new value replaces the smallest of them if it is bigger; at the end, the smallest one kept is the answer.',
    brute: {
      idea: 'Sort everything, then count `k` from the top.',
      java: `int kthLargestBySorting(int[] nums, int k) {
    int[] sorted = nums.clone();
    // Ascending order: the largest is at the end.
    Arrays.sort(sorted);
    // The 1st largest is at n - 1, so the kth largest is at n - k.
    return sorted[sorted.length - k];
}`,
      python: `def kth_largest_by_sorting(nums: list[int], k: int) -> int:
    # Largest first, then the kth one is at position k - 1.
    return sorted(nums, reverse=True)[k - 1]`,
      cost: '`O(n log n)` time.',
    },
    repeated:
      'Sorting carefully orders **all** `n` numbers, but we only care about the top `k`, and not even about their order among themselves. Everything below the top k is sorted for nothing. A heap of size `k` keeps just enough order to know one thing: which of the current top k is the weakest.',
    better: {
      idea: 'A **min**-heap holding at most `k` values. Java\'s `PriorityQueue` and Python\'s `heapq` are min-heaps by default.',
      java: `int kthLargest(int[] nums, int k) {
    // A min-heap: peek() is always the smallest value inside.
    PriorityQueue<Integer> topK = new PriorityQueue<>();

    for (int x : nums) {
        // Let x in for now...
        topK.offer(x);
        // ...but if that makes k + 1 values, the smallest cannot be in the
        // top k any more: evict it. The heap finds it in O(log k).
        if (topK.size() > k) {
            topK.poll();
        }
    }

    // The heap now holds the k largest values; the smallest of them
    // is the kth largest overall.
    return topK.peek();
}`,
      python: `import heapq


def kth_largest(nums: list[int], k: int) -> int:
    # A min-heap (Python's heapq): top_k[0] is always the smallest value inside.
    top_k = []

    for x in nums:
        # Let x in for now...
        heapq.heappush(top_k, x)
        # ...but if that makes k + 1 values, the smallest cannot be in the
        # top k any more: evict it. The heap finds it in O(log k).
        if len(top_k) > k:
            heapq.heappop(top_k)

    # The heap now holds the k largest values; the smallest of them
    # is the kth largest overall.
    return top_k[0]`,
      cost: '`O(n log k)` time and `O(k)` memory. For `k = 10` and a billion numbers, that is tiny, and it works on a stream.',
    },
    dryRun: {
      headers: ['`x`', 'Heap after offer', 'Size > k?', 'Heap after'],
      rows: [
        ['3', '3', 'no', '3'],
        ['2', '2, 3', 'no', '2, 3'],
        ['1', '1, 2, 3', 'yes, evict 1', '2, 3'],
        ['5', '2, 3, 5', 'yes, evict 2', '3, 5'],
        ['6', '3, 5, 6', 'yes, evict 3', '5, 6'],
        ['4', '4, 5, 6', 'yes, evict 4', '5, 6 → answer 5'],
      ],
      caption: 'Heap contents are listed smallest first; only the smallest is guaranteed to be at the top.',
    },
    trap: 'Reaching for a **max**-heap because the question says "largest". A max-heap of all `n` values also works, but needs `O(n)` memory and `k` pops. The min-heap of size `k` is the trick: its top is the weakest member of the top k, the one to evict.',
    signals: [
      'The `k` **largest**, **smallest**, **most frequent** or **closest**.',
      'A **stream** of values where you keep the best so far.',
      'Merge `k` sorted lists.',
      'Repeatedly take the smallest or largest item: scheduling, Dijkstra.',
    ],
    check: {
      question: 'K closest points to the origin: which kind of heap, and what does it hold?',
      answer: 'A **max**-heap of size `k`, ordered by distance: its top is the farthest of the k closest so far. A new point closer than the top replaces it. (Same trick, mirrored: you keep the k smallest distances, so the one to evict is the largest.)',
    },
  }),
};

const DFS: CourseLesson = {
  slug: 'depth-first-search',
  title: 'Depth-first search',
  tagline:
    'Go as deep as you can along one path before backing up. On a grid, that visits a whole connected region in one go.',
  topic: 'graphs',
  pattern: 'dfs',
  minutes: 16,
  practice: ['number-of-islands', 'tree-diameter', 'validate-bst', 'lowest-common-ancestor', 'serialise-tree'],
  blocks: walkthrough({
    plain:
      'Depth-first search (DFS) explores like someone in a maze with chalk: keep walking to an unmarked neighbour and mark it, and only when every way forward is marked, step back. Started from one land cell of a grid, it marks exactly the island that cell belongs to.',
    problem:
      'A grid holds `1` for land and `0` for water. Land cells that touch up, down, left or right are part of the same island. Return how many islands there are.',
    example: 'The grid below has `3` islands.',
    understand: [
      '**Input:** a grid of 0s and 1s. **Output:** a count.',
      'Diagonal neighbours do **not** connect.',
      'A single land cell on its own is an island.',
      'We must not count the same island twice, so cells need to be remembered as visited.',
    ],
    byHand: [
      {
        kind: 'diagram',
        art: `1 1 0 0        A A . .
1 0 0 1        A . . B
0 0 1 1        . . B B
1 0 0 0        C . . .`,
        caption: 'The grid, and its three islands labelled.',
      },
      {
        kind: 'para',
        text: 'Read the grid like a book. When you hit land you have not coloured yet, that is a new island: count it, then colour every land cell connected to it. Coloured cells are skipped as you read on.',
      },
    ],
    rule:
      'Scan every cell; each time you find land not visited yet, count one island and visit everything connected to it, so none of it is counted again.',
    brute: {
      idea: 'Count a land cell only if it is the **first** cell of its island in reading order. To find that, explore the cell\'s whole island from scratch, every time.',
      java: `// Smallest "reading order" number (r * cols + c) of any cell in the island
// containing (r, c). Explores with its own fresh 'seen' memory.
int firstCellOf(int[][] grid, int r, int c, boolean[][] seen) {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) return Integer.MAX_VALUE;
    if (grid[r][c] == 0 || seen[r][c]) return Integer.MAX_VALUE;
    seen[r][c] = true;
    int best = r * grid[0].length + c;
    best = Math.min(best, firstCellOf(grid, r + 1, c, seen));
    best = Math.min(best, firstCellOf(grid, r - 1, c, seen));
    best = Math.min(best, firstCellOf(grid, r, c + 1, seen));
    best = Math.min(best, firstCellOf(grid, r, c - 1, seen));
    return best;
}

int countIslandsBrute(int[][] grid) {
    int count = 0;
    for (int r = 0; r < grid.length; r++) {
        for (int c = 0; c < grid[0].length; c++) {
            if (grid[r][c] == 0) continue;
            // Explore this cell's whole island again, from scratch.
            boolean[][] seen = new boolean[grid.length][grid[0].length];
            // Count it only if it is its island's first cell.
            if (firstCellOf(grid, r, c, seen) == r * grid[0].length + c) count++;
        }
    }
    return count;
}`,
      python: `def first_cell_of(grid: list[list[int]], r: int, c: int, seen: set) -> float:
    # Smallest "reading order" number (r * cols + c) of any cell in the island
    # containing (r, c). Explores with its own fresh 'seen' memory.
    if r < 0 or c < 0 or r >= len(grid) or c >= len(grid[0]):
        return float("inf")
    if grid[r][c] == 0 or (r, c) in seen:
        return float("inf")
    seen.add((r, c))
    best = r * len(grid[0]) + c
    for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        best = min(best, first_cell_of(grid, r + dr, c + dc, seen))
    return best


def count_islands_brute(grid: list[list[int]]) -> int:
    count = 0
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            # Explore this cell's whole island again, from scratch, and count it
            # only if it is its island's first cell.
            if grid[r][c] == 1 and first_cell_of(grid, r, c, set()) == r * len(grid[0]) + c:
                count += 1
    return count`,
      cost: 'An island of `m` cells gets explored `m` times: up to `O((rows × cols)²)`.',
    },
    repeated:
      'Every land cell explores its **whole island again**, so an island of 1,000 cells is explored 1,000 times. Explore each island **once**, and mark its cells as visited for good: then every later cell of that island is skipped at a glance.',
    better: {
      idea: 'Scan the grid; on new land, count it and "sink" the whole island (turn it to water) with DFS, so it can never be counted again.',
      java: `int numIslands(int[][] grid) {
    int count = 0;
    // Read the grid like a book: row by row, cell by cell.
    for (int r = 0; r < grid.length; r++) {
        for (int c = 0; c < grid[0].length; c++) {
            // Land that no earlier island has sunk: a new island.
            if (grid[r][c] == 1) {
                count++;
                // Visit (and sink) all of it now, so its other cells are skipped.
                sink(grid, r, c);
            }
        }
    }
    return count;
}

void sink(int[][] grid, int r, int c) {
    // Off the grid, or water (including land we already sank): stop here.
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] != 1) {
        return;
    }
    // Mark this cell visited BEFORE going further, by turning it into water.
    grid[r][c] = 0;
    // Go as deep as possible in each direction: down, up, right, left.
    sink(grid, r + 1, c);
    sink(grid, r - 1, c);
    sink(grid, r, c + 1);
    sink(grid, r, c - 1);
}`,
      python: `def num_islands(grid: list[list[int]]) -> int:
    count = 0
    # Read the grid like a book: row by row, cell by cell.
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            # Land that no earlier island has sunk: a new island.
            if grid[r][c] == 1:
                count += 1
                # Visit (and sink) all of it now, so its other cells are skipped.
                sink(grid, r, c)
    return count


def sink(grid: list[list[int]], r: int, c: int) -> None:
    # Off the grid, or water (including land we already sank): stop here.
    if r < 0 or c < 0 or r >= len(grid) or c >= len(grid[0]) or grid[r][c] != 1:
        return
    # Mark this cell visited BEFORE going further, by turning it into water.
    grid[r][c] = 0
    # Go as deep as possible in each direction: down, up, right, left.
    sink(grid, r + 1, c)
    sink(grid, r - 1, c)
    sink(grid, r, c + 1)
    sink(grid, r, c - 1)`,
      cost: '`O(rows × cols)`: each cell is sunk once and looked at from at most four neighbours.',
    },
    dryRun: {
      headers: ['Cell reached in the scan', 'Land?', 'Action', '`count`'],
      rows: [
        ['(0, 0)', 'yes', 'sink (0,0), (1,0), (0,1)', '1'],
        ['(0, 1), (1, 0)', 'no, already sunk', 'skip', '1'],
        ['(1, 3)', 'yes', 'sink (1,3), (2,3), (2,2)', '2'],
        ['(2, 2), (2, 3)', 'no, already sunk', 'skip', '2'],
        ['(3, 0)', 'yes', 'sink (3,0)', '3'],
      ],
    },
    trap: 'Exploring the neighbours **before** marking the cell. Then two neighbouring land cells keep calling each other forever, and the program crashes with a stack overflow. Mark first, then recurse. Also: this version overwrites the grid; if the caller still needs it, copy it first or keep a separate `visited` array.',
    signals: [
      'A grid or graph where **connected regions** matter: islands, flood fill, provinces.',
      'Explore **every path**, or go deep before going wide.',
      'Trees: heights, paths, diameters, validating a BST, lowest common ancestor.',
      'Detecting a cycle in a graph.',
    ],
    check: {
      question: 'How would you return the size of the **largest** island instead of the count?',
      answer: 'Make `sink` return how many cells it turned to water: `0` for water or off-grid, otherwise `1` plus the four recursive results. In the scan, keep the maximum of those return values.',
    },
  }),
};

const BFS: CourseLesson = {
  slug: 'breadth-first-search',
  title: 'Breadth-first search',
  tagline:
    'Explore in rings: everything one step away, then two steps, then three. The first time you reach a cell, you got there by a shortest route.',
  topic: 'graphs',
  pattern: 'bfs',
  minutes: 16,
  practice: ['network-delay', 'word-ladder'],
  blocks: walkthrough({
    plain:
      'Drop a stone in a pond: the ripples reach nearby points first and far points later. Breadth-first search (BFS) does the same with a queue. Cells are processed in the order they were reached, so they come out nearest first, and the first time the exit comes out of the queue, its distance is the shortest possible.',
    problem:
      'A grid has open cells `0` and walls `1`. Starting at the top-left and moving up, down, left or right, return the fewest steps needed to reach the bottom-right, or `-1` if it cannot be reached.',
    example: 'In the grid below, the answer is `4`: right, right, down, down.',
    understand: [
      '**Input:** a grid. **Output:** a number of steps, or `-1`.',
      'If the start or the exit is a wall, the answer is `-1`.',
      'A 1 × 1 open grid needs `0` steps.',
      'Every step costs the same. That is what makes BFS the right tool.',
    ],
    byHand: [
      {
        kind: 'diagram',
        art: `grid          distance from the start
0 0 0         0 1 2
1 1 0         # # 3
0 0 0         6 5 4   <- the exit gets 4`,
        caption: 'Write 0 on the start, 1 on its open neighbours, 2 on theirs, and so on.',
      },
      {
        kind: 'para',
        text: 'Each "ring" is the open, unnumbered neighbours of the previous ring. You never renumber a cell: the first number it gets is already the smallest.',
      },
    ],
    rule:
      'Number cells by distance in rings, starting with 0 at the start; each ring is the unvisited open neighbours of the previous ring; the exit\'s number is the answer.',
    brute: {
      idea: 'Try every path through the maze (never stepping on the same cell twice in one path) and keep the shortest.',
      java: `// Fewest steps from (r, c) to the exit, without reusing cells already on this path.
int tryPaths(int[][] grid, int r, int c, boolean[][] onPath) {
    int rows = grid.length, cols = grid[0].length;
    if (r < 0 || c < 0 || r >= rows || c >= cols) return Integer.MAX_VALUE;
    if (grid[r][c] == 1 || onPath[r][c]) return Integer.MAX_VALUE;
    if (r == rows - 1 && c == cols - 1) return 0;
    onPath[r][c] = true;
    int best = Integer.MAX_VALUE;
    int[][] moves = { {1, 0}, {-1, 0}, {0, 1}, {0, -1} };
    for (int[] m : moves) {
        int rest = tryPaths(grid, r + m[0], c + m[1], onPath);
        if (rest != Integer.MAX_VALUE) best = Math.min(best, rest + 1);
    }
    // Free the cell, so other paths may use it.
    onPath[r][c] = false;
    return best;
}

int shortestPathBrute(int[][] grid) {
    int best = tryPaths(grid, 0, 0, new boolean[grid.length][grid[0].length]);
    return best == Integer.MAX_VALUE ? -1 : best;
}`,
      python: `def try_paths(grid: list[list[int]], r: int, c: int, on_path: set) -> float:
    # Fewest steps from (r, c) to the exit, without reusing cells already on this path.
    rows, cols = len(grid), len(grid[0])
    if r < 0 or c < 0 or r >= rows or c >= cols:
        return float("inf")
    if grid[r][c] == 1 or (r, c) in on_path:
        return float("inf")
    if (r, c) == (rows - 1, cols - 1):
        return 0
    on_path.add((r, c))
    best = float("inf")
    for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        best = min(best, try_paths(grid, r + dr, c + dc, on_path) + 1)
    # Free the cell, so other paths may use it.
    on_path.remove((r, c))
    return best


def shortest_path_brute(grid: list[list[int]]) -> int:
    best = try_paths(grid, 0, 0, set())
    return -1 if best == float("inf") else best`,
      cost: 'The number of paths grows exponentially with the grid size. Even a 6 × 6 open grid has over a million.',
    },
    repeated:
      'Different paths keep walking through the same cells, again and again. But in the ripple picture, the **first** time a cell is reached, it is reached by a shortest route. So each cell needs to be visited exactly once, in order of distance, and a **queue** gives exactly that order.',
    better: {
      idea: '`dist` holds each cell\'s distance (or `-1` if not reached yet). The queue holds reached cells whose neighbours are still to be looked at.',
      java: `int shortestPath(int[][] grid) {
    int rows = grid.length, cols = grid[0].length;
    // A wall on the start or on the exit: there is no path at all.
    if (grid[0][0] == 1 || grid[rows - 1][cols - 1] == 1) return -1;

    // dist[r][c] = steps from the start; -1 means "not reached yet".
    int[][] dist = new int[rows][cols];
    for (int[] row : dist) Arrays.fill(row, -1);

    // First in, first out: cells leave in the order they were reached,
    // which is nearest first.
    Deque<int[]> queue = new ArrayDeque<>();
    dist[0][0] = 0;
    queue.offer(new int[] { 0, 0 });

    int[][] moves = { {1, 0}, {-1, 0}, {0, 1}, {0, -1} };
    while (!queue.isEmpty()) {
        int[] cell = queue.poll();
        int r = cell[0], c = cell[1];

        // The exit came out of the queue: nothing nearer is left, so this is shortest.
        if (r == rows - 1 && c == cols - 1) return dist[r][c];

        for (int[] m : moves) {
            int nr = r + m[0], nc = c + m[1];
            // Skip cells off the grid, walls, and cells already reached.
            if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
            if (grid[nr][nc] == 1 || dist[nr][nc] != -1) continue;
            // One step further than where we came from. Recording it now
            // also marks it as reached, so nobody queues it twice.
            dist[nr][nc] = dist[r][c] + 1;
            queue.offer(new int[] { nr, nc });
        }
    }

    // The queue ran dry and the exit was never reached: it is walled off.
    return -1;
}`,
      python: `from collections import deque


def shortest_path(grid: list[list[int]]) -> int:
    rows, cols = len(grid), len(grid[0])
    # A wall on the start or on the exit: there is no path at all.
    if grid[0][0] == 1 or grid[rows - 1][cols - 1] == 1:
        return -1

    # dist[r][c] = steps from the start; -1 means "not reached yet".
    dist = [[-1] * cols for _ in range(rows)]

    # First in, first out: cells leave in the order they were reached,
    # which is nearest first.
    queue = deque([(0, 0)])
    dist[0][0] = 0

    while queue:
        r, c = queue.popleft()

        # The exit came out of the queue: nothing nearer is left, so this is shortest.
        if (r, c) == (rows - 1, cols - 1):
            return dist[r][c]

        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            # Skip cells off the grid, walls, and cells already reached.
            if not (0 <= nr < rows and 0 <= nc < cols):
                continue
            if grid[nr][nc] == 1 or dist[nr][nc] != -1:
                continue
            # One step further than where we came from. Recording it now
            # also marks it as reached, so nobody queues it twice.
            dist[nr][nc] = dist[r][c] + 1
            queue.append((nr, nc))

    # The queue ran dry and the exit was never reached: it is walled off.
    return -1`,
      cost: '`O(rows × cols)`: each cell enters the queue at most once.',
    },
    dryRun: {
      headers: ['Taken off the queue', 'Its distance', 'Newly reached'],
      rows: [
        ['(0, 0)', '0', '(0, 1) at 1'],
        ['(0, 1)', '1', '(0, 2) at 2'],
        ['(0, 2)', '2', '(1, 2) at 3'],
        ['(1, 2)', '3', '(2, 2) at 4'],
        ['(2, 2)', '4', 'it is the exit → return 4'],
      ],
    },
    trap: 'Marking a cell as visited when it is **taken off** the queue rather than when it is **put on**. Then several neighbours can queue the same cell before it is processed, which multiplies the work and the memory. Mark (here: set `dist`) at the moment you enqueue.',
    signals: [
      'The **fewest** steps, moves or changes, when every move costs the same.',
      'Spreading in rings: rotting oranges, fire, "minutes until everyone is infected".',
      'Level-by-level traversal of a tree.',
      'Shortest path in an **unweighted** graph. (With weights, use Dijkstra.)',
    ],
    check: {
      question: 'Why does DFS not find the shortest path, while BFS does?',
      answer: 'DFS follows one route as deep as it can, so it may first reach the exit through a long detour. BFS reaches cells in rings of increasing distance, so its first arrival at the exit is along a shortest route.',
    },
  }),
};

const TOPO_SORT: CourseLesson = {
  slug: 'topological-sort',
  title: 'Topological sort',
  tagline:
    'When tasks depend on other tasks, do the ones that depend on nothing first. Each one you finish frees others.',
  topic: 'graphs',
  pattern: 'topological-sort',
  minutes: 15,
  practice: ['course-schedule'],
  blocks: walkthrough({
    plain:
      'Count how many unfinished prerequisites each task still has. Any task at zero can be done now. Doing it lowers the count of every task that was waiting for it, which may bring some of them to zero. Repeat. If tasks remain but none is at zero, they wait on each other in a circle.',
    problem:
      'There are `n` courses numbered `0` to `n − 1`, and pairs `[a, b]` meaning "take `b` before `a`". Return an order that takes every course, or an empty list if that is impossible.',
    example: '`n = 4`, pairs `[[1, 0], [2, 0], [3, 1], [3, 2]]` → `[0, 1, 2, 3]` (`[0, 2, 1, 3]` is also correct).',
    understand: [
      '**Input:** a number of courses and a list of "before" pairs. **Output:** an order, or an empty list.',
      'Several orders can be correct; any one is fine.',
      '`[a, b]` means **b first**. Getting this direction backwards is the classic bug.',
      'It is impossible exactly when the "before" rules go round in a circle.',
    ],
    byHand: [
      {
        kind: 'table',
        headers: ['Round', 'Free now (needs nothing)', 'Take', 'Still needed afterwards'],
        rows: [
          ['start', '0', '—', '1 needs 1 (course 0), 2 needs 1 (course 0), 3 needs 2'],
          ['1', '0', '0', '1 and 2 need nothing now; 3 needs 2'],
          ['2', '1, 2', '1', '3 needs 1 (course 2)'],
          ['3', '2', '2', '3 needs nothing now'],
          ['4', '3', '3', 'all done: `[0, 1, 2, 3]`'],
        ],
      },
    ],
    rule:
      'Count each course\'s missing prerequisites; repeatedly take a course whose count is zero and lower the count of every course waiting for it; if courses remain but none is at zero, there is a cycle.',
    brute: {
      idea: 'Each round, scan every course and check all its prerequisites, until one is found whose prerequisites are all taken.',
      java: `List<Integer> courseOrderBrute(int n, int[][] pairs) {
    boolean[] taken = new boolean[n];
    List<Integer> order = new ArrayList<>();
    for (int round = 0; round < n; round++) {
        int pick = -1;
        // Look for any course we are allowed to take now.
        for (int course = 0; course < n && pick == -1; course++) {
            if (taken[course]) continue;
            boolean ready = true;
            // Re-check every rule, every round.
            for (int[] p : pairs) {
                if (p[0] == course && !taken[p[1]]) ready = false;
            }
            if (ready) pick = course;
        }
        // Nothing is free, but courses remain: they wait on each other.
        if (pick == -1) return new ArrayList<>();
        taken[pick] = true;
        order.add(pick);
    }
    return order;
}`,
      python: `def course_order_brute(n: int, pairs: list[list[int]]) -> list[int]:
    taken = [False] * n
    order = []
    for _ in range(n):
        pick = -1
        # Look for any course we are allowed to take now.
        for course in range(n):
            if taken[course]:
                continue
            # Re-check every rule, every round.
            if all(taken[b] for a, b in pairs if a == course):
                pick = course
                break
        # Nothing is free, but courses remain: they wait on each other.
        if pick == -1:
            return []
        taken[pick] = True
        order.append(pick)
    return order`,
      cost: '`n` rounds × `n` courses × every rule: `O(n² × e)`.',
    },
    repeated:
      'Each round re-checks every course against every rule, although taking one course can only change the courses **waiting for it**. Keep, for each course, a count of what it still needs, and a list of who waits for it. Taking a course then touches only its own waiters.',
    better: {
      idea: '`needs[c]` counts missing prerequisites; `waiters[b]` lists the courses that need `b`; `ready` holds courses at zero.',
      java: `List<Integer> courseOrder(int n, int[][] pairs) {
    // needs[c] = how many prerequisites course c is still missing.
    int[] needs = new int[n];
    // waiters.get(b) = the courses that list b as a prerequisite.
    List<List<Integer>> waiters = new ArrayList<>();
    for (int i = 0; i < n; i++) waiters.add(new ArrayList<>());

    for (int[] p : pairs) {
        // [a, b]: a waits for b. So b's waiters get a, and a needs one more.
        waiters.get(p[1]).add(p[0]);
        needs[p[0]]++;
    }

    // Every course that needs nothing can be taken straight away.
    Deque<Integer> ready = new ArrayDeque<>();
    for (int c = 0; c < n; c++) {
        if (needs[c] == 0) ready.offer(c);
    }

    List<Integer> order = new ArrayList<>();
    while (!ready.isEmpty()) {
        // Take any free course.
        int course = ready.poll();
        order.add(course);
        // Everyone waiting for it is missing one prerequisite fewer.
        for (int next : waiters.get(course)) {
            needs[next]--;
            // That was its last one: it is free now.
            if (needs[next] == 0) ready.offer(next);
        }
    }

    // If some courses were never freed, they wait on each other in a circle.
    return order.size() == n ? order : new ArrayList<>();
}`,
      python: `from collections import deque


def course_order(n: int, pairs: list[list[int]]) -> list[int]:
    # needs[c] = how many prerequisites course c is still missing.
    needs = [0] * n
    # waiters[b] = the courses that list b as a prerequisite.
    waiters = [[] for _ in range(n)]

    for a, b in pairs:
        # [a, b]: a waits for b. So b's waiters get a, and a needs one more.
        waiters[b].append(a)
        needs[a] += 1

    # Every course that needs nothing can be taken straight away.
    ready = deque(c for c in range(n) if needs[c] == 0)

    order = []
    while ready:
        # Take any free course.
        course = ready.popleft()
        order.append(course)
        # Everyone waiting for it is missing one prerequisite fewer.
        for nxt in waiters[course]:
            needs[nxt] -= 1
            # That was its last one: it is free now.
            if needs[nxt] == 0:
                ready.append(nxt)

    # If some courses were never freed, they wait on each other in a circle.
    return order if len(order) == n else []`,
      cost: '`O(n + e)`: every course is taken once and every rule is looked at once.',
    },
    dryRun: {
      headers: ['Taken', '`needs` after (courses 0–3)', '`ready` after', '`order`'],
      rows: [
        ['—', '0, 1, 1, 2', '0', '—'],
        ['0', '0, 0, 0, 2', '1, 2', '0'],
        ['1', '0, 0, 0, 1', '2', '0, 1'],
        ['2', '0, 0, 0, 0', '3', '0, 1, 2'],
        ['3', '0, 0, 0, 0', '—', '0, 1, 2, 3'],
      ],
    },
    trap: 'Reading `[a, b]` the wrong way round. Here it means "b before a", so `b`\'s waiters get `a`, and `a`\'s count goes up. Reversed arrows produce an order that looks fine and is completely wrong. Draw one pair from the example as an arrow before writing code. Also keep the final `order.size() == n` check, or a cycle silently returns a partial order.',
    signals: [
      'Tasks with **prerequisites**, build steps, install order.',
      '"Is it possible to finish all the courses?" (a cycle in a directed graph).',
      'The order of letters in an alien dictionary.',
      'Anything that is a directed graph with no cycles (a DAG).',
    ],
    check: {
      question: 'How does the algorithm\'s final state prove that the courses are impossible?',
      answer: 'If the ready queue empties while some courses are still untaken, every remaining course is missing a prerequisite that is also remaining. Follow those "missing" links from any remaining course: there are finitely many courses, so you must come back to one you have seen. That is the circle.',
    },
  }),
};

const UNION_FIND: CourseLesson = {
  slug: 'union-find',
  title: 'Union find',
  tagline:
    'Give every group a leader. Merging two groups is one pointer change, and "same group?" is "same leader?".',
  topic: 'graphs',
  pattern: 'union-find',
  minutes: 15,
  practice: [],
  blocks: walkthrough({
    plain:
      'Everyone starts as their own group, with themselves as leader. Each person points to someone in their group, and following the pointers up always ends at the leader. To merge two groups, make one leader point to the other. Two people are in the same group exactly when they reach the same leader.',
    problem:
      'There are `n` people numbered `0` to `n − 1` and a list of friendships `[a, b]`. A friend of a friend is in the same group. Return how many groups there are.',
    example: '`n = 5`, friendships `[[0, 1], [1, 2], [3, 4]]` → `2`: the groups are `{0, 1, 2}` and `{3, 4}`.',
    understand: [
      '**Input:** a number of people and a list of friendships. **Output:** a number of groups.',
      'Someone with no friendships is a group of one.',
      'A friendship between two people already in the same group changes nothing.',
      'The friendships can come in any order.',
    ],
    byHand: [
      {
        kind: 'table',
        headers: ['Friendship', 'Already same group?', 'Groups'],
        rows: [
          ['start', '—', '`{0} {1} {2} {3} {4}` → 5'],
          ['0–1', 'no, merge', '`{0, 1} {2} {3} {4}` → 4'],
          ['1–2', 'no, merge', '`{0, 1, 2} {3} {4}` → 3'],
          ['3–4', 'no, merge', '`{0, 1, 2} {3, 4}` → 2'],
        ],
      },
      { kind: 'para', text: 'Each friendship between two different groups lowers the count by exactly one.' },
    ],
    rule:
      'Start with everyone alone; for each friendship, if the two are in different groups, merge the groups and count one group fewer.',
    brute: {
      idea: 'Give every person a group label. To merge, relabel every member of one group with the other group\'s label.',
      java: `int countGroupsBrute(int n, int[][] friendships) {
    // label[i] = the name of i's group. Everyone starts alone.
    int[] label = new int[n];
    for (int i = 0; i < n; i++) label[i] = i;
    int groups = n;
    for (int[] f : friendships) {
        int keep = label[f[0]], old = label[f[1]];
        if (keep == old) continue;  // already the same group
        // Merge by relabelling EVERYONE in the old group: a walk over all n people.
        for (int i = 0; i < n; i++) {
            if (label[i] == old) label[i] = keep;
        }
        groups--;
    }
    return groups;
}`,
      python: `def count_groups_brute(n: int, friendships: list[list[int]]) -> int:
    # label[i] = the name of i's group. Everyone starts alone.
    label = list(range(n))
    groups = n
    for a, b in friendships:
        keep, old = label[a], label[b]
        if keep == old:
            continue  # already the same group
        # Merge by relabelling EVERYONE in the old group: a walk over all n people.
        for i in range(n):
            if label[i] == old:
                label[i] = keep
        groups -= 1
    return groups`,
      cost: '`O(n)` per friendship, `O(n × f)` in total.',
    },
    repeated:
      'Each merge walks over all `n` people just to rename one group. A cheaper way to "rename a whole group" is to change a single pointer: make the old group\'s **leader** report to the new leader. Everyone in the old group now finds the new leader by following pointers up.',
    better: {
      idea: '`parent[x]` is who `x` reports to; a leader reports to itself. `find` climbs to the leader, shortening the path as it goes.',
      java: `int[] parent;

// Follow the "reports to" pointers up to the group's leader.
int find(int x) {
    while (parent[x] != x) {
        // Path halving: point x at its grandparent on the way up,
        // so later climbs from here are shorter.
        parent[x] = parent[parent[x]];
        x = parent[x];
    }
    return x;
}

int countGroups(int n, int[][] friendships) {
    // Everyone starts as the leader of their own group.
    parent = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    int groups = n;

    for (int[] f : friendships) {
        // Merge LEADERS, never the two people directly.
        int a = find(f[0]), b = find(f[1]);
        // Same leader: already one group.
        if (a == b) continue;
        // One pointer change merges the whole groups: b's leader reports to a's.
        parent[b] = a;
        groups--;
    }
    return groups;
}`,
      python: `def count_groups(n: int, friendships: list[list[int]]) -> int:
    # parent[x] = who x reports to. Everyone starts as their own leader.
    parent = list(range(n))

    def find(x: int) -> int:
        # Follow the "reports to" pointers up to the group's leader.
        while parent[x] != x:
            # Path halving: point x at its grandparent on the way up,
            # so later climbs from here are shorter.
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    groups = n
    for a, b in friendships:
        # Merge LEADERS, never the two people directly.
        ra, rb = find(a), find(b)
        # Same leader: already one group.
        if ra == rb:
            continue
        # One pointer change merges the whole groups: rb now reports to ra.
        parent[rb] = ra
        groups -= 1
    return groups`,
      cost: 'Close to `O(1)` per friendship in practice, because path halving keeps the pointer chains short.',
    },
    dryRun: {
      headers: ['Friendship', '`find` gives', 'Action', '`parent` after', 'Groups'],
      rows: [
        ['—', '—', '—', '0 1 2 3 4', '5'],
        ['0–1', '0 and 1', '`parent[1] = 0`', '0 0 2 3 4', '4'],
        ['1–2', '0 and 2', '`parent[2] = 0`', '0 0 0 3 4', '3'],
        ['3–4', '3 and 4', '`parent[4] = 3`', '0 0 0 3 3', '2'],
      ],
    },
    trap: 'Linking the two **people** instead of their **leaders**: `parent[b] = a` (with the raw people) pulls `b` out of its old group and leaves the rest of that group behind. Always merge `find(a)` and `find(b)`.',
    signals: [
      '"Are these two connected?", asked many times while connections are being added.',
      'Count **groups**, **components**, provinces or friend circles.',
      'Does adding this edge create a cycle? (Kruskal\'s minimum spanning tree.)',
      'Merge accounts or sets that share an element.',
    ],
    check: {
      question: 'How would union find tell you that a new road creates a loop?',
      answer: 'Before adding road `a–b`, check whether `find(a) == find(b)`. If they already share a leader, `a` and `b` were already connected, so the new road closes a loop.',
    },
  }),
};

const TRIE: CourseLesson = {
  slug: 'trie',
  title: 'Trie (prefix tree)',
  tagline:
    'Store words letter by letter in a tree, so words with the same beginning share a path. A lookup costs the length of the word, not the number of words.',
  topic: 'trees',
  pattern: 'trie',
  minutes: 15,
  practice: ['implement-trie', 'maximum-xor-pair'],
  blocks: walkthrough({
    plain:
      'A trie is like the thumb index of a paper dictionary: open at C, then CA, then CAT. Each step down the tree is one letter, and words that start the same way share the same steps. Checking a word or a prefix walks down its letters, however many words are stored.',
    problem:
      'Build a word store with three operations: `insert(word)`; `search(word)`, which says whether that exact word was inserted; and `startsWith(prefix)`, which says whether any inserted word starts with it. Words use lowercase `a` to `z`.',
    example: 'insert `"car"`, insert `"cat"`; then `search("ca")` → `false`, `startsWith("ca")` → `true`, `search("cat")` → `true`.',
    understand: [
      '**Operations:** insert, exact search, prefix search.',
      '`"ca"` is a prefix of a stored word, but it was never stored itself, so `search("ca")` is `false`.',
      'So we must remember **where words end**, not just which paths exist.',
      'There may be many words and many queries.',
    ],
    byHand: [
      {
        kind: 'diagram',
        art: `(top)
  └─ c
      └─ a
          ├─ r   ← "car" ends here
          └─ t   ← "cat" ends here`,
        caption: '"car" and "cat" share the path c → a, stored once.',
      },
      {
        kind: 'para',
        text: 'To check `"cat"`: from the top, follow `c`, then `a`, then `t`, and see that a word ends there. To check the prefix `"ca"`: follow `c`, then `a`; the path exists, which is all a prefix needs.',
      },
    ],
    rule:
      'Walk down one letter at a time, creating missing branches when inserting; a word exists if the walk succeeds and ends on a node marked as a word end; a prefix exists if the walk merely succeeds.',
    brute: {
      idea: 'Keep a plain list of words and compare against all of them.',
      java: `class WordList {
    List<String> words = new ArrayList<>();

    void insert(String word) { words.add(word); }

    // contains compares against every stored word.
    boolean search(String word) { return words.contains(word); }

    boolean startsWith(String prefix) {
        // Check every stored word's beginning.
        for (String w : words) {
            if (w.startsWith(prefix)) return true;
        }
        return false;
    }
}`,
      python: `class WordList:
    def __init__(self):
        self.words = []

    def insert(self, word: str) -> None:
        self.words.append(word)

    def search(self, word: str) -> bool:
        # "in" compares against every stored word.
        return word in self.words

    def starts_with(self, prefix: str) -> bool:
        # Check every stored word's beginning.
        return any(w.startswith(prefix) for w in self.words)`,
      cost: 'Every query compares against all `W` stored words: `O(W × L)` for words of length `L`.',
    },
    repeated:
      'Every query re-reads the beginnings of all stored words, and those beginnings repeat: `"car"`, `"cat"` and `"cart"` all start with `"ca"`, which gets checked once per word. A trie stores each shared beginning **once**, so a query reads each letter of its own word exactly once.',
    better: {
      idea: 'Each node has up to 26 children, one per letter, and a flag saying whether a word ends there.',
      java: `class Trie {
    class Node {
        // children[0] is the branch for 'a', children[25] for 'z'.
        Node[] children = new Node[26];
        // True if an inserted word ends exactly at this node.
        boolean isWord;
    }

    // The empty top node: every word starts here.
    Node root = new Node();

    void insert(String word) {
        Node node = root;
        for (char ch : word.toCharArray()) {
            int i = ch - 'a';
            // No branch for this letter yet: grow one.
            if (node.children[i] == null) node.children[i] = new Node();
            // Step down to this letter's node.
            node = node.children[i];
        }
        // The last letter's node is where this word ends.
        node.isWord = true;
    }

    // Follow the letters of s from the top; null if a branch is missing.
    Node walk(String s) {
        Node node = root;
        for (char ch : s.toCharArray()) {
            node = node.children[ch - 'a'];
            if (node == null) return null;
        }
        return node;
    }

    boolean search(String word) {
        Node node = walk(word);
        // The path must exist AND a word must end exactly there.
        return node != null && node.isWord;
    }

    boolean startsWith(String prefix) {
        // A prefix only needs the path to exist.
        return walk(prefix) != null;
    }
}`,
      python: `class TrieNode:
    def __init__(self):
        # letter -> the node for that next letter.
        self.children = {}
        # True if an inserted word ends exactly at this node.
        self.is_word = False


class Trie:
    def __init__(self):
        # The empty top node: every word starts here.
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            # No branch for this letter yet: grow one.
            if ch not in node.children:
                node.children[ch] = TrieNode()
            # Step down to this letter's node.
            node = node.children[ch]
        # The last letter's node is where this word ends.
        node.is_word = True

    def _walk(self, s: str) -> "TrieNode | None":
        # Follow the letters of s from the top; None if a branch is missing.
        node = self.root
        for ch in s:
            node = node.children.get(ch)
            if node is None:
                return None
        return node

    def search(self, word: str) -> bool:
        node = self._walk(word)
        # The path must exist AND a word must end exactly there.
        return node is not None and node.is_word

    def starts_with(self, prefix: str) -> bool:
        # A prefix only needs the path to exist.
        return self._walk(prefix) is not None`,
      cost: '`O(L)` per operation for a word of length `L`, no matter how many words are stored.',
    },
    dryRun: {
      headers: ['Operation', 'Walk', 'Result'],
      rows: [
        ['`insert("car")`', 'grows c → a → r, marks r', '—'],
        ['`insert("cat")`', 'c, a exist; grows t, marks t', '—'],
        ['`search("ca")`', 'c → a found, but no word ends at a', '`false`'],
        ['`startsWith("ca")`', 'c → a found', '`true`'],
        ['`search("cap")`', 'c → a, then no p branch', '`false`'],
      ],
    },
    trap: 'Treating "the path exists" as "the word exists". After inserting `"car"`, the path for `"ca"` exists too, but `"ca"` was never inserted. `search` must also check the end-of-word flag; only `startsWith` may ignore it.',
    signals: [
      'Many words, and many **prefix** questions: autocomplete, "starts with".',
      'Word search on a board, checked against a dictionary.',
      'The longest common prefix of many words.',
      'Bit-by-bit tries for "maximum XOR of two numbers".',
    ],
    check: {
      question: 'How would you list every stored word that starts with a prefix (autocomplete)?',
      answer: 'Walk down the prefix to its node. Then explore everything below that node with DFS, adding one letter per step, and collect the word each time you reach a node whose end-of-word flag is set.',
    },
  }),
};

export const ORDER_PATTERNS: CourseLesson[] = [MERGE_INTERVALS, TOP_K];
export const GRAPH_PATTERNS: CourseLesson[] = [DFS, BFS, TOPO_SORT, UNION_FIND, TRIE];
