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
