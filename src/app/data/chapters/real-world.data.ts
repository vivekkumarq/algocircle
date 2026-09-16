import { Block } from '../../core/models/chapter.models';

export interface RealWorldGuide {
  /** Opening hook shown at the start of the topic. */
  projectHook: string;
  /** Extra explanation inserted after the first section's opening, for harder topics. */
  extra?: Block[];
  intro: string;
  uses: [string, string][];
}

/**
 * Real products that use each topic, plus a short hook so the lesson is never
 * only "a LeetCode pattern". `chapters/index.ts` weaves this into every chapter.
 */
export const REAL_WORLD: Record<string, RealWorldGuide> = {
  'why-dsa': {
    projectHook:
      'Google Search, WhatsApp delivery, and Uber matching are not magic — they are data laid out well, plus a procedure that stays cheap as the data grows. That is this whole course, in production.',
    intro:
      'You already live inside DSA. The rest of the curriculum names the pieces. Here is where the *idea* of cost and structure shows up before you write a line of interview code.',
    uses: [
      ['Google Search', 'Ranking and retrieving documents for a query would be unusable if every search scanned the whole web linearly.'],
      ['WhatsApp / iMessage', 'Delivering a message to the right device, in order, is a data-structure-and-queue problem at global scale.'],
      ['Uber / Ola', 'Matching riders to nearby drivers is a search over location data with a hard latency budget.'],
      ['Your phone OS', 'Opening an app, scrolling a feed, and checking notifications are all algorithms over structures in memory and on disk.'],
    ],
  },
  foundations: {
    projectHook:
      'When Chrome feels fast and a badly written script freezes, the difference is often how values sit in memory — arrays packed together versus chasing pointers across the heap.',
    intro:
      'Memory layout is not academic. Game engines, databases and browsers spend years on it because cache misses and extra copies show up as dropped frames and slow queries.',
    uses: [
      ['Chrome / Firefox', 'A tab is a process with a heap, a stack, and arrays of pixels. Layout and paint care about contiguous memory.'],
      ['Unity / Unreal', 'Entities packed in arrays so the CPU can walk them without jumping around RAM.'],
      ['PostgreSQL', 'Rows on disk pages; a pointer chase for every field would make every SELECT crawl.'],
      ['Android / iOS runtimes', 'The call stack, garbage collection and object headers are this chapter running under every app.'],
    ],
  },
  complexity: {
    projectHook:
      'Instagram cannot open your feed by comparing you to every user on Earth. Constraints (`n` likes, `n` posts) decide which code is allowed — the same skill as reading `n ≤ 10^5` on a problem.',
    extra: [
      {
        kind: 'para',
        text: 'A useful picture: a restaurant with one cook. **O(n)** is plating each dish once. **O(n²)** is re-checking every earlier order for every new ticket — fine for ten tables, catastrophic for a stadium. **O(log n)** is opening the reservation book in the middle and throwing away half the pages each time. You are not timing the cook with a stopwatch; you are asking how the work *grows* when the dining room grows.',
      },
      {
        kind: 'callout',
        tone: 'key',
        title: 'How to read it in a product',
        text: 'If a feature must stay under 200ms with ten times more users next year, only certain growth rates survive. That is Big-O as an engineering constraint, not as exam notation.',
      },
    ],
    intro:
      'Product teams use complexity the way you will in interviews: to reject an idea before writing it. These are systems that would simply not ship if someone had picked the slower algorithm.',
    uses: [
      ['YouTube recommendations', 'Candidate generation must be sub-linear in the catalogue. A nested loop over all videos is not a product.'],
      ['Git', '`git log` and `git merge` stay usable on Linux-sized histories because they do not rescan every commit naively for every command.'],
      ['Excel / Google Sheets', 'Recalculating a sheet of a million cells cannot be quadratic in the number of formulas.'],
      ['Cloud billing dashboards', 'Aggregating usage over a month is planned against `n` events so the page still loads on the first of the month.'],
    ],
  },
  mathematics: {
    projectHook:
      'TLS certificates, UPI payments and Git commit hashes all rest on modular arithmetic and primes — the same GCD and remainder ideas in this topic, just with bigger numbers.',
    intro:
      'Number theory in this course is the same toolkit used to keep money, identities and file integrity honest.',
    uses: [
      ['HTTPS / TLS', 'Public-key crypto is modular exponentiation and primes. Your browser does this on every padlock.'],
      ['UPI / card networks', 'Checksums, identifiers and some fraud checks are modular arithmetic and hashing of numbers.'],
      ['Git', 'A commit is a hash of content. Collision resistance is why rewriting history is obvious.'],
      ['Games (Minecraft, roguelikes)', 'Seeded randomness, grid hashing and wrapping coordinates are remainder arithmetic.'],
    ],
  },
  arrays: {
    projectHook:
      'A news feed, a stock candlestick chart, and a video buffer are arrays: a contiguous list you index in constant time. Prefix sums power “likes in the last 24 hours” without rescanning the day.',
    intro:
      'Almost every product that shows a list, a timeline or a buffer of samples is an array — plus the prefix and sliding tricks from later topics.',
    uses: [
      ['Spotify / Apple Music', 'A playlist is an array of track ids. Reordering, shuffle and “play from here” are index arithmetic.'],
      ['Bloomberg / trading UIs', 'Price series are arrays; moving averages and range totals are prefix-sum cousins.'],
      ['Instagram Stories', 'A sequence of clips with a progress bar is an array walked left to right.'],
      ['Figma / Photoshop undo', 'A history stack sits on an array of document snapshots or patches.'],
    ],
  },
  strings: {
    projectHook:
      'Gmail search, VS Code find-in-file, and WhatsApp message search are string algorithms. Naive `indexOf` in a loop is why a laptop fans when a bad script scans a huge log.',
    intro:
      'Any product that searches, autocompletes or validates text is running the ideas in this topic — often KMP, tries (later) or a rolling hash under the hood.',
    uses: [
      ['VS Code / IntelliJ', 'Find, replace and syntax highlighting walk strings; large files need linear or better matching.'],
      ['Gmail', 'Search and spam rules scan subject and body without a full quadratic compare against every template.'],
      ['Chrome address bar', 'Matching what you type against history and search suggestions is prefix and substring work.'],
      ['DNA tools (BLAST-style)', 'The same matching algorithms, on much longer alphabets, search biological sequences.'],
    ],
  },
  hashing: {
    projectHook:
      'Redis caches, Python dicts, and “is this email already registered?” are hash tables: average O(1) lookup. Without them, login and shopping carts would scan every user or every item.',
    extra: [
      {
        kind: 'para',
        text: 'Think of a cloakroom: you do not search every hook for your ticket. You hash the ticket number to a hook index. Two tickets landing on one hook is a **collision** — you hang a second coat on the same hook and check the labels. A good hash spreads coats evenly so hooks stay short. That picture is Redis, a language `Map`, and session storage.',
      },
    ],
    intro:
      'If a product answers “have I seen this key?” millions of times a second, it is almost certainly a hash table (or a close cousin).',
    uses: [
      ['Redis / Memcached', 'The default mental model of a cache is a giant hash map from key to value.'],
      ['Python / Java / JS objects', '`dict`, `HashMap` and `{}` are this topic. Your application code already depends on it.'],
      ['CDN cache keys (Cloudflare)', 'URL plus headers hashed to a cache slot so the same page is not fetched twice.'],
      ['Password dumps / Have I Been Pwned', 'Lookups by hash, not by scanning every leaked password as plain text.'],
    ],
  },
  'two-pointers': {
    projectHook:
      'Merging two sorted database streams, scanning a chat for a pair of messages, and shrinking a photo-gallery selection from both ends are two pointers: two indices that only move forward.',
    intro:
      'The pattern shows up whenever two sequences are already ordered, or whenever a single array can be solved by a left index and a right index that never rewind.',
    uses: [
      ['Database merge joins', 'PostgreSQL-style merge join walks two sorted inputs with two pointers instead of nested loops.'],
      ['Photo apps (crop / range select)', 'A start and end handle on a timeline are two pointers over an array of frames.'],
      ['Audio / video editors', 'In and out points on a waveform: two indices, one pass to export the slice.'],
      ['Log compaction', 'Merging two sorted event streams into one timeline is the merge step of merge-sort, in production.'],
    ],
  },
  'sliding-window': {
    projectHook:
      '“Active users in the last 5 minutes”, a chat that keeps the last 50 messages on screen, and rate limiting (max 100 requests per minute) are a window that slides. You add the new event and drop the one that aged out — you do not recount from scratch.',
    intro:
      'Any metric over a recent interval is a sliding window if it must stay fast as the stream never ends.',
    uses: [
      ['Twitch / YouTube live', 'Concurrent viewers and chat rate are windows over a stream of events.'],
      ['API gateways (Kong, AWS API Gateway)', 'Token buckets and sliding-window counters stop one client flooding an API.'],
      ['Datadog / Grafana', 'Graphs of “errors in the last 15 minutes” are maintained windows, not full rescans.'],
      ['Stock tickers', 'Moving average of the last *k* prices is a fixed window over a time series.'],
    ],
  },
  'binary-search': {
    projectHook:
      'Git bisect finds the commit that broke the build by jumping to the middle of history. App Store version checks, game matchmaking MMR brackets, and “lowest price that still meets SLA” are the same idea: the answer space is sorted, so you halve it.',
    extra: [
      {
        kind: 'para',
        text: 'If you can say “every value left of mid is too small, every value right is big enough”, you may binary-search **the answer**, not an array. That is how allocation, load-balancer capacity and compression quality knobs are tuned in systems: try a mid value, see if it works, throw away half the range.',
      },
    ],
    intro:
      'Binary search is how products find a threshold in a sorted or monotonic space without testing every option.',
    uses: [
      ['git bisect', 'Halves the commit range until the first bad commit remains.'],
      ['Play Store / App Store updates', 'Finding a compatible binary in a sorted list of versions.'],
      ['Game matchmaking (Valorant, ranked queues)', 'Search a rating range for an opponent; the range is ordered.'],
      ['CDN / video bitrate ladders', 'Pick the highest quality that still fits the bandwidth budget — search on bitrate.'],
    ],
  },
  sorting: {
    projectHook:
      'Your email inbox “Sort by date”, Amazon “price: low to high”, and Excel column sort are this topic. Databases spend decades on sort + index because a sorted table makes everything else cheaper.',
    intro:
      'UI sort is the visible bit. Underneath, search engines, databases and compilers sort as a building block for joins, rankings and binary search.',
    uses: [
      ['Gmail / Outlook', 'Messages ordered by time or sender; the list is an array plus a sort (or an index already ordered).'],
      ['Amazon / Flipkart listings', 'Rank and filter are sorts and partial sorts (top-K) over huge catalogues.'],
      ['PostgreSQL `ORDER BY`', 'May sort in memory or use an index that is already sorted — same algorithms, different layer.'],
      ['Linux `sort` / log analysis', 'Huge text files sorted so you can uniq, merge and binary-search later.'],
    ],
  },
  recursion: {
    projectHook:
      'The file picker that expands folders, React’s component tree, and a chess engine looking a few moves ahead are recursion: the same function on a smaller tree. Backtracking is “try, undo, try the next door” — Sudoku, package dependency solvers, and map colouring.',
    extra: [
      {
        kind: 'para',
        text: 'Do not simulate the whole call stack. Write the **contract**: “`size(folder)` is 1 plus the sum of `size` on each child.” The empty folder is the base case. Nested folders in Finder, nested comments on Reddit, and HTML’s DOM are that contract. Backtracking adds **undo**: place a queen, recurse, take the queen back — the same skeleton as generating outfits or resolving npm versions.',
      },
    ],
    intro:
      'If the data is a tree or a nested document, production code is usually recursive (or an explicit stack doing the same walk).',
    uses: [
      ['Finder / Files app', 'Computing folder size and drawing the tree is recursion over directory children.'],
      ['React / Flutter', 'The UI tree is walked recursively to layout and reconcile.'],
      ['npm / Maven / Gradle', 'Resolving a package and its dependencies is a graph walk with backtracking when versions conflict.'],
      ['Chess / game AI', 'Minimax is a recursion tree over moves, pruned (alpha-beta) so it finishes in time.'],
    ],
  },
  'linked-lists': {
    projectHook:
      'The kernel’s run queue, a music app’s “next/previous in this playlist without shifting a million songs”, and LRU caches (Redis, browsers) are linked lists: cheap insert and delete in the middle if you already hold the node.',
    intro:
      'Arrays win at indexing; lists win at splicing. Operating systems and caches mix both.',
    uses: [
      ['Linux scheduler', 'Processes wait on linked lists of run queues; moving a task is pointer surgery, not array shift.'],
      ['LRU caches (Redis, CDNs, browsers)', 'A hashmap plus a doubly linked list: O(1) “this key was just used” by moving a node to the front.'],
      ['Text editors (gap buffer cousins / piece tables)', 'Some editors stitch buffers with list-like pieces so typing in the middle is cheap.'],
      ['Undo chains', 'Each edit points at the previous edit; revert walks the list backwards.'],
    ],
  },
  'stacks-queues': {
    projectHook:
      'Undo is a stack. A printer queue, Kafka, and Celery workers are queues: first in, first out. The call stack in every language is literally a stack. Browser history Back is a stack; a chat server’s inbound messages are a queue.',
    intro:
      'If the rule is “last thing I did” it is a stack. If the rule is “fair order of arrival” it is a queue. Most backends are queues with extra names.',
    uses: [
      ['Ctrl+Z in Docs / Figma', 'Undo stack; redo is a second stack.'],
      ['Chrome history', 'Back and forward are stacks of URLs.'],
      ['RabbitMQ / SQS / Kafka', 'Work queues so web requests are not lost when a worker is busy.'],
      ['OS interrupt handling', 'Hardware and kernels push context on a stack so nested interrupts can return correctly.'],
    ],
  },
  trees: {
    projectHook:
      'HTML is a tree. Your company org chart, VS Code’s file sidebar, and JSON APIs are trees. A binary search tree (and B-trees on disk) is how databases find a row without scanning the table.',
    intro:
      'Nested documents and indexes are trees. Once you can recurse on children and return a value up, you can compute layout, permissions, and query plans.',
    uses: [
      ['DOM in every browser', 'Layout, event bubbling and `querySelector` walk the HTML tree.'],
      ['VS Code explorer', 'The folder tree is a tree; collapse/expand is showing a subtree.'],
      ['PostgreSQL / InnoDB indexes', 'B-trees (a fat search tree) sit on disk so `WHERE id = ?` is logarithmic.'],
      ['LDAP / Active Directory', 'Organisations and permissions are trees of groups and people.'],
    ],
  },
  heaps: {
    projectHook:
      'OS process scheduling, Dijkstra in Google Maps, and “top 10 trending songs” are heaps: always give me the current smallest or largest, fast. A news site “most read right now” is a heap or a heap-like top-K.',
    intro:
      'Whenever the next thing to process is “the best so far”, production code uses a priority queue, almost always a binary heap.',
    uses: [
      ['Google Maps / Apple Maps routing', 'Dijkstra with a heap: always expand the currently cheapest path.'],
      ['Linux Completely Fair Scheduler (ideas)', 'Picking the next task by vruntime is a priority problem.'],
      ['Kubernetes / job schedulers', 'Which pod or job runs next is a priority queue of pending work.'],
      ['Spotify / YouTube “trending”', 'Top-K over a sliding window of plays — often a heap of size K.'],
    ],
  },
  graphs: {
    projectHook:
      'Maps are graphs (intersections and roads). Facebook friends, LinkedIn, and GitHub follow-graphs are graphs. Netflix “because you watched” walks a graph of titles. Kubernetes service mesh and the internet itself are graphs.',
    extra: [
      {
        kind: 'para',
        text: 'If you can draw **dots and arrows**, you can model it as a graph. BFS is “wave out from the start” — the way a game fog-of-war fills, or how LinkedIn finds 2nd-degree connections. DFS is “go deep down one corridor, then backtrack” — compilers walking ASTs, or detecting a cycle in package dependencies (“A needs B needs A”). Shortest path is Maps. Topological sort is “compile this after its imports” and “run these Airflow tasks in order”.',
      },
    ],
    intro:
      'Any product about *relationships* — places, people, packages, pages — is a graph problem wearing a UI.',
    uses: [
      ['Google Maps', 'Road network graph; Dijkstra / A* for ETA; traffic as edge weights.'],
      ['LinkedIn / Facebook', 'People and edges; BFS for “people you may know” within a few hops.'],
      ['npm / Docker layer graphs', 'Dependencies must be a DAG; cycle detection and topological install order.'],
      ['Netflix / Spotify recommendations', 'Item–item or user–item graphs; walks and neighbourhoods, not a single array scan.'],
    ],
  },
  greedy: {
    projectHook:
      'Huffman coding (zip files, MP3), Kruskal’s MST for cheap network design, and interval scheduling (“book the meeting rooms with no overlap”) are greedy: the locally best choice is globally correct — after you prove it.',
    extra: [
      {
        kind: 'para',
        text: 'Greedy feels like cheating: never undo, just pick the best next step. It is correct only when an **exchange argument** exists: any optimal solution can be turned into yours without getting worse. Huffman does this for compression. Activity selection does this for rooms. If you cannot sketch why the first pick is safe, it is probably DP instead — knapsack with weights is the classic trap.',
      },
    ],
    intro:
      'Compression, networking and scheduling use greedy because it is fast and, for those problems, provably optimal.',
    uses: [
      ['zip / gzip / MP3 / JPEG', 'Huffman and related codes: frequent symbols get shorter bits.'],
      ['Network design / spanning trees', 'Connect sites with minimum cable (Kruskal / Prim) — ISPs and datacenter fabrics.'],
      ['Calendar / meeting rooms (Google Calendar ideas)', 'Schedule the request that finishes first so more meetings fit.'],
      ['CPU / GPU job packing', 'Some schedulers place the next-fit or best-fit task greedily for speed.'],
    ],
  },
  'dynamic-programming': {
    projectHook:
      'Google Translate (edit distance / alignment), diff in Git, autocomplete ranking, and knapsack-style budget allocation in ads are DP: overlapping subproblems stored in a table. Spellcheck “did you mean?” is edit distance.',
    extra: [
      {
        kind: 'para',
        text: 'Start from a slow recursion you understand. Fibonacci is the mascot: `fib(5)` calls `fib(4)` and `fib(3)`, and `fib(4)` calls `fib(3)` again. Write `fib(3)` in a notebook the first time — that is memoisation. Filling a row left-to-right is tabulation. **Git diff** is the same idea on two strings: `dp[i][j]` = “how do I turn the first *i* characters of A into the first *j* of B?” **Knapsack** is “each item: take or skip, given remaining capacity.” Name the cell in one sentence before you write loops.',
      },
    ],
    intro:
      'Wherever a product aligns two sequences, breaks a budget into items, or reuses sub-answers (routes, parses, recommendations), DP or memoisation is nearby.',
    uses: [
      ['Git diff / VS Code diff', 'Longest common subsequence / edit distance between two file versions.'],
      ['Google Translate / speech alignment', 'Sequence alignment is DP on tokens or audio frames.'],
      ['Spellcheck (Word, Google Docs)', 'Edit distance against a dictionary; “did you mean” is the cheapest alignment.'],
      ['Ads / games resource allocation', 'Knapsack-style: spend a budget across items for maximum value.'],
    ],
  },
  advanced: {
    projectHook:
      'Autocomplete in Google and IDE is a trie. Databases use B-trees and (inside engines) Fenwick/segment-tree ideas for range sums. Bloom filters sit in Chrome Safe Browsing and Cassandra: “this URL is *probably* not in the set” without storing every URL.',
    extra: [
      {
        kind: 'para',
        text: 'These exist because **the same question is asked thousands of times**. A trie shares prefixes so “alg” jumps to algorithm, not a scan of every word. A Fenwick or segment tree answers “sum of this range” after updates, which is what analytics dashboards need. A Bloom filter is a gossip-y set: it can say “definitely not here” in a few bits — used so a browser does not download a huge malware list.',
      },
    ],
    intro:
      'Search bars, databases and browsers keep these structures in the hot path. You will not implement a production B-tree tomorrow, but you will recognise why the product is fast.',
    uses: [
      ['Google / IDE autocomplete', 'Tries (and finite automata) over prefixes of queries and identifiers.'],
      ['InnoDB / Postgres indexes', 'B-trees for range and equality; the disk cousin of balanced search trees.'],
      ['Chrome Safe Browsing / Cassandra', 'Bloom filters to skip disk for keys that cannot be present.'],
      ['Analytics (range sums, time series rollups)', 'Fenwick / segment trees or pre-aggregated trees for “sum between two timestamps”.'],
    ],
  },
};
