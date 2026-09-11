/**
 * Headline counts, mirrored here so the landing page can quote them without
 * importing the content itself — the same trick `topics.data.ts` uses to keep
 * the initial bundle small.
 *
 * Nothing here is guessed: `site-stats.spec.ts` imports the real data and fails
 * the build the moment one of these drifts.
 */
export const SITE_STATS = {
  patterns: 24,
  problems: 76,
  questions: 560,
  algorithms: 87,
  courseLessons: 22,
  courseMinutes: 284,
  listProblems: 76,
  listGroups: 18,
} as const;
