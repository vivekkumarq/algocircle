import { TestBed } from '@angular/core/testing';
import { ProgressService } from './progress.service';

describe('ProgressService', () => {
  let progress: ProgressService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    progress = TestBed.inject(ProgressService);
  });

  it('starts empty', () => {
    expect(progress.solvedCount()).toBe(0);
    expect(progress.completedTopics().size).toBe(0);
    expect(progress.hasActivity()).toBe(false);
  });

  it('toggles a roadmap stage on and off', () => {
    progress.toggleTopic('arrays');
    expect(progress.isTopicComplete('arrays')).toBe(true);

    progress.toggleTopic('arrays');
    expect(progress.isTopicComplete('arrays')).toBe(false);
  });

  it('tracks solved problems and bookmarks separately', () => {
    progress.toggleSolved('p1');
    progress.toggleBookmark('p2');

    expect(progress.solvedCount()).toBe(1);
    expect(progress.bookmarkedCount()).toBe(1);
    expect(progress.hasActivity()).toBe(true);
  });

  it('survives a reload through storage', () => {
    progress.toggleTopic('hashing');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const reloaded = TestBed.inject(ProgressService);

    expect(reloaded.isTopicComplete('hashing')).toBe(true);
  });

  it('reset clears everything', () => {
    progress.toggleTopic('trees');
    progress.toggleSolved('p1');

    progress.reset();

    expect(progress.hasActivity()).toBe(false);
    expect(localStorage.getItem('algocircle:v1:progress')).toBeNull();
  });
});
