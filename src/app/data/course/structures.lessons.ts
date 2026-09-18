import { CourseLesson } from './course.model';

export const FAST_SLOW: CourseLesson = {
  slug: 'fast-and-slow-pointers',
  title: 'Fast and slow pointers',
  tagline: 'One pointer moves twice as fast. That single difference finds midpoints, cycles and the exact node a cycle starts at.',
  topic: 'linked-lists',
  minutes: 12,
  practice: ['linked-list-cycle-start', 'reverse-linked-list', 'merge-k-lists'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'You cannot index into a linked list, so you cannot jump to the middle. But if one pointer takes one step while another takes two, then when the fast one reaches the end the slow one is **exactly halfway**. The same trick detects a loop: in a loop, the fast pointer eventually laps the slow one.',
    },
    { kind: 'heading', text: 'Finding the middle' },
    {
      kind: 'diagram',
      art: `1 -> 2 -> 3 -> 4 -> 5 -> null

start   slow=1  fast=1
step 1  slow=2  fast=3
step 2  slow=3  fast=5
step 3  fast.next is null -> stop, slow is the middle`,
    },
    {
      kind: 'code',
      language: 'java',
      source: `ListNode middle(ListNode head) {
    ListNode slow = head, fast = head;

    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    return slow;     // on even length this is the *second* middle
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def middle(head: Node | None) -> Node | None:
    slow = fast = head

    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    return slow`,
    },
    {
      kind: 'callout',
      tone: 'key',
      text: 'Which middle you land on depends on the start. Starting both at `head` gives the **second** middle of an even list; starting `fast = head.next` gives the **first**. Merge sort on a list needs the first, or the recursion never shrinks.',
    },
    { kind: 'heading', text: "Detecting a cycle — Floyd's algorithm" },
    {
      kind: 'para',
      text: 'If there is no cycle, `fast` falls off the end. If there is one, both pointers end up inside it, and the gap between them closes by one node per step — so they must eventually meet. No hash set, no extra memory.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;

    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }

    return false;
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def has_cycle(head: Node | None) -> bool:
    slow = fast = head

    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True

    return False`,
    },
    { kind: 'heading', text: 'Finding where the cycle starts' },
    {
      kind: 'para',
      text: 'This is the part that looks like magic, so here is the arithmetic. Let the tail before the loop be `a` nodes long and let them meet `b` nodes into the loop, with the loop length `L`. The slow pointer has walked `a + b`; the fast one has walked twice that, `2a + 2b`, and is at the same place, so `2a + 2b = a + b + kL` for some whole number of laps `k`. That gives `a + b = kL`, so `a = kL - b`.',
    },
    {
      kind: 'callout',
      tone: 'key',
      text: '`a = kL - b` says: the distance from the head to the loop start equals the distance from the meeting point onwards to the loop start (plus whole laps). So reset one pointer to the head, move both one step at a time, and they meet exactly at the entry node.',
    },
    {
      kind: 'diagram',
      art: `head --- a ---> S -- b --> M
                ^           |
                |           v
                +--- L-b ---+

a = kL - b, so walking a from head and L-b from M both land on S`,
      caption: 'S is the start of the loop, M is where the two pointers first met.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `ListNode cycleStart(ListNode head) {
    ListNode slow = head, fast = head;

    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;

        if (slow == fast) {                  // met inside the loop
            ListNode walker = head;
            while (walker != slow) {
                walker = walker.next;
                slow = slow.next;
            }
            return walker;                   // the entry node
        }
    }

    return null;
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def cycle_start(head: Node | None) -> Node | None:
    slow = fast = head

    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            walker = head
            while walker is not slow:
                walker, slow = walker.next, slow.next
            return walker

    return None`,
    },
    {
      kind: 'table',
      headers: ['Problem', 'How the two speeds are used'],
      rows: [
        ['Middle of a list', 'Fast reaches the end as slow reaches the middle'],
        ['Cycle detection', 'Fast laps slow inside the loop'],
        ['Cycle entry node', 'Reset one pointer to the head after they meet'],
        ['Happy number', 'The digit-square map is a linked list in disguise'],
        ['Palindrome list', 'Find the middle, reverse the second half, compare'],
        ['Reorder list', 'Find the middle, reverse, then weave the halves'],
      ],
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Where people go wrong',
      text: 'Testing `fast.next != null` before `fast != null`. The order matters — the second check dereferences `fast`, so a null check must come first, and the `&&` must short-circuit.',
    },
    {
      kind: 'check',
      question: 'Why must the fast pointer meet the slow one rather than skipping past it forever?',
      answer:
        'Once both are inside the loop, the gap between them shrinks by exactly one node per step, because fast gains one net node per step. A gap that decreases by one each step must hit zero — it cannot jump over it.',
    },
  ],
};

export const TRIE: CourseLesson = {
  slug: 'trie',
  title: 'Trie (prefix tree)',
  tagline: 'A tree whose edges are letters. Lookup costs the length of the word, not the size of the dictionary.',
  topic: 'advanced',
  minutes: 13,
  practice: ['implement-trie', 'word-ladder'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'Store words by sharing their beginnings. "car", "card" and "care" all walk the same `c -> a -> r` path and only then split. Looking a word up costs one step per letter — it does not matter whether the trie holds ten words or ten million.',
    },
    {
      kind: 'diagram',
      art: `        (root)
         / \\
        c   d
        |   |
        a   o
       / \\   \\
      r   t   g*
     /|\\   \\
    * d* e*  *

* marks a node where a word ends: car, card, care, cat, dog`,
    },
    { kind: 'heading', text: 'The node' },
    {
      kind: 'para',
      text: 'A node holds one child per possible next letter, plus a flag saying "a word ends here". For lowercase English an array of 26 is fastest; a hash map is the general choice when the alphabet is large or unknown.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isWord;
}

class Trie {
    private final TrieNode root = new TrieNode();

    void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) node.children[i] = new TrieNode();
            node = node.children[i];
        }
        node.isWord = true;
    }

    boolean search(String word) {
        TrieNode node = walk(word);
        return node != null && node.isWord;
    }

    boolean startsWith(String prefix) {
        return walk(prefix) != null;
    }

    private TrieNode walk(String s) {
        TrieNode node = root;
        for (char c : s.toCharArray()) {
            node = node.children[c - 'a'];
            if (node == null) return null;
        }
        return node;
    }
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `class TrieNode:
    __slots__ = ('children', 'is_word')

    def __init__(self) -> None:
        self.children: dict[str, TrieNode] = {}
        self.is_word = False


class Trie:
    def __init__(self) -> None:
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for char in word:
            node = node.children.setdefault(char, TrieNode())
        node.is_word = True

    def _walk(self, prefix: str) -> TrieNode | None:
        node = self.root
        for char in prefix:
            node = node.children.get(char)
            if node is None:
                return None
        return node

    def search(self, word: str) -> bool:
        node = self._walk(word)
        return node is not None and node.is_word

    def starts_with(self, prefix: str) -> bool:
        return self._walk(prefix) is not None`,
    },
    {
      kind: 'table',
      caption: 'L is the word length, n the number of words, A the alphabet size.',
      headers: ['Operation', 'Trie', 'Hash set', 'Sorted list'],
      rows: [
        ['Insert a word', 'O(L)', 'O(L)', 'O(n)'],
        ['Exact lookup', 'O(L)', 'O(L)', 'O(L log n)'],
        ['Does any word start with p?', 'O(L)', 'O(n·L)', 'O(L log n)'],
        ['List all words with prefix p', 'O(L + output)', 'O(n·L)', 'O(log n + output)'],
        ['Memory', 'O(total letters · A)', 'O(total letters)', 'O(total letters)'],
      ],
    },
    {
      kind: 'callout',
      tone: 'key',
      text: 'A hash set matches a trie on exact lookup and beats it on memory. Reach for a trie when the question is about **prefixes** — autocomplete, "is this a valid prefix so far", or walking a board one letter at a time.',
    },
    { kind: 'heading', text: 'Why it is the backbone of word-search problems' },
    {
      kind: 'para',
      text: 'In a grid word search, a plain list of words forces you to restart for each word. With a trie you walk the grid once, carrying a trie node alongside your position: the moment a cell has no matching child, the entire branch of the search dies. That single pruning step is the difference between a timeout and a fast solution.',
    },
    {
      kind: 'code',
      language: 'java',
      caption: 'Wildcard matching, where `.` stands for any letter — the recursion fans out only where it must.',
      source: `boolean searchWithDots(TrieNode node, String word, int i) {
    if (node == null) return false;
    if (i == word.length()) return node.isWord;

    char c = word.charAt(i);
    if (c != '.') return searchWithDots(node.children[c - 'a'], word, i + 1);

    for (TrieNode child : node.children) {
        if (searchWithDots(child, word, i + 1)) return true;
    }
    return false;
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def search_with_dots(node: TrieNode | None, word: str, i: int) -> bool:
    if node is None:
        return False
    if i == len(word):
        return node.is_word

    char = word[i]
    if char != '.':
        return search_with_dots(node.children.get(char), word, i + 1)

    return any(search_with_dots(child, word, i + 1) for child in node.children.values())`,
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Where people go wrong',
      text: 'Treating "the path exists" as "the word exists". Inserting `card` creates a node at `car` too — without the `isWord` flag, `search("car")` would wrongly return true.',
    },
    {
      kind: 'check',
      question: 'Deleting a word from a trie: what has to happen besides clearing the flag?',
      answer:
        'Clear `isWord`, then walk back up removing any node that now has no children and is not itself the end of a word. Skip that cleanup and the trie still answers correctly, but it never gives memory back.',
    },
  ],
};

export const UNION_FIND: CourseLesson = {
  slug: 'union-find',
  title: 'Union-Find (disjoint set union)',
  tagline: 'Two operations — "are these connected?" and "connect them" — both effectively constant time.',
  topic: 'advanced',
  minutes: 14,
  practice: ['number-of-islands', 'course-schedule'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'Every element points at a parent; follow the parents and you reach a **root** that names the group. Two elements are in the same group when they have the same root. Merging two groups is one pointer change: hang one root under the other.',
    },
    {
      kind: 'diagram',
      art: `start      0   1   2   3   4        five singletons

union(0,1)     0        2   3   4
               |
               1

union(2,3)     0        2       4
               |        |
               1        3

union(1,2)     0____            4
               |    \\
               1     2
                     |
                     3       find(3) -> 0, find(1) -> 0, same group`,
    },
    { kind: 'heading', text: 'The two optimisations that make it fast' },
    {
      kind: 'para',
      text: 'The naive version degenerates into a linked list and `find` becomes `O(n)`. Two small additions fix it completely.',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Union by size (or rank)** — always hang the smaller tree under the bigger one, so depth grows as slowly as possible.',
        '**Path compression** — on the way back from a `find`, point every node visited straight at the root, so the next lookup is one hop.',
      ],
    },
    {
      kind: 'callout',
      tone: 'key',
      text: 'With both, `m` operations on `n` elements cost `O(m · α(n))`, where `α` is the inverse Ackermann function. It is below 5 for any input that fits in the universe, so treat it as constant — but say "almost constant", because it technically is not.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `class UnionFind {
    private final int[] parent;
    private final int[] size;
    private int groups;

    UnionFind(int n) {
        parent = new int[n];
        size = new int[n];
        groups = n;
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            size[i] = 1;
        }
    }

    int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];   // path halving
            x = parent[x];
        }
        return x;
    }

    /** True if the two were in different groups and are now joined. */
    boolean union(int a, int b) {
        int rootA = find(a), rootB = find(b);
        if (rootA == rootB) return false;

        if (size[rootA] < size[rootB]) { int t = rootA; rootA = rootB; rootB = t; }
        parent[rootB] = rootA;
        size[rootA] += size[rootB];
        groups--;
        return true;
    }

    boolean connected(int a, int b) { return find(a) == find(b); }
    int groupCount() { return groups; }
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `class UnionFind:
    def __init__(self, n: int) -> None:
        self.parent = list(range(n))
        self.size = [1] * n
        self.groups = n

    def find(self, x: int) -> int:
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]   # path halving
            x = self.parent[x]
        return x

    def union(self, a: int, b: int) -> bool:
        root_a, root_b = self.find(a), self.find(b)
        if root_a == root_b:
            return False

        if self.size[root_a] < self.size[root_b]:
            root_a, root_b = root_b, root_a

        self.parent[root_b] = root_a
        self.size[root_a] += self.size[root_b]
        self.groups -= 1
        return True

    def connected(self, a: int, b: int) -> bool:
        return self.find(a) == self.find(b)`,
    },
    { kind: 'heading', text: 'When to use it instead of a traversal' },
    {
      kind: 'compare',
      columns: [
        {
          title: 'Use Union-Find',
          points: [
            'Edges arrive one at a time and you must answer as they do',
            'You only need connectivity, not paths',
            "Kruskal's algorithm, cycle detection in an undirected graph",
            'Counting components while merging',
          ],
        },
        {
          title: 'Use BFS or DFS',
          points: [
            'The whole graph is known up front',
            'You need the actual path, or distances',
            'Anything that must visit nodes in a particular order',
            'Directed-graph questions — DSU ignores direction',
          ],
        },
      ],
    },
    {
      kind: 'para',
      text: 'Two standard extras are worth knowing. **Counting components** is free: start at `n` and decrement on every successful union. **Cycle detection** in an undirected graph is equally free: a `union` that returns false means both endpoints were already connected, so this edge closes a cycle.',
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Where people go wrong',
      text: 'Writing `parent[b] = a` instead of `parent[find(b)] = find(a)`. Joining the *elements* rather than their roots silently splits groups, and the bug only shows up several unions later.',
    },
    {
      kind: 'check',
      question: 'Why does union by size matter if path compression already flattens the tree?',
      answer:
        'Compression only flattens the path you actually walked. Without union by size an adversarial sequence can build a deep tree before you ever query it, so the first few finds are expensive. Together the two give the near-constant bound; either alone is worse.',
    },
  ],
};

export const SEGMENT_TREE: CourseLesson = {
  slug: 'segment-tree',
  title: 'Segment tree',
  tagline: 'Range queries and point updates, both in O(log n) — what prefix sums cannot do once the data changes.',
  topic: 'advanced',
  minutes: 15,
  practice: ['range-sum-mutable', 'count-inversions'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'A prefix-sum table answers range queries instantly but has to be rebuilt whenever one element changes. A segment tree stores the answer for every *block* of the array in a tree: the root covers everything, each child covers half. A query touches `O(log n)` blocks, and so does an update.',
    },
    {
      kind: 'diagram',
      art: `array  [2, 5, 1, 4, 9, 3]        node = sum of its range

                  [0..5] 24
                 /          \\
          [0..2] 8            [3..5] 16
          /     \\             /      \\
    [0..1] 7   [2..2] 1  [3..4] 13  [5..5] 3
     /   \\                /   \\
  [0] 2  [1] 5        [3] 4  [4] 9

query(1..4) = [1] 5 + [2..2] 1 + [3..4] 13 = 19`,
      caption: 'Any range decomposes into O(log n) whole nodes — never more.',
    },
    { kind: 'heading', text: 'The array layout' },
    {
      kind: 'para',
      text: 'You do not need real node objects. Store the tree in an array of size `4n`, with the root at index 1, and the children of `i` at `2i` and `2i + 1`. The `4n` is the safe bound for any `n`; `2 · 2^ceil(log2 n)` is the tight one.',
    },
    {
      kind: 'code',
      language: 'java',
      caption: 'Sum segment tree: build, point update, range query.',
      source: `class SegmentTree {
    private final int n;
    private final long[] tree;

    SegmentTree(int[] values) {
        n = values.length;
        tree = new long[4 * n];
        build(values, 1, 0, n - 1);
    }

    private void build(int[] values, int node, int lo, int hi) {
        if (lo == hi) { tree[node] = values[lo]; return; }

        int mid = (lo + hi) >>> 1;
        build(values, 2 * node, lo, mid);
        build(values, 2 * node + 1, mid + 1, hi);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    void update(int index, int value) { update(1, 0, n - 1, index, value); }

    private void update(int node, int lo, int hi, int index, int value) {
        if (lo == hi) { tree[node] = value; return; }

        int mid = (lo + hi) >>> 1;
        if (index <= mid) update(2 * node, lo, mid, index, value);
        else update(2 * node + 1, mid + 1, hi, index, value);

        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    long query(int from, int to) { return query(1, 0, n - 1, from, to); }

    private long query(int node, int lo, int hi, int from, int to) {
        if (to < lo || hi < from) return 0;          // disjoint
        if (from <= lo && hi <= to) return tree[node];  // fully inside

        int mid = (lo + hi) >>> 1;
        return query(2 * node, lo, mid, from, to)
             + query(2 * node + 1, mid + 1, hi, from, to);
    }
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `class SegmentTree:
    def __init__(self, values: list[int]) -> None:
        self.n = len(values)
        self.tree = [0] * (4 * self.n)
        self._build(values, 1, 0, self.n - 1)

    def _build(self, values: list[int], node: int, lo: int, hi: int) -> None:
        if lo == hi:
            self.tree[node] = values[lo]
            return
        mid = (lo + hi) // 2
        self._build(values, 2 * node, lo, mid)
        self._build(values, 2 * node + 1, mid + 1, hi)
        self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]

    def update(self, index: int, value: int, node: int = 1, lo: int = 0, hi: int | None = None) -> None:
        hi = self.n - 1 if hi is None else hi
        if lo == hi:
            self.tree[node] = value
            return
        mid = (lo + hi) // 2
        if index <= mid:
            self.update(index, value, 2 * node, lo, mid)
        else:
            self.update(index, value, 2 * node + 1, mid + 1, hi)
        self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]

    def query(self, frm: int, to: int, node: int = 1, lo: int = 0, hi: int | None = None) -> int:
        hi = self.n - 1 if hi is None else hi
        if to < lo or hi < frm:
            return 0
        if frm <= lo and hi <= to:
            return self.tree[node]
        mid = (lo + hi) // 2
        return (self.query(frm, to, 2 * node, lo, mid)
                + self.query(frm, to, 2 * node + 1, mid + 1, hi))`,
    },
    {
      kind: 'callout',
      tone: 'key',
      text: 'The three cases in `query` are the whole algorithm: **disjoint** returns the identity, **fully inside** returns the stored answer, **partial** recurses into both halves. Change the combine function and the identity, and the same code answers minimum, maximum, GCD or XOR queries.',
    },
    {
      kind: 'table',
      headers: ['Structure', 'Range query', 'Point update', 'Range update', 'Code size'],
      rows: [
        ['Plain array', 'O(n)', 'O(1)', 'O(n)', 'tiny'],
        ['Prefix sums', 'O(1)', 'O(n)', 'O(n)', 'tiny'],
        ['Fenwick (BIT)', 'O(log n)', 'O(log n)', 'with tricks', 'small'],
        ['Segment tree', 'O(log n)', 'O(log n)', 'O(log n) with lazy', 'medium'],
      ],
    },
    {
      kind: 'para',
      text: 'If all you need is prefix sums with updates, a **Fenwick tree** is ten lines and faster in practice. Reach for a segment tree when the operation is not invertible — minimum, maximum, GCD — or when you need lazy propagation for range updates.',
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Where people go wrong',
      text: 'Sizing the array as `2n`. It overflows for any `n` that is not a power of two; use `4n` and stop thinking about it. The other classic is returning `0` as the identity for a **minimum** tree — it must be `+infinity`.',
    },
    {
      kind: 'check',
      question: 'Why is a query guaranteed to touch only O(log n) nodes?',
      answer:
        'At each level of the tree at most two nodes are partially covered by the query range — one at each end. Everything between them is fully covered and stops the recursion immediately. With `log n` levels and at most two live nodes per level, the work is logarithmic.',
    },
  ],
};

export const ITERATIVE_DFS: CourseLesson = {
  slug: 'iterative-dfs',
  title: 'Iterative DFS',
  tagline: 'The same traversal without recursion — an explicit stack, and no stack-overflow on deep input.',
  topic: 'trees',
  minutes: 12,
  practice: ['validate-bst', 'serialise-tree', 'number-of-islands'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'Recursion is using a stack — the language just hides it. Write the stack yourself and you get the same traversal, with no depth limit and full control over when each node is *finished*.',
    },
    {
      kind: 'visual',
      name: 'tree-traversal',
      caption: 'The three orders differ only in when a node is recorded relative to its children.',
    },
    { kind: 'heading', text: 'Preorder: the easy one' },
    {
      kind: 'para',
      text: 'Push the root; pop, record, push the children. Right goes on before left so that left comes off first.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `List<Integer> preorder(TreeNode root) {
    List<Integer> out = new ArrayList<>();
    if (root == null) return out;

    Deque<TreeNode> stack = new ArrayDeque<>();
    stack.push(root);

    while (!stack.isEmpty()) {
        TreeNode node = stack.pop();
        out.add(node.val);

        if (node.right != null) stack.push(node.right);   // right first...
        if (node.left != null) stack.push(node.left);     // ...so left pops first
    }

    return out;
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def preorder(root: Node | None) -> list[int]:
    out: list[int] = []
    stack = [root] if root else []

    while stack:
        node = stack.pop()
        out.append(node.val)

        if node.right:
            stack.append(node.right)     # right first...
        if node.left:
            stack.append(node.left)      # ...so left pops first

    return out`,
    },
    { kind: 'heading', text: 'Inorder: walk left, then record' },
    {
      kind: 'para',
      text: 'Inorder needs you to remember that a node is waiting. Walk as far left as possible pushing as you go, then pop, record, and switch to the right child.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `List<Integer> inorder(TreeNode root) {
    List<Integer> out = new ArrayList<>();
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode node = root;

    while (node != null || !stack.isEmpty()) {
        while (node != null) { stack.push(node); node = node.left; }

        node = stack.pop();
        out.add(node.val);
        node = node.right;
    }

    return out;
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def inorder(root: Node | None) -> list[int]:
    out: list[int] = []
    stack: list[Node] = []
    node = root

    while node or stack:
        while node:
            stack.append(node)
            node = node.left

        node = stack.pop()
        out.append(node.val)
        node = node.right

    return out`,
    },
    {
      kind: 'callout',
      tone: 'key',
      text: 'Inorder on a binary search tree visits the values in sorted order. That single fact solves "validate a BST", "kth smallest" and "find the closest value" — and the iterative version lets you stop early, which the recursive one cannot do cleanly.',
    },
    { kind: 'heading', text: 'Postorder, and the general pattern' },
    {
      kind: 'para',
      text: 'Postorder is the awkward one: a node can only be recorded after both subtrees. Two ways out. The quick trick is to do a *reversed* preorder — root, right, left — and reverse the result. The general way is the **colour** or **visited-flag** stack, which extends to any traversal where a node needs work both on the way down and on the way up.',
    },
    {
      kind: 'code',
      language: 'python',
      source: `def postorder(root: Node | None) -> list[int]:
    """Each node is pushed twice: once to descend, once to finish."""
    out: list[int] = []
    stack: list[tuple[Node | None, bool]] = [(root, False)]

    while stack:
        node, expanded = stack.pop()
        if node is None:
            continue

        if expanded:
            out.append(node.val)          # children are already done
        else:
            stack.append((node, True))    # come back to me later
            stack.append((node.right, False))
            stack.append((node.left, False))

    return out`,
    },
    {
      kind: 'table',
      headers: ['', 'Recursive', 'Iterative'],
      rows: [
        ['Lines of code', 'fewer', 'more'],
        ['Depth limit', 'the call stack (~10^4 frames in Python)', 'only heap memory'],
        ['Early exit', 'awkward — needs a flag or an exception', 'just `break`'],
        ['Resumable / streaming', 'no', 'yes — the stack is yours to keep'],
        ['What interviewers ask for', 'usually fine', 'asked as the follow-up'],
      ],
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Where people go wrong',
      text: 'Marking a grid cell as visited when you *pop* it instead of when you *push* it. The same cell gets pushed by several neighbours first, and the stack fills with duplicates — on a large grid that is the difference between passing and running out of memory.',
    },
    {
      kind: 'check',
      question: 'Why does pushing the right child before the left give a left-to-right preorder?',
      answer:
        'A stack is last-in first-out. The child pushed last is popped first, so pushing right then left makes left the next node visited.',
    },
  ],
};

export const TWO_HEAPS: CourseLesson = {
  slug: 'two-heaps',
  title: 'Two heaps',
  tagline: 'A max-heap for the small half, a min-heap for the big half — and the median is always at the tips.',
  topic: 'heaps',
  minutes: 12,
  practice: ['running-median', 'sliding-window-median', 'k-closest-points'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'Split the numbers into a lower half and an upper half. Keep the lower half in a **max-heap** so its largest is on top, and the upper half in a **min-heap** so its smallest is on top. The median is one of those two tips — no sorting, and each new number costs `O(log n)`.',
    },
    {
      kind: 'visual',
      name: 'heap',
      caption: 'A heap only promises the tip; that is exactly all this technique needs.',
    },
    {
      kind: 'diagram',
      art: `lower (max-heap)        upper (min-heap)
     [1, 3, 5]                [8, 9, 12]
         top 5                    top 8

even count -> median = (5 + 8) / 2 = 6.5
after adding 7:
     [1, 3, 5]                [7, 8, 9, 12]    sizes 3 and 4
odd count -> median = 7, the top of the larger heap`,
    },
    { kind: 'heading', text: 'The invariants' },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Order** — every value in `lower` is at most every value in `upper`.',
        '**Balance** — the sizes differ by at most one, with the extra element kept in an agreed heap (here, `lower`).',
      ],
    },
    {
      kind: 'para',
      text: 'Keep those two true and the median is free. The insertion routine is three lines: push into `lower`, move its top across to `upper`, and if `upper` is now bigger, move its top back. That sequence enforces both invariants without any comparisons of your own.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `class MedianStream {
    private final PriorityQueue<Integer> lower = new PriorityQueue<>(Comparator.reverseOrder());
    private final PriorityQueue<Integer> upper = new PriorityQueue<>();

    void add(int value) {
        lower.add(value);
        upper.add(lower.poll());                  // keeps the order invariant
        if (upper.size() > lower.size()) lower.add(upper.poll());
    }

    double median() {
        if (lower.size() > upper.size()) return lower.peek();
        return (lower.peek() + upper.peek()) / 2.0;
    }
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `import heapq


class MedianStream:
    def __init__(self) -> None:
        self.lower: list[int] = []    # max-heap, values negated
        self.upper: list[int] = []    # min-heap

    def add(self, value: int) -> None:
        heapq.heappush(self.lower, -value)
        heapq.heappush(self.upper, -heapq.heappop(self.lower))
        if len(self.upper) > len(self.lower):
            heapq.heappush(self.lower, -heapq.heappop(self.upper))

    def median(self) -> float:
        if len(self.lower) > len(self.upper):
            return float(-self.lower[0])
        return (-self.lower[0] + self.upper[0]) / 2`,
    },
    {
      kind: 'callout',
      tone: 'key',
      text: "Python's `heapq` is a min-heap only. Push `-value` to fake a max-heap, and remember to negate again on the way out — forgetting the second negation is the single most common bug in this pattern.",
    },
    { kind: 'heading', text: 'Beyond the median' },
    {
      kind: 'table',
      headers: ['Problem', 'What the two heaps hold'],
      rows: [
        ['Median of a stream', 'Lower half and upper half'],
        ['Median of a sliding window', 'Same, plus lazy deletion for elements leaving'],
        ['IPO / maximise capital', 'Affordable projects by profit, the rest by capital'],
        ['Schedule tasks with cooldown', 'Ready tasks by count, cooling tasks by ready time'],
        ['Minimise total waiting cost', 'The cheap side and the expensive side'],
      ],
    },
    {
      kind: 'para',
      text: 'The sliding-window median is the hard variant, because a heap cannot remove an arbitrary element. The usual fix is **lazy deletion**: keep a map of values that should be gone, and discard them when they surface at a tip. Sizes are then tracked separately from the heap lengths.',
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Where people go wrong',
      text: 'Pushing straight into whichever heap looks right. Push into `lower` first and then shuffle across — it is the only way to guarantee the order invariant when the new value belongs in the other half.',
    },
    {
      kind: 'check',
      question: 'Why not keep a sorted list and binary search for the insertion point?',
      answer:
        'Finding the spot is `O(log n)`, but inserting into an array shifts elements, so it is `O(n)` per value. Two heaps make insertion `O(log n)` and the median `O(1)`, which is what a stream needs.',
    },
  ],
};

export const STRUCTURE_LESSONS: CourseLesson[] = [
  FAST_SLOW,
  TRIE,
  UNION_FIND,
  SEGMENT_TREE,
  ITERATIVE_DFS,
  TWO_HEAPS,
];
