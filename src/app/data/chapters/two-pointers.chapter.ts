import { Chapter } from '../../core/models/chapter.models';

export const TWO_POINTERS: Chapter = {
  slug: 'two-pointers',
  title: 'Two Pointers',
  shortTitle: 'Two Pointers',
  level: 'Core',
  order: 8,
  stage: 'two-pointers',
  readingMinutes: 22,
  definition: {
    heading: 'What the two-pointer technique is',
    text:
      '**Two pointers** is a scan that keeps two indices into the same sequence and moves each one forward at most once, so a search that looks like it needs every pair finishes in a single pass. It works only when moving a pointer changes the quantity you are testing in a predictable direction — usually created by sorting the data first.',
  },
  summary:
    'Two indices moving under a rule that never rewinds. The cheapest way to turn a nested loop into a single pass — and the foundation the sliding window is built on.',
  objectives: [
    'Decide whether opposite-end or same-direction pointers fit a problem',
    'Justify why moving one pointer safely discards a whole set of candidates',
    'Solve pair, triplet and partition problems in linear time after sorting',
    'Detect a cycle with fast and slow pointers and find where it begins',
    'Recognise the signals that a problem is a two-pointer problem',
  ],
  prerequisites: ['arrays', 'hashing'],
  sections: [
    {
      id: 'idea',
      title: 'The idea',
      blocks: [
        {
          kind: 'callout',
          tone: 'note',
          title: 'In plain words',
          text: 'Instead of two nested loops checking every pair, you use two markers that walk through the data once and never go backwards. Fewer steps, same answer.',
        },
        {
          kind: 'para',
          text: 'A nested loop examines every pair: `O(n^2)`. Two pointers examine a linear number of pairs by making each move **eliminate candidates permanently**. The whole technique rests on proving that the discarded candidates could not have been the answer.',
        },
        {
          kind: 'compare',
          columns: [
            {
              title: 'Opposite ends',
              points: [
                'One pointer at each end, moving inward.',
                'Needs sorted data or a symmetric condition.',
                'Sum too small, move left up; too big, move right down.',
                'Pairs with a target, palindromes, container with most water.',
              ],
            },
            {
              title: 'Same direction',
              points: [
                'Both start at the left; one leads, one follows.',
                'The follower marks where the answer is being written.',
                'Nothing ever moves backwards.',
                'In-place removal, dedupe, merging, windows.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'opposite-ends',
      title: 'Opposite ends: pair with a target',
      blocks: [
        {
          kind: 'para',
          text: 'Given a **sorted** array, find two values summing to a target.',
        },
        {
          kind: 'visual',
          name: 'two-pointers',
          caption:
            'Each move rules out a whole set of pairs, which is why one pass is enough.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'O(n) time, O(1) space',
          source: `int lo = 0, hi = n - 1;
while (lo < hi) {
    int sum = a[lo] + a[hi];
    if (sum == target) return new int[] { lo, hi };
    if (sum < target) lo++;      // need a bigger sum
    else               hi--;     // need a smaller sum
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `lo, hi = 0, len(a) - 1

while lo < hi:
    total = a[lo] + a[hi]
    if total == target:
        return [lo, hi]

    if total < target:
        lo += 1        # need a bigger sum
    else:
        hi -= 1        # need a smaller sum`,
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why moving a pointer is safe',
          text: 'If `a[lo] + a[hi] < target`, then `a[lo]` paired with anything at or below `hi` is also too small — because everything below `hi` is smaller still. So `a[lo]` cannot be part of any solution and can be discarded forever. That argument, not the code, is what an interviewer wants to hear.',
        },
        {
          kind: 'diagram',
          art: `target = 10

[ 1 ][ 3 ][ 4 ][ 6 ][ 8 ][ 9 ]
  ^                        ^     1 + 9 = 10   found

target = 13
[ 1 ][ 3 ][ 4 ][ 6 ][ 8 ][ 9 ]
  ^                        ^     10 < 13, move lo
       ^                   ^     12 < 13, move lo
            ^              ^     13         found`,
        },
        {
          kind: 'para',
          text: 'When the array is unsorted and you only need **values**, a hash map does it in one pass without sorting. Two pointers win when the array is already sorted, when you need `O(1)` space, or when the problem asks for triplets.',
        },
      ],
    },
    {
      id: 'triplets',
      title: 'Triplets: fix one, then two-point the rest',
      blocks: [
        {
          kind: 'para',
          text: 'Finding three values summing to a target is the standard extension: sort, fix the first element with an outer loop, and two-point the remaining suffix. That is `O(n^2)` overall, down from `O(n^3)`.',
        },
        {
          kind: 'figure',
          height: 190,
          label: 'A sorted array with one fixed anchor and two pointers closing in',
          caption: 'Every harder variant is this: fix what you must, two-point the rest.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">Sort first, then fix one value and two-point the rest</text>
<rect x="70" y="34" width="68" height="40" rx="4" class="dg-fill2" />
<text x="104" y="58.5" class="dg-on" text-anchor="middle">-4</text>
<rect x="146" y="34" width="68" height="40" rx="4" class="dg-box" />
<text x="180" y="58.5" class="dg-t" text-anchor="middle">-1</text>
<rect x="222" y="34" width="68" height="40" rx="4" class="dg-fill" />
<text x="256" y="58.5" class="dg-t" text-anchor="middle">-1</text>
<rect x="298" y="34" width="68" height="40" rx="4" class="dg-box" />
<text x="332" y="58.5" class="dg-t" text-anchor="middle">0</text>
<rect x="374" y="34" width="68" height="40" rx="4" class="dg-box" />
<text x="408" y="58.5" class="dg-t" text-anchor="middle">1</text>
<rect x="450" y="34" width="68" height="40" rx="4" class="dg-fill" />
<text x="484" y="58.5" class="dg-t" text-anchor="middle">2</text>
<text x="104" y="96" class="dg-m" text-anchor="middle">fixed</text>
<text x="256" y="96" class="dg-m" text-anchor="middle">lo</text>
<text x="560" y="96" class="dg-m" text-anchor="middle">hi</text>
<path class="dg-line" marker-end="url(#ah)" d="M104 92 L104 78" />
<path class="dg-line" marker-end="url(#ah)" d="M256 92 L256 78" />
<path class="dg-line" marker-end="url(#ah)" d="M560 92 L560 78" />
<text x="310" y="130" class="dg-s" text-anchor="middle">sum too small → lo moves right</text>
<text x="310" y="150" class="dg-s" text-anchor="middle">sum too large → hi moves left</text>
<text x="0" y="178" class="dg-s" text-anchor="start">the outer loop is O(n) and the inner scan is O(n), so the whole thing is O(n squared)</text>`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Triplets summing to zero, duplicates skipped',
          source: `Arrays.sort(a);
for (int i = 0; i < n - 2; i++) {
    if (i > 0 && a[i] == a[i - 1]) continue;          // skip duplicate anchors
    int lo = i + 1, hi = n - 1;
    while (lo < hi) {
        int sum = a[i] + a[lo] + a[hi];
        if (sum == 0) {
            report(a[i], a[lo], a[hi]);
            while (lo < hi && a[lo] == a[lo + 1]) lo++;   // skip duplicate pairs
            while (lo < hi && a[hi] == a[hi - 1]) hi--;
            lo++; hi--;
        } else if (sum < 0) lo++;
        else hi--;
    }
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `a.sort()

for i in range(len(a) - 2):
    if i and a[i] == a[i - 1]:
        continue                                  # skip duplicate anchors

    lo, hi = i + 1, len(a) - 1
    while lo < hi:
        total = a[i] + a[lo] + a[hi]

        if total == 0:
            report(a[i], a[lo], a[hi])
            while lo < hi and a[lo] == a[lo + 1]:  # skip duplicate pairs
                lo += 1
            while lo < hi and a[hi] == a[hi - 1]:
                hi -= 1
            lo += 1
            hi -= 1
        elif total < 0:
            lo += 1
        else:
            hi -= 1`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'Duplicates are the whole difficulty',
          text: 'The two-pointer part is easy; producing each distinct triplet exactly once is where solutions break. Skip repeated values at the anchor **and** after recording a hit, and only after the hit — skipping before it drops valid triplets.',
        },
      ],
    },
    {
      id: 'same-direction',
      title: 'Same direction: the read and write pointers',
      blocks: [
        {
          kind: 'para',
          text: 'One pointer reads every element; the other marks where the next kept element goes. Everything before the write pointer is finished output.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Remove duplicates from a sorted array, in place',
          source: `int write = 1;
for (int read = 1; read < n; read++) {
    if (a[read] != a[write - 1]) a[write++] = a[read];
}
return write;   // new length`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `write = 1

for read in range(1, len(a)):
    if a[read] != a[write - 1]:
        a[write] = a[read]
        write += 1

return write   # new length`,
        },
        {
          kind: 'diagram',
          caption: 'The write pointer never passes the read pointer, so nothing unread is overwritten.',
          art: `read  ->            r
      [1][1][2][2][3]
       w
      write ->

after: [1][2][3] | 2  3   (tail is stale, length = 3)`,
        },
        {
          kind: 'para',
          text: 'The same skeleton, with a different keep-condition, gives you: remove a value, move zeroes to the end, compact a filtered list, and partition around a pivot.',
        },
      ],
    },
    {
      id: 'partitioning',
      title: 'Partitioning and the Dutch national flag',
      blocks: [
        {
          kind: 'para',
          text: 'Sorting an array of only three distinct values does not need a sort. Three pointers do it in one pass: everything before `low` is the first value, everything after `high` is the third, and the middle is unprocessed.',
        },
        {
          kind: 'figure',
          height: 164,
          label: 'An array split into settled zeroes, settled ones and an unseen tail',
          caption: 'The invariant is the three regions; every step keeps them true.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">Three regions, three pointers, one pass</text>
<rect x="30" y="34" width="60" height="40" rx="4" class="dg-muted" />
<text x="60" y="58.5" class="dg-t" text-anchor="middle">2</text>
<rect x="98" y="34" width="60" height="40" rx="4" class="dg-fill" />
<text x="128" y="58.5" class="dg-t" text-anchor="middle">0</text>
<rect x="166" y="34" width="60" height="40" rx="4" class="dg-box" />
<text x="196" y="58.5" class="dg-t" text-anchor="middle">2</text>
<rect x="234" y="34" width="60" height="40" rx="4" class="dg-box" />
<text x="264" y="58.5" class="dg-t" text-anchor="middle">1</text>
<rect x="302" y="34" width="60" height="40" rx="4" class="dg-box" />
<text x="332" y="58.5" class="dg-t" text-anchor="middle">1</text>
<rect x="370" y="34" width="60" height="40" rx="4" class="dg-box" />
<text x="400" y="58.5" class="dg-t" text-anchor="middle">0</text>
<rect x="438" y="34" width="60" height="40" rx="4" class="dg-box" />
<text x="468" y="58.5" class="dg-t" text-anchor="middle">2</text>
<rect x="506" y="34" width="60" height="40" rx="4" class="dg-box" />
<text x="536" y="58.5" class="dg-t" text-anchor="middle">0</text>
<path class="dg-line" d="M30 84 L158 84" />
<text x="94" y="100" class="dg-s" text-anchor="middle">settled 0s</text>
<path class="dg-line" d="M166 84 L362 84" />
<text x="264" y="100" class="dg-s" text-anchor="middle">settled 1s</text>
<path class="dg-line" d="M370 84 L574 84" />
<text x="472" y="100" class="dg-s" text-anchor="middle">unseen</text>
<text x="60" y="126" class="dg-m" text-anchor="middle">low</text>
<text x="196" y="126" class="dg-m" text-anchor="middle">mid</text>
<text x="544" y="126" class="dg-m" text-anchor="middle">high</text>
<path class="dg-line" marker-end="url(#ah)" d="M60 122 L60 106" />
<path class="dg-line" marker-end="url(#ah)" d="M196 122 L196 106" />
<path class="dg-line" marker-end="url(#ah)" d="M544 122 L544 106" />
<text x="0" y="152" class="dg-s" text-anchor="start">swapping a 2 brings back something unseen, so mid must NOT advance</text>`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Sort 0s, 1s and 2s in one pass, O(1) space',
          source: `int low = 0, mid = 0, high = n - 1;
while (mid <= high) {
    if (a[mid] == 0)      swap(a, low++, mid++);
    else if (a[mid] == 1) mid++;
    else                  swap(a, mid, high--);   // do NOT advance mid
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `low = mid = 0
high = len(a) - 1

while mid <= high:
    if a[mid] == 0:
        a[low], a[mid] = a[mid], a[low]
        low += 1
        mid += 1
    elif a[mid] == 1:
        mid += 1
    else:
        a[mid], a[high] = a[high], a[mid]
        high -= 1                          # do NOT advance mid`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'Why `mid` does not advance on a 2',
          text: 'The value swapped in from the right has not been examined yet. Advancing past it skips an element and produces a wrong order — this is the single most common bug in this algorithm.',
        },
      ],
    },
    {
      id: 'merging',
      title: 'Merging two sorted sequences',
      blocks: [
        {
          kind: 'para',
          text: 'Two pointers over two arrays instead of one. This is the merge step of merge sort, and it appears on its own constantly.',
        },
        {
          kind: 'figure',
          height: 188,
          label: 'Two sorted rows feeding one merged row',
          caption: 'The comparison at the two heads decides which one advances.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">Two sorted inputs, one output, each element copied once</text>
<rect x="30" y="30" width="54" height="36" rx="4" class="dg-fill" />
<text x="57" y="52.5" class="dg-t" text-anchor="middle">1</text>
<rect x="90" y="30" width="54" height="36" rx="4" class="dg-box" />
<text x="117" y="52.5" class="dg-t" text-anchor="middle">4</text>
<rect x="150" y="30" width="54" height="36" rx="4" class="dg-box" />
<text x="177" y="52.5" class="dg-t" text-anchor="middle">7</text>
<text x="12" y="54" class="dg-m" text-anchor="end">a</text>
<rect x="30" y="86" width="54" height="36" rx="4" class="dg-fill" />
<text x="57" y="108.5" class="dg-t" text-anchor="middle">2</text>
<rect x="90" y="86" width="54" height="36" rx="4" class="dg-box" />
<text x="117" y="108.5" class="dg-t" text-anchor="middle">3</text>
<rect x="150" y="86" width="54" height="36" rx="4" class="dg-box" />
<text x="177" y="108.5" class="dg-t" text-anchor="middle">9</text>
<text x="12" y="110" class="dg-m" text-anchor="end">b</text>
<text x="60" y="152" class="dg-m" text-anchor="middle">i</text>
<text x="60" y="24" class="dg-m" text-anchor="middle">j</text>
<path class="dg-line" marker-end="url(#ah)" d="M210 84 L268 84" />
<text x="239" y="72" class="dg-s" text-anchor="middle">take the smaller</text>
<rect x="300" y="58" width="46" height="36" rx="4" class="dg-fill2" />
<text x="323" y="80.5" class="dg-on" text-anchor="middle">1</text>
<rect x="352" y="58" width="46" height="36" rx="4" class="dg-box" />
<text x="375" y="80.5" class="dg-t" text-anchor="middle">2</text>
<rect x="404" y="58" width="46" height="36" rx="4" class="dg-box" />
<text x="427" y="80.5" class="dg-t" text-anchor="middle">3</text>
<rect x="456" y="58" width="46" height="36" rx="4" class="dg-box" />
<text x="479" y="80.5" class="dg-t" text-anchor="middle">4</text>
<rect x="508" y="58" width="46" height="36" rx="4" class="dg-box" />
<text x="531" y="80.5" class="dg-t" text-anchor="middle">7</text>
<rect x="560" y="58" width="46" height="36" rx="4" class="dg-box" />
<text x="583" y="80.5" class="dg-t" text-anchor="middle">9</text>
<text x="456" y="120" class="dg-m" text-anchor="middle">merged</text>
<text x="0" y="176" class="dg-s" text-anchor="start">neither index ever moves back, so the whole merge is O(n + m)</text>`,
        },
        {
          kind: 'code',
          language: 'java',
          source: `int i = 0, j = 0, k = 0;
while (i < n && j < m) out[k++] = (a[i] <= b[j]) ? a[i++] : b[j++];
while (i < n) out[k++] = a[i++];
while (j < m) out[k++] = b[j++];`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `i = j = 0
out = []

while i < len(a) and j < len(b):
    if a[i] <= b[j]:
        out.append(a[i])
        i += 1
    else:
        out.append(b[j])
        j += 1

out.extend(a[i:])
out.extend(b[j:])

# the standard library does exactly this: heapq.merge(a, b)`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Merging in place, from the back',
          text: 'When the first array has spare capacity at the end, write from the back with pointers starting at the last real elements. Writing backwards means you never overwrite a value you still need to read.',
        },
      ],
    },
    {
      id: 'fast-slow',
      title: 'Fast and slow pointers',
      blocks: [
        {
          kind: 'para',
          text: 'The two pointers do not have to move at the same speed. One moving twice as fast as the other detects cycles and finds midpoints without knowing the length in advance.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Cycle detection - if there is a loop, the fast pointer laps the slow one',
          source: `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) return true;    // they met, so there is a cycle
}
return false;`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `slow = fast = head

while fast and fast.next:
    slow = slow.next
    fast = fast.next.next

    if slow is fast:
        return True        # they met, so there is a cycle

return False`,
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why they must meet',
          text: 'Inside a cycle the gap between them changes by exactly one each step, so it cannot jump over zero. If a cycle exists, the gap eventually becomes zero and they land on the same node.',
        },
        {
          kind: 'para',
          text: 'To find where the cycle starts, reset one pointer to the head after they meet and advance both one step at a time; they meet again at the entry point. The proof is a short piece of arithmetic on the distances, and it is worth deriving once so it stops looking like magic.',
        },
        {
          kind: 'table',
          headers: ['Use', 'Setup'],
          rows: [
            ['Middle of a list', 'slow moves 1, fast moves 2; when fast ends, slow is at the middle'],
            ['Nth node from the end', 'move fast n steps ahead, then advance both until fast ends'],
            ['Detect a cycle', 'slow 1, fast 2, check for equality'],
            ['Happy number', 'apply the transformation once vs. twice'],
            ['Palindrome list', 'find the middle, reverse the second half, compare'],
          ],
        },
      ],
    },
    {
      id: 'signals',
      title: 'Recognising a two-pointer problem',
      blocks: [
        {
          kind: 'list',
          items: [
            'The input is **sorted**, or sorting it does not break the question.',
            'You are looking for a **pair or triplet** satisfying a numeric relation.',
            'The problem asks for `O(1)` extra space with in-place modification.',
            'The condition is **monotonic**: moving a pointer always pushes the value the same way.',
            'The words "from both ends", "in place", "remove", "partition" or "merge" appear.',
            'It is a linked list question about the middle, the end, or a cycle.',
          ],
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'When it does not apply',
          text: 'Two pointers need a monotonic relation. With negative numbers and a product target, or when sorting destroys required index order, the elimination argument fails — and a hash map or a different structure is the right answer.',
        },
        {
          kind: 'check',
          question: 'You need pairs summing to a target, but must return the original indices and cannot modify the array. Two pointers or hashing?',
          answer: 'Hashing. Sorting destroys the original indices, and preserving them means carrying index pairs through the sort, which is more work than a single-pass hash map.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'Each pointer move must eliminate candidates permanently — that argument is the technique.',
    'Opposite ends need sorted data or symmetry; same direction needs a keep-condition.',
    'Triplets are an outer loop plus two pointers; duplicate handling is the hard part.',
    'The write pointer never passes the read pointer, which is why in-place work is safe.',
    "Dutch national flag sorts three values in one pass — don't advance `mid` on a swap from the right.",
    'Fast and slow pointers find cycles, middles and nth-from-end without knowing the length.',
    'Sorted input, pair or triplet targets, and `O(1)` space requirements are the signals.',
  ],
};
