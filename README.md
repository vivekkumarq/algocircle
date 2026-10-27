<div align="center">

<img src="public/favicon.svg" width="72" alt="AlgoCircle" />

# AlgoCircle

**Data structures and algorithms, explained from scratch.**

Twenty topics in the order that makes each one easier than the last — from what an algorithm even
is, through to segment trees and dynamic programming.

[Read it here](https://algocircle.duckdns.org/) · [All topics](https://algocircle.duckdns.org/learn) · [Roadmap](https://algocircle.duckdns.org/roadmap) · [Practice list](https://algocircle.duckdns.org/list/core-75) · [Advanced course](https://algocircle.duckdns.org/course)

</div>

---

## What this is

A written DSA course that runs entirely in the browser. No account, no progress gamification,
nothing locked — open any topic and read it.

The order is deliberate: by the time you reach graphs, recursion and heaps are already behind you.
But it is only a suggestion, and every topic is reachable from the sidebar at any time.

It starts with **Why DSA**, which explains what data structures and algorithms actually are, why a
slow program stays slow on fast hardware, and where this machinery already runs in software you used
today — before a single line of code.

## The curriculum

| # | Topic | | # | Topic |
|---|---|---|---|---|
| 01 | Why DSA | | 11 | Sorting & Selection |
| 02 | Programming Foundations | | 12 | Recursion & Backtracking |
| 03 | Complexity Analysis | | 13 | Linked Lists |
| 04 | Mathematics for DSA | | 14 | Stacks & Queues |
| 05 | Arrays | | 15 | Trees |
| 06 | Strings | | 16 | Heaps & Priority Queues |
| 07 | Hashing | | 17 | Graphs |
| 08 | Two Pointers | | 18 | Greedy Algorithms |
| 09 | Sliding Window | | 19 | Dynamic Programming |
| 10 | Binary Search | | 20 | Advanced Structures |

219 sections, roughly 708 minutes of reading.

## Interactive diagrams

Nineteen diagrams are built into the lessons. Fifteen of them animate, with play, pause, step and
reset: graph traversal (breadth-first or depth-first), binary search, insertion sort, sliding
window, two pointers, linked-list reversal, tree traversal in three orders, heap sift-up, hash
buckets with a collision, stack versus queue, a dynamic-programming table filling in cell by cell
with the cells it reads from highlighted, KMP against the naive scan with live comparison counts,
palindrome centre expansion, and greedy interval selection and merging. Most of them build their
frames by **actually running the algorithm** — a real BFS, a real insertion sort, a real sift-up —
so a picture cannot drift away from the text beside it. The other four are prefix sums (pick a
range and watch the subtraction), memory layout, growth curves and a recursion tree.

## The curriculum map

The landing page carries an interactive dependency map: every topic as a node, with an edge from
each of its prerequisites. Hover one and it traces the whole chain it depends on and everything it
unlocks, dimming the rest; click to open it. Layout positions are hand-placed in
`topic-graph.data.ts` while the edges come from the topics themselves, and tests fail the build if a
topic is ever placed above one of its own prerequisites.

The [**full roadmap**](https://algocircle.duckdns.org/roadmap) is the same map with room
to move: drag to pan, scroll or pinch to zoom, and click any topic to open its lesson. It opens
fitted to the window and refits while you resize, until you take control of the view yourself.

## How to learn

Knowing what a heap is does not make anyone good at this, so there is a separate corner for the
part that is usually left unwritten:

- [**How to build problem-solving logic**](https://algocircle.duckdns.org/guide/build-logic)
  — four stages from staring at a blank screen to recognising shapes, and a protocol for being stuck
- [**From idea to working code**](https://algocircle.duckdns.org/guide/write-the-code)
  — naming the state and invariant before typing, the four bugs behind most failures, and the script
  for explaining a solution out loud
- [**A realistic plan**](https://algocircle.duckdns.org/guide/study-plan)
  — how long this actually takes, what one good session looks like, and how to tell you are improving

## Patterns and worked problems

Two halves of the same idea. The [**pattern library**](https://algocircle.duckdns.org/patterns)
holds the 24 recurring problem shapes — each with the phrases in a statement that give it away, why
it works, a template, its variations and the mistakes that break it.

The [**76 worked problems**](https://algocircle.duckdns.org/problems) are how you drill
them. Every problem opens with the statement and nothing else, then reveals graded hints one at a
time, then the brute force and its cost, then the optimal approach — and only after that the code.
Each names its pattern, links to the topic that teaches it, and ends with the one sentence worth
remembering.

## The Core List

[**The Core List**](https://algocircle.duckdns.org/list/core-75) is the curated practice
run: every problem in the catalogue, grouped into the eighteen classic interview categories —
arrays and hashing, two pointers, sliding window, stack, binary search, linked list, trees, tries
and bit manipulation, heaps, backtracking, graphs, dynamic programming, greedy, intervals, sorting
and selection, maths, range queries, and reading the constraints — and ordered so each group builds
on the one before. Search it, filter it by difficulty, and open any row for the full write-up.

Every solution is given in **both Java and Python**, on a tab switch, after the hints and the
approaches rather than before them.

## The advanced course

[**Advanced Algorithms**](https://algocircle.duckdns.org/course) is 22 lessons on the
techniques that turn a correct solution into an optimal one, grouped into eight sections:

| Section | Lessons |
| ------- | ------- |
| Arrays | Kadane's algorithm · sliding window, fixed and variable · two pointers · prefix sums |
| Linked lists | Fast and slow pointers |
| Trees | Iterative DFS |
| Advanced structures | Trie · Union-Find · segment tree |
| Heaps | Two heaps |
| Backtracking | Subsets · combinations · permutations |
| Graphs | Dijkstra · Prim · Kruskal · topological sort |
| Dynamic programming | 0/1 knapsack · unbounded knapsack · LCS · palindromes |

Each lesson states the idea in plain words, proves why the technique is correct, gives the code in
Java and Python, tabulates the cost against the alternatives, names the mistake people make, and
ends with a question and the problems that drill it.

## Search

Press `/` anywhere (or `Ctrl`+`K`) to search every topic, section, pattern, problem, algorithm,
interview question, course lesson and guide on the site — over 900 entries, ranked with title matches first and
navigable entirely from the keyboard. The index is built from a dynamic import the first time it is
opened, so none of that content sits in the initial bundle.

## Interview questions

[560 questions with answers](https://algocircle.duckdns.org/interview), grouped by topic
in curriculum order and filterable by difficulty or free-text search. These are the conceptual
questions a DSA round opens with — what a structure costs, why an algorithm is correct, which
trade-off you would make — rather than a list of problems to grind.

## Appearance

Ten palettes — Light, Paper, Slate, Aurora, Dark, Midnight, Forest, Ocean, Ember and Contrast —
plus System, which follows the operating system's light or dark setting; six typefaces
(sans, serif, rounded, script, marker and monospace, all shipped with the operating system so
nothing is downloaded) and three text sizes, switchable from the header and remembered per browser.
Each topic also paints its own background wash, so you can tell at a glance that the page changed.

## How each topic is written

Every topic follows the same structure, so you always know where to look:

- **What you will be able to do** — concrete outcomes, stated up front
- **The concept from scratch** — plain language, with the reasoning, not just the definition
- **Diagrams and worked examples** — memory layouts, traversals and traces you can follow on paper
- **Code in the shape you would actually write it** — short, commented, with the invariant named
- **Complexity, honestly stated** — time and space, best and worst case
- **The traps** — the specific mistakes that break each technique, marked where they happen
- **Check yourself** — a question at the end of hard sections, answer one click away
- **Key takeaways** — the compressed version, for revision

There is also an [Algorithms reference](https://algocircle.duckdns.org/algorithms): 87
algorithms in one filterable table with what each does, how it works, its cost, when to use it, and
a link to the topic that teaches it.

## Tech stack

| Area | Choice |
| ---- | ------ |
| Framework | Angular 22, standalone components, zoneless |
| Language | TypeScript 6 |
| State | Angular signals |
| Styling | SCSS with CSS custom properties for theming |
| Routing | Angular Router, every route lazy-loaded |
| Tests | Vitest via `@angular/build:unit-test` |
| Hosting | GitHub Pages, published straight from this repository, at algocircle.duckdns.org |

No server, no API, no authentication, no database. Each page and the search index download the
first time they are opened, so pages already opened keep working offline and the rest need a
connection.

## Architecture

```
src/
├── styles/                     design tokens and global base styles
└── app/
    ├── core/
    │   ├── models/             content types
    │   └── services/           theme, storage, SEO, layout
    ├── shared/
    │   ├── components/         animated logo, icons, content renderer
    │   └── visuals/            the animated diagrams and their step player
    ├── layout/                 header, sidebar, mobile drawer, shell, footer
    ├── features/               home, learn, roadmap, patterns, problems, lists,
    │                           algorithms, course (both courses), interview, guide, 404
    ├── data/
    │   ├── chapters/           the curriculum, as typed content blocks
    │   ├── guides/             the how-to-learn corner
    │   ├── patterns/           24 problem shapes
    │   ├── problems/           76 worked problems, Python solutions, the Core List
    │   ├── course/             the 22-lesson advanced course
    │   ├── zero-to-hero/       the 33-lesson Zero to Hero course
    │   ├── interview/          560 questions and answers, one file per group
    │   └── topics.data.ts      lightweight metadata for the navigation
    └── app.routes.ts           nineteen lazy routes
```

Four rules hold it together:

1. **Content is data, not markup.** A topic is an array of typed blocks — prose, code, tables,
   diagrams, callouts, comparisons. `ContentBlocks` is the only component that knows how a lesson
   is rendered, so restyling the whole course means editing one file.
2. **Navigation metadata is separate from lesson text.** `topics.data.ts` mirrors the chapters
   without their content, so the sidebar and landing page never drag 275 kB of prose into the
   initial bundle. A test fails the build if the two ever drift apart.
3. **One door to storage.** Only `StorageService` touches `localStorage`, under versioned keys.
   Today that is the appearance preferences, the side panels' state, the chosen code language and
   progress: completed topics, solved problems and the last section read.
4. **Heavy content is imported on demand.** Search pulls the chapters, problems and questions in
   with a dynamic import the first time it opens, so the landing page stays small.

## Local setup

```bash
git clone https://github.com/vivekkumarq/algocircle.git
cd algocircle
npm install
npm start          # http://localhost:4200
```

```bash
npm run build      # production build into dist/algocircle/browser
npm test           # run the unit tests once
```

## Deployment

Hosted on **GitHub Pages from this repository**, served at the custom domain
[algocircle.duckdns.org](https://algocircle.duckdns.org/) (a DuckDNS name pointed at Pages, set by
`public/CNAME`). The old address, vivekkumarq.github.io/algocircle, redirects there.

Pushing to `main` runs `.github/workflows/deploy.yml`, which installs dependencies, checks the
palettes, runs the tests, builds with `--base-href /`, copies `index.html` to `404.html` so any
unknown path still boots the app, gives every page in the sitemap its own copy so deep links answer
with status 200 (`tools/static-routes.mjs`), and publishes. Pages is configured under
*Settings → Pages → Source: GitHub Actions*.

## Content and attribution

The curriculum covers the same well-known algorithms every DSA course does — there is only one
Dijkstra. The explanations, examples, diagrams and code here are written for this project, not
copied from other learning platforms. Where the site reports numbers — topics, sections, reading
minutes — they are computed from the content in this repository.

## Licence

MIT. See [LICENSE](LICENSE).
