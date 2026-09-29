import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Injector,
  afterNextRender,
  computed,
  effect,
  PendingTasks,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, Scroll } from '@angular/router';
import { isPlainKey } from '../../layout/shortcuts/shortcuts';
import { loadChapter } from '../../data/chapters/load';
import { TOPICS, topicHue } from '../../data/topics.data';
import { Block, Chapter } from '../../core/models/chapter.models';
import { SeoService } from '../../core/services/seo.service';
import { LayoutService } from '../../core/services/layout.service';
import { ProgressService } from '../../core/services/progress.service';
import { Icon } from '../../shared/components/icon/icon';
import { ContentBlocks } from '../../shared/components/content-blocks/content-blocks';
import { RailHandle } from '../../shared/components/rail-handle/rail-handle';
import { RichPipe } from '../../shared/pipes/rich.pipe';

/** Sections drawn with the page; the rest follow a couple at a time. */
const FIRST_SECTIONS = 3;
const BATCH = 2;

@Component({
  selector: 'app-chapter-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, ContentBlocks, RailHandle, RichPipe],
  templateUrl: './chapter-page.html',
  styleUrl: './chapter-page.scss',
})
export class ChapterPage {
  private readonly seo = inject(SeoService);
  protected readonly layout = inject(LayoutService);
  protected readonly isWide = this.layout.isWide;
  private readonly progress = inject(ProgressService);

  /** Bound from the route parameter by `withComponentInputBinding()`. */
  readonly slug = input.required<string>();

  /**
   * The topic's metadata - title, summary, sections, neighbours - from the
   * list the app already holds. The header, the contents and the pager are
   * drawn from it straight away.
   */
  protected readonly meta = computed(() => TOPICS.find((topic) => topic.slug === this.slug()));

  /**
   * The lesson itself, fetched on its own: one topic, not all twenty. A few
   * lines of signals rather than Angular's `resource`, which would add about
   * 7 KB to the framework code every page downloads.
   */
  private readonly loaded = signal<Chapter | undefined>(undefined);
  protected readonly loadFailed = signal(false);
  private readonly attempt = signal(0);
  private readonly pending = inject(PendingTasks);

  protected readonly chapter = computed(() => {
    const chapter = this.loaded();
    // While the next topic loads, never show the previous one's body.
    return chapter?.slug === this.slug() ? chapter : undefined;
  });

  protected retry(): void {
    this.attempt.update((n) => n + 1);
  }

  /**
   * How many sections are in the page so far. Laying out a whole lesson at
   * once was a single task of 300-400 ms on a desktop - the page froze just as
   * it appeared. The first few sections (all anyone can see) render with the
   * page and the rest follow in idle moments, so no task is long enough to
   * notice and the lesson is complete a fraction of a second later.
   */
  private readonly shown = signal(FIRST_SECTIONS);

  protected readonly visibleSections = computed(
    () => this.chapter()?.sections.slice(0, this.shown()) ?? [],
  );

  protected readonly allShown = computed(() => {
    const chapter = this.chapter();
    return !!chapter && this.shown() >= chapter.sections.length;
  });

  /** The slug whose deep link has been honoured, so later batches do not re-jump. */
  private jumpedFor = '';

  /** Where the "being read" band starts, below the header (and phone bar). */
  private bandTop = 0;

  protected readonly position = computed(() => {
    const index = TOPICS.findIndex((topic) => topic.slug === this.slug());
    if (index < 0) return null;
    return {
      previous: index > 0 ? TOPICS[index - 1] : undefined,
      next: index < TOPICS.length - 1 ? TOPICS[index + 1] : undefined,
    };
  });

  /** The definition rendered through the normal block renderer, for `code` and **bold**. */
  protected readonly definitionBlocks = computed<Block[]>(() => {
    const text = this.chapter()?.definition.text;
    return text ? [{ kind: 'para', text }] : [];
  });

  /** Ticked off by the reader, in the topic list, the sidebar and here. */
  protected readonly done = computed(() => this.progress.doneTopics().has(this.slug()));

  protected toggleDone(): void {
    this.progress.toggleTopic(this.slug());
  }

  protected readonly prerequisites = computed(() =>
    (this.meta()?.prerequisites ?? [])
      .map((slug) => TOPICS.find((topic) => topic.slug === slug))
      .filter((topic) => topic !== undefined),
  );

  private readonly host = inject(ElementRef);

  /**
   * Which section is being read, so the contents list can follow along. An
   * observer rather than a scroll handler: the browser reports when a heading
   * crosses the line, and nothing runs while the page is still.
   */
  protected readonly reading = signal('');

  /** Phones: the section being read, for the bar under the header. */
  protected readonly current = computed(() => {
    const meta = this.meta();
    const index = meta?.sections.findIndex((section) => section.id === this.reading()) ?? -1;
    if (!meta || index < 0) return null;
    return { index, total: meta.sections.length, title: meta.sections[index].title };
  });

  /** The bar's list of sections, opened by tapping it. */
  protected readonly sheetOpen = signal(false);

  private watchSections(onCleanup: (fn: () => void) => void): void {
    if (typeof IntersectionObserver === 'undefined') return;

    const element = this.host.nativeElement as HTMLElement;
    const sections = [...element.querySelectorAll<HTMLElement>('section.section[id]')];
    if (!sections.length) return;

    const visible = new Set<string>();

    // The band a section must reach to count as "being read" starts just
    // below whatever covers the top of the page: the header, and on phones the
    // section bar too. Starting it higher let the last sliver of the section
    // above still count, so a jump named the wrong section.
    // Measured once per lesson: reading the header's size forces a layout,
    // and doing it on every batch forced each batch's layout synchronously.
    if (!this.bandTop) {
      const header = document.querySelector('app-header')?.getBoundingClientRect().height ?? 64;
      const bar = window.innerWidth < 900 ? 46 : 0;
      this.bandTop = Math.round(header + bar + 24);
    }
    const top = this.bandTop;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }

        // The first section still on screen, in document order.
        const current = sections.find((section) => visible.has(section.id));
        if (current) this.reading.set(current.id);
      },
      { rootMargin: `-${top}px 0px -55% 0px` },
    );

    for (const section of sections) observer.observe(section);
    onCleanup(() => observer.disconnect());

    // A link straight to a section (/learn/heaps#top-k) arrives before the
    // lesson body does, so the router found nothing to scroll to. Now that the
    // sections exist, go there - instantly, as a page load should land. Once
    // per lesson: later batches must not pull the reader back.
    const slug = this.slug();
    if (this.jumpedFor === slug) return;
    this.jumpedFor = slug;
    const hash = location.hash.length > 1 ? decodeURIComponent(location.hash.slice(1)) : '';
    const target = hash ? document.getElementById(hash) : null;
    target?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  /**
   * A stable hue per topic, so each chapter gets its own background wash and
   * you can tell at a glance that the page changed.
   */
  protected readonly hue = computed(() => topicHue(this.meta()?.order ?? 1));

  protected pad(order: number): string {
    return order.toString().padStart(2, '0');
  }

  private readonly router = inject(Router);

  /** J and K step through the sections; N and P move between topics. */
  @HostListener('document:keydown', ['$event'])
  protected onKey(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.sheetOpen()) {
      this.sheetOpen.set(false);
      return;
    }
    if (!isPlainKey(event)) return;
    const key = event.key.toLowerCase();

    if (key === 'j' || key === 'k') {
      const element = this.host.nativeElement as HTMLElement;
      const sections = [...element.querySelectorAll<HTMLElement>('section.section[id]')];
      if (!sections.length) return;
      const current = sections.findIndex((section) => section.id === this.reading());
      const target =
        key === 'j'
          ? sections[Math.min(current + 1, sections.length - 1)]
          : sections[Math.max(current - 1, 0)];
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(history.state, '', `#${target.id}`);
      return;
    }

    const nav = this.position();
    const topic = key === 'n' ? nav?.next : key === 'p' ? nav?.previous : undefined;
    if (topic) {
      event.preventDefault();
      void this.router.navigate(['/learn', topic.slug]);
    }
  }

  constructor() {
    effect((onCleanup) => {
      const slug = this.slug();
      this.attempt();
      let current = true;
      onCleanup(() => (current = false));

      this.loadFailed.set(false);
      // Registered as pending work, so tests and prerendering wait for it.
      const done = this.pending.add();
      loadChapter(slug)
        .then(
          (chapter) => current && this.loaded.set(chapter),
          () => current && this.loadFailed.set(true),
        )
        .finally(done);
    });

    // A new topic starts with nothing read and the section list closed.
    effect(() => {
      this.slug();
      this.reading.set('');
      this.sheetOpen.set(false);
      this.jumpedFor = '';
      this.bandTop = 0;
    });

    // Once the lesson is in, draw the first sections - and every section up
    // to one named in the URL, so a deep link lands exactly - then add the
    // rest a couple at a time when the browser is idle.
    effect((onCleanup) => {
      const chapter = this.chapter();
      if (!chapter) return;
      const total = chapter.sections.length;
      const hash = location.hash.length > 1 ? decodeURIComponent(location.hash.slice(1)) : '';
      const target = hash === 'takeaways' ? total : chapter.sections.findIndex((s) => s.id === hash) + 1;
      untracked(() => this.shown.set(Math.max(FIRST_SECTIONS, target)));

      const idle = (step: () => void): number =>
        typeof requestIdleCallback === 'function'
          ? requestIdleCallback(step, { timeout: 250 })
          : (setTimeout(step, 16) as unknown as number);
      const cancel = (handle: number) =>
        typeof cancelIdleCallback === 'function' ? cancelIdleCallback(handle) : clearTimeout(handle);

      let handle = 0;
      const step = () => {
        if (this.shown() >= total) return;
        this.shown.update((n) => Math.min(total, n + BATCH));
        handle = idle(step);
      };
      handle = idle(step);
      onCleanup(() => cancel(handle));
    });

    // Re-observe as sections arrive: the component is reused across slugs and
    // the list grows batch by batch.
    effect((onCleanup) => {
      this.chapter();
      this.shown();
      const frame = requestAnimationFrame(() => this.watchSections(onCleanup));
      onCleanup(() => cancelAnimationFrame(frame));
    });

    // A contents click can name a section that is not drawn yet; draw them
    // all, then go there - once Angular has actually put them in the page.
    const injector = inject(Injector);
    inject(Router)
      .events.pipe(takeUntilDestroyed())
      .subscribe((event) => {
        if (!(event instanceof Scroll) || !event.anchor || document.getElementById(event.anchor)) return;
        const anchor = event.anchor;
        this.shown.set(Number.MAX_SAFE_INTEGER);
        afterNextRender(
          () => document.getElementById(anchor)?.scrollIntoView({ block: 'start', behavior: 'instant' }),
          { injector },
        );
      });

    // Remember the place: the home page offers to continue from it.
    effect(() => {
      const section = this.reading();
      const meta = this.meta();
      if (section && meta) this.progress.recordReading(meta.slug, section);
    });

    effect(() => {
      const meta = this.meta();
      if (meta) this.seo.update(meta.title, meta.summary, `/learn/${meta.slug}`);
    });
  }
}
