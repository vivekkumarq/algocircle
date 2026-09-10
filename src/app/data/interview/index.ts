import { InterviewQuestion, QuestionLevel, QuestionSet } from './question.model';
import { FOUNDATIONS_QUESTIONS, WHY_DSA_QUESTIONS } from './foundations.questions';
import { COMPLEXITY_QUESTIONS, MATHEMATICS_QUESTIONS } from './complexity.questions';
import { ARRAYS_QUESTIONS } from './arrays.questions';
import { HASHING_QUESTIONS, STRINGS_QUESTIONS } from './strings.questions';
import {
  BINARY_SEARCH_QUESTIONS,
  SLIDING_WINDOW_QUESTIONS,
  TWO_POINTERS_QUESTIONS,
} from './techniques.questions';
import {
  LINKED_LIST_QUESTIONS,
  RECURSION_QUESTIONS,
  SORTING_QUESTIONS,
} from './structures.questions';
import {
  HEAPS_QUESTIONS,
  STACKS_QUEUES_QUESTIONS,
  TREES_QUESTIONS,
} from './trees.questions';
import { GRAPHS_QUESTIONS, GREEDY_QUESTIONS } from './graphs.questions';
import { ADVANCED_QUESTIONS, DP_QUESTIONS } from './dp.questions';

export type { InterviewQuestion, QuestionLevel, QuestionSet };

/** Question banks in curriculum order, one per topic. */
export const QUESTION_SETS: QuestionSet[] = [
  WHY_DSA_QUESTIONS,
  FOUNDATIONS_QUESTIONS,
  COMPLEXITY_QUESTIONS,
  MATHEMATICS_QUESTIONS,
  ARRAYS_QUESTIONS,
  STRINGS_QUESTIONS,
  HASHING_QUESTIONS,
  TWO_POINTERS_QUESTIONS,
  SLIDING_WINDOW_QUESTIONS,
  BINARY_SEARCH_QUESTIONS,
  SORTING_QUESTIONS,
  RECURSION_QUESTIONS,
  LINKED_LIST_QUESTIONS,
  STACKS_QUEUES_QUESTIONS,
  TREES_QUESTIONS,
  HEAPS_QUESTIONS,
  GRAPHS_QUESTIONS,
  GREEDY_QUESTIONS,
  DP_QUESTIONS,
  ADVANCED_QUESTIONS,
];

export const TOTAL_QUESTIONS = QUESTION_SETS.reduce(
  (total, set) => total + set.questions.length,
  0,
);

export function questionsForTopic(topic: string): InterviewQuestion[] {
  return QUESTION_SETS.find((set) => set.topic === topic)?.questions ?? [];
}

export function countByLevel(level: QuestionLevel): number {
  return QUESTION_SETS.reduce(
    (total, set) => total + set.questions.filter((question) => question.level === level).length,
    0,
  );
}
