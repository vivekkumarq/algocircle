import { Chapter } from '../../core/models/chapter.models';

export const RECURSION: Chapter = {
  slug: 'recursion',
  title: 'Recursion & Backtracking',
  shortTitle: 'Recursion',
  level: 'Core',
  order: 12,
  stage: 'recursion',
  readingMinutes: 28,
  definition: {
    heading: 'What recursion is',
    text:
      '**Recursion** is a function that solves a problem by calling itself on a smaller version of the same problem, with a **base case** that stops the descent; the call stack does the bookkeeping. **Backtracking** is recursion that makes a choice, explores, then undoes the choice before trying the next one — which is how you search every arrangement without ever writing the arrangements down.',
  },
  summary:
    'Defining a problem in terms of itself, drawing the recursion tree to see the cost, and pruning a search that would otherwise explode. Trees, graphs and dynamic programming are all this chapter with extra bookkeeping.',
  objectives: [
    'Write a recursive function by stating its contract instead of tracing it',
    'Draw a recursion tree and read the complexity off it',
    'Generate subsets, permutations and combinations with one template',
    'Apply the choose / explore / un-choose backtracking skeleton',
    'Prune a search and explain why the pruning is safe',
  ],
  prerequisites: ['sorting'],
  sections: [
    {
      id: 'contract',
      title: 'Trust the contract, do not trace the stack',
      blocks: [
        {
          kind: 'callout',
          tone: 'note',
          title: 'In plain words',
          text: 'A function that calls itself on a smaller version of the same problem. The trick is to stop trying to follow every call in your head, and instead trust that the smaller call already works.',
        },
        {
          kind: 'para',
          text: 'The mistake almost everyone makes at first is trying to follow the calls in their head. That works for depth three and collapses after. The way out is to define a **contract** and assume it already holds for smaller inputs.',
        },
        {
          kind: 'steps',
          items: [
            {
              title: 'State what the function returns',
              text: 'One sentence, precise. "Returns the height of the tree rooted here." Not "does the recursion".',
            },
            {
              title: 'Write the base case',
              text: 'The smallest input where the answer is immediate, with no recursion.',
            },
            {
              title: 'Assume it works for smaller inputs',
              text: 'This is the leap. You are allowed to call it and believe the answer.',
            },
            {
              title: 'Combine the smaller answers',
              text: 'Turn what the children returned into your own answer.',
            },
          ],
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Contract: returns the number of nodes in this subtree',
          source: `int count(TreeNode node) {
    if (node == null) return 0;                          // base case
    return 1 + count(node.left) + count(node.right);     // trust the children
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `def count(node: Node | None) -> int:
    """Returns the number of nodes in this subtree."""
    if node is None:
        return 0                                  # base case

    return 1 + count(node.left) + count(node.right)   # trust the children`,
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'If you can state the contract in one sentence, the body usually writes itself in three lines. If you cannot, no amount of tracing will help — the contract is the missing piece.',
        },
      ],
    },
    {
      id: 'requirements',
      title: 'What every recursion needs',
      blocks: [
        {
          kind: 'list',
          items: [
            '**A base case** that returns without recursing.',
            '**Progress** — every recursive call must move strictly closer to the base case.',
            '**Correct combination** of the sub-answers.',
            '**Depth you can afford** — the stack is only a few megabytes.',
          ],
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'The two failure modes',
          text: 'No base case, or a call that does not shrink the input, gives infinite recursion and a stack overflow. Depth proportional to `n` on an input of a million overflows even when the logic is perfect — that is when you convert to iteration.',
        },
        {
          kind: 'diagram',
          caption: 'Each call frame holds parameters and locals, and lives until its call returns.',
          art: `count(root)
  count(left)
    count(left.left) -> 0
    count(left.right) -> 0
  = 1
  count(right)
    ...
  = 3
= 5`,
        },
      ],
    },
    {
      id: 'recursion-tree',
      title: 'The recursion tree tells you the cost',
      blocks: [
        {
          kind: 'para',
          text: 'To find the complexity of a recursive function, draw the tree of calls and ask two questions: how many nodes are there, and how much work does each node do outside its recursive calls?',
        },
        {
          kind: 'visual',
          name: 'recursion-tree',
          caption:
            'Every highlighted node is a subproblem solved more than once.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Naive Fibonacci - exponential, and the tree shows exactly why',
          source: `int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `def fib(n: int) -> int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

# One decorator turns the exponential tree into a linear walk:
# @lru_cache(maxsize=None)`,
        },
        {
          kind: 'diagram',
          caption: 'fib(4) computes fib(2) twice and fib(1) three times. The repetition is the cost.',
          art: `                fib(4)
              /        \\
         fib(3)        fib(2)
        /     \\        /    \\
   fib(2)  fib(1)  fib(1) fib(0)
   /    \\
fib(1) fib(0)`,
        },
        {
          kind: 'table',
          headers: ['Recursion shape', 'Tree', 'Complexity'],
          rows: [
            ['`f(n-1)` once', 'a chain of depth n', '`O(n)`'],
            ['`f(n/2)` once', 'a chain of depth log n', '`O(log n)`'],
            ['`f(n/2)` twice, `O(1)` work', 'a balanced tree', '`O(n)`'],
            ['`f(n/2)` twice, `O(n)` work', 'balanced tree, n per level', '`O(n log n)`'],
            ['`f(n-1)` twice', 'a doubling tree', '`O(2^n)`'],
            ['`f(n-1)` n times', 'a factorial tree', '`O(n!)`'],
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'When the tree shows the **same subproblem appearing more than once**, you have found the doorway to dynamic programming: cache the answer and the exponential tree collapses to a linear chain.',
        },
      ],
    },
    {
      id: 'subsets',
      title: 'Subsets: the include / exclude choice',
      blocks: [
        {
          kind: 'para',
          text: 'Every element is either in the subset or out of it. That is a binary decision per element, made at depth `i` of the recursion, and it generates all `2^n` subsets.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'All subsets - O(2^n) results, O(n) depth',
          source: `void subsets(int i, List<Integer> current) {
    if (i == n) { output.add(new ArrayList<>(current)); return; }

    subsets(i + 1, current);            // exclude a[i]

    current.add(a[i]);                  // include a[i]
    subsets(i + 1, current);
    current.remove(current.size() - 1); // undo, so the caller is unaffected
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `def subsets(i: int, current: list[int]) -> None:
    if i == len(a):
        output.append(current[:])      # copy: current keeps changing
        return

    subsets(i + 1, current)            # exclude a[i]

    current.append(a[i])               # include a[i]
    subsets(i + 1, current)
    current.pop()                      # undo, so the caller is unaffected`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'Copy the list when you record it',
          text: '`output.add(current)` stores a **reference** to the working list, which keeps mutating. Every entry in your output then ends up identical and usually empty. Always add a copy.',
        },
        {
          kind: 'para',
          text: 'For `n <= 20`, the same enumeration is often cleaner with bitmasks: each integer from `0` to `2^n - 1` is a subset, and bit `i` says whether element `i` is included.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'The iterative equivalent',
          source: `for (int mask = 0; mask < (1 << n); mask++)
    for (int i = 0; i < n; i++)
        if ((mask >> i & 1) == 1) use(a[i]);`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `for mask in range(1 << n):
    for i in range(n):
        if mask >> i & 1:
            use(a[i])

# the standard library also has it: itertools.combinations`,
        },
      ],
    },
    {
      id: 'backtracking',
      title: 'Backtracking: choose, explore, un-choose',
      blocks: [
        {
          kind: 'para',
          text: 'Backtracking is recursion over a space of partial solutions. At each step you make a choice, recurse, then undo the choice so the next branch starts clean.',
        },
        {
          kind: 'code',
          language: 'pseudocode',
          caption: 'The template every backtracking problem fits into',
          source: `def backtrack(state):
    if is_complete(state):
        record(state)
        return

    for choice in candidates(state):
        if not is_valid(choice, state):
            continue                 # prune

        apply(choice, state)         # choose
        backtrack(state)             # explore
        undo(choice, state)          # un-choose`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Permutations - a used[] array keeps each element to one position per branch',
          source: `void permute(List<Integer> current, boolean[] used) {
    if (current.size() == n) { output.add(new ArrayList<>(current)); return; }

    for (int i = 0; i < n; i++) {
        if (used[i]) continue;

        used[i] = true; current.add(a[i]);
        permute(current, used);
        current.remove(current.size() - 1); used[i] = false;
    }
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `def permute(current: list[int], used: list[bool]) -> None:
    if len(current) == len(a):
        output.append(current[:])
        return

    for i, value in enumerate(a):
        if used[i]:
            continue

        used[i] = True
        current.append(value)

        permute(current, used)

        current.pop()
        used[i] = False

# the standard library also has it: itertools.permutations`,
        },
        {
          kind: 'table',
          headers: ['Problem', 'The choice at each step', 'Roughly'],
          rows: [
            ['Subsets', 'include this element or not', '`O(2^n)`'],
            ['Permutations', 'which unused element comes next', '`O(n!)`'],
            ['Combinations of size k', 'which index to take next', '`O(C(n,k))`'],
            ['Combination sum', 'which candidate to add, reuse allowed', 'depends on the target'],
            ['N-Queens', 'which column in this row', 'far below `n!` after pruning'],
            ['Word search in a grid', 'which neighbour to step to', '`O(rows * cols * 4^L)`'],
            ['Sudoku', 'which digit in this empty cell', 'tiny after constraint pruning'],
          ],
        },
      ],
    },
    {
      id: 'pruning',
      title: 'Pruning is what makes it finish',
      blocks: [
        {
          kind: 'para',
          text: 'A raw backtracking search is astronomically large. Pruning cuts branches that provably cannot lead to a solution, and it usually decides whether the program runs in milliseconds or never finishes.',
        },
        {
          kind: 'list',
          items: [
            '**Constraint pruning.** Abandon a branch the moment it becomes invalid — a queen already attacked, a digit already used in the row.',
            '**Bound pruning.** If the best possible completion is still worse than a solution you already have, stop.',
            '**Sorting first.** With sorted candidates you can `break` instead of `continue` once a candidate exceeds the remaining target, killing the whole tail.',
            '**Duplicate pruning.** Skip a candidate equal to the previous one at the same depth, so identical branches are explored once.',
          ],
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Combination sum with sorted candidates - two prunes, one line each',
          source: `Arrays.sort(candidates);

void search(int start, int remaining, List<Integer> current) {
    if (remaining == 0) { output.add(new ArrayList<>(current)); return; }

    for (int i = start; i < candidates.length; i++) {
        if (candidates[i] > remaining) break;                  // sorted: all later ones too big
        if (i > start && candidates[i] == candidates[i - 1]) continue;  // skip duplicates

        current.add(candidates[i]);
        search(i + 1, remaining - candidates[i], current);
        current.remove(current.size() - 1);
    }
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `candidates.sort()


def search(start: int, remaining: int, current: list[int]) -> None:
    if remaining == 0:
        output.append(current[:])
        return

    for i in range(start, len(candidates)):
        if candidates[i] > remaining:
            break                                       # sorted: all later ones too big
        if i > start and candidates[i] == candidates[i - 1]:
            continue                                    # skip duplicates

        current.append(candidates[i])
        search(i + 1, remaining - candidates[i], current)
        current.pop()`,
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why `i > start` and not `i > 0`',
          text: 'The condition must skip a duplicate **at the same depth**, not a legitimate reuse deeper in the tree. `i > start` compares against the first candidate considered at this level, which is exactly the right scope.',
        },
      ],
    },
    {
      id: 'to-iteration',
      title: 'Turning recursion into iteration',
      blocks: [
        {
          kind: 'para',
          text: 'When the depth is too large for the call stack, convert to a loop with an explicit stack. The transformation is mechanical: whatever the frame held becomes a record you push.',
        },
        {
          kind: 'compare',
          columns: [
            {
              title: 'Prefer recursion when',
              points: [
                'The structure is naturally recursive: trees, grids, expressions.',
                'The depth is bounded by `log n` or the tree height.',
                'The recursive version is materially clearer.',
              ],
            },
            {
              title: 'Prefer iteration when',
              points: [
                'Depth can reach hundreds of thousands.',
                'The recursion is a simple linear chain — that is just a loop.',
                'You need explicit control over the traversal order.',
              ],
            },
          ],
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Recursive DFS and its iterative twin',
          source: `void dfs(TreeNode node) {                  // recursive
    if (node == null) return;
    visit(node); dfs(node.left); dfs(node.right);
}

void dfsIterative(TreeNode root) {         // explicit stack
    Deque<TreeNode> stack = new ArrayDeque<>();
    if (root != null) stack.push(root);
    while (!stack.isEmpty()) {
        TreeNode node = stack.pop();
        visit(node);
        if (node.right != null) stack.push(node.right);  // right first,
        if (node.left  != null) stack.push(node.left);   // so left pops first
    }
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `def dfs(node: Node | None) -> None:            # recursive
    if node is None:
        return

    visit(node)
    dfs(node.left)
    dfs(node.right)


def dfs_iterative(root: Node | None) -> None:  # explicit stack
    stack = [root] if root else []

    while stack:
        node = stack.pop()
        visit(node)

        if node.right:
            stack.append(node.right)           # right first,
        if node.left:
            stack.append(node.left)            # so left pops first`,
        },
        {
          kind: 'check',
          question: 'Why is the right child pushed before the left one?',
          answer: 'A stack is last-in first-out, so the last thing pushed is processed first. Pushing right then left makes the left subtree pop first, matching the recursive preorder.',
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
            'Can I state the contract in one sentence?',
            'Is there a base case, and does every call move toward it?',
            'Am I copying mutable state when I record a result?',
            'Am I undoing every change after the recursive call returns?',
            'Does the recursion tree contain repeated subproblems? If so, memoise.',
            'What is the maximum depth, and can the stack take it?',
            'What can I prune, and can I justify the pruning?',
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'Recursion is not a trick you apply to some problems; it is how trees, graphs and DP are expressed. Time spent making it feel natural pays back through the entire second half of this curriculum.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'State the contract, write the base case, then trust the recursive call.',
    'Every recursion needs a base case, progress toward it, and affordable depth.',
    'Draw the recursion tree: number of nodes times work per node is the complexity.',
    'Repeated subproblems in the tree are the signal to memoise.',
    'Subsets are include/exclude; permutations track which elements are used.',
    'Backtracking is choose, explore, un-choose — always undo after recursing.',
    'Copy mutable state when recording results, or every answer will be the same object.',
    'Pruning decides whether an exponential search actually terminates.',
  ],
};
