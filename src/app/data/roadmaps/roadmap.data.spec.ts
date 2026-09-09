import { ROADMAP_STAGES, TOTAL_CONCEPTS, TOTAL_HOURS, stageBySlug } from './roadmap.data';

describe('roadmap data', () => {
  const slugs = new Set(ROADMAP_STAGES.map((stage) => stage.slug));

  it('has unique slugs', () => {
    expect(slugs.size).toBe(ROADMAP_STAGES.length);
  });

  it('is ordered without gaps', () => {
    ROADMAP_STAGES.forEach((stage, index) => {
      expect(stage.order).toBe(index + 1);
    });
  });

  it('only references stages that exist', () => {
    for (const stage of ROADMAP_STAGES) {
      for (const slug of [...stage.prerequisites, ...stage.next]) {
        expect(slugs.has(slug)).toBe(true);
      }
    }
  });

  it('never depends on a later stage', () => {
    const orderOf = new Map(ROADMAP_STAGES.map((stage) => [stage.slug, stage.order]));

    for (const stage of ROADMAP_STAGES) {
      for (const prerequisite of stage.prerequisites) {
        expect(orderOf.get(prerequisite)!).toBeLessThan(stage.order);
      }
    }
  });

  it('gives every stage teachable content', () => {
    for (const stage of ROADMAP_STAGES) {
      expect(stage.syllabus.length).toBeGreaterThan(0);
      expect(stage.estimatedHours).toBeGreaterThan(0);
      expect(stage.whyItMatters.length).toBeGreaterThan(0);
    }
  });

  it('derives totals from the stages themselves', () => {
    expect(TOTAL_CONCEPTS).toBe(
      ROADMAP_STAGES.reduce((sum, stage) => sum + stage.syllabus.length, 0),
    );
    expect(TOTAL_HOURS).toBe(ROADMAP_STAGES.reduce((sum, stage) => sum + stage.estimatedHours, 0));
  });

  it('looks a stage up by slug', () => {
    expect(stageBySlug('arrays')?.title).toBe('Arrays');
    expect(stageBySlug('nope')).toBeUndefined();
  });
});
