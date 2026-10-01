import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { SearchResult, SearchService } from '../../core/services/search.service';
import { ProgressService } from '../../core/services/progress.service';
import { ThemeService } from '../../core/services/theme.service';
import { LayoutService } from '../../core/services/layout.service';
import { TOPICS } from '../../data/topics.data';
import { Icon } from '../../shared/components/icon/icon';
import { RichPipe } from '../../shared/pipes/rich.pipe';

/** One row of the palette: a search result or a command, run the same way. */
interface Entry {
  key: string;
  group: string;
  title: string;
  detail: string;
  icon?: string;
  keys?: string;
  /** Other words someone might type for this command. */
  also?: string;
  run: () => void;
}

/** Every word of the query appears somewhere in the command's words. */
export function commandMatches(query: string, entry: Pick<Entry, 'title' | 'detail' | 'also'>): boolean {
  const haystack = `${entry.title} ${entry.detail} ${entry.also ?? ''}`.toLowerCase();
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return words.length > 0 && words.every((word) => haystack.includes(word));
}

/**
 * The command palette. Opens on Ctrl+K (Cmd+K) or `/` from anywhere except a
 * text field. Empty, it offers the next thing to do — carry on reading, the
 * next unfinished topic, a random problem — plus the site's sections and a
 * few actions. Typed into, it searches every topic, pattern, problem,
 * algorithm and question, and the actions whose names match. Fully keyboard
 * driven; the search index loads on first use.
 */
@Component({
  selector: 'app-search-overlay',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, RichPipe],
  templateUrl: './search-overlay.html',
  styleUrl: './search-overlay.scss',
})
export class SearchOverlay {
  private readonly search = inject(SearchService);
  private readonly router = inject(Router);
  private readonly progress = inject(ProgressService);
  private readonly theme = inject(ThemeService);
  private readonly layout = inject(LayoutService);
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');

  protected readonly open = signal(false);
  protected readonly query = signal('');
  protected readonly active = signal(0);
  protected readonly indexing = signal(false);

  private readonly searching = computed(() => this.query().trim().length >= 2);

  private readonly results = computed<SearchResult[]>(() =>
    this.search.ready() && this.searching() ? this.search.search(this.query()) : [],
  );

  /** What the palette can do without a query. */
  private readonly commands = computed<Entry[]>(() => {
    const list: Entry[] = [];
    const done = this.progress.doneTopics();

    const last = this.progress.lastRead();
    const lastTopic = last && TOPICS.find((topic) => topic.slug === last.slug);
    if (last && lastTopic) {
      const section = lastTopic.sections.find((item) => item.id === last.section);
      list.push({
        key: 'continue',
        group: 'Jump back in',
        title: `Continue: ${lastTopic.title}`,
        detail: section?.title ?? 'Where you left off',
        icon: 'bookmark',
        also: 'resume continue last reading where left off',
        run: () => this.navigate(['/learn', lastTopic.slug], section?.id),
      });
    }

    const next = TOPICS.find((topic) => !done.has(topic.slug) && topic.slug !== lastTopic?.slug);
    if (next) {
      list.push({
        key: 'next',
        group: 'Jump back in',
        title: `Next topic: ${next.title}`,
        detail: `Topic ${String(next.order).padStart(2, '0')} · ${next.minutes} min · ${done.size} of ${TOPICS.length} complete`,
        icon: 'arrow-right',
        also: 'next learn study unfinished',
        run: () => this.navigate(['/learn', next.slug]),
      });
    }

    list.push({
      key: 'random',
      group: 'Jump back in',
      title: 'Random problem',
      detail: 'One you have not marked solved, if there is one',
      icon: 'zap',
      also: 'practice surprise shuffle question',
      run: () => void this.randomProblem(),
    });

    const places: [string, string, string, string][] = [
      ['Zero to Hero', 'Logic building from scratch, every line of code explained', 'compass', '/zero-to-hero'],
      ['DSA topics', 'All 20 topics, in order', 'book', '/learn'],
      ['Roadmap', 'The curriculum as a map you can drag and zoom', 'map', '/roadmap'],
      ['The Core List', 'The classic interview problems, by category', 'bookmark', '/list/core-75'],
      ['Worked problems', 'Brute force to optimal, with graded hints', 'target', '/problems'],
      ['Pattern library', 'The shapes problems come in', 'layers', '/patterns'],
      ['Advanced course', 'Kadane, tries, segment trees, Dijkstra and more', 'zap', '/course'],
    ];
    for (const [title, detail, icon, path] of places) {
      list.push({ key: path, group: 'Go to', title, detail, icon, run: () => this.navigate([path]) });
    }

    list.push(
      {
        key: 'theme',
        group: 'Actions',
        title: this.theme.isDark() ? 'Switch to the light theme' : 'Switch to the dark theme',
        detail: 'Every palette is in the Theme menu',
        icon: this.theme.isDark() ? 'sun' : 'moon',
        keys: 'T',
        also: 'theme dark light mode night day colour color appearance palette',
        run: () => this.theme.toggleDark(),
      },
      {
        key: 'focus',
        group: 'Actions',
        title:
          !this.layout.sidebarOpen() && !this.layout.contentsOpen()
            ? 'Show the side panels'
            : 'Focus mode: hide the side panels',
        detail: 'The topic list and "On this page" fold away',
        icon: 'eye',
        keys: '[ ]',
        also: 'focus zen reading mode hide show panels sidebar contents full width',
        run: () => this.layout.toggleFocus(),
      },
      {
        key: 'shortcuts',
        group: 'Actions',
        title: 'Keyboard shortcuts',
        detail: 'Everything the keyboard can do',
        icon: 'terminal',
        keys: '?',
        also: 'keyboard shortcuts keys hotkeys help',
        run: () => this.layout.setHelp(true),
      },
    );
    return list;
  });

  /** The rows on screen, in display order. */
  protected readonly entries = computed<Entry[]>(() => {
    if (!this.searching()) return this.commands();

    const query = this.query();
    const actions = this.commands().filter((entry) => commandMatches(query, entry));
    const named = (entry: Entry) => commandMatches(query, { ...entry, detail: '' });

    const found = this.results().map<Entry>((result, i) => ({
      key: `r${i}`,
      group: result.kind,
      title: result.title,
      detail: result.detail,
      run: () => this.go(result),
    }));
    // A command whose name matches is what was meant: "theme" should not
    // scroll past every lesson that mentions the word. One that only matches
    // in passing ("Dijkstra" in the course's blurb) waits below the lessons.
    return [...actions.filter(named), ...found, ...actions.filter((entry) => !named(entry))];
  });

  protected readonly grouped = computed(() => {
    const byGroup = new Map<string, Entry[]>();
    for (const entry of this.entries()) {
      const list = byGroup.get(entry.group) ?? [];
      list.push(entry);
      byGroup.set(entry.group, list);
    }
    return [...byGroup.entries()].map(([group, items]) => ({ group, items }));
  });

  /** Flat order, so arrow keys move through the grouped list correctly. */
  protected readonly flat = computed(() => this.grouped().flatMap((group) => group.items));

  protected readonly searchingNow = this.searching;

  constructor() {
    // Focus the field once it exists. Opening only schedules the render, so
    // focusing straight after `open.set(true)` found no input and left the
    // keyboard on the page: `/` opened search, and typing went nowhere.
    effect(() => {
      if (this.open()) this.field()?.nativeElement.focus();
    });
  }

  async show(): Promise<void> {
    this.open.set(true);
    this.active.set(0);
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';

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

  protected run(entry: Entry): void {
    this.close();
    entry.run();
  }

  protected indexOf(entry: Entry): number {
    return this.flat().indexOf(entry);
  }

  private go(result: SearchResult): void {
    this.router.navigate(result.route, result.fragment ? { fragment: result.fragment } : {});
  }

  private navigate(route: string[], fragment?: string): void {
    this.router.navigate(route, fragment ? { fragment } : {});
  }

  /** Loaded only when asked for, so the problem set stays out of the first download. */
  private async randomProblem(): Promise<void> {
    const { PROBLEMS } = await import('../../data/problems');
    const solved = this.progress.solvedProblems();
    const open = PROBLEMS.filter((problem) => !solved.has(problem.slug));
    const pool = open.length ? open : PROBLEMS;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    this.navigate(['/problems', pick.slug]);
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
      this.run(this.flat()[this.active()]);
    }
  }
}
