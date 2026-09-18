import { WorkedProblem } from './problem.model';

export const ADVANCED_PROBLEMS: WorkedProblem[] = [
  // ------------------------------------------------------------------- graphs
  {
    slug: 'number-of-islands',
    title: 'Count the islands',
    topic: 'graphs',
    pattern: 'dfs',
    difficulty: 'Medium',
    statement: 'A grid contains land and water cells. Count the connected regions of land, where cells connect horizontally and vertically.',
    example: { input: 'a 4x5 grid with two separate land regions', output: '2' },
    hints: [
      'A grid is a graph. What is a vertex and what is an edge?',
      'How many traversals will you start in total?',
      'How do you avoid counting the same region twice?',
    ],
    bruteForce: { idea: 'Compare every land cell with every other and union the touching ones by hand.', complexity: 'O((rows·cols)²)' },
    optimal: {
      idea: 'Scan the grid; every time you meet unvisited land, start a traversal that sinks the whole region and add one to the count. Each cell is visited once.',
      complexity: 'O(rows · cols) time and space',
      language: 'java',
      code: `private static final int[] DR = { -1, 1, 0, 0 };
private static final int[] DC = { 0, 0, -1, 1 };

int numIslands(char[][] grid) {
    int islands = 0;

    for (int r = 0; r < grid.length; r++) {
        for (int c = 0; c < grid[0].length; c++) {
            if (grid[r][c] == '1') {
                islands++;
                sink(grid, r, c);      // one traversal consumes exactly one island
            }
        }
    }
    return islands;
}

private void sink(char[][] grid, int r, int c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return;
    if (grid[r][c] != '1') return;

    grid[r][c] = '0';                  // mark visited in place, no separate set
    for (int d = 0; d < 4; d++) sink(grid, r + DR[d], c + DC[d]);
}`,
    },
    insight: 'Marking in place saves a visited array, but mutates the input. If that is not allowed, say so and use a separate boolean grid.',
  },
  {
    slug: 'course-schedule',
    title: 'Can every course be finished?',
    topic: 'graphs',
    pattern: 'topological-sort',
    difficulty: 'Medium',
    statement: 'Courses have prerequisites. Decide whether an order exists that lets every course be taken, and produce one.',
    example: { input: '4 courses, prerequisites [[1,0],[2,1],[3,2]]', output: '[0, 1, 2, 3]' },
    hints: [
      'Prerequisites form a directed graph. What makes an order impossible?',
      'Which course can always be taken first?',
      'After taking it, what changes for its dependents?',
      'How do you detect that you got stuck?',
    ],
    bruteForce: { idea: 'Try orderings and check each for validity.', complexity: 'O(n!)' },
    optimal: {
      idea: "Kahn's algorithm: queue every course with no remaining prerequisites, take one, and decrement its dependents. Producing fewer than `n` courses means a cycle exists.",
      complexity: 'O(V + E) time, O(V) space',
      language: 'java',
      code: `int[] findOrder(int n, int[][] prerequisites) {
    List<List<Integer>> next = new ArrayList<>();
    for (int i = 0; i < n; i++) next.add(new ArrayList<>());

    int[] indegree = new int[n];
    for (int[] pair : prerequisites) {
        next.get(pair[1]).add(pair[0]);    // pair = { course, needs }: needs -> course
        indegree[pair[0]]++;
    }

    Queue<Integer> ready = new ArrayDeque<>();
    for (int v = 0; v < n; v++) {
        if (indegree[v] == 0) ready.add(v);
    }

    int[] order = new int[n];
    int placed = 0;

    while (!ready.isEmpty()) {
        int node = ready.poll();
        order[placed++] = node;

        for (int successor : next.get(node)) {
            if (--indegree[successor] == 0) ready.add(successor);
        }
    }

    return placed == n ? order : new int[0];   // fewer than n means a cycle
}`,
    },
    insight: 'The final size check is not bookkeeping — it is the cycle detector. Courses that never reach in-degree zero are stuck in a loop.',
  },
  {
    slug: 'network-delay',
    title: 'Time for a signal to reach everyone',
    topic: 'graphs',
    pattern: 'bfs',
    difficulty: 'Medium',
    statement: 'A signal starts at one node in a weighted directed graph. Find how long until every node receives it, or report that some never will.',
    example: { input: 'edges [[2,1,1],[2,3,1],[3,4,1]], start 2', output: '2' },
    hints: [
      'Edges have different weights, so plain BFS is wrong.',
      'Which node can be finalised at each step?',
      'The answer is not the sum of distances.',
    ],
    bruteForce: { idea: 'Try every path to every node.', complexity: 'exponential' },
    optimal: {
      idea: 'Dijkstra from the source. The answer is the largest finite distance; if any node is unreachable, return -1.',
      complexity: 'O((V + E) log V) time, O(V) space',
      language: 'java',
      code: `int networkDelayTime(int[][] times, int n, int source) {
    List<List<int[]>> adjacency = new ArrayList<>();
    for (int i = 0; i <= n; i++) adjacency.add(new ArrayList<>());
    for (int[] t : times) adjacency.get(t[0]).add(new int[] { t[1], t[2] });

    long[] dist = new long[n + 1];
    Arrays.fill(dist, Long.MAX_VALUE);
    dist[source] = 0;

    PriorityQueue<long[]> heap = new PriorityQueue<>(Comparator.comparingLong(x -> x[1]));
    heap.offer(new long[] { source, 0 });

    while (!heap.isEmpty()) {
        long[] top = heap.poll();
        int node = (int) top[0];
        if (top[1] > dist[node]) continue;              // stale entry, already improved

        for (int[] edge : adjacency.get(node)) {
            long candidate = dist[node] + edge[1];

            if (candidate < dist[edge[0]]) {
                dist[edge[0]] = candidate;
                heap.offer(new long[] { edge[0], candidate });
            }
        }
    }

    long slowest = 0;
    for (int v = 1; v <= n; v++) {
        if (dist[v] == Long.MAX_VALUE) return -1;       // someone never hears the signal
        slowest = Math.max(slowest, dist[v]);
    }
    return (int) slowest;
}`,
    },
    insight: 'Skipping stale heap entries with one `continue` is cheaper and simpler than trying to decrease keys, and standard heaps do not support decrease-key anyway.',
  },
  {
    slug: 'word-ladder',
    title: 'Shortest word transformation',
    topic: 'graphs',
    pattern: 'bfs',
    difficulty: 'Hard',
    statement: 'Change one letter at a time, with every intermediate word appearing in a given dictionary, and find the fewest steps from one word to another.',
    example: { input: 'hit -> cog, words {hot, dot, dog, lot, log, cog}', output: '5' },
    hints: [
      'Nothing here looks like a graph. What would a vertex be?',
      'What connects two vertices?',
      'Every edge costs the same — which algorithm does that suggest?',
      'Comparing every pair of words is expensive; can you bucket them instead?',
    ],
    bruteForce: { idea: 'Explore every transformation sequence with DFS and keep the shortest.', complexity: 'exponential' },
    optimal: {
      idea: 'BFS over a graph whose vertices are words and whose edges join words differing in one letter. Wildcard buckets like `h*t` avoid comparing every pair.',
      complexity: 'O(words · length · alphabet) time',
      language: 'java',
      code: `int ladderLength(String begin, String end, List<String> wordList) {
    Set<String> words = new HashSet<>(wordList);
    if (!words.contains(end)) return 0;

    Queue<String> queue = new ArrayDeque<>(List.of(begin));
    Map<String, Integer> steps = new HashMap<>(Map.of(begin, 1));

    while (!queue.isEmpty()) {
        String word = queue.poll();
        if (word.equals(end)) return steps.get(word);

        char[] letters = word.toCharArray();

        for (int i = 0; i < letters.length; i++) {
            char original = letters[i];

            for (char c = 'a'; c <= 'z'; c++) {         // 26 * length neighbours
                if (c == original) continue;
                letters[i] = c;

                String next = new String(letters);
                if (words.contains(next) && !steps.containsKey(next)) {
                    steps.put(next, steps.get(word) + 1);
                    queue.add(next);
                }
            }
            letters[i] = original;
        }
    }
    return 0;                                           // end is unreachable
}`,
    },
    insight: 'The modelling was the whole problem. Once each word is a vertex and edges cost the same, the algorithm is BFS, which you already knew.',
  },

  // ------------------------------------------------------------------- greedy
  {
    slug: 'non-overlapping-intervals',
    title: 'Fewest intervals to remove',
    topic: 'greedy',
    pattern: 'merge-intervals',
    difficulty: 'Medium',
    statement: 'Remove the minimum number of intervals so that none of the remaining ones overlap.',
    example: { input: '[[1,2],[2,3],[3,4],[1,3]]', output: '1' },
    hints: [
      'Minimising removals is the same as maximising what you keep.',
      'Which interval should you always keep first?',
      'Sort by end, not by start — why?',
    ],
    bruteForce: { idea: 'Try every subset and check whether it is conflict-free.', complexity: 'O(2ⁿ)' },
    optimal: {
      idea: 'Sort by end time and greedily keep any interval starting at or after the last kept end. The answer is `n` minus what you kept.',
      complexity: 'O(n log n) time, O(1) space',
      language: 'java',
      code: `int eraseOverlapIntervals(int[][] intervals) {
    if (intervals.length == 0) return 0;

    // Earliest finishing time first: it leaves the most room for whatever follows.
    Arrays.sort(intervals, Comparator.comparingInt(x -> x[1]));

    int kept = 0, lastEnd = Integer.MIN_VALUE;

    for (int[] interval : intervals) {
        if (interval[0] >= lastEnd) {
            kept++;
            lastEnd = interval[1];
        }
    }
    return intervals.length - kept;
}`,
    },
    insight: 'Finishing earliest leaves the most room for everything after it. That exchange argument is what makes the greedy provably optimal, and it is what to say out loud.',
  },
  {
    slug: 'gas-station',
    title: 'Complete the circuit',
    topic: 'greedy',
    pattern: 'greedy',
    difficulty: 'Medium',
    statement: 'Stations around a circular route each supply some fuel and cost some to reach the next. Find a starting station from which the loop can be completed, or report that none exists.',
    example: { input: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]', output: '3' },
    hints: [
      'When is a solution possible at all, regardless of where you start?',
      'If you run dry between i and j, what do you know about every station in between?',
      'That lets you skip a whole range instead of retrying each one.',
    ],
    bruteForce: { idea: 'Try each station as a start and simulate the full loop.', complexity: 'O(n²)' },
    optimal: {
      idea: 'One pass. If the total gain is non-negative a solution exists. Whenever the running tank goes negative, no station in the failed stretch can work, so reset the start to the next one.',
      complexity: 'O(n) time, O(1) space',
      language: 'java',
      code: `int canCompleteCircuit(int[] gas, int[] cost) {
    int total = 0, tank = 0, start = 0;

    for (int i = 0; i < gas.length; i++) {
        int gain = gas[i] - cost[i];
        total += gain;
        tank += gain;

        if (tank < 0) {          // no station in this stretch can be the start
            start = i + 1;
            tank = 0;
        }
    }
    return total >= 0 ? start : -1;
}`,
    },
    insight: 'Each station in the failed stretch would begin with even less fuel than the one before, so skipping all of them at once is safe — that is what makes it linear.',
  },
  {
    slug: 'jump-game-ii',
    title: 'Fewest jumps to the end',
    topic: 'greedy',
    pattern: 'greedy',
    difficulty: 'Medium',
    statement: 'Each position holds the maximum jump length from there. Find the fewest jumps needed to reach the last index.',
    example: { input: '[2,3,1,1,4]', output: '2' },
    hints: [
      'This is a shortest-path question on a line.',
      'Think of it as BFS levels rather than individual jumps.',
      'What marks the end of the current level?',
    ],
    bruteForce: { idea: 'Dynamic programming over every position and every reachable target.', complexity: 'O(n²)' },
    optimal: {
      idea: 'Sweep once, tracking the furthest index reachable and the end of the current jump range. Reaching that end means one more jump has been spent.',
      complexity: 'O(n) time, O(1) space',
      language: 'java',
      code: `int jump(int[] a) {
    int jumps = 0, currentEnd = 0, furthest = 0;

    for (int i = 0; i < a.length - 1; i++) {     // stop before the last: no jump needed there
        furthest = Math.max(furthest, i + a[i]);

        if (i == currentEnd) {                   // ran out of the current jump's reach
            jumps++;
            currentEnd = furthest;
        }
    }
    return jumps;
}`,
    },
    insight: 'It is BFS with the queue collapsed into two integers, because the positions at each level are always a contiguous range.',
  },
  {
    slug: 'partition-labels',
    title: 'Partition a string into maximal pieces',
    topic: 'greedy',
    pattern: 'greedy',
    difficulty: 'Medium',
    statement: 'Split a string into as many pieces as possible so that each letter appears in at most one piece. Return the piece sizes.',
    example: { input: '"ababcbacadefegde"', output: '[9, 7, 1]', note: 'the last example letter groups differ' },
    hints: [
      'A piece cannot end before the last occurrence of any letter it contains.',
      'So what do you need to know before scanning?',
      'While scanning, what is the earliest place the current piece could possibly end?',
    ],
    bruteForce: { idea: 'For each candidate cut point, verify that no letter spans it.', complexity: 'O(n²)' },
    optimal: {
      idea: 'Record each letter’s last index, then scan extending the current piece end to the furthest last-index seen. Cut when the scan reaches that end.',
      complexity: 'O(n) time, O(alphabet) space',
      language: 'java',
      code: `List<Integer> partitionLabels(String s) {
    int[] last = new int[26];
    for (int i = 0; i < s.length(); i++) last[s.charAt(i) - 'a'] = i;

    List<Integer> sizes = new ArrayList<>();
    int start = 0, end = 0;

    for (int i = 0; i < s.length(); i++) {
        end = Math.max(end, last[s.charAt(i) - 'a']);   // the piece must reach this far

        if (i == end) {                                 // nothing inside appears later
            sizes.add(end - start + 1);
            start = i + 1;
        }
    }
    return sizes;
}`,
    },
    insight: 'Precomputing last occurrences turns a lookahead problem into a single forward scan — the same move as recording heights before a histogram sweep.',
  },

  // ------------------------------------------------------- dynamic programming
  {
    slug: 'climbing-stairs',
    title: 'Ways to climb stairs',
    topic: 'dynamic-programming',
    pattern: 'dynamic-programming',
    difficulty: 'Easy',
    statement: 'You can climb one or two steps at a time. Count the distinct ways to reach step `n`.',
    example: { input: 'n = 4', output: '5' },
    hints: [
      'From where can you arrive at step n?',
      'The answer for n is built from two smaller answers.',
      'How far back does the recurrence actually look?',
    ],
    bruteForce: { idea: 'Recurse on both choices with no caching.', complexity: 'O(2ⁿ)' },
    optimal: {
      idea: 'The recurrence is Fibonacci: arrive from one step below or two. Only the last two values are needed, so two variables suffice.',
      complexity: 'O(n) time, O(1) space',
      language: 'java',
      code: `int climbStairs(int n) {
    int previous = 1, current = 1;      // ways(0) and ways(1)

    for (int i = 2; i <= n; i++) {
        int next = previous + current;  // arrive from one step back or two
        previous = current;
        current = next;
    }
    return current;
}`,
    },
    insight: 'Ask of every DP: how far back does the transition read? That answer is exactly how much you have to keep.',
  },
  {
    slug: 'coin-change',
    title: 'Fewest coins to make an amount',
    topic: 'dynamic-programming',
    pattern: 'dynamic-programming',
    difficulty: 'Medium',
    statement: 'Given coin denominations in unlimited supply, find the fewest coins that sum to a target, or report that it is impossible.',
    example: { input: 'coins = [1,5,9], amount = 15', output: '3', note: '5+5+5; greedy would take 9+5+1' },
    hints: [
      'Greedy fails here — find a case where it does.',
      'What is the state? What is the smallest thing you could decide?',
      'Coins can be reused, so what does the inner loop direction mean?',
      'How do you represent "impossible" without breaking the min?',
    ],
    bruteForce: { idea: 'Try every combination of coins recursively.', complexity: 'exponential' },
    optimal: {
      idea: 'Unbounded knapsack taking a minimum. `dp[x]` is the fewest coins making `x`; each coin offers `dp[x - coin] + 1`.',
      complexity: 'O(amount · coins) time, O(amount) space',
      language: 'java',
      code: `int coinChange(int[] coins, int amount) {
    int[] fewest = new int[amount + 1];
    Arrays.fill(fewest, amount + 1);        // sentinel: larger than any real answer, safe to add
    fewest[0] = 0;

    for (int total = 1; total <= amount; total++) {
        for (int coin : coins) {
            if (coin <= total) fewest[total] = Math.min(fewest[total], fewest[total - coin] + 1);
        }
    }
    return fewest[amount] > amount ? -1 : fewest[amount];
}`,
    },
    insight: 'For the **number of ways** instead, loop coins on the outside — otherwise permutations are counted as separate combinations. That ordering is the classic trap.',
  },
  {
    slug: 'edit-distance',
    title: 'Edit distance between two strings',
    topic: 'dynamic-programming',
    pattern: 'dynamic-programming',
    difficulty: 'Hard',
    statement: 'Find the fewest single-character insertions, deletions or replacements that turn one string into another.',
    example: { input: '"ros" -> "horse"', output: '3' },
    hints: [
      'The state involves a position in each string.',
      'If the two current characters match, what does that cost?',
      'If not, you have exactly three options — which cells do they come from?',
    ],
    bruteForce: { idea: 'Recurse on all three operations at every mismatch.', complexity: 'O(3^(n+m))' },
    optimal: {
      idea: 'A grid where `dp[i][j]` is the distance between the first `i` and first `j` characters. Matching characters copy the diagonal; otherwise take the cheapest of the three neighbours plus one.',
      complexity: 'O(n · m) time, O(min(n, m)) space after reduction',
      language: 'java',
      code: `int minDistance(String a, String b) {
    int n = a.length(), m = b.length();
    int[][] dp = new int[n + 1][m + 1];

    for (int i = 0; i <= n; i++) dp[i][0] = i;      // delete everything
    for (int j = 0; j <= m; j++) dp[0][j] = j;      // insert everything

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (a.charAt(i - 1) == b.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];        // free
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],           // replace
                               Math.min(dp[i - 1][j],               // delete
                                        dp[i][j - 1]));             // insert
            }
        }
    }
    return dp[n][m];
}`,
    },
    insight: 'The base row and column are not decoration: they encode "turning a prefix into nothing costs one deletion per character", which anchors the whole table.',
  },
  {
    slug: 'longest-increasing-subsequence',
    title: 'Longest increasing subsequence',
    topic: 'dynamic-programming',
    pattern: 'binary-search',
    difficulty: 'Hard',
    statement: 'Find the length of the longest strictly increasing subsequence, which need not be contiguous.',
    example: { input: '[10,9,2,5,3,7,101,18]', output: '4', note: '2, 3, 7, 18' },
    hints: [
      'The O(n²) version asks: what is the best subsequence ending at i?',
      'For the faster version, keep the smallest possible tail for each length.',
      'Why is the smallest tail the right one to keep?',
      'Where does each new value belong in that list?',
    ],
    bruteForce: { idea: 'Generate every subsequence and keep the longest increasing one.', complexity: 'O(2ⁿ)' },
    optimal: {
      idea: 'Keep `tails[k]` = the smallest tail of any increasing subsequence of length `k+1`. Binary search where each value belongs; it either extends the list or replaces an entry.',
      complexity: 'O(n log n) time, O(n) space',
      language: 'java',
      code: `int lengthOfLIS(int[] a) {
    // tails[k] = the smallest possible tail of an increasing run of length k + 1.
    List<Integer> tails = new ArrayList<>();

    for (int value : a) {
        int position = lowerBound(tails, value);

        if (position == tails.size()) tails.add(value);   // extends the longest run
        else tails.set(position, value);                  // a tighter tail for that length
    }
    return tails.size();
}

/** First index with tails[i] >= value. */
private int lowerBound(List<Integer> tails, int value) {
    int lo = 0, hi = tails.size();

    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (tails.get(mid) >= value) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
    },
    insight: '`tails` is not itself a valid subsequence — only its length is meaningful. Keeping the smallest tail leaves the most room for future values, the same reasoning as greedy interval selection.',
  },

  // ----------------------------------------------------------------- advanced
  {
    slug: 'implement-trie',
    title: 'Implement a prefix tree',
    topic: 'advanced',
    pattern: 'trie',
    difficulty: 'Medium',
    statement: 'Build a structure supporting insert, exact search, and "does any stored word start with this prefix".',
    example: { input: 'insert "apple"; startsWith("app")', output: 'true' },
    hints: [
      'A hash set answers exact search but not prefixes.',
      'What if each node represented one prefix?',
      'What distinguishes a stored word from a prefix of one?',
    ],
    bruteForce: { idea: 'Keep a list of words and scan it for prefixes.', complexity: 'O(words · length) per query' },
    optimal: {
      idea: 'One node per prefix with a child per character, and a flag marking the end of a real word. Lookup costs the length of the query, not the number of words.',
      complexity: 'O(length) per operation',
      language: 'java',
      code: `class Trie {
    private static class Node {
        Node[] next = new Node[26];
        boolean isWord;
    }

    private final Node root = new Node();

    void insert(String word) {
        Node node = root;

        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (node.next[i] == null) node.next[i] = new Node();
            node = node.next[i];
        }
        node.isWord = true;              // without this flag, "car" looks present after "card"
    }

    boolean search(String word) {
        Node node = walk(word);
        return node != null && node.isWord;
    }

    boolean startsWith(String prefix) {
        return walk(prefix) != null;
    }

    private Node walk(String s) {
        Node node = root;

        for (char c : s.toCharArray()) {
            node = node.next[c - 'a'];
            if (node == null) return null;
        }
        return node;
    }
}`,
    },
    insight: 'Without the `isWord` flag, every prefix would count as a stored word. That one boolean is the whole difference between search and startsWith.',
  },
  {
    slug: 'range-sum-mutable',
    title: 'Range sums with updates',
    topic: 'advanced',
    pattern: 'prefix-sum',
    difficulty: 'Medium',
    statement: 'Support two operations on an array: update a single value, and return the sum of a range. Both must be fast under many operations.',
    example: { input: 'update(1, 5) then sumRange(0, 2)', output: 'the updated total' },
    hints: [
      'A prefix-sum array gives O(1) queries — what does an update cost?',
      'A plain scan gives O(1) updates — what does a query cost?',
      'You need something logarithmic for both.',
    ],
    bruteForce: { idea: 'Rebuild the prefix array after every update.', complexity: 'O(n) per update' },
    optimal: {
      idea: 'A Fenwick tree. Each index owns a block whose size is its lowest set bit, so both the update walk and the prefix walk take one step per set bit.',
      complexity: 'O(log n) per operation, O(n) space',
      language: 'java',
      code: `class NumArray {
    private final int[] values;
    private final int[] tree;            // Fenwick tree, 1-indexed

    NumArray(int[] nums) {
        values = nums.clone();
        tree = new int[nums.length + 1];

        for (int i = 0; i < nums.length; i++) add(i, nums[i]);
    }

    void update(int i, int value) {
        add(i, value - values[i]);       // Fenwick stores deltas, so send the difference
        values[i] = value;
    }

    int sumRange(int l, int r) {
        return prefixSum(r) - prefixSum(l - 1);
    }

    private void add(int i, int delta) {
        for (i++; i < tree.length; i += i & -i) tree[i] += delta;
    }

    private int prefixSum(int i) {
        int sum = 0;
        for (i++; i > 0; i -= i & -i) sum += tree[i];
        return sum;
    }
}`,
    },
    insight: 'Choose the weakest structure that answers the query: a prefix array if nothing changes, Fenwick for sums with point updates, a segment tree only when the operation is not a sum.',
  },
  {
    slug: 'maximum-xor-pair',
    title: 'Maximum XOR of two numbers',
    topic: 'advanced',
    pattern: 'trie',
    difficulty: 'Hard',
    statement: 'Given an array of integers, find the largest XOR obtainable from any pair.',
    example: { input: '[3, 10, 5, 25, 2, 8]', output: '28', note: '5 XOR 25' },
    hints: [
      'Checking every pair is quadratic.',
      'XOR is decided bit by bit, most significant first.',
      'To maximise a bit, what would you want the other number to have there?',
      'What structure lets you walk bits and choose a branch?',
    ],
    bruteForce: { idea: 'XOR every pair of numbers and keep the largest result.', complexity: 'O(n²)' },
    optimal: {
      idea: 'Insert every number into a binary trie, most significant bit first. For each number, walk the trie greedily taking the opposite branch whenever it exists, since that sets the current bit of the XOR.',
      complexity: 'O(n · 32) time and space',
      language: 'java',
      code: `int findMaximumXOR(int[] a) {
    Node root = new Node();
    for (int value : a) insert(root, value);

    int best = 0;

    for (int value : a) {
        Node node = root;
        int current = 0;

        for (int bit = 31; bit >= 0; bit--) {
            int want = ((value >> bit) & 1) ^ 1;        // the opposite bit maximises the XOR

            if (node.next[want] != null) {
                current |= 1 << bit;
                node = node.next[want];
            } else {
                node = node.next[want ^ 1];             // forced to match
            }
        }
        best = Math.max(best, current);
    }
    return best;
}

private static class Node {
    Node[] next = new Node[2];
}

private void insert(Node root, int value) {
    Node node = root;

    for (int bit = 31; bit >= 0; bit--) {
        int b = (value >> bit) & 1;
        if (node.next[b] == null) node.next[b] = new Node();
        node = node.next[b];
    }
}`,
    },
    insight: 'Greedy works here because a higher bit outweighs every lower bit combined — so taking the opposite branch whenever possible can never be beaten later.',
  },
  {
    slug: 'sliding-window-median',
    title: 'Median of every window',
    topic: 'advanced',
    pattern: 'heap-top-k',
    difficulty: 'Hard',
    statement: 'Report the median of every window of size `k` as it slides across an array.',
    example: { input: 'a = [1,3,-1,-3,5,3,6,7], k = 3', output: '[1,-1,-1,3,5,6]' },
    hints: [
      'The running-median two-heap trick gives the median in O(1).',
      'But a window also has to remove an element that is not at a root.',
      'Standard heaps cannot delete an arbitrary element cheaply — what can you do instead?',
    ],
    bruteForce: { idea: 'Sort each window and take the middle.', complexity: 'O(n · k log k)' },
    optimal: {
      idea: 'Two heaps as in the streaming median, plus lazy deletion: record which values are pending removal and discard them when they surface at a root, rebalancing by effective sizes.',
      complexity: 'O(n log k) time, O(k) space',
      language: 'java',
      code: `double[] medianSlidingWindow(int[] a, int k) {
    // An ordered multiset: value -> how many copies are in the window.
    TreeMap<Integer, Integer> window = new TreeMap<>();
    double[] out = new double[a.length - k + 1];

    for (int i = 0; i < a.length; i++) {
        window.merge(a[i], 1, Integer::sum);

        if (i >= k) {                                   // drop the element leaving on the left
            int leaving = a[i - k];
            if (window.merge(leaving, -1, Integer::sum) == 0) window.remove(leaving);
        }

        if (i >= k - 1) out[i - k + 1] = median(window, k);
    }
    return out;
}

/** Walks to the middle by counts; O(k) worst case, and clear. */
private double median(TreeMap<Integer, Integer> window, int k) {
    int wanted = k / 2;
    int seen = 0;
    Integer lower = null;

    for (Map.Entry<Integer, Integer> entry : window.entrySet()) {
        seen += entry.getValue();

        if (k % 2 == 1) {
            if (seen > wanted) return entry.getKey();
        } else {
            if (lower == null && seen >= wanted) lower = entry.getKey();
            if (seen > wanted) return (lower + entry.getKey()) / 2.0;
        }
    }
    throw new IllegalStateException("empty window");
}`,
    },
    insight: 'Lazy deletion is the general workaround for heaps: you cannot remove from the middle, so mark it and skip it when it reaches the top.',
  },
];
