import { WorkedProblem } from './problem.model';

export const ARRAY_PROBLEMS: WorkedProblem[] = [
  // -------------------------------------------------------------------- arrays
  {
    slug: 'max-subarray-sum',
    title: 'Largest sum of a contiguous block',
    topic: 'arrays',
    pattern: 'dynamic-programming',
    difficulty: 'Medium',
    statement: 'Given an array that may contain negative numbers, find the largest sum achievable by any contiguous run of at least one element.',
    example: { input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6', note: 'the run [4, -1, 2, 1]' },
    hints: [
      'Ask a local question: what is the best run that ends exactly at index i?',
      'That run either extends the best run ending at i-1, or starts fresh at i.',
      'Track the global best separately from the running one.',
      'What if every value is negative?',
    ],
    bruteForce: { idea: 'Try every pair of endpoints and sum the range between them.', complexity: 'O(n²) with prefix sums, O(n³) without' },
    optimal: {
      idea: "Kadane's algorithm. At each index choose between extending the previous run and restarting, then keep the best value ever seen.",
      complexity: 'O(n) time, O(1) space',
      language: 'java',
      code: `int endingHere = a[0], best = a[0];
for (int i = 1; i < a.length; i++) {
    endingHere = Math.max(a[i], endingHere + a[i]);
    best = Math.max(best, endingHere);
}
return best;`,
    },
    insight: 'Starting `best` at 0 silently returns 0 for an all-negative array. Starting both variables at `a[0]` handles it without a special case.',
  },
  {
    slug: 'subarray-sum-k',
    title: 'Count subarrays summing to k',
    topic: 'arrays',
    pattern: 'prefix-sum',
    difficulty: 'Medium',
    statement: 'Count how many contiguous subarrays have a sum exactly equal to `k`. Values may be negative.',
    example: { input: 'a = [1, 2, 3], k = 3', output: '2', note: '[1, 2] and [3]' },
    hints: [
      'A subarray sum is the difference of two prefix sums.',
      'So for each right end, which prefix value would complete it?',
      'Looking for a specific value means a hash map, not a scan.',
      'What represents the subarray that starts at index 0?',
    ],
    bruteForce: { idea: 'For every start, extend the end and accumulate, checking the running total.', complexity: 'O(n²) time, O(1) space' },
    optimal: {
      idea: 'Scan keeping the running sum and a map of how often each running sum has occurred. A subarray ending here sums to `k` whenever `running - k` has been seen.',
      complexity: 'O(n) time, O(n) space',
      language: 'java',
      code: `Map<Long, Integer> seen = new HashMap<>();
seen.put(0L, 1);                       // the empty prefix
long running = 0; int count = 0;

for (int value : a) {
    running += value;
    count += seen.getOrDefault(running - k, 0);
    seen.merge(running, 1, Integer::sum);
}
return count;`,
    },
    insight: 'Seeding the map with `{0: 1}` is what makes subarrays starting at index 0 count. Forgetting it is the standard bug in this whole family.',
  },
  {
    slug: 'product-except-self',
    title: 'Product of everything except the current element',
    topic: 'arrays',
    pattern: 'prefix-sum',
    difficulty: 'Medium',
    statement: 'Return an array where each position holds the product of every other element. You may not use division.',
    example: { input: '[1, 2, 3, 4]', output: '[24, 12, 8, 6]' },
    hints: [
      'The answer at i is (everything left of i) times (everything right of i).',
      'Both of those are running products.',
      'Can you reuse the output array to hold one of them?',
    ],
    bruteForce: { idea: 'For each position, loop over the rest of the array multiplying.', complexity: 'O(n²) time' },
    optimal: {
      idea: 'One left-to-right pass writes the prefix product into the output, then a right-to-left pass multiplies by a running suffix product held in a single variable.',
      complexity: 'O(n) time, O(1) extra space',
      language: 'java',
      code: `int[] out = new int[n];
out[0] = 1;
for (int i = 1; i < n; i++) out[i] = out[i - 1] * a[i - 1];

int suffix = 1;
for (int i = n - 1; i >= 0; i--) {
    out[i] *= suffix;
    suffix *= a[i];
}
return out;`,
    },
    insight: 'Division is banned for a reason: one zero makes it undefined everywhere, and two zeroes make the whole answer zero. The prefix-suffix version needs no special case.',
  },
  {
    slug: 'rotate-array',
    title: 'Rotate an array right by k',
    topic: 'arrays',
    pattern: 'in-place-reversal',
    difficulty: 'Medium',
    statement: 'Shift every element `k` positions to the right, wrapping around, using no extra array.',
    example: { input: 'a = [1,2,3,4,5,6,7], k = 3', output: '[5,6,7,1,2,3,4]' },
    hints: [
      'Rotating by n leaves the array unchanged.',
      'What does reversing the whole array get you, roughly?',
      'Then fix the two halves separately.',
    ],
    bruteForce: { idea: 'Shift every element one place, k times.', complexity: 'O(n · k)' },
    optimal: {
      idea: 'Reverse the whole array, then reverse the first `k` and the remaining `n - k`. Three linear reversals give the rotation in place.',
      complexity: 'O(n) time, O(1) space',
      language: 'java',
      code: `k %= n;                       // essential
reverse(a, 0, n - 1);
reverse(a, 0, k - 1);
reverse(a, k, n - 1);`,
    },
    insight: 'Take `k %= n` first. Skipping it is the quickest way to an index-out-of-bounds on a hidden test where `k > n`.',
  },

  // ------------------------------------------------------------------- strings
  {
    slug: 'longest-unique-substring',
    title: 'Longest run with no repeated character',
    topic: 'strings',
    pattern: 'sliding-window',
    difficulty: 'Medium',
    statement: 'Find the length of the longest contiguous run of characters in which no character appears twice.',
    example: { input: '"abcabcbb"', output: '3', note: '"abc"' },
    hints: [
      'The word "contiguous" points at a window.',
      'What single condition can break the window when a character arrives?',
      'Only the newly added character can cause a duplicate.',
      'Where should the answer be recorded — before or after shrinking?',
    ],
    bruteForce: { idea: 'Check every substring for uniqueness with a set.', complexity: 'O(n²) or worse' },
    optimal: {
      idea: 'A window with a character count. Extend right; while the entering character appears twice, remove from the left. Record the length once the window is valid again.',
      complexity: 'O(n) time, O(alphabet) space',
      language: 'java',
      code: `int[] count = new int[128];
int left = 0, best = 0;

for (int right = 0; right < s.length(); right++) {
    char c = s.charAt(right);
    count[c]++;
    while (count[c] > 1) count[s.charAt(left++)]--;
    best = Math.max(best, right - left + 1);
}
return best;`,
    },
    insight: 'For "longest", record after restoring the invariant. For "shortest", record before shrinking past it. Getting that backwards is the classic window bug.',
  },
  {
    slug: 'group-anagrams',
    title: 'Group words that are rearrangements of each other',
    topic: 'strings',
    pattern: 'frequency-counting',
    difficulty: 'Medium',
    statement: 'Given a list of lowercase words, group together all words that use exactly the same letters with the same counts.',
    example: { input: '["eat", "tea", "tan", "ate", "nat"]', output: '[["eat","tea","ate"], ["tan","nat"]]' },
    hints: [
      'Comparing every pair is quadratic. What would let you bucket them instead?',
      'Find one value that every member of a group produces and no outsider does.',
      'Sorting the letters works — is there something cheaper?',
    ],
    bruteForce: { idea: 'Compare every pair of words for anagram-ness and union the matches.', complexity: 'O(n² · k)' },
    optimal: {
      idea: 'Map each word to a canonical key and group by it in a hash map. The 26-slot count vector avoids the sort entirely.',
      complexity: 'O(n · k) time, O(n · k) space',
      language: 'java',
      code: `Map<String, List<String>> groups = new HashMap<>();

for (String word : words) {
    int[] count = new int[26];
    for (char c : word.toCharArray()) count[c - 'a']++;
    String key = Arrays.toString(count);
    groups.computeIfAbsent(key, k -> new ArrayList<>()).add(word);
}
return new ArrayList<>(groups.values());`,
    },
    insight: 'Canonical form is a reusable move, not a string trick: define the equivalence, find a key every member produces, then let the map do the grouping.',
  },
  {
    slug: 'longest-palindromic-substring',
    title: 'Longest palindromic substring',
    topic: 'strings',
    pattern: 'two-pointers',
    difficulty: 'Medium',
    statement: 'Return the longest contiguous substring that reads the same forwards and backwards.',
    example: { input: '"babad"', output: '"bab"', note: '"aba" is equally valid' },
    hints: [
      'Every palindrome has a centre. How many possible centres are there?',
      'Odd-length palindromes centre on a character; even-length ones centre between two.',
      'Grow outward while the two ends match.',
    ],
    bruteForce: { idea: 'Check every substring for being a palindrome.', complexity: 'O(n³)' },
    optimal: {
      idea: 'Try all `2n - 1` centres and expand outward while the characters match, keeping the widest result.',
      complexity: 'O(n²) time, O(1) space',
      language: 'java',
      code: `for (int centre = 0; centre < n; centre++) {
    expand(centre, centre);       // odd length
    expand(centre, centre + 1);   // even length
}

void expand(int lo, int hi) {
    while (lo >= 0 && hi < n && s.charAt(lo) == s.charAt(hi)) { lo--; hi++; }
    int length = hi - lo - 1;     // the loop overshot by one each side
    if (length > best) { best = length; start = lo + 1; }
}`,
    },
    insight: 'Forgetting the even-length centres returns "bb" for "abba". Manacher gets this to O(n), but knowing that it exists is usually enough.',
  },
  {
    slug: 'valid-palindrome-one-delete',
    title: 'Palindrome after removing at most one character',
    topic: 'strings',
    pattern: 'two-pointers',
    difficulty: 'Medium',
    statement: 'Decide whether a string can be made into a palindrome by deleting at most one character.',
    example: { input: '"abca"', output: 'true', note: 'remove "b" or "c"' },
    hints: [
      'Walk in from both ends while the characters match.',
      'At the first mismatch you have exactly two options.',
      'Each option is a plain palindrome check on a shorter range.',
    ],
    bruteForce: { idea: 'Try removing each character in turn and test the result.', complexity: 'O(n²)' },
    optimal: {
      idea: 'Two pointers until a mismatch, then test whether skipping the left character or skipping the right one leaves a palindrome. Only one mismatch is allowed, so only one branch point exists.',
      complexity: 'O(n) time, O(1) space',
      language: 'java',
      code: `int lo = 0, hi = s.length() - 1;
while (lo < hi) {
    if (s.charAt(lo) != s.charAt(hi))
        return isPalindrome(s, lo + 1, hi) || isPalindrome(s, lo, hi - 1);
    lo++; hi--;
}
return true;`,
    },
    insight: 'The branch happens at most once, so the two extra checks are linear in total — not quadratic as they first appear.',
  },

  // ------------------------------------------------------------------- hashing
  {
    slug: 'two-sum',
    title: 'Two values that add to a target',
    topic: 'hashing',
    pattern: 'hashing',
    difficulty: 'Easy',
    statement: 'Return the indices of the two elements that sum to a given target. Exactly one such pair exists.',
    example: { input: 'a = [2, 7, 11, 15], target = 9', output: '[0, 1]' },
    hints: [
      'For each element, what would its partner have to be?',
      'Searching for a specific value is a lookup, not a scan.',
      'Does the order of check-then-insert matter?',
    ],
    bruteForce: { idea: 'Check every pair of indices.', complexity: 'O(n²) time, O(1) space' },
    optimal: {
      idea: 'One pass with a map from value to index. For each element compute the complement and look it up before inserting the current value.',
      complexity: 'O(n) time, O(n) space',
      language: 'java',
      code: `Map<Integer, Integer> seen = new HashMap<>();
for (int i = 0; i < n; i++) {
    int need = target - a[i];
    if (seen.containsKey(need)) return new int[] { seen.get(need), i };
    seen.put(a[i], i);   // insert after checking
}`,
    },
    insight: 'Inserting before checking lets an element pair with itself when `target == 2·a[i]`. That is a wrong answer, not a crash, which makes it worse.',
  },
  {
    slug: 'longest-consecutive',
    title: 'Longest run of consecutive numbers',
    topic: 'hashing',
    pattern: 'hashing',
    difficulty: 'Medium',
    statement: 'Given an unsorted array, find the length of the longest sequence of consecutive integers present in it. Aim for linear time.',
    example: { input: '[100, 4, 200, 1, 3, 2]', output: '4', note: '1, 2, 3, 4' },
    hints: [
      'Sorting gives O(n log n). The requirement rules it out.',
      'Put everything in a set so membership is instant.',
      'Only start counting from the beginning of a run — how do you recognise one?',
    ],
    bruteForce: { idea: 'Sort and scan for the longest consecutive stretch.', complexity: 'O(n log n)' },
    optimal: {
      idea: 'A hash set plus a guard: only start walking upward from a value whose predecessor is absent. Every run is then walked exactly once.',
      complexity: 'O(n) time, O(n) space',
      language: 'java',
      code: `Set<Integer> set = new HashSet<>(list);
int best = 0;

for (int value : set) {
    if (set.contains(value - 1)) continue;   // not the start of a run
    int length = 1;
    while (set.contains(value + length)) length++;
    best = Math.max(best, length);
}
return best;`,
    },
    insight: 'The `value - 1` guard is what keeps it linear. Without it the inner loop re-walks every run from every member, making it quadratic.',
  },
  {
    slug: 'top-k-frequent',
    title: 'The k most frequent values',
    topic: 'hashing',
    pattern: 'heap-top-k',
    difficulty: 'Medium',
    statement: 'Return the `k` values that appear most often in an array.',
    example: { input: 'a = [1,1,1,2,2,3], k = 2', output: '[1, 2]' },
    hints: [
      'You need counts before you can rank anything.',
      'Sorting the counts is O(n log n). Can you do better?',
      'What is the largest a frequency can possibly be?',
    ],
    bruteForce: { idea: 'Count, then sort all entries by frequency and take the first k.', complexity: 'O(n log n)' },
    optimal: {
      idea: 'Count, then bucket by frequency. Since no frequency exceeds `n`, an array of lists indexed by count can be read from the back for a linear answer. A size-k min-heap gives `O(n log k)` and works on streams.',
      complexity: 'O(n) time with bucketing, O(n) space',
      language: 'java',
      code: `Map<Integer, Integer> count = new HashMap<>();
for (int value : a) count.merge(value, 1, Integer::sum);

List<Integer>[] buckets = new List[a.length + 1];
count.forEach((value, freq) -> {
    if (buckets[freq] == null) buckets[freq] = new ArrayList<>();
    buckets[freq].add(value);
});

List<Integer> out = new ArrayList<>();
for (int f = a.length; f >= 1 && out.size() < k; f--)
    if (buckets[f] != null) out.addAll(buckets[f]);`,
    },
    insight: 'Whenever the key you would sort by is bounded by `n`, bucketing replaces the sort and removes the log factor entirely.',
  },
  {
    slug: 'valid-sudoku',
    title: 'Is this Sudoku board valid so far?',
    topic: 'hashing',
    pattern: 'hashing',
    difficulty: 'Medium',
    statement: 'Given a partially filled 9×9 grid, decide whether it breaks any Sudoku rule: no repeat within a row, a column, or a 3×3 box.',
    example: { input: 'a board with two 5s in the top row', output: 'false' },
    hints: [
      'Three independent constraints, all of the same shape.',
      'A set per row, per column and per box.',
      'How do you map a cell to its box index?',
    ],
    bruteForce: { idea: 'Scan each row, then each column, then each box separately, three times over the board.', complexity: 'O(1) — the board is fixed, but the code is three times longer' },
    optimal: {
      idea: 'One pass, three arrays of sets. The box index is `(row / 3) * 3 + col / 3`, which is the only non-obvious line.',
      complexity: 'O(1) for a 9×9 board — O(n²) in general',
      language: 'java',
      code: `Set<Character>[] rows = new Set[9], cols = new Set[9], boxes = new Set[9];

for (int r = 0; r < 9; r++)
    for (int c = 0; c < 9; c++) {
        char v = board[r][c];
        if (v == '.') continue;
        int b = (r / 3) * 3 + c / 3;
        if (!rows[r].add(v) || !cols[c].add(v) || !boxes[b].add(v)) return false;
    }
return true;`,
    },
    insight: '`add` returning false on a duplicate lets three checks collapse into one condition. Recognising that three constraints share a shape is what keeps the code short.',
  },
];
