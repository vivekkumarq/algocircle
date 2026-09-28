import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';

/** Where the reader was last: a topic and the section they had reached. */
export interface LastRead {
  slug: string;
  section: string;
  at: number;
}

const TOPICS = 'done-topics';
const PROBLEMS = 'solved-problems';
const LAST = 'last-read';

/**
 * What the reader has finished, kept in their own browser: no account, no
 * server. Topics and problems are ticked off explicitly; the place they were
 * reading is remembered as they scroll. Another tab's changes arrive through
 * the storage event, so two open tabs never disagree.
 */
@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly storage = inject(StorageService);

  private readonly topics = signal<ReadonlySet<string>>(this.readSet(TOPICS));
  private readonly problems = signal<ReadonlySet<string>>(this.readSet(PROBLEMS));
  private readonly last = signal<LastRead | null>(this.storage.read<LastRead | null>(LAST, null));

  readonly doneTopics = this.topics.asReadonly();
  readonly solvedProblems = this.problems.asReadonly();
  readonly lastRead = this.last.asReadonly();

  constructor() {
    if (typeof window === 'undefined') return;
    const sync = (event: StorageEvent) => {
      if (event.key === this.storage.key(TOPICS)) this.topics.set(this.readSet(TOPICS));
      if (event.key === this.storage.key(PROBLEMS)) this.problems.set(this.readSet(PROBLEMS));
      if (event.key === this.storage.key(LAST)) this.last.set(this.storage.read<LastRead | null>(LAST, null));
    };
    window.addEventListener('storage', sync);
    inject(DestroyRef).onDestroy(() => window.removeEventListener('storage', sync));
  }

  toggleTopic(slug: string): void {
    this.topics.set(this.toggled(this.topics(), slug));
    this.storage.write(TOPICS, [...this.topics()]);
  }

  toggleSolved(slug: string): void {
    this.problems.set(this.toggled(this.problems(), slug));
    this.storage.write(PROBLEMS, [...this.problems()]);
  }

  recordReading(slug: string, section: string): void {
    const current = this.last();
    if (current?.slug === slug && current.section === section) return;
    const next = { slug, section, at: Date.now() };
    this.last.set(next);
    this.storage.write(LAST, next);
  }

  private toggled(set: ReadonlySet<string>, slug: string): ReadonlySet<string> {
    const next = new Set(set);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    return next;
  }

  private readSet(name: string): ReadonlySet<string> {
    const value = this.storage.read<unknown>(name, []);
    return new Set(Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []);
  }
}
