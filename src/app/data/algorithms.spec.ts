import { ALGORITHMS, ALGORITHM_CATEGORIES } from './algorithms.data';
import { TOPICS } from './topics.data';

describe('algorithms reference', () => {
  const topicSlugs = new Set(TOPICS.map((topic) => topic.slug));

  it('has a unique name for every entry', () => {
    const names = ALGORITHMS.map((entry) => entry.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('links every entry to a topic that exists', () => {
    for (const entry of ALGORITHMS) {
      expect(topicSlugs.has(entry.topic)).toBe(true);
    }
  });

  it('uses only declared categories', () => {
    for (const entry of ALGORITHMS) {
      expect(ALGORITHM_CATEGORIES).toContain(entry.category);
    }
  });

  it('fills in every field a card renders', () => {
    for (const entry of ALGORITHMS) {
      expect(entry.what.length).toBeGreaterThan(0);
      expect(entry.how.length).toBeGreaterThan(0);
      expect(entry.useWhen.length).toBeGreaterThan(0);
      expect(entry.time.length).toBeGreaterThan(0);
      expect(entry.space.length).toBeGreaterThan(0);
    }
  });

  it('leaves no category empty', () => {
    for (const category of ALGORITHM_CATEGORIES) {
      expect(ALGORITHMS.some((entry) => entry.category === category)).toBe(true);
    }
  });
});
