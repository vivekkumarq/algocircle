import { CourseLesson } from '../course/course.model';
import { code, walkthrough } from './build';

const BINARY_SEARCH: CourseLesson = {
  slug: 'binary-search',
  title: 'Binary search',
  tagline:
    'In sorted data, one look at the middle rules out half of what is left. A million elements take about twenty looks.',
  topic: 'binary-search',
  pattern: 'binary-search',
  minutes: 15,
  practice: ['first-last-occurrence', 'search-rotated', 'longest-increasing-subsequence', 'median-two-sorted'],
  blocks: walkthrough({
    plain:
      'You already do this when someone says "I am thinking of a number from 1 to 100": you guess 50, hear "higher", and never think about 1 to 50 again. In a sorted array, the middle element plays that role. Each look halves what is left.',
    problem: 'Given an array sorted in increasing order, with no repeated values, and a target, return the position of the target, or `-1` if it is not there.',
    example: '`[2, 5, 8, 12, 16, 23, 38, 56]`, target `23` → `5`.',
    understand: [
      '**Input:** a sorted array and a target. **Output:** a position, or `-1`.',
      'Values do not repeat, so there is at most one right answer.',
      'An empty array, or a target outside the range of values, gives `-1`.',
      '**Sorted** again. The question is how much one comparison can rule out.',
    ],
    byHand: [
      { kind: 'para', text: 'Keep two fingers on the ends of the part that could still hold 23, and look at the middle:' },
      {
        kind: 'table',
        headers: ['Could be in positions', 'Middle', 'Value there', 'So'],
        rows: [
          ['0 to 7', '3', '`12`', '23 is bigger, and everything left of the middle is even smaller. Keep 4 to 7.'],
          ['4 to 7', '5', '`23`', 'Found it at position 5.'],
        ],
      },
    ],
    rule:
      'Look at the middle of the part that could still contain the target; if it is too small, discard the left half, if it is too big, discard the right half; stop when found or when nothing is left.',
    brute: {
      idea: 'Check every element from the start.',
      java: `int searchBrute(int[] nums, int target) {
    // Look at each position in turn.
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] == target) {
            return i;
        }
    }
    return -1;
}`,
      python: `def search_brute(nums: list[int], target: int) -> int:
    # Look at each position in turn.
    for i, value in enumerate(nums):
        if value == target:
            return i
    return -1`,
      cost: '`O(n)`: a million elements, up to a million looks.',
    },
    repeated:
      'Each look of the brute force rules out exactly **one** element. In sorted data, one look at the middle rules out **half** of them, because everything on one side is smaller and everything on the other is bigger. The brute force throws away what sorting gives for free.',
    better: {
      idea: '`lo` and `hi` mark the part that could still hold the target, both ends included.',
      java: `int binarySearch(int[] nums, int target) {
    // The target, if present, is somewhere in positions lo..hi (both included).
    int lo = 0;
    int hi = nums.length - 1;

    // lo <= hi: there is at least one position left to check.
    while (lo <= hi) {
        // The middle. Written this way, lo + hi can never overflow.
        int mid = lo + (hi - lo) / 2;

        if (nums[mid] == target) {
            // Found it.
            return mid;
        } else if (nums[mid] < target) {
            // Middle too small, and everything left of it is smaller still.
            // Keep only the right part: mid itself is ruled out too.
            lo = mid + 1;
        } else {
            // Middle too big: keep only the left part.
            hi = mid - 1;
        }
    }

    // lo passed hi: no positions left, so the target is not there.
    return -1;
}`,
      python: `def binary_search(nums: list[int], target: int) -> int:
    # The target, if present, is somewhere in positions lo..hi (both included).
    lo, hi = 0, len(nums) - 1

    # lo <= hi: there is at least one position left to check.
    while lo <= hi:
        # The middle position of what is left.
        mid = (lo + hi) // 2

        if nums[mid] == target:
            # Found it.
            return mid
        elif nums[mid] < target:
            # Middle too small, and everything left of it is smaller still.
            # Keep only the right part: mid itself is ruled out too.
            lo = mid + 1
        else:
            # Middle too big: keep only the left part.
            hi = mid - 1

    # lo passed hi: no positions left, so the target is not there.
    return -1`,
      cost: '`O(log n)`: each look halves the range, and a million halves to one in about 20 steps.',
    },
    dryRun: {
      headers: ['`lo`', '`hi`', '`mid`', '`nums[mid]`', 'Action'],
      rows: [
        ['0', '7', '3', '12', '12 < 23 → `lo = 4`'],
        ['4', '7', '5', '23', 'equal → return 5'],
      ],
      caption: 'Try target 13 as well: the ranges shrink to nothing and the answer is −1.',
    },
    extra: [
      { kind: 'heading', text: 'When values repeat: the first occurrence' },
      {
        kind: 'para',
        text: 'If the array can hold repeats and you need the **first** position of the target, do not stop at the first match. Record it as the best answer so far and keep searching to the left.',
      },
      ...code(
        `int firstOccurrence(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    // Best answer found so far; -1 until we see the target at all.
    int first = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) {
            // A match, but an earlier one may exist: record it, keep going left.
            first = mid;
            hi = mid - 1;
        } else if (nums[mid] < target) {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return first;
}`,
        `def first_occurrence(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums) - 1
    # Best answer found so far; -1 until we see the target at all.
    first = -1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            # A match, but an earlier one may exist: record it, keep going left.
            first = mid
            hi = mid - 1
        elif nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return first`,
        'Keep searching after a match.',
      ),
    ],
    trap: 'Mixing up the boundaries. With both ends included (`lo..hi`), loop while `lo <= hi` and move to `mid + 1` or `mid - 1`. Writing `lo = mid` can loop forever when `lo` and `hi` are next to each other, because `mid` keeps landing on `lo`. In Java, `(lo + hi) / 2` can also overflow for huge arrays; `lo + (hi - lo) / 2` cannot.',
    signals: [
      'The array is **sorted**, and you need to find something in it.',
      'The problem asks for `O(log n)`.',
      'The **first** or **last** position of a value, or where a value would be inserted.',
      'A sorted array that has been **rotated**.',
    ],
    check: {
      question: 'About how many looks does binary search need for 1,000,000 elements, and why?',
      answer: 'About 20. Each look halves the part that is left, and you can only halve a million about 20 times before one element remains (2²⁰ ≈ 1,000,000). Doubling the data adds just one more look.',
    },
  }),
};

const SEARCH_THE_ANSWER: CourseLesson = {
  slug: 'binary-search-on-the-answer',
  title: 'Binary search on the answer',
  tagline:
    'No sorted array in sight? If you can test any guess with yes or no, and the answers flip only once, binary search the guesses.',
  topic: 'binary-search',
  pattern: 'binary-search-on-answer',
  minutes: 15,
  practice: ['ship-within-days', 'constraints-to-approach'],
  blocks: walkthrough({
    plain:
      'Sometimes the thing to search is not an array but the answer itself: a number in a known range. If you can check any guess ("is 6 too big?") and the checks give a run of "yes" followed by a run of "no", the boundary between them is the answer, and binary search finds it.',
    problem: 'Return the integer square root of `n`: the largest whole number `x` with `x × x ≤ n`. No built-in square root allowed.',
    example: '`n = 30` → `5`, because `5 × 5 = 25 ≤ 30` but `6 × 6 = 36 > 30`. `n = 16` → `4`.',
    understand: [
      '**Input:** a whole number `n ≥ 0`. **Output:** a whole number.',
      'The answer is somewhere between `0` and `n`.',
      '`n = 0` gives 0 and `n = 1` gives 1.',
      'For a big `x`, `x × x` does not fit in an `int`; Java needs `long`.',
    ],
    byHand: [
      { kind: 'para', text: 'Ask "does x fit, that is, is `x × x ≤ 30`?" for each candidate:' },
      {
        kind: 'table',
        headers: ['x', '0', '1', '2', '3', '4', '5', '6', '7', '…', '30'],
        rows: [['fits?', 'yes', 'yes', 'yes', 'yes', 'yes', '**yes**', 'no', 'no', 'no', 'no']],
      },
      {
        kind: 'para',
        text: 'A run of "yes" then a run of "no", and the answer is the last "yes". That shape is all binary search needs: test the middle guess, and you know which half the boundary is in.',
      },
    ],
    rule:
      'Binary search over the possible answers: if a guess fits, remember it and look for a bigger one; if it does not, the answer is smaller.',
    brute: {
      idea: 'Count up from 0 while the next number still fits.',
      java: `int sqrtBrute(int n) {
    long x = 0;
    // Step up while x + 1 still fits under n.
    while ((x + 1) * (x + 1) <= n) {
        x++;
    }
    return (int) x;
}`,
      python: `def sqrt_brute(n: int) -> int:
    x = 0
    # Step up while x + 1 still fits under n.
    while (x + 1) * (x + 1) <= n:
        x += 1
    return x`,
      cost: '`O(√n)`: fine for 30, but slow when `n` is around a trillion.',
    },
    repeated:
      'Each guess of the brute force rules out only itself. But "fits" is **monotonic**: if 6 does not fit, nothing above 6 fits either. One test at the middle of the range rules out half of the guesses, exactly like the middle element of a sorted array.',
    better: {
      idea: 'The "array" is the range `0..n`, and "is it sorted?" becomes "does the yes/no test flip only once?".',
      java: `int sqrtFloor(int n) {
    // The answer is somewhere in lo..hi. long, because mid * mid can be huge.
    long lo = 0, hi = n;
    // The best guess that fits so far.
    long answer = 0;

    while (lo <= hi) {
        long mid = lo + (hi - lo) / 2;

        if (mid * mid <= n) {
            // mid fits, so it is a valid answer. Remember it,
            // then try to find a bigger one that also fits.
            answer = mid;
            lo = mid + 1;
        } else {
            // mid is too big, and so is everything above it.
            hi = mid - 1;
        }
    }

    // The last guess that fitted is the largest one that fits.
    return (int) answer;
}`,
      python: `def sqrt_floor(n: int) -> int:
    # The answer is somewhere in lo..hi.
    lo, hi = 0, n
    # The best guess that fits so far.
    answer = 0

    while lo <= hi:
        mid = (lo + hi) // 2

        if mid * mid <= n:
            # mid fits, so it is a valid answer. Remember it,
            # then try to find a bigger one that also fits.
            answer = mid
            lo = mid + 1
        else:
            # mid is too big, and so is everything above it.
            hi = mid - 1

    # The last guess that fitted is the largest one that fits.
    return answer`,
      cost: '`O(log n)`: even `n` = one trillion takes about 40 tests.',
    },
    dryRun: {
      headers: ['`lo`', '`hi`', '`mid`', '`mid²`', 'Fits?', '`answer`'],
      rows: [
        ['0', '30', '15', '225', 'no → `hi = 14`', '0'],
        ['0', '14', '7', '49', 'no → `hi = 6`', '0'],
        ['0', '6', '3', '9', 'yes → `lo = 4`', '3'],
        ['4', '6', '5', '25', 'yes → `lo = 6`', '5'],
        ['6', '6', '6', '36', 'no → `hi = 5`', '5'],
      ],
      caption: '`lo` (6) has passed `hi` (5), so the loop ends with answer 5.',
    },
    trap: 'The yes/no test must flip **only once**. If "fits" could become true again after being false, halving would throw away real answers. Before using this pattern, convince yourself: if guess `g` fails, does every bigger (or smaller) guess fail too? And in Java, `mid * mid` needs `long`.',
    signals: [
      '"Find the **minimum** X such that…" or "the **maximum** X such that…".',
      'The answer is a number in a known range, and checking one guess is easy.',
      'Capacities, speeds, days, sizes: "smallest capacity to ship everything in D days".',
      'Huge limits like `n ≤ 10⁹`, where trying every answer is impossible.',
    ],
    check: {
      question: 'Smallest ship capacity that delivers all packages, in order, within `D` days: what is the yes/no test, and which range do you search?',
      answer: 'The test: with capacity `C`, load packages in order, starting a new day whenever the next one does not fit, and count the days; "yes" if that is at most `D`. The range: from the heaviest package (anything smaller cannot carry it) up to the total weight (everything in one day).',
    },
  }),
};

const FAST_SLOW: CourseLesson = {
  slug: 'fast-and-slow-pointers',
  title: 'Fast and slow pointers',
  tagline:
    'Two runners on a linked list, one twice as fast. If the list ends, the fast one gets there first. If it loops, the fast one laps the slow one.',
  topic: 'linked-lists',
  pattern: 'fast-slow-pointers',
  minutes: 14,
  practice: ['linked-list-cycle-start'],
  blocks: walkthrough({
    plain:
      'On a circular track, a faster runner always catches up with a slower one. Put two pointers on a linked list, move one a step at a time and the other two steps. If they ever stand on the same node, the list loops. If the fast one runs off the end, it does not. No extra memory needed.',
    problem:
      'Given the head of a linked list, return whether it contains a cycle: some node whose `next` points back to an earlier node, so that following `next` never ends.',
    example: '`1 → 2 → 3 → 4`, with 4 pointing back to 2 → `true`. `1 → 2 → 3 → null` → `false`.',
    understand: [
      '**Input:** the first node (possibly `null`). **Output:** `true` or `false`.',
      'You cannot "count to the end", because with a cycle there is no end.',
      'An empty list, or a single node pointing to `null`, has no cycle.',
      'Two different nodes can hold the same value, so compare **nodes**, not values.',
    ],
    byHand: [
      { kind: 'para', text: 'Walk the list with a pencil, ticking off each node you visit:' },
      {
        kind: 'table',
        headers: ['Arrive at', 'Ticked before?', 'Ticked so far'],
        rows: [
          ['1', 'no', '1'],
          ['2', 'no', '1, 2'],
          ['3', 'no', '1, 2, 3'],
          ['4', 'no', '1, 2, 3, 4'],
          ['2', '**yes** → a cycle', '—'],
        ],
      },
    ],
    rule: 'Walk the list remembering visited nodes; arriving at an already-visited node means a cycle, reaching the end means none.',
    brute: {
      idea: 'Exactly the pencil method: a set of visited nodes. It is fast, but it remembers every node.',
      java: `// A node: a value, and an arrow to the next node (null at the end).
class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

boolean hasCycleWithSet(ListNode head) {
    // Every node visited so far.
    Set<ListNode> visited = new HashSet<>();
    for (ListNode node = head; node != null; node = node.next) {
        // Arriving somewhere we have been means we went round a loop.
        if (visited.contains(node)) return true;
        visited.add(node);
    }
    // We reached null: the list has an end.
    return false;
}`,
      python: `class ListNode:
    # A node: a value, and an arrow to the next node (None at the end).
    def __init__(self, val: int, next: "ListNode | None" = None):
        self.val = val
        self.next = next


def has_cycle_with_set(head: ListNode | None) -> bool:
    # Every node visited so far.
    visited = set()
    node = head
    while node is not None:
        # Arriving somewhere we have been means we went round a loop.
        if node in visited:
            return True
        visited.add(node)
        node = node.next
    # We reached None: the list has an end.
    return False`,
      cost: '`O(n)` time, but also `O(n)` memory for the set.',
    },
    repeated:
      'Nothing is slow here; what is wasted is **memory**: the set stores every node. But we never need to know *which* node repeats, only *that* something repeats. Two runners at different speeds can tell us that: inside a loop, the fast one gains one step per turn on the slow one, so it cannot jump over it and must land on it.',
    better: {
      idea: '`slow` moves one node per turn, `fast` moves two.',
      java: `boolean hasCycle(ListNode head) {
    // Both runners start at the beginning.
    ListNode slow = head;
    ListNode fast = head;

    // fast takes two steps, so both fast and fast.next must exist.
    // (Check fast first: if it is null, fast.next would crash.)
    while (fast != null && fast.next != null) {
        // One step for the slow runner...
        slow = slow.next;
        // ...two steps for the fast one.
        fast = fast.next.next;

        // Same node (not just the same value): fast has lapped slow.
        if (slow == fast) {
            return true;
        }
    }

    // fast ran off the end, so the list has an end and no cycle.
    return false;
}`,
      python: `def has_cycle(head: ListNode | None) -> bool:
    # Both runners start at the beginning.
    slow = fast = head

    # fast takes two steps, so both fast and fast.next must exist.
    # (Check fast first: if it is None, fast.next would crash.)
    while fast is not None and fast.next is not None:
        # One step for the slow runner...
        slow = slow.next
        # ...two steps for the fast one.
        fast = fast.next.next

        # Same node ("is", not just the same value): fast has lapped slow.
        if slow is fast:
            return True

    # fast ran off the end, so the list has an end and no cycle.
    return False`,
      cost: '`O(n)` time and `O(1)` memory: two pointers, whatever the length.',
    },
    dryRun: {
      headers: ['Turn', '`slow`', '`fast`', 'Same node?'],
      rows: [
        ['start', '1', '1', '(not checked)'],
        ['1', '2', '3', 'no'],
        ['2', '3', '2 (3 → 4 → back to 2)', 'no'],
        ['3', '4', '4 (2 → 3 → 4)', '**yes** → `true`'],
      ],
    },
    trap: 'Writing `fast.next.next` without first checking `fast.next`. On a list with an even number of nodes, `fast` lands on the last node, `fast.next` is `null`, and `fast.next.next` crashes. The loop condition must be `fast != null && fast.next != null`, in that order.',
    signals: [
      'A linked list that **might loop**.',
      'The **middle** of a linked list in one pass.',
      'A sequence that might repeat forever (the "happy number" puzzle, a duplicate in `1..n`).',
      'The problem asks for **O(1) extra memory**.',
    ],
    check: {
      question: 'How would fast and slow pointers find the middle node of a list?',
      answer: 'Move `slow` one step and `fast` two steps until `fast` reaches the end. `fast` has travelled twice as far as `slow`, so `slow` is standing on the middle.',
    },
  }),
};

const REVERSAL: CourseLesson = {
  slug: 'reversing-a-linked-list',
  title: 'Reversing a linked list in place',
  tagline:
    'Walk the list once and turn each arrow around. The whole difficulty is not losing the rest of the list while you do it.',
  topic: 'linked-lists',
  pattern: 'in-place-reversal',
  minutes: 14,
  practice: ['reverse-linked-list', 'rotate-array'],
  blocks: walkthrough({
    plain:
      'In a linked list, each node only knows the next one. To reverse it, point every arrow at the node before instead. Three pointers are enough: the node before, the current node, and the next one, saved before its arrow is changed.',
    problem: 'Reverse a singly linked list and return its new first node.',
    example: '`1 → 2 → 3 → null` becomes `3 → 2 → 1 → null`, and the answer is the node holding `3`.',
    understand: [
      '**Input:** the first node (possibly `null`). **Output:** the new first node.',
      'Reverse the **arrows**; the values stay in their nodes.',
      'An empty list stays empty; a one-node list is already reversed.',
      'Each node only knows its `next`. Lose that, and the rest of the list is gone.',
    ],
    byHand: [
      {
        kind: 'para',
        text: 'Draw `1 → 2 → 3`. Turn the arrows around one at a time, left to right. Before you turn 1\'s arrow away from 2, put a finger on 2, because that arrow was the only way to reach it.',
      },
      {
        kind: 'table',
        headers: ['At node', 'Finger on (saved next)', 'Turn its arrow to', 'Reversed so far'],
        rows: [
          ['1', '2', 'nothing (`null`)', '`1`'],
          ['2', '3', '1', '`2 → 1`'],
          ['3', 'nothing', '2', '`3 → 2 → 1`'],
        ],
      },
    ],
    rule:
      'Walk the list once; at each node, save the next node, point this node back at the previous one, then step forward.',
    brute: {
      idea: 'Copy the values out into a list, then write them back in reverse order.',
      java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

ListNode reverseByCopying(ListNode head) {
    // Trip 1: collect every value, in order.
    List<Integer> values = new ArrayList<>();
    for (ListNode node = head; node != null; node = node.next) {
        values.add(node.val);
    }
    // Trip 2: write them back, starting from the last value.
    int i = values.size() - 1;
    for (ListNode node = head; node != null; node = node.next) {
        node.val = values.get(i--);
    }
    return head;
}`,
      python: `class ListNode:
    def __init__(self, val: int, next: "ListNode | None" = None):
        self.val = val
        self.next = next


def reverse_by_copying(head: ListNode | None) -> ListNode | None:
    # Trip 1: collect every value, in order.
    values = []
    node = head
    while node is not None:
        values.append(node.val)
        node = node.next
    # Trip 2: write them back, starting from the last value.
    node = head
    while node is not None:
        node.val = values.pop()
        node = node.next
    return head`,
      cost: '`O(n)` time, but `O(n)` extra memory, and it moves values rather than reversing the list.',
    },
    repeated:
      'Every value makes a round trip through an extra list. That list is wasted memory, and in real code a node usually carries much more than one number, so swapping contents is not an option. The arrows themselves can be turned around with three pointers and no list at all.',
    better: {
      idea: '`prev` is the already-reversed part, `curr` is the node being turned around.',
      java: `ListNode reverse(ListNode head) {
    // The reversed part so far. Empty at the start, so the first node
    // will end up pointing at null, which is right for the new last node.
    ListNode prev = null;
    // The node whose arrow we turn next.
    ListNode curr = head;

    while (curr != null) {
        // 1. Save the rest of the list: the next line overwrites curr.next.
        ListNode next = curr.next;
        // 2. Turn the arrow around: curr now points back into the reversed part.
        curr.next = prev;
        // 3. curr is now the front of the reversed part...
        prev = curr;
        // 4. ...and we move on to the rest we saved in step 1.
        curr = next;
    }

    // curr is null (we walked off the end); prev is the old last node,
    // which is the new first node.
    return prev;
}`,
      python: `def reverse(head: ListNode | None) -> ListNode | None:
    # The reversed part so far. Empty at the start, so the first node
    # will end up pointing at None, which is right for the new last node.
    prev = None
    # The node whose arrow we turn next.
    curr = head

    while curr is not None:
        # 1. Save the rest of the list: the next line overwrites curr.next.
        nxt = curr.next
        # 2. Turn the arrow around: curr now points back into the reversed part.
        curr.next = prev
        # 3. curr is now the front of the reversed part...
        prev = curr
        # 4. ...and we move on to the rest we saved in step 1.
        curr = nxt

    # curr is None (we walked off the end); prev is the old last node,
    # which is the new first node.
    return prev`,
      cost: '`O(n)` time, `O(1)` extra memory.',
    },
    dryRun: {
      headers: ['`curr`', '`next` saved', '`curr.next` becomes', '`prev` after', '`curr` after'],
      rows: [
        ['1', '2', '`null`', '1', '2'],
        ['2', '3', '1', '2', '3'],
        ['3', '`null`', '2', '3', '`null` → stop, return 3'],
      ],
    },
    trap: 'Changing `curr.next` before saving it. Once `curr.next = prev` runs, the old next node is unreachable, and the rest of the list is lost. Save first, always. And return `prev`, not `curr`: when the loop ends, `curr` is `null`.',
    signals: [
      'Reverse a linked list, or a **part** of one (between two positions, in groups of k).',
      'Check whether a linked list is a palindrome (reverse the second half).',
      'Rotate a list or an array by `k` (reverse the pieces).',
      'Rearrange nodes with no extra memory.',
    ],
    check: {
      question: 'How can three reversals rotate an array right by `k` places?',
      answer: 'Reverse the whole array, then reverse the first `k` elements, then reverse the rest. For `[1, 2, 3, 4, 5]` and `k = 2`: reverse all → `[5, 4, 3, 2, 1]`; first two → `[4, 5, 3, 2, 1]`; the rest → `[4, 5, 1, 2, 3]`.',
    },
  }),
};

const MONOTONIC_STACK: CourseLesson = {
  slug: 'monotonic-stack',
  title: 'Monotonic stack',
  tagline:
    'Keep a stack of elements still waiting for an answer. Each newcomer answers everyone smaller than it on top, and they leave.',
  topic: 'stacks-queues',
  pattern: 'monotonic-stack',
  minutes: 16,
  practice: ['valid-parentheses', 'daily-temperatures', 'min-stack', 'largest-rectangle-histogram'],
  blocks: walkthrough({
    plain:
      'Some elements are waiting for "the next bigger one". Keep them on a stack. When a new element arrives, every waiting element smaller than it has just found its answer, and those are always the ones on top. The stack stays in decreasing order, which is where the name comes from.',
    problem: 'For every element of an array, find the first element to its right that is greater. Write `-1` where there is none.',
    example: '`[2, 1, 2, 4, 3]` → `[4, 2, 4, -1, -1]`.',
    understand: [
      '**Input:** an array. **Output:** an array of the same length.',
      '"Next greater" means the **first** greater element to the right, not the largest one.',
      'Equal does not count: it must be strictly greater.',
      'The last element has nothing to its right, so its answer is always `-1`.',
    ],
    byHand: [
      { kind: 'para', text: 'Read left to right, keeping a list of numbers still waiting for a bigger one:' },
      {
        kind: 'table',
        headers: ['Arrives', 'Answers it gives', 'Still waiting'],
        rows: [
          ['`2`', '—', '2'],
          ['`1`', 'none (1 is not bigger than 2)', '2, 1'],
          ['`2`', 'the waiting `1` gets 2', '2, 2'],
          ['`4`', 'both waiting `2`s get 4', '4'],
          ['`3`', 'none', '4, 3'],
          ['end', 'everyone still waiting gets −1', ''],
        ],
      },
      {
        kind: 'para',
        text: 'Notice that the waiting list always goes down from left to right. A bigger number would already have answered the smaller ones after it. So a newcomer only ever needs to look at the **end** of the list.',
      },
    ],
    rule:
      'Keep the elements still waiting for a greater one; each new element answers every waiting element smaller than it, then waits itself.',
    brute: {
      idea: 'For each element, scan to its right until something bigger turns up.',
      java: `int[] nextGreaterBrute(int[] nums) {
    int[] answer = new int[nums.length];
    for (int i = 0; i < nums.length; i++) {
        answer[i] = -1;
        // Scan right for the first bigger element.
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[j] > nums[i]) {
                answer[i] = nums[j];
                break;
            }
        }
    }
    return answer;
}`,
      python: `def next_greater_brute(nums: list[int]) -> list[int]:
    answer = [-1] * len(nums)
    for i in range(len(nums)):
        # Scan right for the first bigger element.
        for j in range(i + 1, len(nums)):
            if nums[j] > nums[i]:
                answer[i] = nums[j]
                break
    return answer`,
      cost: '`O(n²)`, for example on a decreasing array, where every scan runs to the end.',
    },
    repeated:
      'The scans overlap. In `[5, 4, 3, 2, 1, 6]`, every element scans all the way to the 6. One left-to-right pass could hand the 6 to all of them at once, if the waiting elements were kept somewhere. Since they are always in decreasing order, a **stack** is the right place: the smallest waiter is always on top.',
    better: {
      idea: 'The stack holds **positions** of elements still waiting, so we know where to write each answer.',
      java: `int[] nextGreater(int[] nums) {
    int n = nums.length;
    // Assume "nothing greater" until something turns up.
    int[] answer = new int[n];
    Arrays.fill(answer, -1);

    // Positions still waiting for a greater element. Their values decrease
    // from bottom to top, so the smallest waiter is always on top.
    Deque<Integer> waiting = new ArrayDeque<>();

    for (int i = 0; i < n; i++) {
        // nums[i] answers every waiter that is smaller than it.
        // Those are on top of the stack, so pop them one by one.
        while (!waiting.isEmpty() && nums[waiting.peek()] < nums[i]) {
            answer[waiting.pop()] = nums[i];
        }
        // nums[i] now waits for its own greater element.
        waiting.push(i);
    }

    // Anyone still waiting never found one, and keeps -1.
    return answer;
}`,
      python: `def next_greater(nums: list[int]) -> list[int]:
    # Assume "nothing greater" until something turns up.
    answer = [-1] * len(nums)

    # Positions still waiting for a greater element. Their values decrease
    # from bottom to top, so the smallest waiter is always on top.
    waiting = []

    for i, value in enumerate(nums):
        # value answers every waiter that is smaller than it.
        # Those are on top of the stack, so pop them one by one.
        while waiting and nums[waiting[-1]] < value:
            answer[waiting.pop()] = value
        # value now waits for its own greater element.
        waiting.append(i)

    # Anyone still waiting never found one, and keeps -1.
    return answer`,
      cost: '`O(n)`: each position is pushed once and popped at most once, so the inner `while` runs at most `n` times in total.',
    },
    dryRun: {
      headers: ['`i`', '`nums[i]`', 'Popped (and answered)', 'Stack after (values)'],
      rows: [
        ['0', '2', '—', '2'],
        ['1', '1', '—', '2, 1'],
        ['2', '2', 'position 1 gets 2', '2, 2'],
        ['3', '4', 'positions 2 and 0 get 4', '4'],
        ['4', '3', '—', '4, 3'],
      ],
    },
    trap: 'Pushing **values** instead of **positions**. When an element is popped you know its answer, but not where in the output to write it. Push indices and read values with `nums[index]`. Also choose `<` or `<=` on purpose: with `<=`, equal values would answer each other.',
    signals: [
      'The next or previous **greater** or **smaller** element.',
      '"How many days until a warmer day", "stock span".',
      'The largest rectangle in a histogram.',
      'Matching brackets, which uses the same push and pop idea with a plain stack.',
    ],
    check: {
      question: 'How would you find the **previous** smaller element for every position?',
      answer: 'Walk left to right with a stack. Before pushing `i`, pop everything greater than or equal to `nums[i]`. Whatever is left on top is the previous smaller element (none if the stack is empty). Same machine, but the answer is read from the top before pushing, instead of written when popping.',
    },
  }),
};

const MONOTONIC_DEQUE: CourseLesson = {
  slug: 'monotonic-deque',
  title: 'Monotonic deque',
  tagline:
    'The maximum of every sliding window in one pass: keep only the candidates that could still win, biggest at the front.',
  topic: 'stacks-queues',
  pattern: 'monotonic-queue',
  minutes: 17,
  practice: ['max-in-each-window'],
  blocks: walkthrough({
    plain:
      'When a big number enters a window, every smaller number before it is finished: it is smaller **and** it will leave sooner, so it can never be a maximum again. Throw those away. What remains is a short line of candidates in decreasing order, and the one at the front is the current maximum.',
    problem: 'Given an array and a window size `k`, return the maximum of every window of `k` consecutive elements, from left to right.',
    example: '`[1, 3, -1, -3, 5, 3, 6, 7]`, `k = 3` → `[3, 3, 5, 5, 6, 7]`.',
    understand: [
      '**Input:** an array and `k`. **Output:** `n − k + 1` maximums, one per window.',
      'Windows are consecutive and slide one step at a time.',
      'We assume `1 ≤ k ≤ n`. Numbers can be negative.',
      'A sliding **sum** could add and subtract; a **maximum** cannot be "subtracted" when it leaves.',
    ],
    byHand: [
      {
        kind: 'para',
        text: 'Watch what happens when `5` enters: the `-1` and `-3` before it can never be the biggest in any later window, because 5 is bigger and stays longer. Forget them. Keep only a short line of possible winners:',
      },
      {
        kind: 'table',
        headers: ['Enters', 'Possible winners (front first)', 'Window max'],
        rows: [
          ['1', '1', '—'],
          ['3', '3 (1 can never win now)', '—'],
          ['−1', '3, −1', '3'],
          ['−3', '3, −1, −3', '3'],
          ['5', '5 (3 left the window; −1 and −3 lose to 5)', '5'],
          ['3', '5, 3', '5'],
          ['6', '6', '6'],
          ['7', '7', '7'],
        ],
      },
    ],
    rule:
      'Keep candidates in decreasing order: when a new element arrives, drop smaller ones from the back; when the front leaves the window, drop it; the front is the window\'s maximum.',
    brute: {
      idea: 'For each window, scan its `k` elements for the largest.',
      java: `int[] windowMaxBrute(int[] nums, int k) {
    int[] out = new int[nums.length - k + 1];
    for (int start = 0; start + k <= nums.length; start++) {
        // Scan this window from scratch.
        int best = nums[start];
        for (int i = start; i < start + k; i++) {
            best = Math.max(best, nums[i]);
        }
        out[start] = best;
    }
    return out;
}`,
      python: `def window_max_brute(nums: list[int], k: int) -> list[int]:
    out = []
    for start in range(len(nums) - k + 1):
        # Scan this window from scratch.
        out.append(max(nums[start:start + k]))
    return out`,
      cost: '`O(n × k)`.',
    },
    repeated:
      'Neighbouring windows share `k − 1` elements, and the brute force rescans them every time. With a sum, we could subtract the element that leaves. With a maximum we cannot: when the maximum leaves, we need to know the **next best**. The candidate line keeps exactly the elements that could become the next best, and nothing else.',
    better: {
      idea: 'A deque (double-ended queue) of positions. We remove from the front when an element leaves the window, and from the back when it is beaten.',
      java: `int[] windowMax(int[] nums, int k) {
    int[] out = new int[nums.length - k + 1];
    // Positions of the candidates. Their values decrease from front to back,
    // so the front is always the biggest one still in the window.
    Deque<Integer> candidates = new ArrayDeque<>();

    for (int i = 0; i < nums.length; i++) {
        // The window ending at i starts at i - k + 1. A front position
        // of i - k or less has fallen out of it: drop it.
        if (!candidates.isEmpty() && candidates.peekFirst() <= i - k) {
            candidates.pollFirst();
        }

        // Every candidate at the back that is not bigger than nums[i] is
        // finished: nums[i] beats it now and stays in the window longer.
        while (!candidates.isEmpty() && nums[candidates.peekLast()] <= nums[i]) {
            candidates.pollLast();
        }

        // nums[i] could be the maximum of this window or a later one.
        candidates.offerLast(i);

        // From i = k - 1 on, a full window ends at i: its maximum is the front.
        if (i >= k - 1) {
            out[i - k + 1] = nums[candidates.peekFirst()];
        }
    }
    return out;
}`,
      python: `from collections import deque


def window_max(nums: list[int], k: int) -> list[int]:
    out = []
    # Positions of the candidates. Their values decrease from front to back,
    # so the front is always the biggest one still in the window.
    candidates = deque()

    for i, value in enumerate(nums):
        # The window ending at i starts at i - k + 1. A front position
        # of i - k or less has fallen out of it: drop it.
        if candidates and candidates[0] <= i - k:
            candidates.popleft()

        # Every candidate at the back that is not bigger than value is
        # finished: value beats it now and stays in the window longer.
        while candidates and nums[candidates[-1]] <= value:
            candidates.pop()

        # value could be the maximum of this window or a later one.
        candidates.append(i)

        # From i = k - 1 on, a full window ends at i: its maximum is the front.
        if i >= k - 1:
            out.append(nums[candidates[0]])
    return out`,
      cost: '`O(n)`: each position enters the deque once and leaves at most once.',
    },
    dryRun: {
      headers: ['`i`', 'Enters', 'Dropped', 'Candidates (values)', 'Output'],
      rows: [
        ['0', '1', '—', '1', '—'],
        ['1', '3', '1 (beaten)', '3', '—'],
        ['2', '−1', '—', '3, −1', '3'],
        ['3', '−3', '—', '3, −1, −3', '3'],
        ['4', '5', '3 (left), −3 and −1 (beaten)', '5', '5'],
        ['5', '3', '—', '5, 3', '5'],
        ['6', '6', '3 and 5 (beaten)', '6', '6'],
        ['7', '7', '6 (beaten)', '7', '7'],
      ],
    },
    trap: 'Getting the "has it left?" test wrong by one. The window ending at `i` starts at `i − k + 1`, so a front position `<= i − k` is outside it. Off by one here either keeps a stale maximum or drops a live one. And store **positions**, not values, or you cannot tell when something has left.',
    signals: [
      'The maximum or minimum of **every window** of size `k`.',
      '"Sliding window maximum".',
      'A dynamic-programming step that takes the best of the last `k` states.',
    ],
    check: {
      question: 'Why is it safe to throw away a smaller element as soon as a bigger one arrives?',
      answer: 'The newcomer is bigger and arrived later, so it stays in every future window at least as long as the smaller one does. In every window containing both, the newcomer wins. So the smaller one can never be a maximum again.',
    },
  }),
};

export const SEARCH_PATTERNS: CourseLesson[] = [BINARY_SEARCH, SEARCH_THE_ANSWER];
export const LIST_PATTERNS: CourseLesson[] = [FAST_SLOW, REVERSAL];
export const STACK_PATTERNS: CourseLesson[] = [MONOTONIC_STACK, MONOTONIC_DEQUE];
