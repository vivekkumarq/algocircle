import { TestBed } from '@angular/core/testing';
import { ProgressService } from './progress.service';
import { StorageService } from './storage.service';

describe('progress', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    TestBed.inject(StorageService).clearAll();
  });

  it('ticks a topic off and back on, and remembers it', () => {
    const progress = TestBed.inject(ProgressService);
    progress.toggleTopic('arrays');
    expect(progress.doneTopics().has('arrays')).toBe(true);

    expect(TestBed.inject(StorageService).read<string[]>('done-topics', [])).toEqual(['arrays']);

    progress.toggleTopic('arrays');
    expect(progress.doneTopics().has('arrays')).toBe(false);
  });

  it('keeps solved problems separately from topics', () => {
    const progress = TestBed.inject(ProgressService);
    progress.toggleSolved('two-sum');
    expect(progress.solvedProblems().has('two-sum')).toBe(true);
    expect(progress.doneTopics().size).toBe(0);
  });

  it('remembers the place being read', () => {
    const progress = TestBed.inject(ProgressService);
    progress.recordReading('heaps', 'top-k');
    expect(progress.lastRead()?.slug).toBe('heaps');
    expect(progress.lastRead()?.section).toBe('top-k');
  });

  it('ignores a corrupt stored value instead of failing', () => {
    TestBed.inject(StorageService).write('done-topics', { not: 'a list' });
    const progress = TestBed.inject(ProgressService);
    expect(progress.doneTopics().size).toBe(0);
  });
});
