import { Level } from './content.models';

/**
 * Lesson content is authored as typed blocks rather than HTML, so a chapter is
 * data that can be rendered, searched, counted and re-styled without touching
 * the prose. `text` fields accept a tiny inline markup: `code` and **bold**.
 */
export type Block =
  | { kind: 'para'; text: string }
  | { kind: 'heading'; text: string }
  | { kind: 'list'; items: string[]; ordered?: boolean }
  | { kind: 'code'; language: CodeLanguage; source: string; caption?: string }
  | { kind: 'callout'; tone: CalloutTone; title?: string; text: string }
  | { kind: 'table'; headers: string[]; rows: string[][]; caption?: string }
  | { kind: 'steps'; items: { title: string; text: string }[] }
  | { kind: 'diagram'; art: string; caption?: string }
  | { kind: 'visual'; name: string; caption?: string }
  | { kind: 'compare'; columns: { title: string; points: string[] }[] }
  | { kind: 'check'; question: string; answer: string };

export type CodeLanguage = 'java' | 'cpp' | 'python' | 'typescript' | 'pseudocode' | 'text';

/** `key` = remember this, `note` = aside, `trap` = the mistake people make. */
export type CalloutTone = 'key' | 'note' | 'trap' | 'why';

export interface ChapterSection {
  /** Anchor id, also used by the in-page table of contents. */
  id: string;
  title: string;
  blocks: Block[];
}

export interface Chapter {
  slug: string;
  title: string;
  /** Short label for the previous/next strip and the sidebar. */
  shortTitle?: string;
  level: Level;
  order: number;
  summary: string;
  readingMinutes: number;
  /** What the reader can do afterwards, phrased as outcomes. */
  objectives: string[];
  prerequisites: string[];
  sections: ChapterSection[];
  keyTakeaways: string[];
  /** Roadmap stage this chapter belongs to. */
  stage: string;
}
