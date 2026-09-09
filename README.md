<div align="center">

<img src="public/favicon.svg" width="72" alt="AlgoCircle" />

# AlgoCircle

**Learn the concepts. Recognise the patterns. Solve the problems. Prepare for the interview.**

A structured data structures and algorithms learning platform that runs entirely in the browser —
no backend, no database, no account.

[Live site](https://vivekkumarq.github.io/algocircle/) · [Roadmap](https://vivekkumarq.github.io/algocircle/roadmap)

</div>

---

## What this is

Most DSA resources are a list of problems. AlgoCircle is built around the idea that the useful skill
is not "I solved 500 problems" but:

> given an unfamiliar problem, recognise the underlying pattern, choose a data structure and
> algorithm, reason about complexity and trade-offs, implement it, explain it, and still remember it
> next month.

So the platform is organised as a loop:

```
LEARN -> VISUALISE -> RECOGNISE -> PRACTISE -> SOLVE -> OPTIMISE -> EXPLAIN -> REVISE -> INTERVIEW
```

Everything — the curriculum, the problems, the progress tracking — ships with the application and
runs client-side. Your progress is stored in your own browser and never leaves your device.

## Features

**Available now**

- **A written curriculum.** Chapters with definitions, worked examples, diagrams, comparison tables,
  common traps and "check yourself" questions — starting with *Why DSA*, which explains what the
  subject is and why it matters before a line of code
- A 20-stage roadmap covering 250 mapped concepts, with prerequisites, difficulty, time estimates
  and a syllabus for every stage; stages without a written chapter show their outline instead
- Completion tracking with a recommended-next-stage engine that respects prerequisites
- Light, dark and system themes with no flash of the wrong theme on load
- Responsive application shell: sidebar on desktop, off-canvas drawer on mobile
- A landing page covering the roadmap, an interactive pattern explorer, the problem-page workflow
  and interview preparation
- Accessibility groundwork: skip link, semantic landmarks, ARIA state, visible focus, reduced-motion
  support, and status never conveyed by colour alone
- Route-level SEO (titles, meta description, Open Graph, canonical URL, sitemap, robots)

**Planned**

| Phase | Scope |
| ----- | ----- |
| 2 | Remaining chapters (strings, hashing, trees, graphs, DP ...) and the full pattern library — *in progress* |
| 3 | Problem catalogue, client-side search, filters, Problem DNA |
| 4 | Progressive hints, staged solutions, notes, bookmarks |
| 5 | Dashboard, mastery, weak areas, spaced revision, analytics |
| 6 | Algorithm and data-structure visualisers with playback controls |
| 7 | Personalised roadmap, daily challenge, constraint-to-algorithm tool |
| 8 | Company preparation, mock interview, timed online assessment |
| 9 | Encyclopedia, cheat sheets, advanced track, performance and a11y polish |

Sections from later phases are routed to a placeholder that states what will be there, so navigation
never leads to a dead link.

## Tech stack

| Area | Choice |
| ---- | ------ |
| Framework | Angular 22, standalone components, zoneless |
| Language | TypeScript 6 |
| State | Angular signals |
| Styling | SCSS with CSS custom properties for theming |
| Routing | Angular Router, every route lazy-loaded |
| Persistence | `localStorage` behind a single versioned service |
| Tests | Vitest via `@angular/build:unit-test` |
| Hosting | GitHub Pages, published straight from this repository |

There is deliberately no server, no API and no authentication. Once the page has loaded, the
application works offline.

## Architecture

```
src/
├── styles/                  design tokens and global base styles
└── app/
    ├── core/
    │   ├── models/          content and navigation interfaces
    │   └── services/        storage, theme, progress, SEO, layout
    ├── shared/components/   icon, animated logo, progress bar, badges, content renderer
    ├── layout/              header, sidebar nav, mobile drawer, shell, footer
    ├── features/            home, roadmap, learn, placeholder, 404
    ├── data/
    │   ├── chapters/        the written curriculum, as typed content blocks
    │   └── roadmaps/        stages, prerequisites and syllabi
    └── app.routes.ts        the full route table
```

Two rules hold the structure together:

1. **Content is data, not markup.** Curriculum content lives in `app/data` as typed records;
   components render whatever the data says. Adding a topic never means editing a component.
2. **One door to storage.** No component calls `localStorage`. `StorageService` owns the namespaced,
   versioned keys (`algocircle:v1:*`) so the persisted shape can evolve safely.

## Local setup

```bash
git clone https://github.com/vivekkumarq/algocircle.git
cd algocircle
npm install
npm start          # http://localhost:4200
```

Other commands:

```bash
npm run build      # production build into dist/algocircle/browser
npm test           # run the unit tests once
npm run watch      # rebuild on change
```

## Deployment

The site is hosted on **GitHub Pages from this repository** — there is no other host, service or
external dependency involved.

Pushing to `main` runs `.github/workflows/deploy.yml`, which:

1. installs dependencies and runs the unit tests,
2. builds with `--base-href /algocircle/`,
3. copies `index.html` to `404.html` so deep links such as `/roadmap` survive a refresh,
4. publishes the build to GitHub Pages.

Pages is configured under *Settings -> Pages -> Source: GitHub Actions*. Nothing needs to be
deployed by hand.

## Screenshots

Screenshots of the landing page, roadmap and dark mode go here once the interface settles.

## Content and attribution

The curriculum covers the same well-known algorithms every DSA course does, but the explanations,
examples, templates and diagrams are written for this project. Nothing is scraped from or copied out
of other learning platforms. Where the platform reports numbers — stages, concepts, estimated hours —
they are computed from the data in the repository rather than invented.

## Licence

MIT. See [LICENSE](LICENSE).
