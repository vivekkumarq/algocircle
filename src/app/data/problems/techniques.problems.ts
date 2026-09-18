import { WorkedProblem } from './problem.model';

export const TECHNIQUE_PROBLEMS: WorkedProblem[] = [
  // -------------------------------------------------------------- two pointers
  {
    slug: 'three-sum',
    title: 'Triplets that sum to zero',
    topic: 'two-pointers',
    pattern: 'two-pointers',
    difficulty: 'Medium',
    statement: 'Find every distinct triplet in an array that sums to zero. No triplet may be reported twice.',
    example: { input: '[-1, 0, 1, 2, -1, -4]', output: '[[-1, -1, 2], [-1, 0, 1]]' },
    hints: [
      'Sorting makes the sum monotonic as you move a pointer.',
      'Fix one element, then the rest is a two-sum on a sorted suffix.',
      'Duplicates are the real difficulty — where exactly do you skip them?',
      'Skip repeats at the anchor, and on both sides only after recording a hit.',
    ],
    bruteForce: { idea: 'Three nested loops, then deduplicate the results with a set.', complexity: 'O(n³)' },
    optimal: {
      idea: 'Sort, fix the first element with an outer loop, and two-point the suffix for the remaining pair.',
      complexity: 'O(n²) time, O(1) extra space',
      language: 'java',
      code: `List<List<Integer>> threeSum(int[] a) {
    Arrays.sort(a);
    List<List<Integer>> out = new ArrayList<>();

    for (int i = 0; i < a.length - 2; i++) {
        if (a[i] > 0) break;                              // sorted: nothing left can reach 0
        if (i > 0 && a[i] == a[i - 1]) continue;          // same anchor as last time

        int lo = i + 1, hi = a.length - 1;

        while (lo < hi) {
            int sum = a[i] + a[lo] + a[hi];

            if (sum < 0) {
                lo++;
            } else if (sum > 0) {
                hi--;
            } else {
                out.add(List.of(a[i], a[lo], a[hi]));

                while (lo < hi && a[lo] == a[lo + 1]) lo++;
                while (lo < hi && a[hi] == a[hi - 1]) hi--;
                lo++;
                hi--;
            }
        }
    }
    return out;
}`,
    },
    insight: 'The two-pointer part is easy; emitting each distinct triplet exactly once is what the question is really testing.',
  },
  {
    slug: 'container-most-water',
    title: 'Two walls holding the most water',
    topic: 'two-pointers',
    pattern: 'two-pointers',
    difficulty: 'Medium',
    statement: 'Given heights of vertical walls, pick two so that the rectangle they form with the ground holds the most water.',
    example: { input: '[1,8,6,2,5,4,8,3,7]', output: '49' },
    hints: [
      'The area is the shorter wall times the distance between them.',
      'Start at the widest pair. Which side can you safely move?',
      'Moving the taller wall inward can never help — why?',
    ],
    bruteForce: { idea: 'Try every pair of walls and compute the area.', complexity: 'O(n²)' },
    optimal: {
      idea: 'Start at both ends and always move the shorter wall inward. Keeping it and reducing the width can only shrink the area, so it cannot be part of a better pair.',
      complexity: 'O(n) time, O(1) space',
      language: 'java',
      code: `int maxArea(int[] h) {
    int lo = 0, hi = h.length - 1, best = 0;

    while (lo < hi) {
        best = Math.max(best, Math.min(h[lo], h[hi]) * (hi - lo));

        // Width only shrinks, so only a taller line can help: move the shorter one.
        if (h[lo] < h[hi]) lo++;
        else hi--;
    }
    return best;
}`,
    },
    insight: 'The whole solution rests on one exchange argument: the shorter wall is the binding constraint, so it is the one to discard.',
  },
  {
    slug: 'sort-colours',
    title: 'Sort an array of three values in one pass',
    topic: 'two-pointers',
    pattern: 'two-pointers',
    difficulty: 'Medium',
    statement: 'An array contains only 0s, 1s and 2s. Sort it in place with a single pass and constant extra space.',
    example: { input: '[2,0,2,1,1,0]', output: '[0,0,1,1,2,2]' },
    hints: [
      'Counting and rewriting works but touches the data twice.',
      'Three pointers can maintain three regions: done-low, unknown, done-high.',
      'After swapping from the high end, is the new value examined yet?',
    ],
    bruteForce: { idea: 'Count how many of each value there are, then overwrite the array.', complexity: 'O(n), two passes' },
    optimal: {
      idea: 'Dutch national flag. Everything before `low` is 0, everything after `high` is 2, and the region between `mid` and `high` is still unknown.',
      complexity: 'O(n) time, O(1) space, one pass',
      language: 'java',
      code: `void sortColours(int[] a) {
    int low = 0, mid = 0, high = a.length - 1;

    while (mid <= high) {
        if (a[mid] == 0) {
            swap(a, low++, mid++);
        } else if (a[mid] == 1) {
            mid++;
        } else {
            swap(a, mid, high--);    // the value swapped in is unseen: do NOT advance mid
        }
    }
}

private void swap(int[] a, int i, int j) {
    int temp = a[i];
    a[i] = a[j];
    a[j] = temp;
}`,
    },
    insight: 'Not advancing `mid` after a swap with `high` is the entire trick: the incoming value has not been classified yet.',
  },
  {
    slug: 'trapping-rain-water',
    title: 'Water trapped between bars',
    topic: 'two-pointers',
    pattern: 'two-pointers',
    difficulty: 'Hard',
    statement: 'Given bar heights, compute how much water is trapped between them after rain.',
    example: { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' },
    hints: [
      'Water above one bar depends on the tallest bar on each side of it.',
      'Precomputing both maxima works, but costs O(n) memory.',
      'If you know one side is shorter, is that side already decided?',
    ],
    bruteForce: { idea: 'For each bar, scan left and right for the tallest wall on each side.', complexity: 'O(n²)' },
    optimal: {
      idea: 'Two pointers with a running max on each side. Move whichever side is shorter, because that side is the binding constraint and its water level is already known.',
      complexity: 'O(n) time, O(1) space',
      language: 'java',
      code: `int trap(int[] h) {
    int lo = 0, hi = h.length - 1;
    int leftMax = 0, rightMax = 0, water = 0;

    while (lo < hi) {
        // The shorter side is the one whose water level is already decided.
        if (h[lo] < h[hi]) {
            leftMax = Math.max(leftMax, h[lo]);
            water += leftMax - h[lo];
            lo++;
        } else {
            rightMax = Math.max(rightMax, h[hi]);
            water += rightMax - h[hi];
            hi--;
        }
    }
    return water;
}`,
    },
    insight: 'Same exchange argument as container-with-most-water: whichever side is smaller is already fully determined, so it can be resolved and discarded.',
  },

  // ------------------------------------------------------------ sliding window
  {
    slug: 'min-window-substring',
    title: 'Smallest window containing every required character',
    topic: 'sliding-window',
    pattern: 'sliding-window',
    difficulty: 'Hard',
    statement: 'Given a text and a set of required characters with counts, find the shortest contiguous window of the text that contains all of them.',
    example: { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' },
    hints: [
      'Track how many requirements are currently satisfied, not just raw counts.',
      'Expand until the window is valid, then shrink while it stays valid.',
      'For "shortest", where must you record the answer?',
      'A requirement becomes satisfied only when its count reaches the needed amount exactly.',
    ],
    bruteForce: { idea: 'Check every substring for containing all required characters.', complexity: 'O(n²·k)' },
    optimal: {
      idea: 'A window with a need-map and a satisfied counter. Grow right until valid, then shrink from the left recording the best before each removal.',
      complexity: 'O(n + m) time, O(alphabet) space',
      language: 'java',
      code: `String minWindow(String s, String t) {
    if (t.isEmpty() || s.length() < t.length()) return "";

    Map<Character, Integer> need = new HashMap<>();
    for (char c : t.toCharArray()) need.merge(c, 1, Integer::sum);

    Map<Character, Integer> window = new HashMap<>();
    int required = need.size(), formed = 0;
    int left = 0, bestStart = 0, bestLen = Integer.MAX_VALUE;

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        window.merge(c, 1, Integer::sum);

        if (need.containsKey(c) && window.get(c).intValue() == need.get(c)) formed++;

        while (formed == required) {                 // valid: shrink while it stays valid
            if (right - left + 1 < bestLen) {
                bestLen = right - left + 1;
                bestStart = left;
            }

            char out = s.charAt(left++);
            window.merge(out, -1, Integer::sum);
            if (need.containsKey(out) && window.get(out) < need.get(out)) formed--;
        }
    }
    return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
}`,
    },
    insight: 'Comparing counts with `==` rather than `>=` is what keeps `formed` accurate — it increments exactly once per requirement.',
  },
  {
    slug: 'at-most-k-distinct',
    title: 'Longest window with at most K distinct values',
    topic: 'sliding-window',
    pattern: 'sliding-window',
    difficulty: 'Medium',
    statement: 'Find the length of the longest contiguous run containing no more than `k` distinct values.',
    example: { input: 'a = [1,2,1,2,3], k = 2', output: '4', note: '[1,2,1,2]' },
    hints: [
      'A frequency map tells you how many distinct values are in the window.',
      'Shrink while there are too many.',
      'When a count reaches zero, what must you do to the map?',
    ],
    bruteForce: { idea: 'Check every subarray, counting distinct values with a set.', complexity: 'O(n²)' },
    optimal: {
      idea: 'A window with a count map, shrinking from the left while the map holds more than `k` keys. Removing a key at zero is essential or `size()` overcounts.',
      complexity: 'O(n) time, O(k) space',
      language: 'java',
      code: `int longestAtMostKDistinct(int[] a, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    int left = 0, best = 0;

    for (int right = 0; right < a.length; right++) {
        count.merge(a[right], 1, Integer::sum);

        while (count.size() > k) {
            int out = a[left++];
            if (count.merge(out, -1, Integer::sum) == 0) count.remove(out);
        }

        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
    },
    insight: 'Counting subarrays with **exactly** k distinct is `atMost(k) - atMost(k-1)` — "exactly" is not a monotone window rule on its own.',
  },
  {
    slug: 'max-in-each-window',
    title: 'Maximum of every window of size k',
    topic: 'sliding-window',
    pattern: 'monotonic-queue',
    difficulty: 'Hard',
    statement: 'Given an array and a window size `k`, report the maximum inside each window as it slides from left to right.',
    example: { input: 'a = [1,3,-1,-3,5,3,6,7], k = 3', output: '[3,3,5,5,6,7]' },
    hints: [
      'Rescanning each window is O(n·k).',
      'A heap gives O(n log k), but stale entries are awkward.',
      'If a smaller value arrives after a larger one, can the smaller ever win?',
    ],
    bruteForce: { idea: 'Scan each window for its maximum.', complexity: 'O(n·k)' },
    optimal: {
      idea: 'A deque of indices kept in decreasing order of value. Smaller values at the back are dropped forever, and the front is dropped when it leaves the window.',
      complexity: 'O(n) time, O(k) space',
      language: 'java',
      code: `int[] maxInEachWindow(int[] a, int k) {
    Deque<Integer> deque = new ArrayDeque<>();     // indices, values decreasing
    int[] out = new int[a.length - k + 1];

    for (int i = 0; i < a.length; i++) {
        while (!deque.isEmpty() && deque.peekFirst() <= i - k) deque.pollFirst();

        // Anything smaller than a[i] can never be a maximum again.
        while (!deque.isEmpty() && a[deque.peekLast()] <= a[i]) deque.pollLast();

        deque.offerLast(i);
        if (i >= k - 1) out[i - k + 1] = a[deque.peekFirst()];
    }
    return out;
}`,
    },
    insight: 'A smaller, older value leaves the window no later than a larger, newer one — so it can never be the maximum again and is safe to discard permanently.',
  },
  {
    slug: 'min-size-subarray-sum',
    title: 'Shortest subarray with sum at least S',
    topic: 'sliding-window',
    pattern: 'sliding-window',
    difficulty: 'Medium',
    statement: 'Given an array of positive integers, find the length of the shortest contiguous run whose sum is at least `S`. Return 0 if none exists.',
    example: { input: 'a = [2,3,1,2,4,3], S = 7', output: '2', note: '[4, 3]' },
    hints: [
      'All values are positive — what does that guarantee about the sum as the window grows?',
      'Grow until valid, then shrink while still valid.',
      'For "shortest", record the length before removing an element.',
    ],
    bruteForce: { idea: 'Try every start and extend until the sum is reached.', complexity: 'O(n²)' },
    optimal: {
      idea: 'A window with a running sum. While the sum is at least `S`, record the length and shrink from the left.',
      complexity: 'O(n) time, O(1) space',
      language: 'java',
      code: `int minSubarrayLen(int[] a, int target) {
    int left = 0, sum = 0, best = Integer.MAX_VALUE;

    for (int right = 0; right < a.length; right++) {
        sum += a[right];

        while (sum >= target) {                     // valid: record, then try smaller
            best = Math.min(best, right - left + 1);
            sum -= a[left++];
        }
    }
    return best == Integer.MAX_VALUE ? 0 : best;
}`,
    },
    insight: 'Positivity is load-bearing. With negatives the sum is no longer monotone in the window size, and you need prefix sums with a monotonic deque instead.',
  },

  // -------------------------------------------------------------- binary search
  {
    slug: 'first-last-occurrence',
    title: 'First and last position of a value',
    topic: 'binary-search',
    pattern: 'binary-search',
    difficulty: 'Medium',
    statement: 'In a sorted array with duplicates, find the first and last index of a target value, or report that it is absent.',
    example: { input: 'a = [5,7,7,8,8,10], target = 8', output: '[3, 4]' },
    hints: [
      'Plain binary search finds *an* occurrence, not the first.',
      'Change the condition rather than the structure.',
      'What boundary does "first index with value at least the target" give you?',
    ],
    bruteForce: { idea: 'Binary search for any occurrence, then walk outward.', complexity: 'O(log n + k), and O(n) when all values are equal' },
    optimal: {
      idea: 'Two boundary searches. Lower bound gives the first index at least the target; upper bound gives the first strictly greater, so the last occurrence is one before it.',
      complexity: 'O(log n) time, O(1) space',
      language: 'java',
      code: `int[] searchRange(int[] a, int target) {
    int first = lowerBound(a, target);
    int last = lowerBound(a, target + 1) - 1;

    return first <= last ? new int[] { first, last } : new int[] { -1, -1 };
}

/** First index with a[i] >= target, or a.length if there is none. */
private int lowerBound(int[] a, int target) {
    int lo = 0, hi = a.length;

    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] >= target) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
    },
    insight: 'One half-open template plus a different condition covers first, last, count and insertion point. Learning it once beats memorising four variants.',
  },
  {
    slug: 'search-rotated',
    title: 'Search a rotated sorted array',
    topic: 'binary-search',
    pattern: 'binary-search',
    difficulty: 'Medium',
    statement: 'A sorted array of distinct values has been rotated at an unknown point. Find a target in logarithmic time.',
    example: { input: 'a = [4,5,6,7,0,1,2], target = 0', output: '4' },
    hints: [
      'The array is not monotonic overall — but look at the two halves.',
      'At any split, at least one half is still sorted.',
      'Decide which half is sorted, then whether the target lies inside it.',
    ],
    bruteForce: { idea: 'Scan every element from left to right until the target turns up.', complexity: 'O(n)' },
    optimal: {
      idea: 'Compare `a[lo]` with `a[mid]` to identify the sorted half, then test whether the target falls inside that half — if so search it, otherwise search the other.',
      complexity: 'O(log n) time, O(1) space',
      language: 'java',
      code: `int search(int[] a, int target) {
    int lo = 0, hi = a.length - 1;

    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;

        if (a[lo] <= a[mid]) {                                  // left half is sorted
            if (a[lo] <= target && target < a[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {                                                // right half is sorted
            if (a[mid] < target && target <= a[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}`,
    },
    insight: 'With duplicates, `a[lo] == a[mid] == a[hi]` tells you nothing and the worst case degrades to O(n). Say that rather than claiming the log bound.',
  },
  {
    slug: 'ship-within-days',
    title: 'Smallest ship capacity to finish in D days',
    topic: 'binary-search',
    pattern: 'binary-search-on-answer',
    difficulty: 'Medium',
    statement: 'Packages must be shipped in order within `D` days. Find the smallest daily capacity that makes this possible.',
    example: { input: 'weights = [1,2,3,4,5,6,7,8,9,10], D = 5', output: '15' },
    hints: [
      'You are choosing a number, not an index.',
      'What are the smallest and largest capacities that could conceivably work?',
      'If a capacity works, does every larger capacity also work?',
      'Write a function that counts the days needed for a given capacity.',
    ],
    bruteForce: { idea: 'Try every capacity from the largest package up to the total weight.', complexity: 'O(total · n)' },
    optimal: {
      idea: 'Binary search the capacity. Feasibility is monotone — extra room never hurts — so the first capacity that works is the answer.',
      complexity: 'O(n log(total)) time, O(1) space',
      language: 'java',
      code: `int shipWithinDays(int[] weights, int days) {
    int lo = 0, hi = 0;
    for (int w : weights) {
        lo = Math.max(lo, w);      // a single package must fit
        hi += w;                   // one day for everything always works
    }

    while (lo < hi) {              // smallest capacity that still fits in the day budget
        int mid = lo + (hi - lo) / 2;

        if (daysNeeded(weights, mid) <= days) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

private int daysNeeded(int[] weights, int capacity) {
    int days = 1, load = 0;

    for (int w : weights) {
        if (load + w > capacity) {
            days++;
            load = 0;
        }
        load += w;
    }
    return days;
}`,
    },
    insight: 'The lower bound must be the largest single package, not zero — a capacity that cannot carry one package is not merely slow, it is impossible.',
  },
  {
    slug: 'median-two-sorted',
    title: 'Median of two sorted arrays',
    topic: 'binary-search',
    pattern: 'binary-search',
    difficulty: 'Hard',
    statement: 'Given two sorted arrays, find the median of their combined contents in logarithmic time.',
    example: { input: 'a = [1, 3], b = [2]', output: '2.0' },
    hints: [
      'Merging is O(n + m). The requirement rules it out.',
      'The median splits the combined data into two halves of known size.',
      'If you choose how many elements come from the first array, the second is determined.',
      'What condition says the split is correct?',
    ],
    bruteForce: { idea: 'Merge both arrays and take the middle element.', complexity: 'O(n + m)' },
    optimal: {
      idea: 'Binary search the partition point in the shorter array. The split is correct when the largest on each left side is at most the smallest on the opposite right side.',
      complexity: 'O(log min(n, m)) time, O(1) space',
      language: 'java',
      code: `double findMedianSortedArrays(int[] a, int[] b) {
    if (a.length > b.length) return findMedianSortedArrays(b, a);   // binary search the shorter

    int n = a.length, m = b.length;
    int lo = 0, hi = n;

    while (lo <= hi) {
        int i = (lo + hi) / 2;               // how many of the left side come from a
        int j = (n + m + 1) / 2 - i;

        int aLeft = i == 0 ? Integer.MIN_VALUE : a[i - 1];
        int aRight = i == n ? Integer.MAX_VALUE : a[i];
        int bLeft = j == 0 ? Integer.MIN_VALUE : b[j - 1];
        int bRight = j == m ? Integer.MAX_VALUE : b[j];

        if (aLeft <= bRight && bLeft <= aRight) {          // correct split found
            int leftMax = Math.max(aLeft, bLeft);
            if ((n + m) % 2 == 1) return leftMax;

            int rightMin = Math.min(aRight, bRight);
            return (leftMax + rightMin) / 2.0;
        }

        if (aLeft > bRight) hi = i - 1;
        else lo = i + 1;
    }
    throw new IllegalArgumentException("inputs are not sorted");
}`,
    },
    insight: 'Always binary search the shorter array so `j` stays in range. The sentinels for the empty-side cases are what remove a pile of branches.',
  },

  // ------------------------------------------------------------------- sorting
  {
    slug: 'kth-largest',
    title: 'Kth largest element',
    topic: 'sorting',
    pattern: 'heap-top-k',
    difficulty: 'Medium',
    statement: 'Find the kth largest value in an unsorted array.',
    example: { input: 'a = [3,2,1,5,6,4], k = 2', output: '5' },
    hints: [
      'Sorting gives it immediately — but is the whole order needed?',
      'A heap of size k keeps only what still matters.',
      'Partitioning discards one side entirely.',
    ],
    bruteForce: { idea: 'Sort the whole array and read the element at position n - k.', complexity: 'O(n log n)' },
    optimal: {
      idea: 'Quickselect: partition and recurse only into the side containing index `k`. Each step is linear and the remainder halves on average.',
      complexity: 'Expected O(n) time, O(1) space',
      language: 'java',
      code: `int findKthLargest(int[] a, int k) {
    int target = a.length - k;              // kth largest == this index once sorted
    int lo = 0, hi = a.length - 1;

    while (true) {
        int p = partition(a, lo, hi);

        if (p == target) return a[p];
        if (p < target) lo = p + 1;
        else hi = p - 1;
    }
}

/** Lomuto partition around the last element; returns its final index. */
private int partition(int[] a, int lo, int hi) {
    int pivot = a[hi], smaller = lo;

    for (int i = lo; i < hi; i++) {
        if (a[i] < pivot) swap(a, smaller++, i);
    }

    swap(a, smaller, hi);
    return smaller;
}

private void swap(int[] a, int i, int j) {
    int temp = a[i];
    a[i] = a[j];
    a[j] = temp;
}`,
    },
    insight: 'Quickselect for one query on data in memory; a size-k min-heap for a stream or when `k` is tiny. Say which assumption you are making.',
  },
  {
    slug: 'merge-intervals-problem',
    title: 'Merge overlapping intervals',
    topic: 'sorting',
    pattern: 'merge-intervals',
    difficulty: 'Medium',
    statement: 'Given a list of intervals, merge every set that overlaps into the fewest possible intervals.',
    example: { input: '[[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' },
    hints: [
      'Unsorted intervals force you to look backwards. What fixes that?',
      'Sort by which endpoint?',
      'After sorting, can an interval overlap anything other than the most recent block?',
    ],
    bruteForce: { idea: 'Repeatedly scan for any overlapping pair and merge, until no pair overlaps.', complexity: 'O(n²) or worse' },
    optimal: {
      idea: 'Sort by start. Then each interval either extends the last merged block or begins a new one — a single forward pass.',
      complexity: 'O(n log n) time',
      language: 'java',
      code: `int[][] merge(int[][] intervals) {
    if (intervals.length == 0) return new int[0][];

    Arrays.sort(intervals, Comparator.comparingInt(x -> x[0]));
    List<int[]> merged = new ArrayList<>();

    for (int[] interval : intervals) {
        int[] last = merged.isEmpty() ? null : merged.get(merged.size() - 1);

        if (last != null && interval[0] <= last[1]) last[1] = Math.max(last[1], interval[1]);
        else merged.add(interval.clone());       // clone: we mutate last[1] above
    }
    return merged.toArray(new int[0][]);
}`,
    },
    insight: 'Sorting by start is what makes a single forward pass sufficient: nothing later can overlap anything but the current block.',
  },
  {
    slug: 'count-inversions',
    title: 'Count inversions',
    topic: 'sorting',
    pattern: 'divide-and-conquer',
    difficulty: 'Hard',
    statement: 'Count the pairs `(i, j)` with `i < j` and `a[i] > a[j]` — a measure of how unsorted the array is.',
    example: { input: '[2, 4, 1, 3, 5]', output: '3', note: '(2,1), (4,1), (4,3)' },
    hints: [
      'Checking every pair is quadratic.',
      'Merge sort already compares elements from the two halves.',
      'When you take an element from the right half, what does that tell you about the left?',
    ],
    bruteForce: { idea: 'Two nested loops counting the pairs out of order.', complexity: 'O(n²)' },
    optimal: {
      idea: 'Count during the merge. When an element from the right half is taken, every element still remaining in the left half forms an inversion with it.',
      complexity: 'O(n log n) time, O(n) space',
      language: 'java',
      code: `long countInversions(int[] a) {
    return sortAndCount(a, new int[a.length], 0, a.length - 1);
}

private long sortAndCount(int[] a, int[] buffer, int lo, int hi) {
    if (lo >= hi) return 0;

    int mid = lo + (hi - lo) / 2;
    long count = sortAndCount(a, buffer, lo, mid) + sortAndCount(a, buffer, mid + 1, hi);

    int i = lo, j = mid + 1, k = lo;

    while (i <= mid && j <= hi) {
        if (a[i] <= a[j]) {
            buffer[k++] = a[i++];
        } else {
            count += mid - i + 1;        // a[i..mid] are all greater than a[j]
            buffer[k++] = a[j++];
        }
    }

    while (i <= mid) buffer[k++] = a[i++];
    while (j <= hi) buffer[k++] = a[j++];
    System.arraycopy(buffer, lo, a, lo, hi - lo + 1);

    return count;
}`,
    },
    insight: 'Counting during a merge is a reusable idea: any question about pairs across a split can often ride along inside merge sort for free.',
  },
  {
    slug: 'largest-number',
    title: 'Largest number from concatenation',
    topic: 'sorting',
    pattern: 'greedy',
    difficulty: 'Medium',
    statement: 'Arrange an array of non-negative integers so that concatenating them produces the largest possible number.',
    example: { input: '[3, 30, 34, 5, 9]', output: '"9534330"' },
    hints: [
      'Sorting numerically gives the wrong answer — check 3 and 30.',
      'What actually matters is which order produces the bigger concatenation.',
      'Compare `a + b` against `b + a` as strings.',
      'What if the input is all zeroes?',
    ],
    bruteForce: { idea: 'Try every permutation and keep the largest concatenation.', complexity: 'O(n!)' },
    optimal: {
      idea: 'Sort with a comparator that compares the two possible concatenations directly. That ordering is transitive, so it is a valid comparator.',
      complexity: 'O(n log n · k) time',
      language: 'java',
      code: `String largestNumber(int[] a) {
    String[] parts = Arrays.stream(a).mapToObj(String::valueOf).toArray(String[]::new);

    // x before y when xy reads larger than yx — that ordering is transitive.
    Arrays.sort(parts, (x, y) -> (y + x).compareTo(x + y));

    if (parts[0].equals("0")) return "0";        // all zeroes, so avoid "000"
    return String.join("", parts);
}`,
    },
    insight: 'When the natural ordering is wrong, the fix is usually a comparator that encodes the real question — here, "which order reads larger".',
  },
];
