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
          kind: 'para',
          text:
            'Before any algorithm, you have to decide how the graph is stored, and the choice is dictated by density. An **adjacency list** keeps, for each node, the list of its neighbours; an **adjacency matrix** keeps a grid of every possible pair. The list costs memory proportional to the edges that exist, the matrix to the edges that could exist.',
        },
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
          kind: 'para',
          text:
            'In practice the list wins almost every time, because real graphs are sparse: a road network, a dependency graph or a social graph has far fewer edges than the square of its nodes. Reach for the matrix only when the graph is small and dense, or when you need to answer "is there an edge between these two?" in constant time.',
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
          kind: 'code',
          language: 'python',
          source: `adjacency: list[list[int]] = [[] for _ in range(v)]

for u, w in edges:
    adjacency[u].append(w)
    adjacency[w].append(u)        # omit this line for a directed graph`,
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
          kind: 'code',
          language: 'python',
          source: `from collections import deque

dist = [-1] * v
dist[source] = 0
queue = deque([source])

while queue:
    node = queue.popleft()

    for nxt in adjacency[node]:
        if dist[nxt] != -1:
            continue              # already reached, and reached sooner

        dist[nxt] = dist[node] + 1
        queue.append(nxt)`,
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
          kind: 'code',
          language: 'python',
          source: `visited = [False] * v


def dfs(node: int) -> None:
    visited[node] = True

    for nxt in adjacency[node]:
        if not visited[nxt]:
            dfs(nxt)

# Python's recursion limit is about 1000 frames — use an explicit stack on deep graphs.`,
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
          kind: 'figure',
          height: 208,
          label: 'A graph with three disconnected components',
          caption: 'Counting components is a loop plus a traversal, nothing more.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">One traversal consumes exactly one component</text>
<circle cx="70" cy="70" r="17" class="dg-fill" />
<text x="70" y="74.5" class="dg-t" text-anchor="middle">1</text>
<circle cx="140" cy="44" r="17" class="dg-fill" />
<text x="140" y="48.5" class="dg-t" text-anchor="middle">2</text>
<circle cx="140" cy="108" r="17" class="dg-fill" />
<text x="140" y="112.5" class="dg-t" text-anchor="middle">3</text>
<path class="dg-thin" d="M88 64 L122 50" />
<path class="dg-thin" d="M88 78 L122 100" />
<path class="dg-thin" d="M140 62 L140 90" />
<circle cx="300" cy="60" r="17" class="dg-fill2" />
<text x="300" y="64.5" class="dg-on" text-anchor="middle">4</text>
<circle cx="300" cy="124" r="17" class="dg-fill2" />
<text x="300" y="128.5" class="dg-on" text-anchor="middle">5</text>
<path class="dg-thin" d="M300 78 L300 106" />
<circle cx="470" cy="92" r="17" class="dg-box" />
<text x="470" y="96.5" class="dg-t" text-anchor="middle">6</text>
<text x="105" y="160" class="dg-s" text-anchor="middle">component 1</text>
<text x="300" y="168" class="dg-s" text-anchor="middle">component 2</text>
<text x="470" y="136" class="dg-s" text-anchor="middle">component 3</text>
<text x="0" y="196" class="dg-s" text-anchor="start">loop over every vertex; start a traversal only when it is still unvisited</text>`,
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
          kind: 'code',
          language: 'python',
          source: `DIRECTIONS = ((-1, 0), (1, 0), (0, -1), (0, 1))
islands = 0


def sink(r: int, c: int) -> None:
    if not (0 <= r < rows and 0 <= c < cols) or grid[r][c] != '1':
        return

    grid[r][c] = '0'              # mark visited in place
    for dr, dc in DIRECTIONS:
        sink(r + dr, c + dc)


for r in range(rows):
    for c in range(cols):
        if grid[r][c] == '1':
            islands += 1
            sink(r, c)`,
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
          kind: 'figure',
          height: 188,
          label: 'A back edge in an undirected graph and a cycle in a directed one',
          caption: 'They are different problems, and the same code answers neither.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">Undirected: any visited neighbour that is not your parent</text>
<circle cx="80" cy="76" r="17" class="dg-box" />
<text x="80" y="80.5" class="dg-t" text-anchor="middle">a</text>
<circle cx="180" cy="50" r="17" class="dg-box" />
<text x="180" y="54.5" class="dg-t" text-anchor="middle">b</text>
<circle cx="180" cy="110" r="17" class="dg-box" />
<text x="180" y="114.5" class="dg-t" text-anchor="middle">c</text>
<path class="dg-thin" d="M98 71 L162 56" />
<path class="dg-thin" d="M98 83 L162 104" />
<path class="dg-thin" d="M180 68 L180 92" />
<text x="230" y="84" class="dg-m" text-anchor="start">back edge</text>
<text x="340" y="18" class="dg-s" text-anchor="start">Directed: a neighbour still on the current path</text>
<circle cx="400" cy="60" r="17" class="dg-box" />
<text x="400" y="64.5" class="dg-t" text-anchor="middle">x</text>
<circle cx="500" cy="60" r="17" class="dg-box" />
<text x="500" y="64.5" class="dg-t" text-anchor="middle">y</text>
<circle cx="500" cy="124" r="17" class="dg-box" />
<text x="500" y="128.5" class="dg-t" text-anchor="middle">z</text>
<path class="dg-line" marker-end="url(#ah)" d="M418 60 L480 60" />
<path class="dg-line" marker-end="url(#ah)" d="M500 78 L500 104" />
<path class="dg-line" marker-end="url(#ah)" d="M482 124 Q441 84 400 78" />
<text x="430" y="140" class="dg-m" text-anchor="middle">IN PROGRESS</text>
<text x="0" y="176" class="dg-s" text-anchor="start">the undirected test needs a parent; the directed test needs three states</text>`,
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
          language: 'python',
          source: `def has_cycle(node: int, parent: int) -> bool:
    visited[node] = True

    for nxt in adjacency[node]:
        if not visited[nxt]:
            if has_cycle(nxt, node):
                return True
        elif nxt != parent:
            return True           # a back edge

    return False`,
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
          kind: 'code',
          language: 'python',
          source: `UNVISITED, IN_PROGRESS, DONE = 0, 1, 2


def has_cycle(node: int) -> bool:
    state[node] = IN_PROGRESS

    for nxt in adjacency[node]:
        if state[nxt] == IN_PROGRESS:
            return True           # back edge to the current path
        if state[nxt] == UNVISITED and has_cycle(nxt):
            return True

    state[node] = DONE
    return False`,
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
          kind: 'figure',
          height: 204,
          label: 'A two-colourable graph beside a triangle that cannot be two-coloured',
          caption: 'Bipartite means no odd cycle, and BFS finds the clash if one exists.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">Colour as you traverse; a clash means an odd cycle</text>
<circle cx="90" cy="64" r="17" class="dg-fill" />
<text x="90" y="68.5" class="dg-t" text-anchor="middle">a</text>
<circle cx="90" cy="150" r="17" class="dg-fill" />
<text x="90" y="154.5" class="dg-t" text-anchor="middle">b</text>
<circle cx="250" cy="64" r="17" class="dg-fill2" />
<text x="250" y="68.5" class="dg-on" text-anchor="middle">c</text>
<circle cx="250" cy="150" r="17" class="dg-fill2" />
<text x="250" y="154.5" class="dg-on" text-anchor="middle">d</text>
<path class="dg-thin" d="M108 64 L232 64" />
<path class="dg-thin" d="M108 70 L232 144" />
<path class="dg-thin" d="M108 144 L232 70" />
<text x="170" y="190" class="dg-s" text-anchor="middle">two colours suffice</text>
<circle cx="420" cy="60" r="17" class="dg-fill" />
<text x="420" y="64.5" class="dg-t" text-anchor="middle">x</text>
<circle cx="370" cy="150" r="17" class="dg-fill2" />
<text x="370" y="154.5" class="dg-on" text-anchor="middle">y</text>
<circle cx="470" cy="150" r="17" class="dg-fill2" />
<text x="470" y="154.5" class="dg-on" text-anchor="middle">z</text>
<path class="dg-thin" d="M410 76 L380 132" />
<path class="dg-thin" d="M430 76 L460 132" />
<path class="dg-thin" d="M388 150 L452 150" />
<text x="420" y="190" class="dg-s" text-anchor="middle">y and z clash — a triangle is odd</text>`,
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
          kind: 'code',
          language: 'python',
          source: `from collections import deque

colour = [-1] * v

for start in range(v):
    if colour[start] != -1:
        continue

    colour[start] = 0
    queue = deque([start])

    while queue:
        node = queue.popleft()

        for nxt in adjacency[node]:
            if colour[nxt] == -1:
                colour[nxt] = 1 - colour[node]
                queue.append(nxt)
            elif colour[nxt] == colour[node]:
                return False      # odd cycle

return True`,
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
          kind: 'code',
          language: 'python',
          source: `from collections import deque

in_degree = [0] * v
for u in range(v):
    for nxt in adjacency[u]:
        in_degree[nxt] += 1

ready = deque(u for u in range(v) if in_degree[u] == 0)
order: list[int] = []

while ready:
    node = ready.popleft()
    order.append(node)

    for nxt in adjacency[node]:
        in_degree[nxt] -= 1
        if in_degree[nxt] == 0:
            ready.append(nxt)

if len(order) != v:
    return None                   # fewer than v means a cycle exists`,
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
          kind: 'para',
          text:
            'There is no single shortest-path algorithm, and picking the wrong one is the most common mistake in this topic. The weights decide. If every edge costs the same, BFS already gives shortest paths and anything fancier is wasted work. If weights differ but are never negative, Dijkstra applies. If a weight can be negative, Dijkstra is not merely slow — it is wrong, and you need Bellman-Ford.',
        },
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
          kind: 'para',
          text:
            'The reason Dijkstra breaks on negative edges is worth holding onto, because it explains the whole algorithm. Dijkstra works by settling the nearest unfinished node and declaring its distance final, which is only safe if no later detour can come back cheaper. Add an edge with a negative weight and exactly that can happen, so a node gets settled at a distance it will later beat.',
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
          kind: 'code',
          language: 'python',
          source: `import heapq

dist = [float('inf')] * v
dist[source] = 0

heap = [(0, source)]              # (distance, node) — the tuple orders itself

while heap:
    d, node = heapq.heappop(heap)
    if d > dist[node]:
        continue                  # a stale entry

    for neighbour, weight in adjacency[node]:
        candidate = d + weight

        if candidate < dist[neighbour]:
            dist[neighbour] = candidate
            heapq.heappush(heap, (candidate, neighbour))`,
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
          language: 'python',
          source: `for _ in range(v - 1):
    for u, w, weight in edges:
        if dist[u] != INF and dist[u] + weight < dist[w]:
            dist[w] = dist[u] + weight

for u, w, weight in edges:              # one more improvement means
    if dist[u] != INF and dist[u] + weight < dist[w]:
        return 'negative cycle'         # there is no shortest path`,
        },
        {
          kind: 'para',
          text:
            'Two variations look like new algorithms but are the same code with one line changed. A path whose cost is the *largest* edge rather than the sum — the minimum-effort path — replaces addition with a maximum. A path that multiplies probabilities replaces the sum with a product and the min-heap with a max-heap. Only the way two costs combine ever changes.',
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
          kind: 'code',
          language: 'python',
          source: `for k in range(v):                      # k must be the outermost loop
    for i in range(v):
        for j in range(v):
            if d[i][k] + d[k][j] < d[i][j]:
                d[i][j] = d[i][k] + d[k][j]`,
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
          kind: 'figure',
          height: 224,
          label: 'A chain of parents flattened so every node points at the root',
          caption: 'The only question it answers is "same group?", and it answers it almost instantly.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">Union by size, then path compression flattens what you walked</text>
<circle cx="70" cy="60" r="17" class="dg-fill" />
<text x="70" y="64.5" class="dg-t" text-anchor="middle">a</text>
<circle cx="70" cy="120" r="17" class="dg-box" />
<text x="70" y="124.5" class="dg-t" text-anchor="middle">b</text>
<circle cx="70" cy="176" r="17" class="dg-box" />
<text x="70" y="180.5" class="dg-t" text-anchor="middle">c</text>
<path class="dg-thin" d="M70 78 L70 102" />
<path class="dg-thin" d="M70 138 L70 158" />
<text x="70" y="208" class="dg-s" text-anchor="middle">find(c) walks up</text>
<path class="dg-line" marker-end="url(#ah)" d="M130 118 L200 118" />
<text x="165" y="104" class="dg-s" text-anchor="middle">compress</text>
<circle cx="320" cy="60" r="17" class="dg-fill" />
<text x="320" y="64.5" class="dg-t" text-anchor="middle">a</text>
<circle cx="260" cy="140" r="17" class="dg-box" />
<text x="260" y="144.5" class="dg-t" text-anchor="middle">b</text>
<circle cx="380" cy="140" r="17" class="dg-box" />
<text x="380" y="144.5" class="dg-t" text-anchor="middle">c</text>
<path class="dg-thin" d="M310 76 L268 122" />
<path class="dg-thin" d="M330 76 L372 122" />
<text x="320" y="208" class="dg-s" text-anchor="middle">both now point straight at the root</text>
<text x="470" y="90" class="dg-m" text-anchor="start">connected(x, y)</text>
<text x="470" y="112" class="dg-s" text-anchor="start">is just</text>
<text x="470" y="134" class="dg-m" text-anchor="start">find(x) == find(y)</text>`,
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
          kind: 'code',
          language: 'python',
          source: `parent = list(range(n))
size = [1] * n


def find(x: int) -> int:
    while parent[x] != x:
        parent[x] = parent[parent[x]]   # path compression, halving
        x = parent[x]
    return x


def union(a: int, b: int) -> bool:
    ra, rb = find(a), find(b)
    if ra == rb:
        return False                    # already together — this edge closes a cycle

    if size[ra] < size[rb]:
        ra, rb = rb, ra

    parent[rb] = ra
    size[ra] += size[rb]
    return True`,
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
          kind: 'code',
          language: 'python',
          source: `edges.sort(key=lambda e: e[2])

total = used = 0
for u, w, weight in edges:
    if union(u, w):
        total += weight
        used += 1
    if used == v - 1:
        break`,
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
          kind: 'para',
          text:
            'The topics below are where graph theory stops being general-purpose. None of them appear often, but each solves a question the core traversals cannot answer, and knowing the name is usually enough to find the algorithm when you need it.',
        },
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
          kind: 'para',
          text:
            'If you are working through this chapter for the first time, skip the table. BFS, DFS, topological sort, Dijkstra and union-find cover the overwhelming majority of graph problems you will actually meet; the rest is worth reading only once those are automatic.',
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
          kind: 'para',
          text:
            'Most graph bugs are not in the algorithm — they are in the modelling. Before writing any traversal, be able to say out loud what a node is, what an edge means, whether it has a direction and whether it carries a weight. Three quarters of the difficulty of a graph problem is recognising that it is one.',
        },
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
