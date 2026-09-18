import { Chapter } from '../../core/models/chapter.models';

export const SLIDING_WINDOW: Chapter = {
  slug: 'sliding-window',
  title: 'Sliding Window',
  shortTitle: 'Sliding Window',
  level: 'Core',
  order: 9,
  stage: 'sliding-window',
  readingMinutes: 24,
  definition: {
    heading: 'What a sliding window is',
    text:
      'A **sliding window** is a contiguous range `[left, right]` over a sequence, maintained incrementally: the right edge takes in one element, the left edge gives one up, and the answer for the new range is computed from the old one rather than from scratch. Neither edge ever moves backwards, which is why a loop that looks nested is still linear.',
  },
  summary:
    'One window over a contiguous range, maintained incrementally. Almost every "longest", "shortest" or "at most K" question about a contiguous run is this single idea.',
  objectives: [
    'Write both the fixed-size and variable-size window templates from memory',
    'State the invariant your window maintains before writing the loop',
    'Convert "exactly K" into two "at most K" calls',
    'Combine a window with a frequency map or a monotonic deque',
    'Say why every element enters and leaves the window at most once',
  ],
  prerequisites: ['two-pointers', 'hashing'],
  sections: [
    {
      id: 'idea',
      title: 'The idea',
      blocks: [
        {
          kind: 'callout',
          tone: 'note',
          title: 'In plain words',
          text: 'Picture a frame sitting over part of a list. You slide it along, adding whatever enters and removing whatever leaves, instead of recounting the whole frame every time it moves.',
        },
        {
          kind: 'para',
          text: 'Recomputing a property for every subarray is `O(n^2)` or worse. A sliding window keeps one range `[left, right]` and updates the property **incrementally** as the boundaries move, so the work per element is constant.',
        },
        {
          kind: 'visual',
          name: 'sliding-window',
          caption:
            'The right edge always advances; the left edge only moves when the window breaks its rule.',
        },
        {
          kind: 'diagram',
          caption: 'The right edge always advances; the left edge only advances when the window breaks its rule.',
          art: `[ 2 ][ 1 ][ 5 ][ 1 ][ 3 ][ 2 ]
  L---------R                       extend right
  L--------------R                  extend right
       L---------R                  rule broken -> shrink from the left
       L--------------R             extend right`,
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why it is linear',
          text: 'Both pointers only ever move forward, and neither passes the end. So across the whole run there are at most `n` additions and `n` removals — `O(n)` total, even though the inner `while` looks nested.',
        },
      ],
    },
    {
      id: 'fixed',
      title: 'Fixed-size windows',
      blocks: [
        {
          kind: 'para',
          text: 'The simplest case: the window is always exactly `k` wide. Add the entering element, remove the leaving one, read the answer.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Maximum sum of any k consecutive elements',
          source: `long sum = 0;
for (int i = 0; i < k; i++) sum += a[i];      // first window

long best = sum;
for (int right = k; right < n; right++) {
    sum += a[right] - a[right - k];           // add one, drop one
    best = Math.max(best, sum);
}`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'The element leaving is at `right - k`, not `right - k + 1`. Write out the indices for `k = 3` on paper once and this stops being a guess.',
        },
      ],
    },
    {
      id: 'variable',
      title: 'Variable-size windows: the template',
      blocks: [
        {
          kind: 'para',
          text: 'Most problems have a rule instead of a size: "at most K distinct", "no repeated character", "sum at least S". The window grows on the right and shrinks on the left only while the rule is violated.',
        },
        {
          kind: 'code',
          language: 'pseudocode',
          caption: 'Longest window satisfying a condition',
          source: `left = 0
for right in 0 .. n-1:
    add(a[right])                      # extend

    while window is invalid:           # restore the invariant
        remove(a[left])
        left += 1

    best = max(best, right - left + 1) # every window here is valid`,
        },
        {
          kind: 'code',
          language: 'pseudocode',
          caption: 'Shortest window satisfying a condition - note where the answer is read',
          source: `left = 0
for right in 0 .. n-1:
    add(a[right])

    while window is valid:             # shrink while it still works
        best = min(best, right - left + 1)
        remove(a[left])
        left += 1`,
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'The two templates differ in one place: **where you record the answer**. For longest, record after restoring validity. For shortest, record while the window is still valid, before shrinking past it. Getting this backwards is the most common sliding-window bug.',
        },
      ],
    },
    {
      id: 'worked',
      title: 'Worked example: longest substring without repeats',
      blocks: [
        {
          kind: 'steps',
          items: [
            { title: 'State the invariant', text: 'The window contains no repeated character.' },
            { title: 'Extend', text: 'Add the character at `right` to a count map.' },
            { title: 'Restore', text: 'While that character now appears twice, remove from the left.' },
            { title: 'Record', text: 'The window is valid again, so its length is a candidate.' },
          ],
        },
        {
          kind: 'code',
          language: 'java',
          source: `int[] count = new int[128];
int left = 0, best = 0;

for (int right = 0; right < s.length(); right++) {
    char c = s.charAt(right);
    count[c]++;

    while (count[c] > 1) count[s.charAt(left++)]--;   // only the duplicate can break it

    best = Math.max(best, right - left + 1);
}`,
        },
        {
          kind: 'diagram',
          caption: 'On "abcabcbb": the window slides past each repeat rather than restarting.',
          art: `a b c a b c b b
L---R                 "abc"      best = 3
  L---R               "bca"      best = 3
    L---R             "cab"      best = 3
            L R       "b"
              L R     "b"        best stays 3`,
        },
      ],
    },
    {
      id: 'exactly-k',
      title: 'Turning "exactly K" into "at most K"',
      blocks: [
        {
          kind: 'para',
          text: '"At most K" is a natural window rule: the window shrinks while the count exceeds K. "Exactly K" is not — a window can be valid, then invalid, then valid again, so the two pointers cannot both stay monotonic.',
        },
        {
          kind: 'para',
          text: 'The fix is a subtraction. Any window with exactly K distinct values is one with at most K minus one with at most K-1.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Count subarrays with exactly k distinct values',
          source: `int exactly(int[] a, int k) {
    return atMost(a, k) - atMost(a, k - 1);
}`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'The reusable half: counting subarrays with at most k distinct values',
          source: `int atMost(int[] a, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    int left = 0, total = 0;

    for (int right = 0; right < a.length; right++) {
        count.merge(a[right], 1, Integer::sum);

        while (count.size() > k) {
            int leaving = a[left++];
            if (count.merge(leaving, -1, Integer::sum) == 0) count.remove(leaving);
        }

        total += right - left + 1;   // every window ending at right is valid
    }
    return total;
}`,
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why `right - left + 1` counts subarrays',
          text: 'Once the window is valid, every subarray ending at `right` and starting anywhere in `[left, right]` is also valid — shorter windows can only have fewer distinct values. There are exactly `right - left + 1` of them.',
        },
      ],
    },
    {
      id: 'deque',
      title: 'Windows with a monotonic deque',
      blocks: [
        {
          kind: 'para',
          text: 'Some window questions ask for the maximum or minimum inside the window. Rescanning is `O(n k)`. A deque holding indices in decreasing order of value gives `O(n)`.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Maximum of every window of size k',
          source: `Deque<Integer> deque = new ArrayDeque<>();   // holds indices, values decreasing

for (int right = 0; right < n; right++) {
    while (!deque.isEmpty() && a[deque.peekLast()] <= a[right]) deque.pollLast();
    deque.offerLast(right);

    if (deque.peekFirst() <= right - k) deque.pollFirst();   // it slid out
    if (right >= k - 1) report(a[deque.peekFirst()]);        // front is the max
}`,
        },
        {
          kind: 'callout',
          tone: 'why',
          text: 'A smaller value that arrives later can never be the maximum again while the larger, newer value is still in the window — so it is safe to drop it forever. Each index is pushed once and popped once, which is why the total is linear.',
        },
      ],
    },
    {
      id: 'signals',
      title: 'Recognition signals',
      blocks: [
        {
          kind: 'table',
          headers: ['Phrase in the problem', 'What it means'],
          rows: [
            ['"longest substring / subarray such that ..."', 'variable window, record after restoring'],
            ['"shortest subarray with ..."', 'variable window, record before shrinking'],
            ['"contains at most K ..."', 'window rule on a count'],
            ['"exactly K"', 'atMost(K) - atMost(K-1)'],
            ['"every window of size K"', 'fixed window'],
            ['"contiguous" or "consecutive"', 'a window applies at all'],
            ['"maximum in each window"', 'window plus monotonic deque'],
          ],
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'When a window does not work',
          text: 'Sliding windows need the rule to be **monotone**: extending can only make the window worse, and shrinking can only make it better. With negative numbers and a "sum at least S" rule that fails — adding an element can help — so prefix sums with a map or a deque is the correct tool instead.',
        },
        {
          kind: 'check',
          question: 'Why does "longest subarray with sum at least S" break when negatives are allowed?',
          answer: 'Because extending the window right can *decrease* the sum, so an invalid window may become valid again later. The shrink rule no longer preserves an invariant, and the pointers stop being monotonic. Use prefix sums with a monotonic deque instead.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'A window maintains a property incrementally instead of recomputing it.',
    'Both pointers only move forward, so the total work is linear despite the nested `while`.',
    'Fixed windows add one and drop one; the element leaving is at `right - k`.',
    'Longest records after restoring the invariant; shortest records before shrinking.',
    '"Exactly K" is `atMost(K) - atMost(K-1)`.',
    'Once a window is valid, `right - left + 1` subarrays ending at `right` are valid too.',
    'A monotonic deque answers max or min per window in linear total time.',
    'Windows need a monotone rule — negatives with sum conditions break them.',
  ],
};
