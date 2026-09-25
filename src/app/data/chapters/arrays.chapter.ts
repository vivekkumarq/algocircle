import { Chapter } from '../../core/models/chapter.models';

export const ARRAYS: Chapter = {
  slug: 'arrays',
  title: 'Arrays',
  shortTitle: 'Arrays',
  level: 'Core',
  order: 5,
  stage: 'arrays',
  readingMinutes: 30,
  definition: {
    heading: 'What an array is',
    text:
      'An **array** is a fixed-size row of equally sized slots laid next to each other in memory, numbered from zero. Because the slots are equal and adjacent, the machine computes the address of any element with one multiplication — so reading `a[i]` costs the same whether `i` is 0 or a million. That single property is what every array technique in this topic trades on.',
  },
  summary:
    'The structure everything else is built on: index arithmetic, in-place work, and the prefix, difference and running-best techniques that collapse nested loops into a single pass.',
  objectives: [
    'Answer any range-sum query in constant time after linear preprocessing',
    'Apply many range updates in `O(1)` each with a difference array',
    "Derive Kadane's algorithm rather than recall it",
    'Tell a subarray from a subsequence, and know which techniques apply to each',
    'Extend prefix sums and traversal patterns to a 2D matrix',
  ],
  prerequisites: ['complexity'],
  sections: [
    {
      id: 'what-an-array-is',
      title: 'What an array buys you, and what it costs',
      blocks: [
        {
          kind: 'callout',
          tone: 'note',
          title: 'In plain words',
          text: 'An array is a row of boxes, numbered from zero. This chapter is about the handful of tricks that let you answer questions about that row without ever looking at the same box twice.',
        },
        {
          kind: 'para',
          text: 'An array is a contiguous block of equally sized slots. Because the slots are equal and adjacent, the machine can compute the address of any element with one multiplication — which is why `a[i]` costs the same whether `i` is 0 or 999,999.',
        },
        {
          kind: 'visual',
          name: 'array-memory',
          caption:
            'Contiguous slots are what make indexing constant time.',
        },
        {
          kind: 'table',
          caption: 'Every one of these follows from "contiguous, fixed-size slots".',
          headers: ['Operation', 'Cost', 'Why'],
          rows: [
            ['Read or write `a[i]`', '`O(1)`', 'address = base + i * size'],
            ['Append, room available', '`O(1)`', 'write the next slot'],
            ['Append, dynamic array full', '`O(1)` amortised', 'double capacity and copy, rarely'],
            ['Insert or delete at the front', '`O(n)`', 'every later element shifts'],
            ['Insert or delete in the middle', '`O(n)`', 'the tail shifts'],
            ['Delete the last element', '`O(1)`', 'nothing moves'],
            ['Search, unsorted', '`O(n)`', 'no structure to exploit'],
            ['Search, sorted', '`O(log n)`', 'binary search'],
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'Arrays are fast to read anywhere and slow to reshape anywhere but the end. When a problem needs frequent insertion in the middle, that is a signal to reach for a different structure — or to rethink the order you process things in.',
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Cache locality, the hidden constant',
          text: 'Memory is fetched in blocks. Walking an array in order means the next element is usually already in cache, so array iteration is several times faster than following pointers, even when both are `O(n)`. This is why an array-backed structure often beats a theoretically equal linked one.',
        },
      ],
    },
    {
      id: 'traversal',
      title: 'Traversal patterns worth having in your fingers',
      blocks: [
        {
          kind: 'code',
          language: 'pseudocode',
          caption: 'Four traversals that cover most single-pass problems',
          source: `# forward
for i in 0 .. n-1: visit(a[i])

# backward - useful when the answer depends on what comes after
for i in n-1 .. 0: visit(a[i])

# adjacent pairs - differences, monotonicity checks
for i in 1 .. n-1: compare(a[i-1], a[i])

# two ends moving inward - palindromes, sorted pair sums
lo, hi = 0, n-1
while lo < hi:
    ...
    lo += 1; hi -= 1`,
        },
        {
          kind: 'figure',
          height: 196,
          label: 'Forward, backward and two-ended traversals of the same array',
          caption: 'Choosing the direction is often the whole trick.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">Three shapes cover most single-array work</text>
<text x="10" y="48" class="dg-m" text-anchor="start">forward</text>
<rect x="120" y="30" width="44" height="28" rx="4" class="dg-fill" />
<rect x="169" y="30" width="44" height="28" rx="4" class="dg-box" />
<rect x="218" y="30" width="44" height="28" rx="4" class="dg-box" />
<rect x="267" y="30" width="44" height="28" rx="4" class="dg-box" />
<rect x="316" y="30" width="44" height="28" rx="4" class="dg-box" />
<path class="dg-dash" marker-end="url(#ah)" d="M130 44 L348 44" />
<text x="10" y="108" class="dg-m" text-anchor="start">backward</text>
<rect x="120" y="90" width="44" height="28" rx="4" class="dg-box" />
<rect x="169" y="90" width="44" height="28" rx="4" class="dg-box" />
<rect x="218" y="90" width="44" height="28" rx="4" class="dg-box" />
<rect x="267" y="90" width="44" height="28" rx="4" class="dg-box" />
<rect x="316" y="90" width="44" height="28" rx="4" class="dg-fill" />
<path class="dg-dash" marker-end="url(#ah)" d="M348 104 L130 104" />
<text x="10" y="168" class="dg-m" text-anchor="start">both ends</text>
<rect x="120" y="150" width="44" height="28" rx="4" class="dg-fill" />
<rect x="169" y="150" width="44" height="28" rx="4" class="dg-box" />
<rect x="218" y="150" width="44" height="28" rx="4" class="dg-box" />
<rect x="267" y="150" width="44" height="28" rx="4" class="dg-box" />
<rect x="316" y="150" width="44" height="28" rx="4" class="dg-fill" />
<path class="dg-dash" marker-end="url(#ah)" d="M130 164 L224 164" />
<path class="dg-dash" marker-end="url(#ah)" d="M348 164 L254 164" />
<text x="420" y="60" class="dg-s" text-anchor="start">backward is the one</text>
<text x="420" y="80" class="dg-s" text-anchor="start">people forget, and it</text>
<text x="420" y="100" class="dg-s" text-anchor="start">is what lets you write</text>
<text x="420" y="120" class="dg-s" text-anchor="start">into the same array</text>
<text x="420" y="140" class="dg-s" text-anchor="start">you are reading.</text>`,
        },
        {
          kind: 'para',
          text: 'Reaching for a backward pass is a genuine technique, not a curiosity. Any question of the form "for each position, something about everything to its right" becomes linear when you sweep from the right and carry a running value.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Best profit from selling later - one backward pass, no nested loop',
          source: `int best = 0, maxRight = Integer.MIN_VALUE;
for (int i = n - 1; i >= 0; i--) {
    best = Math.max(best, maxRight - price[i]);  // sell at the best future price
    maxRight = Math.max(maxRight, price[i]);     // then include today
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `best = 0
max_right = float('-inf')

for price in reversed(prices):
    best = max(best, max_right - price)   # sell at the best future price
    max_right = max(max_right, price)     # then include today`,
        },
      ],
    },
    {
      id: 'in-place',
      title: 'Working in place',
      blocks: [
        {
          kind: 'para',
          text: 'Many array problems ask for `O(1)` extra space. The standard device is a **write pointer**: read with one index, write with another, and the array in front of the write pointer is always the answer so far.',
        },
        {
          kind: 'figure',
          height: 258,
          label: 'A read index scanning while a write index compacts the kept values',
          caption: 'The in-place filter: write only advances when something is worth keeping.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">One index reads, another marks where the next keeper goes</text>
<rect x="40" y="34" width="66" height="42" rx="4" class="dg-fill" />
<text x="73" y="59.5" class="dg-t" text-anchor="middle">3</text>
<rect x="114" y="34" width="66" height="42" rx="4" class="dg-box" />
<text x="147" y="59.5" class="dg-t" text-anchor="middle">0</text>
<rect x="188" y="34" width="66" height="42" rx="4" class="dg-fill" />
<text x="221" y="59.5" class="dg-t" text-anchor="middle">5</text>
<rect x="262" y="34" width="66" height="42" rx="4" class="dg-box" />
<text x="295" y="59.5" class="dg-t" text-anchor="middle">0</text>
<rect x="336" y="34" width="66" height="42" rx="4" class="dg-fill" />
<text x="369" y="59.5" class="dg-t" text-anchor="middle">7</text>
<text x="73" y="98" class="dg-m" text-anchor="middle">write</text>
<text x="370" y="98" class="dg-m" text-anchor="middle">read</text>
<path class="dg-line" marker-end="url(#ah)" d="M73 94 L73 82" />
<path class="dg-line" marker-end="url(#ah)" d="M370 94 L370 82" />
<path class="dg-line" marker-end="url(#ah)" d="M300 130 L360 130" />
<text x="330" y="148" class="dg-s" text-anchor="middle"></text>
<rect x="40" y="152" width="66" height="42" rx="4" class="dg-fill" />
<text x="73" y="177.5" class="dg-t" text-anchor="middle">3</text>
<rect x="114" y="152" width="66" height="42" rx="4" class="dg-fill" />
<text x="147" y="177.5" class="dg-t" text-anchor="middle">5</text>
<rect x="188" y="152" width="66" height="42" rx="4" class="dg-fill" />
<text x="221" y="177.5" class="dg-t" text-anchor="middle">7</text>
<rect x="262" y="152" width="66" height="42" rx="4" class="dg-box" />
<text x="295" y="177.5" class="dg-t" text-anchor="middle">0</text>
<rect x="336" y="152" width="66" height="42" rx="4" class="dg-box" />
<text x="369" y="177.5" class="dg-t" text-anchor="middle">0</text>
<path class="dg-thin" d="M40 200 q0 6 6 6 H145 q6 0 6 6 q0 -6 6 -6 H256 q6 0 6 -6" />
<text x="151" y="226" class="dg-m" text-anchor="middle">kept, in order</text>
<text x="0" y="246" class="dg-s" text-anchor="start">no second array, and the relative order of the keepers survives</text>`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Remove every zero, keeping order, using no extra array',
          source: `int write = 0;
for (int read = 0; read < n; read++) {
    if (a[read] != 0) a[write++] = a[read];
}
// a[0 .. write-1] is the compacted result; write is the new length`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `write = 0
for read in range(len(a)):
    if a[read] != 0:
        a[write] = a[read]
        write += 1

# a[:write] is the compacted result; write is the new length`,
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why this is safe',
          text: '`write` never overtakes `read`, so you only ever write to a slot you have already consumed. That invariant is the whole proof, and it is worth stating out loud in an interview.',
        },
        {
          kind: 'para',
          text: 'The same idea, with a condition instead of a value, gives you in-place deduplication of a sorted array, partitioning around a pivot, and the Dutch national flag three-way split.',
        },
        {
          kind: 'check',
          question: 'Why does the write-pointer pattern require a single pass and no temporary array?',
          answer: 'Because the region `a[0..write-1]` is finished and the region `a[read..n-1]` is untouched. The gap between them holds values already copied forward, so overwriting it destroys nothing you still need.',
        },
      ],
    },
    {
      id: 'prefix-sums',
      title: 'Prefix sums: pay once, answer forever',
      blocks: [
        {
          kind: 'para',
          text: 'Given many queries of the form "what is the sum of `a[l..r]`", answering each by looping is `O(n)` per query. Precomputing running totals makes every query `O(1)`.',
        },
        {
          kind: 'visual',
          name: 'prefix-sum',
          caption:
            'Pick a range: the answer is always one subtraction.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'prefix[i] holds the sum of the first i elements',
          source: `long[] prefix = new long[n + 1];
for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + a[i];

// sum of a[l..r], inclusive:
long sum = prefix[r + 1] - prefix[l];`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `prefix = [0] * (len(a) + 1)
for i, value in enumerate(a):
    prefix[i + 1] = prefix[i] + value

# sum of a[l..r], inclusive:
total = prefix[r + 1] - prefix[l]`,
        },
        {
          kind: 'diagram',
          caption: 'The shaded range is the difference of two prefixes.',
          art: `a:        [ 3 ][ 1 ][ 4 ][ 1 ][ 5 ][ 9 ]
prefix: 0    3    4    8    9   14   23
             ^                   ^
             prefix[1]           prefix[5]

sum of a[1..4] = prefix[5] - prefix[1] = 14 - 3 = 11`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'Size it n+1',
          text: 'Using a prefix array of length `n+1` with `prefix[0] = 0` removes every special case for ranges that start at index 0. Nearly all prefix-sum bugs come from an array of length `n` and an `if (l == 0)` branch.',
        },
        {
          kind: 'heading',
          text: 'The pairing that unlocks harder problems',
        },
        {
          kind: 'para',
          text: 'Prefix sums combined with a hash map answer "how many subarrays sum to `k`" in linear time. A subarray `(l, r]` sums to `k` exactly when `prefix[r] - prefix[l] = k`, so while scanning you look for `prefix[r] - k` among the prefixes seen so far.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Count subarrays with sum k - O(n) time, O(n) space',
          source: `Map<Long, Integer> seen = new HashMap<>();
seen.put(0L, 1);                       // the empty prefix
long running = 0; int count = 0;

for (int i = 0; i < n; i++) {
    running += a[i];
    count += seen.getOrDefault(running - k, 0);
    seen.merge(running, 1, Integer::sum);
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `from collections import defaultdict

seen = defaultdict(int)
seen[0] = 1                       # the empty prefix

running = count = 0
for value in a:
    running += value
    count += seen[running - k]
    seen[running] += 1`,
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'Remember the shape, not the code: **a range condition becomes a lookup condition on prefixes**. The same move handles subarrays divisible by `k` (store `running % k`) and equal counts of two values (store a running difference).',
        },
      ],
    },
    {
      id: 'difference-array',
      title: 'Difference arrays: many range updates, cheaply',
      blocks: [
        {
          kind: 'para',
          text: 'Prefix sums make range **queries** cheap. The mirror technique makes range **updates** cheap: to add `v` to every element of `a[l..r]`, record the change at the two boundaries and reconstruct once at the end.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'q updates in O(1) each, one O(n) pass to materialise',
          source: `int[] diff = new int[n + 1];

// add v to a[l..r]
diff[l] += v;
diff[r + 1] -= v;

// after all updates, rebuild the array
int running = 0;
for (int i = 0; i < n; i++) {
    running += diff[i];
    a[i] += running;
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `diff = [0] * (len(a) + 1)

# add v to a[l..r]
diff[l] += v
diff[r + 1] -= v

# after all updates, rebuild the array
running = 0
for i in range(len(a)):
    running += diff[i]
    a[i] += running`,
        },
        {
          kind: 'diagram',
          caption: 'Add 5 to indices 1..3 on an array of length 6.',
          art: `diff:   [ 0 ][+5 ][ 0 ][ 0 ][-5 ][ 0 ][ 0 ]
running:  0    5    5    5    0    0
applied:  -   +5   +5   +5    -    -`,
        },
        {
          kind: 'para',
          text: 'Total cost for `q` updates is `O(n + q)` instead of `O(n * q)`. This is the standard answer to problems about booking intervals, counting overlapping ranges, or applying a batch of flight or seat reservations.',
        },
      ],
    },
    {
      id: 'kadane',
      title: 'Maximum subarray, derived rather than memorised',
      blocks: [
        {
          kind: 'para',
          text: 'Find the contiguous subarray with the largest sum. Checking every pair of endpoints is `O(n^2)`. The linear solution follows from one question asked at each position.',
        },
        {
          kind: 'steps',
          items: [
            {
              title: 'Ask a local question',
              text: 'At index `i`, the best subarray **ending exactly at i** either extends the best subarray ending at `i-1`, or starts fresh at `i`.',
            },
            {
              title: 'Write it as a choice',
              text: '`endingHere = max(a[i], endingHere + a[i])`. Extending is worth it only when what came before was not a net loss.',
            },
            {
              title: 'Keep the global best',
              text: 'The answer overall is the largest `endingHere` seen at any position, so track it as you go.',
            },
          ],
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Kadane - O(n) time, O(1) space',
          source: `int endingHere = a[0], best = a[0];
for (int i = 1; i < n; i++) {
    endingHere = Math.max(a[i], endingHere + a[i]);
    best = Math.max(best, endingHere);
}
return best;`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `ending_here = best = a[0]

for value in a[1:]:
    ending_here = max(value, ending_here + value)
    best = max(best, ending_here)

return best`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'All-negative input',
          text: 'Initialising `best = 0` silently returns 0 when every value is negative, which is wrong unless the empty subarray is allowed. Start both variables at `a[0]` and the case handles itself.',
        },
        {
          kind: 'callout',
          tone: 'why',
          text: 'This is your first dynamic programming algorithm, though nobody calls it that yet. The state is "best sum ending at i", the transition is one `max`, and the space is optimised to a single variable. Recognising that shape now makes the DP chapter far easier later.',
        },
      ],
    },
    {
      id: 'frequency',
      title: 'Frequency arrays',
      blocks: [
        {
          kind: 'para',
          text: 'When values come from a small known range — lowercase letters, digits, ages, values up to `10^5` — an array indexed by the value itself beats a hash map on both speed and memory.',
        },
        {
          kind: 'figure',
          height: 228,
          label: 'Letters counted into a fixed array indexed by letter',
          caption: 'Same idea as a hash map, with the hash function replaced by subtraction.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">When the alphabet is small, the index IS the lookup</text>
<rect x="40" y="34" width="54" height="40" rx="4" class="dg-box" />
<text x="67" y="58.5" class="dg-t" text-anchor="middle">b</text>
<rect x="100" y="34" width="54" height="40" rx="4" class="dg-box" />
<text x="127" y="58.5" class="dg-t" text-anchor="middle">a</text>
<rect x="160" y="34" width="54" height="40" rx="4" class="dg-box" />
<text x="187" y="58.5" class="dg-t" text-anchor="middle">n</text>
<rect x="220" y="34" width="54" height="40" rx="4" class="dg-box" />
<text x="247" y="58.5" class="dg-t" text-anchor="middle">a</text>
<rect x="280" y="34" width="54" height="40" rx="4" class="dg-box" />
<text x="307" y="58.5" class="dg-t" text-anchor="middle">n</text>
<rect x="340" y="34" width="54" height="40" rx="4" class="dg-box" />
<text x="367" y="58.5" class="dg-t" text-anchor="middle">a</text>
<path class="dg-line" marker-end="url(#ah)" d="M196 96 L196 124" />
<rect x="40" y="132" width="54" height="40" rx="4" class="dg-fill2" />
<text x="67" y="156.5" class="dg-on" text-anchor="middle">3</text>
<rect x="100" y="132" width="54" height="40" rx="4" class="dg-box" />
<text x="127" y="156.5" class="dg-t" text-anchor="middle">1</text>
<rect x="160" y="132" width="54" height="40" rx="4" class="dg-box" />
<text x="187" y="156.5" class="dg-t" text-anchor="middle">0</text>
<rect x="220" y="132" width="54" height="40" rx="4" class="dg-box" />
<text x="247" y="156.5" class="dg-t" text-anchor="middle">…</text>
<rect x="280" y="132" width="54" height="40" rx="4" class="dg-fill" />
<text x="307" y="156.5" class="dg-t" text-anchor="middle">2</text>
<rect x="340" y="132" width="54" height="40" rx="4" class="dg-box" />
<text x="367" y="156.5" class="dg-t" text-anchor="middle">0</text>
<text x="67" y="190" class="dg-s" text-anchor="middle">a</text>
<text x="127" y="190" class="dg-s" text-anchor="middle">b</text>
<text x="187" y="190" class="dg-s" text-anchor="middle">c</text>
<text x="247" y="190" class="dg-s" text-anchor="middle"></text>
<text x="307" y="190" class="dg-s" text-anchor="middle">n</text>
<text x="367" y="190" class="dg-s" text-anchor="middle">o</text>
<text x="420" y="100" class="dg-m" text-anchor="start">count[c - a]++</text>
<text x="420" y="126" class="dg-s" text-anchor="start">no hashing, no map,</text>
<text x="420" y="146" class="dg-s" text-anchor="start">no allocation per key</text>
<text x="0" y="216" class="dg-s" text-anchor="start">a 26-slot array beats a hash map whenever the keys are letters</text>`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Anagram check without sorting - O(n) instead of O(n log n)',
          source: `int[] count = new int[26];
for (char c : s.toCharArray()) count[c - 'a']++;
for (char c : t.toCharArray()) count[c - 'a']--;
for (int c : count) if (c != 0) return false;
return true;`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `count = [0] * 26

for c in s:
    count[ord(c) - ord('a')] += 1
for c in t:
    count[ord(c) - ord('a')] -= 1

return all(c == 0 for c in count)

# or, with the standard library: Counter(s) == Counter(t)`,
        },
        {
          kind: 'para',
          text:
            "The trick is `c - 'a'`, which maps a letter onto 0..25. The same offset idea handles digits (`c - '0'`), and shifting by a minimum handles values that can be negative.",
        },
        {
          kind: 'callout',
          tone: 'note',
          text: 'Use a hash map when the value range is huge or unknown, and a frequency array when it is small and fixed. The array has no hashing cost, no collisions and perfect cache behaviour.',
        },
      ],
    },
    {
      id: 'subarray-vs-subsequence',
      title: 'Subarray, subsequence, subset',
      blocks: [
        {
          kind: 'para',
          text: 'These three words are not interchangeable, and mixing them up sends you toward the wrong technique before you write a line.',
        },
        {
          kind: 'table',
          headers: ['Term', 'Definition', 'Count for n elements', 'Usual technique'],
          rows: [
            ['Subarray', 'contiguous block', '`n(n+1)/2`', 'sliding window, prefix sums, Kadane'],
            ['Subsequence', 'keeps order, may skip', '`2^n`', 'dynamic programming'],
            ['Subset', 'any selection, order irrelevant', '`2^n`', 'bitmask, backtracking'],
          ],
        },
        {
          kind: 'diagram',
          art: `array: [ 1 ][ 2 ][ 3 ][ 4 ]

subarray     [2][3]        contiguous          yes
subsequence  [1]   [3][4]  gaps allowed        yes
not a subarray because 1 and 3 are not adjacent`,
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'The word "contiguous" in a problem statement is the strongest single hint in array questions. It means a window or a prefix technique applies, and it rules out the exponential subsequence space.',
        },
      ],
    },
    {
      id: 'rotations',
      title: 'Rotations and the reversal trick',
      blocks: [
        {
          kind: 'para',
          text: 'Rotating an array left by `k` looks like it needs a second array. Three reversals do it in place, in linear time.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Rotate left by k - O(n) time, O(1) space',
          source: `k %= n;
reverse(a, 0, k - 1);      // reverse the first part
reverse(a, k, n - 1);      // reverse the rest
reverse(a, 0, n - 1);      // reverse the whole thing`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `k %= n
a[:k] = reversed(a[:k])        # reverse the first part
a[k:] = reversed(a[k:])        # reverse the rest
a.reverse()                    # reverse the whole thing`,
        },
        {
          kind: 'diagram',
          art: `original      [1][2][3][4][5][6][7]   k = 3
reverse 0..2  [3][2][1][4][5][6][7]
reverse 3..6  [3][2][1][7][6][5][4]
reverse all   [4][5][6][7][1][2][3]   rotated left by 3`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'Take `k %= n` first. A rotation by exactly `n` is the identity, and skipping the modulo is the fastest way to an index-out-of-bounds on the very first hidden test.',
        },
      ],
    },
    {
      id: 'matrices',
      title: '2D arrays and matrices',
      blocks: [
        {
          kind: 'para',
          text: 'A matrix is stored as one long array with a formula converting `(row, col)` into a single index. Everything about 1D arrays carries over.',
        },
        {
          kind: 'code',
          language: 'pseudocode',
          caption: 'Flattening, and the moves you will use constantly',
          source: `index = row * cols + col
row   = index / cols
col   = index % cols

# four-directional neighbours
dr = [-1, 1, 0, 0]
dc = [ 0, 0,-1, 1]
for d in 0 .. 3:
    nr, nc = r + dr[d], c + dc[d]
    if 0 <= nr < rows and 0 <= nc < cols:
        visit(nr, nc)`,
        },
        {
          kind: 'para',
          text: 'That direction-array idiom is worth internalising now: it reappears in flood fill, island counting and every grid BFS in the graphs chapter.',
        },
        {
          kind: 'heading',
          text: '2D prefix sums',
        },
        {
          kind: 'para',
          text: 'The same pay-once idea extends to rectangles. Build a table where `P[r][c]` is the sum of everything above and to the left, then any rectangle is four lookups by inclusion-exclusion.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Sum of the rectangle from (r1,c1) to (r2,c2), inclusive',
          source: `P[r + 1][c + 1] = grid[r][c] + P[r][c + 1] + P[r + 1][c] - P[r][c];

long sum = P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1];`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `P[r + 1][c + 1] = grid[r][c] + P[r][c + 1] + P[r + 1][c] - P[r][c]

total = P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1]`,
        },
        {
          kind: 'diagram',
          caption: 'The overlap is subtracted twice, so it is added back once.',
          art: `+-----------+-----------+
|     A     |     B     |
+-----------+-----------+
|     C     |  target   |
+-----------+-----------+

target = whole - (A+B) - (A+C) + A`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Rotating a matrix in place',
          text: 'Transpose, then reverse each row, and you have rotated 90 degrees clockwise with no extra matrix. Reversing each column instead rotates anticlockwise.',
        },
      ],
    },
    {
      id: 'checklist',
      title: 'A checklist for array problems',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Is the input **sorted**, or would sorting help? Sorting unlocks two pointers and binary search.',
            'Does the problem say **contiguous**? Think sliding window or prefix sums.',
            'Are there **many range queries**? Prefix sums. **Many range updates**? Difference array.',
            'Am I recomputing something across iterations? Carry it as a running value instead.',
            'Is the value range small? A frequency array beats a map.',
            'Does the answer depend on what comes **after** each element? Sweep backwards.',
            'Is `O(1)` space required? Look for a write pointer, a reversal or an in-place swap.',
            'Have I handled empty input, one element, all-equal, all-negative and integer overflow?',
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'Nearly every linear array technique is the same insight in different clothing: **stop recomputing what you already knew one step ago**. Prefix sums, Kadane, sliding windows and running maxima are all that sentence.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'Contiguous storage gives `O(1)` indexing and `O(n)` reshaping; every other array property follows from that.',
    'A write pointer converts most "remove or partition in place" problems into a single pass with constant space.',
    'Prefix sums turn range queries into subtraction; with a hash map they count subarrays matching a condition in linear time.',
    'Difference arrays are the mirror image: `O(1)` range updates, one pass to materialise.',
    'Kadane is a one-state dynamic program: best ending here, extend or restart.',
    'Frequency arrays beat hash maps whenever the value range is small and known.',
    'Contiguous means subarray and window techniques; skipping means subsequence and DP.',
    'A matrix is a flattened array; the direction-array idiom carries straight into grid traversal.',
  ],
};
