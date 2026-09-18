import { Chapter } from '../../core/models/chapter.models';

export const ADVANCED: Chapter = {
  slug: 'advanced',
  title: 'Advanced Structures',
  shortTitle: 'Advanced',
  level: 'Expert',
  order: 20,
  stage: 'advanced',
  readingMinutes: 30,
  definition: {
    heading: 'What this topic covers',
    text:
      'The structures that answer a question no plain array can answer cheaply: a **trie** stores words by sharing their prefixes, **union-find** tracks which items are connected as connections arrive, a **segment tree** and a **Fenwick tree** answer range queries while the data keeps changing, and a **bitmask** packs a set of up to 64 items into a single integer. Each one exists because some specific operation was too slow without it.',
  },
  summary:
    'What to reach for when the core toolkit runs out of speed: tries for prefixes, Fenwick and segment trees for range queries, sparse tables for immutable ranges, and the specialised structures behind real systems.',
  objectives: [
    'Build a trie and say why it beats a hash map for prefix queries',
    'Choose between a Fenwick tree, a segment tree and a prefix-sum array',
    'Explain lazy propagation and what problem it solves',
    'Use a sparse table for immutable range minimum queries',
    'Recognise where Bloom filters, skip lists and balanced BSTs are actually used',
  ],
  prerequisites: ['dynamic-programming', 'graphs'],
  sections: [
    {
      id: 'when',
      title: 'When you actually need these',
      blocks: [
        {
          kind: 'callout',
          tone: 'note',
          title: 'In plain words',
          text: 'When the ordinary tools are too slow because the same kind of question gets asked thousands of times, these structures do enough work up front to answer each one almost instantly.',
        },
        {
          kind: 'para',
          text: 'Everything in this chapter exists to answer one question fast: **a query over a range, or a query over a prefix, repeated many times**. If a problem has a hundred thousand queries against changing data, a linear scan per query is a hundred thousand times too slow.',
        },
        {
          kind: 'table',
          caption: 'Choose the weakest structure that answers your query.',
          headers: ['Situation', 'Structure', 'Query', 'Update'],
          rows: [
            ['Range sums, data never changes', 'prefix sums', '`O(1)`', 'not supported'],
            ['Range min or max, never changes', 'sparse table', '`O(1)`', 'not supported'],
            ['Range sums, point updates', 'Fenwick tree', '`O(log n)`', '`O(log n)`'],
            ['Any associative range query, point updates', 'segment tree', '`O(log n)`', '`O(log n)`'],
            ['Range queries **and** range updates', 'segment tree with lazy propagation', '`O(log n)`', '`O(log n)`'],
            ['Prefix queries over strings', 'trie', '`O(length)`', '`O(length)`'],
            ['Connectivity under merging', 'disjoint set union', 'near `O(1)`', 'near `O(1)`'],
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'These rarely decide an SDE-1 interview. They decide competitive rounds, senior system-heavy questions, and the follow-up "now the array changes between queries" — which is precisely the question a prefix-sum array cannot survive.',
        },
      ],
    },
    {
      id: 'trie',
      title: 'Trie',
      blocks: [
        {
          kind: 'para',
          text: 'A trie stores strings by their characters: one node per prefix, one edge per character. Lookup cost depends on the length of the word, not on how many words are stored.',
        },
        {
          kind: 'diagram',
          caption: 'Words sharing a prefix share a path, which is where both the speed and the memory saving come from.',
          art: `                (root)
                /     \\
              c         d
              |         |
              a         o
             / \\        |
            t   r       g*
            |   |
            *   *

stored: cat, car, dog     (* marks the end of a word)`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'A trie in twenty lines',
          source: `class TrieNode {
    TrieNode[] next = new TrieNode[26];
    boolean isWord;
}

void insert(String word) {
    TrieNode node = root;
    for (char c : word.toCharArray()) {
        int i = c - 'a';
        if (node.next[i] == null) node.next[i] = new TrieNode();
        node = node.next[i];
    }
    node.isWord = true;
}

boolean startsWith(String prefix) {
    TrieNode node = root;
    for (char c : prefix.toCharArray()) {
        node = node.next[c - 'a'];
        if (node == null) return false;
    }
    return true;
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


def insert(root: TrieNode, word: str) -> None:
    node = root
    for c in word:
        node = node.children.setdefault(c, TrieNode())
    node.is_word = True


def starts_with(root: TrieNode, prefix: str) -> bool:
    node = root
    for c in prefix:
        node = node.children.get(c)
        if node is None:
            return False
    return True`,
        },
        {
          kind: 'compare',
          columns: [
            {
              title: 'Trie beats a hash set when',
              points: [
                'You need prefix queries — autocomplete, "starts with".',
                'You want words in sorted order for free.',
                'Many words share long prefixes, so nodes are reused.',
                'You are walking a grid and pruning by prefix (word search).',
              ],
            },
            {
              title: 'A hash set is better when',
              points: [
                'You only ever ask for exact membership.',
                'The alphabet is large — 26 pointers per node is expensive.',
                'Words share little, so the trie degenerates.',
              ],
            },
          ],
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Binary trie for XOR',
          text: 'Storing numbers bit by bit, most significant first, makes "maximum XOR with any stored number" a greedy walk: at each bit, go to the opposite branch if it exists. That turns an `O(n^2)` pairwise search into `O(n * 32)`.',
        },
      ],
    },
    {
      id: 'fenwick',
      title: 'Fenwick tree (binary indexed tree)',
      blocks: [
        {
          kind: 'para',
          text: 'A Fenwick tree answers prefix sums with point updates, both in `O(log n)`, in a single array with no child pointers. It is the shortest useful data structure in this chapter — about ten lines.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'The whole structure',
          source: `int[] tree;   // 1-indexed

void update(int i, int delta) {
    for (i++; i < tree.length; i += i & -i) tree[i] += delta;
}

int prefixSum(int i) {
    int sum = 0;
    for (i++; i > 0; i -= i & -i) sum += tree[i];
    return sum;
}

int rangeSum(int l, int r) { return prefixSum(r) - prefixSum(l - 1); }`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `tree = [0] * (n + 1)          # 1-indexed


def update(i: int, delta: int) -> None:
    i += 1
    while i < len(tree):
        tree[i] += delta
        i += i & -i


def prefix_sum(i: int) -> int:
    total = 0
    i += 1
    while i > 0:
        total += tree[i]
        i -= i & -i
    return total


def range_sum(l: int, r: int) -> int:
    return prefix_sum(r) - prefix_sum(l - 1)`,
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'What `i & -i` is doing',
          text: 'It isolates the lowest set bit. Index `i` is responsible for a block of exactly that many elements, so adding it jumps to the next block that covers you, and subtracting it walks down to the previous disjoint block. Both loops therefore run once per set bit — at most `log n` steps.',
        },
        {
          kind: 'diagram',
          art: `index:   1    2    3    4    5    6    7    8
covers: [1] [1-2] [3] [1-4] [5] [5-6] [7] [1-8]

prefixSum(7) = tree[7] + tree[6] + tree[4]
               7 -> 6 -> 4 -> 0   (three steps)`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'Fenwick trees are 1-indexed by construction. Mixing 0-indexed input with the internal indexing is the standard bug — convert at the boundary, as the `i++` above does, and never in the middle.',
        },
      ],
    },
    {
      id: 'segment-tree',
      title: 'Segment tree',
      blocks: [
        {
          kind: 'para',
          text: 'A segment tree stores an aggregate for every range in a binary hierarchy: the root covers everything, each node splits its range in half. Any query range decomposes into `O(log n)` nodes.',
        },
        {
          kind: 'diagram',
          caption: 'A query for [1, 4] is answered by combining a few precomputed nodes.',
          art: `                [0-7] sum=36
              /              \\
        [0-3] 10            [4-7] 26
        /     \\              /     \\
    [0-1] 3  [2-3] 7    [4-5] 11  [6-7] 15
     / \\      / \\        / \\       / \\
    1   2    3   4      5   6     7   8`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Query on the half-open range [ql, qr)',
          source: `int query(int node, int lo, int hi, int ql, int qr) {
    if (qr <= lo || hi <= ql) return IDENTITY;      // no overlap
    if (ql <= lo && hi <= qr) return tree[node];    // fully inside

    int mid = (lo + hi) / 2;
    return combine(query(2 * node,     lo,  mid, ql, qr),
                   query(2 * node + 1, mid, hi,  ql, qr));
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `def query(node: int, lo: int, hi: int, ql: int, qr: int) -> int:
    """Query on the half-open range [ql, qr)."""
    if qr <= lo or hi <= ql:
        return IDENTITY                 # no overlap
    if ql <= lo and hi <= qr:
        return tree[node]               # fully inside

    mid = (lo + hi) // 2
    return combine(
        query(2 * node, lo, mid, ql, qr),
        query(2 * node + 1, mid, hi, ql, qr),
    )`,
        },
        {
          kind: 'compare',
          columns: [
            {
              title: 'Fenwick tree',
              points: [
                'Ten lines, tiny constant factor.',
                'Sums and other invertible operations only.',
                'One array, `O(n)` memory.',
              ],
            },
            {
              title: 'Segment tree',
              points: [
                'Any associative operation: min, max, gcd, custom merges.',
                'Supports range updates with lazy propagation.',
                'About `4n` memory and more code.',
              ],
            },
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'Rule of thumb: if the query is a sum and updates are point updates, use a Fenwick tree. If the query is a minimum, a maximum, or anything custom — or updates cover ranges — use a segment tree.',
        },
      ],
    },
    {
      id: 'lazy',
      title: 'Lazy propagation',
      blocks: [
        {
          kind: 'para',
          text: 'Adding a value to every element of a range would touch `O(n)` leaves. Lazy propagation instead records the pending change at the highest nodes that fully cover the range, and pushes it down only when a later query needs to look inside.',
        },
        {
          kind: 'steps',
          items: [
            { title: 'No overlap', text: 'Return immediately; nothing to do.' },
            { title: 'Full cover', text: 'Apply the update to this node, store the pending value in `lazy[node]`, and stop.' },
            { title: 'Partial overlap', text: 'Push any pending value down to the children first, then recurse into both.' },
            { title: 'On the way back', text: 'Recombine the children into this node.' },
          ],
        },
        {
          kind: 'callout',
          tone: 'why',
          text: 'The invariant is: a node\'s stored aggregate is already correct, but its children may not yet reflect a pending update. Every operation that needs to see inside a node must push first — get that wrong and the answers are subtly stale rather than obviously broken.',
        },
      ],
    },
    {
      id: 'sparse-table',
      title: 'Sparse table',
      blocks: [
        {
          kind: 'para',
          text: 'When the array never changes and the operation is **idempotent** — minimum, maximum, gcd — you can precompute answers for every power-of-two length and answer any query in `O(1)`.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Build in O(n log n), query in O(1)',
          source: `for (int k = 1; (1 << k) <= n; k++)
    for (int i = 0; i + (1 << k) <= n; i++)
        table[k][i] = Math.min(table[k - 1][i], table[k - 1][i + (1 << (k - 1))]);

int query(int l, int r) {                 // inclusive
    int k = log2[r - l + 1];
    return Math.min(table[k][l], table[k][r - (1 << k) + 1]);
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `k = 1
while (1 << k) <= n:
    for i in range(n - (1 << k) + 1):
        table[k][i] = min(table[k - 1][i], table[k - 1][i + (1 << (k - 1))])
    k += 1


def query(l: int, r: int) -> int:       # inclusive
    k = (r - l + 1).bit_length() - 1    # Python computes the log for you
    return min(table[k][l], table[k][r - (1 << k) + 1])`,
        },
        {
          kind: 'diagram',
          caption: 'Two overlapping blocks cover the range. Overlap is harmless for min and max — that is what idempotent means.',
          art: `query [2, 8],  length 7,  largest power of two = 4

      [2 ...... 5]
              [5 ...... 8]
       overlap at 5 does not change a minimum`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'Sparse tables do **not** work for sums, because the overlap would be counted twice. Idempotence is the requirement, not associativity.',
        },
      ],
    },
    {
      id: 'balanced-and-friends',
      title: 'Balanced trees, skip lists, Bloom filters',
      blocks: [
        {
          kind: 'table',
          headers: ['Structure', 'Idea', 'Where it is used'],
          rows: [
            ['AVL tree', 'strict balance, rotations on insert and delete', 'when lookups dominate and worst-case height must be tight'],
            ['Red-black tree', 'looser balance, fewer rotations', 'Java `TreeMap`, C++ `std::map`, most language libraries'],
            ['B-tree / B+ tree', 'wide nodes matching a disk page', 'database and filesystem indexes'],
            ['Skip list', 'layered linked lists, balance by randomisation', 'Redis sorted sets — simpler than a balanced tree to implement'],
            ['Bloom filter', 'bit array plus k hash functions', 'a cheap "definitely not present" pre-check before an expensive lookup'],
          ],
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'What a Bloom filter actually promises',
          text: 'It can say "definitely not in the set" or "probably in the set". False positives happen; false negatives never do. That asymmetry is exactly what makes it useful in front of a slow store — a negative answer skips the lookup entirely and is always trustworthy.',
        },
        {
          kind: 'para',
          text: 'You will not implement these in an interview. Knowing what each guarantees, and that `TreeMap` is a red-black tree with `O(log n)` bounds, is what actually comes up.',
        },
      ],
    },
    {
      id: 'strings',
      title: 'String indices',
      blocks: [
        {
          kind: 'table',
          headers: ['Structure', 'Answers', 'Cost'],
          rows: [
            ['Suffix array', 'sorted order of all suffixes', '`O(n log n)` to build'],
            ['LCP array', 'longest common prefix of adjacent suffixes', '`O(n)` after the suffix array'],
            ['Suffix automaton', 'all distinct substrings, occurrence counts', '`O(n)`'],
            ['Aho-Corasick', 'search for many patterns at once', '`O(total pattern length + text)`'],
          ],
        },
        {
          kind: 'para',
          text: 'A suffix array plus its LCP array answers "longest repeated substring", "number of distinct substrings" and "longest common substring of two strings". Aho-Corasick is a trie with KMP-style failure links, which is what makes multi-pattern search linear rather than one pass per pattern.',
        },
      ],
    },
    {
      id: 'choosing',
      title: 'Choosing under pressure',
      blocks: [
        {
          kind: 'steps',
          items: [
            { title: 'Does the data change?', text: 'No — prefix sums or a sparse table. Yes — a Fenwick or segment tree.' },
            { title: 'What is the operation?', text: 'Sum with point updates — Fenwick. Anything else — segment tree.' },
            { title: 'Do updates cover ranges?', text: 'Then you need lazy propagation.' },
            { title: 'Are the keys strings with shared prefixes?', text: 'Trie.' },
            { title: 'Is it connectivity that only ever merges?', text: 'Disjoint set union.' },
            { title: 'Do you need order and range queries on keys?', text: 'A balanced tree map.' },
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'Reach for the simplest structure that answers the query. A prefix-sum array beats a segment tree whenever the data is static — and choosing the heavier structure unnecessarily is itself a mark against you.',
        },
        {
          kind: 'check',
          question: 'A problem gives 10^5 queries for the minimum of a range, and the array never changes. What do you build?',
          answer: 'A sparse table. Build once in `O(n log n)` and answer each query in `O(1)`. A segment tree also works but costs `O(log n)` per query and far more code, for no benefit when nothing is ever updated.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'These structures exist for repeated range or prefix queries — that is the trigger to reach for them.',
    'A trie indexes by prefix, so cost depends on word length, not on how many words are stored.',
    'A Fenwick tree gives prefix sums with point updates in ten lines; `i & -i` walks the blocks.',
    'A segment tree handles any associative operation and, with lazy propagation, range updates.',
    'Sparse tables answer immutable min, max and gcd queries in `O(1)` — never sums.',
    'Balanced trees back the ordered maps in every standard library.',
    'A Bloom filter can be wrong about presence but never about absence.',
    'Always choose the simplest structure that answers the query.',
  ],
};
