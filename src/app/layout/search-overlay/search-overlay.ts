import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { SearchResult, SearchService } from '../../core/services/search.service';
import { Icon } from '../../shared/components/icon/icon';

/**
 * Site-wide search. Opens on `/` or Ctrl+K from anywhere except a text field,
 * loads its index on first use, and is fully keyboard-driven.
 */
@Component({
  selector: 'app-search-overlay',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './search-overlay.html',
  styleUrl: './search-overlay.scss',
})
export class SearchOverlay {
  private readonly search = inject(SearchService);
  private readonly router = inject(Router);
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');

  protected readonly open = signal(false);
  protected readonly query = signal('');
  protected readonly active = signal(0);
  protected readonly indexing = signal(false);

  protected readonly results = computed<SearchResult[]>(() =>
    this.search.ready() ? this.search.search(this.query()) : [],
  );

  protected readonly grouped = computed(() => {
    const byKind = new Map<string, SearchResult[]>();
    this.results().forEach((result) => {
      const list = byKind.get(result.kind) ?? [];
      list.push(result);
      byKind.set(result.kind, list);
    });
    return [...byKind.entries()].map(([kind, items]) => ({ kind, items }));
  });

  /** Flat order, so arrow keys move through the grouped list correctly. */
  protected readonly flat = computed(() => this.grouped().flatMap((group) => group.items));

  async show(): Promise<void> {
    this.open.set(true);
    this.active.set(0);
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';

    queueMicrotask(() => this.field()?.nativeElement.focus());

    if (!this.search.ready()) {
      this.indexing.set(true);
      await this.search.ensureIndex();
      this.indexing.set(false);
    }
  }

  protected close(): void {
    this.open.set(false);
    this.query.set('');
    if (typeof document !== 'undefined') document.body.style.overflow = '';
  }

  protected onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.active.set(0);
  }

  protected go(result: SearchResult): void {
    this.close();
    this.router.navigate(result.route, result.fragment ? { fragment: result.fragment } : {});
  }

  protected indexOf(result: SearchResult): number {
    return this.flat().indexOf(result);
  }

  @HostListener('document:keydown', ['$event'])
  protected onKey(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const typing =
      target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;

    if (!this.open()) {
      // `/` is the shortcut, but never while the reader is typing somewhere else.
      if ((event.key === '/' && !typing) || (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey))) {
        event.preventDefault();
        void this.show();
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }

    const total = this.flat().length;
    if (total === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.active.update((index) => (index + 1) % total);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.active.update((index) => (index - 1 + total) % total);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.go(this.flat()[this.active()]);
    }
  }
}
