import { Injectable, computed, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';

export interface ProgressState {
  /** Problem ids the user has marked solved. */
  solved: string[];
  bookmarked: string[];
  /** Topic slugs the user has explicitly marked complete on the roadmap. */
  completedTopics: string[];
  lastActiveDate: string | null;
  streak: number;
}

const STORAGE_KEY = 'progress';

const EMPTY: ProgressState = {
  solved: [],
  bookmarked: [],
  completedTopics: [],
  lastActiveDate: null,
  streak: 0,
};

/**
 * Client-side progress. Phase 1 only needs topic completion and counters;
 * attempts, hints and revision scheduling extend this same record later.
 */
@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly storage = inject(StorageService);
  private readonly state = signal<ProgressState>(this.load());

  readonly snapshot = this.state.asReadonly();
  readonly solvedCount = computed(() => this.state().solved.length);
  readonly bookmarkedCount = computed(() => this.state().bookmarked.length);
  readonly completedTopics = computed(() => new Set(this.state().completedTopics));
  readonly streak = computed(() => this.state().streak);
  readonly hasActivity = computed(
    () => this.solvedCount() > 0 || this.state().completedTopics.length > 0,
  );

  isTopicComplete(slug: string): boolean {
    return this.completedTopics().has(slug);
  }

  toggleTopic(slug: string): void {
    this.update((state) => ({
      ...state,
      completedTopics: toggle(state.completedTopics, slug),
    }));
  }

  toggleSolved(problemId: string): void {
    this.update((state) => ({ ...state, solved: toggle(state.solved, problemId) }));
  }

  toggleBookmark(problemId: string): void {
    this.update((state) => ({ ...state, bookmarked: toggle(state.bookmarked, problemId) }));
  }

  reset(): void {
    this.state.set({ ...EMPTY });
    this.storage.remove(STORAGE_KEY);
  }

  private update(reducer: (state: ProgressState) => ProgressState): void {
    const next = reducer(this.state());
    this.state.set(next);
    this.storage.write(STORAGE_KEY, next);
  }

  private load(): ProgressState {
    return { ...EMPTY, ...this.storage.read<Partial<ProgressState>>(STORAGE_KEY, {}) };
  }
}

function toggle(list: readonly string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}
