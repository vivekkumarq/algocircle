import { CHAPTERS, TOTAL_SECTIONS, chapterBySlug } from './index';

describe('chapters', () => {
  it('opens the curriculum with Why DSA, which has no prerequisites', () => {
    expect(CHAPTERS[0].slug).toBe('why-dsa');
    expect(CHAPTERS[0].prerequisites).toEqual([]);
  });

  it('is numbered in reading order without gaps', () => {
    CHAPTERS.forEach((chapter, index) => expect(chapter.order).toBe(index + 1));
  });

  it('has unique slugs', () => {
    expect(new Set(CHAPTERS.map((chapter) => chapter.slug)).size).toBe(CHAPTERS.length);
  });

  it('gives every chapter objectives, sections and takeaways', () => {
    for (const chapter of CHAPTERS) {
      expect(chapter.objectives.length).toBeGreaterThan(0);
      expect(chapter.sections.length).toBeGreaterThan(0);
      expect(chapter.keyTakeaways.length).toBeGreaterThan(0);
      expect(chapter.readingMinutes).toBeGreaterThan(0);
      expect(chapter.summary.length).toBeGreaterThan(0);
    }
  });

  it('gives every section a unique anchor and at least one block', () => {
    for (const chapter of CHAPTERS) {
      const ids = chapter.sections.map((section) => section.id);
      expect(new Set(ids).size).toBe(ids.length);

      for (const section of chapter.sections) {
        expect(section.blocks.length).toBeGreaterThan(0);
        expect(section.title.length).toBeGreaterThan(0);
      }
    }
  });

  it('only lists prerequisites that are earlier chapters', () => {
    const orderOf = new Map(CHAPTERS.map((chapter) => [chapter.slug, chapter.order]));

    for (const chapter of CHAPTERS) {
      for (const prerequisite of chapter.prerequisites) {
        expect(orderOf.has(prerequisite)).toBe(true);
        expect(orderOf.get(prerequisite)!).toBeLessThan(chapter.order);
      }
    }
  });

  it('never leaves a table row shorter than its header', () => {
    for (const chapter of CHAPTERS) {
      for (const section of chapter.sections) {
        for (const block of section.blocks) {
          if (block.kind !== 'table') continue;
          for (const row of block.rows) expect(row.length).toBe(block.headers.length);
        }
      }
    }
  });

  it('counts sections from the chapters themselves', () => {
    expect(TOTAL_SECTIONS).toBe(
      CHAPTERS.reduce((total, chapter) => total + chapter.sections.length, 0),
    );
  });

  it('looks a chapter up by slug', () => {
    expect(chapterBySlug('graphs')?.title).toBe('Graphs');
    expect(chapterBySlug('nope')).toBeUndefined();
  });

  it('ends every topic with real-world products', () => {
    for (const chapter of CHAPTERS) {
      const last = chapter.sections.at(-1);
      expect(last?.id).toBe('in-the-wild');
      expect(last?.blocks.some((block) => block.kind === 'table')).toBe(true);
    }
  });

  it('explains how big tech uses every topic', () => {
    for (const chapter of CHAPTERS) {
      const section = chapter.sections.find((item) => item.id === 'at-big-tech');
      expect(section).toBeDefined();
      const table = section?.blocks.find((block) => block.kind === 'table');
      expect(table?.kind === 'table' && table.rows.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('opens every topic with a plain definition of what it is', () => {
    for (const chapter of CHAPTERS) {
      expect(chapter.definition.heading.length, chapter.slug).toBeGreaterThan(8);
      expect(chapter.definition.text.length, chapter.slug).toBeGreaterThan(180);
    }
  });
});
