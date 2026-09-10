import { Chapter } from '../../core/models/chapter.models';

export const DYNAMIC_PROGRAMMING: Chapter = {
  slug: 'dynamic-programming',
  title: 'Dynamic Programming',
  shortTitle: 'Dynamic Programming',
  level: 'Advanced',
  order: 19,
  stage: 'dynamic-programming',
  readingMinutes: 40,
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
          kind: 'para',
          text: 'Dynamic programming is not a category of problems. It is what you do when a recursion solves the same subproblem more than once: you remember the answer instead of recomputing it.',
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
          kind: 'code',
          language: 'java',
          caption: 'Climbing stairs - dp[i] is the number of ways to reach step i',
          source: `dp[0] = 1; dp[1] = 1;
for (int i = 2; i <= n; i++)
    dp[i] = dp[i - 1] + dp[i - 2];      // arrive from one step or two below`,
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
          kind: 'callout',
          tone: 'why',
          title: 'Why two variables suffice',
          text: 'The transition only reads `dp[i-1]` and `dp[i-2]`. Anything older can be discarded, so an array of `n` becomes two integers. Ask this question of every DP: how far back does the transition actually look?',
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
          kind: 'code',
          language: 'java',
          caption: 'Unique paths in a grid, moving only right or down',
          source: `for (int r = 0; r < rows; r++)
    for (int c = 0; c < cols; c++)
        dp[r][c] = (r == 0 || c == 0) ? 1 : dp[r - 1][c] + dp[r][c - 1];`,
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
          language: 'java',
          caption: 'Space-optimised: one row, iterated backwards',
          source: `for (int i = 0; i < n; i++)
    for (int c = capacity; c >= weight[i]; c--)     // backwards!
        dp[c] = Math.max(dp[c], value[i] + dp[c - weight[i]]);`,
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
          language: 'java',
          caption: 'Edit distance - three operations, three predecessors',
          source: `dp[i][j] = (a.charAt(i - 1) == b.charAt(j - 1))
    ? dp[i - 1][j - 1]
    : 1 + Math.min(dp[i - 1][j - 1],          // replace
             Math.min(dp[i - 1][j],           // delete
                      dp[i][j - 1]));         // insert`,
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
          kind: 'callout',
          tone: 'trap',
          text: '`tails` is **not** a valid increasing subsequence — only its length is meaningful. Reconstructing the actual subsequence needs an extra array of predecessor indices.',
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
      ],
    },
    {
      id: 'method',
      title: 'A method, and how to talk about it',
      blocks: [
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
          kind: 'callout',
          tone: 'key',
          text: 'In an interview, say the state out loud before writing code: "`dp[i][j]` is the edit distance between the first `i` characters of A and the first `j` of B". Interviewers are assessing whether you can define the state — the loops are mechanical afterwards.',
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
