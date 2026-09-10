export type QuestionLevel = 'Easy' | 'Medium' | 'Hard';

export interface InterviewQuestion {
  level: QuestionLevel;
  /** The question as an interviewer would ask it. */
  q: string;
  /** A complete answer. Supports `code` and **bold** inline markup. */
  a: string;
}

export interface QuestionSet {
  /** Topic slug, matching `topics.data.ts`. */
  topic: string;
  questions: InterviewQuestion[];
}
