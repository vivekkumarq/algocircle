import { WorkedProblem } from './problem.model';

export const STRUCTURE_PROBLEMS: WorkedProblem[] = [
  // ----------------------------------------------------------------- recursion
  {
    slug: 'generate-subsets',
    title: 'Every subset of a set',
    topic: 'recursion',
    pattern: 'backtracking',
    difficulty: 'Medium',
    statement: 'Given distinct values, produce every possible subset, including the empty one.',
    example: { input: '[1, 2, 3]', output: '[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]' },
    hints: [
      'For each element there is exactly one binary decision.',
      'Recurse once without it and once with it.',
      'What must you do to the working list after recursing?',
      'Are you storing the list, or a copy of it?',
    ],
    bruteForce: { idea: 'There is no slower correct approach — all 2ⁿ subsets must be produced. The question is whether the enumeration is clean.', complexity: 'O(2ⁿ · n)' },
    optimal: {
      idea: 'Include-or-exclude recursion at each index, undoing the inclusion on the way back. For small `n` the bitmask loop does the same thing iteratively.',
      complexity: 'O(2ⁿ · n) time, O(n) depth',
      language: 'java',
      code: `void subsets(int i, List<Integer> current) {
    if (i == n) { output.add(new ArrayList<>(current)); return; }

    subsets(i + 1, current);                  // exclude
    current.add(a[i]);
    subsets(i + 1, current);                  // include
    current.remove(current.size() - 1);       // undo
}`,
    },
    insight: 'Adding `current` instead of a copy makes every entry in the output the same object — and therefore all empty at the end.',
  },
  {
    slug: 'permutations',
    title: 'All permutations',
    topic: 'recursion',
    pattern: 'backtracking',
    difficulty: 'Medium',
    statement: 'Generate every ordering of a list of distinct values.',
    example: { input: '[1, 2, 3]', output: '6 orderings' },
    hints: [
      'At each position, which elements are still available?',
      'A boolean array is enough to track that.',
      'Undo both the mark and the append when you return.',
    ],
    bruteForce: { idea: 'Generate every sequence of length n and discard those with repeats.', complexity: 'O(nⁿ)' },
    optimal: {
      idea: 'Choose an unused element for each position, marking it used, recursing, then unmarking. Each path down the tree is one permutation.',
      complexity: 'O(n! · n) time, O(n) depth',
      language: 'java',
      code: `void permute(List<Integer> current, boolean[] used) {
    if (current.size() == n) { output.add(new ArrayList<>(current)); return; }

    for (int i = 0; i < n; i++) {
        if (used[i]) continue;
        used[i] = true;  current.add(a[i]);
        permute(current, used);
        current.remove(current.size() - 1);  used[i] = false;
    }
}`,
    },
    insight: 'With duplicate inputs, sort first and skip `a[i] == a[i-1]` when the previous copy is unused — that suppresses identical branches at the same depth.',
  },
  {
    slug: 'combination-sum',
    title: 'Combinations summing to a target',
    topic: 'recursion',
    pattern: 'backtracking',
    difficulty: 'Medium',
    statement: 'Given distinct positive candidates, find every combination that sums to a target. Each candidate may be reused any number of times.',
    example: { input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3], [7]]' },
    hints: [
      'Reuse means recursing with the same index, not the next one.',
      'How do you stop the same combination appearing in different orders?',
      'Sorting lets you stop an entire branch early.',
    ],
    bruteForce: { idea: 'Enumerate every multiset up to the target and filter.', complexity: 'exponential, with huge waste' },
    optimal: {
      idea: 'Backtrack with a start index so combinations are generated in non-decreasing order. Sorting lets you `break` as soon as a candidate exceeds the remaining target.',
      complexity: 'Exponential in the answer count, far less after pruning',
      language: 'java',
      code: `Arrays.sort(candidates);

void search(int start, int remaining, List<Integer> current) {
    if (remaining == 0) { output.add(new ArrayList<>(current)); return; }

    for (int i = start; i < candidates.length; i++) {
        if (candidates[i] > remaining) break;      // sorted: all later are bigger
        current.add(candidates[i]);
        search(i, remaining - candidates[i], current);   // i, not i+1: reuse allowed
        current.remove(current.size() - 1);
    }
}`,
    },
    insight: 'The start index does two jobs at once: it prevents permutations of the same combination, and it is where reuse is switched on or off.',
  },
  {
    slug: 'n-queens',
    title: 'N-Queens',
    topic: 'recursion',
    pattern: 'backtracking',
    difficulty: 'Hard',
    statement: 'Place `n` queens on an `n × n` board so that no two attack each other, and count the arrangements.',
    example: { input: 'n = 4', output: '2' },
    hints: [
      'One queen per row, so only the column is a free choice.',
      'Three things can be attacked: a column and two diagonals.',
      'How do you identify a diagonal with a single number?',
    ],
    bruteForce: { idea: 'Try every placement of n queens on n² squares and validate each.', complexity: 'astronomically large' },
    optimal: {
      idea: 'Place one queen per row and track used columns and both diagonals as sets, making each validity check constant. Pruning removes almost the entire tree.',
      complexity: 'Far below O(n!) after pruning',
      language: 'java',
      code: `void place(int row) {
    if (row == n) { count++; return; }

    for (int col = 0; col < n; col++) {
        if (cols[col] || diag1[row + col] || diag2[row - col + n]) continue;

        cols[col] = diag1[row + col] = diag2[row - col + n] = true;
        place(row + 1);
        cols[col] = diag1[row + col] = diag2[row - col + n] = false;
    }
}`,
    },
    insight: '`row + col` is constant along one diagonal and `row - col` along the other. Offsetting the second by `n` keeps the index non-negative.',
  },

  // -------------------------------------------------------------- linked lists
  {
    slug: 'reverse-linked-list',
    title: 'Reverse a linked list',
    topic: 'linked-lists',
    pattern: 'in-place-reversal',
    difficulty: 'Easy',
    statement: 'Reverse the direction of every link in a singly linked list and return the new head.',
    example: { input: '1 -> 2 -> 3 -> null', output: '3 -> 2 -> 1 -> null' },
    hints: [
      'You need to know three nodes at once.',
      'What happens if you overwrite `next` before saving it?',
      'Which pointer ends up being the new head?',
    ],
    bruteForce: { idea: 'Copy the values into an array, reverse it, and write them back.', complexity: 'O(n) time, O(n) space' },
    optimal: {
      idea: 'Walk once with three pointers, flipping one link per step. The trailing pointer ends on the old tail, which is the new head.',
      complexity: 'O(n) time, O(1) space',
      language: 'java',
      code: `ListNode previous = null, current = head;
while (current != null) {
    ListNode ahead = current.next;   // save first
    current.next = previous;         // flip
    previous = current;              // advance
    current = ahead;
}
return previous;`,
    },
    insight: 'The recursive version is prettier and uses O(n) stack, so it overflows on a very long list. Mention the trade-off rather than presenting it as strictly better.',
  },
  {
    slug: 'linked-list-cycle-start',
    title: 'Where does the cycle begin?',
    topic: 'linked-lists',
    pattern: 'fast-slow-pointers',
    difficulty: 'Medium',
    statement: 'Detect whether a linked list has a cycle and return the node where it starts, using constant extra space.',
    example: { input: '3 -> 2 -> 0 -> -4, with -4 linking back to 2', output: 'the node holding 2' },
    hints: [
      'A visited set works but costs O(n) memory.',
      'Two walkers at different speeds must meet inside a loop.',
      'After they meet, there is a second walk that finds the entry.',
    ],
    bruteForce: { idea: 'Store visited nodes in a hash set; the first repeat is the entry.', complexity: 'O(n) time, O(n) space' },
    optimal: {
      idea: "Floyd's algorithm. Slow moves one and fast moves two until they meet, then reset one pointer to the head and advance both one step at a time.",
      complexity: 'O(n) time, O(1) space',
      language: 'java',
      code: `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) {
        ListNode probe = head;
        while (probe != slow) { probe = probe.next; slow = slow.next; }
        return probe;                 // cycle entry
    }
}
return null;`,
    },
    insight: 'The second phase works because the distance from head to entry equals the distance from the meeting point to the entry, going forward around the loop.',
  },
  {
    slug: 'merge-k-lists',
    title: 'Merge k sorted lists',
    topic: 'linked-lists',
    pattern: 'heap-top-k',
    difficulty: 'Hard',
    statement: 'Merge `k` sorted linked lists into one sorted list.',
    example: { input: '[1->4->5, 1->3->4, 2->6]', output: '1->1->2->3->4->4->5->6' },
    hints: [
      'Scanning all k heads each time costs O(n·k).',
      'You repeatedly need the smallest of k candidates.',
      'How big does the heap ever get?',
    ],
    bruteForce: { idea: 'Scan all k heads on every step to find the minimum.', complexity: 'O(n · k)' },
    optimal: {
      idea: 'A min-heap holding one candidate per list. Pop the smallest, append it, and push that list’s next node. The heap never exceeds `k`.',
      complexity: 'O(n log k) time, O(k) space',
      language: 'java',
      code: `PriorityQueue<ListNode> heap = new PriorityQueue<>((x, y) -> x.val - y.val);
for (ListNode head : lists) if (head != null) heap.offer(head);

ListNode dummy = new ListNode(0), tail = dummy;
while (!heap.isEmpty()) {
    ListNode node = heap.poll();
    tail.next = node; tail = node;
    if (node.next != null) heap.offer(node.next);
}
return dummy.next;`,
    },
    insight: 'Merging pairwise in rounds gives the same O(n log k) with no heap at all — worth offering as an alternative.',
  },
  {
    slug: 'lru-cache',
    title: 'Design an LRU cache',
    topic: 'linked-lists',
    pattern: 'hashing',
    difficulty: 'Hard',
    statement: 'Build a fixed-capacity cache where `get` and `put` are both constant time and the least recently used entry is evicted when full.',
    example: { input: 'capacity 2; put(1,1), put(2,2), get(1), put(3,3)', output: 'key 2 is evicted' },
    hints: [
      'You need lookup by key and ordering by recency at the same time.',
      'Neither a map nor a list gives you both.',
      'To unlink a node in O(1), what must you be able to reach from it?',
    ],
    bruteForce: { idea: 'A map plus a timestamp per entry, scanning for the oldest on eviction.', complexity: 'O(n) per eviction' },
    optimal: {
      idea: 'A hash map from key to node, plus a doubly linked list ordered by recency. The map gives O(1) lookup; the list gives O(1) reordering because you already hold the node.',
      complexity: 'O(1) per operation, O(capacity) space',
      language: 'java',
      code: `// get: look up the node, unlink it, push it to the front, return its value
// put: if present, update and move to front
//      otherwise insert at the front and add to the map
//      if size > capacity, remove the tail node and delete its key

Node node = map.get(key);
unlink(node);
pushFront(node);
return node.value;`,
    },
    insight: 'Singly linked would make unlinking O(n), because you would have to walk from the head to find the predecessor. The second pointer is the whole design.',
  },

  // ------------------------------------------------------------ stacks & queues
  {
    slug: 'valid-parentheses',
    title: 'Balanced brackets',
    topic: 'stacks-queues',
    pattern: 'monotonic-stack',
    difficulty: 'Easy',
    statement: 'Decide whether a string of brackets is correctly nested and closed, with three bracket types.',
    example: { input: '"{[()]}"', output: 'true' },
    hints: [
      'Which bracket must be closed first — the oldest or the newest?',
      'That ordering is exactly one data structure.',
      'Two failure cases exist, not one.',
    ],
    bruteForce: { idea: 'Repeatedly delete adjacent matching pairs until nothing changes.', complexity: 'O(n²)' },
    optimal: {
      idea: 'Push openers, and on a closer check the top matches. At the end the stack must be empty.',
      complexity: 'O(n) time, O(n) space',
      language: 'java',
      code: `Deque<Character> stack = new ArrayDeque<>();
Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');

for (char c : s.toCharArray()) {
    if (pairs.containsValue(c)) stack.push(c);
    else if (stack.isEmpty() || stack.pop() != pairs.get(c)) return false;
}
return stack.isEmpty();`,
    },
    insight: 'Both checks are needed: `")("` fails on the empty-stack test and `"("` fails on the non-empty-at-end test. Each alone accepts an invalid string.',
  },
  {
    slug: 'daily-temperatures',
    title: 'Days until it gets warmer',
    topic: 'stacks-queues',
    pattern: 'monotonic-stack',
    difficulty: 'Medium',
    statement: 'For each day, report how many days you must wait for a warmer temperature, or 0 if none comes.',
    example: { input: '[73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]' },
    hints: [
      'This is "next greater element" with the answer expressed as a distance.',
      'Keep the indices of days still waiting.',
      'What order are those waiting days in, by temperature?',
    ],
    bruteForce: { idea: 'For each day, scan forward for the first warmer one.', complexity: 'O(n²)' },
    optimal: {
      idea: 'A stack of indices with decreasing temperatures. A warmer day resolves every pending day it beats.',
      complexity: 'O(n) time, O(n) space',
      language: 'java',
      code: `Deque<Integer> stack = new ArrayDeque<>();
for (int i = 0; i < n; i++) {
    while (!stack.isEmpty() && t[stack.peek()] < t[i]) {
        int day = stack.pop();
        answer[day] = i - day;
    }
    stack.push(i);
}`,
    },
    insight: 'Each index is pushed once and popped at most once, so the total work is linear even though the inner loop can be long on a single iteration.',
  },
  {
    slug: 'largest-rectangle-histogram',
    title: 'Largest rectangle in a histogram',
    topic: 'stacks-queues',
    pattern: 'monotonic-stack',
    difficulty: 'Hard',
    statement: 'Given bar heights of equal width, find the area of the largest rectangle that fits inside the histogram.',
    example: { input: '[2,1,5,6,2,3]', output: '10', note: 'the 5 and 6 bars, width 2' },
    hints: [
      'For a fixed bar, how far left and right can a rectangle of that height extend?',
      'It stops at the first strictly shorter bar on each side.',
      'Those are exactly previous-smaller and next-smaller.',
      'How do you flush the stack at the end without a second loop?',
    ],
    bruteForce: { idea: 'For every pair of boundaries, find the minimum height between them.', complexity: 'O(n²)' },
    optimal: {
      idea: 'An increasing monotonic stack. When a shorter bar arrives, pop and compute the area for each popped bar, whose boundaries are the new bar and the new stack top. A sentinel of height 0 flushes the rest.',
      complexity: 'O(n) time, O(n) space',
      language: 'java',
      code: `Deque<Integer> stack = new ArrayDeque<>();
int best = 0;

for (int i = 0; i <= n; i++) {
    int height = (i == n) ? 0 : h[i];              // sentinel
    while (!stack.isEmpty() && h[stack.peek()] >= height) {
        int top = stack.pop();
        int left = stack.isEmpty() ? -1 : stack.peek();
        best = Math.max(best, h[top] * (i - left - 1));
    }
    stack.push(i);
}`,
    },
    insight: 'The same routine run once per row, over a histogram of consecutive ones above each row, solves maximal-rectangle in a binary matrix.',
  },
  {
    slug: 'min-stack',
    title: 'Stack with getMin in O(1)',
    topic: 'stacks-queues',
    pattern: 'monotonic-stack',
    difficulty: 'Medium',
    statement: 'Design a stack supporting push, pop, top and retrieving the minimum, all in constant time.',
    example: { input: 'push 3, push 5, push 2, pop, getMin', output: '3' },
    hints: [
      'Scanning for the minimum on demand is O(n).',
      'Whenever an element is pushed, what is the minimum at that moment?',
      'Can each entry remember that?',
    ],
    bruteForce: { idea: 'Scan the whole stack whenever `getMin` is called.', complexity: 'O(n) per query' },
    optimal: {
      idea: 'Store the minimum so far alongside each value. Popping restores the previous minimum automatically, because it is recorded in the entry beneath.',
      complexity: 'O(1) per operation',
      language: 'java',
      code: `Deque<int[]> stack = new ArrayDeque<>();   // {value, min so far}

void push(int value) {
    int min = stack.isEmpty() ? value : Math.min(value, stack.peek()[1]);
    stack.push(new int[] { value, min });
}

int getMin() { return stack.peek()[1]; }`,
    },
    insight: 'Carrying a derived value alongside the data is a general design move: it trades a little memory for removing a scan entirely.',
  },

  // -------------------------------------------------------------------- trees
  {
    slug: 'tree-diameter',
    title: 'Diameter of a binary tree',
    topic: 'trees',
    pattern: 'dfs',
    difficulty: 'Medium',
    statement: 'Find the number of edges on the longest path between any two nodes. The path need not pass through the root.',
    example: { input: 'a tree of 5 nodes', output: '3' },
    hints: [
      'Any such path has a highest node where it turns.',
      'At that node, the path is the left height plus the right height.',
      'Each node must return something different from what you are recording.',
    ],
    bruteForce: { idea: 'At every node compute both heights independently, then take the best.', complexity: 'O(n²) on a skewed tree' },
    optimal: {
      idea: 'A single postorder pass returning the height while recording the best `left + right + 2` seen at any node.',
      complexity: 'O(n) time, O(height) space',
      language: 'java',
      code: `int best = 0;

int height(TreeNode node) {
    if (node == null) return -1;
    int left = height(node.left), right = height(node.right);

    best = Math.max(best, left + right + 2);   // path turning here
    return 1 + Math.max(left, right);          // what the parent needs
}`,
    },
    insight: 'Return one value to the parent, record another globally. Maximum path sum and largest-BST-subtree are the same shape.',
  },
  {
    slug: 'validate-bst',
    title: 'Is this a valid binary search tree?',
    topic: 'trees',
    pattern: 'dfs',
    difficulty: 'Medium',
    statement: 'Decide whether a binary tree satisfies the search-tree ordering: every value in the left subtree is smaller, every value in the right is larger.',
    example: { input: 'root 5, left 1, right 4 with children 3 and 6', output: 'false' },
    hints: [
      'Checking each node against its two children is not enough. Why?',
      'The constraint is global, not local.',
      'What information should travel down the recursion?',
    ],
    bruteForce: { idea: 'For each node, scan its entire left and right subtrees.', complexity: 'O(n²)' },
    optimal: {
      idea: 'Carry a permitted `(min, max)` range down the recursion, narrowing it at each step. Equivalently, check that an inorder traversal is strictly increasing.',
      complexity: 'O(n) time, O(height) space',
      language: 'java',
      code: `boolean valid(TreeNode node, long min, long max) {
    if (node == null) return true;
    if (node.val <= min || node.val >= max) return false;
    return valid(node.left, min, node.val)
        && valid(node.right, node.val, max);
}`,
    },
    insight: 'The local check accepts a tree where a deep left descendant exceeds an ancestor. Using `long` bounds avoids breaking on `Integer.MIN_VALUE` at the root.',
  },
  {
    slug: 'lowest-common-ancestor',
    title: 'Lowest common ancestor',
    topic: 'trees',
    pattern: 'dfs',
    difficulty: 'Medium',
    statement: 'Given two nodes in a binary tree, find the deepest node that has both of them as descendants.',
    example: { input: 'nodes 5 and 1 in a 7-node tree', output: 'the root' },
    hints: [
      'What should a subtree report upward?',
      'Consider the case where the two targets are on opposite sides.',
      'And the case where one target is an ancestor of the other.',
    ],
    bruteForce: { idea: 'Find the root-to-node path for each target and compare them for the last shared node.', complexity: 'O(n) time, O(n) space' },
    optimal: {
      idea: 'Return the node itself if it is a target, otherwise recurse. If both sides return non-null, this node is the meeting point; otherwise pass up whichever side found something.',
      complexity: 'O(n) time, O(height) space',
      language: 'java',
      code: `TreeNode lca(TreeNode node, TreeNode p, TreeNode q) {
    if (node == null || node == p || node == q) return node;

    TreeNode left  = lca(node.left,  p, q);
    TreeNode right = lca(node.right, p, q);

    if (left != null && right != null) return node;
    return left != null ? left : right;
}`,
    },
    insight: 'In a BST it is simpler still: walk down from the root and the first node that splits the two values is the answer, in O(height) with no recursion.',
  },
  {
    slug: 'serialise-tree',
    title: 'Serialise and rebuild a binary tree',
    topic: 'trees',
    pattern: 'dfs',
    difficulty: 'Hard',
    statement: 'Turn a binary tree into a string and reconstruct exactly the same tree from it.',
    example: { input: 'root 1 with children 2 and 3', output: '"1,2,#,#,3,#,#,"' },
    hints: [
      'One traversal alone is not enough to rebuild a tree. What is missing?',
      'If nulls are recorded explicitly, the structure becomes unambiguous.',
      'Rebuild in the same order you wrote it.',
    ],
    bruteForce: { idea: 'Store preorder and inorder separately and reconstruct by locating the root in the inorder sequence.', complexity: 'O(n²) without an index map' },
    optimal: {
      idea: 'Preorder with explicit null markers is self-describing: read the root, then recursively read the left subtree and the right.',
      complexity: 'O(n) time, O(n) space',
      language: 'java',
      code: `void write(TreeNode node, StringBuilder out) {
    if (node == null) { out.append("#,"); return; }
    out.append(node.val).append(',');
    write(node.left, out); write(node.right, out);
}

TreeNode read(Iterator<String> tokens) {
    String token = tokens.next();
    if (token.equals("#")) return null;
    TreeNode node = new TreeNode(Integer.parseInt(token));
    node.left = read(tokens); node.right = read(tokens);
    return node;
}`,
    },
    insight: 'Preorder plus inorder also works and needs no markers — but index the inorder positions in a map first, or the rebuild is quadratic.',
  },

  // -------------------------------------------------------------------- heaps
  {
    slug: 'running-median',
    title: 'Median of a stream',
    topic: 'heaps',
    pattern: 'heap-top-k',
    difficulty: 'Hard',
    statement: 'Numbers arrive one at a time. After each arrival, report the median of everything seen so far.',
    example: { input: '1, then 2, then 3', output: '1, then 1.5, then 2' },
    hints: [
      'Sorting after each insert is far too slow.',
      'You only ever need the values sitting either side of the middle.',
      'Two structures, each giving you one of them.',
      'How do you keep their sizes balanced without comparing against the median?',
    ],
    bruteForce: { idea: 'Keep a sorted list and insert into it each time.', complexity: 'O(n) per insert' },
    optimal: {
      idea: 'A max-heap for the lower half and a min-heap for the upper half, kept within one element of each other. The median is the larger root, or the average of both.',
      complexity: 'O(log n) per insert, O(1) per query',
      language: 'java',
      code: `void add(int value) {
    lower.offer(value);                 // max-heap
    upper.offer(lower.poll());          // push its largest up
    if (upper.size() > lower.size()) lower.offer(upper.poll());
}

double median() {
    return lower.size() > upper.size()
        ? lower.peek()
        : (lower.peek() + upper.peek()) / 2.0;
}`,
    },
    insight: 'Always inserting into one heap and pushing through the other avoids comparing against a median that may not exist yet, and removes a whole family of edge cases.',
  },
  {
    slug: 'k-closest-points',
    title: 'K closest points to the origin',
    topic: 'heaps',
    pattern: 'heap-top-k',
    difficulty: 'Medium',
    statement: 'Given points on a plane, return the `k` nearest to the origin.',
    example: { input: 'points = [[1,3],[-2,2]], k = 1', output: '[[-2,2]]' },
    hints: [
      'Do you need the actual distance, or only the ordering?',
      'Square roots preserve order, so they can be skipped.',
      'Which heap keeps the eviction candidate at the root?',
    ],
    bruteForce: { idea: 'Sort every point by distance and take the first k.', complexity: 'O(n log n)' },
    optimal: {
      idea: 'A max-heap of size `k` keyed on squared distance, evicting the farthest whenever it overflows. Quickselect gives expected linear time if the data is in memory.',
      complexity: 'O(n log k) time, O(k) space',
      language: 'java',
      code: `PriorityQueue<int[]> heap =
    new PriorityQueue<>((p, q) -> dist(q) - dist(p));   // max-heap

for (int[] point : points) {
    heap.offer(point);
    if (heap.size() > k) heap.poll();                   // drop the farthest
}

int dist(int[] p) { return p[0] * p[0] + p[1] * p[1]; }  // no sqrt needed`,
    },
    insight: 'For the k *nearest* you want a max-heap, and for the k *largest* a min-heap. The root must always be the one you are prepared to throw away.',
  },
  {
    slug: 'task-scheduler',
    title: 'Task scheduler with a cooldown',
    topic: 'heaps',
    pattern: 'heap-top-k',
    difficulty: 'Medium',
    statement: 'Identical tasks must be separated by at least `n` intervals. Find the minimum total time to run them all, inserting idles where necessary.',
    example: { input: 'tasks = [A,A,A,B,B,B], n = 2', output: '8', note: 'A B _ A B _ A B' },
    hints: [
      'Which task should you always run first when several are available?',
      'The most frequent task determines the skeleton of the schedule.',
      'A heap gives the most frequent remaining task each round.',
    ],
    bruteForce: { idea: 'Simulate every interval, scanning all task types for one that is off cooldown.', complexity: 'O(total · types)' },
    optimal: {
      idea: 'A max-heap by remaining count. Each round take up to `n+1` distinct tasks, then push back whatever still has work. Greedily running the most frequent task keeps the gaps filled.',
      complexity: 'O(total log types)',
      language: 'java',
      code: `PriorityQueue<Integer> heap = new PriorityQueue<>(Comparator.reverseOrder());
heap.addAll(counts);

int time = 0;
while (!heap.isEmpty()) {
    List<Integer> taken = new ArrayList<>();
    for (int i = 0; i <= n && !heap.isEmpty(); i++) taken.add(heap.poll() - 1);

    for (int remaining : taken) if (remaining > 0) heap.offer(remaining);
    time += heap.isEmpty() ? taken.size() : n + 1;
}`,
    },
    insight: 'There is a closed form too — the answer is driven entirely by the most frequent task and how many types tie with it. Worth mentioning as a follow-up.',
  },
  {
    slug: 'meeting-rooms',
    title: 'Minimum meeting rooms',
    topic: 'heaps',
    pattern: 'merge-intervals',
    difficulty: 'Medium',
    statement: 'Given meeting start and end times, find the fewest rooms needed so that no two overlapping meetings share one.',
    example: { input: '[[0,30],[5,10],[15,20]]', output: '2' },
    hints: [
      'The answer is the maximum number of meetings happening at once.',
      'Process meetings in start order.',
      'What do you need to know about the rooms already in use?',
    ],
    bruteForce: { idea: 'For each meeting, count how many others overlap it.', complexity: 'O(n²)' },
    optimal: {
      idea: 'Sort by start and keep a min-heap of end times. If the earliest end is at or before the next start, reuse that room by popping. The heap size at the end is the answer.',
      complexity: 'O(n log n) time, O(n) space',
      language: 'java',
      code: `Arrays.sort(meetings, (x, y) -> x[0] - y[0]);
PriorityQueue<Integer> ends = new PriorityQueue<>();

for (int[] meeting : meetings) {
    if (!ends.isEmpty() && ends.peek() <= meeting[0]) ends.poll();
    ends.offer(meeting[1]);
}
return ends.size();`,
    },
    insight: 'Sort by start, heap on end is the standard interval-scheduling pair. The alternative is a sweep over separate start and end arrays with two pointers.',
  },
];
