import { CourseLesson } from '../course/course.model';
import { walkthrough } from './build';

const DIVIDE_AND_CONQUER: CourseLesson = {
  slug: 'divide-and-conquer',
  title: 'Divide and conquer',
  tagline:
    'Split the problem in half, solve each half the same way, then combine the two answers. Merge sort is the classic example.',
  topic: 'sorting',
  pattern: 'divide-and-conquer',
  minutes: 16,
  practice: ['count-inversions', 'power-mod', 'gcd-of-array', 'recursion-cost'],
  blocks: walkthrough({
    plain:
      'Some problems are much easier on half the data, and two half-answers are easy to combine. Then solve each half the same way, splitting again and again until the pieces are trivial. For sorting: a list of one element is already sorted, and two sorted lists merge in a single pass.',
    problem: 'Sort an array of numbers in increasing order, without using a built-in sort.',
    example: '`[5, 2, 4, 6, 1, 3]` → `[1, 2, 3, 4, 5, 6]`.',
    understand: [
      '**Input:** an array, possibly empty, possibly with repeats. **Output:** the same values in increasing order.',
      'We return a new sorted array and leave the input alone.',
      'Repeated values must all be kept.',
      'A list of 0 or 1 elements is already sorted. That will be our stopping point.',
    ],
    byHand: [
      {
        kind: 'para',
        text: 'Two friends each sort half a deck of cards: one ends up with `2 4 5`, the other with `1 3 6`. To combine, look at the top card of each pile and always take the smaller: 1, 2, 3, 4, 5, 6. Merging is easy, because the smallest remaining card is always on top of one of the piles. And each friend could split their half the same way, down to piles of one card:',
      },
      {
        kind: 'diagram',
        art: `split:   [5 2 4 6 1 3]
         [5 2 4]          [6 1 3]
         [5] [2 4]        [6] [1 3]
              [2] [4]          [1] [3]

merge:   [5] [2 4]        [6] [1 3]
         [2 4 5]          [1 3 6]
         [1 2 3 4 5 6]`,
        caption: 'Split until the pieces are trivially sorted, then merge back up.',
      },
    ],
    rule:
      'If the array has more than one element, sort each half the same way, then merge the two sorted halves by repeatedly taking the smaller front element.',
    brute: {
      idea: 'Selection sort: find the smallest remaining value, put it next, repeat.',
      java: `int[] selectionSort(int[] input) {
    int[] a = input.clone();
    for (int i = 0; i < a.length; i++) {
        // Scan the unsorted part a[i..] for its smallest value.
        int min = i;
        for (int j = i + 1; j < a.length; j++) {
            if (a[j] < a[min]) min = j;
        }
        // Swap it into position i: a[0..i] is now sorted.
        int t = a[i]; a[i] = a[min]; a[min] = t;
    }
    return a;
}`,
      python: `def selection_sort(values: list[int]) -> list[int]:
    a = list(values)
    for i in range(len(a)):
        # Scan the unsorted part a[i:] for its smallest value.
        smallest = i
        for j in range(i + 1, len(a)):
            if a[j] < a[smallest]:
                smallest = j
        # Swap it into position i: a[:i + 1] is now sorted.
        a[i], a[smallest] = a[smallest], a[i]
    return a`,
      cost: '`O(n²)` comparisons: a million values would take hours.',
    },
    repeated:
      'Each round scans the whole unsorted part to find one minimum, and the next round scans almost the same values again, having learnt nothing it can reuse. Merge sort never compares two values whose order it already knows: once two halves are sorted, merging them costs just one comparison per value.',
    better: {
      idea: 'Divide at the middle, conquer each half with the same function, combine with a merge.',
      java: `int[] mergeSort(int[] a) {
    // 0 or 1 elements: already sorted. This stops the splitting.
    if (a.length <= 1) return a.clone();

    // Divide: cut at the middle.
    int mid = a.length / 2;
    // Conquer: sort each half with this same function.
    int[] left = mergeSort(Arrays.copyOfRange(a, 0, mid));
    int[] right = mergeSort(Arrays.copyOfRange(a, mid, a.length));
    // Combine: two sorted halves become one sorted array.
    return mergeHalves(left, right);
}

int[] mergeHalves(int[] left, int[] right) {
    int[] out = new int[left.length + right.length];
    // i and j point at the smallest value not yet taken from each half.
    int i = 0, j = 0, k = 0;

    while (i < left.length && j < right.length) {
        // Take the smaller front value. <= keeps equal values in their
        // original order (a "stable" sort).
        if (left[i] <= right[j]) out[k++] = left[i++];
        else out[k++] = right[j++];
    }

    // One half is used up; the rest of the other is sorted already.
    while (i < left.length) out[k++] = left[i++];
    while (j < right.length) out[k++] = right[j++];
    return out;
}`,
      python: `def merge_sort(a: list[int]) -> list[int]:
    # 0 or 1 elements: already sorted. This stops the splitting.
    if len(a) <= 1:
        return list(a)

    # Divide: cut at the middle.
    mid = len(a) // 2
    # Conquer: sort each half with this same function.
    left = merge_sort(a[:mid])
    right = merge_sort(a[mid:])
    # Combine: two sorted halves become one sorted list.
    return merge_halves(left, right)


def merge_halves(left: list[int], right: list[int]) -> list[int]:
    out = []
    # i and j point at the smallest value not yet taken from each half.
    i = j = 0

    while i < len(left) and j < len(right):
        # Take the smaller front value. <= keeps equal values in their
        # original order (a "stable" sort).
        if left[i] <= right[j]:
            out.append(left[i])
            i += 1
        else:
            out.append(right[j])
            j += 1

    # One half is used up; the rest of the other is sorted already.
    out.extend(left[i:])
    out.extend(right[j:])
    return out`,
      cost: '`O(n log n)`: halving gives about `log n` levels, and each level merges `n` values in total. `O(n)` extra memory for the merges.',
    },
    dryRun: {
      headers: ['Fronts compared', 'Take', '`out` so far'],
      rows: [
        ['2 vs 1', '1', '1'],
        ['2 vs 3', '2', '1 2'],
        ['4 vs 3', '3', '1 2 3'],
        ['4 vs 6', '4', '1 2 3 4'],
        ['5 vs 6', '5', '1 2 3 4 5'],
        ['left used up', 'copy 6', '1 2 3 4 5 6'],
      ],
      caption: 'The last merge: `[2, 4, 5]` with `[1, 3, 6]`.',
    },
    trap: 'A base case that only stops at length 0. Then a one-element array splits into an empty half and a one-element half, which splits the same way again, forever, until the program crashes. Stop at length 0 **or** 1. And do not forget the two "copy what is left" loops after the merge.',
    signals: [
      'The problem splits into **independent halves** whose answers combine.',
      'Sorting, counting inversions ("pairs `i < j` with `a[i] > a[j]`").',
      'Fast power: `a^b` from `a^(b/2)`.',
      'Answers that cross a midpoint: closest pair of points, best subarray across the middle.',
    ],
    check: {
      question: 'How can merge sort count inversions (pairs `i < j` with `a[i] > a[j]`) while it sorts?',
      answer: 'During a merge, when a value is taken from the **right** half while `left.length − i` values are still waiting in the left half, each of those is bigger and came earlier: that is `left.length − i` inversions. Add them up across every merge, in `O(n log n)` total.',
    },
  }),
};

const BACKTRACKING: CourseLesson = {
  slug: 'backtracking',
  title: 'Backtracking',
  tagline:
    'Build an answer one decision at a time: choose, explore everything that follows, then undo the choice and try the next one.',
  topic: 'recursion',
  pattern: 'backtracking',
  minutes: 16,
  practice: ['generate-subsets', 'permutations', 'combination-sum', 'n-queens'],
  blocks: walkthrough({
    plain:
      'Some problems ask for every possible arrangement. Picture the decisions as a tree: each level makes one decision, and each path from the top to the bottom is one complete answer. Backtracking walks that tree with one shared list of choices: add a choice, go deeper, then remove it again on the way back up.',
    problem: 'Given a list of distinct numbers, return every subset, including the empty one.',
    example: '`[1, 2, 3]` → `[]`, `[1]`, `[2]`, `[3]`, `[1, 2]`, `[1, 3]`, `[2, 3]`, `[1, 2, 3]` (in any order).',
    understand: [
      '**Input:** distinct numbers. **Output:** a list of lists.',
      'Each number is either in or out, so `n` numbers give `2 × 2 × … = 2ⁿ` subsets.',
      'Order inside a subset does not matter: `[1, 2]` and `[2, 1]` are the same subset.',
      'An empty input has exactly one subset: the empty one.',
    ],
    byHand: [
      {
        kind: 'para',
        text: 'For each number there are two choices: leave it out, or put it in. Each level of this tree decides about one number; the bottom row is every subset.',
      },
      {
        kind: 'diagram',
        art: `                      [ ]
           out 1 /              \\ in 1
               [ ]              [1]
       out 2 /    \\ in 2   out 2 /    \\ in 2
           [ ]    [2]         [1]    [1,2]
     out 3 / \\    / \\        / \\     /  \\
       [ ] [3] [2] [2,3]  [1] [1,3] [1,2] [1,2,3]`,
        caption: 'Three levels of in-or-out decisions; eight subsets at the bottom.',
      },
    ],
    rule:
      'Decide about each number in turn, exploring both "leave it out" and "put it in"; when every number has been decided, the current choices form one subset.',
    brute: {
      idea: 'One nested loop per number, each running over "out" (0) and "in" (1). It works, but only for exactly three numbers.',
      java: `List<List<Integer>> subsetsOfThree(int[] nums) {
    List<List<Integer>> out = new ArrayList<>();
    // One loop per number: 0 = leave it out, 1 = put it in.
    for (int a = 0; a <= 1; a++)
        for (int b = 0; b <= 1; b++)
            for (int c = 0; c <= 1; c++) {
                List<Integer> subset = new ArrayList<>();
                if (a == 1) subset.add(nums[0]);
                if (b == 1) subset.add(nums[1]);
                if (c == 1) subset.add(nums[2]);
                out.add(subset);
            }
    return out;
}`,
      python: `def subsets_of_three(nums: list[int]) -> list[list[int]]:
    out = []
    # One loop per number: 0 = leave it out, 1 = put it in.
    for a in (0, 1):
        for b in (0, 1):
            for c in (0, 1):
                subset = []
                if a: subset.append(nums[0])
                if b: subset.append(nums[1])
                if c: subset.append(nums[2])
                out.append(subset)
    return out`,
      cost: 'Fine for three numbers, but twenty numbers would need twenty nested loops, and `n` is not known when you write the code.',
    },
    repeated:
      'Every loop does the same job: decide in or out for one number, then hand over to the next loop. "Do the same thing for the next number" is exactly what a **recursive call** does, and recursion can go as deep as there are numbers, whatever `n` turns out to be.',
    better: {
      idea: '`explore(i)` decides about `nums[i]` and everything after it. One shared list, `chosen`, holds the decisions made so far.',
      java: `List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> out = new ArrayList<>();
    explore(nums, 0, new ArrayList<>(), out);
    return out;
}

// Decide about nums[i], nums[i + 1], ... given the choices already in 'chosen'.
void explore(int[] nums, int i, List<Integer> chosen, List<List<Integer>> out) {
    // Every number has been decided: the choices form one subset.
    // Save a COPY, because 'chosen' keeps changing after this.
    if (i == nums.length) {
        out.add(new ArrayList<>(chosen));
        return;
    }

    // Choice 1: leave nums[i] out, and decide about the rest.
    explore(nums, i + 1, chosen, out);

    // Choice 2: put nums[i] in...
    chosen.add(nums[i]);
    // ...decide about the rest with it included...
    explore(nums, i + 1, chosen, out);
    // ...then undo, so 'chosen' is exactly as our caller left it.
    chosen.remove(chosen.size() - 1);
}`,
      python: `def subsets(nums: list[int]) -> list[list[int]]:
    out = []
    # The decisions made so far, shared by every call.
    chosen = []

    def explore(i: int) -> None:
        # Every number has been decided: the choices form one subset.
        # Save a COPY, because 'chosen' keeps changing after this.
        if i == len(nums):
            out.append(chosen[:])
            return

        # Choice 1: leave nums[i] out, and decide about the rest.
        explore(i + 1)

        # Choice 2: put nums[i] in...
        chosen.append(nums[i])
        # ...decide about the rest with it included...
        explore(i + 1)
        # ...then undo, so 'chosen' is exactly as our caller left it.
        chosen.pop()

    explore(0)
    return out`,
      cost: '`2ⁿ` subsets, each copied in `O(n)`: `O(2ⁿ × n)`. That is the size of the answer itself, so nothing can do better.',
    },
    dryRun: {
      headers: ['Call', '`chosen`', 'What happens'],
      rows: [
        ['`explore(0)`', '`[]`', 'leave 1 out'],
        ['`explore(1)`', '`[]`', 'leave 2 out → `explore(2)` saves `[]`'],
        ['`explore(1)`', '`[2]`', 'put 2 in → saves `[2]`, then undo'],
        ['`explore(0)`', '`[1]`', 'put 1 in'],
        ['`explore(1)`', '`[1]`', 'leave 2 out → saves `[1]`'],
        ['`explore(1)`', '`[1, 2]`', 'put 2 in → saves `[1, 2]`, undo, undo'],
      ],
      caption: 'For `nums = [1, 2]`: four subsets saved, and `chosen` ends empty.',
    },
    trap: 'Saving `chosen` itself instead of a copy. Every saved "subset" is then the same list, and after all the undos they are all empty: `[[], [], [], []]`. Save `new ArrayList<>(chosen)` (Python: `chosen[:]`). The other classic bug is forgetting the undo, so later subsets carry leftovers from earlier ones.',
    signals: [
      '**All** subsets, permutations, combinations or arrangements.',
      '"Generate every…", "list all the ways to…".',
      'Puzzles with rules: N-Queens, Sudoku, word search.',
      'Small inputs (`n` up to about 20), because the answer itself grows exponentially.',
    ],
    check: {
      question: 'Combinations of positive numbers that add up to a target: where would you **prune**?',
      answer: 'Keep the running sum. If it already exceeds the target, return at once instead of exploring further: with positive numbers nothing deeper can bring the sum back down. Pruning means recognising a dead end before walking into it.',
    },
  }),
};

const GREEDY: CourseLesson = {
  slug: 'greedy',
  title: 'Greedy choices',
  tagline:
    'Make the choice that looks best right now and never reconsider. When you can argue it is safe, it is usually one short pass.',
  topic: 'greedy',
  pattern: 'greedy',
  minutes: 15,
  practice: ['jump-game-ii', 'gas-station', 'partition-labels', 'largest-number'],
  blocks: walkthrough({
    plain:
      'A greedy algorithm commits to the locally best choice at each step. That is only correct when you can explain why that choice never hurts later. When it is correct, it replaces a big search with one pass; when it is not, it gives confident wrong answers.',
    problem:
      'You stand on the first position of an array. Each value is the **maximum** jump length from that position. Return whether you can reach the last position.',
    example: '`[2, 3, 1, 1, 4]` → `true` (0 → 1 → 4). `[3, 2, 1, 0, 4]` → `false`: every route lands on the `0` and gets stuck.',
    understand: [
      '**Input:** non-negative jump lengths. **Output:** `true` or `false`.',
      'From position `i` you may jump any distance from 1 up to `nums[i]`.',
      'An array of one element: you are already at the end.',
      'A `0` is a trap, unless some earlier position can jump over it.',
    ],
    byHand: [
      {
        kind: 'para',
        text: 'Walk left to right keeping one number: the farthest position you could reach so far. If you ever stand on a position beyond it, you could never have got there.',
      },
      {
        kind: 'table',
        headers: ['Position', 'Value', 'Can I stand here?', 'Farthest reach after'],
        rows: [
          ['0', '3', 'yes (start)', '0 + 3 = 3'],
          ['1', '2', 'yes, 1 ≤ 3', 'max(3, 1 + 2) = 3'],
          ['2', '1', 'yes, 2 ≤ 3', 'max(3, 2 + 1) = 3'],
          ['3', '0', 'yes, 3 ≤ 3', 'max(3, 3 + 0) = 3'],
          ['4', '4', '**no**, 4 > 3', 'stuck → `false`'],
        ],
      },
    ],
    rule:
      'Walk left to right keeping the farthest reachable position; if you ever stand beyond it you are stuck, and if it reaches the last position you can make it.',
    brute: {
      idea: 'From each position, try every allowed jump, recursively.',
      java: `boolean canReachFrom(int[] nums, int i) {
    // Standing on (or past) the last position: done.
    if (i >= nums.length - 1) return true;
    // Try every jump length allowed from here.
    for (int step = 1; step <= nums[i]; step++) {
        if (canReachFrom(nums, i + step)) return true;
    }
    // No jump from here leads to the end.
    return false;
}

boolean canJumpBrute(int[] nums) {
    return canReachFrom(nums, 0);
}`,
      python: `def can_reach_from(nums: list[int], i: int) -> bool:
    # Standing on (or past) the last position: done.
    if i >= len(nums) - 1:
        return True
    # Try every jump length allowed from here.
    for step in range(1, nums[i] + 1):
        if can_reach_from(nums, i + step):
            return True
    # No jump from here leads to the end.
    return False


def can_jump_brute(nums: list[int]) -> bool:
    return can_reach_from(nums, 0)`,
      cost: 'Exponential: many different jump sequences land on the same position, and each one explores everything from there again.',
    },
    repeated:
      'Different routes keep re-exploring the same positions. But we never need to know **how** we reach a position, only **whether** we can. And reachability has a simple shape: if position `p` is reachable, so is every position before it (you could have jumped shorter). So one number, the farthest reachable position, describes everything.',
    better: {
      idea: 'One pass, one variable. We never commit to a particular jump; we only track how far the reachable region extends.',
      java: `boolean canJump(int[] nums) {
    // Every position from 0 up to 'farthest' can be reached.
    int farthest = 0;

    for (int i = 0; i < nums.length; i++) {
        // i lies beyond everything reachable: we can never stand here.
        if (i > farthest) return false;
        // Standing on i, we can reach up to i + nums[i]. Keep the best reach.
        farthest = Math.max(farthest, i + nums[i]);
        // The last position is within reach: no need to look further.
        if (farthest >= nums.length - 1) return true;
    }
    return true;
}`,
      python: `def can_jump(nums: list[int]) -> bool:
    # Every position from 0 up to 'farthest' can be reached.
    farthest = 0

    for i, jump in enumerate(nums):
        # i lies beyond everything reachable: we can never stand here.
        if i > farthest:
            return False
        # Standing on i, we can reach up to i + jump. Keep the best reach.
        farthest = max(farthest, i + jump)
        # The last position is within reach: no need to look further.
        if farthest >= len(nums) - 1:
            return True
    return True`,
      cost: '`O(n)` time, `O(1)` memory.',
    },
    dryRun: {
      headers: ['`i`', '`nums[i]`', '`i > farthest`?', '`farthest` after'],
      rows: [
        ['0', '2', 'no', '2'],
        ['1', '3', 'no', '4 → reaches the last position → `true`'],
      ],
      caption: 'For `[2, 3, 1, 1, 4]`. The by-hand table above is the dry run for `[3, 2, 1, 0, 4]`.',
    },
    extra: [
      { kind: 'heading', text: 'When greedy fails' },
      {
        kind: 'para',
        text: 'Make 6 with coins `{1, 3, 4}`, using as few coins as possible. Greedy says "always take the biggest coin that fits": 4, then 1, then 1, which is **3 coins**. But `3 + 3` uses **2**. Taking the 4 felt best and was wrong. When a small counter-example like this exists, the problem needs dynamic programming, the next lesson, not greedy.',
      },
      {
        kind: 'callout',
        tone: 'why',
        title: 'Why greedy is safe for the jump game',
        text: 'The algorithm never chooses a particular jump, so it can never choose a wrong one. It only grows the region of positions known to be reachable, and that region really does contain every position before its far edge. A greedy argument usually sounds like this: "the choice I made now can never be worse than any other choice."',
      },
    ],
    trap: 'Using greedy without an argument. It is the easiest kind of solution to write and the easiest to get wrong. Before trusting it, try to break it with a small example, as with the coins above. If you cannot say why the local choice is safe, reach for dynamic programming.',
    signals: [
      'At each step, "the best-looking option now" might be all you need.',
      'Scheduling: the most non-overlapping meetings (take the earliest-ending first).',
      'Reachability with jumps; gas stations around a circuit.',
      '"Minimum number of…" where one simple ordering decides everything. Check with a counter-example!',
    ],
    check: {
      question: 'Fewest jumps to reach the end: what greedy idea works?',
      answer: 'Think in levels, like BFS: the positions reachable with 1 jump, then with 2 jumps, and so on. Track where the current level ends and the farthest reach from inside it. When `i` passes the end of the current level, you must take another jump, and the next level ends at that farthest reach.',
    },
  }),
};

const DYNAMIC_PROGRAMMING: CourseLesson = {
  slug: 'dynamic-programming',
  title: 'Dynamic programming',
  tagline:
    'When an answer is built from smaller answers that are needed again and again, compute each one once and store it.',
  topic: 'dynamic-programming',
  pattern: 'dynamic-programming',
  minutes: 17,
  practice: ['climbing-stairs', 'max-subarray-sum', 'coin-change', 'edit-distance'],
  blocks: walkthrough({
    plain:
      'Dynamic programming sounds scary and is not. It is "write the recursive solution, notice it solves the same smaller problem many times, and store each answer the first time". The hard part is finding the recursion, and one question almost always finds it: **what was the last move?**',
    problem: 'You climb a staircase of `n` steps, one or two steps at a time. In how many different ways can you reach the top?',
    example: '`n = 4` → `5`: 1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2.',
    understand: [
      '**Input:** `n ≥ 1`. **Output:** a count.',
      'Order matters: 1+2 and 2+1 are different ways.',
      '`n = 1` has 1 way, `n = 2` has 2 ways (1+1 or 2).',
      'The answers grow fast: `n = 45` is over a billion, so Java needs `long` soon after.',
    ],
    byHand: [
      {
        kind: 'para',
        text: 'Listing every way gets out of hand quickly. Ask instead: **what was my last move** onto step 4? Either a 1-step from step 3, or a 2-step from step 2. Every way to reach step 4 is a way to reach step 3 plus one step, or a way to reach step 2 plus two steps:',
      },
      {
        kind: 'table',
        headers: ['Step', 'Ways', 'How'],
        rows: [
          ['1', '1', 'known'],
          ['2', '2', 'known'],
          ['3', '3', 'ways(2) + ways(1) = 2 + 1'],
          ['4', '5', 'ways(3) + ways(2) = 3 + 2'],
          ['5', '8', 'ways(4) + ways(3) = 5 + 3'],
        ],
      },
    ],
    rule: 'The number of ways to reach step `n` is the number of ways to reach step `n − 1` plus the number of ways to reach step `n − 2`.',
    brute: {
      idea: 'Translate the rule straight into recursion.',
      java: `int waysBrute(int n) {
    // Step 1: one way. Step 2: two ways (1+1, or 2).
    if (n <= 2) return n;
    // The last move was a 1-step (from n - 1) or a 2-step (from n - 2).
    return waysBrute(n - 1) + waysBrute(n - 2);
}`,
      python: `def ways_brute(n: int) -> int:
    # Step 1: one way. Step 2: two ways (1+1, or 2).
    if n <= 2:
        return n
    # The last move was a 1-step (from n - 1) or a 2-step (from n - 2).
    return ways_brute(n - 1) + ways_brute(n - 2)`,
      cost: 'Roughly `1.6ⁿ` calls: `n = 45` takes billions of calls and many seconds.',
    },
    repeated:
      'Trace the calls for `ways(5)`: it calls `ways(4)` and `ways(3)`, and `ways(4)` calls `ways(3)` **again**. `ways(3)` is computed twice, `ways(2)` three times, and the waste doubles with every level. But `ways(3)` is always 3. Compute each `ways(k)` once, store it, and the whole tree collapses into a single row of numbers.',
    better: {
      idea: 'Fill a table from the bottom up: `dp[i]` holds the number of ways to reach step `i`.',
      java: `long ways(int n) {
    if (n <= 2) return n;

    // dp[i] = number of ways to reach step i. long, because it grows fast.
    long[] dp = new long[n + 1];
    // The answers we know without any work: the base cases.
    dp[1] = 1;
    dp[2] = 2;

    // Fill upwards, so dp[i - 1] and dp[i - 2] are ready when we need them.
    for (int i = 3; i <= n; i++) {
        // Last move: a 1-step from i - 1, or a 2-step from i - 2.
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`,
      python: `def ways(n: int) -> int:
    if n <= 2:
        return n

    # dp[i] = number of ways to reach step i.
    dp = [0] * (n + 1)
    # The answers we know without any work: the base cases.
    dp[1], dp[2] = 1, 2

    # Fill upwards, so dp[i - 1] and dp[i - 2] are ready when we need them.
    for i in range(3, n + 1):
        # Last move: a 1-step from i - 1, or a 2-step from i - 2.
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`,
      cost: '`O(n)` time and `O(n)` memory. Only the last two values are ever read, so two variables could replace the array: `O(1)` memory.',
    },
    dryRun: {
      headers: ['`i`', '`dp[i − 2]`', '`dp[i − 1]`', '`dp[i]`'],
      rows: [
        ['3', '1', '2', '3'],
        ['4', '2', '3', '5'],
        ['5', '3', '5', '8'],
      ],
      caption: 'For `n = 5`, starting from `dp[1] = 1` and `dp[2] = 2`.',
    },
    extra: [
      { kind: 'heading', text: 'The four questions behind every DP' },
      {
        kind: 'steps',
        items: [
          { title: 'What is the state?', text: 'What does one number in the table mean? Here: `dp[i]` = ways to reach step `i`.' },
          { title: 'What is the recurrence?', text: 'How is one state built from smaller ones? Ask "what was the last move?". Here: `dp[i] = dp[i − 1] + dp[i − 2]`.' },
          { title: 'What are the base cases?', text: 'The states you know without the recurrence. Here: `dp[1] = 1`, `dp[2] = 2`.' },
          { title: 'In what order do I fill it?', text: 'An order in which everything a state needs is already filled. Here: small `i` to large `i`.' },
        ],
      },
    ],
    trap: 'Writing the recursion and stopping there. It is correct, so it passes small tests, then times out around `n = 40`. Whenever a recursive function can be called twice with the same arguments, store its answers: a table filled bottom-up, or a memo (a map from arguments to answer) checked at the top of the function.',
    signals: [
      '"How many ways…", "minimum cost to…", "maximum value of…".',
      'Each step is a choice that depends on earlier choices: take it or not, which coin last.',
      'A recursive solution that repeats calls with the same arguments.',
      'Two strings compared position by position: edit distance, longest common subsequence.',
    ],
    check: {
      question: 'Fewest coins to make an amount: what are the state, the recurrence and the base case?',
      answer: 'State: `dp[a]` = fewest coins that make amount `a`. Recurrence, from "what was the last coin `c`?": `dp[a] = 1 + min(dp[a − c])` over every coin `c ≤ a`. Base case: `dp[0] = 0`. Fill `a` from 1 upwards; an amount nothing can make stays marked "impossible".',
    },
  }),
};

const BITS: CourseLesson = {
  slug: 'bit-manipulation',
  title: 'Bit manipulation',
  tagline:
    'Numbers are stored as bits, and a few bit operations have very useful algebra. XOR is the star: pairs cancel out.',
  topic: 'mathematics',
  pattern: 'bit-manipulation',
  minutes: 14,
  practice: ['single-number', 'swap-without-temp', 'count-digits', 'maximum-xor-pair'],
  blocks: walkthrough({
    plain:
      'XOR (`^`) compares two numbers bit by bit: 1 where the bits differ, 0 where they match. That gives two rules: `x ^ x = 0` and `x ^ 0 = x`, and the order of XORs does not matter. So XOR a whole list together, and every value that appears twice cancels itself out.',
    problem: 'Every number in an array appears exactly twice, except one, which appears once. Find it, using only O(1) extra memory.',
    example: '`[4, 1, 2, 1, 2]` → `4`.',
    understand: [
      '**Input:** an array. **Output:** the one value without a partner.',
      'Every other value appears **exactly** twice.',
      'Negative numbers are allowed.',
      '**O(1) extra memory** rules out a hash map. That constraint is the hint.',
    ],
    byHand: [
      { kind: 'para', text: 'Write each number in binary and XOR them in one by one:' },
      {
        kind: 'table',
        headers: ['Value', 'Binary', 'Running XOR'],
        rows: [
          ['start', '', '`000`'],
          ['4', '`100`', '`100`'],
          ['1', '`001`', '`101`'],
          ['2', '`010`', '`111`'],
          ['1', '`001`', '`110` (the 1s cancelled)'],
          ['2', '`010`', '`100` (the 2s cancelled) = **4**'],
        ],
      },
    ],
    rule: 'XOR all the numbers together: every pair cancels to zero, and the single number is what is left.',
    brute: {
      idea: 'Count every value in a hash map, then find the one with count 1.',
      java: `int singleNumberWithMap(int[] nums) {
    // How many times each value appears.
    Map<Integer, Integer> count = new HashMap<>();
    for (int x : nums) count.put(x, count.getOrDefault(x, 0) + 1);
    // The value seen exactly once.
    for (int x : nums) {
        if (count.get(x) == 1) return x;
    }
    return -1;
}`,
      python: `def single_number_with_map(nums: list[int]) -> int:
    # How many times each value appears.
    count = {}
    for x in nums:
        count[x] = count.get(x, 0) + 1
    # The value seen exactly once.
    for x in nums:
        if count[x] == 1:
            return x
    return -1`,
      cost: '`O(n)` time, but `O(n)` memory: about `n / 2` map entries.',
    },
    repeated:
      'The map keeps a full count for every value, only to find the one count that is odd. We never needed the counts, just "odd or even". XOR keeps exactly that, for every bit, inside one number: each bit of the running XOR says whether that bit has been seen an odd number of times.',
    better: {
      idea: 'One variable, one pass.',
      java: `int singleNumber(int[] nums) {
    // XOR of nothing is 0, and x ^ 0 = x, so 0 is the right start.
    int result = 0;
    for (int x : nums) {
        // x ^ x = 0, and the order of XORs does not matter, so every pair
        // cancels out wherever its two copies are in the array.
        result ^= x;
    }
    // Only the value without a partner is left.
    return result;
}`,
      python: `def single_number(nums: list[int]) -> int:
    # XOR of nothing is 0, and x ^ 0 = x, so 0 is the right start.
    result = 0
    for x in nums:
        # x ^ x = 0, and the order of XORs does not matter, so every pair
        # cancels out wherever its two copies are in the list.
        result ^= x
    # Only the value without a partner is left.
    return result`,
      cost: '`O(n)` time, `O(1)` memory.',
    },
    dryRun: {
      headers: ['`x`', '`result` before', '`result` after'],
      rows: [
        ['4', '0', '4'],
        ['1', '4', '5'],
        ['2', '5', '7'],
        ['1', '7', '6'],
        ['2', '6', '4'],
      ],
    },
    extra: [
      { kind: 'heading', text: 'Bit tricks worth knowing' },
      {
        kind: 'table',
        headers: ['Expression', 'Means'],
        rows: [
          ['`(x & 1) == 1`', '`x` is odd (its last bit is 1)'],
          ['`x >> 1`', '`x / 2`, rounded down, for `x ≥ 0`'],
          ['`1 << k`', '`2` to the power `k`'],
          ['`x & (x - 1)`', '`x` with its lowest 1-bit removed'],
          ['`x > 0 && (x & (x - 1)) == 0`', '`x` is a power of two (it has exactly one 1-bit)'],
          ['`x ^ y`', 'the bits where `x` and `y` differ'],
        ],
      },
    ],
    trap: 'Operator precedence. In Java (and C, C++, JavaScript), `==` binds more tightly than `&`, so `x & 1 == 0` means `x & (1 == 0)`: a compile error in Java and a silent bug elsewhere. Always put brackets around bit operations: `(x & 1) == 0`.',
    signals: [
      '"Appears twice except one", "the missing number", with O(1) memory.',
      'Powers of two, counting 1-bits, flipping bits.',
      'Subsets as numbers: bit `i` set means "item `i` is in" (for `n` up to about 20).',
      'Maximum XOR of two numbers (with a trie of bits).',
    ],
    check: {
      question: 'The numbers `0` to `n` with one missing, for example `[3, 0, 1]` (n = 3, missing 2). How does XOR find it?',
      answer: 'XOR together every number from `0` to `n` **and** every number in the array. Each number that is present appears twice and cancels; the missing one appears once and is left. `(0^1^2^3) ^ (3^0^1) = 2`.',
    },
  }),
};

export const RECURSION_PATTERNS: CourseLesson[] = [DIVIDE_AND_CONQUER, BACKTRACKING];
export const OPTIMISATION_PATTERNS: CourseLesson[] = [GREEDY, DYNAMIC_PROGRAMMING];
export const BIT_PATTERNS: CourseLesson[] = [BITS];
