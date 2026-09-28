import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  effect,
  PendingTasks,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
    const header = document.querySelector('app-header')?.getBoundingClientRect().height ?? 64;
    const bar = window.innerWidth < 900 ? 46 : 0;
    const top = Math.round(header + bar + 24);

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
    // sections exist, go there - instantly, as a page load should land.
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

    // Re-observe whenever the topic changes: the component is reused across
    // slugs, so the previous chapter's sections are gone by then.
    effect((onCleanup) => {
      this.chapter();
      this.reading.set('');
      this.sheetOpen.set(false);

      const frame = requestAnimationFrame(() => this.watchSections(onCleanup));
      onCleanup(() => cancelAnimationFrame(frame));
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
