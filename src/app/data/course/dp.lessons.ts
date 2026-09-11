import { CourseLesson } from './course.model';

const KNAPSACK_01: CourseLesson = {
  slug: 'knapsack-0-1',
  title: '0/1 knapsack',
  tagline: 'Each item is taken once or not at all. The table that answers it underlies half of all DP problems.',
  topic: 'dynamic-programming',
  minutes: 16,
  practice: ['coin-change', 'climbing-stairs', 'longest-increasing-subsequence'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'You have a bag that holds `C` units of weight and a pile of items, each with a weight and a value. Every item is a single yes/no decision — there is only one of it. Maximise the value you carry.',
    },
    {
      kind: 'visual',
      name: 'dp-table',
      caption: 'Each cell is one subproblem; the answer to a bigger cell is built from smaller ones.',
    },
    { kind: 'heading', text: 'The state, and why it has two dimensions' },
    {
      kind: 'para',
      text: 'Ask what you need to know to make the next decision: **which items are still on offer**, and **how much room is left**. That gives `best[i][c]` = the most value obtainable using the first `i` items with capacity `c`.',
    },
    {
      kind: 'callout',
      tone: 'key',
      text: '`best[i][c] = max(best[i-1][c], value[i] + best[i-1][c - weight[i]])` — skip the item, or take it and pay its weight. The second option only exists when `weight[i] <= c`.',
    },
    {
      kind: 'diagram',
      art: `items  (w=1,v=1) (w=3,v=4) (w=4,v=5) (w=5,v=7)    capacity 7

 c ->    0  1  2  3  4  5  6  7
 none    0  0  0  0  0  0  0  0
 +w1     0  1  1  1  1  1  1  1
 +w3     0  1  1  4  5  5  5  5
 +w4     0  1  1  4  5  6  6  9
 +w5     0  1  1  4  5  7  8  9

answer 9 = items 2 and 3 (weights 3 + 4, values 4 + 5)`,
    },
    {
      kind: 'code',
      language: 'java',
      caption: 'The readable two-dimensional version.',
      source: `int knapsack(int[] weight, int[] value, int capacity) {
    int n = weight.length;
    int[][] best = new int[n + 1][capacity + 1];

    for (int i = 1; i <= n; i++) {
        for (int c = 0; c <= capacity; c++) {
            best[i][c] = best[i - 1][c];                       // skip item i-1

            if (weight[i - 1] <= c) {
                int take = value[i - 1] + best[i - 1][c - weight[i - 1]];
                best[i][c] = Math.max(best[i][c], take);
            }
        }
    }

    return best[n][capacity];
}`,
    },
    { kind: 'heading', text: 'Squeezing it to one row' },
    {
      kind: 'para',
      text: 'Row `i` only reads row `i - 1`, so one array suffices — but the direction matters. Iterate the capacity **downwards**. Going upwards would let an item be used twice, because the cell you read would already have been updated in this same round.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `int knapsackOneRow(int[] weight, int[] value, int capacity) {
    int[] best = new int[capacity + 1];

    for (int i = 0; i < weight.length; i++) {
        for (int c = capacity; c >= weight[i]; c--) {   // downwards: each item once
            best[c] = Math.max(best[c], value[i] + best[c - weight[i]]);
        }
    }

    return best[capacity];
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def knapsack(weights: list[int], values: list[int], capacity: int) -> int:
    best = [0] * (capacity + 1)

    for weight, value in zip(weights, values):
        for c in range(capacity, weight - 1, -1):      # downwards
            best[c] = max(best[c], value + best[c - weight])

    return best[capacity]`,
    },
    {
      kind: 'callout',
      tone: 'why',
      title: 'Why the loop direction is the whole lesson',
      text: 'Downwards = each item at most once (0/1). Upwards = unlimited copies. That one character is the entire difference between the two classic knapsacks, and it is the detail interviewers probe.',
    },
    { kind: 'heading', text: 'Recognising it in disguise' },
    {
      kind: 'table',
      caption: 'All of these are the same table with a different combine step.',
      headers: ['Problem', 'Weight', 'Value', 'Combine'],
      rows: [
        ['Can a subset sum to T?', 'the number', '—', 'boolean OR'],
        ['Partition into two equal halves', 'the number', '—', 'target = total / 2'],
        ['Count subsets summing to T', 'the number', '—', 'addition, not max'],
        ['Minimum difference of two subsets', 'the number', '—', 'closest reachable to total / 2'],
        ['Target sum with + and -', 'the number', '—', 'reduces to a subset sum'],
        ['Last stone weight II', 'stone weight', '—', 'same as minimum difference'],
      ],
    },
    {
      kind: 'code',
      language: 'python',
      caption: 'Subset sum — the boolean knapsack, and the one that appears most often.',
      source: `def can_partition(nums: list[int]) -> bool:
    total = sum(nums)
    if total % 2:
        return False

    target = total // 2
    reachable = [False] * (target + 1)
    reachable[0] = True

    for value in nums:
        for c in range(target, value - 1, -1):
            reachable[c] = reachable[c] or reachable[c - value]

    return reachable[target]`,
    },
    { kind: 'heading', text: 'Recovering which items were chosen' },
    {
      kind: 'para',
      text: 'Keep the full table and walk back from `best[n][capacity]`. If the cell equals the one above it, the item was skipped; otherwise it was taken, so subtract its weight and move up.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `List<Integer> chosenItems(int[][] best, int[] weight, int capacity) {
    List<Integer> chosen = new ArrayList<>();

    for (int i = best.length - 1, c = capacity; i > 0; i--) {
        if (best[i][c] != best[i - 1][c]) {     // this item made the difference
            chosen.add(i - 1);
            c -= weight[i - 1];
        }
    }

    Collections.reverse(chosen);
    return chosen;
}`,
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Where people go wrong',
      text: 'Calling `O(n · C)` polynomial. It is **pseudo-polynomial** — `C` is a value, not an input size, so a capacity of a billion is hopeless even with ten items. If the capacity is huge and `n` is small, the intended solution is meet-in-the-middle or a search, not this table.',
    },
    {
      kind: 'check',
      question: 'Why must the one-row capacity loop run downwards for 0/1?',
      answer:
        'Because `best[c - weight]` must still hold the value from *before* this item was considered. Iterating upwards overwrites the smaller capacities first, so the item gets counted again — which is exactly the unbounded knapsack, and wrong here.',
    },
  ],
};

const KNAPSACK_UNBOUNDED: CourseLesson = {
  slug: 'knapsack-unbounded',
  title: 'Unbounded knapsack',
  tagline: 'Unlimited copies of each item — one loop direction apart from the 0/1 version.',
  topic: 'dynamic-programming',
  minutes: 13,
  practice: ['coin-change', 'climbing-stairs'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'Same bag, same items, but you may take each item as many times as you like. Coin change is this problem wearing a hat: each coin is an item of unlimited supply, and the capacity is the amount you owe.',
    },
    {
      kind: 'callout',
      tone: 'key',
      text: 'Flip the capacity loop to run **upwards** and the 0/1 solution becomes the unbounded one. Reading an already-updated cell is no longer a bug — it is the feature, because it means the item was reused.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `int unboundedKnapsack(int[] weight, int[] value, int capacity) {
    int[] best = new int[capacity + 1];

    for (int c = 1; c <= capacity; c++) {
        for (int i = 0; i < weight.length; i++) {
            if (weight[i] <= c) {
                best[c] = Math.max(best[c], value[i] + best[c - weight[i]]);
            }
        }
    }

    return best[capacity];
}`,
    },
    { kind: 'heading', text: 'Coin change: fewest coins' },
    {
      kind: 'para',
      text: 'Swap `max` for `min` and values for counts. The sentinel matters: fill with something larger than any real answer so that "unreachable" propagates correctly, and check for it at the end.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `int coinChange(int[] coins, int amount) {
    int[] fewest = new int[amount + 1];
    Arrays.fill(fewest, amount + 1);      // sentinel: larger than any real answer
    fewest[0] = 0;

    for (int total = 1; total <= amount; total++) {
        for (int coin : coins) {
            if (coin <= total) fewest[total] = Math.min(fewest[total], 1 + fewest[total - coin]);
        }
    }

    return fewest[amount] > amount ? -1 : fewest[amount];
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def coin_change(coins: list[int], amount: int) -> int:
    INF = amount + 1
    fewest = [0] + [INF] * amount

    for total in range(1, amount + 1):
        for coin in coins:
            if coin <= total:
                fewest[total] = min(fewest[total], 1 + fewest[total - coin])

    return -1 if fewest[amount] > amount else fewest[amount]`,
    },
    { kind: 'heading', text: 'Counting ways: the loop order changes the question' },
    {
      kind: 'para',
      text: 'This is the subtlest point in all of introductory DP, and it is worth slowing down for. To count **combinations** — where `1+2` and `2+1` are the same — put the item loop on the outside. To count **permutations**, where order matters, put the amount loop on the outside.',
    },
    {
      kind: 'code',
      language: 'python',
      caption: 'Same three lines, different nesting, different answer.',
      source: `def count_combinations(coins: list[int], amount: int) -> int:
    ways = [1] + [0] * amount
    for coin in coins:                    # coins outside
        for total in range(coin, amount + 1):
            ways[total] += ways[total - coin]
    return ways[amount]


def count_permutations(coins: list[int], amount: int) -> int:
    ways = [1] + [0] * amount
    for total in range(1, amount + 1):    # amount outside
        for coin in coins:
            if coin <= total:
                ways[total] += ways[total - coin]
    return ways[amount]`,
    },
    {
      kind: 'callout',
      tone: 'why',
      title: 'Why the nesting decides it',
      text: 'With coins outside, every solution is built in a fixed coin order — smallest coin index first — so each multiset is counted exactly once. With the amount outside, any coin may be the last one added, so each *ordering* is counted separately.',
    },
    {
      kind: 'diagram',
      art: `coins [1, 2], amount 3

combinations (coins outside)      1+1+1,  1+2            -> 2
permutations (amount outside)     1+1+1, 1+2, 2+1        -> 3`,
    },
    {
      kind: 'table',
      headers: ['Problem', 'Combine', 'Loop order'],
      rows: [
        ['Fewest coins', 'min + 1', 'either'],
        ['Can the amount be made?', 'boolean OR', 'either'],
        ['Number of combinations', 'sum', 'coins outside'],
        ['Number of ordered sequences', 'sum', 'amount outside'],
        ['Maximum value (rod cutting)', 'max', 'either'],
        ['Longest sequence of cuts', 'max + 1', 'either'],
      ],
    },
    {
      kind: 'para',
      text: 'A note on greed: taking the largest coin first works for real currency and fails in general. With coins `{1, 3, 4}` and amount `6`, greedy gives `4 + 1 + 1` — three coins — while the table finds `3 + 3`. Unless a problem states its denominations are canonical, use the DP.',
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Where people go wrong',
      text: 'Using `Integer.MAX_VALUE` as the sentinel and then computing `1 + fewest[...]`, which overflows to a negative number and silently wins the `min`. Use `amount + 1` instead — it is unreachable but safe to add to.',
    },
    {
      kind: 'check',
      question: 'Climbing stairs with steps of 1 or 2 — which knapsack is it, and which count?',
      answer:
        'Unbounded, counting **permutations**: taking a 1 then a 2 is a different way of climbing from a 2 then a 1. So the amount loop goes on the outside — and the recurrence collapses to Fibonacci.',
    },
  ],
};

const LCS: CourseLesson = {
  slug: 'longest-common-subsequence',
  title: 'Longest common subsequence',
  tagline: 'The two-string grid. Edit distance, diffs and the LIS trick are all this one table.',
  topic: 'dynamic-programming',
  minutes: 15,
  practice: ['edit-distance', 'longest-increasing-subsequence', 'longest-palindromic-substring'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'A subsequence keeps order but may skip characters. Given two strings, how long is the longest sequence appearing in both? Compare them character by character in a grid: **matching characters extend the answer diagonally**, mismatches take the better of dropping one character from either string.',
    },
    {
      kind: 'callout',
      tone: 'key',
      text: 'If `a[i] == b[j]` then `lcs[i][j] = 1 + lcs[i-1][j-1]`. Otherwise `lcs[i][j] = max(lcs[i-1][j], lcs[i][j-1])`. Two lines, and the whole family follows.',
    },
    {
      kind: 'diagram',
      art: `        ""  a  b  c  d  e
    ""   0  0  0  0  0  0
     a   0  1  1  1  1  1
     c   0  1  1  2  2  2
     e   0  1  1  2  2  3

"ace" vs "abcde"  ->  3, the subsequence "ace"
diagonal moves are matches; the path is the answer`,
    },
    {
      kind: 'code',
      language: 'java',
      source: `int longestCommonSubsequence(String a, String b) {
    int[][] lcs = new int[a.length() + 1][b.length() + 1];

    for (int i = 1; i <= a.length(); i++) {
        for (int j = 1; j <= b.length(); j++) {
            if (a.charAt(i - 1) == b.charAt(j - 1)) {
                lcs[i][j] = 1 + lcs[i - 1][j - 1];      // match: extend
            } else {
                lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
            }
        }
    }

    return lcs[a.length()][b.length()];
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def longest_common_subsequence(a: str, b: str) -> int:
    previous = [0] * (len(b) + 1)

    for char_a in a:
        current = [0] * (len(b) + 1)
        for j, char_b in enumerate(b, start=1):
            if char_a == char_b:
                current[j] = 1 + previous[j - 1]
            else:
                current[j] = max(previous[j], current[j - 1])
        previous = current

    return previous[len(b)]`,
    },
    { kind: 'heading', text: 'Rebuilding the subsequence' },
    {
      kind: 'para',
      text: 'Walk back from the bottom-right corner. A diagonal step means the characters matched, so prepend that character; otherwise move towards the larger neighbour. The path you trace *is* the subsequence.',
    },
    {
      kind: 'code',
      language: 'python',
      source: `def rebuild(a: str, b: str, lcs: list[list[int]]) -> str:
    out: list[str] = []
    i, j = len(a), len(b)

    while i > 0 and j > 0:
        if a[i - 1] == b[j - 1]:
            out.append(a[i - 1])
            i, j = i - 1, j - 1
        elif lcs[i - 1][j] >= lcs[i][j - 1]:
            i -= 1
        else:
            j -= 1

    return ''.join(reversed(out))`,
    },
    { kind: 'heading', text: 'Edit distance: the same grid, three moves' },
    {
      kind: 'para',
      text: 'Levenshtein distance asks for the fewest insertions, deletions and substitutions turning one string into another. Same grid, but now you are minimising, and the three non-matching moves each cost 1.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `int editDistance(String a, String b) {
    int[][] cost = new int[a.length() + 1][b.length() + 1];

    for (int i = 0; i <= a.length(); i++) cost[i][0] = i;    // delete everything
    for (int j = 0; j <= b.length(); j++) cost[0][j] = j;    // insert everything

    for (int i = 1; i <= a.length(); i++) {
        for (int j = 1; j <= b.length(); j++) {
            if (a.charAt(i - 1) == b.charAt(j - 1)) {
                cost[i][j] = cost[i - 1][j - 1];             // free
            } else {
                cost[i][j] = 1 + Math.min(cost[i - 1][j - 1],          // replace
                                 Math.min(cost[i - 1][j],              // delete
                                          cost[i][j - 1]));            // insert
            }
        }
    }

    return cost[a.length()][b.length()];
}`,
    },
    {
      kind: 'table',
      caption: 'One grid, many questions.',
      headers: ['Problem', 'Change to the recurrence'],
      rows: [
        ['Longest common subsequence', 'the base case'],
        ['Edit distance', 'minimise; three moves cost 1 each'],
        ['Minimum deletions to make strings equal', '`m + n - 2 · lcs`'],
        ['Shortest common supersequence', '`m + n - lcs`'],
        ['Is one string a subsequence of the other?', 'greedy two pointers — no table needed'],
        ['Longest palindromic subsequence', 'LCS of the string and its reverse'],
        ['Longest increasing subsequence', 'LCS with the sorted distinct values'],
      ],
    },
    {
      kind: 'callout',
      tone: 'why',
      title: 'Why LIS deserves its own method',
      text: 'LCS-with-sorted-values solves LIS in `O(n^2)`, which is fine for small inputs. But LIS has a `O(n log n)` solution — keep the smallest possible tail for each length and binary search the insertion point — and that is the one to reach for when `n` is large.',
    },
    {
      kind: 'code',
      language: 'python',
      caption: 'Longest increasing subsequence in O(n log n).',
      source: `from bisect import bisect_left


def length_of_lis(nums: list[int]) -> int:
    tails: list[int] = []        # tails[k] = smallest tail of an increasing run of length k+1

    for value in nums:
        position = bisect_left(tails, value)
        if position == len(tails):
            tails.append(value)
        else:
            tails[position] = value

    return len(tails)`,
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Where people go wrong',
      text: 'Confusing subsequence with substring. A **substring** is contiguous, so the recurrence resets to 0 on a mismatch and the answer is the maximum cell, not the corner. Read the word in the title before writing a line.',
    },
    {
      kind: 'check',
      question: 'Why does the space-optimised version keep two rows rather than one?',
      answer:
        'Because a match reads the diagonal `lcs[i-1][j-1]` — the previous row at the previous column. With a single row that value has already been overwritten, so you either keep two rows or stash the diagonal in a temporary variable before overwriting.',
    },
  ],
};

const PALINDROMES: CourseLesson = {
  slug: 'palindromes',
  title: 'Palindromes',
  tagline: 'Expand from the centre for substrings, fill an interval table for subsequences.',
  topic: 'strings',
  minutes: 14,
  practice: ['longest-palindromic-substring', 'valid-palindrome-one-delete', 'edit-distance'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'A palindrome reads the same both ways, so every one of them has a **centre**. There are only `2n - 1` possible centres — each character, and each gap between two characters — so try them all and grow outwards while the characters match.',
    },
    {
      kind: 'visual',
      name: 'palindrome',
      caption: 'Two pointers leaving a centre, stopping at the first mismatch.',
    },
    { kind: 'heading', text: 'Expand around centre' },
    {
      kind: 'para',
      text: 'Two centres per index handles both lengths: `(i, i)` for odd palindromes and `(i, i + 1)` for even ones. `O(n^2)` time, `O(1)` space, and short enough to write correctly under pressure — which is why it beats the "clever" DP table in an interview.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `String longestPalindrome(String s) {
    if (s.isEmpty()) return "";
    int start = 0, length = 1;

    for (int centre = 0; centre < s.length(); centre++) {
        for (int offset = 0; offset <= 1; offset++) {      // odd, then even
            int left = centre, right = centre + offset;

            while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
                if (right - left + 1 > length) { start = left; length = right - left + 1; }
                left--;
                right++;
            }
        }
    }

    return s.substring(start, start + length);
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def longest_palindrome(s: str) -> str:
    best = ''

    def grow(left: int, right: int) -> str:
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return s[left + 1:right]

    for centre in range(len(s)):
        for candidate in (grow(centre, centre), grow(centre, centre + 1)):
            if len(candidate) > len(best):
                best = candidate

    return best`,
    },
    { kind: 'heading', text: 'Counting palindromic substrings' },
    {
      kind: 'para',
      text: 'The same loop answers "how many palindromic substrings are there?" — every successful expansion *is* one, so count instead of measuring. No extra thinking required, which is the mark of a pattern worth owning.',
    },
    {
      kind: 'code',
      language: 'python',
      source: `def count_palindromic_substrings(s: str) -> int:
    total = 0

    for centre in range(len(s)):
        for left, right in ((centre, centre), (centre, centre + 1)):
            while left >= 0 and right < len(s) and s[left] == s[right]:
                total += 1                # each valid expansion is a palindrome
                left -= 1
                right += 1

    return total`,
    },
    { kind: 'heading', text: 'The interval DP table' },
    {
      kind: 'para',
      text: 'When you need more than the longest one — partitioning the string, or the longest palindromic *subsequence* — build a table over intervals. `isPalindrome[i][j]` is true when the ends match and the inside is already known to be a palindrome, so fill it by increasing length.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `boolean[][] palindromeTable(String s) {
    int n = s.length();
    boolean[][] isPalindrome = new boolean[n][n];

    for (int i = 0; i < n; i++) isPalindrome[i][i] = true;

    for (int length = 2; length <= n; length++) {
        for (int i = 0; i + length - 1 < n; i++) {
            int j = i + length - 1;
            boolean endsMatch = s.charAt(i) == s.charAt(j);
            isPalindrome[i][j] = endsMatch && (length == 2 || isPalindrome[i + 1][j - 1]);
        }
    }

    return isPalindrome;
}`,
    },
    {
      kind: 'callout',
      tone: 'key',
      text: 'Fill interval tables by **increasing length**, not by row. `isPalindrome[i][j]` depends on `isPalindrome[i+1][j-1]`, a shorter interval, so any order that completes shorter intervals first works — and length order is the one that obviously does.',
    },
    { kind: 'heading', text: 'Longest palindromic subsequence' },
    {
      kind: 'para',
      text: 'Not contiguous this time, so centres do not help. There is a neat reduction: a palindromic subsequence of `s` is exactly a common subsequence of `s` and its reverse. So the answer is `LCS(s, reverse(s))` — no new algorithm at all.',
    },
    {
      kind: 'code',
      language: 'python',
      source: `def longest_palindromic_subsequence(s: str) -> int:
    return longest_common_subsequence(s, s[::-1])`,
    },
    {
      kind: 'table',
      headers: ['Question', 'Technique', 'Cost'],
      rows: [
        ['Is this string a palindrome?', 'two pointers from the ends', 'O(n)'],
        ['Palindrome after deleting one character', 'two pointers, branch at the mismatch', 'O(n)'],
        ['Longest palindromic substring', 'expand around centre', 'O(n^2), O(1) space'],
        ['Count palindromic substrings', 'expand around centre, counting', 'O(n^2)'],
        ['Longest palindromic subsequence', 'LCS with the reverse', 'O(n^2)'],
        ['Fewest cuts into palindromes', 'palindrome table + DP over prefixes', 'O(n^2)'],
        ['Longest palindromic substring, optimal', "Manacher's algorithm", 'O(n)'],
      ],
    },
    {
      kind: 'para',
      text: "Manacher's algorithm gets the longest palindromic substring to `O(n)` by reusing the mirror of each centre inside an already-known palindrome. It is worth knowing it exists; it is almost never what an interviewer wants to see written out.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Where people go wrong',
      text: 'Only checking odd centres, so `"abba"` comes back as `"a"`. Every expand-around-centre loop needs both `(i, i)` and `(i, i + 1)` — and an even-length test case is the fastest way to catch the omission.',
    },
    {
      kind: 'check',
      question: 'Why does expand-around-centre need no extra memory when the DP table needs O(n^2)?',
      answer:
        'Because it answers only one question — the longest — and can forget every centre as soon as it finishes. The table stores the answer for *every* interval, which is what problems like "fewest palindromic cuts" need to look up repeatedly.',
    },
  ],
};

export const DP_LESSONS: CourseLesson[] = [KNAPSACK_01, KNAPSACK_UNBOUNDED, LCS, PALINDROMES];
