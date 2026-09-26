import { TOPICS, TOTAL_TOPIC_MINUTES, TOTAL_TOPIC_SECTIONS } from './topics.data';
import { CHAPTERS } from './chapters';
import { TOPIC_GROUPS } from './navigation.data';

/**
 * `topics.data.ts` is a lightweight mirror of the chapters, kept separate so
 * the navigation does not pull the lesson text into the initial bundle. These
 * tests are what stop the two from drifting apart.
 */
describe('topic metadata', () => {
  it('has one entry per chapter, in the same order', () => {
    expect(TOPICS.length).toBe(CHAPTERS.length);
    TOPICS.forEach((topic, index) => expect(topic.slug).toBe(CHAPTERS[index].slug));
  });

  it('matches every chapter field it mirrors', () => {
    for (const topic of TOPICS) {
      const chapter = CHAPTERS.find((c) => c.slug === topic.slug)!;

      expect(chapter).toBeDefined();
      expect(topic.title).toBe(chapter.title);
      expect(topic.label).toBe(chapter.shortTitle ?? chapter.title);
      expect(topic.level).toBe(chapter.level);
      expect(topic.order).toBe(chapter.order);
      expect(topic.minutes).toBe(chapter.readingMinutes);
      expect(topic.sections).toEqual(
        chapter.sections.map((section) => ({ id: section.id, title: section.title })),
      );
      expect(topic.summary).toBe(chapter.summary);
    }
  });

  it('totals are derived from the entries', () => {
    expect(TOTAL_TOPIC_SECTIONS).toBe(TOPICS.reduce((n, t) => n + t.sections.length, 0));
    expect(TOTAL_TOPIC_MINUTES).toBe(TOPICS.reduce((n, t) => n + t.minutes, 0));
  });

  it('groups every topic exactly once, in level order', () => {
    const grouped = TOPIC_GROUPS.flatMap((group) => group.topics);

    expect(grouped.length).toBe(TOPICS.length);
    expect(new Set(grouped.map((topic) => topic.slug)).size).toBe(TOPICS.length);
    expect(TOPIC_GROUPS.map((group) => group.level)).toEqual([
      'Foundations',
      'Core',
      'Advanced',
      'Expert',
    ]);
  });

  it('keeps the ordering inside a group ascending', () => {
    for (const group of TOPIC_GROUPS) {
      const orders = group.topics.map((topic) => topic.order);
      expect(orders).toEqual([...orders].sort((a, b) => a - b));
    }
  });
});
