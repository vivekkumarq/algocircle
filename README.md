<div align="center">

<img src="public/favicon.svg" width="72" alt="AlgoCircle" />

# AlgoCircle

**Data structures and algorithms, explained from scratch.**

Twenty topics in the order that makes each one easier than the last — from what an algorithm even
is, through to segment trees and dynamic programming.

[Read it here](https://vivekkumarq.github.io/algocircle/) · [All topics](https://vivekkumarq.github.io/algocircle/learn)

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

179 sections, roughly 548 minutes of reading.

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

## Tech stack

| Area | Choice |
| ---- | ------ |
| Framework | Angular 22, standalone components, zoneless |
| Language | TypeScript 6 |
| State | Angular signals |
| Styling | SCSS with CSS custom properties for theming |
| Routing | Angular Router, every route lazy-loaded |
| Tests | Vitest via `@angular/build:unit-test` |
| Hosting | GitHub Pages, published straight from this repository |

No server, no API, no authentication, no database. Once the page has loaded it works offline.

## Architecture

```
src/
├── styles/                     design tokens and global base styles
└── app/
    ├── core/
    │   ├── models/             content types
    │   └── services/           theme, storage, SEO, layout
    ├── shared/components/      animated logo, icons, content renderer
    ├── layout/                 header, sidebar, mobile drawer, shell, footer
    ├── features/               home, learn (index + topic page), 404
    ├── data/
    │   ├── chapters/           the curriculum, as typed content blocks
    │   └── topics.data.ts      lightweight metadata for the navigation
    └── app.routes.ts           four routes
```

Three rules hold it together:

1. **Content is data, not markup.** A topic is an array of typed blocks — prose, code, tables,
   diagrams, callouts, comparisons. `ContentBlocks` is the only component that knows how a lesson
   is rendered, so restyling the whole course means editing one file.
2. **Navigation metadata is separate from lesson text.** `topics.data.ts` mirrors the chapters
   without their content, so the sidebar and landing page never drag 275 kB of prose into the
   initial bundle. A test fails the build if the two ever drift apart.
3. **One door to storage.** Only `StorageService` touches `localStorage`, under versioned keys.
   Today that is just the theme preference.

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

Hosted on **GitHub Pages from this repository** — no other host or service is involved.

Pushing to `main` runs `.github/workflows/deploy.yml`, which installs dependencies, runs the tests,
builds with `--base-href /algocircle/`, copies `index.html` to `404.html` so deep links survive a
refresh, and publishes. Pages is configured under *Settings → Pages → Source: GitHub Actions*.

## Content and attribution

The curriculum covers the same well-known algorithms every DSA course does — there is only one
Dijkstra. The explanations, examples, diagrams and code here are written for this project, not
copied from other learning platforms. Where the site reports numbers — topics, sections, reading
minutes — they are computed from the content in this repository.

## Licence

MIT. See [LICENSE](LICENSE).
