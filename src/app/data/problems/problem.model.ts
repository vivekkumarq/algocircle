export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface WorkedProblem {
  slug: string;
  title: string;
  /** Topic slug from `topics.data.ts`. */
  topic: string;
  /** Pattern slug from `patterns.data.ts`. */
  pattern: string;
  difficulty: ProblemDifficulty;
  /** Written for this project, in our own words. */
  statement: string;
  example: { input: string; output: string; note?: string };
  /** Graded nudges — take only as many as you need. */
  hints: string[];
  bruteForce: { idea: string; complexity: string };
  optimal: { idea: string; complexity: string; language: string; code: string };
  /** The one sentence worth remembering. */
  insight: string;
}
