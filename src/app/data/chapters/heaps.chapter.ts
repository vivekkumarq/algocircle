import { Chapter } from '../../core/models/chapter.models';

export const HEAPS: Chapter = {
  slug: 'heaps',
  title: 'Heaps & Priority Queues',
  shortTitle: 'Heaps',
  level: 'Core',
  order: 16,
  stage: 'heaps',
  readingMinutes: 24,
  summary:
    'A partial order that hands you the extreme element in constant time and restores itself in logarithmic time. Top-K, k-way merges, streaming medians and scheduling all reduce to picking the right heap.',
  objectives: [
    'Explain why a heap is stored in a flat array with no pointers',
    'Trace sift-up and sift-down and give their costs',
    'Say why building a heap is `O(n)` and not `O(n log n)`',
    'Choose a min-heap or a max-heap for a top-K problem and justify it',
    'Maintain a running median with two heaps',
  ],
  prerequisites: ['trees'],
  sections: [
    {
      id: 'idea',
      title: 'A weaker order, and why that is the point',
      blocks: [
        {
          kind: 'para',
          text: 'A sorted array knows the full order and costs `O(n log n)` to build. Often you only ever need the smallest or largest element. A heap maintains just enough order for that — the **heap property** — and everything else stays unsorted.',
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'Min-heap property: every node is smaller than or equal to both of its children. Nothing is said about siblings or about left versus right. That weaker promise is exactly why maintaining it is cheap.',
        },
        {
          kind: 'diagram',
          caption: 'A valid min-heap. The 8 sitting above the 3 is fine — they are in different subtrees.',
          art: `            [ 1 ]
           /     \\
       [ 3 ]     [ 2 ]
       /   \\     /
   [ 8 ] [ 5 ] [ 4 ]

root is the minimum; no ordering between 8 and 4`,
        },
        {
          kind: 'table',
          headers: ['Operation', 'Cost', 'Why'],
          rows: [
            ['Peek at the minimum', '`O(1)`', 'it is the root'],
            ['Insert', '`O(log n)`', 'append, then sift up at most the height'],
            ['Remove the minimum', '`O(log n)`', 'swap in the last element, sift down'],
            ['Build from an array', '`O(n)`', 'sift down from the middle — see below'],
            ['Search for an arbitrary value', '`O(n)`', 'no ordering to guide a search'],
            ['Heap sort', '`O(n log n)`', 'build once, extract `n` times'],
          ],
        },
      ],
    },
    {
      id: 'array',
      title: 'Stored as a flat array',
      blocks: [
        {
          kind: 'para',
          text: 'A heap is a **complete** binary tree: every level is full except possibly the last, which fills left to right. That regularity means the tree structure can be inferred from indices, so no child pointers are stored at all.',
        },
        {
          kind: 'diagram',
          caption: 'Index arithmetic replaces pointers, and the array stays contiguous and cache-friendly.',
          art: `tree:            1
                / \\
               3   2
              / \\ /
             8  5 4

array:  [ 1 ][ 3 ][ 2 ][ 8 ][ 5 ][ 4 ]
index:    0    1    2    3    4    5

parent(i)      = (i - 1) / 2
leftChild(i)   = 2i + 1
rightChild(i)  = 2i + 2`,
        },
        {
          kind: 'callout',
          tone: 'why',
          text: 'This is why heaps beat balanced trees for this job: no allocation per node, no pointer chasing, and the whole structure sits in one contiguous block.',
        },
      ],
    },
    {
      id: 'sift',
      title: 'Sift up and sift down',
      blocks: [
        {
          kind: 'para',
          text: 'Both operations restore the heap property after one element is out of place, by moving it along a single root-to-leaf path.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Insert: append at the end, then sift up',
          source: `void push(int value) {
    heap[size] = value;
    int i = size++;
    while (i > 0) {
        int parent = (i - 1) / 2;
        if (heap[parent] <= heap[i]) break;      // property restored
        swap(i, parent);
        i = parent;
    }
}`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Remove the minimum: move the last element to the root, then sift down',
          source: `int pop() {
    int result = heap[0];
    heap[0] = heap[--size];

    int i = 0;
    while (true) {
        int left = 2 * i + 1, right = left + 1, smallest = i;
        if (left  < size && heap[left]  < heap[smallest]) smallest = left;
        if (right < size && heap[right] < heap[smallest]) smallest = right;
        if (smallest == i) break;
        swap(i, smallest);
        i = smallest;
    }
    return result;
}`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'Sifting down must compare against the **smaller of the two children**. Swapping with the left child unconditionally breaks the property on the right, and the bug only shows on specific inputs.',
        },
      ],
    },
    {
      id: 'build',
      title: 'Why building a heap is linear',
      blocks: [
        {
          kind: 'para',
          text: 'Inserting `n` elements one at a time is `O(n log n)`. Heapifying an existing array is `O(n)` — a genuinely surprising result with a short explanation.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Start at the last internal node and sift down',
          source: `for (int i = n / 2 - 1; i >= 0; i--) siftDown(i);`,
        },
        {
          kind: 'para',
          text: 'Half the nodes are leaves and need no work at all. A quarter sit one level up and sift down at most one step, an eighth at most two, and so on. The total is `n/2 * 0 + n/4 * 1 + n/8 * 2 + ...`, a series that converges to less than `n`.',
        },
        {
          kind: 'diagram',
          art: `level from bottom   nodes     max sift   work
      0 (leaves)      n/2          0         0
      1               n/4          1        n/4
      2               n/8          2        n/4
      3               n/16         3      3n/16
                                          ------
                                total  <   n`,
        },
        {
          kind: 'callout',
          tone: 'why',
          text: 'The intuition: almost all nodes are near the bottom, where sifting is cheap. Sift-**up** would be the opposite — the expensive nodes would be the many leaves — which is exactly why the loop sifts down and runs backwards.',
        },
      ],
    },
    {
      id: 'priority-queue',
      title: 'Priority queues in practice',
      blocks: [
        {
          kind: 'code',
          language: 'java',
          caption: 'Min-heap, max-heap, and ordering by a field',
          source: `PriorityQueue<Integer> min = new PriorityQueue<>();                       // min by default
PriorityQueue<Integer> max = new PriorityQueue<>(Comparator.reverseOrder());
PriorityQueue<int[]> byCost = new PriorityQueue<>((a, b) -> a[1] - b[1]);`,
        },
        {
          kind: 'table',
          headers: ['Language', 'Default', 'Getting the other one'],
          rows: [
            ['Java', 'min-heap', '`Comparator.reverseOrder()`'],
            ['C++', 'max-heap (`priority_queue`)', '`greater<int>` as the comparator'],
            ['Python', 'min-heap (`heapq`)', 'push negated values, or use a tuple key'],
          ],
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'Java gives a min-heap and C++ gives a max-heap by default. Getting this backwards is a silent wrong answer rather than a compile error, so state which you want in a comment when you write it.',
        },
      ],
    },
    {
      id: 'top-k',
      title: 'Top-K: the counter-intuitive heap choice',
      blocks: [
        {
          kind: 'para',
          text: 'To keep the `k` **largest** elements, use a **min**-heap of size `k`. The root is then the weakest of your current champions, so it is the one to evict when something better arrives.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'K largest elements - O(n log k) time, O(k) space',
          source: `PriorityQueue<Integer> heap = new PriorityQueue<>();   // min-heap
for (int value : a) {
    heap.offer(value);
    if (heap.size() > k) heap.poll();    // drop the smallest champion
}
// the heap now holds the k largest; its root is the kth largest`,
        },
        {
          kind: 'compare',
          columns: [
            {
              title: 'Heap of size k',
              points: [
                '`O(n log k)` time, `O(k)` memory.',
                'Works on a stream of unknown length.',
                'Best when `k` is much smaller than `n`.',
              ],
            },
            {
              title: 'Sort, or quickselect',
              points: [
                'Sorting: `O(n log n)`, gives full order.',
                'Quickselect: expected `O(n)`, needs the whole array in memory.',
                'Best when `k` is close to `n`, or the data is already in hand.',
              ],
            },
          ],
        },
        {
          kind: 'check',
          question: 'Why not use a max-heap of size k for the k largest elements?',
          answer: 'The root of a max-heap is the largest, but the element you need to evict is the smallest of the k kept so far — and a max-heap cannot give you that in `O(log k)`. The min-heap puts the eviction candidate exactly where you can reach it.',
        },
      ],
    },
    {
      id: 'k-way-merge',
      title: 'K-way merge',
      blocks: [
        {
          kind: 'para',
          text: 'Merging `k` sorted lists by scanning all the heads each time is `O(n k)`. A heap holding one candidate per list makes it `O(n log k)`.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Merge k sorted lists',
          source: `PriorityQueue<ListNode> heap = new PriorityQueue<>((x, y) -> x.val - y.val);
for (ListNode head : lists) if (head != null) heap.offer(head);

ListNode dummy = new ListNode(0), tail = dummy;
while (!heap.isEmpty()) {
    ListNode node = heap.poll();
    tail.next = node; tail = node;
    if (node.next != null) heap.offer(node.next);   // refill from the same list
}
return dummy.next;`,
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'The heap never holds more than `k` items — one per list. That invariant is what keeps the log factor at `log k` rather than `log n`, and it is the reason this pattern scales.',
        },
        {
          kind: 'para',
          text: 'The same shape solves "smallest range covering all lists", "kth smallest in a sorted matrix" and merging sorted files that do not fit in memory.',
        },
      ],
    },
    {
      id: 'two-heaps',
      title: 'Two heaps: the running median',
      blocks: [
        {
          kind: 'para',
          text: 'Keep the smaller half in a max-heap and the larger half in a min-heap. The two roots sit either side of the middle, so the median is available in `O(1)` after each insertion.',
        },
        {
          kind: 'diagram',
          art: `        max-heap (lower half)      min-heap (upper half)
             [ 5 ]  <- root              root ->  [ 8 ]
            /     \\                              /    \\
        [ 2 ]   [ 4 ]                        [ 9 ]  [ 12 ]

sizes equal        -> median = (5 + 8) / 2
lower has one more -> median = 5`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Insert, then rebalance so the sizes differ by at most one',
          source: `void add(int value) {
    lower.offer(value);                  // max-heap
    upper.offer(lower.poll());           // move the largest of the lower half up
    if (upper.size() > lower.size()) lower.offer(upper.poll());
}

double median() {
    return lower.size() > upper.size() ? lower.peek() : (lower.peek() + upper.peek()) / 2.0;
}`,
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why push through the other heap',
          text: 'Adding to `lower` and immediately moving its maximum to `upper` guarantees the two halves stay correctly partitioned without comparing against the current median. It is one extra `O(log n)` move that removes a whole family of edge cases.',
        },
      ],
    },
    {
      id: 'scheduling',
      title: 'Scheduling and interval problems',
      blocks: [
        {
          kind: 'para',
          text: 'A heap is the standard partner for a sorted sweep: sort by start time, and use a heap keyed on end time to know what has finished.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Minimum meeting rooms - heap of end times',
          source: `Arrays.sort(intervals, (x, y) -> x[0] - y[0]);
PriorityQueue<Integer> ends = new PriorityQueue<>();

for (int[] interval : intervals) {
    if (!ends.isEmpty() && ends.peek() <= interval[0]) ends.poll();   // a room freed up
    ends.offer(interval[1]);
}
return ends.size();   // rooms needed at peak`,
        },
        {
          kind: 'table',
          headers: ['Problem', 'Heap holds'],
          rows: [
            ['Meeting rooms', 'end times of ongoing meetings'],
            ['Task scheduler with cooldown', 'remaining counts, most frequent first'],
            ['CPU / process scheduling', 'jobs ordered by priority or shortest remaining time'],
            ['Dijkstra shortest paths', 'frontier nodes keyed by tentative distance'],
            ['Huffman coding', 'the two least frequent symbols'],
            ['Connect ropes at minimum cost', 'the two shortest ropes'],
          ],
        },
        {
          kind: 'callout',
          tone: 'note',
          text: 'Heaps appear again in the graphs chapter as the engine inside Dijkstra and Prim. Recognising "I repeatedly need the current minimum" is the trigger in all of these.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'A heap maintains only enough order to expose the extreme element, which is why updates are cheap.',
    'Completeness lets it live in a flat array: parent `(i-1)/2`, children `2i+1` and `2i+2`.',
    'Insert sifts up, remove sifts down — both along one root-to-leaf path, `O(log n)`.',
    'Building from an array is `O(n)` because almost all nodes are leaves with no work.',
    'For the k largest, keep a min-heap of size k so the eviction candidate is at the root.',
    'K-way merge keeps one candidate per list, giving `O(n log k)`.',
    'Two heaps split the data at the median and keep it available in `O(1)`.',
    'Sort by start, heap on end is the standard interval-scheduling combination.',
  ],
};
