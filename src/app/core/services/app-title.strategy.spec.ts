import { Component, effect, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TitleStrategy, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AppTitleStrategy } from './app-title.strategy';
import { SeoService } from './seo.service';

/** A page that names itself once, from an effect, as a lesson does when it opens. */
@Component({ template: '' })
class Lesson {
  private readonly seo = inject(SeoService);

  constructor() {
    effect(() =>
      this.seo.update('Graphs', 'Breadth-first and depth-first search.', '/learn/graphs'),
    );
  }
}

describe('AppTitleStrategy', () => {
  it('keeps the page title when only the fragment changes', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'learn/:slug', component: Lesson }]),
        { provide: TitleStrategy, useClass: AppTitleStrategy },
      ],
    });
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/learn/graphs');
    expect(document.title).toBe('Graphs · AlgoCircle');

    await harness.navigateByUrl('/learn/graphs#bfs');
    expect(document.title).toBe('Graphs · AlgoCircle');
    expect(document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href).toBe(
      'https://algocircle.duckdns.org/learn/graphs',
    );
  });
});
