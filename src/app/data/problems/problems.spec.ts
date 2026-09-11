import { PROBLEMS, TOTAL_PROBLEMS, problemBySlug, problemsForPattern } from './index';
import { PATTERNS } from '../patterns/patterns.data';
import { TOPICS } from '../topics.data';

describe('worked problems', () => {
  const topicSlugs = new Set(TOPICS.map((topic) => topic.slug));
  const patternSlugs = new Set(PATTERNS.map((pattern) => pattern.slug));

  it('has unique slugs', () => {
    expect(new Set(PROBLEMS.map((problem) => problem.slug)).size).toBe(TOTAL_PROBLEMS);
  });

  it('links every problem to a real topic and pattern', () => {
    for (const problem of PROBLEMS) {
      expect(topicSlugs.has(problem.topic)).toBe(true);
      expect(patternSlugs.has(problem.pattern)).toBe(true);
    }
  });

  it('gives every problem graded hints before any solution', () => {
    for (const problem of PROBLEMS) {
      expect(problem.hints.length).toBeGreaterThanOrEqual(3);
      for (const hint of problem.hints) expect(hint.length).toBeGreaterThan(15);
    }
  });

  it('shows a brute force and an optimal approach with costs', () => {
    for (const problem of PROBLEMS) {
      expect(problem.bruteForce.idea.length).toBeGreaterThan(20);
      expect(problem.bruteForce.complexity.length).toBeGreaterThan(0);
      expect(problem.optimal.idea.length).toBeGreaterThan(20);
      expect(problem.optimal.complexity.length).toBeGreaterThan(0);
      expect(problem.optimal.code.length).toBeGreaterThan(20);
      expect(problem.insight.length).toBeGreaterThan(20);
    }
  });

  it('gives most topics at least three problems', () => {
    const covered = TOPICS.filter(
      (topic) => PROBLEMS.filter((problem) => problem.topic === topic.slug).length >= 3,
    );
    expect(covered.length).toBeGreaterThanOrEqual(TOPICS.length - 1);
  });

  it('looks problems up by slug and by pattern', () => {
    expect(problemBySlug('two-sum')?.title).toContain('Two values');
    expect(problemBySlug('nope')).toBeUndefined();
    expect(problemsForPattern('sliding-window').length).toBeGreaterThan(0);
  });
});

describe('patterns', () => {
  const topicSlugs = new Set(TOPICS.map((topic) => topic.slug));

  it('has unique slugs and complete fields', () => {
    expect(new Set(PATTERNS.map((pattern) => pattern.slug)).size).toBe(PATTERNS.length);

    for (const pattern of PATTERNS) {
      expect(pattern.signals.length).toBeGreaterThanOrEqual(3);
      expect(pattern.variations.length).toBeGreaterThan(0);
      expect(pattern.mistakes.length).toBeGreaterThan(0);
      expect(pattern.idea.length).toBeGreaterThan(40);
      expect(pattern.template.length).toBeGreaterThan(20);
      expect(topicSlugs.has(pattern.topic)).toBe(true);
    }
  });

  it('has at least one problem for most patterns', () => {
    const drilled = PATTERNS.filter((pattern) => problemsForPattern(pattern.slug).length > 0);
    expect(drilled.length).toBeGreaterThanOrEqual(PATTERNS.length - 4);
  });
});
