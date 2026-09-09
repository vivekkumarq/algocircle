import { NavSection } from '../core/models';

/**
 * The application's information architecture, consumed by the sidebar, the
 * header mega-menu and (from Phase 3) the command palette.
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    id: 'learn',
    label: 'Learn',
    icon: 'book',
    items: [
      { label: 'DSA Roadmap', route: '/roadmap', hint: 'The ordered path from basics to advanced' },
      { label: 'Foundations', route: '/learn/foundations', hint: 'Programming and complexity basics' },
      { label: 'Data Structures', route: '/learn/data-structures', hint: 'Arrays to segment trees' },
      { label: 'Algorithms', route: '/learn/algorithms', hint: 'Sorting, searching, graphs, DP' },
      { label: 'Patterns', route: '/patterns', hint: 'Reusable problem-solving templates' },
      { label: 'Advanced DSA', route: '/learn/advanced', hint: 'Beyond the core interview set' },
      { label: 'Visualizations', route: '/visualizer', hint: 'Watch an algorithm run step by step' },
    ],
  },
  {
    id: 'practice',
    label: 'Practice',
    icon: 'target',
    items: [
      { label: 'All Problems', route: '/problems', hint: 'The full practice catalogue' },
      { label: 'Topic Practice', route: '/practice/topics', hint: 'Drill one topic at a time' },
      { label: 'Pattern Practice', route: '/practice/patterns', hint: 'Drill one pattern at a time' },
      { label: 'Random Practice', route: '/practice/random', hint: 'Simulate an unseen problem' },
      { label: 'Daily Challenge', route: '/practice/daily', hint: 'One deterministic problem a day' },
      { label: 'Weak Areas', route: '/practice/weak-areas', hint: 'What your history says to fix' },
    ],
  },
  {
    id: 'interview',
    label: 'Interview',
    icon: 'briefcase',
    items: [
      { label: 'Interview Roadmap', route: '/interview', hint: 'A timeline to interview-ready' },
      { label: 'Company Preparation', route: '/interview/companies', hint: 'Topic and pattern focus by company' },
      { label: 'Mock Interview', route: '/interview/mock', hint: 'Timed, scored practice round' },
      { label: 'Timed OA', route: '/interview/timed-oa', hint: 'Online-assessment conditions' },
    ],
  },
  {
    id: 'progress',
    label: 'Progress',
    icon: 'chart',
    items: [
      { label: 'Dashboard', route: '/progress', hint: 'Everything at a glance' },
      { label: 'Mastery', route: '/progress/mastery', hint: 'Topic and pattern mastery' },
      { label: 'Revision', route: '/progress/revision', hint: 'Spaced-repetition queue' },
      { label: 'Streak', route: '/progress/streak', hint: 'Daily consistency' },
      { label: 'Analytics', route: '/progress/analytics', hint: 'Activity and accuracy over time' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: 'tool',
    items: [
      { label: 'Algorithm Visualizer', route: '/visualizer', hint: 'Play, pause, step, inspect' },
      { label: 'Code Playground', route: '/tools/playground', hint: 'Write and compare solutions' },
      { label: 'Complexity Guide', route: '/tools/complexity', hint: 'Constraints to algorithm choice' },
      { label: 'Cheat Sheets', route: '/tools/cheatsheets', hint: 'Printable references' },
      { label: 'DSA Encyclopedia', route: '/tools/encyclopedia', hint: 'Every algorithm, defined' },
    ],
  },
];

/** Condensed navigation for the header on desktop. */
export const HEADER_LINKS = [
  { label: 'Roadmap', route: '/roadmap' },
  { label: 'Learn', route: '/learn' },
  { label: 'Patterns', route: '/patterns' },
  { label: 'Problems', route: '/problems' },
  { label: 'Visualizer', route: '/visualizer' },
  { label: 'Interview', route: '/interview' },
] as const;
