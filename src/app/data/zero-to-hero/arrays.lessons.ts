import { CourseLesson } from '../course/course.model';
import { code, walkthrough } from './build';

const TWO_POINTERS: CourseLesson = {
  slug: 'two-pointers',
  title: 'Two pointers',
  tagline:
    'One finger at each end of a sorted array. Every comparison tells you which finger to move, and no finger ever comes back.',
  topic: 'two-pointers',
  pattern: 'two-pointers',
  minutes: 15,
  practice: [
    'reverse-array-in-place',
    'three-sum',
    'container-most-water',
    'sort-colours',
    'valid-palindrome-one-delete',
    'longest-palindromic-substring',
    'trapping-rain-water',
  ],
  blocks: walkthrough({
    plain:
      'Put one finger on the smallest number and one on the largest. Their sum tells you which number can never be part of the answer, so you drop it and move that finger inward. One pass replaces two nested loops.',
    problem:
      'Given an array sorted in increasing order and a target, return the positions of two different numbers that add up to the target, or `[-1, -1]` if no pair does. Any one valid pair is fine.',
    example: '`[1, 3, 4, 6, 9]`, target `9` → `[1, 3]`, because `3 + 6 = 9`.',
    understand: [
      '**Input:** a sorted array and a target. **Output:** two positions, or `[-1, -1]`.',
      'The two numbers must sit at different positions: `5 + 5` only counts if `5` appears twice.',
      'Any valid pair is accepted, so we can stop at the first one we find.',
      '**Sorted** is a big clue. Whenever the input is sorted, ask: what does that let me skip?',
    ],
    byHand: [
      {
        kind: 'para',
        text: 'Start with the smallest and the largest number, and let each sum tell you what to throw away:',
      },
      {
        kind: 'table',
        headers: ['Smallest', 'Largest', 'Sum', 'What it tells me'],
        rows: [
          ['`1`', '`9`', '`10`', 'Too big. 9 is too big even with the smallest partner, so 9 can never work. Drop 9.'],
          ['`1`', '`6`', '`7`', 'Too small. 1 is too small even with the largest partner left. Drop 1.'],
          ['`3`', '`6`', '`9`', 'Found it: positions 1 and 3.'],
        ],
      },
    ],
    rule:
      'Look at the smallest and largest remaining numbers: if their sum is too small, drop the smallest; if it is too big, drop the largest; if it is equal, you are done.',
    brute: {
      idea: 'Try every pair: each number with every number after it. It ignores the fact that the array is sorted, which is exactly why it is slow.',
      java: `int[] pairSumBrute(int[] nums, int target) {
    // Every first number...
    for (int i = 0; i < nums.length; i++) {
        // ...with every number after it, so no pair is tried twice.
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] == target) {
                return new int[] { i, j };
            }
        }
    }
    // No pair adds up to the target.
    return new int[] { -1, -1 };
}`,
      python: `def pair_sum_brute(nums: list[int], target: int) -> list[int]:
    # Every first number...
    for i in range(len(nums)):
        # ...with every number after it, so no pair is tried twice.
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    # No pair adds up to the target.
    return [-1, -1]`,
      cost: '`O(n²)` time: about `n × n / 2` pairs.',
    },
    repeated:
      'For the number `1`, the brute force tries `1 + 3`, `1 + 4`, `1 + 6`, `1 + 9` one at a time. But the array is sorted: if `1 + 9` (its largest possible partner) is too small, then `1 +` anything is too small. **One comparison rules out a whole row of pairs.** Each step drops one number for good, so at most `n` steps are needed.',
    better: {
      idea: 'Two indices, `left` and `right`, start at the two ends and only ever move towards each other.',
      java: `int[] pairSum(int[] nums, int target) {
    // left starts on the smallest number, right on the largest.
    int left = 0;
    int right = nums.length - 1;

    // left < right keeps the two positions different.
    // When they meet, every number has been ruled out.
    while (left < right) {
        // The pair under our two fingers.
        int sum = nums[left] + nums[right];

        if (sum == target) {
            // Found a pair: report both positions.
            return new int[] { left, right };
        } else if (sum < target) {
            // Too small even with the largest partner still available,
            // so nums[left] can never be in the answer. Drop it.
            left++;
        } else {
            // Too big even with the smallest partner still available,
            // so nums[right] can never be in the answer. Drop it.
            right--;
        }
    }

    // The fingers met: no pair exists.
    return new int[] { -1, -1 };
}`,
      python: `def pair_sum(nums: list[int], target: int) -> list[int]:
    # left starts on the smallest number, right on the largest.
    left, right = 0, len(nums) - 1

    # left < right keeps the two positions different.
    # When they meet, every number has been ruled out.
    while left < right:
        # The pair under our two fingers.
        total = nums[left] + nums[right]

        if total == target:
            # Found a pair: report both positions.
            return [left, right]
        elif total < target:
            # Too small even with the largest partner still available,
            # so nums[left] can never be in the answer. Drop it.
            left += 1
        else:
            # Too big even with the smallest partner still available,
            # so nums[right] can never be in the answer. Drop it.
            right -= 1

    # The fingers met: no pair exists.
    return [-1, -1]`,
      cost: '`O(n)` time, because each step moves one finger and they can only move `n` times in total. `O(1)` extra memory.',
    },
    dryRun: {
      headers: ['Turn', '`left`', '`right`', 'Sum', 'Action'],
      rows: [
        ['1', '0 (`1`)', '4 (`9`)', '10', 'too big → `right--`'],
        ['2', '0 (`1`)', '3 (`6`)', '7', 'too small → `left++`'],
        ['3', '1 (`3`)', '3 (`6`)', '9', 'equal → return `[1, 3]`'],
      ],
    },
    trap: 'Two pointers only works because the array is **sorted**: on unsorted data, a sum that is too small says nothing about which number to drop. Sort first (if positions do not matter), or use a hash map, which is the next pattern but one. And use `left < right`, not `<=`, or a number may pair with itself.',
    signals: [
      'The array is **sorted**, or you are allowed to sort it.',
      'Find a **pair** or **triplet** with a given sum or difference.',
      'Compare things **from both ends**: palindromes, reversing, containers.',
      'Rearrange **in place** with only O(1) extra memory.',
    ],
    check: {
      question: 'Why may we drop the left number when the sum is too small, but not when it is too big?',
      answer: 'Too small means even the largest partner available (at `right`) is not enough, so **every** pair using `left` is too small. Too big says nothing bad about `left`: it is `right` that is too large even with the smallest partner, so that is the number to drop.',
    },
  }),
};

const SLIDING_WINDOW: CourseLesson = {
  slug: 'sliding-window',
  title: 'Sliding window',
  tagline:
    'When a problem is about consecutive blocks, do not rebuild each block from scratch. Slide one window: add what enters, remove what leaves.',
  topic: 'sliding-window',
  pattern: 'sliding-window',
  minutes: 17,
  practice: ['min-size-subarray-sum', 'longest-unique-substring', 'at-most-k-distinct', 'min-window-substring'],
  blocks: walkthrough({
    plain:
      'Neighbouring blocks of an array share almost all their elements. So instead of summing each block again, keep one running "window" and update it as it slides: one element comes in on the right, one goes out on the left.',
    problem: 'Given an array and a number `k`, return the largest sum of any `k` consecutive elements.',
    example: '`[2, 1, 5, 1, 3, 2]`, `k = 3` → `9`, from the block `5, 1, 3`.',
    understand: [
      '**Input:** an array and a block size `k`. **Output:** one number, the best sum.',
      '**Consecutive** means neighbours: `2, 5, 3` is not a block, because they are not next to each other.',
      'We assume `1 ≤ k ≤ length`, so at least one block exists.',
      'Numbers can be negative, so the best sum can be negative too.',
    ],
    byHand: [
      { kind: 'para', text: 'List every block of 3 and its sum:' },
      {
        kind: 'table',
        headers: ['Block', 'Sum', 'How I really got it'],
        rows: [
          ['`2, 1, 5`', '8', 'added three numbers'],
          ['`1, 5, 1`', '7', '8, minus the 2 that left, plus the 1 that came in'],
          ['`5, 1, 3`', '**9**', '7 − 1 + 3'],
          ['`1, 3, 2`', '6', '9 − 5 + 2'],
        ],
      },
      {
        kind: 'para',
        text: 'After the first block, you never added three numbers again. You took the previous sum and adjusted it. That shortcut is the whole pattern.',
      },
    ],
    rule:
      'Sum the first `k` elements; then slide one step at a time, adding the element that enters and subtracting the one that leaves, and keep the best sum seen.',
    brute: {
      idea: 'For every starting position, add up the `k` elements of that block from scratch.',
      java: `int maxWindowSumBrute(int[] nums, int k) {
    int best = Integer.MIN_VALUE;
    // Every possible start of a block of k elements.
    for (int start = 0; start + k <= nums.length; start++) {
        // Add up this block from scratch.
        int sum = 0;
        for (int i = start; i < start + k; i++) {
            sum += nums[i];
        }
        best = Math.max(best, sum);
    }
    return best;
}`,
      python: `def max_window_sum_brute(nums: list[int], k: int) -> int:
    best = float("-inf")
    # Every possible start of a block of k elements.
    for start in range(len(nums) - k + 1):
        # Add up this block from scratch.
        total = 0
        for i in range(start, start + k):
            total += nums[i]
        best = max(best, total)
    return best`,
      cost: '`O(n × k)` time. With `n = 100,000` and `k = 50,000`, that is billions of additions.',
    },
    repeated:
      'Two neighbouring blocks share `k − 1` elements, and the brute force adds those shared elements again for every block. Only **two** numbers differ between one block and the next: the one entering and the one leaving.',
    better: {
      idea: 'Build the first window once, then slide it to the end, adjusting by two numbers per step.',
      java: `int maxWindowSum(int[] nums, int k) {
    // The first window: positions 0 to k - 1, added up once.
    int window = 0;
    for (int i = 0; i < k; i++) {
        window += nums[i];
    }

    // It is the only window seen so far, so it is the best so far.
    int best = window;

    // Slide right one step at a time. At step i, nums[i] enters the window...
    for (int i = k; i < nums.length; i++) {
        // ...and nums[i - k], which is now k places behind, leaves it.
        window += nums[i] - nums[i - k];
        // The window only changes; the best is remembered separately.
        best = Math.max(best, window);
    }

    return best;
}`,
      python: `def max_window_sum(nums: list[int], k: int) -> int:
    # The first window: positions 0 to k - 1, added up once.
    window = sum(nums[:k])

    # It is the only window seen so far, so it is the best so far.
    best = window

    # Slide right one step at a time. At step i, nums[i] enters the window...
    for i in range(k, len(nums)):
        # ...and nums[i - k], which is now k places behind, leaves it.
        window += nums[i] - nums[i - k]
        # The window only changes; the best is remembered separately.
        best = max(best, window)

    return best`,
      cost: '`O(n)` time: every element enters once and leaves once. `O(1)` extra memory.',
    },
    dryRun: {
      headers: ['`i`', 'Enters', 'Leaves (`i − k`)', '`window`', '`best`'],
      rows: [
        ['start', '—', '—', '8', '8'],
        ['3', '`1`', '`2`', '7', '8'],
        ['4', '`3`', '`1`', '9', '9'],
        ['5', '`2`', '`5`', '6', '9'],
      ],
    },
    extra: [
      { kind: 'heading', text: 'When the window size is not fixed' },
      {
        kind: 'para',
        text: 'Many problems ask for the **longest** or **shortest** block that obeys a rule, such as "no repeated characters". Then the window grows on the right while the rule holds, and shrinks from the left when it breaks. Example: the length of the longest substring with no repeated character. In `"abcabcbb"` it is `3` (`"abc"`).',
      },
      ...code(
        `int longestUniqueRun(String s) {
    // The characters currently inside the window s[left..right].
    Set<Character> inWindow = new HashSet<>();
    int left = 0;
    int best = 0;

    // right walks forward: each turn, one new character tries to join.
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);

        // c is already inside, so adding it would break "no repeats".
        // Shrink from the left until the old copy of c has gone.
        while (inWindow.contains(c)) {
            inWindow.remove(s.charAt(left));
            left++;
        }

        // Now c can join safely.
        inWindow.add(c);
        // The window holds right - left + 1 characters, all different.
        best = Math.max(best, right - left + 1);
    }

    return best;
}`,
        `def longest_unique_run(s: str) -> int:
    # The characters currently inside the window s[left..right].
    in_window = set()
    left = 0
    best = 0

    # right walks forward: each turn, one new character tries to join.
    for right, c in enumerate(s):
        # c is already inside, so adding it would break "no repeats".
        # Shrink from the left until the old copy of c has gone.
        while c in in_window:
            in_window.remove(s[left])
            left += 1

        # Now c can join safely.
        in_window.add(c)
        # The window holds right - left + 1 characters, all different.
        best = max(best, right - left + 1)

    return best`,
        'A window that grows and shrinks.',
      ),
      {
        kind: 'para',
        text: 'The inner `while` looks like a nested loop, but `left` only ever moves forward. Across the whole run, each character joins once and leaves at most once, so this is still `O(n)`.',
      },
    ],
    trap: 'Off by one on the element that leaves: when `nums[i]` enters a window of size `k`, the one leaving is `nums[i - k]`, not `nums[i - k + 1]`. Dry-run the first slide to be sure. And keep `best` separate from `window`, because the last window is rarely the best one.',
    signals: [
      '**Consecutive** elements: a **subarray** or **substring** (not a subsequence).',
      'Every window of a **fixed size `k`**.',
      'The **longest** or **shortest** block that satisfies a rule.',
      '"At most k distinct", "no repeats", "sum at least S".',
    ],
    check: {
      question: 'Shortest block with sum at least `S`, all numbers positive: when does the window grow, and when does it shrink?',
      answer: 'Grow on the right until the sum reaches `S`. Then record the length and shrink from the left while the sum is still at least `S`, recording each time. Positive numbers make this safe: adding always raises the sum, removing always lowers it.',
    },
  }),
};

const PREFIX_SUM: CourseLesson = {
  slug: 'prefix-sum',
  title: 'Prefix sums',
  tagline:
    'Asked for the sum of many different ranges? Add everything up once, keeping running totals. Then every range is one subtraction.',
  topic: 'arrays',
  pattern: 'prefix-sum',
  minutes: 14,
  practice: ['subarray-sum-k', 'product-except-self', 'range-sum-mutable', 'amortised-append'],
  blocks: walkthrough({
    plain:
      'Write the running total under each position of the array. The sum of any range is then "total up to the end of the range" minus "total before its start". Building the totals costs one pass; every question after that costs one subtraction.',
    problem:
      'Given an array and many queries `(l, r)`, answer each query with the sum of the elements from position `l` to position `r`, both included.',
    example: '`[3, 1, 4, 1, 5, 9]` with queries `(1, 3)`, `(0, 5)`, `(4, 4)` → `[6, 23, 5]`.',
    understand: [
      '**Input:** an array and a list of queries. **Output:** one sum per query.',
      'Both ends are included: `(1, 3)` means positions 1, 2 and 3.',
      'The array never changes between queries.',
      'There may be **many** queries, maybe a million, so the cost per query is what matters.',
    ],
    byHand: [
      { kind: 'para', text: 'Write the running totals under the array, with a 0 in front for "nothing added yet":' },
      {
        kind: 'diagram',
        art: `position        0    1    2    3    4    5
nums            3    1    4    1    5    9
prefix     0    3    4    8    9   14   23
           ^ before anything`,
        caption: 'prefix[i] is the total of the first i numbers.',
      },
      {
        kind: 'para',
        text: 'Sum of positions 1 to 3 = (total of the first 4 numbers) − (total of the first 1) = `9 − 3 = 6`. Check: `1 + 4 + 1 = 6`. Every query is now one subtraction.',
      },
    ],
    rule:
      'Store the running total before every position; the sum from `l` to `r` is the total up to `r` minus the total before `l`.',
    brute: {
      idea: 'Answer each query by adding up its range with a loop.',
      java: `int[] rangeSumsBrute(int[] nums, int[][] queries) {
    int[] answers = new int[queries.length];
    for (int q = 0; q < queries.length; q++) {
        // Walk the range of this query and add it up.
        int sum = 0;
        for (int i = queries[q][0]; i <= queries[q][1]; i++) {
            sum += nums[i];
        }
        answers[q] = sum;
    }
    return answers;
}`,
      python: `def range_sums_brute(nums: list[int], queries: list[tuple[int, int]]) -> list[int]:
    answers = []
    for l, r in queries:
        # Walk the range of this query and add it up.
        total = 0
        for i in range(l, r + 1):
            total += nums[i]
        answers.append(total)
    return answers`,
      cost: '`O(n)` per query, so `O(n × q)` in total. A million queries on a long array is far too slow.',
    },
    repeated:
      'Different queries overlap, and each one re-adds numbers that earlier queries already added. The running totals do all of that adding **once**, and every query reuses it.',
    better: {
      idea: 'Build `prefix`, one longer than the array, then answer each query with one subtraction.',
      java: `int[] rangeSums(int[] nums, int[][] queries) {
    // prefix[i] = total of the first i numbers. One longer than nums,
    // so that prefix[0] = 0 can stand for "nothing added yet".
    int[] prefix = new int[nums.length + 1];
    for (int i = 0; i < nums.length; i++) {
        // Total of the first i + 1 numbers = total of the first i, plus nums[i].
        prefix[i + 1] = prefix[i] + nums[i];
    }

    int[] answers = new int[queries.length];
    for (int q = 0; q < queries.length; q++) {
        int l = queries[q][0];
        int r = queries[q][1];
        // (total of the first r + 1 numbers) minus (total of the first l)
        // leaves exactly positions l to r.
        answers[q] = prefix[r + 1] - prefix[l];
    }
    return answers;
}`,
      python: `def range_sums(nums: list[int], queries: list[tuple[int, int]]) -> list[int]:
    # prefix[i] = total of the first i numbers. One longer than nums,
    # so that prefix[0] = 0 can stand for "nothing added yet".
    prefix = [0] * (len(nums) + 1)
    for i in range(len(nums)):
        # Total of the first i + 1 numbers = total of the first i, plus nums[i].
        prefix[i + 1] = prefix[i] + nums[i]

    answers = []
    for l, r in queries:
        # (total of the first r + 1 numbers) minus (total of the first l)
        # leaves exactly positions l to r.
        answers.append(prefix[r + 1] - prefix[l])
    return answers`,
      cost: '`O(n)` once to build, then `O(1)` per query: `O(n + q)` in total.',
    },
    dryRun: {
      headers: ['Query', '`prefix[r + 1]`', '`prefix[l]`', 'Answer'],
      rows: [
        ['`(1, 3)`', '`prefix[4]` = 9', '`prefix[1]` = 3', '6'],
        ['`(0, 5)`', '`prefix[6]` = 23', '`prefix[0]` = 0', '23'],
        ['`(4, 4)`', '`prefix[5]` = 14', '`prefix[4]` = 9', '5'],
      ],
    },
    trap: 'Off by one between the two arrays: with `prefix` one longer than `nums`, the sum of `l..r` is `prefix[r + 1] - prefix[l]`. Writing `prefix[r] - prefix[l]` silently drops `nums[r]`. In Java, also use `long` when the totals can pass about 2 billion.',
    signals: [
      '**Many** range-sum questions on an array that does not change.',
      '"Sum of the elements between `i` and `j`."',
      '**Count subarrays** whose sum is exactly `k` (prefix sums plus a hash map).',
      'Product of everything except the current element (prefix and suffix products).',
    ],
    check: {
      question: 'How would prefix sums help count the subarrays whose sum is exactly `k`?',
      answer: 'A block `l..r` sums to `k` exactly when `prefix[r + 1] − prefix[l] = k`, that is when an earlier running total equals `current total − k`. Walk once, keep a hash map from each running total to how many times it has appeared, and at each step add the count stored for `current − k`.',
    },
  }),
};

const DIFFERENCE_ARRAY: CourseLesson = {
  slug: 'difference-array',
  title: 'Difference arrays',
  tagline:
    'The mirror image of prefix sums. To add a value to a whole range many times, mark only where each change starts and stops.',
  topic: 'arrays',
  pattern: 'difference-array',
  minutes: 13,
  practice: [],
  blocks: walkthrough({
    plain:
      'An update "add 2 to positions 1 to 3" only changes the array in two places if you look at it the right way: it starts adding at 1 and stops after 3. Record those two marks per update, then one running total turns all the marks into the final array.',
    problem:
      'Start with an array of `n` zeros. Apply many updates `(l, r, v)`, each adding `v` to every position from `l` to `r`, both included. Return the final array.',
    example: '`n = 5`, updates `(1, 3, 2)` and `(2, 4, 3)` → `[0, 2, 5, 5, 3]`.',
    understand: [
      '**Input:** a length `n` and a list of updates. **Output:** the final array.',
      'Both ends of each range are included.',
      'All the updates come first; we only need the array at the end.',
      'There may be 100,000 updates, each covering most of the array.',
    ],
    byHand: [
      {
        kind: 'para',
        text: 'Think of a bus route with stops 0 to 4. The first update is 2 passengers getting on at stop 1 and off after stop 3. The second is 3 getting on at stop 2 and staying to the end. Write down only the boardings (+) and leavings (−):',
      },
      {
        kind: 'table',
        headers: ['Stop', 'Marks written', 'Passengers on board (running total)'],
        rows: [
          ['0', '—', '0'],
          ['1', '+2', '2'],
          ['2', '+3', '5'],
          ['3', '—', '5'],
          ['4', '−2 (the first group left after stop 3)', '3'],
        ],
      },
    ],
    rule:
      'For each update, add `v` where the range starts and subtract `v` just after it ends; a running total over these marks gives the final values.',
    brute: {
      idea: 'Apply each update directly, walking its whole range.',
      java: `int[] applyUpdatesBrute(int n, int[][] updates) {
    int[] result = new int[n];
    for (int[] u : updates) {
        // Walk the whole range of this update and add v to each position.
        for (int i = u[0]; i <= u[1]; i++) {
            result[i] += u[2];
        }
    }
    return result;
}`,
      python: `def apply_updates_brute(n: int, updates: list[tuple[int, int, int]]) -> list[int]:
    result = [0] * n
    for l, r, v in updates:
        # Walk the whole range of this update and add v to each position.
        for i in range(l, r + 1):
            result[i] += v
    return result`,
      cost: '`O(n)` per update, `O(n × u)` in total.',
    },
    repeated:
      'Every update walks its whole range, and the same positions get walked over and over. But an update only changes the array\'s **slope** at two places: where it starts and just after it ends. Record those two places and do the walking once, at the end.',
    better: {
      idea: 'Keep a "marks" array one longer than `n`, write two marks per update, then take a running total.',
      java: `int[] applyUpdates(int n, int[][] updates) {
    // marks[i] = how much the running total changes at position i.
    // One extra slot, because "stop after r" lands on r + 1, which can be n.
    int[] marks = new int[n + 1];
    for (int[] u : updates) {
        int l = u[0], r = u[1], v = u[2];
        // From position l onwards, everything is v higher...
        marks[l] += v;
        // ...until just after r, where that extra v stops.
        marks[r + 1] -= v;
    }

    // Walk once, carrying the running total: it is the value at each position.
    int[] result = new int[n];
    int running = 0;
    for (int i = 0; i < n; i++) {
        running += marks[i];
        result[i] = running;
    }
    return result;
}`,
      python: `def apply_updates(n: int, updates: list[tuple[int, int, int]]) -> list[int]:
    # marks[i] = how much the running total changes at position i.
    # One extra slot, because "stop after r" lands on r + 1, which can be n.
    marks = [0] * (n + 1)
    for l, r, v in updates:
        # From position l onwards, everything is v higher...
        marks[l] += v
        # ...until just after r, where that extra v stops.
        marks[r + 1] -= v

    # Walk once, carrying the running total: it is the value at each position.
    result = [0] * n
    running = 0
    for i in range(n):
        running += marks[i]
        result[i] = running
    return result`,
      cost: '`O(1)` per update plus one `O(n)` pass at the end: `O(n + u)`.',
    },
    dryRun: {
      headers: ['`i`', '`marks[i]`', '`running`', '`result[i]`'],
      rows: [
        ['0', '0', '0', '0'],
        ['1', '+2', '2', '2'],
        ['2', '+3', '5', '5'],
        ['3', '0', '5', '5'],
        ['4', '−2', '3', '3'],
      ],
      caption: 'marks = [0, 2, 3, 0, −2, −3]. The −3 at position 5 is past the end and never read.',
    },
    trap: 'The "stop" mark goes at `r + 1`, which is past the end of the array when `r = n − 1`. Make the marks array one longer than `n`, or skip the mark when `r + 1 == n`. Forgetting this crashes on the very updates that touch the last position.',
    signals: [
      'Add a value to **every element of a range**, many times over.',
      'Bookings, flights, or shifts that cover a span of days, followed by totals per day.',
      'All updates come first, and all questions after.',
    ],
    check: {
      question: 'A car with `C` seats makes trips `(passengers, from, to)`. How would you check whether it can do them all?',
      answer: 'Mark `+passengers` at `from` and `−passengers` at `to` (they get off there), take a running total along the road, and check it never goes above `C`. That is this lesson with the question "is any value too big?" at the end.',
    },
  }),
};

const HASH_LOOKUP: CourseLesson = {
  slug: 'hash-lookup',
  title: 'Hash lookup',
  tagline:
    'Whenever you catch yourself searching for "have I seen X?", stop searching and remember instead. A hash map answers in one step.',
  topic: 'hashing',
  pattern: 'hashing',
  minutes: 14,
  practice: ['two-sum', 'longest-consecutive', 'valid-sudoku', 'lru-cache'],
  blocks: walkthrough({
    plain:
      'A hash map is a memory with instant lookup: give it a key, get back what you stored, in one step on average. Any time a nested loop is really asking "where is X?", a hash map can replace the inner loop.',
    problem:
      'Given an unsorted array and a target, return the positions of the two numbers that add up to the target. Exactly one such pair exists, and the same element cannot be used twice.',
    example: '`[2, 7, 11, 15]`, target `9` → `[0, 1]`, because `2 + 7 = 9`.',
    understand: [
      '**Input:** an unsorted array and a target. **Output:** two positions.',
      'Exactly one answer exists, so there is no "not found" case.',
      'The same element cannot be used twice: `[3, 5]` with target 6 must not answer `[0, 0]`.',
      'We return **positions**, so sorting the array would scramble the answer.',
    ],
    byHand: [
      {
        kind: 'para',
        text: 'Read left to right. At each number, ask: "which partner would I need?" and check your memory:',
      },
      {
        kind: 'table',
        headers: ['Position', 'Number', 'Partner needed (9 − number)', 'Have I seen it?', 'Then'],
        rows: [
          ['0', '`2`', '`7`', 'no', 'remember 2 is at 0'],
          ['1', '`7`', '`2`', '**yes**, at 0', 'answer `[0, 1]`'],
        ],
      },
    ],
    rule:
      'For each number, work out the partner it needs and check whether that partner is already remembered; if not, remember this number with its position.',
    brute: {
      idea: 'Try every pair, exactly as in the first lesson.',
      java: `int[] twoSumBrute(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        // The inner loop is a search: "is target - nums[i] anywhere after i?"
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] == target) {
                return new int[] { i, j };
            }
        }
    }
    return new int[] { -1, -1 };
}`,
      python: `def two_sum_brute(nums: list[int], target: int) -> list[int]:
    for i in range(len(nums)):
        # The inner loop is a search: "is target - nums[i] anywhere after i?"
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return [-1, -1]`,
      cost: '`O(n²)` time.',
    },
    repeated:
      'The inner loop **searches** for the partner, and it searches the same values again for every `i`. Searching is the repeated work. If every number seen so far is stored in a hash map (value → position), each search becomes a single lookup.',
    better: {
      idea: 'One pass. A map from each value already seen to its position.',
      java: `int[] twoSum(int[] nums, int target) {
    // value -> the position where we saw it.
    Map<Integer, Integer> seenAt = new HashMap<>();

    for (int i = 0; i < nums.length; i++) {
        // The one number that would complete a pair with nums[i].
        int partner = target - nums[i];

        // Check memory BEFORE storing nums[i], so it cannot pair with itself.
        if (seenAt.containsKey(partner)) {
            // The partner came earlier, so its position goes first.
            return new int[] { seenAt.get(partner), i };
        }

        // No partner yet: remember this number for the ones still to come.
        seenAt.put(nums[i], i);
    }

    // The problem promises an answer, so we never get here.
    return new int[] { -1, -1 };
}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    # value -> the position where we saw it.
    seen_at = {}

    for i, value in enumerate(nums):
        # The one number that would complete a pair with value.
        partner = target - value

        # Check memory BEFORE storing value, so it cannot pair with itself.
        if partner in seen_at:
            # The partner came earlier, so its position goes first.
            return [seen_at[partner], i]

        # No partner yet: remember this number for the ones still to come.
        seen_at[value] = i

    # The problem promises an answer, so we never get here.
    return [-1, -1]`,
      cost: '`O(n)` time on average, plus `O(n)` memory for the map.',
    },
    dryRun: {
      headers: ['`i`', '`nums[i]`', '`partner`', '`seenAt` before', 'Action'],
      rows: [
        ['0', '2', '7', '`{}`', 'not found → store `2 → 0`'],
        ['1', '7', '2', '`{2: 0}`', 'found → return `[0, 1]`'],
      ],
    },
    trap: 'Storing the current number **before** checking for its partner. With `[3, 5]` and target 6, the 3 is stored, then its partner 3 is "found": the 3 pairs with itself. Always check first, then store.',
    signals: [
      '"Have I seen this before?" or "where did I see X?"',
      'A **pair** with a given sum or difference, in **unsorted** data.',
      'Count or group things by a key.',
      'You need constant-time lookups where a nested loop would search.',
    ],
    check: {
      question: 'Why not sort the array and use two pointers here?',
      answer: 'Sorting costs `O(n log n)` and moves the numbers, so the original positions are lost unless you carry them along. The hash map is `O(n)` and keeps the positions for free. If only the values were wanted, sorting plus two pointers would also work, with `O(1)` extra memory.',
    },
  }),
};

const FREQUENCY: CourseLesson = {
  slug: 'frequency-counting',
  title: 'Frequency counting',
  tagline:
    'Many questions depend only on how many times each value occurs, not where. Count once, then answer from the counts.',
  topic: 'hashing',
  pattern: 'frequency-counting',
  minutes: 13,
  practice: ['group-anagrams', 'top-k-frequent', 'count-primes'],
  blocks: walkthrough({
    plain:
      'Make a tally: for every value, how many times does it appear? One pass builds it. Then questions like "same letters?", "most common?" or "appears exactly twice?" are answered by reading the tally instead of re-scanning the data.',
    problem:
      'Return whether two strings are anagrams: the same letters, each used the same number of times, in any order. Only lowercase letters `a` to `z` appear.',
    example: '`"listen"` and `"silent"` → `true`; `"rat"` and `"car"` → `false`.',
    understand: [
      '**Input:** two strings. **Output:** `true` or `false`.',
      'Different lengths can never be anagrams, so check that first.',
      'Order does not matter at all, only how many of each letter.',
      'Only 26 possible letters, so 26 counters are enough.',
    ],
    byHand: [
      {
        kind: 'para',
        text: 'Tally the letters of the first word, then cross one off for each letter of the second word:',
      },
      {
        kind: 'table',
        headers: ['Step', 'Tally'],
        rows: [
          ['After `"rat"`', 'r: 1, a: 1, t: 1'],
          ['Cross off `c`', 'c: −1 (there was no c to cross off)'],
          ['Cross off `a`', 'a: 0'],
          ['Cross off `r`', 'r: 0'],
          ['End', 't: 1 and c: −1 are not zero → **not** anagrams'],
        ],
      },
    ],
    rule:
      'Count each letter of the first word up and each letter of the second word down; they are anagrams exactly when every count ends at zero.',
    brute: {
      idea: 'For each letter of the first word, count how often it appears in each word by scanning both, and compare.',
      java: `int countOf(String s, char c) {
    // A full scan of s, just to count one letter.
    int count = 0;
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) == c) count++;
    }
    return count;
}

boolean isAnagramBrute(String s, String t) {
    if (s.length() != t.length()) return false;
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        // Scan both words again for every single letter.
        if (countOf(s, c) != countOf(t, c)) return false;
    }
    return true;
}`,
      python: `def count_of(s: str, c: str) -> int:
    # A full scan of s, just to count one letter.
    count = 0
    for ch in s:
        if ch == c:
            count += 1
    return count


def is_anagram_brute(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    for c in s:
        # Scan both words again for every single letter.
        if count_of(s, c) != count_of(t, c):
            return False
    return True`,
      cost: '`O(n²)`: every letter triggers two full scans.',
    },
    repeated:
      'For every letter, the brute force re-scans both words to count it, so a 1,000-letter word gets scanned 1,000 times. A single pass that tallies **every** letter at once produces all those counts together.',
    better: {
      idea: '26 counters, one per letter. Up for the first word, down for the second.',
      java: `boolean isAnagram(String s, String t) {
    // Different lengths can never be anagrams.
    if (s.length() != t.length()) {
        return false;
    }

    // count[0] is for 'a', count[1] for 'b', ... count[25] for 'z'.
    int[] count = new int[26];

    for (int i = 0; i < s.length(); i++) {
        // c - 'a' turns a letter into its slot: 'a' -> 0, 'b' -> 1, ...
        count[s.charAt(i) - 'a']++;   // a letter of s: count it up
        count[t.charAt(i) - 'a']--;   // a letter of t: count it down
    }

    // Anagrams use every letter equally often, so every slot is back to 0.
    for (int c : count) {
        if (c != 0) {
            return false;
        }
    }
    return true;
}`,
      python: `def is_anagram(s: str, t: str) -> bool:
    # Different lengths can never be anagrams.
    if len(s) != len(t):
        return False

    # count[0] is for "a", count[1] for "b", ... count[25] for "z".
    count = [0] * 26

    for a, b in zip(s, t):
        # ord(a) - ord("a") turns a letter into its slot: "a" -> 0, "b" -> 1, ...
        count[ord(a) - ord("a")] += 1   # a letter of s: count it up
        count[ord(b) - ord("a")] -= 1   # a letter of t: count it down

    # Anagrams use every letter equally often, so every slot is back to 0.
    return all(c == 0 for c in count)`,
      cost: '`O(n)` time, and `O(1)` extra memory: 26 counters, however long the words are.',
    },
    dryRun: {
      headers: ['`i`', '`s[i]` (+1)', '`t[i]` (−1)', 'Non-zero counts after'],
      rows: [
        ['0', 'r', 'c', 'r: 1, c: −1'],
        ['1', 'a', 'a', 'r: 1, c: −1'],
        ['2', 't', 'r', 'c: −1, t: 1'],
        ['end', '', '', 'not all zero → `false`'],
      ],
    },
    trap: '`c - \'a\'` only maps lowercase `a` to `z` onto 0 to 25. A capital letter, a digit or a space gives a negative or too-large index and crashes. For general text, count with a `HashMap<Character, Integer>` (Python: `collections.Counter`) instead of a fixed array.',
    signals: [
      'Anagrams, permutations, "the same letters".',
      'The most frequent or least frequent value.',
      '"Appears exactly k times", duplicates, unique elements.',
      'Group items that have identical counts (group anagrams).',
    ],
    check: {
      question: 'How would you group a list of words into groups of anagrams?',
      answer: 'Give each word a key that is identical for all its anagrams: its letters sorted (`"eat"` → `"aet"`), or its 26 counts. Then put every word into a hash map from key to list of words. Each list is one group.',
    },
  }),
};

export const ARRAY_PATTERNS: CourseLesson[] = [
  TWO_POINTERS,
  SLIDING_WINDOW,
  PREFIX_SUM,
  DIFFERENCE_ARRAY,
  HASH_LOOKUP,
  FREQUENCY,
];
