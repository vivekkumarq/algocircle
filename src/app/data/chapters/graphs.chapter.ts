import { Chapter } from '../../core/models/chapter.models';

export const GRAPHS: Chapter = {
  slug: 'graphs',
  title: 'Graphs',
  shortTitle: 'Graphs',
  level: 'Advanced',
  order: 17,
  stage: 'graphs',
  readingMinutes: 38,
  definition: {
    heading: 'What a graph is',
    text:
      'A **graph** is a set of nodes and the edges between them — the general structure that arrays, lists and trees are all special cases of. Edges may be **directed** or not and **weighted** or not, and those two choices decide which algorithm applies. Almost every graph problem reduces to a traversal: **BFS** explores in rings of increasing distance, **DFS** follows one path to its end before backing up.',
  },
  summary:
    'Modelling relationships and traversing them: BFS and DFS, cycles and components, topological order, shortest paths, minimum spanning trees and disjoint sets. Many hard-looking problems are ordinary graph problems in disguise.',
  objectives: [
    'Choose an adjacency list, matrix or edge list for a given problem',
    'Say precisely when BFS gives a shortest path and when it does not',
    'Detect cycles in undirected and directed graphs, and explain why the methods differ',
    'Produce a topological order and use it for dependency and DAG problems',
    'Pick between Dijkstra, Bellman-Ford, Floyd-Warshall and 0-1 BFS',
    'Use a disjoint set union to answer connectivity and build an MST',
  ],
  prerequisites: ['trees', 'heaps'],
  sections: [
    {
      id: 'vocabulary',
      title: 'Vocabulary, and what a graph really is',
      blocks: [
        {
          kind: 'callout',
          tone: 'note',
          title: 'In plain words',
          text: 'Dots joined by lines: cities and roads, people and friendships, web pages and links. Most of this chapter is about walking those connections in a sensible order, and the rest is about finding the cheapest way across them.',
        },
        {
          kind: 'para',
          text: 'A graph is a set of **vertices** and a set of **edges** connecting them. That is all. A tree is a graph with no cycles; a grid is a graph where each cell connects to its neighbours; a state machine is a graph where each configuration is a vertex.',
        },
        {
          kind: 'table',
          headers: ['Term', 'Meaning'],
          rows: [
            ['Directed', 'edges have a direction: `u -> v` does not imply `v -> u`'],
            ['Weighted', 'each edge carries a cost'],
            ['Degree', 'number of edges at a vertex; in-degree and out-degree when directed'],
            ['Path', 'a sequence of vertices connected by edges'],
            ['Cycle', 'a path that returns to its start'],
            ['Connected component', 'a maximal set of vertices reachable from each other'],
            ['DAG', 'directed acyclic graph — has a topological order'],
            ['Dense / sparse', '`E` close to `V^2` / `E` close to `V`'],
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          title: 'The modelling step is the hard part',
          text: 'Most graph problems do not mention graphs. The skill is asking "what is a vertex here, and what is an edge?" — a word with one letter changed, a state of a puzzle, a course with its prerequisite, a cell and its neighbours.',
        },
      ],
    },
    {
      id: 'representation',
      title: 'Representations',
      blocks: [
        {
          kind: 'table',
          headers: ['Representation', 'Space', 'Is `u-v` an edge?', 'Iterate neighbours', 'Use when'],
          rows: [
            ['Adjacency list', '`O(V + E)`', '`O(degree)`', '`O(degree)`', 'almost always'],
            ['Adjacency matrix', '`O(V^2)`', '`O(1)`', '`O(V)`', 'dense, or Floyd-Warshall'],
            ['Edge list', '`O(E)`', '`O(E)`', 'n/a', 'Kruskal, Bellman-Ford'],
          ],
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Adjacency list - the default choice',
          source: `List<List<Integer>> adjacency = new ArrayList<>();
for (int i = 0; i < v; i++) adjacency.add(new ArrayList<>());

for (int[] edge : edges) {
    adjacency.get(edge[0]).add(edge[1]);
    adjacency.get(edge[1]).add(edge[0]);   // omit this line for a directed graph
}`,
        },
        {
          kind: 'callout',
          tone: 'note',
          text: 'A grid is an implicit graph: do not build an adjacency list for it. The neighbours of `(r, c)` are computed on the fly with a direction array, which saves both memory and code.',
        },
      ],
    },
    {
      id: 'bfs',
      title: 'Breadth-first search',
      blocks: [
        {
          kind: 'para',
          text: 'BFS explores in rings of increasing distance from the source. The first time it reaches a vertex, it has used the fewest possible **edges** — which is why it answers shortest-path questions on unweighted graphs.',
        },
        {
          kind: 'visual',
          name: 'graph-traversal',
          caption:
            'Breadth-first spreads in rings; depth-first dives. Switch between them and compare.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'BFS with distances',
          source: `int[] dist = new int[v];
Arrays.fill(dist, -1);
Queue<Integer> queue = new ArrayDeque<>();

dist[source] = 0;
queue.add(source);

while (!queue.isEmpty()) {
    int node = queue.poll();
    for (int next : adjacency.get(node)) {
        if (dist[next] != -1) continue;     // already reached, and reached sooner
        dist[next] = dist[node] + 1;
        queue.add(next);
    }
}`,
        },
        {
          kind: 'diagram',
          caption: 'Vertices are settled in distance order, one ring at a time.',
          art: `source
  |
 [A]           dist 0
 / \\
[B] [C]        dist 1
 |   |
[D] [E]        dist 2`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'Mark when you enqueue, not when you dequeue',
          text: 'Marking on dequeue lets the same vertex be added many times, which blows up the queue and can produce wrong distances. Set `dist` at the moment you push.',
        },
        {
          kind: 'list',
          items: [
            '**Multi-source BFS:** push every source with distance 0 before the loop. This solves "nearest gate", "rotting oranges" and "distance to nearest 1" in one pass.',
            '**Level-by-level:** take `queue.size()` before an inner loop when you need to act per level.',
            '**0-1 BFS:** with weights of only 0 and 1, use a deque — push 0-weight edges to the front and 1-weight edges to the back. That gives Dijkstra behaviour in `O(V + E)`.',
          ],
        },
      ],
    },
    {
      id: 'dfs',
      title: 'Depth-first search',
      blocks: [
        {
          kind: 'para',
          text: 'DFS follows one path as far as it goes before backing up. It does not give shortest paths, but it is the right tool for structure: components, cycles, topological order, bridges and articulation points.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Recursive DFS',
          source: `boolean[] visited = new boolean[v];

void dfs(int node) {
    visited[node] = true;
    for (int next : adjacency.get(node))
        if (!visited[next]) dfs(next);
}`,
        },
        {
          kind: 'compare',
          columns: [
            {
              title: 'Reach for BFS when',
              points: [
                'You need the shortest path in an unweighted graph.',
                'You need the minimum number of steps or moves.',
                'You want to process level by level.',
                'The graph is deep and recursion would overflow.',
              ],
            },
            {
              title: 'Reach for DFS when',
              points: [
                'You need to detect cycles.',
                'You need a topological order.',
                'You are exploring or counting connected regions.',
                'You need entry and exit times, bridges or SCCs.',
              ],
            },
          ],
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'Recursive DFS on a graph with a hundred thousand vertices in a single chain overflows the stack. Convert to an explicit stack when depth can be large — the shape of the input decides, not taste.',
        },
      ],
    },
    {
      id: 'components',
      title: 'Components, flood fill and grids',
      blocks: [
        {
          kind: 'para',
          text: 'Counting connected components is a loop over every vertex, starting a traversal whenever you meet one you have not visited. Each traversal consumes exactly one component.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Number of islands - a grid is just a graph',
          source: `int[] dr = {-1, 1, 0, 0}, dc = {0, 0, -1, 1};
int islands = 0;

for (int r = 0; r < rows; r++)
    for (int c = 0; c < cols; c++)
        if (grid[r][c] == '1') { islands++; sink(r, c); }

void sink(int r, int c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != '1') return;
    grid[r][c] = '0';                       // mark visited in place
    for (int d = 0; d < 4; d++) sink(r + dr[d], c + dc[d]);
}`,
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'Grid problems are graph problems where the adjacency is implied. Once you see that, islands, flood fill, maze shortest paths and rotting-oranges spread are all traversals you already know.',
        },
      ],
    },
    {
      id: 'cycles',
      title: 'Cycle detection: two different problems',
      blocks: [
        {
          kind: 'para',
          text: 'Undirected and directed graphs need different methods, and knowing why is worth more than knowing both templates.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Undirected: a visited neighbour that is not your parent closes a cycle',
          source: `boolean hasCycle(int node, int parent) {
    visited[node] = true;
    for (int next : adjacency.get(node)) {
        if (!visited[next]) { if (hasCycle(next, node)) return true; }
        else if (next != parent) return true;     // a back edge
    }
    return false;
}`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Directed: a cycle needs a vertex still on the current recursion path',
          source: `boolean hasCycle(int node) {
    state[node] = IN_PROGRESS;
    for (int next : adjacency.get(node)) {
        if (state[next] == IN_PROGRESS) return true;        // back edge to the path
        if (state[next] == UNVISITED && hasCycle(next)) return true;
    }
    state[node] = DONE;
    return false;
}`,
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why the parent check is not enough when directed',
          text: 'In a directed graph you can reach an already-finished vertex without any cycle existing — two paths can converge. Only an edge back to a vertex that is still **on the current path** proves a cycle, which is why three states are needed rather than a boolean.',
        },
      ],
    },
    {
      id: 'bipartite',
      title: 'Bipartite checking',
      blocks: [
        {
          kind: 'para',
          text: 'A graph is bipartite when its vertices can be split into two groups with every edge crossing between them. Equivalently: it is two-colourable, and equivalently again: it has no odd-length cycle.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Two-colouring with BFS',
          source: `int[] colour = new int[v];
Arrays.fill(colour, -1);

for (int start = 0; start < v; start++) {
    if (colour[start] != -1) continue;
    colour[start] = 0;
    Queue<Integer> queue = new ArrayDeque<>(List.of(start));

    while (!queue.isEmpty()) {
        int node = queue.poll();
        for (int next : adjacency.get(node)) {
            if (colour[next] == -1) { colour[next] = 1 - colour[node]; queue.add(next); }
            else if (colour[next] == colour[node]) return false;   // odd cycle
        }
    }
}
return true;`,
        },
        {
          kind: 'callout',
          tone: 'note',
          text: 'The outer loop matters: a graph can be disconnected, and a bipartite answer must hold for every component. Forgetting it is a common near-miss.',
        },
      ],
    },
    {
      id: 'topological',
      title: 'Topological sort',
      blocks: [
        {
          kind: 'para',
          text: 'A topological order lists the vertices of a DAG so that every edge points forward. It is the answer to every "what order can I do these tasks in" question, and it exists **if and only if** the graph has no cycle.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: "Kahn's algorithm - repeatedly take a vertex with no remaining dependencies",
          source: `int[] inDegree = new int[v];
for (int u = 0; u < v; u++)
    for (int next : adjacency.get(u)) inDegree[next]++;

Queue<Integer> ready = new ArrayDeque<>();
for (int u = 0; u < v; u++) if (inDegree[u] == 0) ready.add(u);

List<Integer> order = new ArrayList<>();
while (!ready.isEmpty()) {
    int node = ready.poll();
    order.add(node);
    for (int next : adjacency.get(node))
        if (--inDegree[next] == 0) ready.add(next);
}

if (order.size() != v) return null;   // fewer than v means a cycle exists`,
        },
        {
          kind: 'diagram',
          caption: 'Course prerequisites: an edge means "must come first".',
          art: `  [intro] --> [data structures] --> [algorithms]
      |                                 ^
      +--------> [discrete maths] ------+

valid order: intro, discrete maths, data structures, algorithms`,
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'The size check at the end is not a formality — it is the cycle detector. If some vertices never reach in-degree zero, they are stuck in a cycle, and a topological order does not exist.',
        },
        {
          kind: 'para',
          text: 'The DFS variant produces the same thing: run DFS and prepend each vertex to the output when it finishes. Kahn is easier to reason about and detects the cycle without extra state.',
        },
      ],
    },
    {
      id: 'shortest-paths',
      title: 'Shortest paths',
      blocks: [
        {
          kind: 'table',
          caption: 'Pick by the weights, not by familiarity.',
          headers: ['Algorithm', 'Handles', 'Cost', 'Use when'],
          rows: [
            ['BFS', 'unweighted', '`O(V + E)`', 'every edge costs the same'],
            ['0-1 BFS', 'weights 0 and 1', '`O(V + E)`', 'binary costs, deque instead of a heap'],
            ['Dijkstra', 'non-negative weights', '`O((V + E) log V)`', 'the usual weighted case'],
            ['Bellman-Ford', 'negative weights', '`O(V * E)`', 'negatives, or detecting negative cycles'],
            ['Floyd-Warshall', 'all pairs', '`O(V^3)`', 'small dense graphs, `V` up to a few hundred'],
            ['DAG relaxation', 'any weights, no cycles', '`O(V + E)`', 'the graph is acyclic'],
          ],
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Dijkstra with a priority queue',
          source: `long[] dist = new long[v];
Arrays.fill(dist, Long.MAX_VALUE);
dist[source] = 0;

PriorityQueue<long[]> heap = new PriorityQueue<>((x, y) -> Long.compare(x[1], y[1]));
heap.offer(new long[] { source, 0 });

while (!heap.isEmpty()) {
    long[] top = heap.poll();
    int node = (int) top[0];
    if (top[1] > dist[node]) continue;              // a stale entry

    for (int[] edge : adjacency.get(node)) {        // {neighbour, weight}
        long candidate = dist[node] + edge[1];
        if (candidate < dist[edge[0]]) {
            dist[edge[0]] = candidate;
            heap.offer(new long[] { edge[0], candidate });
        }
    }
}`,
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why Dijkstra breaks on negative edges',
          text: 'It settles a vertex the first time it is removed from the heap, assuming no later path can be shorter. A negative edge can make a longer-looking route cheaper afterwards, invalidating a vertex that was already finalised. Bellman-Ford makes no such assumption, which is exactly why it costs more.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Bellman-Ford: relax every edge V-1 times, then test for a negative cycle',
          source: `for (int round = 0; round < v - 1; round++)
    for (int[] e : edges)
        if (dist[e[0]] != INF && dist[e[0]] + e[2] < dist[e[1]])
            dist[e[1]] = dist[e[0]] + e[2];

for (int[] e : edges)                       // one more improvement means
    if (dist[e[0]] != INF && dist[e[0]] + e[2] < dist[e[1]])
        return "negative cycle";            // there is no shortest path`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Floyd-Warshall - k must be the outermost loop',
          source: `for (int k = 0; k < v; k++)
    for (int i = 0; i < v; i++)
        for (int j = 0; j < v; j++)
            if (d[i][k] + d[k][j] < d[i][j])
                d[i][j] = d[i][k] + d[k][j];`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'In Floyd-Warshall, `k` is the intermediate vertex and **must** be the outer loop. Any other order computes something that is not the shortest path, and the code still runs and still looks plausible.',
        },
      ],
    },
    {
      id: 'dsu',
      title: 'Disjoint set union',
      blocks: [
        {
          kind: 'para',
          text: 'DSU answers "are these two vertices connected?" and "merge these two groups" in almost constant time. It is the natural structure whenever connectivity changes as you go, which is what makes Kruskal work.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'With path compression and union by size',
          source: `int[] parent, size;

int find(int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]];   // path compression, halving
        x = parent[x];
    }
    return x;
}

boolean union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false;          // already together - this edge closes a cycle
    if (size[ra] < size[rb]) { int t = ra; ra = rb; rb = t; }
    parent[rb] = ra;
    size[ra] += size[rb];
    return true;
}`,
        },
        {
          kind: 'callout',
          tone: 'why',
          text: 'Path compression flattens the tree during lookups and union by size keeps it shallow. Together they give an amortised cost of the inverse Ackermann function — under 5 for any input you will ever see, so it is treated as constant.',
        },
        {
          kind: 'para',
          text: 'DSU answers: number of components, whether adding an edge creates a cycle, redundant connections, accounts merging, and grid percolation.',
        },
      ],
    },
    {
      id: 'mst',
      title: 'Minimum spanning trees',
      blocks: [
        {
          kind: 'para',
          text: 'An MST connects every vertex with the smallest total edge weight, using exactly `V - 1` edges and containing no cycle. Two greedy algorithms find it, and both are correct for the same underlying reason.',
        },
        {
          kind: 'compare',
          columns: [
            {
              title: "Kruskal — sort edges, add if safe",
              points: [
                'Sort all edges by weight.',
                'Add an edge if its endpoints are in different DSU components.',
                '`O(E log E)`.',
                'Better for sparse graphs; needs the edge list.',
              ],
            },
            {
              title: "Prim — grow one tree outward",
              points: [
                'Start anywhere; repeatedly take the cheapest edge leaving the tree.',
                'A heap holds the frontier, exactly like Dijkstra.',
                '`O((V + E) log V)`.',
                'Better for dense graphs; needs the adjacency list.',
              ],
            },
          ],
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Kruskal in six lines, once DSU exists',
          source: `Arrays.sort(edges, (x, y) -> x[2] - y[2]);

int total = 0, used = 0;
for (int[] e : edges) {
    if (union(e[0], e[1])) { total += e[2]; used++; }
    if (used == v - 1) break;
}`,
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why the greedy choice is safe',
          text: 'The cut property: for any split of the vertices into two sides, the cheapest edge crossing it belongs to some MST. Both algorithms only ever add such an edge, which is what makes a purely local choice globally optimal.',
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Beyond the core set',
      blocks: [
        {
          kind: 'table',
          headers: ['Topic', 'What it answers', 'Cost'],
          rows: [
            ['Bridges', 'edges whose removal disconnects the graph', '`O(V + E)`'],
            ['Articulation points', 'vertices whose removal disconnects it', '`O(V + E)`'],
            ['SCC (Kosaraju, Tarjan)', 'maximal mutually reachable groups in a directed graph', '`O(V + E)`'],
            ['Euler path', 'a walk using every edge exactly once', '`O(E)`'],
            ['Max flow / min cut', 'maximum throughput through a network', 'depends on the algorithm'],
            ['Bipartite matching', 'pairing two sets optimally', 'a flow problem in disguise'],
          ],
        },
        {
          kind: 'callout',
          tone: 'note',
          text: 'These are rare below senior level. Knowing what each one answers, and recognising when a problem calls for it, is worth more in an interview than being able to code Tarjan from memory.',
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
            'What is a vertex and what is an edge in this problem?',
            'Directed or undirected? Weighted or not?',
            'Shortest path? Then unweighted means BFS, non-negative means Dijkstra, negatives mean Bellman-Ford.',
            'Structure or ordering? Then DFS, topological sort or DSU.',
            'Is the graph disconnected? Do I loop over every start vertex?',
            'Am I marking visited at enqueue time?',
            'Can recursion depth reach `V`? Should this be iterative?',
            'Have I handled a single vertex, no edges, and self-loops?',
          ],
        },
        {
          kind: 'check',
          question: 'A word ladder: change one letter at a time to turn one word into another, using the fewest steps. What is the graph?',
          answer: 'Each word is a vertex, and an edge joins two words differing in exactly one letter. All edges cost the same, so it is unweighted and BFS gives the shortest transformation. The modelling was the whole problem — the algorithm is one you already knew.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'The hard part is modelling: decide what a vertex is and what an edge is.',
    'Adjacency lists are the default; grids are implicit graphs needing no list at all.',
    'BFS gives shortest paths when every edge costs the same; mark visited on enqueue.',
    'DFS is for structure: cycles, components, topological order, bridges.',
    'Undirected cycles need a parent check; directed cycles need a vertex still on the recursion path.',
    'A topological order exists exactly when the graph is acyclic — the output size is the cycle test.',
    'Dijkstra assumes non-negative weights; Bellman-Ford handles negatives and detects negative cycles.',
    'DSU makes connectivity almost constant time and turns Kruskal into six lines.',
  ],
};
