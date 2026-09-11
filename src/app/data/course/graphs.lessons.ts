import { CourseLesson } from './course.model';

const DIJKSTRA: CourseLesson = {
  slug: 'dijkstra',
  title: "Dijkstra's algorithm",
  tagline: 'Shortest paths when edges have weights — BFS with a priority queue instead of a plain one.',
  topic: 'graphs',
  minutes: 15,
  practice: ['network-delay', 'word-ladder', 'number-of-islands'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'BFS finds shortest paths when every edge costs 1, because it visits nodes in order of distance. With different weights that order breaks — so replace the queue with a **priority queue** keyed on distance, and you are always expanding the nearest unfinished node.',
    },
    {
      kind: 'visual',
      name: 'graph-traversal',
      caption: 'The frontier expands outwards; the only change from BFS is how the next node is chosen.',
    },
    { kind: 'heading', text: 'Why taking the nearest node is safe' },
    {
      kind: 'para',
      text: 'When you pop the node with the smallest tentative distance, that distance is final. Any other route to it would have to pass through a node still on the frontier, which is *further away*, and adding a non-negative edge to something further away cannot produce something nearer.',
    },
    {
      kind: 'callout',
      tone: 'key',
      text: 'That argument uses "non-negative" twice. Dijkstra is wrong on graphs with negative edges — and not just slow, actually wrong. Use Bellman-Ford there.',
    },
    {
      kind: 'diagram',
      art: `     4        1
  A ---- B ---- C
  |      |      |
 1|     2|      |3
  |      |      |
  D ---- E ------+
     5

from A:  pop A(0) -> D=1, B=4
         pop D(1) -> E=6
         pop B(4) -> C=5, E=min(6, 6)=6
         pop C(5) -> E=min(6, 8)=6
         pop E(6) -> done`,
    },
    { kind: 'heading', text: 'The implementation' },
    {
      kind: 'code',
      language: 'java',
      caption: 'Lazy deletion: push duplicates and skip stale pops. Simpler than decrease-key, and just as fast in practice.',
      source: `int[] dijkstra(List<int[]>[] graph, int source) {
    int[] dist = new int[graph.length];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[source] = 0;

    // { distance, node }, smallest distance first
    PriorityQueue<int[]> queue = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
    queue.add(new int[] { 0, source });

    while (!queue.isEmpty()) {
        int[] top = queue.poll();
        int d = top[0], node = top[1];

        if (d > dist[node]) continue;        // a stale entry — already improved

        for (int[] edge : graph[node]) {     // { neighbour, weight }
            int next = edge[0];
            int candidate = d + edge[1];

            if (candidate < dist[next]) {
                dist[next] = candidate;
                queue.add(new int[] { candidate, next });
            }
        }
    }

    return dist;
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `import heapq


def dijkstra(graph: dict[int, list[tuple[int, int]]], source: int) -> dict[int, int]:
    dist = {source: 0}
    queue: list[tuple[int, int]] = [(0, source)]

    while queue:
        d, node = heapq.heappop(queue)
        if d > dist.get(node, float('inf')):
            continue                          # stale entry

        for neighbour, weight in graph.get(node, ()):
            candidate = d + weight
            if candidate < dist.get(neighbour, float('inf')):
                dist[neighbour] = candidate
                heapq.heappush(queue, (candidate, neighbour))

    return dist`,
    },
    { kind: 'heading', text: 'Recovering the path' },
    {
      kind: 'para',
      text: 'Distances alone rarely satisfy the follow-up question. Keep a `parent` array updated whenever you improve a distance, then walk it backwards from the target and reverse.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `List<Integer> pathTo(int[] parent, int target) {
    List<Integer> path = new ArrayList<>();
    for (int at = target; at != -1; at = parent[at]) path.add(at);
    Collections.reverse(path);
    return path;
}`,
    },
    {
      kind: 'table',
      caption: 'V nodes, E edges. Pick the algorithm by the weights, not by habit.',
      headers: ['Situation', 'Algorithm', 'Cost'],
      rows: [
        ['All edges weight 1', 'BFS', 'O(V + E)'],
        ['Weights 0 or 1', '0-1 BFS with a deque', 'O(V + E)'],
        ['Non-negative weights, one source', "Dijkstra + heap", 'O(E log V)'],
        ['Negative weights allowed', 'Bellman-Ford', 'O(V · E)'],
        ['All pairs, small graph', 'Floyd-Warshall', 'O(V^3)'],
        ['Weights plus a good heuristic', 'A*', 'depends on the heuristic'],
      ],
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Where people go wrong',
      text: 'Marking a node visited when you *push* it rather than when you *pop* it. A node can be pushed several times with decreasing distances, and locking in the first one gives a wrong answer that looks plausible.',
    },
    {
      kind: 'para',
      text: 'Two variations appear constantly in dressed-up form. **Minimum effort path** replaces `d + weight` with `max(d, weight)`; **maximum probability path** replaces the sum with a product and the min-heap with a max-heap. The skeleton never changes — only the way two path costs combine.',
    },
    {
      kind: 'check',
      question: 'Why is the stale-entry check `if (d > dist[node]) continue;` enough — why no visited set?',
      answer:
        'Because `dist[node]` is only ever lowered. The first time a node is popped, its distance matches `dist[node]` and is final; every later pop of the same node carries a larger `d` and is skipped. The array is doing the visited set work.',
    },
  ],
};

const PRIM: CourseLesson = {
  slug: 'prims-algorithm',
  title: "Prim's algorithm",
  tagline: 'Grow one tree outwards, always taking the cheapest edge that reaches something new.',
  topic: 'graphs',
  minutes: 12,
  practice: ['network-delay', 'meeting-rooms'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'A **minimum spanning tree** connects every node with the least total edge weight. Prim builds it like a growing blob: start anywhere, and repeatedly add the cheapest edge that leads from the blob to a node outside it.',
    },
    {
      kind: 'diagram',
      art: `     2        3
  A ---- B ---- C
  |    / |      |
 6|  8/ 5|      |7
  | /    |      |
  D ---- E ------+
     9

start at A
  take A-B (2)        tree { A, B }
  take B-C (3)        tree { A, B, C }
  take B-E (5)        tree { A, B, C, E }
  take A-D (6)        tree { A, B, C, D, E }   total 16`,
    },
    { kind: 'heading', text: 'Why greedy works here' },
    {
      kind: 'para',
      text: 'This is the **cut property**. Split the nodes into those inside the tree and those outside; the cheapest edge crossing that split must be in some minimum spanning tree. If a tree left it out, adding it would create a cycle containing a heavier crossing edge — remove that one instead and the total goes down, contradicting minimality.',
    },
    {
      kind: 'callout',
      tone: 'key',
      text: 'Prim is Dijkstra with one line changed. Dijkstra keys the heap on *distance from the source*; Prim keys it on *distance from the tree* — it never adds the accumulated path cost.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `int minimumSpanningTree(List<int[]>[] graph) {
    boolean[] inTree = new boolean[graph.length];
    PriorityQueue<int[]> queue = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
    queue.add(new int[] { 0, 0 });       // { weight, node }

    int total = 0, taken = 0;
    while (!queue.isEmpty() && taken < graph.length) {
        int[] top = queue.poll();
        int weight = top[0], node = top[1];

        if (inTree[node]) continue;      // already connected, cheaper

        inTree[node] = true;
        total += weight;                 // NOT weight + something — no accumulation
        taken++;

        for (int[] edge : graph[node]) {
            if (!inTree[edge[0]]) queue.add(new int[] { edge[1], edge[0] });
        }
    }

    return taken == graph.length ? total : -1;   // -1: the graph is disconnected
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `import heapq


def minimum_spanning_tree(graph: dict[int, list[tuple[int, int]]]) -> int:
    start = next(iter(graph))
    in_tree: set[int] = set()
    queue: list[tuple[int, int]] = [(0, start)]
    total = 0

    while queue and len(in_tree) < len(graph):
        weight, node = heapq.heappop(queue)
        if node in in_tree:
            continue

        in_tree.add(node)
        total += weight

        for neighbour, w in graph[node]:
            if neighbour not in in_tree:
                heapq.heappush(queue, (w, neighbour))

    return total if len(in_tree) == len(graph) else -1`,
    },
    {
      kind: 'para',
      text: 'On a **dense** graph — the "connect all points, every pair has a distance" problems — the heap is not worth it. With `O(V^2)` edges the plain array version is both simpler and faster: keep a `minCost` array, and each round pick the cheapest unvisited node by scanning it.',
    },
    {
      kind: 'table',
      headers: ['Graph', 'Implementation', 'Cost'],
      rows: [
        ['Sparse, adjacency list', 'Binary heap', 'O(E log V)'],
        ['Dense, or complete on points', 'minCost array, no heap', 'O(V^2)'],
        ['Edges given as a list, not a graph', "Kruskal with Union-Find", 'O(E log E)'],
      ],
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Where people go wrong',
      text: 'Adding the accumulated distance, turning Prim into Dijkstra. The spanning tree cares only about the weight of the edge you are adding — if your totals come out too large, that is almost always the cause.',
    },
    {
      kind: 'check',
      question: 'How do you notice the graph is disconnected?',
      answer:
        'Count the nodes you actually add. If the heap empties before the count reaches `V`, the rest of the graph was unreachable and no spanning tree exists.',
    },
  ],
};

const KRUSKAL: CourseLesson = {
  slug: 'kruskals-algorithm',
  title: "Kruskal's algorithm",
  tagline: 'Sort every edge, then take each one unless it closes a cycle. Union-Find does the hard part.',
  topic: 'graphs',
  minutes: 12,
  practice: ['number-of-islands', 'course-schedule'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'Forget about growing a connected blob. Sort all the edges cheapest first and walk the list: take the edge if its two ends are in different components, skip it if they are already connected. After `V - 1` successful takes you have a minimum spanning tree.',
    },
    {
      kind: 'diagram',
      art: `edges sorted:  A-B 2   B-C 3   B-E 5   A-D 6   C-E 7   B-D 8   D-E 9

A-B 2   different components  -> take    { A B }
B-C 3   different             -> take    { A B C }
B-E 5   different             -> take    { A B C E }
A-D 6   different             -> take    { A B C D E }   V-1 = 4 edges, stop
C-E 7   same component        -> would close a cycle`,
    },
    { kind: 'heading', text: 'Why it needs Union-Find' },
    {
      kind: 'para',
      text: 'The only question Kruskal ever asks is "are these two nodes already connected?", and it asks it once per edge. That is precisely what disjoint-set union answers in near-constant time. With a BFS per edge the algorithm would be `O(E · V)` and pointless.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `int kruskal(int n, int[][] edges) {        // edges: { u, v, weight }
    Arrays.sort(edges, Comparator.comparingInt(e -> e[2]));

    UnionFind dsu = new UnionFind(n);
    int total = 0, taken = 0;

    for (int[] edge : edges) {
        if (dsu.union(edge[0], edge[1])) {   // false when already connected
            total += edge[2];
            if (++taken == n - 1) break;     // a tree is complete
        }
    }

    return taken == n - 1 ? total : -1;
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `def kruskal(n: int, edges: list[tuple[int, int, int]]) -> int:
    edges.sort(key=lambda e: e[2])
    dsu = UnionFind(n)

    total = taken = 0
    for u, v, weight in edges:
        if dsu.union(u, v):
            total += weight
            taken += 1
            if taken == n - 1:
                break

    return total if taken == n - 1 else -1`,
    },
    {
      kind: 'compare',
      columns: [
        {
          title: "Prefer Kruskal",
          points: [
            'The input is already a list of edges',
            'The graph is sparse',
            'You also need to know *which* edges were chosen',
            'You have a Union-Find implementation to hand',
          ],
        },
        {
          title: "Prefer Prim",
          points: [
            'The input is an adjacency list, or points in a plane',
            'The graph is dense — Prim avoids sorting E edges',
            'You want to grow from a particular starting node',
            'Edges are generated lazily rather than listed',
          ],
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'key',
      text: 'Both algorithms are correct and can produce different trees of the same total weight. When weights are distinct the minimum spanning tree is unique, so they then agree exactly.',
    },
    {
      kind: 'para',
      text: 'Two close relatives of the same loop: stop early after `k` takes and you have the cheapest way to reduce the graph to `k` components — the standard clustering trick. And reverse the sort to get the *maximum* spanning tree, which shows up in "widest path" problems.',
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Where people go wrong',
      text: 'Sorting the edges but then testing connectivity with a plain `visited` array. Visited tells you a node has been seen, not which component it is in — two separate fragments both look "visited" and you end up with a forest.',
    },
    {
      kind: 'check',
      question: 'Why is it safe to take the globally cheapest edge first?',
      answer:
        'By the cut property. For any edge, consider the cut separating its two endpoints from each other; the cheapest edge crossing some cut is always in a minimum spanning tree. The globally cheapest edge crosses the cut around either endpoint, so it qualifies.',
    },
  ],
};

const TOPOLOGICAL_SORT: CourseLesson = {
  slug: 'topological-sort',
  title: 'Topological sort',
  tagline: 'An order that respects every dependency — and a cycle detector for free.',
  topic: 'graphs',
  minutes: 13,
  practice: ['course-schedule', 'word-ladder'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'Given tasks where some must come before others, produce an order that breaks no rule. It exists exactly when the dependency graph has **no cycle** — which is why the same algorithm answers "can this be scheduled at all?".',
    },
    {
      kind: 'diagram',
      art: `intro -> arrays -> hashing -> graphs
             \\-> sorting -> binary search

in-degrees   intro 0   arrays 1   hashing 1   sorting 1   graphs 1   bsearch 1

queue [intro] -> arrays -> { hashing, sorting } -> graphs, bsearch
one valid order: intro, arrays, hashing, sorting, graphs, bsearch`,
    },
    { kind: 'heading', text: "Kahn's algorithm: count what is blocking you" },
    {
      kind: 'para',
      text: 'For each node count its **in-degree** — how many prerequisites it still has. Everything at zero can start now, so put those in a queue. Taking a node out and finishing it removes one prerequisite from each of its successors; any that drops to zero joins the queue.',
    },
    {
      kind: 'code',
      language: 'java',
      source: `int[] topologicalOrder(int n, int[][] edges) {     // edges: { before, after }
    List<List<Integer>> next = new ArrayList<>();
    for (int i = 0; i < n; i++) next.add(new ArrayList<>());

    int[] inDegree = new int[n];
    for (int[] edge : edges) {
        next.get(edge[0]).add(edge[1]);
        inDegree[edge[1]]++;
    }

    Deque<Integer> queue = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (inDegree[i] == 0) queue.add(i);

    int[] order = new int[n];
    int placed = 0;

    while (!queue.isEmpty()) {
        int node = queue.poll();
        order[placed++] = node;

        for (int successor : next.get(node)) {
            if (--inDegree[successor] == 0) queue.add(successor);
        }
    }

    // Fewer than n placed means a cycle blocked the rest.
    return placed == n ? order : new int[0];
}`,
    },
    {
      kind: 'code',
      language: 'python',
      source: `from collections import deque


def topological_order(n: int, edges: list[tuple[int, int]]) -> list[int]:
    successors: list[list[int]] = [[] for _ in range(n)]
    in_degree = [0] * n

    for before, after in edges:
        successors[before].append(after)
        in_degree[after] += 1

    queue = deque(i for i in range(n) if in_degree[i] == 0)
    order: list[int] = []

    while queue:
        node = queue.popleft()
        order.append(node)

        for successor in successors[node]:
            in_degree[successor] -= 1
            if in_degree[successor] == 0:
                queue.append(successor)

    return order if len(order) == n else []      # empty means a cycle`,
    },
    {
      kind: 'callout',
      tone: 'key',
      text: 'The cycle test is the length check at the end. If fewer than `n` nodes came out, the ones left all still have a prerequisite — and a set of nodes each waiting on another is exactly a cycle.',
    },
    { kind: 'heading', text: 'The DFS version' },
    {
      kind: 'para',
      text: 'The alternative is a depth-first walk that records each node **after** its successors, then reverses the list. Detecting a cycle needs three states rather than a visited flag: unvisited, in progress, and done. Meeting an in-progress node means you have walked into your own path.',
    },
    {
      kind: 'code',
      language: 'python',
      source: `def topological_dfs(n: int, successors: list[list[int]]) -> list[int]:
    UNSEEN, ACTIVE, DONE = 0, 1, 2
    state = [UNSEEN] * n
    out: list[int] = []

    def visit(node: int) -> bool:
        if state[node] == ACTIVE:
            return False                 # back edge: a cycle
        if state[node] == DONE:
            return True

        state[node] = ACTIVE
        for successor in successors[node]:
            if not visit(successor):
                return False

        state[node] = DONE
        out.append(node)                 # after the successors
        return True

    for node in range(n):
        if not visit(node):
            return []

    out.reverse()
    return out`,
    },
    {
      kind: 'table',
      headers: ['', "Kahn (BFS)", 'DFS'],
      rows: [
        ['Cycle detection', 'count the output', 'three-colour states'],
        ['Natural output order', 'forwards', 'reversed at the end'],
        ['Deep graphs', 'safe — no recursion', 'can overflow the call stack'],
        ['Lexicographically smallest order', 'use a priority queue', 'not straightforward'],
        ['Level-by-level grouping', 'easy — process the queue in rounds', 'awkward'],
      ],
    },
    {
      kind: 'para',
      text: 'Processing the queue in rounds gives a bonus worth remembering: each round is a set of tasks with no dependency between them, so the number of rounds is the **minimum number of semesters** (or parallel steps) the schedule needs.',
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Where people go wrong',
      text: 'Building the edges the wrong way round. "Course `a` requires `b`" means the edge goes `b -> a`, and `a` is the one whose in-degree increases. Half of all wrong answers here are a reversed graph, so state the direction in a comment before you write the loop.',
    },
    {
      kind: 'check',
      question: 'Is a topological order unique?',
      answer:
        'Only when the graph is a single chain. Whenever two nodes have in-degree zero at the same moment, either may go first, so there are usually many valid orders. A problem asking for a specific one normally wants the lexicographically smallest, which means a priority queue instead of a plain one.',
    },
  ],
};

export const GRAPH_LESSONS: CourseLesson[] = [DIJKSTRA, PRIM, KRUSKAL, TOPOLOGICAL_SORT];
