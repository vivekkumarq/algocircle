import { ProblemDifficulty, WorkedProblem } from './problem.model';
import { CORE_PROBLEMS } from './core.problems';
import { ARRAY_PROBLEMS } from './arrays.problems';
import { TECHNIQUE_PROBLEMS } from './techniques.problems';
import { STRUCTURE_PROBLEMS } from './structures.problems';
import { ADVANCED_PROBLEMS } from './advanced.problems';

export type { WorkedProblem, ProblemDifficulty };

/** Every worked problem, in curriculum order. */
export const PROBLEMS: WorkedProblem[] = [
  ...CORE_PROBLEMS,
  ...ARRAY_PROBLEMS,
  ...TECHNIQUE_PROBLEMS,
  ...STRUCTURE_PROBLEMS,
  ...ADVANCED_PROBLEMS,
];

export const TOTAL_PROBLEMS = PROBLEMS.length;

export function problemBySlug(slug: string): WorkedProblem | undefined {
  return PROBLEMS.find((problem) => problem.slug === slug);
}

export function problemsForTopic(topic: string): WorkedProblem[] {
  return PROBLEMS.filter((problem) => problem.topic === topic);
}

export function problemsForPattern(pattern: string): WorkedProblem[] {
  return PROBLEMS.filter((problem) => problem.pattern === pattern);
}
