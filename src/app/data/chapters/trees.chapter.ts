import { Chapter } from '../../core/models/chapter.models';

export const TREES: Chapter = {
  slug: 'trees',
  title: 'Trees',
  shortTitle: 'Trees',
  level: 'Core',
  order: 15,
  stage: 'trees',
  readingMinutes: 32,
  definition: {
    heading: 'What a tree is',
    text:
      'A **tree** is a connected graph with no cycles: `n` nodes and exactly `n - 1` edges, with one node named the root and every other node reachable from it by exactly one path. A **binary tree** gives each node at most two children; a **binary search tree** additionally keeps everything smaller on the left and everything larger on the right, which is what turns a lookup into a descent instead of a search.',
  },
  summary:
    'Hierarchies, the four traversal orders, and the habit of returning an answer up from the children that solves most tree problems. Then binary search trees, where the ordering does the work.',
  objectives: [
    'Write all four traversals recursively and preorder/level-order iteratively',
    'Choose the traversal order that matches what a problem needs',
    'Solve height, diameter and balance with one bottom-up pass',
    'Use the BST ordering property to search, validate and find the kth element',
    'Find the lowest common ancestor in a general binary tree and in a BST',
  ],
  prerequisites: ['recursion', 'stacks-queues'],
  sections: [
    {
      id: 'vocabulary',
      title: 'Vocabulary and shape',
      blocks: [
        {
          kind: 'callout',
          tone: 'note',
          title: 'In plain words',
          text: 'A structure that branches, like a family tree or a folder inside a folder. Almost every tree question is answered the same way: ask each branch, then combine whatever comes back.',
        },
        {
          kind: 'para',
          text: 'A tree is a connected graph with no cycles: `n` nodes and exactly `n - 1` edges, with one node designated the root. A **binary** tree gives each node at most two children.',
        },
        {
          kind: 'diagram',
          art: `            [ 5 ]            <- root, depth 0
           /     \\
       [ 3 ]     [ 8 ]        <- depth 1
       /   \\         \\
   [ 1 ] [ 4 ]      [ 9 ]     <- leaves, depth 2

height of the tree = 2      (longest root-to-leaf path in edges)
1 and 4 are siblings; 3 is their parent; 5 is an ancestor of all`,
        },
        {
          kind: 'table',
          headers: ['Term', 'Meaning'],
          rows: [
            ['Depth of a node', 'edges from the root down to it'],
            ['Height of a node', 'edges from it down to its deepest leaf'],
            ['Leaf', 'a node with no children'],
            ['Subtree', 'a node together with all of its descendants'],
            ['Complete tree', 'every level full except possibly the last, filled left to right'],
            ['Balanced tree', 'left and right heights differ by at most one at every node'],
            ['Skewed tree', 'effectively a linked list — the worst case for every operation'],
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'A balanced tree of `n` nodes has height about `log2(n)`; a skewed one has height `n - 1`. Every "`O(log n)`" claim about trees quietly assumes balance, so state that assumption when you make it.',
        },
      ],
    },
    {
      id: 'traversals',
      title: 'The four traversal orders',
      blocks: [
        {
          kind: 'para',
          text: 'Preorder, inorder and postorder differ only in **when the node itself is visited** relative to its two recursive calls. Level order is different in kind: it uses a queue rather than recursion.',
        },
        {
          kind: 'visual',
          name: 'tree-traversal',
          caption:
            'Switch the order and watch which node lights up first.',
        },
        {
          kind: 'code',
          language: 'java',
          source: `void preorder(TreeNode node) {                 // node, left, right
    if (node == null) return;
    visit(node); preorder(node.left); preorder(node.right);
}

void inorder(TreeNode node) {                  // left, node, right
    if (node == null) return;
    inorder(node.left); visit(node); inorder(node.right);
}

void postorder(TreeNode node) {                // left, right, node
    if (node == null) return;
    postorder(node.left); postorder(node.right); visit(node);
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `def preorder(node: TreeNode | None) -> None:      # node, left, right
    if node is None:
        return
    visit(node)
    preorder(node.left)
    preorder(node.right)


def inorder(node: TreeNode | None) -> None:       # left, node, right
    if node is None:
        return
    inorder(node.left)
    visit(node)
    inorder(node.right)


def postorder(node: TreeNode | None) -> None:     # left, right, node
    if node is None:
        return
    postorder(node.left)
    postorder(node.right)
    visit(node)`,
        },
        {
          kind: 'diagram',
          caption: 'The same tree, four orders.',
          art: `          1
         / \\
        2   3
       / \\
      4   5

preorder  : 1 2 4 5 3     (root first  - copying, serialising)
inorder   : 4 2 5 1 3     (sorted for a BST)
postorder : 4 5 2 3 1     (children first - deleting, bottom-up answers)
level     : 1 2 3 4 5     (breadth first - shortest path, per-level work)`,
        },
        {
          kind: 'table',
          caption: 'Choosing the order is usually the whole design decision.',
          headers: ['Use', 'Order', 'Why'],
          rows: [
            ['Copy or serialise a tree', 'preorder', 'the root must exist before its children'],
            ['Read a BST in sorted order', 'inorder', 'left subtree is entirely smaller'],
            ['Compute height, diameter, sums', 'postorder', 'the answer depends on the children'],
            ['Delete a whole tree', 'postorder', 'free children before the parent'],
            ['Level sums, views, shortest depth', 'level order', 'process one depth at a time'],
          ],
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Level order with a queue - the size snapshot separates the levels',
          source: `Queue<TreeNode> queue = new ArrayDeque<>();
if (root != null) queue.add(root);

while (!queue.isEmpty()) {
    int levelSize = queue.size();               // snapshot before adding children
    for (int i = 0; i < levelSize; i++) {
        TreeNode node = queue.poll();
        visit(node);
        if (node.left  != null) queue.add(node.left);
        if (node.right != null) queue.add(node.right);
    }
    endOfLevel();
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `from collections import deque

queue = deque([root] if root else [])

while queue:
    level_size = len(queue)                # snapshot before adding children

    for _ in range(level_size):
        node = queue.popleft()
        visit(node)

        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)

    end_of_level()`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'Taking `queue.size()` **before** the inner loop is what keeps levels separate. Reading it inside the loop mixes the next level in and quietly breaks every per-level answer.',
        },
      ],
    },
    {
      id: 'bottom-up',
      title: 'The bottom-up pattern',
      blocks: [
        {
          kind: 'para',
          text: 'Most tree problems have the same shape: ask each child for a summary, combine the two summaries into your own answer, and return it. Sometimes you also record a global best on the way through.',
        },
        {
          kind: 'figure',
          height: 256,
          label: 'Heights returned from the leaves upward to the root',
          caption: 'Write the contract first, then trust it for the children.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">Each node answers for itself using only what the children returned</text>
<circle cx="300" cy="50" r="17" class="dg-fill" />
<text x="300" y="54.5" class="dg-t" text-anchor="middle">a</text>
<circle cx="200" cy="124" r="17" class="dg-box" />
<text x="200" y="128.5" class="dg-t" text-anchor="middle">b</text>
<circle cx="400" cy="124" r="17" class="dg-box" />
<text x="400" y="128.5" class="dg-t" text-anchor="middle">c</text>
<circle cx="140" cy="196" r="17" class="dg-box" />
<text x="140" y="200.5" class="dg-t" text-anchor="middle">d</text>
<circle cx="260" cy="196" r="17" class="dg-box" />
<text x="260" y="200.5" class="dg-t" text-anchor="middle">e</text>
<path class="dg-thin" d="M288 66 L212 108" />
<path class="dg-thin" d="M312 66 L388 108" />
<path class="dg-thin" d="M188 140 L152 180" />
<path class="dg-thin" d="M212 140 L248 180" />
<path class="dg-line" marker-end="url(#ah)" d="M146 178 L190 142" />
<path class="dg-line" marker-end="url(#ah)" d="M254 178 L210 142" />
<path class="dg-line" marker-end="url(#ah)" d="M206 106 L292 68" />
<path class="dg-line" marker-end="url(#ah)" d="M394 106 L308 68" />
<text x="120" y="150" class="dg-m" text-anchor="middle">1</text>
<text x="285" y="150" class="dg-m" text-anchor="middle">1</text>
<text x="230" y="84" class="dg-m" text-anchor="middle">2</text>
<text x="370" y="84" class="dg-m" text-anchor="middle">1</text>
<text x="300" y="22" class="dg-m" text-anchor="middle">answer = 3</text>
<text x="470" y="110" class="dg-s" text-anchor="start">the contract:</text>
<text x="470" y="132" class="dg-s" text-anchor="start">one sentence about</text>
<text x="470" y="152" class="dg-s" text-anchor="start">what you return</text>
<text x="0" y="244" class="dg-s" text-anchor="start">answers flow upwards; a node never looks down more than one level</text>`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Height - the simplest instance of the pattern',
          source: `int height(TreeNode node) {
    if (node == null) return -1;                       // an empty tree has height -1
    return 1 + Math.max(height(node.left), height(node.right));
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `def height(node: TreeNode | None) -> int:
    if node is None:
        return -1                          # an empty tree has height -1
    return 1 + max(height(node.left), height(node.right))`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Diameter - return the height, but record the best path found so far',
          source: `int best = 0;

int height(TreeNode node) {
    if (node == null) return -1;
    int left = height(node.left), right = height(node.right);

    best = Math.max(best, left + right + 2);   // path through this node
    return 1 + Math.max(left, right);          // what the parent needs
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `best = 0


def height(node: TreeNode | None) -> int:
    global best

    if node is None:
        return -1

    left, right = height(node.left), height(node.right)

    best = max(best, left + right + 2)     # path through this node
    return 1 + max(left, right)            # what the parent needs`,
        },
        {
          kind: 'callout',
          tone: 'key',
          title: 'Return one thing, record another',
          text: 'The value a node returns to its parent and the value you are looking for are often different. Diameter, maximum path sum and "largest BST subtree" are all this: return the local summary, update a global best.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Balanced check in one pass - the sentinel avoids recomputing heights',
          source: `int check(TreeNode node) {          // returns height, or -2 if unbalanced
    if (node == null) return -1;
    int left = check(node.left);
    if (left == -2) return -2;
    int right = check(node.right);
    if (right == -2) return -2;

    if (Math.abs(left - right) > 1) return -2;
    return 1 + Math.max(left, right);
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `def check(node: TreeNode | None) -> int:
    """Returns the height, or -2 once any subtree is unbalanced."""
    if node is None:
        return -1

    left = check(node.left)
    if left == -2:
        return -2

    right = check(node.right)
    if right == -2:
        return -2

    if abs(left - right) > 1:
        return -2

    return 1 + max(left, right)`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'Calling `height()` inside an `isBalanced()` that also recurses gives `O(n^2)` on a skewed tree — each node recomputes the heights below it. Returning height and the balance verdict together makes it `O(n)`.',
        },
      ],
    },
    {
      id: 'views',
      title: 'Views and structured traversals',
      blocks: [
        {
          kind: 'table',
          headers: ['Problem', 'Approach'],
          rows: [
            ['Left view', 'level order, take the first node of each level'],
            ['Right view', 'level order, take the last node of each level'],
            ['Top view', 'assign a horizontal distance; keep the first node seen at each distance'],
            ['Bottom view', 'same, but keep the last node seen at each distance'],
            ['Vertical order', 'group by horizontal distance, then by depth'],
            ['Boundary traversal', 'left edge, then leaves, then right edge reversed'],
            ['Zigzag level order', 'level order, reversing alternate levels'],
          ],
        },
        {
          kind: 'para',
          text: 'The horizontal distance idea is worth internalising: give the root distance 0, the left child `d - 1` and the right child `d + 1`. Top, bottom and vertical views are then just different ways of grouping by that number.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Vertical order - a sorted map keyed by horizontal distance',
          source: `TreeMap<Integer, List<Integer>> columns = new TreeMap<>();

void walk(TreeNode node, int distance) {
    if (node == null) return;
    columns.computeIfAbsent(distance, k -> new ArrayList<>()).add(node.val);
    walk(node.left,  distance - 1);
    walk(node.right, distance + 1);
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `from collections import defaultdict

columns = defaultdict(list)


def walk(node: TreeNode | None, distance: int) -> None:
    if node is None:
        return

    columns[distance].append(node.val)
    walk(node.left, distance - 1)
    walk(node.right, distance + 1)


# Python dicts keep insertion order, not sorted order — sort the keys at the end:
ordered = [columns[d] for d in sorted(columns)]`,
        },
      ],
    },
    {
      id: 'paths-lca',
      title: 'Paths and the lowest common ancestor',
      blocks: [
        {
          kind: 'para',
          text: 'The LCA of two nodes is the deepest node having both as descendants. In a general binary tree the recursive solution is four lines, and the reasoning is what makes it memorable.',
        },
        {
          kind: 'figure',
          height: 268,
          label: 'Two marked nodes whose lowest common ancestor is their shared parent',
          caption: 'Return the node itself when both children report a find; otherwise pass up whatever came back.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">The first node that sees a target on both sides is the answer</text>
<circle cx="300" cy="50" r="17" class="dg-box" />
<text x="300" y="54.5" class="dg-t" text-anchor="middle">r</text>
<circle cx="200" cy="118" r="17" class="dg-fill2" />
<text x="200" y="122.5" class="dg-on" text-anchor="middle">x</text>
<circle cx="400" cy="118" r="17" class="dg-box" />
<text x="400" y="122.5" class="dg-t" text-anchor="middle">y</text>
<circle cx="140" cy="190" r="17" class="dg-fill" />
<text x="140" y="194.5" class="dg-t" text-anchor="middle">p</text>
<circle cx="260" cy="190" r="17" class="dg-fill" />
<text x="260" y="194.5" class="dg-t" text-anchor="middle">q</text>
<circle cx="400" cy="190" r="17" class="dg-box" />
<text x="400" y="194.5" class="dg-t" text-anchor="middle">z</text>
<path class="dg-thin" d="M288 64 L212 104" />
<path class="dg-thin" d="M312 64 L388 104" />
<path class="dg-thin" d="M188 134 L152 174" />
<path class="dg-thin" d="M212 134 L248 174" />
<path class="dg-thin" d="M400 136 L400 172" />
<path class="dg-line" marker-end="url(#ah)" d="M140 172 L190 132" />
<path class="dg-line" marker-end="url(#ah)" d="M260 172 L210 132" />
<text x="200" y="84" class="dg-m" text-anchor="middle">both sides non-null</text>
<text x="200" y="232" class="dg-s" text-anchor="middle">lowest common ancestor of p and q</text>
<text x="0" y="256" class="dg-s" text-anchor="start">above x, only one side ever reports back, so x is where the paths join</text>`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'LCA in a general binary tree - O(n)',
          source: `TreeNode lca(TreeNode node, TreeNode p, TreeNode q) {
    if (node == null || node == p || node == q) return node;

    TreeNode left  = lca(node.left,  p, q);
    TreeNode right = lca(node.right, p, q);

    if (left != null && right != null) return node;   // found one on each side
    return (left != null) ? left : right;             // pass up whatever was found
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `def lca(node: TreeNode | None, p: TreeNode, q: TreeNode) -> TreeNode | None:
    if node is None or node is p or node is q:
        return node

    left = lca(node.left, p, q)
    right = lca(node.right, p, q)

    if left and right:
        return node          # found one on each side
    return left or right     # pass up whatever was found`,
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why returning the node itself is correct',
          text: 'The function returns "a target, or the LCA if both are below here". If both sides return non-null, the two targets are in different subtrees, so this node is the meeting point. If only one side does, the answer is somewhere above, and passing the found node upward is exactly right.',
        },
        {
          kind: 'para',
          text: 'Path problems follow the same bottom-up shape. For maximum path sum, each node returns the best **downward** path through it, and the global best considers the path that turns at that node.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Maximum path sum - negative branches are clamped to zero',
          source: `int best = Integer.MIN_VALUE;

int down(TreeNode node) {
    if (node == null) return 0;
    int left  = Math.max(0, down(node.left));    // ignore a branch that hurts
    int right = Math.max(0, down(node.right));

    best = Math.max(best, node.val + left + right);   // path turning here
    return node.val + Math.max(left, right);          // path continuing upward
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `best = float('-inf')


def down(node: TreeNode | None) -> int:
    global best

    if node is None:
        return 0

    left = max(0, down(node.left))         # ignore a branch that hurts
    right = max(0, down(node.right))

    best = max(best, node.val + left + right)   # path turning here
    return node.val + max(left, right)          # path continuing upward`,
        },
      ],
    },
    {
      id: 'bst',
      title: 'Binary search trees',
      blocks: [
        {
          kind: 'para',
          text: 'A BST adds one rule: every value in the left subtree is smaller than the node, and every value in the right subtree is larger. That single invariant turns search into a series of decisions rather than a scan.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Search - O(h), which is O(log n) only when the tree is balanced',
          source: `TreeNode search(TreeNode node, int target) {
    while (node != null && node.val != target)
        node = (target < node.val) ? node.left : node.right;
    return node;
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `def search(node: TreeNode | None, target: int) -> TreeNode | None:
    while node and node.val != target:
        node = node.left if target < node.val else node.right
    return node`,
        },
        {
          kind: 'table',
          headers: ['Operation', 'Balanced', 'Skewed'],
          rows: [
            ['Search', '`O(log n)`', '`O(n)`'],
            ['Insert', '`O(log n)`', '`O(n)`'],
            ['Delete', '`O(log n)`', '`O(n)`'],
            ['Inorder traversal', '`O(n)`', '`O(n)`'],
            ['Min or max', '`O(log n)`', '`O(n)`'],
          ],
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'Validating a BST',
          text: 'Checking only `node.left.val < node.val < node.right.val` at each node is wrong — it passes trees where a deep left descendant is larger than an ancestor. Carry a `(min, max)` range down the recursion, or verify that an inorder traversal is strictly increasing.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Correct validation with a range',
          source: `boolean valid(TreeNode node, long min, long max) {
    if (node == null) return true;
    if (node.val <= min || node.val >= max) return false;
    return valid(node.left, min, node.val) && valid(node.right, node.val, max);
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `def valid(node: TreeNode | None, low: float, high: float) -> bool:
    if node is None:
        return True
    if not low < node.val < high:
        return False

    return valid(node.left, low, node.val) and valid(node.right, node.val, high)

# call it with valid(root, float('-inf'), float('inf'))`,
        },
        {
          kind: 'para',
          text: 'Deletion has three cases: a leaf is removed outright; a node with one child is replaced by that child; a node with two children is replaced by its inorder successor — the smallest value in its right subtree — which is then deleted from there.',
        },
        {
          kind: 'table',
          headers: ['BST question', 'Technique'],
          rows: [
            ['Kth smallest', 'inorder traversal, stop at k'],
            ['Kth largest', 'reverse inorder, stop at k'],
            ['Inorder successor', 'right subtree minimum, or the last node you turned left at'],
            ['LCA in a BST', 'walk down while both targets are on the same side'],
            ['Range sum', 'prune any subtree entirely outside the range'],
            ['Build a balanced BST from a sorted array', 'take the middle as the root, recurse on both halves'],
          ],
        },
        {
          kind: 'check',
          question: 'Why does inorder traversal of a BST produce sorted output?',
          answer: 'Inorder visits the entire left subtree, then the node, then the right subtree. By the BST invariant everything on the left is smaller and everything on the right is larger, and that holds recursively — so the sequence is sorted by construction.',
        },
      ],
    },
    {
      id: 'serialise',
      title: 'Serialisation and reconstruction',
      blocks: [
        {
          kind: 'para',
          text: 'To rebuild a tree from a traversal you need enough information to know where the subtrees end. One traversal alone is not enough — unless it records the nulls.',
        },
        {
          kind: 'figure',
          height: 202,
          label: 'A three-node tree written out as preorder tokens with null markers',
          caption: 'Reconstruction reads the same sequence back, consuming one token per node.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">The nulls are what make the shape unambiguous</text>
<circle cx="140" cy="56" r="17" class="dg-box" />
<text x="140" y="60.5" class="dg-t" text-anchor="middle">1</text>
<circle cx="80" cy="124" r="17" class="dg-box" />
<text x="80" y="128.5" class="dg-t" text-anchor="middle">2</text>
<circle cx="200" cy="124" r="17" class="dg-box" />
<text x="200" y="128.5" class="dg-t" text-anchor="middle">3</text>
<path class="dg-thin" d="M128 72 L92 108" />
<path class="dg-thin" d="M152 72 L188 108" />
<path class="dg-line" marker-end="url(#ah)" d="M250 100 L310 100" />
<rect x="330" y="80" width="38" height="38" rx="4" class="dg-box" />
<text x="349" y="103.5" class="dg-t" text-anchor="middle">1</text>
<rect x="372" y="80" width="38" height="38" rx="4" class="dg-box" />
<text x="391" y="103.5" class="dg-t" text-anchor="middle">2</text>
<rect x="414" y="80" width="38" height="38" rx="4" class="dg-muted" />
<text x="433" y="103.5" class="dg-t" text-anchor="middle">#</text>
<rect x="456" y="80" width="38" height="38" rx="4" class="dg-muted" />
<text x="475" y="103.5" class="dg-t" text-anchor="middle">#</text>
<rect x="498" y="80" width="38" height="38" rx="4" class="dg-box" />
<text x="517" y="103.5" class="dg-t" text-anchor="middle">3</text>
<rect x="540" y="80" width="38" height="38" rx="4" class="dg-muted" />
<text x="559" y="103.5" class="dg-t" text-anchor="middle">#</text>
<rect x="582" y="80" width="38" height="38" rx="4" class="dg-muted" />
<text x="601" y="103.5" class="dg-t" text-anchor="middle">#</text>
<text x="460" y="152" class="dg-s" text-anchor="middle">preorder with null markers</text>
<text x="0" y="190" class="dg-s" text-anchor="start">without the markers, 1 2 3 could be three different trees</text>`,
        },
        {
          kind: 'list',
          items: [
            '**Preorder with null markers** is self-sufficient: read the root, then recursively read the left and right subtrees.',
            '**Preorder plus inorder** determines a tree uniquely: preorder gives the root, inorder says how many nodes fall on each side.',
            '**Postorder plus inorder** works the same way, reading the root from the end.',
            '**Preorder plus postorder** is ambiguous for general binary trees.',
          ],
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Serialise with null markers',
          source: `void write(TreeNode node, StringBuilder out) {
    if (node == null) { out.append("#,"); return; }
    out.append(node.val).append(',');
    write(node.left, out);
    write(node.right, out);
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `def write(node: TreeNode | None, out: list[str]) -> None:
    if node is None:
        out.append('#')          # the nulls are what make the shape unambiguous
        return

    out.append(str(node.val))
    write(node.left, out)
    write(node.right, out)`,
        },
        {
          kind: 'callout',
          tone: 'note',
          text: 'Reconstruction from preorder and inorder is `O(n)` only if you index the inorder positions in a hash map first. Searching for the root position on every call makes it `O(n^2)`.',
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
            'Which traversal order does this problem actually need?',
            'Can each node answer from its children alone — that is, is this bottom-up?',
            'Am I returning one value and recording another?',
            'Have I handled the empty tree, a single node and a skewed tree?',
            'Is my recursion depth the height? On a skewed tree that is `n`.',
            'For a BST, am I using the ordering, or traversing blindly and wasting it?',
            'Did I define height as edges or nodes, and am I consistent throughout?',
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'Nearly every tree problem reduces to one sentence: what does each node need from its children, and what does it owe its parent? Answer that and the code is usually five lines.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'A tree is `n` nodes and `n - 1` edges with no cycles; balance is what makes operations logarithmic.',
    'Preorder, inorder and postorder differ only in when the node is visited; level order uses a queue.',
    'Take the queue size before the level loop, or levels merge.',
    'The bottom-up pattern — ask the children, combine, return — solves most tree problems.',
    'Return one value to the parent while recording a different global best.',
    'LCA returns a target or the meeting point; both sides non-null means this node is it.',
    'A BST needs a range check to validate; local comparisons are not enough.',
    'Preorder with nulls, or preorder plus inorder, reconstructs a tree uniquely.',
  ],
};
