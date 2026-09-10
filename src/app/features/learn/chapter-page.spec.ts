import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ChapterPage } from './chapter-page';
import { CHAPTERS } from '../../data/chapters';

describe('Chapter page', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ChapterPage],
      providers: [provideRouter([])],
    });
  });

  async function render(slug: string): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(ChapterPage);
    fixture.componentRef.setInput('slug', slug);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders every section of a chapter', async () => {
    const element = await render('why-dsa');
    const chapter = CHAPTERS[0];

    expect(element.querySelector('h1')?.textContent).toContain(chapter.title);
    expect(element.querySelectorAll('.section').length).toBe(chapter.sections.length);
  });

  it('builds a table of contents from the section anchors', async () => {
    const element = await render('why-dsa');

    // one entry per section, plus the key takeaways link
    expect(element.querySelectorAll('.toc a').length).toBe(CHAPTERS[0].sections.length + 1);
  });

  it('renders a real page for every topic in the curriculum', async () => {
    for (const chapter of CHAPTERS) {
      const element = await render(chapter.slug);
      expect(element.querySelector('.missing')).toBeNull();
      expect(element.querySelector('h1')?.textContent).toContain(chapter.title);
    }
  });

  it('links to the next chapter but not past the end', async () => {
    const first = await render(CHAPTERS[0].slug);
    expect(first.querySelector('.pager__link--next')).not.toBeNull();

    const last = await render(CHAPTERS[CHAPTERS.length - 1].slug);
    expect(last.querySelector('.pager__link--next')).toBeNull();
  });

  it('shows a not-found message for an unknown slug', async () => {
    const element = await render('does-not-exist');
    expect(element.querySelector('.missing')).not.toBeNull();
  });
});
