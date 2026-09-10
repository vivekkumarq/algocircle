import { TestBed } from '@angular/core/testing';
import { VISUALS, VisualName } from './visuals';
import { CHAPTERS } from '../../data/chapters';

describe('diagrams', () => {
  it('renders every visual in the registry without error', async () => {
    for (const name of Object.keys(VISUALS) as VisualName[]) {
      TestBed.resetTestingModule();
      const fixture = TestBed.createComponent(VISUALS[name]);
      await fixture.whenStable();

      const element = fixture.nativeElement as HTMLElement;
      expect(element.querySelector('.viz')).not.toBeNull();
    }
  });

  it('only references visuals that exist from the chapters', () => {
    for (const chapter of CHAPTERS) {
      for (const section of chapter.sections) {
        for (const block of section.blocks) {
          if (block.kind !== 'visual') continue;
          expect(Object.keys(VISUALS)).toContain(block.name);
        }
      }
    }
  });

  it('gives most topics at least one diagram or visual', () => {
    const withPictures = CHAPTERS.filter((chapter) =>
      chapter.sections.some((section) =>
        section.blocks.some((block) => block.kind === 'visual' || block.kind === 'diagram'),
      ),
    );

    expect(withPictures.length).toBe(CHAPTERS.length);
  });

  it('steps through a frame-based visual', async () => {
    TestBed.resetTestingModule();
    const fixture = TestBed.createComponent(VISUALS['binary-search']);
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    const before = element.querySelector('.viz-note')?.textContent;

    const step = [...element.querySelectorAll('button')].find(
      (button) => button.textContent?.trim() === 'Step',
    );
    step?.click();
    await fixture.whenStable();

    expect(element.querySelector('.viz-note')?.textContent).not.toBe(before);
  });
});
