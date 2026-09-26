import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { SidebarNav } from './sidebar-nav';
import { TOPICS } from '../../data/topics.data';

@Component({ template: 'learn' })
class LearnStub {}

describe('sidebar navigation', () => {
  const trees = TOPICS.find((topic) => topic.slug === 'trees')!;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SidebarNav],
      providers: [provideRouter([{ path: 'learn/:slug', component: LearnStub }])],
    });
  });

  it('opens the outline of the topic being read', async () => {
    const fixture = TestBed.createComponent(SidebarNav);
    const router = TestBed.inject(Router);
    fixture.detectChanges();

    await router.navigateByUrl('/learn/trees');
    fixture.detectChanges();

    const open = fixture.nativeElement.querySelectorAll('.topic.is-open');
    expect(open.length).toBe(1);
    expect(open[0].querySelector('.label').textContent.trim()).toBe(trees.label);
    expect(open[0].querySelectorAll('.outline a').length).toBe(trees.sections.length);
  });

  it('shows one outline at a time, and closes the one it was showing', () => {
    const fixture = TestBed.createComponent(SidebarNav);
    fixture.detectChanges();

    const toggles: HTMLButtonElement[] = [
      ...fixture.nativeElement.querySelectorAll('.topic__toggle'),
    ];
    expect(toggles.length).toBe(TOPICS.length);

    toggles[0].click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.topic.is-open').length).toBe(1);
    expect(toggles[0].getAttribute('aria-expanded')).toBe('true');

    toggles[4].click();
    fixture.detectChanges();
    const open = fixture.nativeElement.querySelectorAll('.topic.is-open');
    expect(open.length).toBe(1);
    expect(open[0].querySelector('.label').textContent.trim()).toBe(TOPICS[4].label);

    toggles[4].click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.topic.is-open').length).toBe(0);
  });

  it('links each section to its anchor on the topic page', () => {
    const fixture = TestBed.createComponent(SidebarNav);
    fixture.detectChanges();

    const index = TOPICS.indexOf(trees);
    fixture.nativeElement.querySelectorAll('.topic__toggle')[index].click();
    fixture.detectChanges();

    const links = [...fixture.nativeElement.querySelectorAll('.topic.is-open .outline a')];
    expect(links.map((a: HTMLAnchorElement) => a.getAttribute('href'))).toEqual(
      trees.sections.map((section) => `/learn/trees#${section.id}`),
    );
  });
});
