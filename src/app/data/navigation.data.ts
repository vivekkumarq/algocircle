import { Level } from '../core/models';
import { TOPICS, TopicMeta } from './topics.data';

export interface TopicGroup {
  level: Level;
  topics: TopicMeta[];
}

const LEVEL_ORDER: Level[] = ['Foundations', 'Core', 'Advanced', 'Expert'];

/**
 * The sidebar is simply the curriculum: every topic, in order, grouped by
 * level. Built from the lightweight metadata, so the navigation never drags
 * the lesson text into the initial bundle.
 */
export const TOPIC_GROUPS: TopicGroup[] = LEVEL_ORDER.map((level) => ({
  level,
  topics: TOPICS.filter((topic) => topic.level === level),
})).filter((group) => group.topics.length > 0);

export { TOPICS };
export type { TopicMeta };
