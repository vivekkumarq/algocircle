import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ChapterPage } from './chapter-page';
import { CHAPTERS } from '../../data/chapters';

describe('Chapter page', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ChapterPage],
      providers: [provideRouter([])],
    });
  });

  async function render(slug: string) {
    const fixture = TestBed.createComponent(ChapterPage);
    fixture.componentRef.setInput('slug', slug);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders every section of a written chapter', async () => {
    const element = await render('why-dsa');
    const chapter = CHAPTERS[0];

    expect(element.querySelector('h1')?.textContent).toContain(chapter.title);
    expect(element.querySelectorAll('.section').length).toBe(chapter.sections.length);
  });

  it('builds a table of contents from the section anchors', async () => {
    const element = await render('why-dsa');
    const links = element.querySelectorAll('.toc a');

    // one entry per section, plus the key takeaways link
    expect(links.length).toBe(CHAPTERS[0].sections.length + 1);
  });

  it('falls back to the stage outline when the chapter is unwritten', async () => {
    const element = await render('graphs');

    expect(element.querySelector('.outline')).not.toBeNull();
    expect(element.textContent).toContain('still being written');
  });

  it('shows a not-found message for an unknown slug', async () => {
    const element = await render('does-not-exist');

    expect(element.querySelector('.missing')).not.toBeNull();
  });
});
