import { CourseLesson } from './course.model';

const KADANE: CourseLesson = {
  slug: 'kadanes-algorithm',
  title: "Kadane's algorithm",
  tagline:
    'The maximum sum you can get from a contiguous run — in one pass, by asking a single question at every element.',
  topic: 'dynamic-programming',
  minutes: 12,
  practice: ['max-subarray-sum', 'product-except-self', 'jump-game-ii'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'Walk the array once. At every element ask one question: **is the run I have been building still helping me, or would I be better off starting fresh here?** If the running sum has gone negative, throw it away. That is the whole algorithm.',
    },
    { kind: 'heading', text: 'The problem it solves' },
    {
      kind: 'para',
      text: 'Given an array that may contain negative numbers, find the largest sum of any contiguous block. For `[-2, 1, -3, 4, -1, 2, 1, -5, 4]` the answer is `6`, from `[4, -1, 2, 1]`.',
    },
    {
      kind: 'para',
      text: 'The brute force is to try every start and every end: `O(n^2)` pairs, each summed in `O(1)` if you are careful. Kadane does it in `O(n)` with two variables and no extra memory.',
    },
    { kind: 'heading', text: 'The insight' },
    {
      kind: 'callout',
      tone: 'key',
      text: 'The best subarray **ending at index i** is either the element alone, or the best subarray ending at `i - 1` extended by that element. Nothing else is possible, because the block has to be contiguous.',
    },
    {
      kind: 'para',
      text: 'Write that as a recurrence and the code falls out: `best(i) = max(nums[i], best(i - 1) + nums[i])`. The answer is the largest `best(i)` over all `i`. And since `best(i)` only ever needs `best(i - 1)`, one variable replaces the whole table.',
    },
    {
      kind: 'para',
      text: 'There is a second way to read the same line, which is the one most people remember: if the running sum ever drops below zero, it can only drag down whatever comes next, so reset it to zero and start again from the next element.',
    },
    {
      kind: 'diagram',
      art: `nums   -2    1   -3    4   -1    2    1   -5    4
run    -2    1   -2    4    3    5    6    1    5
              ^  reset       \\______________/
           start fresh        best block, sum 6
best   -2    1    1    4    4    5    6    6    6`,
      caption: 'The running sum resets whenever it would hurt; the best ever seen is kept separately.',
    },
    {
      kind: 'steps',
      items: [
        {
          title: 'Start with the first element',
          text: 'Set both `running` and `best` to `nums[0]`. Starting at zero is the classic bug — it breaks on an array that is entirely negative.',
        },
        {
          title: 'At each later element, choose',
          text: 'Either extend: `running + nums[i]`. Or restart: `nums[i]`. Take whichever is larger.',
        },
        {
          title: 'Record the best you have seen',
          text: 'After choosing, update `best = max(best, running)`. The best answer may well have ended long before the array did.',
        },
        {
          title: 'Return best',
          text: 'Not `running` — the run you are holding at the end is rarely the winner.',
        },
      ],
    },
    {
      kind: 'code',
      language: 'java',
      caption: 'Kadane: two variables, one pass.',
      source: `int maxSubarraySum(int[] nums) {
    int running = nums[0];
    int best = nums[0];

    for (int i = 1; i < nums.length; i++) {
        // Extend the run, or start a new one here — whichever is bigger.
        running = Math.max(nums[i], running + nums[i]);
        best = Math.max(best, running);
    }

    return best;
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def max_subarray_sum(nums: list[int]) -> int:
    running = best = nums[0]

    for value in nums[1:]:
        running = max(value, running + value)
        best = max(best, running)

    return best`,
    },
    { kind: 'heading', text: 'Recovering the subarray itself' },
    {
      kind: 'para',
      text: 'Interviewers often follow up with "and which block was it?". Track where the current run started: whenever you restart, the start moves to `i`; whenever you beat `best`, record the current start and end.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `int[] maxSubarrayRange(int[] nums) {
    int running = nums[0], best = nums[0];
    int start = 0, bestStart = 0, bestEnd = 0;

    for (int i = 1; i < nums.length; i++) {
        if (running + nums[i] < nums[i]) {
            running = nums[i];
            start = i;              // the old run was not worth keeping
        } else {
            running += nums[i];
        }

        if (running > best) {
            best = running;
            bestStart = start;
            bestEnd = i;
        }
    }

    return new int[] { bestStart, bestEnd, best };
}`,
    },
    {
      kind: 'table',
      caption: 'Cost, against the obvious alternatives.',
      headers: ['Approach', 'Time', 'Space', 'Note'],
      rows: [
        ['Every pair of endpoints, summed each time', 'O(n^3)', 'O(1)', 'What you write before thinking'],
        ['Every pair, running sum inside', 'O(n^2)', 'O(1)', 'Fine up to a few thousand elements'],
        ['Prefix sums + minimum prefix so far', 'O(n)', 'O(1)', 'Same idea in different clothes'],
        ["Kadane's algorithm", 'O(n)', 'O(1)', 'One pass, two variables'],
      ],
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Where people go wrong',
      text: 'Initialising `best = 0`. On `[-3, -1, -7]` that returns `0`, which is not a subarray sum at all unless the problem allows an empty block — read the statement, and if empty is allowed, say so explicitly in your code rather than by accident.',
    },
    {
      kind: 'para',
      text: 'Two variations worth knowing, because both appear constantly. **Maximum product** needs two running values, the largest and the smallest, because a negative times a negative flips the ranking. **Circular maximum sum** is the total minus the *minimum* subarray, with the all-negative case handled separately.',
    },
    {
      kind: 'check',
      question: 'Why can the answer never need to look further back than `best(i - 1)`?',
      answer:
        'Because the block must be contiguous. Any block ending at `i` that is longer than one element contains the block ending at `i - 1` immediately before it, so its sum is `best(i - 1) + nums[i]` at most. There is no third option to consider.',
    },
  ],
};

const SLIDING_WINDOW_FIXED: CourseLesson = {
  slug: 'sliding-window-fixed',
  title: 'Sliding window — fixed size',
  tagline: 'Every window of length k, in one pass, by adding one element and dropping one.',
  topic: 'sliding-window',
  minutes: 11,
  practice: ['max-in-each-window', 'subarray-sum-k', 'sliding-window-median'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'You need something about every block of exactly `k` elements. Rather than recompute each block from scratch, slide: **add the element entering on the right, remove the element leaving on the left.** The answer updates in `O(1)` instead of `O(k)`.',
    },
    {
      kind: 'visual',
      name: 'sliding-window',
      caption: 'The window moves one step at a time; only the two edges change.',
    },
    { kind: 'heading', text: 'The shape of the code' },
    {
      kind: 'para',
      text: 'Fixed windows are the easier half of the technique because the size never changes. The loop is always the same three lines: include `i`, and once the window is full, record the answer and then exclude `i - k + 1`.',
    },
    {
      kind: 'code',
      language: 'java',
      caption: 'Maximum sum of any k consecutive elements.',
      source: `int maxSumOfK(int[] nums, int k) {
    int sum = 0;
    int best = Integer.MIN_VALUE;

    for (int i = 0; i < nums.length; i++) {
        sum += nums[i];                 // the element entering on the right

        if (i >= k - 1) {
            best = Math.max(best, sum);
            sum -= nums[i - k + 1];     // the element leaving on the left
        }
    }

    return best;
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def max_sum_of_k(nums: list[int], k: int) -> int:
    window = sum(nums[:k])
    best = window

    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]
        best = max(best, window)

    return best`,
    },
    { kind: 'heading', text: 'When the answer is not a sum' },
    {
      kind: 'para',
      text: 'A sum is easy to undo: subtract. A maximum is not — if the element leaving was the maximum, you have no idea what the new maximum is. That is why "maximum in every window of size k" needs a structure that can give up its largest element cheaply.',
    },
    {
      kind: 'para',
      text: 'The standard answer is a **monotonic deque** holding indices whose values decrease from front to back. The front is always the current maximum; anything smaller than an arriving element can never be the answer again, so it is popped from the back.',
    },
    {
      kind: 'diagram',
      art: `nums = [1, 3, -1, -3, 5, 3, 6, 7]   k = 3

i=0  deque [0]            window not full
i=1  3 > 1, pop 0         deque [1]
i=2  deque [1, 2]         max = nums[1] = 3
i=3  deque [1, 2, 3]      max = nums[1] = 3
i=4  5 beats all, clear    deque [4]        max = 5
i=5  deque [4, 5]          max = 5
i=6  6 beats all, clear    deque [6]        max = 6
i=7  7 beats all, clear    deque [7]        max = 7`,
      caption: 'Indices leave the back when a bigger value arrives, and the front when it falls out of the window.',
    },
    {
      kind: 'code',
      language: 'java',
      caption: 'Maximum of every window, O(n) total — each index is pushed and popped once.',
      source: `int[] maxInEachWindow(int[] nums, int k) {
    Deque<Integer> deque = new ArrayDeque<>();   // indices, values decreasing
    int[] out = new int[nums.length - k + 1];

    for (int i = 0; i < nums.length; i++) {
        // Drop indices that have slid out of the window.
        while (!deque.isEmpty() && deque.peekFirst() <= i - k) deque.pollFirst();

        // Anything smaller than nums[i] can never be a maximum again.
        while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]) deque.pollLast();

        deque.addLast(i);
        if (i >= k - 1) out[i - k + 1] = nums[deque.peekFirst()];
    }

    return out;
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `from collections import deque


def max_in_each_window(nums: list[int], k: int) -> list[int]:
    window: deque[int] = deque()          # indices, values decreasing
    out: list[int] = []

    for i, value in enumerate(nums):
        while window and window[0] <= i - k:
            window.popleft()
        while window and nums[window[-1]] <= value:
            window.pop()

        window.append(i)
        if i >= k - 1:
            out.append(nums[window[0]])

    return out`,
    },
    {
      kind: 'table',
      headers: ['What the window must report', 'Structure', 'Per step'],
      rows: [
        ['Sum or average', 'Two integers', 'O(1)'],
        ['Count of something', 'Hash map of counts', 'O(1) average'],
        ['Maximum or minimum', 'Monotonic deque', 'O(1) amortised'],
        ['Median', 'Two heaps, or an ordered multiset', 'O(log k)'],
        ['Number of distinct values', 'Hash map plus a distinct counter', 'O(1) average'],
      ],
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Where people go wrong',
      text: 'Recording the answer before the window is full. Guard it with `if (i >= k - 1)`, and remember the output has `n - k + 1` entries, not `n`.',
    },
    {
      kind: 'check',
      question: 'Why is the deque solution O(n) when it contains two inner while loops?',
      answer:
        'Because every index enters the deque exactly once and leaves exactly once. The inner loops can be long on a single step, but across the whole run they do at most `2n` operations in total — the classic amortised argument.',
    },
  ],
};

const SLIDING_WINDOW_VARIABLE: CourseLesson = {
  slug: 'sliding-window-variable',
  title: 'Sliding window — variable size',
  tagline: 'Grow while you can, shrink while you must. The template behind dozens of problems.',
  topic: 'sliding-window',
  minutes: 13,
  practice: [
    'longest-unique-substring',
    'at-most-k-distinct',
    'min-size-subarray-sum',
    'min-window-substring',
  ],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'The window has no fixed length. The right edge always moves forward. The left edge moves forward **only when the window has become invalid** — and because neither edge ever goes backwards, the whole scan is linear even though it looks nested.',
    },
    { kind: 'heading', text: 'The one template' },
    {
      kind: 'para',
      text: 'Almost every variable-size window problem is this loop with a different definition of *valid*. Write the skeleton first, then fill in three holes: what you track, what makes the window invalid, and where you record the answer.',
    },
    {
      kind: 'code',
      language: 'pseudocode',
      caption: 'The template. Learn this shape, not the individual problems.',
      source: `left = 0
for right in 0 .. n-1:
    include nums[right] in the window state

    while window is invalid:
        remove nums[left] from the window state
        left = left + 1

    # Every window reaching this point is valid.
    record the answer (longest: right - left + 1)`,
    },
    {
      kind: 'callout',
      tone: 'key',
      text: 'For a **longest** answer, record *after* the shrink loop — the window is valid there. For a **shortest** answer, the shrink loop is where the valid windows are, so record *inside* it, just before moving the left edge.',
    },
    {
      kind: 'visual',
      name: 'sliding-window',
      caption: 'Right edge in, left edge out — the two edges only ever move forward.',
    },
    { kind: 'heading', text: 'Longest: no repeated characters' },
    {
      kind: 'para',
      text: 'Invalid means "a character appears twice". Track the last index of each character; when the arriving character was seen at or after `left`, jump `left` past it.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `int longestUniqueSubstring(String s) {
    Map<Character, Integer> lastSeen = new HashMap<>();
    int left = 0, best = 0;

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        Integer previous = lastSeen.get(c);

        // Only a repeat *inside* the window matters.
        if (previous != null && previous >= left) left = previous + 1;

        lastSeen.put(c, right);
        best = Math.max(best, right - left + 1);
    }

    return best;
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def longest_unique_substring(s: str) -> int:
    last_seen: dict[str, int] = {}
    left = best = 0

    for right, char in enumerate(s):
        if last_seen.get(char, -1) >= left:
            left = last_seen[char] + 1

        last_seen[char] = right
        best = max(best, right - left + 1)

    return best`,
    },
    { kind: 'heading', text: 'Shortest: smallest subarray with sum at least target' },
    {
      kind: 'para',
      text: 'Here the window is *valid* once the sum reaches the target, and the interesting windows are the small ones — so shrink greedily and record the length each time before stepping the left edge.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `int minSubarrayLen(int target, int[] nums) {
    int left = 0, sum = 0, best = Integer.MAX_VALUE;

    for (int right = 0; right < nums.length; right++) {
        sum += nums[right];

        while (sum >= target) {              // valid — try to make it smaller
            best = Math.min(best, right - left + 1);
            sum -= nums[left++];
        }
    }

    return best == Integer.MAX_VALUE ? 0 : best;
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def min_subarray_len(target: int, nums: list[int]) -> int:
    left = total = 0
    best = len(nums) + 1

    for right, value in enumerate(nums):
        total += value

        while total >= target:
            best = min(best, right - left + 1)
            total -= nums[left]
            left += 1

    return 0 if best > len(nums) else best`,
    },
    { kind: 'heading', text: 'Counting, not measuring' },
    {
      kind: 'para',
      text: '"How many subarrays have at most K distinct values?" is the same window with a different recording line: when the window `[left, right]` is valid, every subarray ending at `right` and starting anywhere in `[left, right]` is valid too, so add `right - left + 1`.',
    },
    {
      kind: 'para',
      text: 'And "exactly K" is the classic trick: `atMost(K) - atMost(K - 1)`. Two runs of the same function, no new code.',
    },
    {
      kind: 'table',
      headers: ['Question', 'Valid means', 'Record'],
      rows: [
        ['Longest without repeats', 'No character appears twice', 'After shrinking'],
        ['Longest with at most K distinct', 'distinct <= K', 'After shrinking'],
        ['Shortest with sum >= target', 'sum >= target', 'Inside the shrink loop'],
        ['Shortest covering all of t', 'Every required count met', 'Inside the shrink loop'],
        ['Count with at most K distinct', 'distinct <= K', 'Add right - left + 1'],
      ],
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Where people go wrong',
      text: 'Using a window when the array has negative numbers and the condition is about a sum. Growing the window no longer reliably grows the sum, so the shrink rule collapses. That problem wants **prefix sums with a hash map**, not a window.',
    },
    {
      kind: 'check',
      question: 'The loop has a `while` inside a `for`. Why is it still O(n)?',
      answer:
        'Because `left` only ever increases, and it can increase at most `n` times in total across the whole run. The two pointers together make at most `2n` moves, regardless of how the work is distributed between the loops.',
    },
  ],
};

const TWO_POINTERS: CourseLesson = {
  slug: 'two-pointers',
  title: 'Two pointers',
  tagline: 'Two indices, each moving in one direction only — and an O(n^2) search collapses to O(n).',
  topic: 'two-pointers',
  minutes: 12,
  practice: ['three-sum', 'container-most-water', 'sort-colours', 'trapping-rain-water'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'Put one index at each end of a sorted array. Look at the pair. If it is too small you can only help by moving the left index right; if it is too big, move the right index left. Each step **eliminates a whole row of possibilities**, which is why this is linear rather than quadratic.',
    },
    {
      kind: 'visual',
      name: 'two-pointers',
      caption: 'Each comparison rules out every pair involving the discarded element.',
    },
    { kind: 'heading', text: 'Why a step is safe' },
    {
      kind: 'para',
      text: 'This is the part worth being able to say out loud, because it is the proof. Suppose you are looking for a pair summing to `target` in a sorted array, and `nums[left] + nums[right] < target`. Then `nums[left]` paired with *anything* at or below `right` is also too small — `nums[right]` was the largest partner available. So no pair starting at `left` can work, and discarding `left` loses nothing.',
    },
    {
      kind: 'callout',
      tone: 'key',
      text: 'The pattern needs **monotonicity**: moving a pointer must change the quantity you are testing in a predictable direction. Sorting is the usual way to create it.',
    },
    {
      kind: 'code',
      language: 'java',
      caption: 'Opposite ends: the pair summing to target in a sorted array.',
      source: `int[] twoSumSorted(int[] nums, int target) {
    int left = 0, right = nums.length - 1;

    while (left < right) {
        int sum = nums[left] + nums[right];

        if (sum == target) return new int[] { left, right };
        if (sum < target) left++;       // need more — only the left can grow
        else right--;                   // need less
    }

    return new int[] { -1, -1 };
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def two_sum_sorted(nums: list[int], target: int) -> tuple[int, int]:
    left, right = 0, len(nums) - 1

    while left < right:
        total = nums[left] + nums[right]
        if total == target:
            return left, right
        if total < target:
            left += 1
        else:
            right -= 1

    return -1, -1`,
    },
    { kind: 'heading', text: 'The three families' },
    {
      kind: 'compare',
      columns: [
        {
          title: 'Opposite ends',
          points: [
            'Start at `0` and `n - 1`, walk inwards',
            'Needs a sorted array or a monotone quantity',
            'Pair sums, palindromes, container of most water',
          ],
        },
        {
          title: 'Same direction, read and write',
          points: [
            '`read` scans, `write` marks where the next keeper goes',
            'Nothing is sorted — you are filtering in place',
            'Remove duplicates, move zeroes, partition',
          ],
        },
        {
          title: 'Same direction, different speeds',
          points: [
            'One pointer advances per step, the other conditionally',
            'Merging, or the fast/slow cycle trick on a list',
            'Merge two sorted arrays, find the list midpoint',
          ],
        },
      ],
    },
    { kind: 'heading', text: 'Read and write: filtering in place' },
    {
      kind: 'para',
      text: 'The second family has no sorting and no shrinking window. One index reads every element; the other marks the end of the part you are keeping. It is the in-place `filter`, and it is the cheapest way to compact an array.',
    },
    {
      kind: 'code',
      language: 'java',
      caption: 'Remove duplicates from a sorted array, returning the new length.',
      source: `int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int write = 1;

    for (int read = 1; read < nums.length; read++) {
        if (nums[read] != nums[write - 1]) nums[write++] = nums[read];
    }

    return write;     // nums[0 .. write-1] holds the distinct values
}`,
    },
    { kind: 'heading', text: 'Three sum: a pointer pair inside a loop' },
    {
      kind: 'para',
      text: 'Most harder problems are a two-pointer scan wrapped in something. Fix the first number, then the rest is the sorted pair problem for `-nums[i]`. Sorting costs `O(n log n)`, the scan `O(n^2)` overall, and skipping equal values at both levels is what keeps the triples distinct.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> out = new ArrayList<>();

    for (int i = 0; i < nums.length - 2; i++) {
        if (nums[i] > 0) break;                          // sorted: no hope left
        if (i > 0 && nums[i] == nums[i - 1]) continue;    // same first number

        int left = i + 1, right = nums.length - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];

            if (sum < 0) left++;
            else if (sum > 0) right--;
            else {
                out.add(List.of(nums[i], nums[left], nums[right]));
                while (left < right && nums[left] == nums[left + 1]) left++;
                while (left < right && nums[right] == nums[right - 1]) right--;
                left++;
                right--;
            }
        }
    }

    return out;
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def three_sum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    out: list[list[int]] = []

    for i, first in enumerate(nums[:-2]):
        if first > 0:
            break
        if i and first == nums[i - 1]:
            continue

        left, right = i + 1, len(nums) - 1
        while left < right:
            total = first + nums[left] + nums[right]
            if total < 0:
                left += 1
            elif total > 0:
                right -= 1
            else:
                out.append([first, nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1

    return out`,
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Where people go wrong',
      text: 'Writing `while (left <= right)` when the two pointers must land on *different* elements. For a pair sum that would let an element pair with itself. Use `<` for pairs and `<=` only when a single remaining element still needs processing.',
    },
    {
      kind: 'check',
      question: 'Container of most water is not sorted, yet two pointers work. Why?',
      answer:
        'The monotone quantity is the width, not the values. Width only shrinks as the pointers close in, so the only way a later pair can beat the current one is with a taller line — which means moving the *shorter* of the two lines is always the safe step.',
    },
  ],
};

const PREFIX_SUMS: CourseLesson = {
  slug: 'prefix-sums',
  title: 'Prefix sums',
  tagline: 'Pay once up front, then answer any range-sum question in constant time.',
  topic: 'arrays',
  minutes: 12,
  practice: ['subarray-sum-k', 'product-except-self', 'range-sum-mutable'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'Store the running total up to every index. The sum of any range is then one subtraction: **everything up to the end, minus everything before the start.**',
    },
    {
      kind: 'visual',
      name: 'prefix-sum',
      caption: 'One pass builds the table; every range question afterwards is a subtraction.',
    },
    { kind: 'heading', text: 'Building it' },
    {
      kind: 'para',
      text: 'Use a table of length `n + 1` with `prefix[0] = 0`. The extra slot removes every boundary special-case: the sum of `nums[i .. j]` is exactly `prefix[j + 1] - prefix[i]`, including when `i` is `0`.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `int[] buildPrefix(int[] nums) {
    int[] prefix = new int[nums.length + 1];
    for (int i = 0; i < nums.length; i++) prefix[i + 1] = prefix[i] + nums[i];
    return prefix;
}

// Sum of nums[i..j] inclusive.
int rangeSum(int[] prefix, int i, int j) {
    return prefix[j + 1] - prefix[i];
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `from itertools import accumulate


def build_prefix(nums: list[int]) -> list[int]:
    return [0, *accumulate(nums)]


def range_sum(prefix: list[int], i: int, j: int) -> int:
    return prefix[j + 1] - prefix[i]`,
    },
    {
      kind: 'table',
      headers: ['', 'Build', 'One query', 'q queries'],
      rows: [
        ['Sum the range each time', '—', 'O(n)', 'O(q·n)'],
        ['Prefix sums', 'O(n)', 'O(1)', 'O(n + q)'],
        ['Prefix sums with updates', 'O(n)', 'O(1) read, O(n) update', 'Use a Fenwick tree instead'],
      ],
    },
    { kind: 'heading', text: 'The real power: counting subarrays' },
    {
      kind: 'para',
      text: 'The version that wins interviews is not range queries — it is this. A subarray `(i, j]` sums to `k` exactly when `prefix[j] - prefix[i] = k`, which rearranges to `prefix[i] = prefix[j] - k`. So scan once, and at each `j` ask a hash map how many earlier prefixes had the value `prefix[j] - k`.',
    },
    {
      kind: 'code',
      language: 'java',
      caption: 'Count subarrays summing to k — works with negatives, where a window cannot.',
      source: `int subarraysSumK(int[] nums, int k) {
    Map<Integer, Integer> seen = new HashMap<>();
    seen.put(0, 1);                     // the empty prefix, so full prefixes count

    int running = 0, count = 0;
    for (int value : nums) {
        running += value;
        count += seen.getOrDefault(running - k, 0);
        seen.merge(running, 1, Integer::sum);
    }

    return count;
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `from collections import defaultdict


def subarrays_sum_k(nums: list[int], k: int) -> int:
    seen: dict[int, int] = defaultdict(int)
    seen[0] = 1

    running = count = 0
    for value in nums:
        running += value
        count += seen[running - k]
        seen[running] += 1

    return count`,
    },
    {
      kind: 'diagram',
      art: `nums      3    4   7   2   -3   1   4   2      k = 7
prefix 0  3    7  14  16   13  14  18  20
                             ^
at prefix 13 we want an earlier prefix of 13 - 7 = 6  -> none
at prefix 14 we want 7   -> seen twice  -> two subarrays end here`,
      caption: 'Each prefix asks the map one question: how many earlier prefixes were exactly k smaller?',
    },
    { kind: 'heading', text: 'The relatives' },
    {
      kind: 'list',
      items: [
        '**Prefix XOR** — the same identity with XOR, since XOR is its own inverse: `xor(i..j) = pre[j+1] ^ pre[i]`.',
        '**Prefix product** — works until a zero appears; "product except self" uses a prefix pass and a suffix pass instead, avoiding division entirely.',
        '**Prefix counts** — one table per character gives "how many vowels in this range" in constant time.',
        '**2D prefix sums** — four lookups give the sum of any rectangle: `D - B - C + A`.',
        '**Difference arrays** — the inverse trick. To add `v` across many ranges, record `+v` at the start and `-v` past the end, then take one prefix pass at the end.',
      ],
    },
    {
      kind: 'code',
      language: 'java',
      caption: 'Difference array: many range updates, one final pass.',
      source: `int[] applyRangeAdds(int n, int[][] updates) {
    int[] diff = new int[n + 1];

    for (int[] update : updates) {          // { start, end, value }
        diff[update[0]] += update[2];
        diff[update[1] + 1] -= update[2];
    }

    int[] out = new int[n];
    int running = 0;
    for (int i = 0; i < n; i++) {
        running += diff[i];
        out[i] = running;
    }

    return out;
}`,
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Where people go wrong',
      text: 'Forgetting `seen.put(0, 1)` in the counting version. Without it you miss every subarray that starts at index 0 — and the bug is invisible on half the test cases, which makes it worse.',
    },
    {
      kind: 'callout',
      tone: 'why',
      title: 'Why this matters',
      text: 'Prefix sums are the first example of a pattern you will meet again and again: **precompute a cheap summary so that each later question is O(1)**. Segment trees, Fenwick trees and sparse tables are all the same bargain at higher prices.',
    },
    {
      kind: 'check',
      question: 'Why does the counting trick handle negative numbers when a sliding window does not?',
      answer:
        'A window relies on the sum growing as the window grows. With negatives that is false, so there is no rule for when to shrink. The prefix identity makes no monotonicity assumption at all — it is pure arithmetic on values you have already seen.',
    },
  ],
};

export const ARRAY_LESSONS: CourseLesson[] = [
  KADANE,
  SLIDING_WINDOW_FIXED,
  SLIDING_WINDOW_VARIABLE,
  TWO_POINTERS,
  PREFIX_SUMS,
];
