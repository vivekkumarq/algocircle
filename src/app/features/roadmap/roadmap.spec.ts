import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Roadmap } from './roadmap';
import { ProgressService } from '../../core/services/progress.service';
import { ROADMAP_STAGES } from '../../data/roadmaps/roadmap.data';

describe('Roadmap page', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [Roadmap], providers: [provideRouter([])] });
  });

  it('renders a card for every stage', async () => {
    const fixture = TestBed.createComponent(Roadmap);
    await fixture.whenStable();

    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('.node');
    expect(cards.length).toBe(ROADMAP_STAGES.length);
  });

  it('recommends the first stage when nothing is complete', async () => {
    const fixture = TestBed.createComponent(Roadmap);
    await fixture.whenStable();

    const next = (fixture.nativeElement as HTMLElement).querySelector('.status__next h2');
    expect(next?.textContent?.trim()).toBe(ROADMAP_STAGES[0].title);
  });

  it('moves the recommendation forward as stages are completed', async () => {
    const progress = TestBed.inject(ProgressService);
    progress.toggleTopic(ROADMAP_STAGES[0].slug);

    const fixture = TestBed.createComponent(Roadmap);
    await fixture.whenStable();

    const next = (fixture.nativeElement as HTMLElement).querySelector('.status__next h2');
    expect(next?.textContent?.trim()).toBe(ROADMAP_STAGES[1].title);
  });

  it('reports completion as a percentage of all stages', async () => {
    const progress = TestBed.inject(ProgressService);
    ROADMAP_STAGES.slice(0, 5).forEach((stage) => progress.toggleTopic(stage.slug));

    const fixture = TestBed.createComponent(Roadmap);
    await fixture.whenStable();

    const expected = Math.round((5 / ROADMAP_STAGES.length) * 100);
    const bar = (fixture.nativeElement as HTMLElement).querySelector('[role="progressbar"]');
    expect(bar?.getAttribute('aria-valuenow')).toBe(String(expected));
  });
});
