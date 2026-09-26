import { Chapter } from '../../core/models/chapter.models';

export const HASHING: Chapter = {
  slug: 'hashing',
  title: 'Hashing',
  shortTitle: 'Hashing',
  level: 'Core',
  order: 7,
  stage: 'hashing',
  readingMinutes: 24,
  definition: {
    heading: 'What a hash table is',
    text:
      'A **hash table** stores key-value pairs in an array of buckets, using a **hash function** to compute which bucket a key belongs in. Instead of searching for a key it calculates where the key must be and looks straight there, which makes insert, lookup and delete `O(1)` on average. A **collision** is two keys landing in the same bucket, and how a table resolves collisions is what decides its worst case.',
  },
  summary:
    'How a hash table turns a search into a single memory access, what collisions really cost, and the handful of patterns — complement lookup, grouping, prefix hashing — that collapse quadratic solutions to linear.',
  objectives: [
    'Explain how a hash table finds a key without scanning',
    'Say honestly when lookup is `O(1)` and when it degrades',
    'Replace a nested loop with a complement lookup',
    'Group items by a derived key',
    'Use your own objects as map keys correctly',
  ],
  prerequisites: ['arrays'],
  sections: [
    {
      id: 'idea',
      title: 'The idea: compute the address instead of searching for it',
      blocks: [
        {
          kind: 'callout',
          tone: 'note',
          title: 'In plain words',
          text: 'Instead of searching for something, you calculate where it must be and look straight there. That one change is what turns a huge number of slow solutions into fast ones.',
        },
        {
          kind: 'para',
          text: 'Finding a value in an unsorted array means looking at every element. Sorting first gets you to `O(log n)`. Hashing does something different: it **computes** where the value should live, then looks there.',
        },
        {
          kind: 'visual',
          name: 'hash-buckets',
          caption:
            'Each key is hashed to a bucket. Two keys landing in the same bucket is a collision.',
        },
        {
          kind: 'diagram',
          caption: 'A hash function maps a key to a bucket index; the bucket holds the entry.',
          art: `key "apple"  --hash-->  8241732  --% 8-->  bucket 4

buckets:
  0 |
  1 | ("banana", 3)
  2 |
  3 |
  4 | ("apple", 7)          <- found in one step
  5 |
  6 | ("cherry", 1) -> ("date", 9)   <- a collision chain
  7 | `,
        },
        {
          kind: 'steps',
          items: [
            {
              title: 'Hash the key',
              text: 'A hash function turns the key into an integer. Equal keys must hash equally; unequal keys should usually differ.',
            },
            {
              title: 'Map it to a bucket',
              text: 'Take the hash modulo the number of buckets to get an index into the underlying array.',
            },
            {
              title: 'Resolve collisions',
              text: 'Different keys can land in the same bucket. Chaining stores a small list there; open addressing probes the next free slot.',
            },
            {
              title: 'Resize when it fills up',
              text: 'When the load factor gets too high, allocate more buckets and rehash. This is amortised, exactly like a doubling array.',
            },
          ],
        },
      ],
    },
    {
      id: 'costs',
      title: 'What it actually costs',
      blocks: [
        {
          kind: 'para',
          text:
            'Hash tables are advertised as `O(1)`, and that is true on average but not always. Understanding where the average comes from is what stops you being surprised by the one problem where it does not hold.',
        },
        {
          kind: 'table',
          headers: ['Operation', 'Average', 'Worst', 'Why the worst case happens'],
          rows: [
            ['Insert', '`O(1)`', '`O(n)`', 'every key collides into one bucket'],
            ['Lookup', '`O(1)`', '`O(n)`', 'the chain becomes a linked list'],
            ['Delete', '`O(1)`', '`O(n)`', 'same'],
            ['Iterate all', '`O(n)`', '`O(n)`', 'order is not guaranteed'],
          ],
        },
        {
          kind: 'para',
          text:
            'A lookup does three things: compute the hash, jump to that bucket, and compare against whatever is already there. The first two are genuinely constant. The third is only constant if buckets stay short, which holds when the hash spreads keys evenly and the table grows as it fills. Break either assumption — a poor hash, or adversarial keys chosen to collide — and every key lands in one bucket, turning the lookup back into a linear scan.',
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'Say "average" out loud',
          text: 'Claiming a hash map is `O(1)` without qualification is the answer interviewers push back on. It is `O(1)` **on average**, assuming a decent hash function; adversarial or badly distributed keys degrade it to linear.',
        },
        {
          kind: 'compare',
          columns: [
            {
              title: 'Hash map',
              points: [
                'Average `O(1)` lookup.',
                'No ordering — iteration order is arbitrary.',
                'Needs extra memory beyond the entries.',
                'Cannot answer "next larger key".',
              ],
            },
            {
              title: 'Balanced tree map',
              points: [
                'Guaranteed `O(log n)` lookup.',
                'Keys stay sorted; range queries work.',
                'Supports floor, ceiling, first and last.',
                'Larger constant factor.',
              ],
            },
          ],
        },
        {
          kind: 'callout',
          tone: 'note',
          text: 'If the value range is small and dense — letters, digits, ages, numbers up to a million — an array indexed by the value is faster and simpler than any hash map.',
        },
        {
          kind: 'para',
          text:
            'Two costs are easy to forget because they do not show up in the complexity. Hashing a long string reads the whole string, so the constant is proportional to key length rather than truly fixed. And a table that grows has to rehash everything into a bigger array — amortised away over many inserts, but a single insert can be slow, which matters if you care about latency rather than throughput.',
        },
      ],
    },
    {
      id: 'complement',
      title: 'The complement lookup',
      blocks: [
        {
          kind: 'para',
          text: 'This is the single most common use of hashing in interviews. Whenever you are searching for a **pair** that satisfies a relation, ask what the second element must be, and look that up instead of scanning for it.',
        },
        {
          kind: 'figure',
          height: 162,
          label: 'The complement of the current value looked up in a map of values seen so far',
          caption: 'This one move turns a quadratic pair search into a single pass.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">Do not search for the partner — compute it, then look it up</text>
<rect x="40" y="34" width="66" height="42" rx="4" class="dg-box" />
<text x="73" y="59.5" class="dg-t" text-anchor="middle">2</text>
<text x="73" y="90" class="dg-s" text-anchor="middle">0</text>
<rect x="114" y="34" width="66" height="42" rx="4" class="dg-fill2" />
<text x="147" y="59.5" class="dg-on" text-anchor="middle">7</text>
<text x="147" y="90" class="dg-s" text-anchor="middle">1</text>
<rect x="188" y="34" width="66" height="42" rx="4" class="dg-box" />
<text x="221" y="59.5" class="dg-t" text-anchor="middle">11</text>
<text x="221" y="90" class="dg-s" text-anchor="middle">2</text>
<rect x="262" y="34" width="66" height="42" rx="4" class="dg-box" />
<text x="295" y="59.5" class="dg-t" text-anchor="middle">15</text>
<text x="295" y="90" class="dg-s" text-anchor="middle">3</text>
<text x="60" y="106" class="dg-m" text-anchor="start">target = 9</text>
<text x="300" y="52" class="dg-m" text-anchor="start">9 − 7 = 2</text>
<path class="dg-line" marker-end="url(#ah)" d="M300 62 L300 86" />
<text x="300" y="106" class="dg-s" text-anchor="start">seen?</text>
<rect x="420" y="34" width="170" height="80" rx="6" class="dg-muted" />
<text x="505" y="58" class="dg-m" text-anchor="middle">seen</text>
<text x="505" y="84" class="dg-t" text-anchor="middle">2 → index 0</text>
<path class="dg-line" marker-end="url(#ah)" d="M360 74 L412 74" />
<text x="0" y="150" class="dg-s" text-anchor="start">insert after checking, or an element pairs with itself</text>`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Two numbers summing to a target - one pass, O(n)',
          source: `Map<Integer, Integer> seen = new HashMap<>();   // value -> index
for (int i = 0; i < n; i++) {
    int need = target - a[i];
    if (seen.containsKey(need)) return new int[] { seen.get(need), i };
    seen.put(a[i], i);          // insert after checking, or a[i] matches itself
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `seen = {}                          # value -> index

for i, value in enumerate(a):
    need = target - value
    if need in seen:
        return [seen[need], i]

    seen[value] = i                # insert after checking, or a[i] matches itself`,
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why the order of the two lines matters',
          text: 'Checking before inserting guarantees the two indices are different. Inserting first lets a single element pair with itself when `target == 2 * a[i]`, which is a silent wrong answer rather than a crash.',
        },
        {
          kind: 'para',
          text: 'The same shape appears constantly: "does a value with this property exist", "have I seen this before", "is there a duplicate within distance k". Turn the search into a lookup.',
        },
      ],
    },
    {
      id: 'frequency',
      title: 'Frequency maps',
      blocks: [
        {
          kind: 'para',
          text: 'Counting occurrences is the second-most common use. Once you have counts, questions about majority, uniqueness, top-K and matching become easy.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Idiomatic counting',
          source: `Map<Integer, Integer> count = new HashMap<>();
for (int value : a) count.merge(value, 1, Integer::sum);

// or
count.put(value, count.getOrDefault(value, 0) + 1);`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `from collections import Counter, defaultdict

count = Counter(a)                 # the whole loop, in one call

# or, when you want to build it yourself:
count = defaultdict(int)
for value in a:
    count[value] += 1`,
        },
        {
          kind: 'table',
          headers: ['Question', 'Approach once you have counts'],
          rows: [
            ['First non-repeating element', 'count, then scan the original order for the first count of 1'],
            ['Majority element', 'any count above `n/2` (or use Boyer-Moore voting for `O(1)` space)'],
            ['Top K frequent', 'bucket by frequency, or a heap of size K'],
            ['Are two arrays permutations', 'compare the two count maps'],
            ['Longest window with at most K distinct', 'a count map inside a sliding window'],
          ],
        },
      ],
    },
    {
      id: 'grouping',
      title: 'Grouping by a derived key',
      blocks: [
        {
          kind: 'para',
          text: 'When a problem asks you to gather items that "belong together", the work is choosing the key that makes them equal.',
        },
        {
          kind: 'table',
          headers: ['Group by', 'Key to build'],
          rows: [
            ['Anagrams', 'sorted characters, or the 26-slot count vector'],
            ['Points on the same line through the origin', 'the reduced slope `dy/g : dx/g`'],
            ['Strings with the same shape', 'the pattern of first occurrences, e.g. `abb -> 0,1,1`'],
            ['Numbers with the same digit sum', 'the digit sum'],
            ['Rows of a grid that are identical', 'the row rendered as a string'],
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'Grouping is a two-step move: define an equivalence, then find a canonical key that all equivalent items produce. Once the key exists, the map does the rest.',
        },
      ],
    },
    {
      id: 'prefix-hashing',
      title: 'Hashing plus prefix sums',
      blocks: [
        {
          kind: 'para',
          text: 'Combining a running aggregate with a hash map is what makes many subarray problems linear. The pattern: as you scan, store every prefix value you have seen, and ask whether the prefix you need has occurred.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Count subarrays whose sum equals k',
          source: `Map<Long, Integer> seen = new HashMap<>();
seen.put(0L, 1);                        // the empty prefix
long running = 0;
int count = 0;

for (int value : a) {
    running += value;
    count += seen.getOrDefault(running - k, 0);
    seen.merge(running, 1, Integer::sum);
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `from collections import defaultdict

seen = defaultdict(int)
seen[0] = 1                        # the empty prefix

running = count = 0
for value in a:
    running += value
    count += seen[running - k]
    seen[running] += 1`,
        },
        {
          kind: 'table',
          caption: 'Same skeleton, different quantity stored.',
          headers: ['Problem', 'What to store as the key'],
          rows: [
            ['Subarrays summing to k', 'running sum'],
            ['Subarrays with sum divisible by k', 'running sum modulo k'],
            ['Longest subarray with equal 0s and 1s', 'running (ones minus zeros)'],
            ['Subarrays with equal counts of three values', 'the pair of differences'],
            ['Longest subarray summing to k', 'first index at which each prefix appeared'],
          ],
        },
        {
          kind: 'check',
          question: 'Why is `seen.put(0, 1)` needed before the loop?',
          answer: 'It represents the empty prefix. Without it, a subarray that starts at index 0 and sums to `k` is never counted, because `running - k` would be 0 and 0 would not yet be in the map.',
        },
      ],
    },
    {
      id: 'custom-keys',
      title: 'Using your own objects as keys',
      blocks: [
        {
          kind: 'para',
          text: 'A hash map finds a key by hashing it and then testing equality. If those two are not consistent, lookups fail silently — the entry is in the table and you cannot find it.',
        },
        {
          kind: 'list',
          items: [
            '**Equal objects must have equal hash codes.** The reverse is not required.',
            'Override `equals` and `hashCode` together in Java, `__eq__` and `__hash__` in Python, and supply a hash functor in C++.',
            'Keys must be **immutable while in the map**. Mutating a key changes its bucket and orphans the entry.',
            'For a small composite key, a string like `row + "," + col` is fine; for hot loops, encode it as `row * cols + col`.',
          ],
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'In Java, arrays do not override `equals`, so `map.put(new int[]{1,2}, x)` can never be found again — two arrays with identical contents are different keys. Use a list, a string, or an encoded integer instead.',
        },
      ],
    },
    {
      id: 'when-not',
      title: 'When hashing is the wrong tool',
      blocks: [
        {
          kind: 'para',
          text:
            'A hash map is the right answer often enough that reaching for it becomes a reflex, and that reflex is worth interrupting. A hash destroys order: it can tell you whether a key is present, but never what is nearest, what comes next, or what falls in a range. Any question phrased in those terms wants a sorted structure or a tree instead.',
        },
        {
          kind: 'list',
          items: [
            'You need **sorted order** or range queries — use a tree map or sort.',
            'You need the **smallest or largest** repeatedly — use a heap.',
            'The keys are small dense integers — use an array.',
            'You need prefix lookups over strings — use a trie.',
            'Memory is tight — a hash map carries real per-entry overhead.',
            'The problem demands a guaranteed worst case — hashing gives you an average.',
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'The instinct worth building: when you catch yourself writing a nested loop to find something, stop and ask what key would let you look it up instead. That question turns `O(n^2)` into `O(n)` more often than any other in this course.',
        },
        {
          kind: 'para',
          text:
            'The other case is when a plain array would do. If the keys are small integers or letters from a fixed alphabet, an array indexed directly by the key is faster, uses less memory and never collides — the subtraction `c - a` is a perfect hash function that costs nothing.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'A hash table computes where a key belongs instead of searching for it.',
    'Lookup is `O(1)` on average and `O(n)` in the worst case — say which you mean.',
    'Complement lookup replaces the search for a pair with a single map query.',
    'Frequency maps unlock majority, uniqueness, top-K and window problems.',
    'Grouping is about finding a canonical key that equivalent items share.',
    'Running aggregate plus a hash map is the standard linear subarray technique.',
    'Custom keys need consistent equality and hashing, and must not mutate while stored.',
    'Use a tree, heap, array or trie when you need order, extremes, density or prefixes.',
  ],
};
