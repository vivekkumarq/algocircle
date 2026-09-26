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
          kind: 'figure',
          height: 212,
          label: 'The same array with a three-wide window before and after one step',
          caption: 'Only the two edges change, so each step is constant work.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">The window of size 3 moves one step</text>
<rect x="40" y="32" width="62" height="40" rx="4" class="dg-fill" />
<text x="71" y="56.5" class="dg-t" text-anchor="middle">3</text>
<rect x="108" y="32" width="62" height="40" rx="4" class="dg-fill" />
<text x="139" y="56.5" class="dg-t" text-anchor="middle">1</text>
<rect x="176" y="32" width="62" height="40" rx="4" class="dg-fill" />
<text x="207" y="56.5" class="dg-t" text-anchor="middle">4</text>
<rect x="244" y="32" width="62" height="40" rx="4" class="dg-box" />
<text x="275" y="56.5" class="dg-t" text-anchor="middle">1</text>
<rect x="312" y="32" width="62" height="40" rx="4" class="dg-box" />
<text x="343" y="56.5" class="dg-t" text-anchor="middle">5</text>
<rect x="380" y="32" width="62" height="40" rx="4" class="dg-box" />
<text x="411" y="56.5" class="dg-t" text-anchor="middle">9</text>
<rect x="448" y="32" width="62" height="40" rx="4" class="dg-box" />
<text x="479" y="56.5" class="dg-t" text-anchor="middle">2</text>
<text x="560" y="58" class="dg-m" text-anchor="start">sum 8</text>
<rect x="40" y="110" width="62" height="40" rx="4" class="dg-box" />
<text x="71" y="134.5" class="dg-t" text-anchor="middle">3</text>
<rect x="108" y="110" width="62" height="40" rx="4" class="dg-fill" />
<text x="139" y="134.5" class="dg-t" text-anchor="middle">1</text>
<rect x="176" y="110" width="62" height="40" rx="4" class="dg-fill" />
<text x="207" y="134.5" class="dg-t" text-anchor="middle">4</text>
<rect x="244" y="110" width="62" height="40" rx="4" class="dg-fill" />
<text x="275" y="134.5" class="dg-t" text-anchor="middle">1</text>
<rect x="312" y="110" width="62" height="40" rx="4" class="dg-box" />
<text x="343" y="134.5" class="dg-t" text-anchor="middle">5</text>
<rect x="380" y="110" width="62" height="40" rx="4" class="dg-box" />
<text x="411" y="134.5" class="dg-t" text-anchor="middle">9</text>
<rect x="448" y="110" width="62" height="40" rx="4" class="dg-box" />
<text x="479" y="134.5" class="dg-t" text-anchor="middle">2</text>
<text x="560" y="136" class="dg-m" text-anchor="start">sum 6</text>
<path class="dg-dash" marker-end="url(#ah)" d="M71 104 L71 82" />
<text x="71" y="100" class="dg-s" text-anchor="middle"></text>
<text x="150" y="176" class="dg-s" text-anchor="middle">drop a[0] = 3</text>
<text x="330" y="176" class="dg-s" text-anchor="middle">add a[3] = 1</text>
<text x="0" y="200" class="dg-s" text-anchor="start">one subtraction and one addition — never a fresh loop over the window</text>`,
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
          kind: 'code',
          language: 'python',
          source: `window = sum(a[:k])          # first window
best = window

for right in range(k, len(a)):
    window += a[right] - a[right - k]    # add one, drop one
    best = max(best, window)`,
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
          kind: 'figure',
          height: 184,
          label: 'A valid window with a left and a right edge, both moving forward only',
          caption: 'Record the answer after shrinking for a longest, inside the shrink for a shortest.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">Grow on the right while you can, shrink on the left while you must</text>
<rect x="40" y="40" width="260" height="44" rx="6" class="dg-fill" />
<text x="170" y="67" class="dg-t" text-anchor="middle">valid window</text>
<rect x="300" y="40" width="240" height="44" rx="6" class="dg-muted" />
<text x="420" y="67" class="dg-s" text-anchor="middle">not looked at yet</text>
<text x="40" y="104" class="dg-m" text-anchor="middle">left</text>
<text x="300" y="104" class="dg-m" text-anchor="middle">right</text>
<path class="dg-line" marker-end="url(#ah)" d="M40 100 L40 88" />
<path class="dg-line" marker-end="url(#ah)" d="M300 100 L300 88" />
<path class="dg-line" marker-end="url(#ah)" d="M300 122 L380 122" />
<text x="340" y="140" class="dg-s" text-anchor="middle">right always advances</text>
<path class="dg-line" marker-end="url(#ah)" d="M40 122 L120 122" />
<text x="80" y="140" class="dg-s" text-anchor="middle">left only when invalid</text>
<text x="0" y="172" class="dg-s" text-anchor="start">neither edge ever goes backwards, so the nested loop is still O(n)</text>`,
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
          kind: 'para',
          text:
            'The template is easier to trust once you have seen it run. Take the longest substring with no repeated character in `abcabcbb`: the window grows while the characters stay distinct, and the moment one repeats, the left edge jumps past the earlier copy rather than stepping one at a time.',
        },
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
          kind: 'para',
          text:
            'Watch which quantity each step maintains. The count of each character inside the window is updated as the edges move, so the validity test is a single lookup rather than a rescan. That is the whole reason the window is linear: every element enters once, leaves once, and is never examined again.',
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
          kind: 'code',
          language: 'python',
          source: `from collections import defaultdict

count = defaultdict(int)
left = best = 0

for right, c in enumerate(s):
    count[c] += 1

    while count[c] > 1:                  # only the duplicate can break it
        count[s[left]] -= 1
        left += 1

    best = max(best, right - left + 1)`,
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
          kind: 'figure',
          height: 238,
          label: 'At most K minus at most K minus one equals exactly K',
          caption: 'The trick is that "at most" is easy to count and "exactly" is not.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">Exactly K is a subtraction of two easier counts</text>
<rect x="40" y="40" width="230" height="54" rx="6" class="dg-fill" />
<text x="155" y="71.5" class="dg-t" text-anchor="middle">at most K</text>
<text x="155" y="112" class="dg-s" text-anchor="middle">windows with K or fewer distinct</text>
<text x="300" y="74" class="dg-t" text-anchor="middle">−</text>
<rect x="330" y="40" width="230" height="54" rx="6" class="dg-muted" />
<text x="445" y="71.5" class="dg-t" text-anchor="middle">at most K − 1</text>
<text x="445" y="112" class="dg-s" text-anchor="middle">windows with K − 1 or fewer</text>
<path class="dg-line" marker-end="url(#ah)" d="M155 128 L155 154" />
<path class="dg-line" marker-end="url(#ah)" d="M445 128 L445 154" />
<rect x="180" y="156" width="240" height="46" rx="6" class="dg-fill2" />
<text x="300" y="183.5" class="dg-on" text-anchor="middle">exactly K</text>
<text x="0" y="226" class="dg-s" text-anchor="start">one function, called twice — there is no separate "exactly" scan to write</text>`,
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
          language: 'python',
          source: `def exactly(a: list[int], k: int) -> int:
    return at_most(a, k) - at_most(a, k - 1)`,
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
          kind: 'code',
          language: 'python',
          source: `from collections import defaultdict


def at_most(a: list[int], k: int) -> int:
    count: dict[int, int] = defaultdict(int)
    left = total = 0

    for right, value in enumerate(a):
        count[value] += 1

        while len(count) > k:
            leaving = a[left]
            count[leaving] -= 1
            if count[leaving] == 0:
                del count[leaving]
            left += 1

        total += right - left + 1     # every window ending at right is valid

    return total`,
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
          kind: 'figure',
          height: 146,
          label: 'A monotonic deque dropping smaller values when a larger one arrives',
          caption: 'Anything smaller than the arriving value can never be a maximum again.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">The deque holds indices whose values only decrease</text>
<rect x="40" y="34" width="70" height="42" rx="4" class="dg-fill2" />
<text x="75" y="59.5" class="dg-on" text-anchor="middle">9</text>
<rect x="118" y="34" width="70" height="42" rx="4" class="dg-box" />
<text x="153" y="59.5" class="dg-t" text-anchor="middle">6</text>
<rect x="196" y="34" width="70" height="42" rx="4" class="dg-box" />
<text x="231" y="59.5" class="dg-t" text-anchor="middle">4</text>
<text x="75" y="92" class="dg-m" text-anchor="middle">front = the answer</text>
<text x="266" y="60" class="dg-m" text-anchor="start">back</text>
<path class="dg-line" marker-end="url(#ah)" d="M320 55 L380 55" />
<text x="350" y="40" class="dg-s" text-anchor="middle">a[i] = 7 arrives</text>
<rect x="400" y="34" width="70" height="42" rx="4" class="dg-fill2" />
<text x="435" y="59.5" class="dg-on" text-anchor="middle">9</text>
<rect x="478" y="34" width="70" height="42" rx="4" class="dg-box" />
<text x="513" y="59.5" class="dg-t" text-anchor="middle">7</text>
<text x="470" y="92" class="dg-s" text-anchor="middle">6 and 4 popped: smaller and older</text>
<text x="0" y="132" class="dg-s" text-anchor="start">each index is pushed once and popped once, so the whole sweep is O(n)</text>`,
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
          kind: 'code',
          language: 'python',
          source: `from collections import deque

window = deque()                   # holds indices, values decreasing

for right, value in enumerate(a):
    while window and a[window[-1]] <= value:
        window.pop()
    window.append(right)

    if window[0] <= right - k:
        window.popleft()           # it slid out
    if right >= k - 1:
        report(a[window[0]])       # front is the max`,
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
          kind: 'para',
          text:
            'Recognising a window problem is mostly about spotting two things in the statement together: a **contiguous** range — a substring or a subarray, never a subsequence — and a question about the best or the count of such ranges. If the elements are allowed to be non-adjacent, a window cannot help and you are looking at a different technique.',
        },
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
          kind: 'para',
          text:
            'One condition matters more than any keyword: growing the window must move the quantity you are testing in one direction. Adding a positive number always increases a sum, so a window works. Add negative numbers and it does not, because a longer window may have a smaller sum — that problem wants prefix sums with a hash map instead, and this is the single most common way a window is misapplied.',
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
