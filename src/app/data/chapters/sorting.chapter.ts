import { Chapter } from '../../core/models/chapter.models';

export const SORTING: Chapter = {
  slug: 'sorting',
  title: 'Sorting & Selection',
  shortTitle: 'Sorting',
  level: 'Core',
  order: 11,
  stage: 'sorting',
  readingMinutes: 28,
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
          kind: 'para',
          text: 'You will rarely implement a sort at work — but sorting is the most common **preprocessing step** in problem solving, because a sorted array unlocks binary search, two pointers, greedy scans and easy duplicate handling.',
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
          kind: 'code',
          language: 'java',
          caption: 'Sort by one field, then break ties with another',
          source: `Arrays.sort(intervals, (x, y) -> x[0] != y[0] ? x[0] - y[0] : x[1] - y[1]);

// safer for large values, which can overflow the subtraction:
Arrays.sort(intervals, Comparator.<int[]>comparingInt(x -> x[0]).thenComparingInt(x -> x[1]));`,
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
