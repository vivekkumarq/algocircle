import { Routes } from '@angular/router';

/**
 * Every route is lazy. Sections that arrive in a later build phase resolve to
 * the shared placeholder with their planned contents in route data, so the
 * navigation never leads to a dead end.
 */
const comingSoon = () =>
  import('./features/coming-soon/coming-soon').then((m) => m.ComingSoon);

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
    data: {
      description:
        'AlgoCircle is a structured data structures and algorithms curriculum: learn the concepts, recognise the patterns, visualise the algorithms and prepare for interviews. Free, static, no account.',
    },
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      {
        path: 'roadmap',
        title: 'DSA Roadmap',
        loadComponent: () => import('./features/roadmap/roadmap').then((m) => m.Roadmap),
        data: {
          description:
            'The ordered path through data structures and algorithms, with prerequisites, concept counts and time estimates for every stage.',
        },
      },

      // ---- Learn -------------------------------------------------------
      {
        path: 'learn',
        title: 'Curriculum',
        loadComponent: () => import('./features/learn/learn-index').then((m) => m.LearnIndex),
        data: {
          description:
            'The AlgoCircle curriculum: every stage of the DSA path, from why the subject matters through to advanced data structures.',
        },
      },
      {
        path: 'learn/:slug',
        loadComponent: () => import('./features/learn/chapter-page').then((m) => m.ChapterPage),
        data: {
          description:
            'A DSA chapter with concepts explained from scratch, worked examples, diagrams and the traps to avoid.',
        },
      },
      {
        path: 'patterns',
        title: 'Pattern Library',
        loadComponent: comingSoon,
        data: {
          breadcrumb: 'Learn / Patterns',
          icon: 'layers',
          heading: 'Pattern library',
          blurb:
            'Around twenty-five reusable problem shapes, each with recognition signals, a generic template, variations, common mistakes and graded practice.',
          phase: 2,
          description: 'A library of DSA problem-solving patterns with recognition signals and templates.',
          plans: [
            'Recognition signals: the phrases that give the pattern away',
            'A generic template you can adapt',
            'Variations and where the template breaks',
            'Easy, medium and hard practice per pattern',
          ],
        },
      },

      // ---- Practice ----------------------------------------------------
      {
        path: 'problems',
        title: 'Problems',
        loadComponent: comingSoon,
        data: {
          breadcrumb: 'Practice / Problems',
          icon: 'target',
          heading: 'The problem catalogue',
          blurb:
            'Filterable practice problems with a progressive hint system, staged approaches and the Problem DNA panel that explains why a problem belongs to its pattern.',
          phase: 3,
          description: 'Filterable DSA practice problems with hints, approaches and pattern analysis.',
          plans: [
            'Filter by topic, difficulty, pattern, company and status',
            'Four graded hints before any solution is revealed',
            'Brute force, better and optimal approaches in order',
            'Problem DNA: pattern, prerequisites, signals and the common trap',
          ],
        },
      },
      {
        path: 'search',
        title: 'Search',
        loadComponent: comingSoon,
        data: {
          breadcrumb: 'Search',
          icon: 'search',
          heading: 'Search everything',
          blurb:
            'One client-side index across problems, topics, concepts, algorithms, patterns and companies, with keyboard shortcuts and recent searches.',
          phase: 3,
          description: 'Client-side search across the whole AlgoCircle curriculum.',
          plans: [
            'Instant results with highlighted matches',
            'Keyboard-first: open with /, navigate with arrows',
            'Recent searches and suggestions',
            'Grouped results by content type',
          ],
        },
      },
      {
        path: 'practice/topics',
        title: 'Topic Practice',
        loadComponent: comingSoon,
        data: {
          breadcrumb: 'Practice / Topics',
          icon: 'target',
          heading: 'Topic practice',
          blurb: 'Drill one topic at a time, ordered from the gentlest problem to the hardest.',
          phase: 3,
          description: 'Practise DSA problems grouped by topic.',
          plans: ['Ordered sets per topic', 'Difficulty progression', 'Completion tracking per topic'],
        },
      },
      {
        path: 'practice/patterns',
        title: 'Pattern Practice',
        loadComponent: comingSoon,
        data: {
          breadcrumb: 'Practice / Patterns',
          icon: 'layers',
          heading: 'Pattern practice',
          blurb:
            'Practise the recognition step itself: read a problem statement and name the pattern before you write anything.',
          phase: 7,
          description: 'Train pattern recognition on DSA problems.',
          plans: [
            'Pattern recognition drills',
            'Timed recognition rounds',
            'Feedback on the signals you missed',
          ],
        },
      },
      {
        path: 'practice/random',
        title: 'Random Practice',
        loadComponent: comingSoon,
        data: {
          breadcrumb: 'Practice / Random',
          icon: 'compass',
          heading: 'Random practice',
          blurb:
            'An unseen problem with no topic label, which is the condition you actually face in an interview.',
          phase: 7,
          description: 'Random unlabelled DSA problems for interview-condition practice.',
          plans: ['Random draws filtered by difficulty', 'No topic hint until you finish'],
        },
      },
      {
        path: 'practice/daily',
        title: 'Daily Challenge',
        loadComponent: comingSoon,
        data: {
          breadcrumb: 'Practice / Daily',
          icon: 'flame',
          heading: 'Daily challenge',
          blurb:
            'One problem a day, chosen deterministically from the date so everyone gets the same challenge without a server.',
          phase: 7,
          description: 'A deterministic daily DSA challenge with streak tracking.',
          plans: ['Same problem for everyone on a given date', 'Streak tracking', 'A short archive of recent days'],
        },
      },
      {
        path: 'practice/weak-areas',
        title: 'Weak Areas',
        loadComponent: comingSoon,
        data: {
          breadcrumb: 'Practice / Weak areas',
          icon: 'chart',
          heading: 'Weak areas',
          blurb:
            'Accuracy, hint usage and solve time per topic and pattern, turned into a short list of what to fix next.',
          phase: 5,
          description: 'Identify weak DSA topics from your own practice history.',
          plans: ['Accuracy per topic and pattern', 'A ranked list of what to revisit', 'Suggested problems for each gap'],
        },
      },

      // ---- Interview ---------------------------------------------------
      {
        path: 'interview',
        title: 'Interview Roadmap',
        loadComponent: comingSoon,
        data: {
          breadcrumb: 'Interview',
          icon: 'briefcase',
          heading: 'Interview roadmap',
          blurb:
            'A timeline from first revision to the week of the interview, with what to practise and what to stop practising.',
          phase: 8,
          description: 'A preparation timeline for data structures and algorithms interviews.',
          plans: [
            'Plans for 30, 60 and 90 days',
            'What to cover per interview level',
            'How to structure an answer out loud',
            'The week before, and the day of',
          ],
        },
      },
      {
        path: 'interview/companies',
        title: 'Company Preparation',
        loadComponent: comingSoon,
        data: {
          breadcrumb: 'Interview / Companies',
          icon: 'briefcase',
          heading: 'Company preparation',
          blurb:
            'Preparation sets organised by interview level, topics and patterns. No invented question frequencies — just the areas each process tends to lean on.',
          phase: 8,
          description: 'Company-oriented DSA preparation organised by level, topic and pattern.',
          plans: [
            'Level-by-level topic focus',
            'Pattern emphasis per company',
            'A practice set assembled from the catalogue',
            'Clear sourcing, with no fabricated statistics',
          ],
        },
      },
      {
        path: 'interview/mock',
        title: 'Mock Interview',
        loadComponent: comingSoon,
        data: {
          breadcrumb: 'Interview / Mock',
          icon: 'clock',
          heading: 'Mock interview',
          blurb:
            'A timed round drawn from the catalogue, with an editor, a notes pane and a practice score across understanding, patterns, complexity and edge cases.',
          phase: 8,
          description: 'Timed mock DSA interview rounds with a practice score.',
          plans: [
            'Choose level, duration and difficulty',
            'Countdown timer with problem and notes side by side',
            'Self-assessed rubric at the end',
            'History of past rounds kept on your device',
          ],
        },
      },
      {
        path: 'interview/timed-oa',
        title: 'Timed OA',
        loadComponent: comingSoon,
        data: {
          breadcrumb: 'Interview / Timed OA',
          icon: 'clock',
          heading: 'Timed online assessment',
          blurb: 'Two or three problems under a single clock, the way most first rounds are run.',
          phase: 8,
          description: 'Practise DSA online assessments under timed conditions.',
          plans: ['Multi-problem sets under one timer', 'Automatic submission at time', 'Post-round review'],
        },
      },

      // ---- Progress ----------------------------------------------------
      {
        path: 'progress',
        title: 'Progress Dashboard',
        loadComponent: comingSoon,
        data: {
          breadcrumb: 'Progress',
          icon: 'chart',
          heading: 'Progress dashboard',
          blurb:
            'Solved counts, accuracy, topic and pattern mastery, streak and revision health — all computed in the browser from your own history.',
          phase: 5,
          description: 'A client-side dashboard of your DSA learning progress.',
          plans: [
            'Overall and per-topic mastery',
            'Easy, medium and hard breakdown',
            'Average solve time and hint usage',
            'Everything computed locally, nothing uploaded',
          ],
        },
      },
      {
        path: 'progress/mastery',
        title: 'Mastery',
        loadComponent: comingSoon,
        data: {
          breadcrumb: 'Progress / Mastery',
          icon: 'chart',
          heading: 'Mastery',
          blurb: 'A mastery estimate per topic and per pattern from attempts, accuracy, hints and time.',
          phase: 5,
          description: 'Topic and pattern mastery estimates from your practice history.',
          plans: ['Mastery per topic', 'Mastery per pattern', 'How the estimate is calculated, in plain terms'],
        },
      },
      {
        path: 'progress/revision',
        title: 'Revision',
        loadComponent: comingSoon,
        data: {
          breadcrumb: 'Progress / Revision',
          icon: 'repeat',
          heading: 'Revision queue',
          blurb:
            'Spaced repetition for problems: solved today, back in 1, 3, 7, 21 and 45 days, with failures rescheduled sooner.',
          phase: 5,
          description: 'A spaced-repetition revision queue for solved DSA problems.',
          plans: ['Due today, upcoming, failed and mastered', 'Automatic rescheduling', 'Revision streak'],
        },
      },
      {
        path: 'progress/streak',
        title: 'Streak',
        loadComponent: comingSoon,
        data: {
          breadcrumb: 'Progress / Streak',
          icon: 'flame',
          heading: 'Streak',
          blurb: 'Daily consistency, shown as a calendar rather than a number to chase.',
          phase: 5,
          description: 'Daily study streak and activity calendar.',
          plans: ['Activity calendar', 'Current and longest streak', 'Honest gaps, no fake grace days'],
        },
      },
      {
        path: 'progress/analytics',
        title: 'Analytics',
        loadComponent: comingSoon,
        data: {
          breadcrumb: 'Progress / Analytics',
          icon: 'chart',
          heading: 'Analytics',
          blurb: 'Activity over time, accuracy trends, and where hints are being used most.',
          phase: 5,
          description: 'Charts of your DSA practice activity and accuracy over time.',
          plans: ['Daily, weekly and monthly activity', 'Accuracy trend', 'Hint and reveal usage', 'Difficulty mix'],
        },
      },

      // ---- Tools -------------------------------------------------------
      {
        path: 'visualizer',
        title: 'Algorithm Visualizer',
        loadComponent: comingSoon,
        data: {
          breadcrumb: 'Tools / Visualizer',
          icon: 'eye',
          heading: 'Algorithm visualiser',
          blurb:
            'Play, pause, step and rewind sorting, searching, tree and graph algorithms, with the variables and explanation shown at each step.',
          phase: 6,
          description: 'Interactive step-by-step visualisations of sorting, searching, tree and graph algorithms.',
          plans: [
            'Sorting: bubble, selection, insertion, merge, quick, heap',
            'Searching: linear, binary, binary search on answer',
            'Graphs: BFS, DFS, Dijkstra, Prim, Kruskal, union-find',
            'Playback controls with adjustable speed and step explanations',
          ],
        },
      },
      {
        path: 'tools/playground',
        title: 'Code Playground',
        loadComponent: comingSoon,
        data: {
          breadcrumb: 'Tools / Playground',
          icon: 'code',
          heading: 'Code playground',
          blurb:
            'An editor with syntax highlighting for writing and comparing solutions. Execution of Java and C++ needs a sandbox service, so this stays an editor rather than pretending to run code.',
          phase: 9,
          description: 'A browser code editor for drafting and comparing DSA solutions.',
          plans: [
            'Monaco editor with Java, C++ and Python highlighting',
            'Reference implementations to compare against',
            'Test cases shown alongside the editor',
            'Drafts saved to your browser',
          ],
        },
      },
      {
        path: 'tools/complexity',
        title: 'Complexity Guide',
        loadComponent: comingSoon,
        data: {
          breadcrumb: 'Tools / Complexity',
          icon: 'zap',
          heading: 'Constraint to algorithm',
          blurb:
            'Enter the input limit and get the complexity you can afford, plus the techniques that usually reach it.',
          phase: 7,
          description: 'Turn problem constraints into a target complexity and candidate techniques.',
          plans: [
            'Input size to complexity budget',
            'Techniques that typically fit each budget',
            'Worked examples for common limits',
            'A reference table for every growth rate',
          ],
        },
      },
      {
        path: 'tools/cheatsheets',
        title: 'Cheat Sheets',
        loadComponent: comingSoon,
        data: {
          breadcrumb: 'Tools / Cheat sheets',
          icon: 'grid',
          heading: 'Cheat sheets',
          blurb:
            'Printable one-page references for complexity, sorting, binary search, trees, graphs, DP, bit tricks and the standard libraries.',
          phase: 9,
          description: 'Printable DSA cheat sheets for complexity, structures, algorithms and standard libraries.',
          plans: ['One page per topic', 'Print-friendly layout', 'Java, C++ and Python collection references'],
        },
      },
      {
        path: 'tools/encyclopedia',
        title: 'DSA Encyclopedia',
        loadComponent: comingSoon,
        data: {
          breadcrumb: 'Tools / Encyclopedia',
          icon: 'book',
          heading: 'DSA encyclopedia',
          blurb:
            'Every algorithm and structure as a short reference entry: category, prerequisites, complexity, when to use it and what it relates to.',
          phase: 9,
          description: 'A searchable reference of algorithms and data structures.',
          plans: [
            'One entry per algorithm and structure',
            'Prerequisites and related entries',
            'Complexity and use-when guidance',
            'Cross-links into the curriculum',
          ],
        },
      },

      { path: '**', title: 'Page not found', loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound) },
    ],
  },
];
