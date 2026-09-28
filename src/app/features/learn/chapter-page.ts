import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { isPlainKey } from '../../layout/shortcuts/shortcuts';
import { CHAPTERS, chapterBySlug } from '../../data/chapters';
import { topicHue } from '../../data/topics.data';
import { Block } from '../../core/models/chapter.models';
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

  protected readonly chapter = computed(() => chapterBySlug(this.slug()));

  protected readonly position = computed(() => {
    const index = CHAPTERS.findIndex((chapter) => chapter.slug === this.slug());
    if (index < 0) return null;
    return {
      previous: index > 0 ? CHAPTERS[index - 1] : undefined,
      next: index < CHAPTERS.length - 1 ? CHAPTERS[index + 1] : undefined,
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
    (this.chapter()?.prerequisites ?? [])
      .map((slug) => chapterBySlug(slug))
      .filter((chapter) => chapter !== undefined),
  );

  private readonly host = inject(ElementRef);

  /**
   * Which section is being read, so the contents list can follow along. An
   * observer rather than a scroll handler: the browser reports when a heading
   * crosses the line, and nothing runs while the page is still.
   */
  protected readonly reading = signal('');

  private watchSections(onCleanup: (fn: () => void) => void): void {
    if (typeof IntersectionObserver === 'undefined') return;

    const element = this.host.nativeElement as HTMLElement;
    const sections = [...element.querySelectorAll<HTMLElement>('section.section[id]')];
    if (!sections.length) return;

    const visible = new Set<string>();

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
      { rootMargin: '-72px 0px -55% 0px' },
    );

    for (const section of sections) observer.observe(section);
    onCleanup(() => observer.disconnect());
  }

  /**
   * A stable hue per topic, so each chapter gets its own background wash and
   * you can tell at a glance that the page changed.
   */
  protected readonly hue = computed(() => topicHue(this.chapter()?.order ?? 1));

  protected pad(order: number): string {
    return order.toString().padStart(2, '0');
  }

  private readonly router = inject(Router);

  /** J and K step through the sections; N and P move between topics. */
  @HostListener('document:keydown', ['$event'])
  protected onKey(event: KeyboardEvent): void {
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
    // Re-observe whenever the topic changes: the component is reused across
    // slugs, so the previous chapter's sections are gone by then.
    effect((onCleanup) => {
      this.chapter();
      this.reading.set('');

      const frame = requestAnimationFrame(() => this.watchSections(onCleanup));
      onCleanup(() => cancelAnimationFrame(frame));
    });

    // Remember the place: the home page offers to continue from it.
    effect(() => {
      const section = this.reading();
      const chapter = this.chapter();
      if (section && chapter) this.progress.recordReading(chapter.slug, section);
    });

    // Chapter metadata lives with the chapter, so the route stays lazy and the
    // content is never pulled into the main bundle.
    effect(() => {
      const chapter = this.chapter();
      if (chapter) this.seo.update(chapter.title, chapter.summary, `/learn/${chapter.slug}`);
    });
  }
}
