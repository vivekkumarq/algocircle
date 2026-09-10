import { GUIDES, guideBySlug } from './guides.data';
import { TOPICS } from '../topics.data';
import { TOPIC_POSITIONS } from '../topic-graph.data';

describe('guides', () => {
  it('has unique slugs and complete metadata', () => {
    expect(new Set(GUIDES.map((guide) => guide.slug)).size).toBe(GUIDES.length);

    for (const guide of GUIDES) {
      expect(guide.title.length).toBeGreaterThan(0);
      expect(guide.tagline.length).toBeGreaterThan(20);
      expect(guide.readingMinutes).toBeGreaterThan(0);
      expect(guide.sections.length).toBeGreaterThan(2);
    }
  });

  it('gives every section a unique anchor and content', () => {
    for (const guide of GUIDES) {
      const ids = guide.sections.map((section) => section.id);
      expect(new Set(ids).size).toBe(ids.length);

      for (const section of guide.sections) {
        expect(section.blocks.length).toBeGreaterThan(0);
        expect(section.title.length).toBeGreaterThan(0);
      }
    }
  });

  it('looks a guide up by slug', () => {
    expect(guideBySlug('build-logic')?.title).toContain('logic');
    expect(guideBySlug('nope')).toBeUndefined();
  });
});

describe('topic map', () => {
  it('places every topic exactly once', () => {
    for (const topic of TOPICS) {
      expect(TOPIC_POSITIONS[topic.slug]).toBeDefined();
    }
    expect(Object.keys(TOPIC_POSITIONS).length).toBe(TOPICS.length);
  });

  it('never puts two topics in the same cell', () => {
    const cells = Object.values(TOPIC_POSITIONS).map((p) => `${p.col},${p.row}`);
    expect(new Set(cells).size).toBe(cells.length);
  });

  it('always places a topic below every one of its prerequisites', () => {
    for (const topic of TOPICS) {
      const here = TOPIC_POSITIONS[topic.slug];
      for (const slug of topic.prerequisites) {
        expect(TOPIC_POSITIONS[slug].row).toBeLessThan(here.row);
      }
    }
  });

  it('has an edge for every prerequisite relationship', () => {
    const edges = TOPICS.flatMap((topic) =>
      topic.prerequisites.map((from) => `${from}->${topic.slug}`),
    );
    expect(edges.length).toBeGreaterThan(TOPICS.length - 1);
    expect(new Set(edges).size).toBe(edges.length);
  });
});
