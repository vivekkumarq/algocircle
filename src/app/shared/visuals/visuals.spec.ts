import { TestBed } from '@angular/core/testing';
import { VISUALS, VisualName } from './visuals';
import { CHAPTERS } from '../../data/chapters';

/** Renders one visual and presses its buttons by label. */
async function open(name: VisualName) {
  TestBed.resetTestingModule();
  const fixture = TestBed.createComponent(VISUALS[name]);
  await fixture.whenStable();
  const element = fixture.nativeElement as HTMLElement;
  const press = async (label: string, times = 1): Promise<void> => {
    for (let i = 0; i < times; i++) {
      [...element.querySelectorAll('button')].find((b) => b.textContent?.trim() === label)?.click();
      await fixture.whenStable();
    }
  };
  const note = () => element.querySelector('.viz-note')?.textContent?.trim() ?? '';
  return { element, press, note };
}

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

  it('reports the comparisons binary search actually made', async () => {
    const viz = await open('binary-search');
    await viz.press('Step', 20);
    // 16, then 56, then 23: three looks at the array.
    expect(viz.note()).toContain('Found it in 3 comparisons');
  });

  it('reports the swaps the heap sift-up actually made', async () => {
    const viz = await open('heap');
    await viz.press('Step', 20);
    // 2 swaps with 7, then with 4: two swaps up a tree of height two.
    expect(viz.note()).toContain('restored in 2 swaps');
  });

  it('shows the chosen mode from its very first frame', async () => {
    const graph = await open('graph-traversal');
    await graph.press('Depth-first');
    expect(graph.note()).toContain('stack');

    const dp = await open('dp-table');
    await dp.press('Longest common subsequence');
    expect(dp.note()).toContain('longest common subsequence');

    const match = await open('string-match');
    const naive = match.note();
    await match.press('KMP');
    expect(match.note()).not.toBe(naive);

    const tree = await open('tree-traversal');
    await tree.press('inorder');
    const sequence = [...tree.element.querySelectorAll('svg text.viz-caption')].at(-1);
    expect(sequence?.textContent?.trim()).toBe('A');
  });
});
