import { Routes } from '@angular/router';

/**
 * Four routes. Every topic in the curriculum is served by `learn/:slug`, so
 * the route table does not grow when a chapter is added.
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
        path: 'interview',
        title: 'Interview Questions',
        loadComponent: () =>
          import('./features/interview/interview-page').then((m) => m.InterviewPage),
        data: {
          description:
            'Data structures and algorithms interview questions with answers, grouped by topic and filterable by difficulty.',
        },
      },
      // The roadmap and the topic list are the same thing, so keep one URL.
      { path: 'roadmap', redirectTo: 'learn', pathMatch: 'full' },
      {
        path: '**',
        title: 'Page not found',
        loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
      },
    ],
  },
];
