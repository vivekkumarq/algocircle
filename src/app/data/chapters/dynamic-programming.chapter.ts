import { Chapter } from '../../core/models/chapter.models';

export const DYNAMIC_PROGRAMMING: Chapter = {
  slug: 'dynamic-programming',
  title: 'Dynamic Programming',
  shortTitle: 'Dynamic Programming',
  level: 'Advanced',
  order: 19,
  stage: 'dynamic-programming',
  readingMinutes: 40,
  definition: {
    heading: 'What dynamic programming is',
    text:
      '**Dynamic programming** solves a problem by breaking it into overlapping subproblems, solving each one once and reusing the answer. Two things must hold: **optimal substructure** (the best answer is built from best answers to smaller pieces) and **overlapping subproblems** (the same piece is needed again and again). Write it top-down with **memoisation** or bottom-up as a **table** — both compute the same thing.',
  },
  summary:
    'Recursion with memory. Define the state, write the transition, then trade the call stack for a table. Every classic DP — knapsack, LCS, edit distance, LIS — is that same three-step recipe with a different state.',
  objectives: [
    'Identify overlapping subproblems and optimal substructure',
    'Define a DP state precisely and write its transition',
    'Convert a recursion into memoisation, then into tabulation',
    'Reduce a 2D table to one or two rows',
    'Recognise the standard DP families and which one a problem belongs to',
  ],
  prerequisites: ['recursion', 'greedy'],
  sections: [
    {
      id: 'idea',
      title: 'What dynamic programming actually is',
      blocks: [
        {
          kind: 'callout',
          tone: 'note',
          title: 'In plain words',
          text: 'If your code keeps solving the same small problem over and over, write the answer down the first time and look it up afterwards. That single idea is the whole technique; everything else is deciding what to write down.',
        },
        {
          kind: 'para',
          text: 'Dynamic programming is not a category of problems. It is what you do when a recursion solves the same subproblem more than once: you remember the answer instead of recomputing it.',
        },
        {
          kind: 'visual',
          name: 'recursion-tree',
          caption:
            'The repeated calls are exactly what memoisation removes.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'The same function, exponential and linear',
          source: `int fib(int n) {                       // O(2^n)
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

int fib(int n, Integer[] memo) {       // O(n) - one line of difference
    if (n <= 1) return n;
    if (memo[n] != null) return memo[n];
    return memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `def fib(n: int) -> int:                  # O(2^n)
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)


from functools import lru_cache


@lru_cache(maxsize=None)                 # O(n) — one line of difference
def fib_memo(n: int) -> int:
    if n <= 1:
        return n
    return fib_memo(n - 1) + fib_memo(n - 2)`,
        },
        {
          kind: 'diagram',
          caption: 'The tree collapses because every distinct subproblem is computed once.',
          art: `without memo                    with memo

        fib(5)                       fib(5)
       /      \\                     /      \\
   fib(4)    fib(3)             fib(4)    [cached]
   /    \\    /    \\             /    \\
fib(3) fib(2) ...  ...      fib(3)  [cached]
  ...  repeated work           ...  each node once`,
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'Two conditions must hold. **Overlapping subproblems**: the same smaller problem appears repeatedly. **Optimal substructure**: an optimal answer is built from optimal answers to those smaller problems. Without the first, caching gains nothing; without the second, the recurrence is simply wrong.',
        },
      ],
    },
    {
      id: 'recipe',
      title: 'The three-step recipe',
      blocks: [
        {
          kind: 'para',
          text:
            'When people say a DP problem is hard, they almost always mean they could not find the state. Once the state is right, the transition is usually a line of arithmetic and the code writes itself. So spend your time on the first question below, not the last.',
        },
        {
          kind: 'para',
          text:
            'Two words do all the work in this chapter, so it is worth pinning them down before anything else. The **state** is the smallest description of a situation that is enough to decide what to do next — usually an index, sometimes an index and a budget. The **transition** is the rule that builds the answer for one state out of answers to smaller ones. Everything else is bookkeeping.',
        },
        {
          kind: 'steps',
          items: [
            {
              title: 'Define the state',
              text: 'A sentence: "`dp[i][c]` is the best value using the first `i` items with capacity `c`". If you cannot write that sentence, nothing after it will work.',
            },
            {
              title: 'Write the transition',
              text: 'How does this state follow from smaller ones? This is always the list of choices available at this point.',
            },
            {
              title: 'Fix the base cases and the order',
              text: 'The smallest states, answered directly — then iterate so every state is computed after the states it depends on.',
            },
          ],
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'The state is the whole problem',
          text: 'Most DP failures are a state that carries too little information. If two different situations map to the same state but have different answers, the state is incomplete — add the dimension that separates them.',
        },
        {
          kind: 'compare',
          columns: [
            {
              title: 'Top-down (memoisation)',
              points: [
                'Write the recursion, add a cache.',
                'Only reachable states are computed.',
                'Closer to how you think about the problem.',
                'Costs `O(depth)` stack.',
              ],
            },
            {
              title: 'Bottom-up (tabulation)',
              points: [
                'Fill a table in dependency order.',
                'No recursion, no stack risk.',
                'Easier to reduce the space afterwards.',
                'You must work out the iteration order yourself.',
              ],
            },
          ],
        },
        {
          kind: 'para',
          text:
            'Notice what this recipe does not include: any mention of arrays, loops or memoisation. Those are how you store the answers, and you can decide that last. The design is finished the moment you can say what `dp[i]` means in a sentence and how it is built from earlier entries.',
        },
      ],
    },
    {
      id: 'one-d',
      title: '1D DP: one index, a few choices',
      blocks: [
        {
          kind: 'para',
          text: 'The simplest family. The state is a single position, and the transition looks back a fixed number of steps.',
        },
        {
          kind: 'para',
          text:
            'Concretely: to count the ways to climb `n` stairs taking one or two at a time, ask what the last move was. It was either a single step from `n - 1` or a double step from `n - 2`, and those two groups share nothing, so the totals add. That sentence — "the last move was either this or that" — is the transition, and writing it down is the whole design.',
        },
        {
          kind: 'figure',
          height: 172,
          label: 'A one-dimensional table where each cell sums the two before it',
          caption: 'One index, a handful of choices, and every earlier answer already computed.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">Each cell is decided by a couple of cells behind it</text>
<rect x="40" y="40" width="68" height="44" rx="4" class="dg-box" />
<text x="74" y="66.5" class="dg-t" text-anchor="middle">1</text>
<text x="74" y="98" class="dg-s" text-anchor="middle">0</text>
<rect x="116" y="40" width="68" height="44" rx="4" class="dg-box" />
<text x="150" y="66.5" class="dg-t" text-anchor="middle">1</text>
<text x="150" y="98" class="dg-s" text-anchor="middle">1</text>
<rect x="192" y="40" width="68" height="44" rx="4" class="dg-box" />
<text x="226" y="66.5" class="dg-t" text-anchor="middle">2</text>
<text x="226" y="98" class="dg-s" text-anchor="middle">2</text>
<rect x="268" y="40" width="68" height="44" rx="4" class="dg-box" />
<text x="302" y="66.5" class="dg-t" text-anchor="middle">3</text>
<text x="302" y="98" class="dg-s" text-anchor="middle">3</text>
<rect x="344" y="40" width="68" height="44" rx="4" class="dg-fill" />
<text x="378" y="66.5" class="dg-t" text-anchor="middle">5</text>
<text x="378" y="98" class="dg-s" text-anchor="middle">4</text>
<rect x="420" y="40" width="68" height="44" rx="4" class="dg-fill" />
<text x="454" y="66.5" class="dg-t" text-anchor="middle">8</text>
<text x="454" y="98" class="dg-s" text-anchor="middle">5</text>
<rect x="496" y="40" width="68" height="44" rx="4" class="dg-fill2" />
<text x="530" y="66.5" class="dg-on" text-anchor="middle">?</text>
<text x="530" y="98" class="dg-s" text-anchor="middle">6</text>
<path class="dg-line" marker-end="url(#ah)" d="M378 40 Q462 10 546 40" />
<path class="dg-line" marker-end="url(#ah)" d="M452 40 Q499 20 546 40" />
<text x="460" y="8" class="dg-m" text-anchor="middle">dp[i] = dp[i-1] + dp[i-2]</text>
<text x="300" y="130" class="dg-s" text-anchor="middle">the whole design is one sentence: what does dp[i] mean?</text>
<text x="0" y="160" class="dg-s" text-anchor="start">get the meaning right and the recurrence usually writes itself</text>`,
        },
        {
          kind: 'para',
          text:
            'The reason this is fast is worth seeing plainly. Solving it by recursion recomputes the same stair count over and over, an exponential amount of repeated work. The table computes each entry once and reads it back in constant time afterwards, which turns the same idea into a single pass.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Climbing stairs - dp[i] is the number of ways to reach step i',
          source: `dp[0] = 1; dp[1] = 1;
for (int i = 2; i <= n; i++)
    dp[i] = dp[i - 1] + dp[i - 2];      // arrive from one step or two below`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `dp = [0] * (n + 1)
dp[0] = dp[1] = 1

for i in range(2, n + 1):
    dp[i] = dp[i - 1] + dp[i - 2]        # arrive from one step or two below`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'House robber - dp[i] is the best total from the first i houses',
          source: `int take = 0, skip = 0;                 // already space-optimised
for (int value : houses) {
    int newTake = skip + value;         // rob this one, so skip the previous
    skip = Math.max(skip, take);        // do not rob this one
    take = newTake;
}
return Math.max(take, skip);`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `take = skip = 0                          # already space-optimised

for value in houses:
    new_take = skip + value              # rob this one, so skip the previous
    skip = max(skip, take)               # do not rob this one
    take = new_take

return max(take, skip)`,
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why two variables suffice',
          text: 'The transition only reads `dp[i-1]` and `dp[i-2]`. Anything older can be discarded, so an array of `n` becomes two integers. Ask this question of every DP: how far back does the transition actually look?',
        },
        {
          kind: 'para',
          text:
            'Once you recognise the shape, a surprising number of problems are the same table with a different question at each cell: maximum instead of count, "can I reach this" instead of "how many ways", a decision recorded alongside the value. The loop never changes.',
        },
      ],
    },
    {
      id: 'two-d',
      title: '2D DP: grids and pairs',
      blocks: [
        {
          kind: 'para',
          text: 'When the state needs two coordinates — a position in a grid, or an index into each of two sequences — the table becomes two-dimensional and the transition reads its neighbours.',
        },
        {
          kind: 'para',
          text:
            'A second index appears when one number is no longer enough to describe where you are. Walking a grid, you need both the row and the column. Comparing two strings, you need how far you have read into each. The test is simple: if you can imagine two different situations that share the same value of your index but need different answers, the state is missing something.',
        },
        {
          kind: 'visual',
          name: 'dp-table',
          caption:
            'The table filling in, one cell at a time. Amber cells are the ones the current cell reads from.',
        },
        {
          kind: 'para',
          text:
            'The cost follows directly from the shape. One index over `n` values with a constant amount of work per cell is `O(n)`; two indices is `O(n · m)` cells, and if the transition itself has to scan, multiply again. This is why adding a dimension is never free, and why so much of the craft is finding the smallest state that still works.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Unique paths in a grid, moving only right or down',
          source: `for (int r = 0; r < rows; r++)
    for (int c = 0; c < cols; c++)
        dp[r][c] = (r == 0 || c == 0) ? 1 : dp[r - 1][c] + dp[r][c - 1];`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `for r in range(rows):
    for c in range(cols):
        dp[r][c] = 1 if r == 0 or c == 0 else dp[r - 1][c] + dp[r][c - 1]`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Minimum path sum - the same shape with min instead of sum',
          source: `dp[r][c] = grid[r][c] + Math.min(
    r > 0 ? dp[r - 1][c] : INF,
    c > 0 ? dp[r][c - 1] : INF
);`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `dp[r][c] = grid[r][c] + min(
    dp[r - 1][c] if r > 0 else INF,
    dp[r][c - 1] if c > 0 else INF,
)`,
        },
        {
          kind: 'callout',
          tone: 'note',
          text: 'A grid DP that reads only the row above can be reduced to a single row, updated in place. That is the standard `O(n * m)` time, `O(m)` space optimisation.',
        },
      ],
    },
    {
      id: 'knapsack',
      title: 'The knapsack family',
      blocks: [
        {
          kind: 'para',
          text: 'A huge number of problems are a knapsack wearing different clothes. The state is "index, capacity" and the transition is "take it or skip it".',
        },
        {
          kind: 'para',
          text:
            'Here is the reasoning in full, because every knapsack variant repeats it. Consider the last item. Either you leave it, and the best you can do is whatever you could manage with the earlier items and the same capacity; or you take it, which costs its weight and leaves you the best you could manage with the earlier items and a smaller capacity. Those are the only two possibilities, so the answer is the better of them.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: '0/1 knapsack - each item used at most once',
          source: `for (int i = 1; i <= n; i++)
    for (int c = 0; c <= capacity; c++) {
        dp[i][c] = dp[i - 1][c];                                     // skip
        if (weight[i - 1] <= c)
            dp[i][c] = Math.max(dp[i][c],
                                value[i - 1] + dp[i - 1][c - weight[i - 1]]);  // take
    }`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `for i in range(1, n + 1):
    for c in range(capacity + 1):
        dp[i][c] = dp[i - 1][c]                                   # skip

        if weight[i - 1] <= c:
            dp[i][c] = max(dp[i][c],
                           value[i - 1] + dp[i - 1][c - weight[i - 1]])   # take`,
        },
        {
          kind: 'para',
          text:
            'Both branches refer to *earlier items*, which is exactly why the table has a row per item: each row is allowed to look only at the row above it. That restriction is what makes the whole thing terminate.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Space-optimised: one row, iterated backwards',
          source: `for (int i = 0; i < n; i++)
    for (int c = capacity; c >= weight[i]; c--)     // backwards!
        dp[c] = Math.max(dp[c], value[i] + dp[c - weight[i]]);`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `for w, v in zip(weight, value):
    for c in range(capacity, w - 1, -1):       # backwards!
        dp[c] = max(dp[c], v + dp[c - w])`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'The direction of the inner loop decides the variant',
          text: 'Iterating capacity **downwards** means each item is used at most once (0/1). Iterating **upwards** lets an item be reused, giving the unbounded knapsack. One character changes the problem being solved.',
        },
        {
          kind: 'table',
          headers: ['Problem', 'It is really'],
          rows: [
            ['Subset sum', '0/1 knapsack with a boolean table'],
            ['Partition into two equal halves', 'subset sum for `total / 2`'],
            ['Target sum with plus and minus signs', 'subset sum after rearranging'],
            ['Coin change, minimum coins', 'unbounded knapsack taking a minimum'],
            ['Coin change, number of ways', 'unbounded knapsack counting'],
            ['Rod cutting', 'unbounded knapsack'],
            ['Last stone weight II', 'partition into two closest halves'],
          ],
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Counting versus optimising',
          text: 'For **ways**, loop coins on the outside and amounts inside — otherwise permutations are counted as distinct combinations. For **minimum coins**, either order works. Getting this wrong is the classic coin-change bug.',
        },
        {
          kind: 'para',
          text:
            'The variants below look different mainly because they hide the capacity. "Can this set be split into two equal halves" is a knapsack where the capacity is half the total and the value of every item is its weight. "How many subsets sum to a target" is the same table with addition instead of a maximum. Once you spot the capacity, you have spotted the problem.',
        },
      ],
    },
    {
      id: 'strings',
      title: 'String DP',
      blocks: [
        {
          kind: 'para',
          text: 'Two strings, two indices, and a transition that asks whether the current characters match. Almost every string DP is this.',
        },
        {
          kind: 'para',
          text:
            'Two strings mean a grid, and the grid has a natural meaning: the cell at row `i`, column `j` is the answer for the first `i` characters of one string against the first `j` characters of the other. Filling it left to right, top to bottom guarantees that whenever you look at a neighbouring cell, it has already been computed.',
        },
        {
          kind: 'visual',
          name: 'dp-table',
          caption:
            'Switch to the LCS mode and watch how only the transition changes, not the shape.',
        },
        {
          kind: 'para',
          text:
            'Every problem in this family turns on one comparison. When the two current characters match, the answer usually comes straight from the diagonal — the pair is consumed and you fall back to the smaller problem behind it. When they differ, you consider dropping a character from one side or the other, which is the cell above and the cell to the left. Match reads diagonally, mismatch reads sideways; that is the entire pattern.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Longest common subsequence',
          source: `for (int i = 1; i <= n; i++)
    for (int j = 1; j <= m; j++)
        dp[i][j] = (a.charAt(i - 1) == b.charAt(j - 1))
            ? dp[i - 1][j - 1] + 1                              // characters match
            : Math.max(dp[i - 1][j], dp[i][j - 1]);             // drop one side`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `for i in range(1, n + 1):
    for j in range(1, m + 1):
        if a[i - 1] == b[j - 1]:
            dp[i][j] = dp[i - 1][j - 1] + 1              # characters match
        else:
            dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])   # drop one side`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Edit distance - three operations, three predecessors',
          source: `dp[i][j] = (a.charAt(i - 1) == b.charAt(j - 1))
    ? dp[i - 1][j - 1]
    : 1 + Math.min(dp[i - 1][j - 1],          // replace
             Math.min(dp[i - 1][j],           // delete
                      dp[i][j - 1]));         // insert`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `if a[i - 1] == b[j - 1]:
    dp[i][j] = dp[i - 1][j - 1]
else:
    dp[i][j] = 1 + min(
        dp[i - 1][j - 1],       # replace
        dp[i - 1][j],           # delete
        dp[i][j - 1],           # insert
    )`,
        },
        {
          kind: 'diagram',
          caption: 'Each cell reads three neighbours: above, left and diagonal.',
          art: `        ""  h   o   r   s   e
    "" [0] [1] [2] [3] [4] [5]
    r  [1] [1] [2] [2] [3] [4]
    o  [2] [2] [1] [2] [3] [4]
    s  [3] [3] [2] [2] [2] [3]

edit distance("ros", "horse") = 3`,
        },
        {
          kind: 'table',
          headers: ['Problem', 'Relationship'],
          rows: [
            ['Longest common substring', 'LCS but reset to 0 on a mismatch'],
            ['Shortest common supersequence', '`n + m - LCS`'],
            ['Longest palindromic subsequence', 'LCS of the string and its reverse'],
            ['Minimum insertions to make a palindrome', '`n` minus the longest palindromic subsequence'],
            ['Distinct subsequences', 'counting variant of the same table'],
            ['Wildcard and regex matching', 'the same grid with pattern-specific transitions'],
          ],
        },
      ],
    },
    {
      id: 'lis',
      title: 'Longest increasing subsequence',
      blocks: [
        {
          kind: 'para',
          text:
            'The longest increasing subsequence is the standard example of a problem with two different DP solutions, and the gap between them is instructive. The obvious one asks, for each position, what is the longest increasing run that ends here — which means looking back at every earlier element to see which ones you could have extended. That is `O(n^2)`, and for a few thousand elements it is perfectly fine.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'The O(n^2) version - dp[i] is the best subsequence ending at i',
          source: `Arrays.fill(dp, 1);
for (int i = 0; i < n; i++)
    for (int j = 0; j < i; j++)
        if (a[j] < a[i]) dp[i] = Math.max(dp[i], dp[j] + 1);`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `dp = [1] * n

for i in range(n):
    for j in range(i):
        if a[j] < a[i]:
            dp[i] = max(dp[i], dp[j] + 1)`,
        },
        {
          kind: 'para',
          text:
            'The faster one changes the question. Instead of tracking the best run ending at each position, track the smallest value that any run of a given length could end on. That list is always sorted, which means a new value can find its place by binary search rather than by scanning, and the whole thing drops to `O(n log n)`.',
        },
        {
          kind: 'figure',
          height: 236,
          label: 'An input row feeding a tails row that tracks the best ending value per length',
          caption: 'tails is not the subsequence — it is the best possible ending for each length.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">tails[k] is the smallest value any run of length k + 1 can end on</text>
<text x="20" y="56" class="dg-m" text-anchor="start">input</text>
<rect x="90" y="34" width="56" height="38" rx="4" class="dg-box" />
<text x="118" y="57.5" class="dg-t" text-anchor="middle">3</text>
<rect x="152" y="34" width="56" height="38" rx="4" class="dg-box" />
<text x="180" y="57.5" class="dg-t" text-anchor="middle">1</text>
<rect x="214" y="34" width="56" height="38" rx="4" class="dg-box" />
<text x="242" y="57.5" class="dg-t" text-anchor="middle">4</text>
<rect x="276" y="34" width="56" height="38" rx="4" class="dg-box" />
<text x="304" y="57.5" class="dg-t" text-anchor="middle">1</text>
<rect x="338" y="34" width="56" height="38" rx="4" class="dg-fill2" />
<text x="366" y="57.5" class="dg-on" text-anchor="middle">5</text>
<path class="dg-line" marker-end="url(#ah)" d="M300 96 L300 122" />
<text x="20" y="152" class="dg-m" text-anchor="start">tails</text>
<rect x="90" y="130" width="56" height="38" rx="4" class="dg-box" />
<text x="118" y="153.5" class="dg-t" text-anchor="middle">1</text>
<rect x="152" y="130" width="56" height="38" rx="4" class="dg-box" />
<text x="180" y="153.5" class="dg-t" text-anchor="middle">4</text>
<rect x="214" y="130" width="56" height="38" rx="4" class="dg-fill" />
<text x="242" y="153.5" class="dg-t" text-anchor="middle">5</text>
<text x="300" y="156" class="dg-s" text-anchor="start">length of the longest run so far = 3</text>
<text x="300" y="196" class="dg-s" text-anchor="middle">a smaller tail never shortens the answer, and it leaves more room later</text>
<text x="0" y="224" class="dg-s" text-anchor="start">binary search for the slot, so the whole scan is O(n log n)</text>`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'The O(n log n) version - tails[k] is the smallest possible tail of a length-k+1 subsequence',
          source: `List<Integer> tails = new ArrayList<>();
for (int value : a) {
    int position = lowerBound(tails, value);
    if (position == tails.size()) tails.add(value);
    else                          tails.set(position, value);
}
return tails.size();`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `from bisect import bisect_left

tails: list[int] = []

for value in a:
    position = bisect_left(tails, value)

    if position == len(tails):
        tails.append(value)
    else:
        tails[position] = value

return len(tails)`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: '`tails` is **not** a valid increasing subsequence — only its length is meaningful. Reconstructing the actual subsequence needs an extra array of predecessor indices.',
        },
        {
          kind: 'para',
          text:
            'One warning that catches everyone: the `tails` array is not the answer. Its length is correct, but its contents are usually not an actual increasing subsequence from the input. If a problem asks you to print the subsequence and not merely measure it, keep a parent pointer per element and walk it back at the end.',
        },
        {
          kind: 'callout',
          tone: 'why',
          text: 'Keeping the smallest possible tail for each length leaves the most room for future elements — the same reasoning as "earliest finish" in greedy interval scheduling. Binary search then finds where each value belongs.',
        },
      ],
    },
    {
      id: 'families',
      title: 'The advanced families',
      blocks: [
        {
          kind: 'para',
          text:
            'Beyond the two shapes above, the named families are mostly variations on what the state holds. They look intimidating in a list, so read the table as one question repeated: what is the smallest thing I must remember, and in what order can I fill it so that everything I read is already finished?',
        },
        {
          kind: 'table',
          headers: ['Family', 'State', 'Typical problems'],
          rows: [
            ['Interval DP', '`dp[i][j]` over a range', 'matrix chain multiplication, burst balloons, palindrome partitioning'],
            ['Tree DP', '`dp[node][state]`', 'house robber on a tree, tree diameter, independent set'],
            ['Bitmask DP', '`dp[mask][i]`', 'travelling salesman, assignment, `n` up to about 20'],
            ['Digit DP', '`dp[position][tight][state]`', 'counting numbers with a digit property up to N'],
            ['State-machine DP', '`dp[i][holding][transactions]`', 'stock buy and sell variants'],
            ['DP on a DAG', 'topological order', 'longest path, counting paths'],
            ['DP with binary search', 'monotone state', 'LIS, job scheduling with weights'],
          ],
        },
        {
          kind: 'para',
          text:
            'Two of them carry a rule that is easy to get wrong. Interval DP must be filled by increasing length, because a range of length five is built from shorter ranges inside it — iterating by starting index instead will read cells that are still empty. Bitmask DP is only viable while `2^n` is small, which in practice means `n` no more than about twenty; past that the table stops fitting in memory long before it stops fitting in time.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Interval DP - always iterate by increasing length',
          source: `for (int length = 2; length <= n; length++)
    for (int i = 0; i + length - 1 < n; i++) {
        int j = i + length - 1;
        for (int k = i; k < j; k++)
            dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k + 1][j] + cost(i, k, j));
    }`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `for length in range(2, n + 1):           # always iterate by increasing length
    for i in range(n - length + 1):
        j = i + length - 1

        for k in range(i, j):
            dp[i][j] = min(dp[i][j], dp[i][k] + dp[k + 1][j] + cost(i, k, j))`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'State machine - best profit with at most one holding at a time',
          source: `int cash = 0, hold = Integer.MIN_VALUE;
for (int price : prices) {
    cash = Math.max(cash, hold + price);    // sell today
    hold = Math.max(hold, cash - price);    // buy today
}
return cash;`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `cash, hold = 0, float('-inf')

for price in prices:
    cash = max(cash, hold + price)       # sell today
    hold = max(hold, cash - price)       # buy today

return cash`,
        },
        {
          kind: 'callout',
          tone: 'note',
          text: 'Interval DP must iterate by length so that shorter intervals are already computed. Tree DP recurses naturally, since children finish before parents. Getting the order right is the only thing tabulation adds over memoisation.',
        },
      ],
    },
    {
      id: 'space',
      title: 'Reducing the space',
      blocks: [
        {
          kind: 'para',
          text:
            'Most DP tables are far larger than they need to be. If the transition only ever reads the previous row, there is no reason to keep every earlier row alive — two rows will do, and often a single row that you overwrite as you go. That turns `O(n · m)` memory into `O(m)` without changing the answer or the running time.',
        },
        {
          kind: 'steps',
          items: [
            {
              title: 'Ask how far back the transition reads',
              text: 'Only the previous row? Only two cells? That bounds what you must keep.',
            },
            {
              title: 'Keep only that much',
              text: 'Two rows, one row, or a couple of variables.',
            },
            {
              title: 'Check the iteration direction',
              text: 'Updating a row in place is fine only when the values you overwrite are no longer needed. This is exactly the knapsack backwards loop.',
            },
          ],
        },
        {
          kind: 'para',
          text:
            'The catch is direction, and it is the most common bug in this chapter. Overwriting a row in place means some of the values you read have already been updated this round. For a 0/1 knapsack that is wrong — an item would be used twice — so the capacity loop runs backwards. For an unbounded knapsack reusing the item is exactly what you want, so the same loop runs forwards. One character, two different problems.',
        },
        {
          kind: 'table',
          headers: ['Original', 'Reduced', 'Condition'],
          rows: [
            ['`O(n)`', '`O(1)`', 'the transition reads a fixed number of previous cells'],
            ['`O(n * m)`', '`O(m)`', 'the transition reads only the previous row'],
            ['`O(n * m)`', '`O(min(n, m))`', 'iterate over the shorter dimension'],
          ],
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'Space optimisation destroys the information needed to **reconstruct** the answer. If the problem asks for the actual subsequence or path rather than its length, keep the full table or store predecessors.',
        },
        {
          kind: 'para',
          text:
            'Do this last, and only when memory actually matters. A compressed table is harder to debug and impossible to trace back through, so if you also need to recover which choices were made, keep the full grid.',
        },
      ],
    },
    {
      id: 'method',
      title: 'A method, and how to talk about it',
      blocks: [
        {
          kind: 'para',
          text:
            'When a DP problem will not open up, the fault is nearly always that you are trying to write the loop before you have decided what a cell means. The order below is deliberately slow at the start: it spends four steps on the design and only then reaches for code.',
        },
        {
          kind: 'steps',
          items: [
            { title: 'Solve it by brute-force recursion', text: 'Enumerate the choices at each step, ignoring efficiency.' },
            { title: 'Spot the repeated subproblems', text: 'Which arguments actually vary? Those are your state.' },
            { title: 'Memoise', text: 'Add a cache keyed on exactly those arguments. You are now polynomial.' },
            { title: 'Tabulate if useful', text: 'Rewrite as a loop in dependency order to remove the stack.' },
            { title: 'Optimise the space', text: 'Keep only what the transition reads.' },
          ],
        },
        {
          kind: 'para',
          text:
            'Write the recursion first, even if you never ship it. A plain recursive function with no table is usually easy to get right, because it only has to express the decision. Once it produces correct answers on a small input, adding memoisation is mechanical, and converting that to a bottom-up table is mechanical again. Going straight to the table is what makes people stare at a blank screen.',
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'In an interview, say the state out loud before writing code: "`dp[i][j]` is the edit distance between the first `i` characters of A and the first `j` of B". Interviewers are assessing whether you can define the state — the loops are mechanical afterwards.',
        },
        {
          kind: 'para',
          text:
            'If you are stuck, the fastest diagnostic is to compute a tiny case by hand — four or five elements — and write down the table as you fill it. Either you will see the rule, or you will discover that two different situations landed in the same cell, which means the state is missing a dimension.',
        },
        {
          kind: 'check',
          question: 'Your memoised solution is still too slow. What is usually wrong?',
          answer: 'The state has too many dimensions, or a dimension with too large a range. Count the states and multiply by the work per transition — if that exceeds the budget the constraints allow, the state needs rethinking, not micro-optimising.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'DP is recursion plus memory: it applies when subproblems overlap and substructure is optimal.',
    'Define the state in one sentence, write the transition, fix the base cases and the order.',
    'Most failures are an incomplete state, not a wrong loop.',
    'Memoisation is the recursion with a cache; tabulation is the same thing in dependency order.',
    'Knapsack is "take or skip"; the inner-loop direction decides 0/1 versus unbounded.',
    'String DP compares two indices and asks whether the characters match.',
    'LIS keeps the smallest tail per length, which is why binary search applies.',
    'Space reduction follows from how far back the transition reads — but it costs reconstruction.',
  ],
};
