import { Block } from '../../core/models/chapter.models';

/**
 * Zero to Hero teaches a habit, so every lesson has the same shape on
 * purpose: the reader should know what comes next before scrolling to it.
 * These two builders are that shape; the lessons are only the content.
 */

/** The same code in both languages; adjacent blocks render as one switcher. */
export function code(java: string, python: string, caption?: string): Block[] {
  return [
    { kind: 'code', language: 'java', source: java, caption },
    { kind: 'code', language: 'python', source: python, caption },
  ];
}

export interface Walkthrough {
  /** What the pattern does, in one or two plain sentences. Opens the lesson. */
  plain: string;
  problem: string;
  example: string;
  /** Questions to answer before any code: input, output, the odd cases. */
  understand: string[];
  /** How a person solves a tiny example, before thinking about code. */
  byHand: Block[];
  /** The by-hand method as one sentence. Code is a translation of this. */
  rule: string;
  brute: { idea: string; java: string; python: string; cost: string };
  /** What the brute force does again and again — the door to the pattern. */
  repeated: string;
  better: { idea: string; java: string; python: string; cost: string };
  dryRun: { headers: string[]; rows: string[][]; caption?: string };
  trap: string;
  /** Phrases in a problem statement that should make you think of this. */
  signals: string[];
  /** Anything worth adding after the main walkthrough, before the trap. */
  extra?: Block[];
  check: { question: string; answer: string };
}

/** One problem, thought through in the seven steps of the first lesson. */
export function walkthrough(w: Walkthrough): Block[] {
  return [
    { kind: 'callout', tone: 'note', title: 'In plain words', text: w.plain },

    { kind: 'heading', text: 'The problem' },
    { kind: 'para', text: w.problem },
    { kind: 'para', text: `**Example:** ${w.example}` },

    { kind: 'heading', text: 'Step 1: Understand it' },
    { kind: 'para', text: 'Before any code, answer these. If one has no answer, the problem is not understood yet.' },
    { kind: 'list', items: w.understand },

    { kind: 'heading', text: 'Step 2: Solve it by hand' },
    ...w.byHand,

    { kind: 'heading', text: 'Step 3: Say the rule in one sentence' },
    { kind: 'callout', tone: 'key', title: 'The rule', text: w.rule },

    { kind: 'heading', text: 'Step 4: Brute force first' },
    { kind: 'para', text: w.brute.idea },
    ...code(w.brute.java, w.brute.python, 'Brute force: correct first, fast later.'),
    { kind: 'para', text: `**Cost:** ${w.brute.cost}` },

    { kind: 'heading', text: 'Step 5: Find what is repeated' },
    { kind: 'callout', tone: 'why', title: 'What the brute force keeps redoing', text: w.repeated },

    { kind: 'heading', text: 'Step 6: The better solution, line by line' },
    { kind: 'para', text: w.better.idea },
    ...code(w.better.java, w.better.python, 'Every line says why it is there.'),
    { kind: 'para', text: `**Cost:** ${w.better.cost}` },

    { kind: 'heading', text: 'Step 7: Dry run it' },
    {
      kind: 'para',
      text: 'Run the code on the example with a pen, one row per loop turn. If a row surprises you, that is where the bug is.',
    },
    { kind: 'table', ...w.dryRun },

    ...(w.extra ?? []),

    { kind: 'callout', tone: 'trap', text: w.trap },

    { kind: 'heading', text: 'Spot it next time' },
    { kind: 'para', text: 'When a problem statement says something like this, try this pattern first:' },
    { kind: 'list', items: w.signals },

    { kind: 'check', ...w.check },
  ];
}

export interface Exercise {
  title: string;
  problem: string;
  /** What a person does on paper, before code exists. */
  byHand: string;
  /** The plan in plain English. Each line becomes a comment, then code. */
  plan: string[];
  java: string;
  python: string;
}

/** A small exercise for the logic-building lessons: plan in English, then translate. */
export function exercise(e: Exercise): Block[] {
  return [
    { kind: 'heading', text: e.title },
    { kind: 'para', text: e.problem },
    { kind: 'para', text: `**By hand:** ${e.byHand}` },
    { kind: 'para', text: '**The plan in plain English.** Each line becomes a comment, then the code under it:' },
    { kind: 'list', ordered: true, items: e.plan },
    ...code(e.java, e.python),
  ];
}
