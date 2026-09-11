import { Routes } from '@angular/router';

/**
 * Every topic in the curriculum is served by `learn/:slug` and every problem by
 * `problems/:slug`, so the route table does not grow when content is added. Only the
 * landing page sits outside the shell; everything else shares the same frame.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
    data: {
      description:
        'AlgoCircle teaches data structures and algorithms from scratch: twenty topics in order, each explained with diagrams, worked examples and the traps to avoid. Free, static, no account.',
    },
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      {
        path: 'learn',
        title: 'DSA Topics',
        loadComponent: () => import('./features/learn/learn-index').then((m) => m.LearnIndex),
        data: {
          description:
            'Every DSA topic in learning order, from why the subject matters through to segment trees and dynamic programming.',
        },
      },
      {
        path: 'learn/:slug',
        loadComponent: () => import('./features/learn/chapter-page').then((m) => m.ChapterPage),
        data: {
          description:
            'A DSA topic explained from scratch, with diagrams, worked examples, complexity analysis and the mistakes to avoid.',
        },
      },
      {
        path: 'algorithms',
        title: 'Algorithms',
        loadComponent: () =>
          import('./features/algorithms/algorithms-page').then((m) => m.AlgorithmsPage),
        data: {
          description:
            'Every algorithm in the curriculum in one reference: what it does, how it works, what it costs and when to use it.',
        },
      },
      {
        path: 'patterns',
        title: 'Patterns',
        loadComponent: () =>
          import('./features/patterns/patterns-page').then((m) => m.PatternsPage),
        data: {
          description:
            'The recurring DSA problem shapes, each with the signals that give it away, a template, and the problems that drill it.',
        },
      },
      {
        path: 'patterns/:slug',
        loadComponent: () =>
          import('./features/patterns/patterns-page').then((m) => m.PatternsPage),
        data: { description: 'A DSA problem-solving pattern with its recognition signals and template.' },
      },
      {
        path: 'problems',
        title: 'Worked Problems',
        loadComponent: () =>
          import('./features/problems/problems-page').then((m) => m.ProblemsPage),
        data: {
          description:
            'DSA problems worked from brute force to optimal, with graded hints before any solution is revealed.',
        },
      },
      {
        path: 'problems/:slug',
        loadComponent: () =>
          import('./features/problems/problems-page').then((m) => m.ProblemsPage),
        data: { description: 'A DSA problem worked from brute force to optimal, with graded hints.' },
      },
      {
        path: 'guide',
        title: 'How to learn DSA',
        loadComponent: () => import('./features/guide/guide-page').then((m) => m.GuidePage),
        data: {
          description:
            'How to build problem-solving logic from zero, how to turn an idea into working code, and a realistic study plan.',
        },
      },
      {
        path: 'guide/:slug',
        loadComponent: () => import('./features/guide/guide-page').then((m) => m.GuidePage),
        data: {
          description:
            'Practical guidance on building DSA problem-solving skill, not just knowledge of the structures.',
        },
      },
      {
        path: 'interview',
        title: 'Interview Questions',
        loadComponent: () =>
          import('./features/interview/interview-page').then((m) => m.InterviewPage),
        data: {
          description:
            'Data structures and algorithms interview questions with answers, grouped by topic and filterable by difficulty.',
        },
      },
      {
        path: 'roadmap',
        title: 'Roadmap',
        loadComponent: () => import('./features/roadmap/roadmap-page').then((m) => m.RoadmapPage),
        data: {
          description:
            'The AlgoCircle roadmap: every DSA topic as a node you can pan, zoom and click, wired to the topics it depends on.',
        },
      },
      {
        path: 'list/:slug',
        loadComponent: () => import('./features/lists/list-page').then((m) => m.ListPage),
        data: {
          description:
            'A curated DSA practice list: the classic interview categories in order, each problem with graded hints and solutions in Java and Python.',
        },
      },
      { path: 'list', redirectTo: 'list/core-75', pathMatch: 'full' },
      {
        path: '**',
        title: 'Page not found',
        loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
      },
    ],
  },
];
