import { CourseLesson } from './course.model';

const SUBSETS: CourseLesson = {
  slug: 'subsets',
  title: 'Subsets',
  tagline: 'Every element is in or out. Two choices, n times — and the decision tree writes the code for you.',
  topic: 'recursion',
  minutes: 12,
  practice: ['generate-subsets', 'single-number'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'To list every subset, walk the elements one at a time and make the same decision at each: **take it, or skip it.** Every path from the root of that decision tree to a leaf is one subset, and there are `2^n` paths.',
    },
    {
      kind: 'diagram',
      art: `nums = [1, 2, 3]

                     []
             take1 /     \\ skip1
               [1]         []
          t2 /   \\ s2    t2 /  \\ s2
        [1,2]   [1]     [2]    []
        /  \\    /  \\    /  \\   /  \\
 [1,2,3] [1,2] [1,3] [1] [2,3] [2] [3] []

8 leaves = 2^3 subsets`,
    },
    {
      kind: 'visual',
      name: 'recursion-tree',
      caption: 'Backtracking is a depth-first walk of the decision tree, undoing each choice on the way back up.',
    },
    { kind: 'heading', text: 'The take-or-skip form' },
    {
      kind: 'code',
      language: 'java',
      source: `List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> out = new ArrayList<>();
    walk(nums, 0, new ArrayList<>(), out);
    return out;
}

void walk(int[] nums, int i, List<Integer> current, List<List<Integer>> out) {
    if (i == nums.length) { out.add(new ArrayList<>(current)); return; }

    current.add(nums[i]);                 // take it
    walk(nums, i + 1, current, out);
    current.remove(current.size() - 1);   // undo — this is the backtrack

    walk(nums, i + 1, current, out);      // skip it
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def subsets(nums: list[int]) -> list[list[int]]:
    out: list[list[int]] = []
    current: list[int] = []

    def walk(i: int) -> None:
        if i == len(nums):
            out.append(current[:])
            return

        current.append(nums[i])      # take it
        walk(i + 1)
        current.pop()                # undo — this is the backtrack

        walk(i + 1)                  # skip it

    walk(0)
    return out`,
    },
    {
      kind: 'callout',
      tone: 'key',
      text: '`out.add(new ArrayList<>(current))` copies. Adding `current` itself stores a reference to a list you are about to mutate, so every entry in the answer ends up empty — the most common backtracking bug there is.',
    },
    { kind: 'heading', text: 'The loop form, which generalises better' },
    {
      kind: 'para',
      text: 'The same answers come out of a different shape: record the current list at *every* node rather than only at the leaves, then loop over the remaining elements. This is the form that extends to combinations and permutations, so it is worth being the one you memorise.',
    },
    {
      kind: 'code',
      language: 'python',
      source: `def subsets(nums: list[int]) -> list[list[int]]:
    out: list[list[int]] = []
    current: list[int] = []

    def walk(start: int) -> None:
        out.append(current[:])            # every node is a valid subset

        for i in range(start, len(nums)):
            current.append(nums[i])
            walk(i + 1)                   # i + 1: never reuse an element
            current.pop()                 # undo

    walk(0)
    return out`,
    },
    { kind: 'heading', text: 'Duplicates' },
    {
      kind: 'para',
      text: 'With repeated values, the plain version produces the same subset more than once. Sort first, then inside the loop skip an element that equals the previous one *at the same depth*: the first copy already explored every subset that uses one of them.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `// nums sorted beforehand
void walk(int[] nums, int start, List<Integer> current, List<List<Integer>> out) {
    out.add(new ArrayList<>(current));

    for (int i = start; i < nums.length; i++) {
        if (i > start && nums[i] == nums[i - 1]) continue;   // same choice, same depth

        current.add(nums[i]);
        walk(nums, i + 1, current, out);
        current.remove(current.size() - 1);
    }
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `# nums sorted beforehand
def walk(start: int, current: list[int], out: list[list[int]]) -> None:
    out.append(current[:])

    for i in range(start, len(nums)):
        if i > start and nums[i] == nums[i - 1]:
            continue                 # same choice, same depth

        current.append(nums[i])
        walk(i + 1, current, out)
        current.pop()`,
    },
    { kind: 'heading', text: 'The bitmask alternative' },
    {
      kind: 'para',
      text: 'For `n` up to about 20, skip the recursion entirely. The numbers `0` to `2^n - 1` enumerate every in/out pattern, and bit `j` says whether element `j` is in.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `List<List<Integer>> subsetsByMask(int[] nums) {
    int n = nums.length;
    List<List<Integer>> out = new ArrayList<>(1 << n);

    for (int mask = 0; mask < (1 << n); mask++) {
        List<Integer> subset = new ArrayList<>();
        for (int j = 0; j < n; j++) {
            if ((mask & (1 << j)) != 0) subset.add(nums[j]);
        }
        out.add(subset);
    }

    return out;
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def subsets_by_mask(nums: list[int]) -> list[list[int]]:
    n = len(nums)
    out = []

    for mask in range(1 << n):
        out.append([nums[j] for j in range(n) if mask & (1 << j)])

    return out`,
    },
    {
      kind: 'table',
      headers: ['', 'Count', 'Time', 'Extra space'],
      rows: [
        ['Subsets of n elements', '2^n', 'O(n · 2^n)', 'O(n) recursion depth'],
        ['Subsets of size k', 'C(n, k)', 'O(k · C(n, k))', 'O(k)'],
        ['Permutations', 'n!', 'O(n · n!)', 'O(n)'],
      ],
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Where people go wrong',
      text: 'Recursing with `walk(start + 1)` instead of `walk(i + 1)` inside the loop. With `start + 1` the loop and the recursion fight each other and you get duplicates; `i + 1` means "continue after the element I just took".',
    },
    {
      kind: 'check',
      question: 'Why is the output size the real lower bound on the running time here?',
      answer:
        'There are `2^n` subsets and each must be written out, so no algorithm can be faster than `O(2^n)` — the cost is in the answer, not the method. This is why `n` in such problems is always small.',
    },
  ],
};

const COMBINATIONS: CourseLesson = {
  slug: 'combinations',
  title: 'Combinations',
  tagline: 'Choose k of n, or any total that reaches a target — order does not matter, so never look backwards.',
  topic: 'recursion',
  minutes: 12,
  practice: ['combination-sum', 'generate-subsets', 'n-queens'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'A combination is a subset of a fixed size, or one that satisfies a condition. Because `[1, 2]` and `[2, 1]` are the same combination, each recursive call only ever looks **forwards** from the element it just used. That single rule is what removes the duplicates.',
    },
    {
      kind: 'diagram',
      art: `choose 2 from [1, 2, 3, 4]        start index only moves right

 1 -> 2   1 -> 3   1 -> 4
 2 -> 3   2 -> 4
 3 -> 4                    C(4,2) = 6, and no pair appears twice`,
    },
    { kind: 'heading', text: 'Choose k of n' },
    {
      kind: 'code',
      language: 'java',
      source: `List<List<Integer>> combine(int n, int k) {
    List<List<Integer>> out = new ArrayList<>();
    walk(1, n, k, new ArrayList<>(), out);
    return out;
}

void walk(int start, int n, int k, List<Integer> current, List<List<Integer>> out) {
    if (current.size() == k) { out.add(new ArrayList<>(current)); return; }

    // Pruning: stop once too few numbers remain to finish the combination.
    int need = k - current.size();
    for (int i = start; i <= n - need + 1; i++) {
        current.add(i);
        walk(i + 1, n, k, current, out);
        current.remove(current.size() - 1);
    }
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def combine(n: int, k: int) -> list[list[int]]:
    out: list[list[int]] = []
    current: list[int] = []

    def walk(start: int) -> None:
        if len(current) == k:
            out.append(current[:])
            return

        # Pruning: stop once too few numbers remain to finish the combination.
        need = k - len(current)
        for i in range(start, n - need + 2):
            current.append(i)
            walk(i + 1)
            current.pop()

    walk(1)
    return out

# the standard library also has it: itertools.combinations(range(1, n + 1), k)`,
    },
    {
      kind: 'callout',
      tone: 'key',
      text: 'The bound `i <= n - need + 1` is the difference between a fast solution and a slow one. Without it the search explores branches that can never reach length `k` and then throws them away at the bottom.',
    },
    { kind: 'heading', text: 'Combination sum: reuse allowed' },
    {
      kind: 'para',
      text: 'When an element may be used more than once, recurse with `i` rather than `i + 1`. The remaining target shrinks, which is what guarantees termination; sorting first lets you `break` as soon as a candidate exceeds what is left.',
    },
    {
      kind: 'code',
      language: 'python',
      source: `def combination_sum(candidates: list[int], target: int) -> list[list[int]]:
    candidates.sort()
    out: list[list[int]] = []
    current: list[int] = []

    def walk(start: int, remaining: int) -> None:
        if remaining == 0:
            out.append(current[:])
            return

        for i in range(start, len(candidates)):
            value = candidates[i]
            if value > remaining:
                break                      # sorted: everything after is worse

            current.append(value)
            walk(i, remaining - value)     # i, not i + 1: reuse is allowed
            current.pop()

    walk(0, target)
    return out`,
    },
    {
      kind: 'code',
      language: 'java',
      source: `List<List<Integer>> combinationSum(int[] candidates, int target) {
    Arrays.sort(candidates);
    List<List<Integer>> out = new ArrayList<>();
    walk(candidates, 0, target, new ArrayList<>(), out);
    return out;
}

void walk(int[] candidates, int start, int remaining,
          List<Integer> current, List<List<Integer>> out) {
    if (remaining == 0) { out.add(new ArrayList<>(current)); return; }

    for (int i = start; i < candidates.length; i++) {
        if (candidates[i] > remaining) break;

        current.add(candidates[i]);
        walk(candidates, i, remaining - candidates[i], current, out);
        current.remove(current.size() - 1);
    }
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def combination_sum(candidates: list[int], target: int) -> list[list[int]]:
    candidates.sort()
    out: list[list[int]] = []
    current: list[int] = []

    def walk(start: int, remaining: int) -> None:
        if remaining == 0:
            out.append(current[:])
            return

        for i in range(start, len(candidates)):
            value = candidates[i]
            if value > remaining:
                break

            current.append(value)
            walk(i, remaining - value)
            current.pop()

    walk(0, target)
    return out`,
    },
    { kind: 'heading', text: 'The four variants, side by side' },
    {
      kind: 'table',
      caption: 'Only the recursive index and the duplicate guard change.',
      headers: ['Variant', 'Recurse with', 'Duplicate guard'],
      rows: [
        ['Each element at most once, all distinct', 'i + 1', 'none needed'],
        ['Each element at most once, duplicates in input', 'i + 1', 'skip `nums[i] == nums[i-1]` when `i > start`'],
        ['Unlimited reuse, all distinct', 'i', 'none needed'],
        ['Unlimited reuse, duplicates in input', 'i', 'deduplicate the input first'],
      ],
    },
    {
      kind: 'callout',
      tone: 'why',
      title: 'Why the guard is `i > start`',
      text: 'At a given depth, the *first* candidate considered is allowed even if it equals the previous element overall — that is a different position in the combination. It is only a repeat when the same value is chosen twice **at the same depth**, which is exactly what `i > start` detects.',
    },
    {
      kind: 'para',
      text: 'Two pruning habits carry across every combination problem. Sort the input so you can `break` instead of `continue`. And check feasibility *before* recursing rather than after — an impossible branch you never enter costs nothing.',
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Where people go wrong',
      text: 'Using a `visited` array, as you would for permutations. Combinations do not need one: the moving start index already guarantees each element is considered once per path, and a visited array will quietly let the same combination through in a different order.',
    },
    {
      kind: 'check',
      question: 'In combination sum with reuse, why does the recursion terminate?',
      answer:
        'Because every candidate is at least 1, so `remaining` strictly decreases on each level, and the branch is abandoned once it goes below the smallest candidate. If zero or negative values were allowed, it would not terminate — and that is exactly why such problems state that all values are positive.',
    },
  ],
};

const PERMUTATIONS: CourseLesson = {
  slug: 'permutations',
  title: 'Permutations',
  tagline: 'Every ordering of n elements — by choosing what goes first, then permuting the rest.',
  topic: 'recursion',
  minutes: 12,
  practice: ['permutations', 'n-queens'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'Order matters here, so nothing is ever out of reach: at each position you may pick **any element you have not used yet**. `n` choices, then `n - 1`, then `n - 2` — that is `n!` orderings.',
    },
    {
      kind: 'diagram',
      art: `nums = [1, 2, 3]

 first=1        first=2        first=3
  /   \\          /   \\          /   \\
[1,2,3][1,3,2] [2,1,3][2,3,1] [3,1,2][3,2,1]

3 x 2 x 1 = 6 permutations`,
    },
    { kind: 'heading', text: 'With a used array' },
    {
      kind: 'para',
      text: 'The clearest version tracks which elements are already placed. The loop starts at 0 every time — unlike combinations — because any unused element may come next.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> out = new ArrayList<>();
    walk(nums, new boolean[nums.length], new ArrayList<>(), out);
    return out;
}

void walk(int[] nums, boolean[] used, List<Integer> current, List<List<Integer>> out) {
    if (current.size() == nums.length) { out.add(new ArrayList<>(current)); return; }

    for (int i = 0; i < nums.length; i++) {     // from 0 — order matters
        if (used[i]) continue;

        used[i] = true;
        current.add(nums[i]);

        walk(nums, used, current, out);

        current.remove(current.size() - 1);     // undo both
        used[i] = false;
    }
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def permute(nums: list[int]) -> list[list[int]]:
    out: list[list[int]] = []
    current: list[int] = []
    used = [False] * len(nums)

    def walk() -> None:
        if len(current) == len(nums):
            out.append(current[:])
            return

        for i, value in enumerate(nums):
            if used[i]:
                continue

            used[i] = True
            current.append(value)
            walk()
            current.pop()
            used[i] = False

    walk()
    return out`,
    },
    { kind: 'heading', text: 'The swap version: no extra memory' },
    {
      kind: 'para',
      text: 'Instead of tracking what is used, build the permutation in place. At depth `k`, swap each candidate into position `k`, recurse, then swap it back. The array itself is the state.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `void permuteInPlace(int[] nums, int k, List<List<Integer>> out) {
    if (k == nums.length) { out.add(toList(nums)); return; }

    for (int i = k; i < nums.length; i++) {
        swap(nums, k, i);
        permuteInPlace(nums, k + 1, out);
        swap(nums, k, i);            // restore, or later branches see a shuffled array
    }
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def permute_in_place(nums: list[int], k: int, out: list[list[int]]) -> None:
    if k == len(nums):
        out.append(nums[:])
        return

    for i in range(k, len(nums)):
        nums[k], nums[i] = nums[i], nums[k]
        permute_in_place(nums, k + 1, out)
        nums[k], nums[i] = nums[i], nums[k]   # restore, or later branches see a shuffle`,
    },
    {
      kind: 'callout',
      tone: 'key',
      text: 'The swap version is elegant but loses the input order, so it does **not** handle duplicates with the usual sorted skip. If duplicates are in play, use the `used` array version with a sorted input.',
    },
    { kind: 'heading', text: 'Duplicates' },
    {
      kind: 'code',
      language: 'java',
      caption: 'nums sorted first; the guard keeps equal values in their original relative order.',
      source: `for (int i = 0; i < nums.length; i++) {
    if (used[i]) continue;
    // Use a duplicate only if its twin to the left has already been placed.
    if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) continue;

    used[i] = true;
    current.add(nums[i]);
    walk(nums, used, current, out);
    current.remove(current.size() - 1);
    used[i] = false;
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `for i, value in enumerate(nums):
    if used[i]:
        continue
    # Use a duplicate only if its twin to the left has already been placed.
    if i and value == nums[i - 1] and not used[i - 1]:
        continue

    used[i] = True
    current.append(value)
    walk(current, used)
    current.pop()
    used[i] = False`,
    },
    {
      kind: 'para',
      text: 'Read the guard as a rule: among equal values, always take the leftmost unused one. That fixes a single canonical ordering for each group of duplicates, so each distinct permutation is generated exactly once.',
    },
    {
      kind: 'table',
      headers: ['n', 'n! permutations', 'Feasible?'],
      rows: [
        ['8', '40,320', 'instant'],
        ['10', '3,628,800', 'fine'],
        ['12', '479,001,600', 'borderline'],
        ['13 and up', 'over 6 billion', 'needs a different idea entirely'],
      ],
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Where people go wrong',
      text: 'Forgetting to undo `used[i] = false` after the recursive call. The first branch then poisons every sibling branch, and you get a handful of permutations instead of `n!`. Every backtracking bug is some version of an undo that did not happen.',
    },
    {
      kind: 'callout',
      tone: 'why',
      title: 'Why this matters beyond the exercise',
      text: 'N-Queens, sudoku and word search are all this loop with a stronger validity check. Once the shape — choose, recurse, undo — is automatic, those problems stop being about the recursion and become about the pruning.',
    },
    {
      kind: 'check',
      question: 'Combinations advance the loop start; permutations do not. Why the difference?',
      answer:
        'In a combination the order of the chosen elements is irrelevant, so fixing one order (left to right) avoids counting the same set twice. In a permutation the order *is* the answer, so every unused element must be allowed at every position.',
    },
  ],
};

export const BACKTRACKING_LESSONS: CourseLesson[] = [SUBSETS, COMBINATIONS, PERMUTATIONS];
