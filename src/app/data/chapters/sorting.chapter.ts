import { Chapter } from '../../core/models/chapter.models';

export const SORTING: Chapter = {
  slug: 'sorting',
  title: 'Sorting & Selection',
  shortTitle: 'Sorting',
  level: 'Core',
  order: 11,
  stage: 'sorting',
  readingMinutes: 28,
  definition: {
    heading: 'What sorting is, and what it buys you',
    text:
      '**Sorting** arranges elements into an order defined by a comparison. The comparison-based limit is `O(n log n)`; counting and radix sorts beat it by not comparing at all. Sorting is rarely the answer on its own — it is the `O(n log n)` step you pay once so that a two-pointer scan, a binary search or a greedy sweep becomes possible afterwards.',
  },
  summary:
    'How each classic sort works and what it costs, why comparison sorting cannot beat `n log n`, when counting beats comparing, and how to select the kth element without sorting at all.',
  objectives: [
    'Describe merge sort and quick sort well enough to code either from scratch',
    'Explain why `O(n log n)` is a lower bound for comparison sorts',
    'Say what stability means and when it changes the answer',
    'Choose counting or radix sort when the value range allows it',
    'Find the kth smallest element in expected linear time',
  ],
  prerequisites: ['binary-search'],
  sections: [
    {
      id: 'why-sort',
      title: 'Why sorting matters more than the sorts',
      blocks: [
        {
          kind: 'callout',
          tone: 'note',
          title: 'In plain words',
          text: 'You will rarely write a sort by hand. Knowing what each one costs is what matters, because it tells you whether sorting the data first is worth it — and surprisingly often it is.',
        },
        {
          kind: 'para',
          text: 'You will rarely implement a sort at work — but sorting is the most common **preprocessing step** in problem solving, because a sorted array unlocks binary search, two pointers, greedy scans and easy duplicate handling.',
        },
        {
          kind: 'table',
          caption: 'What the O(n log n) buys you. Each of these is cheap on sorted data and awkward without it.',
          headers: ['Once sorted, this becomes', 'Cost after sorting', 'Cost without sorting'],
          rows: [
            ['Find a value', 'O(log n) binary search', 'O(n) scan'],
            ['Find a pair summing to a target', 'O(n) two pointers', 'O(n) with a hash map, O(n^2) without'],
            ['Remove duplicates', 'O(n), they are adjacent', 'O(n) with a set, plus the memory'],
            ['Find the k largest', 'O(1) — read the tail', 'O(n log k) with a heap'],
            ['Merge overlapping intervals', 'O(n) single sweep', 'not really possible'],
            ['Group equal items', 'O(n), they are adjacent', 'O(n) with a map of lists'],
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'The useful question is not "how do I write quick sort" but "does sorting first make this problem easy, and can I afford the `n log n`?". Very often the answer to both is yes.',
        },
      ],
    },
    {
      id: 'quadratic',
      title: 'The quadratic sorts, and what each one teaches',
      blocks: [
        {
          kind: 'table',
          headers: ['Sort', 'Idea', 'Best', 'Worst', 'Stable', 'Worth knowing because'],
          rows: [
            ['Bubble', 'swap adjacent pairs until nothing moves', '`O(n)`', '`O(n^2)`', 'yes', 'it detects an already-sorted array'],
            ['Selection', 'repeatedly take the minimum', '`O(n^2)`', '`O(n^2)`', 'no', 'it makes the fewest writes'],
            ['Insertion', 'insert each element into the sorted prefix', '`O(n)`', '`O(n^2)`', 'yes', 'it is genuinely fast on small or nearly sorted input'],
          ],
        },
        {
          kind: 'visual',
          name: 'sorting',
          caption:
            'Insertion sort: each value slides left until it meets something smaller.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Insertion sort - the one quadratic sort used in practice',
          source: `for (int i = 1; i < n; i++) {
    int key = a[i], j = i - 1;
    while (j >= 0 && a[j] > key) a[j + 1] = a[j--];   // shift right
    a[j + 1] = key;
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `for i in range(1, len(a)):
    key = a[i]
    j = i - 1

    while j >= 0 and a[j] > key:
        a[j + 1] = a[j]            # shift right
        j -= 1

    a[j + 1] = key`,
        },
        {
          kind: 'callout',
          tone: 'note',
          text: 'Real library sorts switch to insertion sort for small subarrays — typically under about 16 elements — because its constant factor beats the recursion overhead of the clever sorts.',
        },
      ],
    },
    {
      id: 'merge-sort',
      title: 'Merge sort: divide, conquer, merge',
      blocks: [
        {
          kind: 'steps',
          items: [
            { title: 'Divide', text: 'Split the array in half.' },
            { title: 'Conquer', text: 'Sort each half recursively. One element is already sorted.' },
            { title: 'Combine', text: 'Merge two sorted halves in linear time with two pointers.' },
          ],
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Merge sort on the half-open range [lo, hi)',
          source: `void sort(int[] a, int lo, int hi, int[] buffer) {
    if (hi - lo <= 1) return;
    int mid = lo + (hi - lo) / 2;
    sort(a, lo, mid, buffer);
    sort(a, mid, hi, buffer);

    int i = lo, j = mid, k = lo;
    while (i < mid && j < hi) buffer[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];
    while (i < mid) buffer[k++] = a[i++];
    while (j < hi)  buffer[k++] = a[j++];
    System.arraycopy(buffer, lo, a, lo, hi - lo);
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `def sort(a: list[int], lo: int, hi: int) -> None:
    """Sorts the half-open range [lo, hi)."""
    if hi - lo <= 1:
        return

    mid = (lo + hi) // 2
    sort(a, lo, mid)
    sort(a, mid, hi)

    merged = []
    i, j = lo, mid

    while i < mid and j < hi:
        if a[i] <= a[j]:
            merged.append(a[i])
            i += 1
        else:
            merged.append(a[j])
            j += 1

    merged.extend(a[i:mid])
    merged.extend(a[j:hi])
    a[lo:hi] = merged`,
        },
        {
          kind: 'diagram',
          caption: 'log n levels, each doing O(n) work in total.',
          art: `        [38 27 43 3 9 82 10]
         /                  \\
   [38 27 43]            [3 9 82 10]
     /     \\               /      \\
  [38]  [27 43]        [3 9]    [82 10]
           merge upward, two sorted runs at a time`,
        },
        {
          kind: 'callout',
          tone: 'why',
          text: '`a[i] <= a[j]` rather than `<` is what makes merge sort **stable**: on a tie the element from the left half is taken first, preserving the original relative order.',
        },
        {
          kind: 'para',
          text: 'Merge sort guarantees `O(n log n)` in every case and is the natural choice for linked lists, where splitting is cheap and no extra array is needed. Its cost is `O(n)` auxiliary memory for arrays.',
        },
      ],
    },
    {
      id: 'quick-sort',
      title: 'Quick sort: partition, then recurse',
      blocks: [
        {
          kind: 'para',
          text: 'Pick a pivot, rearrange so smaller values sit left and larger right, then sort each side. There is no merge step — the partition does the work.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Lomuto partition - simple to write, easy to reason about',
          source: `int partition(int[] a, int lo, int hi) {   // hi is the pivot index
    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; j++) {
        if (a[j] < pivot) swap(a, i++, j);
    }
    swap(a, i, hi);
    return i;                              // pivot's final position
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `def partition(a: list[int], lo: int, hi: int) -> int:
    """hi is the pivot index; returns the pivot's final position."""
    pivot = a[hi]
    i = lo

    for j in range(lo, hi):
        if a[j] < pivot:
            a[i], a[j] = a[j], a[i]
            i += 1

    a[i], a[hi] = a[hi], a[i]
    return i`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'The quadratic worst case is real',
          text: 'Always taking the last element as the pivot makes an already-sorted array `O(n^2)` — each partition peels off one element. Choose a random pivot or the median of three, and say so when you present the solution.',
        },
        {
          kind: 'compare',
          columns: [
            {
              title: 'Merge sort',
              points: [
                '`O(n log n)` guaranteed.',
                'Stable.',
                '`O(n)` extra memory.',
                'Best for linked lists and external sorting.',
              ],
            },
            {
              title: 'Quick sort',
              points: [
                '`O(n log n)` average, `O(n^2)` worst.',
                'Not stable.',
                '`O(log n)` stack only.',
                'Usually fastest in practice on arrays, thanks to cache locality.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'lower-bound',
      title: 'Why no comparison sort beats n log n',
      blocks: [
        {
          kind: 'para',
          text: 'A sort that only compares elements is a decision tree: each comparison has two outcomes, and every leaf is one possible ordering. With `n` elements there are `n!` orderings, so the tree needs at least `n!` leaves.',
        },
        {
          kind: 'figure',
          height: 252,
          label: 'A decision tree whose leaves are the possible orderings of the input',
          caption: 'The bound is about information, not cleverness — which is why counting sort escapes it.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">Every comparison is one yes/no answer, so a sort is a decision tree</text>
<circle cx="300" cy="44" r="9" class="dg-fill" />
<text x="300" y="48.5" class="dg-t" text-anchor="middle"></text>
<path class="dg-thin" d="M300 53 L180 98" />
<path class="dg-thin" d="M300 53 L420 98" />
<circle cx="180" cy="110" r="9" class="dg-box" />
<text x="180" y="114.5" class="dg-t" text-anchor="middle"></text>
<circle cx="420" cy="110" r="9" class="dg-box" />
<text x="420" y="114.5" class="dg-t" text-anchor="middle"></text>
<path class="dg-thin" d="M180 119 L120 164" />
<path class="dg-thin" d="M180 119 L240 164" />
<circle cx="120" cy="176" r="8" class="dg-fill2" />
<text x="120" y="180.5" class="dg-on" text-anchor="middle"></text>
<circle cx="240" cy="176" r="8" class="dg-fill2" />
<text x="240" y="180.5" class="dg-on" text-anchor="middle"></text>
<path class="dg-thin" d="M420 119 L360 164" />
<path class="dg-thin" d="M420 119 L480 164" />
<circle cx="360" cy="176" r="8" class="dg-fill2" />
<text x="360" y="180.5" class="dg-on" text-anchor="middle"></text>
<circle cx="480" cy="176" r="8" class="dg-fill2" />
<text x="480" y="180.5" class="dg-on" text-anchor="middle"></text>
<text x="300" y="214" class="dg-s" text-anchor="middle">n! possible orderings must all be reachable leaves</text>
<text x="300" y="238" class="dg-m" text-anchor="middle">a tree of depth d has at most 2^d leaves, so d ≥ log2(n!) ≈ n log n</text>`,
        },
        {
          kind: 'para',
          text: 'A binary tree of height `h` has at most `2^h` leaves, so `2^h >= n!`, giving `h >= log2(n!)`, which is `Omega(n log n)`. No cleverness in comparisons escapes it.',
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'The escape route is to stop comparing. Counting sort and radix sort use the values as indices, which is why they can be linear — they are not comparison sorts, and they need assumptions about the value range.',
        },
      ],
    },
    {
      id: 'linear-sorts',
      title: 'Counting, radix and bucket sort',
      blocks: [
        {
          kind: 'code',
          language: 'java',
          caption: 'Counting sort - O(n + k) for values in [0, k)',
          source: `int[] count = new int[k];
for (int value : a) count[value]++;

int index = 0;
for (int value = 0; value < k; value++)
    while (count[value]-- > 0) a[index++] = value;`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `count = [0] * k
for value in a:
    count[value] += 1

index = 0
for value in range(k):
    for _ in range(count[value]):
        a[index] = value
        index += 1`,
        },
        {
          kind: 'table',
          headers: ['Sort', 'Cost', 'Requires', 'Use when'],
          rows: [
            ['Counting', '`O(n + k)`', 'small integer range k', 'ages, letters, scores, small ids'],
            ['Radix', '`O(d * (n + b))`', 'fixed-width keys', 'large integers, fixed-length strings'],
            ['Bucket', '`O(n)` expected', 'roughly uniform values', 'floats spread evenly over a range'],
          ],
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'Counting sort with a huge or unknown value range allocates an enormous array. `k` appears in the complexity for a reason — check it against the constraints before choosing this.',
        },
      ],
    },
    {
      id: 'stability',
      title: 'Stability, and why it sometimes decides the answer',
      blocks: [
        {
          kind: 'para',
          text: 'A sort is **stable** when equal elements keep their original relative order. It matters whenever you sort by more than one field.',
        },
        {
          kind: 'diagram',
          caption: 'Sorting by grade only. A stable sort keeps Ann before Bob; an unstable one may not.',
          art: `input:   (Ann, B)  (Bob, B)  (Cy, A)

stable:   (Cy, A)  (Ann, B)  (Bob, B)
unstable: (Cy, A)  (Bob, B)  (Ann, B)   <- also "sorted", different answer`,
        },
        {
          kind: 'para',
          text: 'Stability lets you sort by the secondary key first, then by the primary key, and get a correct two-level ordering. Without it you must write a comparator that handles both fields at once.',
        },
        {
          kind: 'callout',
          tone: 'note',
          text: 'Java sorts objects with a stable merge sort and primitives with an unstable dual-pivot quick sort. C++ `sort` is unstable and `stable_sort` is not. Python `sorted` is always stable.',
        },
      ],
    },
    {
      id: 'selection',
      title: 'Quickselect: the kth element without sorting',
      blocks: [
        {
          kind: 'para',
          text: 'To find the kth smallest value, sorting is `O(n log n)` — but you do not need the whole order. Partition as in quick sort, then recurse into **only the side containing k**.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Expected O(n), worst case O(n^2)',
          source: `int quickselect(int[] a, int lo, int hi, int k) {
    while (true) {
        int p = partition(a, lo, hi);
        if (p == k) return a[p];
        if (p < k) lo = p + 1;
        else       hi = p - 1;
    }
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `def quickselect(a: list[int], lo: int, hi: int, k: int) -> int:
    while True:
        p = partition(a, lo, hi)

        if p == k:
            return a[p]
        if p < k:
            lo = p + 1
        else:
            hi = p - 1`,
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why discarding a side gives linear time',
          text: 'Each step still costs `O(n)` to partition, but the remaining work halves on average: `n + n/2 + n/4 + ... = 2n`. Merge sort cannot do this because it needs both halves fully sorted.',
        },
        {
          kind: 'table',
          headers: ['Goal', 'Best approach', 'Cost'],
          rows: [
            ['Kth smallest, one query', 'quickselect', 'expected `O(n)`'],
            ['Kth largest in a stream', 'min-heap of size k', '`O(n log k)`'],
            ['Top K frequent', 'count, then bucket by frequency', '`O(n)`'],
            ['Full order needed', 'sort', '`O(n log n)`'],
          ],
        },
      ],
    },
    {
      id: 'comparators',
      title: 'Custom comparators',
      blocks: [
        {
          kind: 'para',
          text: 'Most sorting in problem solving is sorting **by** something: an interval start, a distance, a frequency, a ratio.',
        },
        {
          kind: 'figure',
          height: 220,
          label: 'Pairs sorted by their first field and then by their second',
          caption: 'Most interval problems are decided entirely by which field you sort on.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">Sort by one field, break ties with another</text>
<rect x="40" y="36" width="92" height="42" rx="4" class="dg-box" />
<text x="86" y="61.5" class="dg-t" text-anchor="middle">2,9</text>
<rect x="142" y="36" width="92" height="42" rx="4" class="dg-box" />
<text x="188" y="61.5" class="dg-t" text-anchor="middle">1,4</text>
<rect x="244" y="36" width="92" height="42" rx="4" class="dg-box" />
<text x="290" y="61.5" class="dg-t" text-anchor="middle">2,3</text>
<rect x="346" y="36" width="92" height="42" rx="4" class="dg-box" />
<text x="392" y="61.5" class="dg-t" text-anchor="middle">1,7</text>
<path class="dg-line" marker-end="url(#ah)" d="M300 100 L300 128" />
<text x="300" y="120" class="dg-s" text-anchor="middle"></text>
<rect x="40" y="136" width="92" height="42" rx="4" class="dg-fill" />
<text x="86" y="161.5" class="dg-t" text-anchor="middle">1,4</text>
<rect x="142" y="136" width="92" height="42" rx="4" class="dg-fill" />
<text x="188" y="161.5" class="dg-t" text-anchor="middle">1,7</text>
<rect x="244" y="136" width="92" height="42" rx="4" class="dg-fill2" />
<text x="290" y="161.5" class="dg-on" text-anchor="middle">2,3</text>
<rect x="346" y="136" width="92" height="42" rx="4" class="dg-fill2" />
<text x="392" y="161.5" class="dg-on" text-anchor="middle">2,9</text>
<text x="460" y="62" class="dg-s" text-anchor="start">first field ascending</text>
<text x="460" y="86" class="dg-s" text-anchor="start">then second ascending</text>
<text x="460" y="150" class="dg-m" text-anchor="start">subtracting can overflow</text>
<text x="460" y="172" class="dg-s" text-anchor="start">compare, do not subtract</text>
<text x="0" y="208" class="dg-s" text-anchor="start">a comparator must be consistent, or the sort is allowed to do anything</text>`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Sort by one field, then break ties with another',
          source: `Arrays.sort(intervals, (x, y) -> x[0] != y[0] ? x[0] - y[0] : x[1] - y[1]);

// safer for large values, which can overflow the subtraction:
Arrays.sort(intervals, Comparator.<int[]>comparingInt(x -> x[0]).thenComparingInt(x -> x[1]));`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `intervals.sort(key=lambda x: (x[0], x[1]))

# Python compares tuples element by element, so there is no comparator to write
# and nothing to overflow.`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'A comparator must be consistent: if it says `a < b` and `b < c`, it must say `a < c`. Inconsistent comparators throw "Comparison method violates its general contract" in Java and produce undefined behaviour in C++. The `x - y` subtraction shortcut also overflows for large values.',
        },
        {
          kind: 'check',
          question: 'Which sort order makes interval-merging problems easy?',
          answer: 'Sort by start. Then a single left-to-right scan can merge, because any interval that could overlap the current one begins at or after the current start — you never have to look backwards.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'Sorting matters most as preprocessing: it unlocks binary search, two pointers and greedy scans.',
    'Insertion sort is the quadratic sort worth keeping — fast on small and nearly sorted input.',
    'Merge sort is stable and always `n log n` but needs `O(n)` memory; quick sort is faster in practice with an `O(n^2)` worst case.',
    'Comparison sorting cannot beat `n log n`, because `n!` orderings need a decision tree of that height.',
    'Counting and radix sorts are linear because they index by value rather than compare.',
    'Stability preserves the order of equal elements and enables multi-key sorting.',
    'Quickselect finds the kth element in expected linear time by discarding one side.',
    'Keep comparators consistent, and avoid the subtraction shortcut on large values.',
  ],
};
