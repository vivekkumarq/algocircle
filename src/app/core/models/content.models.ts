/**
 * Content models shared by every feature.
 * Content data lives in `src/app/data`; these interfaces are its contract.
 */

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Level = 'Foundations' | 'Core' | 'Advanced' | 'Expert';

export type InterviewLevel = 'Intern' | 'SDE-1' | 'SDE-2' | 'SDE-3';

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface Complexity {
  time: string;
  space: string;
  note?: string;
}

export interface Approach {
  name: string;
  idea: string;
  steps?: string[];
  complexity: Complexity;
  code?: CodeSnippet[];
  whyItWorks?: string;
}

export interface CodeSnippet {
  language: 'java' | 'cpp' | 'python' | 'typescript' | 'pseudocode';
  source: string;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  topic: string;
  patterns: string[];
  description: string;
  constraints: string[];
  examples: Example[];
  hints: string[];
  approaches: Approach[];
  complexity: Complexity;
  prerequisites?: string[];
  recognitionSignals?: string[];
  commonTrap?: string;
  interviewLevel?: InterviewLevel;
  companies?: string[];
  edgeCases?: string[];
}

export interface Concept {
  id: string;
  slug: string;
  title: string;
  topic: string;
  summary: string;
  body?: string[];
  prerequisites?: string[];
  relatedPatterns?: string[];
}

export interface Pattern {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  whatItIs: string;
  recognitionSignals: string[];
  coreIdea: string;
  template?: CodeSnippet;
  variations?: string[];
  commonMistakes?: string[];
  complexity?: Complexity;
  topics: string[];
  interviewRelevance: 'Very high' | 'High' | 'Medium' | 'Situational';
}

export interface Topic {
  id: string;
  slug: string;
  title: string;
  level: Level;
  summary: string;
  /** Why the topic exists — shown on the topic page and roadmap node. */
  whyItMatters: string;
  conceptCount: number;
  problemCount: number;
  patterns: string[];
  prerequisites: string[];
  next: string[];
  estimatedHours: number;
  difficulty: Difficulty;
  icon: string;
}

export interface AlgorithmEntry {
  id: string;
  name: string;
  category: string;
  complexity: Complexity;
  useWhen: string;
  prerequisites: string[];
  related: string[];
}

export interface RoadmapStage {
  id: string;
  order: number;
  title: string;
  slug: string;
  level: Level;
  summary: string;
  /** Why this stage is worth the time, in one sentence. */
  whyItMatters: string;
  difficulty: Difficulty;
  /** The concepts this stage actually covers — the node's concept count. */
  syllabus: string[];
  patterns: string[];
  prerequisites: string[];
  next: string[];
  estimatedHours: number;
}
