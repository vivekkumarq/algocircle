import { SITE_STATS } from './site-stats.data';
import { PATTERNS } from './patterns/patterns.data';
import { PROBLEMS } from './problems';
import { CORE_75, listSize } from './problems/core75.data';
import { ALGORITHMS } from './algorithms.data';
import { QUESTION_SETS } from './interview';
import { COURSE_LESSONS, TOTAL_COURSE_MINUTES } from './course';

/**
 * The landing page quotes these numbers from a lightweight mirror. This is the
 * guard that keeps the mirror honest.
 */
describe('site stats', () => {
  it('matches the pattern library', () => {
    expect(SITE_STATS.patterns).toBe(PATTERNS.length);
  });

  it('matches the problem catalogue', () => {
    expect(SITE_STATS.problems).toBe(PROBLEMS.length);
  });

  it('matches the interview questions', () => {
    const total = QUESTION_SETS.reduce((sum, set) => sum + set.questions.length, 0);
    expect(SITE_STATS.questions).toBe(total);
  });

  it('matches the algorithms reference', () => {
    expect(SITE_STATS.algorithms).toBe(ALGORITHMS.length);
  });

  it('matches the advanced course', () => {
    expect(SITE_STATS.courseLessons).toBe(COURSE_LESSONS.length);
    expect(SITE_STATS.courseMinutes).toBe(TOTAL_COURSE_MINUTES);
  });

  it('matches the curated list', () => {
    expect(SITE_STATS.listProblems).toBe(listSize(CORE_75));
    expect(SITE_STATS.listGroups).toBe(CORE_75.groups.length);
  });
});
