import { Chapter } from '../../core/models/chapter.models';

export const LINKED_LISTS: Chapter = {
  slug: 'linked-lists',
  title: 'Linked Lists',
  shortTitle: 'Linked Lists',
  level: 'Core',
  order: 13,
  stage: 'linked-lists',
  readingMinutes: 26,
  definition: {
    heading: 'What a linked list is',
    text:
      'A **linked list** is a chain of nodes, each holding a value and a reference to the next node. Nothing is contiguous, so there is no index arithmetic: reaching position `k` means walking `k` links, which is `O(n)`. In exchange, inserting or removing a node costs `O(1)` once you hold the node before it — the opposite trade to an array.',
  },
  summary:
    'Pointer surgery: reversing, finding the middle, detecting cycles and rebuilding lists without losing a reference. The clearest test of whether you can reason precisely about references.',
  objectives: [
    'Say when a linked list beats an array and when it does not',
    'Reverse a list iteratively without losing the rest of it',
    'Use fast and slow pointers for the middle, the nth from the end and cycles',
    'Use a dummy head to remove every special case at the front',
    'Design an LRU cache from a hash map and a doubly linked list',
  ],
  prerequisites: ['recursion'],
  sections: [
    {
      id: 'structure',
      title: 'What a linked list is',
      blocks: [
        {
          kind: 'callout',
          tone: 'note',
          title: 'In plain words',
          text: 'Instead of a row of boxes side by side, imagine a chain where each box holds an arrow pointing at the next one. Rearranging the chain is easy; finding the tenth box is not.',
        },
        {
          kind: 'para',
          text: 'A linked list is a chain of nodes. Each node holds a value and a reference to the next node. There is no contiguous block and no index arithmetic — the only way to reach the fifth element is to walk through the first four.',
        },
        {
          kind: 'diagram',
          caption: 'Nodes can live anywhere in memory; the links are what impose the order.',
          art: `head
 |
 v
[ 3 | * ] --> [ 7 | * ] --> [ 1 | * ] --> [ 9 | / ]
                                            null`,
        },
        {
          kind: 'code',
          language: 'java',
          source: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `class ListNode:
    __slots__ = ('val', 'next')

    def __init__(self, val: int, next: 'ListNode | None' = None) -> None:
        self.val = val
        self.next = next`,
        },
        {
          kind: 'table',
          caption: 'Every difference from an array follows from "no contiguous block".',
          headers: ['Operation', 'Array', 'Linked list'],
          rows: [
            ['Access by index', '`O(1)`', '`O(n)`'],
            ['Insert or delete at the front', '`O(n)`', '`O(1)`'],
            ['Insert or delete after a known node', '`O(n)`', '`O(1)`'],
            ['Search by value', '`O(n)`', '`O(n)`'],
            ['Memory per element', 'just the value', 'value plus a reference'],
            ['Cache behaviour', 'excellent', 'poor — nodes are scattered'],
          ],
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'Linked lists are rarer in practice than in interviews',
          text: 'A dynamic array beats a linked list for most real workloads, because pointer chasing defeats the cache. Lists earn their place when you hold a reference to the node itself and splice in `O(1)` — which is exactly what an LRU cache needs.',
        },
      ],
    },
    {
      id: 'traversal',
      title: 'Traversal and the golden rule',
      blocks: [
        {
          kind: 'code',
          language: 'java',
          caption: 'The loop you will write a hundred times',
          source: `for (ListNode node = head; node != null; node = node.next) {
    visit(node.val);
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `node = head
while node:
    visit(node.val)
    node = node.next`,
        },
        {
          kind: 'callout',
          tone: 'key',
          title: 'Never lose the rest of the list',
          text: 'Before you overwrite `node.next`, save it. Reassigning a link without keeping the tail somewhere is how the remainder of the list becomes unreachable — the single most common linked-list bug.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Wrong, then right',
          source: `// WRONG: the rest of the list is gone the moment next is overwritten
node.next = previous;
node = node.next;          // this now walks backwards

// RIGHT: save first
ListNode ahead = node.next;
node.next = previous;
node = ahead;`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `# WRONG: the rest of the list is gone the moment next is overwritten
node.next = previous
node = node.next            # this now walks backwards

# RIGHT: save first
ahead = node.next
node.next = previous
node = ahead`,
        },
      ],
    },
    {
      id: 'reversal',
      title: 'Reversing a list',
      blocks: [
        {
          kind: 'para',
          text: 'Reversal is the canonical linked-list exercise, and it is three pointers moving in lockstep: what came before, where you are, and what comes next.',
        },
        {
          kind: 'visual',
          name: 'linked-reverse',
          caption:
            'One link flips per step. Watch the arrow directions, not the boxes.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Iterative reversal - O(n) time, O(1) space',
          source: `ListNode previous = null, current = head;
while (current != null) {
    ListNode ahead = current.next;   // save
    current.next = previous;         // flip
    previous = current;              // advance both
    current = ahead;
}
return previous;                     // the old tail is the new head`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `previous, current = None, head

while current:
    ahead = current.next        # save
    current.next = previous     # flip
    previous = current          # advance both
    current = ahead

return previous                 # the old tail is the new head`,
        },
        {
          kind: 'diagram',
          caption: 'One link flips per iteration; previous trails behind current.',
          art: `start:   null   1 -> 2 -> 3 -> null
          prev  cur

step 1:  null <- 1   2 -> 3 -> null
               prev  cur

step 2:  null <- 1 <- 2   3 -> null
                    prev  cur

end:     null <- 1 <- 2 <- 3
                          prev = new head`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Recursive reversal - elegant, but O(n) stack',
          source: `ListNode reverse(ListNode head) {
    if (head == null || head.next == null) return head;
    ListNode newHead = reverse(head.next);   // trust: the rest is reversed
    head.next.next = head;                   // make the next node point back
    head.next = null;                        // and cut the old forward link
    return newHead;
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `def reverse(head: ListNode | None) -> ListNode | None:
    if head is None or head.next is None:
        return head

    new_head = reverse(head.next)   # trust: the rest is reversed
    head.next.next = head           # make the next node point back
    head.next = None                # and cut the old forward link
    return new_head`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'The recursive version uses `O(n)` stack space, so it overflows on a list of a million nodes. Mention that trade-off rather than presenting it as strictly better because it is shorter.',
        },
      ],
    },
    {
      id: 'fast-slow',
      title: 'Fast and slow pointers',
      blocks: [
        {
          kind: 'para',
          text: 'You usually do not know the length, and computing it costs a whole extra pass. Two pointers at different speeds answer positional questions in one pass.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Middle of the list',
          source: `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}
return slow;   // for even length this is the second middle`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `slow = fast = head

while fast and fast.next:
    slow = slow.next
    fast = fast.next.next

return slow      # for even length this is the second middle`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Nth node from the end - open a gap of n, then move together',
          source: `ListNode lead = head;
for (int i = 0; i < n; i++) lead = lead.next;

ListNode trail = head;
while (lead != null) { lead = lead.next; trail = trail.next; }
return trail;`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `lead = head
for _ in range(n):
    lead = lead.next

trail = head
while lead:
    lead = lead.next
    trail = trail.next

return trail`,
        },
        {
          kind: 'callout',
          tone: 'note',
          text: 'For even-length lists, `slow` ends on the second of the two middles. If you need the first, start `fast` at `head.next`, or stop when `fast.next.next` is null. Decide which you want before writing the loop.',
        },
      ],
    },
    {
      id: 'cycles',
      title: 'Cycle detection, and where the cycle starts',
      blocks: [
        {
          kind: 'para',
          text: 'If a list has a loop, a pointer moving two steps per iteration must eventually land on one moving a single step — the gap between them changes by exactly one each round, so it cannot skip over zero.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: "Floyd's cycle detection",
          source: `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) return true;
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
        return True

return False`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Finding the entry point of the cycle',
          source: `// after they meet:
ListNode probe = head;
while (probe != slow) { probe = probe.next; slow = slow.next; }
return probe;   // the first node of the cycle`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `# after they meet:
probe = head
while probe is not slow:
    probe = probe.next
    slow = slow.next

return probe     # the first node of the cycle`,
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why resetting to the head works',
          text: 'Let `a` be the distance from head to the cycle entry and `b` the distance from the entry to the meeting point. When they meet, the fast pointer has travelled exactly twice the slow one, and the arithmetic reduces to: the distance from the head to the entry equals the distance from the meeting point to the entry, going forward. So two pointers moving one step each meet precisely at the entry.',
        },
        {
          kind: 'diagram',
          art: `head --a--> [entry] --b--> [meet]
                ^              |
                +------ c -----+

a = c  (mod cycle length), which is why both walkers arrive together`,
        },
      ],
    },
    {
      id: 'dummy',
      title: 'The dummy head',
      blocks: [
        {
          kind: 'para',
          text: 'Operations at the front of a list need special handling — unless you create a fake node in front of it. Then the real head is just "the node after the dummy", and every case becomes the general case.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Remove every node with a given value, with no front special case',
          source: `ListNode dummy = new ListNode(0);
dummy.next = head;

ListNode previous = dummy;
while (previous.next != null) {
    if (previous.next.val == target) previous.next = previous.next.next;
    else                             previous = previous.next;
}
return dummy.next;   // correct even if the original head was removed`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `dummy = ListNode(0, head)

previous = dummy
while previous.next:
    if previous.next.val == target:
        previous.next = previous.next.next
    else:
        previous = previous.next

return dummy.next   # correct even if the original head was removed`,
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'Any time a problem involves deleting, inserting or merging at the front, start with a dummy node. It removes a branch, an edge case, and a class of null-pointer bugs — and it costs one allocation.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Merging two sorted lists - two pointers, one dummy',
          source: `ListNode dummy = new ListNode(0), tail = dummy;
while (a != null && b != null) {
    if (a.val <= b.val) { tail.next = a; a = a.next; }
    else                { tail.next = b; b = b.next; }
    tail = tail.next;
}
tail.next = (a != null) ? a : b;   // attach whatever remains
return dummy.next;`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `dummy = ListNode(0)
tail = dummy

while a and b:
    if a.val <= b.val:
        tail.next, a = a, a.next
    else:
        tail.next, b = b, b.next
    tail = tail.next

tail.next = a or b      # attach whatever remains
return dummy.next`,
        },
      ],
    },
    {
      id: 'sorting',
      title: 'Sorting a linked list',
      blocks: [
        {
          kind: 'para',
          text: 'Merge sort is the natural fit. Splitting is `O(1)` once you have the middle, merging is the routine above, and — unlike arrays — no auxiliary array is needed, so the extra space is only the recursion stack.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'O(n log n) time, O(log n) stack',
          source: `ListNode sort(ListNode head) {
    if (head == null || head.next == null) return head;

    ListNode slow = head, fast = head.next;          // note: fast starts ahead
    while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }

    ListNode second = slow.next;
    slow.next = null;                                 // cut into two lists

    return merge(sort(head), sort(second));
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `def sort(head: ListNode | None) -> ListNode | None:
    if head is None or head.next is None:
        return head

    slow, fast = head, head.next          # note: fast starts ahead
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    second = slow.next
    slow.next = None                      # cut into two lists

    return merge(sort(head), sort(second))`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'Starting `fast` at `head.next` matters here: it makes `slow` stop on the **first** middle, so a two-node list splits into one and one. Starting both at `head` splits it into zero and two, and the recursion never terminates.',
        },
      ],
    },
    {
      id: 'lru',
      title: 'LRU cache: where linked lists genuinely win',
      blocks: [
        {
          kind: 'para',
          text: 'A cache with a capacity that evicts the least recently used entry needs `O(1)` lookup **and** `O(1)` reordering. Neither structure can do both alone; together they can.',
        },
        {
          kind: 'compare',
          columns: [
            {
              title: 'Hash map gives you',
              points: [
                'Find an entry by key in `O(1)`.',
                'But no notion of recency order.',
              ],
            },
            {
              title: 'Doubly linked list gives you',
              points: [
                'Move a node to the front in `O(1)` — if you hold the node.',
                'But finding a node by key is `O(n)`.',
              ],
            },
          ],
        },
        {
          kind: 'diagram',
          caption: 'The map stores keys to nodes; the list stores recency. Each fixes the other one\'s weakness.',
          art: `map: key -> node

 head (most recent)                       tail (least recent)
  [ A ] <-> [ D ] <-> [ C ] <-> [ B ]
                                  ^ evict from here`,
        },
        {
          kind: 'steps',
          items: [
            { title: 'get(key)', text: 'Look up the node in the map, unlink it, push it to the front, return its value.' },
            { title: 'put(key, value)', text: 'If present, update and move to the front. Otherwise insert at the front and add it to the map.' },
            { title: 'Evict', text: 'If the size now exceeds capacity, remove the tail node and delete its key from the map.' },
          ],
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why the list must be doubly linked',
          text: 'Unlinking a node in `O(1)` requires knowing its predecessor. In a singly linked list you would have to walk from the head to find it, which makes the whole operation `O(n)` and defeats the design.',
        },
      ],
    },
    {
      id: 'checklist',
      title: 'Checklist',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Did I save `next` before overwriting a link?',
            'Would a dummy head remove my front-of-list special case?',
            'Have I tested an empty list, one node and two nodes?',
            'Are all my null checks in the right order — `fast != null && fast.next != null`?',
            'For even lengths, which middle do I actually want?',
            'Does my recursion depth match the list length, and can the stack take it?',
            'Did I leave a dangling `next` that should have been set to null?',
          ],
        },
        {
          kind: 'check',
          question: 'Why is `while (fast != null && fast.next != null)` written in that order?',
          answer: 'Short-circuit evaluation. If `fast` is null, the second test never runs. Reversing the order dereferences null and throws on the very first even-length list you try.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'No contiguous block means `O(n)` access but `O(1)` splicing once you hold the node.',
    'Save `next` before overwriting a link, or the rest of the list is unreachable.',
    'Reversal is three pointers: previous, current, and the saved node ahead.',
    'Fast and slow pointers give the middle, the nth from the end and cycle detection in one pass.',
    'After a cycle meeting, walking one pointer from the head finds the entry.',
    'A dummy head removes every front-of-list special case.',
    'Merge sort suits lists: splitting is cheap and no auxiliary array is needed.',
    'Hash map plus doubly linked list is the standard `O(1)` LRU cache design.',
  ],
};
