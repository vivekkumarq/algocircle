import { CORE_75, CURATED_LISTS, listBySlug, listSize } from './core75.data';
import { PROBLEMS } from './index';
import { PYTHON_SOLUTIONS } from './solutions.python';

describe('curated lists', () => {
  const known = new Set(PROBLEMS.map((problem) => problem.slug));

  it('resolves every slug to a real problem', () => {
    for (const list of CURATED_LISTS) {
      for (const group of list.groups) {
        for (const slug of group.slugs) {
          expect(known.has(slug), `${list.slug} references unknown problem "${slug}"`).toBe(true);
        }
      }
    }
  });

  it('never repeats a problem inside a list', () => {
    for (const list of CURATED_LISTS) {
      const slugs = list.groups.flatMap((group) => group.slugs);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it('describes every list and finds it by slug', () => {
    for (const list of CURATED_LISTS) {
      expect(list.name.length).toBeGreaterThan(3);
      expect(list.tagline.length).toBeGreaterThan(20);
      expect(list.description.length).toBeGreaterThan(60);
      expect(list.groups.length).toBeGreaterThan(5);
      expect(listBySlug(list.slug)).toBe(list);
    }
  });

  it('is large enough to cover the techniques it claims to', () => {
    expect(listSize(CORE_75)).toBeGreaterThanOrEqual(75);
  });
});

function slugMsg(slug: string): string {
  return slug + ' looks like Java, not Python';
}

describe('python solutions', () => {
  it('covers every problem in the catalogue', () => {
    for (const problem of PROBLEMS) {
      const source = PYTHON_SOLUTIONS[problem.slug];
      expect(source, `no Python solution for "${problem.slug}"`).toBeDefined();
      expect(source.length).toBeGreaterThan(20);
    }
  });

  it('has no entry for a problem that no longer exists', () => {
    const known = new Set(PROBLEMS.map((problem) => problem.slug));
    for (const slug of Object.keys(PYTHON_SOLUTIONS)) expect(known.has(slug)).toBe(true);
  });

  it('is Python and not the Java source copied across', () => {
    for (const [slug, source] of Object.entries(PYTHON_SOLUTIONS)) {
      expect(source.includes('public class'), slugMsg(slug)).toBe(false);
      expect(source.includes('System.out'), slugMsg(slug)).toBe(false);
    }
  });
});
