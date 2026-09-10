/**
 * Shared vocabulary for the curriculum. Content data lives in `src/app/data`;
 * these types are its contract.
 */

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

/** How far into the curriculum a topic sits. */
export type Level = 'Foundations' | 'Core' | 'Advanced' | 'Expert';

export interface Complexity {
  time: string;
  space: string;
  note?: string;
}
