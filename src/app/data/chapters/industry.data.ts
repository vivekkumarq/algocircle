import { Block } from '../../core/models/chapter.models';

export interface IndustryGuide {
  /** Slow, clear restatement of the idea. */
  think: string;
  analogy: string;
  mistake: string;
  walk: { title: string; text: string }[];
  scale: string;
  bigTech: [string, string, string][];
}

/**
 * Extra teaching plus named big-tech usage. Wired in by `chapters/index.ts`
 * so every topic gets the same clarity pass.
 */
export const INDUSTRY: Record<string, IndustryGuide> = {
  'why-dsa': {
    think:
      'A program is only “correct” if it also finishes in time and fits in memory. Data structures are how you store the facts; algorithms are the steps you take. Pick a bad pair and the product still “works” on your laptop and dies with a million users. This topic is the habit of asking “what happens when n is huge?” before you write a loop.',
    analogy:
      'A library with a million books: dumping them in a pile (bad structure) versus the Dewey decimal system (good structure). The question “where is this title?” is the algorithm. Same books, wildly different waiting time.',
    mistake:
      'Treating DSA as trivia to memorise for interviews. Companies hire it because production traffic is the exam: Google cannot scan the web on every search; Uber cannot brute-force every driver on Earth.',
    walk: [
      { title: 'Name the data', text: 'What are the things — users, posts, roads, packets?' },
      { title: 'Name the question', text: 'Lookup, nearest, shortest, top-K, “have I seen this?”' },
      { title: 'Name the growth', text: 'If users 10×, does the work 10×, 100×, or barely change?' },
      { title: 'Only then pick a structure', text: 'Array, hash, tree, graph, heap — whichever makes that question cheap.' },
    ],
    scale:
      'At big tech the same habit is a design review: latency budgets (p99 under 200ms), capacity (this shard holds 1/N of the world), and an explicit “this is O(log n) per request”.',
    bigTech: [
      ['Google', 'Search / Maps', 'Index and graph algorithms so a query does not touch the whole corpus or the whole road network.'],
      ['Meta', 'News Feed / WhatsApp', 'Fan-out, queues and ranked lists so a post or message reaches devices without a linear scan of humanity.'],
      ['Amazon', 'Retail search & cart', 'Catalog lookup and inventory checks that stay cheap at Prime-day traffic.'],
      ['Microsoft', 'Office / Azure', 'Document features and cloud APIs measured against worst-case input size, not demo files.'],
      ['Apple', 'iOS / App Store', 'Local structures (lists, indexes) plus store search that must feel instant on a phone.'],
    ],
  },
  foundations: {
    think:
      'Every value lives somewhere: a stack frame (short-lived, nested calls) or the heap (objects that outlive a line of code). An array is a block of slots next to each other, so index `i` is address + i × size. A linked structure is “here is a pointer to the next piece” — extra jumps, extra cache misses. References are not copies: two variables can name the same object, which is why mutating through one surprises the other.',
    analogy:
      'The stack is a pile of plates (the current function is the top plate). The heap is a warehouse with numbered aisles. An array is one long shelf; a linked list is sticky notes that say “next box is in aisle 14”.',
    mistake:
      'Drawing objects as isolated boxes and forgetting that assignment of an object copies the *address*, not the bytes. That bug shows up in every language with references — Java, Python, JS, C++.',
    walk: [
      { title: 'Draw the stack', text: 'Each call adds a frame; return pops it. Recursion depth is stack height.' },
      { title: 'Draw the heap', text: 'new / objects live here until nothing points at them.' },
      { title: 'Count the jumps', text: 'Contiguous array: 1 jump. Linked nodes: one jump per node.' },
      { title: 'Ask who mutates', text: 'If two names point at one array, a write is visible through both.' },
    ],
    scale:
      'Browsers, VMs and game engines are obsessed with this because a cache miss is tens of nanoseconds × billions of operations.',
    bigTech: [
      ['Google', 'V8 / Chrome', 'Hidden classes, packed arrays and generational GC — layout decides whether a page janks.'],
      ['Meta', 'HHVM / React Native', 'Object models and bridging cost: extra copies between JS and native kill scroll FPS.'],
      ['Microsoft', '.NET / Windows', 'Value types vs references, stackalloc, and GC generations in high-throughput services.'],
      ['Apple', 'Swift / ARC', 'Value semantics vs class references; copy-on-write arrays so UI lists stay cheap.'],
      ['Amazon', 'Java services', 'Heap sizing and allocation rate on Prime-day boxes — GC pauses are a production incident.'],
    ],
  },
  complexity: {
    think:
      'Big-O is a growth story, not a stopwatch. Drop constants and slower terms so you can compare ideas: “this nested loop is n²; this hash lookup is 1 on average.” Best / average / worst case matter when the input is adversarial (sorted vs reverse-sorted). Amortised cost is “expensive sometimes, cheap on average” — like a dynamic array that copies when it doubles. Recurrences describe divide-and-conquer: T(n) = 2T(n/2) + n is merge sort’s n log n.',
    analogy:
      'A stadium gate: O(1) is a VIP pass. O(log n) is binary search of seat rows. O(n) is checking every ticket once. O(n²) is every guest introducing themselves to every other guest. Fine for a dinner party; lethal for a cup final.',
    mistake:
      'Saying “this is O(n)” because there is one loop, while the loop body does O(n) work (another scan, a sort, a string copy). Always multiply nested work. Also: O(n log n) beats O(n²) long before n = 10⁵ — that is why interview constraints exist.',
    walk: [
      { title: 'Count loops', text: 'Independent loops add; nested loops multiply.' },
      { title: 'Count extra work inside', text: 'Hash O(1) average; sort O(n log n); another scan O(n).' },
      { title: 'Read the constraints', text: '`n ≤ 1e5` usually forbids n². `n ≤ 20` often wants 2ⁿ or backtracking.' },
      { title: 'Name worst case', text: 'Hash tables degrade if hashed badly; quicksort degrades if pivoted badly.' },
    ],
    scale:
      'SRE and capacity docs at big tech are complexity in disguise: “this endpoint is O(edges) per user; we shard so edges stay bounded.”',
    bigTech: [
      ['Google', 'Ads / Search serving', 'Per-query work must be sub-linear in the corpus; nested loops over the web are not a design.'],
      ['Meta', 'TAO graph store', 'Friend-of-friend style reads are budgeted; unbounded graph walks get caches and limits.'],
      ['Netflix', 'Encoding pipeline', 'Choosing a codec/preset is “cost vs quality”; they will not pick an algorithm that is quadratic in pixels for every title.'],
      ['Uber', 'Marketplace matching', 'Matching has a time budget per ping; complexity classes decide which solver runs on the hot path.'],
      ['Amazon', 'DynamoDB / retail', 'Partition keys and query shapes exist so you never scan the whole table (that would be linear in the company’s data).'],
    ],
  },
  mathematics: {
    think:
      'DSA maths is discrete: integers, remainders, bits, counting. GCD (Euclid) is “subtract or remainder until the numbers share a factor” — used in fractions and in crypto. Primes and modular multiply power public-key crypto. XOR is addition without carry: swapping, parity, “find the unique number”. Combinatorics (nCk) tells you how big a search is before you start backtracking.',
    analogy:
      'A clock is mod 12: 10 + 3 = 1. RSA is a clock with a gigantic face. XOR is a light switch: flip twice and you are back. Counting combinations is “how many teams of 5 from 40 people” — if that number is 658,008, brute force is a joke.',
    mistake:
      'Using floating point for “mod” money or hashes. Overflow: in 32-bit, `n * n` wraps. Always take mod at each step when the problem asks for “answer modulo 1e9+7”.',
    walk: [
      { title: 'Reduce with remainder', text: 'GCD, cycles, wrapping indexes: `i % n`.' },
      { title: 'Count before you search', text: 'If 2ⁿ states and n=40, you need a better model than recursion.' },
      { title: 'Bit tricks with a reason', text: '`x & -x` isolates a bit — Fenwick trees and flags, not cleverness for its own sake.' },
      { title: 'Modulo as you go', text: 'Never wait until the end to `% MOD` on a product of large numbers.' },
    ],
    scale:
      'Security and money systems treat this as load-bearing, not puzzle content.',
    bigTech: [
      ['Google', 'Tink / HTTPS', 'TLS handshakes: modular exponentiation and elliptic curves on every search box padlock.'],
      ['Apple', 'iMessage / Secure Enclave', 'Device keys and Signal-style ratchets rest on the same number theory.'],
      ['Microsoft', 'Azure Key Vault / BitLocker', 'Key wrapping and disk encryption are modular arithmetic and block ciphers.'],
      ['Amazon', 'AWS KMS / payments', 'HSM-backed keys; checksums and identifiers on orders use modular checks.'],
      ['Meta', 'WhatsApp E2E', 'The Signal protocol’s DH and ratchets — discrete math under every lock icon.'],
    ],
  },
  arrays: {
    think:
      'An array is index → value in O(1). The power tricks are *derived* arrays: prefix sums (`pref[i]` = sum of first i) so a range sum is two lookups; difference arrays so a range increment is two writes; kadane so a best subarray is one pass. In-place two-index writes avoid extra memory. You pay O(n) to shift if you insert at the front — that is why ArrayList append is cheap and unshift is not.',
    analogy:
      'A numbered row of lockers. Prefix sums: each locker also stores “total money from locker 1 to here”. Asking “how much in lockers 10–20?” is locker 20 minus locker 9 — not opening eleven doors.',
    mistake:
      'Creating a new array on every step of a loop (O(n²) copies). Off-by-one on slices (`i` inclusive vs exclusive). Assuming `remove(0)` is O(1) in a dynamic array — it is O(n).',
    walk: [
      { title: 'Need a range sum many times?', text: 'Build prefix once, answer in O(1).' },
      { title: 'Need many range updates, few queries?', text: 'Difference array, then prefix to materialise.' },
      { title: 'Need the best stretch?', text: 'Kadane / running best — one pass, O(1) extra memory.' },
      { title: 'Need to delete from the front often?', text: 'Deque or linked list, not a compact array.' },
    ],
    scale:
      'Feeds, time series and game entity lists are arrays because sequential scan is what CPUs are good at.',
    bigTech: [
      ['Meta', 'News Feed ranking buffers', 'Candidate posts sit in arrays/columns; prefix-style aggregates power “last 24h” counters.'],
      ['Netflix', 'Playback buffers', 'Decoded frames in a ring/array; index math, not a linked list of pixels.'],
      ['Google', 'Sheets / Ads time series', 'Columnar blocks and prefix-like aggregates for charts over huge ranges.'],
      ['Amazon', 'Inventory snapshots', 'Per-warehouse counts in dense arrays/columns for fast “how many left?”'],
      ['Spotify (via major clouds)', 'Playback clients', 'Playlists as arrays of track ids — shuffle and “play from #47” are indexes.'],
    ],
  },
  strings: {
    think:
      'A string is an array of characters plus extra rules (encoding, immutability in Java/Python). Frequency maps solve anagrams. Two pointers solve palindromes. Naive find is O(n·m). Rolling hash (Rabin–Karp) and KMP make matching linear: you never restart from scratch after a mismatch. Tries (later topic) share prefixes for autocomplete.',
    analogy:
      'Finding a phrase in a book by sliding a paper window along the line (naive) versus knowing “if I failed at ‘struct’, I can jump because ‘str’ already matched” (KMP). Autocomplete is a family tree of prefixes: t → te → tea → team.',
    mistake:
      'Building strings with `+` in a loop (immutable copies → quadratic). Comparing every pattern to every position without a better matcher on huge logs. Forgetting Unicode: “character” ≠ always one byte.',
    walk: [
      { title: 'Classify the question', text: 'Frequency? Palindrome? Search? Prefix? Split into those families.' },
      { title: 'Match once, well', text: 'KMP/Z/rolling hash when the haystack is huge.' },
      { title: 'Share prefixes', text: 'Autocomplete and spell-prefix → trie, not n dictionary scans.' },
      { title: 'Watch copies', text: 'StringBuilder / join; never `s = s + ch` in a hot loop.' },
    ],
    scale:
      'Search boxes, compilers and spam filters live or die on linear-time string algorithms.',
    bigTech: [
      ['Google', 'Search query & Safe Browsing', 'Query rewriting, spelling, and pattern matching at corpus scale.'],
      ['Microsoft', 'VS Code / Office', 'Find-in-files and grammar; large buffers cannot use naive n·m search as the default.'],
      ['Meta', 'Integrity / spam', 'Matching bad patterns in posts and ads — automata and hashes, not nested scans of the whole corpus per rule.'],
      ['Apple', 'Spotlight / Safari', 'Prefix and substring search over on-device indexes.'],
      ['Amazon', 'Product search', 'Tokenisation, prefix completion, and matching titles/ASIN strings under tight latency.'],
    ],
  },
  hashing: {
    think:
      'A hash function sprays keys across buckets. Average lookup O(1) if the spray is even and load factor is bounded. Collisions are normal: chaining (list per bucket) or open addressing (probe neighbours). Equality must match hashing: if two keys are “the same”, they need the same hash. Prefix hashes turn substring equality into integer compares. Bloom filters (advanced) trade a little error for tiny memory.',
    analogy:
      'Coat-check tickets: ticket number → hook. Two coats on one hook = collision; you check labels. A terrible hash is “everyone born in January” — one overloaded hook. Redis and Python `dict` are this cloakroom with automatic extra hooks as the party grows.',
    mistake:
      'Using a mutable object as a key after you put it in the map (hash changes, entry vanishes). Assuming O(1) worst case — attacks and bad hashes exist; languages randomise seeds for a reason. Using hash maps when you needed order (then you wanted a tree / LinkedHashMap).',
    walk: [
      { title: 'Need “have I seen this?”', text: 'Set / map. That is the default interview upgrade from a nested loop.' },
      { title: 'Need the complement', text: 'Two-sum: store `target - x` as you go.' },
      { title: 'Need groups', text: 'Anagrams: key = sorted letters or a count signature.' },
      { title: 'Need substring equality often', text: 'Rolling / prefix hashes, with a mod and a base.' },
    ],
    scale:
      'Caches, session stores and feature stores are hash maps with TTLs and eviction. If lookup is not O(1), the site is down.',
    bigTech: [
      ['Amazon', 'DynamoDB', 'Partition key hashed to a shard — the whole product is “hash then local structure”.'],
      ['Google', 'Bigtable / caches', 'Row keys and memcache-style lookups; consistent hashing in some serving stacks.'],
      ['Meta', 'Memcache / TAO cache', 'Hot objects live in giant hash maps in RAM in front of slower stores.'],
      ['Netflix', 'EVCache', 'Distributed memcached: hash the key, pick a node, O(1) get/set for playback metadata.'],
      ['Cloudflare / Fastly', 'CDN cache keys', 'URL (+ vary headers) hashed to a slot so the same asset is not fetched twice from origin.'],
    ],
  },
  'two-pointers': {
    think:
      'Two indices move according to a rule that never needs to rewind. Sorted two-sum: left++ if sum too small, right-- if too big. Merge two sorted lists: always take the smaller head. Opposite directions vs same direction (fast/slow for cycles, read/write for in-place compact). The invariant is “everything outside the pointers is already decided”.',
    analogy:
      'Two people walking a bookshelf: one from the cheap end, one from the expensive end, looking for a pair that sums to your budget. They only step inward. Meeting in the middle means no such pair — you never walk backwards.',
    mistake:
      'Moving both pointers without a proven invariant (you skip the answer). Using two pointers on an unsorted array for two-sum without a hash — that only works sorted. Off-by-one when they cross.',
    walk: [
      { title: 'Is the array sorted (or can it be)?', text: 'Opposite-ends two pointers or binary search.' },
      { title: 'Merging two ordered streams?', text: 'One pointer per stream, always advance the smaller.' },
      { title: 'In-place keep/drop?', text: 'Read pointer and write pointer, same direction.' },
      { title: 'Cycle in a list?', text: 'Fast and slow — a later topic, same family.' },
    ],
    scale:
      'Database engines merge sorted runs this way; video editors walk in/out points this way.',
    bigTech: [
      ['Google', 'Spanner / BigQuery execution', 'Merge joins on sorted inputs: two pointers, not nested loops, when the planner can sort or use an index.'],
      ['Microsoft', 'SQL Server / Excel', 'Merge-style combining of ordered ranges; two-index compaction in filters.'],
      ['Amazon', 'Log pipelines', 'Merging sorted Kinesis/Kafka shards into a time-ordered view.'],
      ['Meta', 'Photo/video trim tools', 'Start and end handles are two indices over a frame array.'],
      ['Apple', 'Photos memories', 'Selecting a time range on a timeline — two pointers over assets ordered by date.'],
    ],
  },
  'sliding-window': {
    think:
      'A window is a contiguous slice `[left, right]` with a running summary (sum, counts, max). Expand right to include new data; shrink left when the invariant breaks (“at most k distinct”, “sum ≤ budget”). Each index enters and leaves at most once → O(n). Fixed size k is a special case: add `a[i]`, drop `a[i-k]`.',
    analogy:
      'A subway car that holds at most k people: as a new rider boards at the front, if you are over capacity the oldest rider at the back gets off. You never recount the whole car — you maintain the count. Rate limits (“100 requests / minute”) are the same car, measured in time.',
    mistake:
      'Restarting the window from scratch each step (back to O(n²)). Shrinking too much and skipping a valid window. Using a window for non-contiguous problems (subsequences, not subarrays).',
    walk: [
      { title: 'Is it contiguous?', text: 'If not, it is not a window (maybe DP or two pointers on subsequences).' },
      { title: 'What is the invariant?', text: 'At most k, at least score, exactly the set of chars…' },
      { title: 'What do I store?', text: 'Sum, hashmap of counts, deque of max candidates.' },
      { title: 'Move right always, left as needed', text: 'Each index processed O(1) times.' },
    ],
    scale:
      'Every “last 5 minutes” dashboard and every API rate limiter is a window on a stream that never ends.',
    bigTech: [
      ['Google', 'Cloud Armor / Ads click quality', 'Rate and anomaly windows over request streams.'],
      ['Amazon', 'API Gateway / WAF', 'Token bucket and sliding-window counters per customer key.'],
      ['Meta', 'Live video / integrity', 'Reports and viewer counts in recent time windows, not full-history scans.'],
      ['Netflix', 'Streaming telemetry', 'Rebuffering and bitrate decisions over recent seconds of playback.'],
      ['Microsoft', 'Azure Monitor', 'Metric charts: rolling aggregates over time windows at ingest.'],
    ],
  },
  'binary-search': {
    think:
      'If the search space is sorted or *monotonic* (false, false, … true, true), you can throw away half each test. On an array: compare mid. On “the answer”: mid is a candidate capacity / wait time / cutoff — simulate whether it works, then search left or right. The loop must shrink `[lo, hi]` every time or you infinite-loop. Decide whether you want first true or last true; that choice is the only hard part.',
    analogy:
      'Guess a number 1–100: “too low / too high” halves the range. Git bisect is that game on commits. “Smallest server size that still hits p99 SLA” is the same game on integers of RAM.',
    mistake:
      '`while (lo <= hi)` with `mid` updates that do not shrink (off-by-one forever). Binary searching an unsorted array. Using overflow-unsafe `(lo+hi)/2` on huge indexes — prefer `lo + (hi-lo)/2`.',
    walk: [
      { title: 'Is it monotonic?', text: 'If you cannot say “left is all bad, right is all good”, do not binary search.' },
      { title: 'Array or answer space?', text: 'Answer-space: write `ok(mid)` first, then wrap the search.' },
      { title: 'Pick first vs last true', text: 'Draw a T/F row and see which index you want.' },
      { title: 'Prove the window shrinks', text: 'Every branch must change lo or hi.' },
    ],
    scale:
      'Feature rollouts, capacity planning and version lookup are binary search at company scale.',
    bigTech: [
      ['Google', 'Chubby / Borg / experiments', 'Finding a version or a config threshold; bisecting production regressions internally like git bisect.'],
      ['Microsoft', 'Windows Update / VS', 'Picking a compatible binary from a sorted version list.'],
      ['Meta', 'Canary / gatekeepers', 'Rollout percentages and monotonic “does this break metric X?” probes.'],
      ['Amazon', 'Capacity / autoscaling knobs', 'Search for the cheapest instance shape that still holds latency SLOs.'],
      ['Netflix', 'Encoding ladders', 'Highest quality rung that fits the measured bandwidth — search on bitrate.'],
    ],
  },
  sorting: {
    think:
      'Comparison sorts cannot beat n log n in the worst case (decision tree). Merge sort is stable and n log n always; heap sort is in-place n log n; quicksort is fast average, fragile worst case unless you randomise/median-of-three. Counting/radix sort beat n log n when keys are integers in a small range. Selection (quickselect) finds the k-th without fully sorting. In products, you often sort *once* then binary-search, or keep a heap for top-K instead of sorting all of n.',
    analogy:
      'Sorting exam papers by score: merge sort is split the pile, sort halves, zip them. Counting sort is “bucket 0–100” if scores are integers. Top-10 leaderboard is a heap of size 10, not a full sort of a million players.',
    mistake:
      'Sorting inside a hot loop. Using an unstable sort when equal keys must keep input order (UI that “jumps”). Quicksort on adversarial data without randomisation.',
    walk: [
      { title: 'Do I need full order?', text: 'Top-K → heap. Median → select. Full rank → sort.' },
      { title: 'Are keys small integers?', text: 'Counting / radix.' },
      { title: 'Must equals keep order?', text: 'Stable sort (merge).' },
      { title: 'Memory tight?', text: 'Heapsort / in-place; merge needs buffers.' },
    ],
    scale:
      'Search ranking, log analytics and database `ORDER BY` are industrial sorting.',
    bigTech: [
      ['Google', 'Search ranking / MapReduce shuffle', 'The shuffle phase is a massive distributed sort of key-value pairs.'],
      ['Amazon', 'Product listing', 'Sort + paginate over catalogs; indexes pre-sort what they can.'],
      ['Microsoft', 'Excel / Bing', 'User-facing sorts and index builds; large sheets cannot quadratic-sort.'],
      ['Meta', 'Ads ranking', 'Partial sorts / heaps for top ads per request, not a full catalog sort per user.'],
      ['Apple', 'Photos / Mail', 'On-device sorts by date and person; must stay smooth on phone CPUs.'],
    ],
  },
  recursion: {
    think:
      'A recursive function has a contract (“this returns the size of this folder”) and a base case (empty folder → 0). You assume the contract already works on smaller inputs. The call tree’s size is the complexity: if each call does O(1) and branches into 2 on n/2, you get n. Backtracking is recursion plus undo: choose, recurse, un-choose. Pruning deletes a branch when you can prove it cannot beat the best so far (or violates a constraint).',
    analogy:
      'Russian dolls: to paint a doll you paint the smaller one inside first. Backtracking is a maze: walk a corridor, if it is a dead end you walk back and try the next door — you do not knock down walls, you *undo* the last step. npm resolving versions is that maze through package trees.',
    mistake:
      'Tracing every call in your head past depth 4. Missing the base case (infinite recursion / stack overflow). Forgetting to undo (the next branch sees leftover state). Recursing on overlapping subproblems without memo (then you wanted DP).',
    walk: [
      { title: 'Write the contract in one sentence', text: 'Inputs, output, and that smaller calls are correct.' },
      { title: 'Write the base case first', text: 'Empty, n=0, leaf node.' },
      { title: 'Make a smaller call', text: 'n-1, left/right child, remaining items.' },
      { title: 'If searching, undo', text: 'Push choice, recurse, pop choice. Prune when illegal.' },
    ],
    scale:
      'Compilers, UI trees and package managers are recursion in production. Chess engines are pruned recursion trees.',
    bigTech: [
      ['Google', 'V8 / Closure / proto compilers', 'ASTs are recursive structures; passes walk trees.'],
      ['Meta', 'React / Litho', 'UI trees reconciled recursively; comments and nested replies too.'],
      ['Microsoft', 'TypeScript / .NET compilers', 'Recursive descent parsing and tree transforms.'],
      ['Amazon', 'IAM policy evaluation', 'Nested documents walked recursively with a depth budget.'],
      ['Apple', 'SwiftUI / UIKit hierarchies', 'Layout is a tree walk from root views down.'],
    ],
  },
  'linked-lists': {
    think:
      'A node holds a value and a pointer to the next (and maybe prev). You cannot jump to index i in O(1). Insert/delete is O(1) *if you already hold the node*. Reversal flips pointers; dummy heads simplify edge cases; fast/slow finds the middle or a cycle (Floyd). Losing the `next` reference before you save it is how lists get cut in half by accident.',
    analogy:
      'A treasure hunt: each clue points to the next park bench. You cannot skip to clue 50 without walking. Splicing a new clue between 3 and 4 is easy if you are standing at 3. LRU cache is a scavenger hunt plus a map of “where is this item’s clue” so you can yank it to the front in O(1).',
    mistake:
      'Using a list because “insert is O(1)” but then scanning from the head every time (that is O(n) insert). Forgetting dummy nodes and writing five ifs for head/tail. Cycle detection without Floyd: allocating a set is fine too, but know the O(1) memory trick.',
    walk: [
      { title: 'Draw before/after pointers', text: 'Three boxes, arrows, then the mutation.' },
      { title: 'Save `next` first', text: 'Then rewire. Reverse is a loop of that.' },
      { title: 'Dummy head', text: 'Real head is dummy.next so empty/first-node cases vanish.' },
      { title: 'Need middle or cycle?', text: 'Fast = 2 steps, slow = 1 step.' },
    ],
    scale:
      'Kernels and caches use lists because moving a node is pointer writes, not memcpy of a million elements.',
    bigTech: [
      ['Microsoft', 'Windows kernel', 'IRQL / dispatcher lists — threads wait on linked lists of queues.'],
      ['Google', 'Linux contributions / Borg leftovers', 'Runqueues and LRU-style lists in systems code across the industry, including Google’s Linux work.'],
      ['Amazon', 'ElastiCache Redis', 'Redis objects and LRU/LFU eviction: dict + linked list (or approximations) for recency.'],
      ['Meta', 'HHVM / custom allocators', 'Free lists of memory chunks — classic linked structures in runtimes.'],
      ['Apple', 'XNU kernel', 'Wait queues and some scheduler structures are list-based.'],
    ],
  },
  'stacks-queues': {
    think:
      'Stack: last in, first out (undo, DFS, matching brackets, call stack). Queue: first in, first out (BFS, printers, fair workers). Monotonic stack: you pop while the new element breaks “increasing/decreasing”, which yields next-greater in O(n). Deques give both ends. Priority queues are heaps, next topic — not FIFO.',
    analogy:
      'Stack = plates, or a browser Back button. Queue = a ticket line, or a printer. Kafka is a line of events; consumers walk it in order. Monotonic stack = skyline of buildings: when a taller one arrives, shorter ones in front can never be “next greater” and leave the stack.',
    mistake:
      'Using a stack when order of arrival must be preserved (that is a queue). BFS with a stack (that is DFS). Forgetting that `pop` on empty is a bug — interviews love it.',
    walk: [
      { title: 'Undo / nested matching?', text: 'Stack.' },
      { title: 'Fair processing / BFS layers?', text: 'Queue.' },
      { title: 'Next greater / smaller?', text: 'Monotonic stack, one pass.' },
      { title: 'Both ends?', text: 'Deque (sliding-window maximum).' },
    ],
    scale:
      'Almost every backend is queues with branding: SQS, Pub/Sub, Event Hubs, Kafka.',
    bigTech: [
      ['Amazon', 'SQS / Prime-day checkout', 'Work queues absorb spikes so order service does not drop requests.'],
      ['Google', 'Pub/Sub / Search crawl queues', 'URL frontier is a queue/priority queue of pages to fetch.'],
      ['Microsoft', 'Azure Service Bus / Office undo', 'Messaging queues; document undo stacks in Word/Excel/OneNote.'],
      ['Meta', 'WhatsApp / async job systems', 'Message delivery and background jobs are queues at continental scale.'],
      ['Netflix', 'Playback and encoding jobs', 'Chunked work lined up for workers; client-side undo is a stack of player actions.'],
    ],
  },
  trees: {
    think:
      'A tree is a graph with no cycles and one path from the root to any node. Binary trees: up to two children. BST: left < node < right, so search is binary search on a tree. Traversals: pre (node then children), in (left, node, right — sorted for BST), post (children then node — compute size/height), level-order (BFS, a queue). Most interview tree problems are “recurse on children, combine answers, return”.',
    analogy:
      'A family tree or a company org chart. HTML is a tree: `<body>` contains `<div>` contains `<p>`. A BST is a phone book split into “before this name / after this name” at every page. File Explorer is a tree of folders.',
    mistake:
      'Confusing a general tree with a BST (search is O(n) if unsorted). Recursing without combining child results. Stack overflow on skewed trees (a linked list in disguise) — know O(n) worst-case BST without balancing.',
    walk: [
      { title: 'Is there BST order?', text: 'Use it; do not scan the whole tree.' },
      { title: 'What must a node return?', text: 'Height, size, “best in this subtree”, validity flags.' },
      { title: 'Pick a traversal', text: 'Need parent-before-child? Pre. Need sorted? In-order BST. Need children first? Post.' },
      { title: 'Level by level?', text: 'Queue BFS, not recursion.' },
    ],
    scale:
      'DOMs, indexes and org/permission systems are trees. Databases use B-trees so a disk round-trip still jumps over millions of keys.',
    bigTech: [
      ['Google', 'Chrome DOM / Spanner indexes', 'Layout trees in the browser; B-tree-like indexes in storage.'],
      ['Apple', 'Finder / Core Data', 'Folder trees and on-device indexes.'],
      ['Microsoft', 'NTFS / SQL Server', 'B-trees and allocation trees on disk.'],
      ['Amazon', 'IAM / org trees', 'Accounts, OUs and resource hierarchies walked as trees.'],
      ['Meta', 'React Fiber / comment threads', 'UI and nested social objects as trees with recursive layout.'],
    ],
  },
  heaps: {
    think:
      'A binary heap is a complete tree in an array where each parent is ≤ (min-heap) or ≥ (max-heap) its children. Peek O(1), insert/delete O(log n). You cannot find an arbitrary key in O(log n) without extra maps. Top-K: keep a min-heap of size K. Two heaps for median. Dijkstra: min-heap of tentative distances. k-way merge: heap of current heads.',
    analogy:
      'A hospital triage board: the next patient is always the most urgent (peek), and inserting a new case bubbles them to the right place (log n), not a full re-sort. A game leaderboard of top 10 is a heap of 10, not a sorted list of a million scores.',
    mistake:
      'Using a heap to search for an arbitrary id (that is a hash/tree). Treating heap order as fully sorted (only the root is extreme). Building n inserts O(n log n) when `heapify` is O(n).',
    walk: [
      { title: 'Need repeated “best next”?', text: 'Heap. Dijkstra, scheduling, merging.' },
      { title: 'Need top K of a stream?', text: 'Min-heap of K for the K largest.' },
      { title: 'Need median of a stream?', text: 'Max-heap + min-heap split.' },
      { title: 'Need decrease-key often?', text: 'Binary heap is awkward; Dijkstra still works with extra inserts.' },
    ],
    scale:
      'Maps routing, job schedulers and ranking “top stories” are heaps on the hot path.',
    bigTech: [
      ['Google', 'Maps / Ads auction-ish ranking', 'Dijkstra/A* with a priority queue; retrieval keeps a bounded best set.'],
      ['Uber', 'Dispatch', 'Priority among candidate drivers/trips under a time budget — heap-like selection.'],
      ['Microsoft', 'Windows / Azure schedulers', 'Next-run timers and jobs in priority queues.'],
      ['Amazon', 'Warehouse / routing', 'Next-best pick or route fragment under constraints.'],
      ['Netflix', 'Top-N rows on a page', 'Bounded heaps / partial sort for “top 10 in your country” style lists.'],
    ],
  },
  graphs: {
    think:
      'Vertices + edges. Undirected vs directed, weighted vs not. Store as adjacency list (sparse, the default) or matrix (dense, O(1) edge check, O(n²) memory). BFS = queue = shortest unweighted path. DFS = stack/recursion = cycles, components, topo on DAGs. Dijkstra = BFS with a heap when weights are ≥ 0. Bellman-Ford allows negatives. Union-Find tracks connectivity for Kruskal MST. Many “word ladder / course schedule / accounts merge” problems are graphs in disguise: name the nodes, name the edges, then walk.',
    analogy:
      'A metro map. BFS is “fewest stops”. Dijkstra is “shortest time” if lines have different speeds. Topological sort is “put on socks before shoes” — an order that never uses something before it is ready. Union-Find is “are these two train systems already connected if we keep adding tracks?”',
    mistake:
      'BFS for weighted shortest paths (wrong if weights vary). Dijkstra with negatives (wrong). Forgetting visited (infinite loops). Modelling the wrong graph (states as nodes, not just cities — e.g. “city + fuel”).',
    walk: [
      { title: 'What is a node? What is an edge?', text: 'Write it down. If stuck, you have not modelled it.' },
      { title: 'Weighted? Directed? Cyclic?', text: 'Picks BFS vs Dijkstra vs topo vs Union-Find.' },
      { title: 'Walk or reduce?', text: 'Shortest path / components vs MST vs matching.' },
      { title: 'State-space graphs', text: 'Sometimes the node is a tuple (position, remaining k).' },
    ],
    scale:
      'Social networks, road networks, microservice meshes and the web are graphs. Big tech spends billions on storing and walking them without touching every node.',
    bigTech: [
      ['Google', 'Maps / Knowledge Graph / PageRank', 'Road graphs, entity graphs, and the original web graph — shortest path, ranking, connectivity.'],
      ['Meta', 'Social graph / TAO', 'Friends and follows; BFS-limited “people you may know”; careful fan-out so a celebrity node does not melt a datacenter.'],
      ['Microsoft', 'LinkedIn (Microsoft) / Azure', 'Professional graph; service dependency graphs in cloud.'],
      ['Amazon', 'Supply chain / recommendations', 'Item–item graphs; warehouse and delivery networks as weighted graphs.'],
      ['Netflix', 'Title similarity graph', 'Walks / embeddings on a catalog graph for “because you watched”.'],
    ],
  },
  greedy: {
    think:
      'Greedy picks the locally best option and never backtracks. It is correct only with a proof (exchange: any optimal solution can swap toward yours without getting worse) or a clear matroid/structure. Huffman: always merge two rarest symbols. Interval scheduling: always take the meeting that *finishes first*. Kruskal: add the cheapest edge that does not cycle. Fractional knapsack: value/weight density. 0/1 knapsack is **not** greedy — that is DP.',
    analogy:
      'Making change with US coins is greedy (quarters then dimes…). Making change with weird coin systems can fail — that is why you need a proof. Booking rooms: always slot the meeting that frees the room soonest, and you fit the maximum number.',
    mistake:
      'Using greedy on 0/1 knapsack or on “minimum coins” with arbitrary denominations. Sorting by the wrong key (start time instead of finish time). Skipping the proof in an interview — they will assume it is wrong.',
    walk: [
      { title: 'What is the local choice?', text: 'Finish first, smallest edge, rarest pair…' },
      { title: 'Exchange argument', text: 'If an optimal differs, swap and it does not get worse.' },
      { title: 'If you cannot prove it', text: 'Try DP or search. Greedy is a guess until proven.' },
      { title: 'Sort once, then scan', text: 'Most greedy coding problems are sort + one pass.' },
    ],
    scale:
      'Compression, networking and some schedulers are greedy because n log n sort + linear scan beats DP tables at datacenter size.',
    bigTech: [
      ['Google', 'YouTube/web compression, Borg packing (heuristics)', 'Huffman-style codes in codecs; cluster packing often greedy/heuristic because exact DP will not finish.'],
      ['Meta', 'Video/image delivery', 'Codecs (Huffman, greedy bit allocation) on billions of uploads.'],
      ['Amazon', 'Warehouse slotting / routing heuristics', 'Greedy assignment under time limits; exact solvers off the hot path.'],
      ['Microsoft', 'Networking / compiler register allocation (heuristics)', 'Graph-colouring-ish greedy in compilers; spanning-tree style network design.'],
      ['Apple', 'HEVC/AAC in iOS', 'Production codecs: greedy bit allocation and Huffman-like entropy coding.'],
    ],
  },
  'dynamic-programming': {
    think:
      'DP = recursion + a notebook. Overlapping subproblems (you see the same arguments again) + optimal substructure (best of n is built from best of smaller). State = the arguments you must remember (`i`, `j`, remaining capacity). Transition = the recurrence. Base cases = the edges of the table. Memoisation fills on demand; tabulation fills in an order that respects dependencies. Space: if you only need the previous row, drop the rest.',
    analogy:
      'A road trip with repeated towns: the first time you learn the fastest way from town T to the destination, you write it on a sticky note. Next time you arrive at T, you read the note. Git diff is two strings as towns `(i, j)`: “prefix of A vs prefix of B”. Knapsack is towns `(item index, leftover capacity)`.',
    mistake:
      'Loops without a sentence for `dp[i]`. Forgetting base cases. Iterating in the wrong direction (using a cell before it is ready; 0/1 knapsack inner loop must go backwards if you update in place). Memoising the wrong arguments (incomplete state → wrong answers).',
    walk: [
      { title: 'Write brute recursion', text: 'Choices at this step, smaller problems.' },
      { title: 'Name the state out loud', text: '`dp[i][c]` is the best value using items 0..i-1 with capacity c.' },
      { title: 'Count states × work', text: 'If that exceeds the time limit, shrink the state.' },
      { title: 'Then code memo or table', text: 'Interviewers grade the sentence more than the for-loops.' },
    ],
    scale:
      'Alignment (diff, translate, speech), recommendations (sequence models have DP cousins), and resource allocation (ads budgets) use this family.',
    bigTech: [
      ['Google', 'Translate / speech / Diff (internal tools)', 'Sequence alignment and decoding are DP or DP-like search (beam search) over lattices.'],
      ['Microsoft', 'VS Code / Git in Azure DevOps', 'Diff and merge: LCS / edit distance family.'],
      ['Amazon', 'Ads & fulfilment allocation', 'Knapsack-style budget splits (often approximated at scale, exact DP on the core subproblem).'],
      ['Meta', 'Integrity classifiers / alignment-ish NLP', 'Sequence labelling historically used DP (CRFs); still the right mental model.'],
      ['Apple', 'Keyboard / autocorrect', 'Edit distance against a dictionary for “did you mean” on-device.'],
    ],
  },
  advanced: {
    think:
      'Tries store strings by shared prefixes: autocomplete in O(length), not O(dictionary). Fenwick (BIT) and segment trees answer range sums/mins with updates in O(log n) — prefix arrays cannot handle updates cheaply. Sparse tables are O(1) range min after O(n log n) build, but immutable. Bloom filters: bits + hashes, can say “definitely not in the set” with no false negatives for membership skip. Skip lists and balanced BSTs (TreeMap, std::set) keep keys ordered with log n insert.',
    analogy:
      'A trie is a signpost forest: T → TE → TEA. A segment tree is a tournament bracket of range summaries: the final holds the whole array, each half holds a half, so “sum of this slice” climbs O(log n) brackets. A Bloom filter is a bouncer with a blurry guest list: they may wrongly stop a real guest (rare), but they never let in someone they *know* is absent — Chrome uses that to skip downloading huge malware lists.',
    mistake:
      'Segment tree when a prefix array would do (no updates). Trie when a hash set of whole words would do (no prefixes). Bloom filter when you cannot tolerate false positives (auth, money).',
    walk: [
      { title: 'Prefix queries on strings?', text: 'Trie.' },
      { title: 'Range query + updates?', text: 'Fenwick if sum; segment tree if min/max/custom merge.' },
      { title: 'Range min, array frozen?', text: 'Sparse table.' },
      { title: 'Tiny membership, can allow maybe?', text: 'Bloom filter in front of disk/network.' },
    ],
    scale:
      'This is the difference between “works in the lab” and “autocomplete at Google” or “range sums on a dashboard with live writes”.',
    bigTech: [
      ['Google', 'Search suggest / Bigtable', 'Tries/FSTs for queries; LSM/B-tree storage; Bloom filters in front of SSTables (LevelDB/RocksDB family, used widely including at Google-originated stacks).'],
      ['Amazon', 'DynamoDB / Aurora', 'B-trees and LSM variants; Bloom filters to skip missing keys on disk.'],
      ['Meta', 'RocksDB (widely used) / TAO', 'Bloom filters + LSM; prefix structures for typeahead.'],
      ['Microsoft', 'Bing / SQL Server', 'Autocomplete structures; B-trees and columnstores for range aggregates.'],
      ['Apple', 'Spotlight / Safari suggest', 'On-device tries/indexes for prefix search without sending every keystroke to a server.'],
    ],
  },
};

export function industryBlocks(guide: IndustryGuide): Block[] {
  return [
    { kind: 'heading', text: 'Slow down: what this actually means' },
    { kind: 'para', text: guide.think },
    { kind: 'callout', tone: 'note', title: 'Picture this', text: guide.analogy },
    { kind: 'callout', tone: 'trap', title: 'The mix-up to avoid', text: guide.mistake },
    { kind: 'heading', text: 'How to use it, in order' },
    { kind: 'steps', items: guide.walk },
  ];
}
