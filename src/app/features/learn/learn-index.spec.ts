import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LearnIndex } from './learn-index';
import { TOPICS } from '../../data/topics.data';

describe('topic index', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [LearnIndex], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(LearnIndex);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows one card per topic, each linking to its lesson', () => {
    const cards = [...render().querySelectorAll<HTMLAnchorElement>('.card')];
    expect(cards.length).toBe(TOPICS.length);
    expect(cards.map((card) => card.getAttribute('href'))).toEqual(TOPICS.map((t) => `/learn/${t.slug}`));
  });

  it('previews what is specific to each topic, not the sections every topic shares', () => {
    const items = [...render().querySelectorAll('.card__item')].map((el) => el.textContent?.trim());
    expect(items).not.toContain('How big tech uses this');
    expect(items).not.toContain('Where this is used in real products');
    expect(items.slice(0, 3)).toEqual(TOPICS[0].sections.slice(0, 3).map((s) => s.title));
  });

  it('names the prerequisites, or says where to start', () => {
    const after = [...render().querySelectorAll('.card__after')].map((el) => el.textContent?.trim());
    expect(after[0]).toBe('Start here');
    expect(after[1]).toBe('Builds on Why DSA');
  });
});
