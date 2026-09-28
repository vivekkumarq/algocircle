import { CHAPTERS } from './index';
import { LOADABLE_SLUGS, loadChapter } from './load';

describe('lesson loader', () => {
  it('has a loader for every lesson in the curriculum, and no others', () => {
    expect([...LOADABLE_SLUGS].sort()).toEqual(CHAPTERS.map((chapter) => chapter.slug).sort());
  });

  it('loads exactly the lesson the full list holds', async () => {
    for (const chapter of CHAPTERS) {
      expect(await loadChapter(chapter.slug)).toEqual(chapter);
    }
  });

  it('returns nothing for an unknown slug', async () => {
    expect(await loadChapter('nope')).toBeUndefined();
  });
});
