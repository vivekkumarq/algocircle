import { Chapter } from '../../core/models/chapter.models';
import { REAL_WORLD } from './real-world.data';
import { INDUSTRY, industryBlocks } from './industry.data';

/**
 * Adds the real-world material every topic carries: the "in a real project"
 * opener, the big-tech section and the products section. Shared by the full
 * curriculum list and by the loader that fetches one lesson at a time, so a
 * lesson reads the same however it was loaded.
 */
export function enrichChapter(chapter: Chapter): Chapter {
  const guide = REAL_WORLD[chapter.slug];
  const industry = INDUSTRY[chapter.slug];
  if (!guide) throw new Error(`Missing real-world guide for topic ${chapter.slug}`);
  if (!industry) throw new Error(`Missing industry guide for topic ${chapter.slug}`);

  const [first, ...rest] = chapter.sections;
  const opening = [
    { kind: 'callout' as const, tone: 'why' as const, title: 'In a real project', text: guide.projectHook },
    ...first.blocks.slice(0, 1),
    ...(guide.extra ?? []),
    ...industryBlocks(industry),
    ...first.blocks.slice(1),
  ];

  return {
    ...chapter,
    readingMinutes: chapter.readingMinutes + 8,
    sections: [
      { ...first, blocks: opening },
      ...rest,
      {
        id: 'at-big-tech',
        title: 'How big tech uses this',
        blocks: [
          { kind: 'para', text: industry.scale },
          {
            kind: 'table',
            caption: 'Named companies and products — the same concept, under a latency and scale budget.',
            headers: ['Company', 'Where it shows up', 'What the concept is doing'],
            rows: industry.bigTech,
          },
          {
            kind: 'callout',
            tone: 'key',
            title: 'If an interviewer asks “why do we care?”',
            text: 'Point at one row: name the company, the operation (lookup, shortest path, top-K, cache…), and what would break if you used the slow version at their traffic.',
          },
        ],
      },
      {
        id: 'in-the-wild',
        title: 'Where this is used in real products',
        blocks: [
          { kind: 'para', text: guide.intro },
          {
            kind: 'table',
            caption: 'Popular systems, not toy examples — the same idea as this topic, in production.',
            headers: ['Product / system', 'How this topic shows up'],
            rows: guide.uses,
          },
          {
            kind: 'callout',
            tone: 'key',
            title: 'Take this into an interview',
            text: 'If someone asks “where would you use this?”, pick one row from the table and say the structure, the operation, and why the slow alternative would miss the latency budget.',
          },
        ],
      },
    ],
  };
}
