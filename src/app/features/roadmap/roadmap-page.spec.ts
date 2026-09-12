import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Router, provideRouter } from '@angular/router';
import { RoadmapPage } from './roadmap-page';
import { TOPICS } from '../../data/topics.data';

@Component({ template: 'topic' })
class TopicStub {}

/** Presses, optionally drags, then releases and clicks — as a mouse would. */
function pressDragClick(
  target: Element,
  surface: Element,
  { dx = 0, dy = 0 }: { dx?: number; dy?: number } = {},
): void {
  const options = { bubbles: true, cancelable: true, pointerId: 1, button: 0, clientX: 0, clientY: 0 };

  surface.dispatchEvent(new PointerEvent('pointerdown', options));
  if (dx || dy) {
    surface.dispatchEvent(new PointerEvent('pointermove', { ...options, clientX: dx, clientY: dy }));
  }
  surface.dispatchEvent(new PointerEvent('pointerup', { ...options, clientX: dx, clientY: dy }));
  target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
}

describe('roadmap page', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RoadmapPage],
      providers: [provideRouter([{ path: 'learn/:slug', component: TopicStub }])],
    });

    // jsdom has neither of these, and the component guards on them.
    Element.prototype.setPointerCapture ??= () => undefined;
    Element.prototype.releasePointerCapture ??= () => undefined;
    Element.prototype.hasPointerCapture ??= () => false;
  });

  it('draws every topic as a link to its lesson', () => {
    const fixture = TestBed.createComponent(RoadmapPage);
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('.node a');
    expect(links.length).toBe(TOPICS.length);

    const hrefs = [...links].map((link: Element) => link.getAttribute('href'));
    for (const topic of TOPICS) {
      expect(hrefs.some((href) => href?.endsWith(`/learn/${topic.slug}`))).toBe(true);
    }
  });

  it('opens the topic when a node is clicked', async () => {
    const fixture = TestBed.createComponent(RoadmapPage);
    const router = TestBed.inject(Router);
    fixture.detectChanges();
    await fixture.whenStable();     // lets afterNextRender wire the surface up

    const surface = fixture.nativeElement.querySelector('.surface');
    const link = [...fixture.nativeElement.querySelectorAll('.node a')].find((a: Element) =>
      a.getAttribute('href')?.endsWith('/learn/arrays'),
    ) as Element;

    pressDragClick(link, surface);
    await fixture.whenStable();

    expect(router.url).toBe('/learn/arrays');
  });

  it('does not open a topic when the click ends a drag', async () => {
    const fixture = TestBed.createComponent(RoadmapPage);
    const router = TestBed.inject(Router);
    fixture.detectChanges();
    await fixture.whenStable();     // lets afterNextRender wire the surface up

    const surface = fixture.nativeElement.querySelector('.surface');
    const link = [...fixture.nativeElement.querySelectorAll('.node a')].find((a: Element) =>
      a.getAttribute('href')?.endsWith('/learn/arrays'),
    ) as Element;

    pressDragClick(link, surface, { dx: 90, dy: 40 });
    await fixture.whenStable();

    expect(router.url).toBe('/');
  });
});
