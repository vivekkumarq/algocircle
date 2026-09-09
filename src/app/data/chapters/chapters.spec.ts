import { CHAPTERS, TOTAL_SECTIONS, chapterBySlug } from './index';
import { ROADMAP_STAGES } from '../roadmaps/roadmap.data';

describe('chapters', () => {
  const stageSlugs = new Set(ROADMAP_STAGES.map((stage) => stage.slug));

  it('opens the curriculum with Why DSA', () => {
    expect(CHAPTERS[0].slug).toBe('why-dsa');
    expect(CHAPTERS[0].prerequisites).toEqual([]);
  });

  it('maps every chapter onto a roadmap stage', () => {
    for (const chapter of CHAPTERS) {
      expect(stageSlugs.has(chapter.slug)).toBe(true);
    }
  });

  it('gives every chapter objectives, sections and takeaways', () => {
    for (const chapter of CHAPTERS) {
      expect(chapter.objectives.length).toBeGreaterThan(0);
      expect(chapter.sections.length).toBeGreaterThan(0);
      expect(chapter.keyTakeaways.length).toBeGreaterThan(0);
      expect(chapter.readingMinutes).toBeGreaterThan(0);
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

  it('only lists prerequisites that are themselves chapters or stages', () => {
    for (const chapter of CHAPTERS) {
      for (const prerequisite of chapter.prerequisites) {
        expect(stageSlugs.has(prerequisite)).toBe(true);
      }
    }
  });

  it('never leaves a table row shorter than its header', () => {
    for (const chapter of CHAPTERS) {
      for (const section of chapter.sections) {
        for (const block of section.blocks) {
          if (block.kind !== 'table') continue;
          for (const row of block.rows) {
            expect(row.length).toBe(block.headers.length);
          }
        }
      }
    }
  });

  it('counts published sections from the chapters themselves', () => {
    expect(TOTAL_SECTIONS).toBe(
      CHAPTERS.reduce((total, chapter) => total + chapter.sections.length, 0),
    );
  });

  it('looks a chapter up by slug', () => {
    expect(chapterBySlug('arrays')?.title).toBe('Arrays');
    expect(chapterBySlug('nope')).toBeUndefined();
  });
});
