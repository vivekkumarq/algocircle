import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CHAPTERS, chapterBySlug } from '../../data/chapters';
import { SeoService } from '../../core/services/seo.service';
import { Icon } from '../../shared/components/icon/icon';
import { ContentBlocks } from '../../shared/components/content-blocks/content-blocks';

@Component({
  selector: 'app-chapter-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, ContentBlocks],
  templateUrl: './chapter-page.html',
  styleUrl: './chapter-page.scss',
})
export class ChapterPage {
  private readonly seo = inject(SeoService);

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

  protected readonly prerequisites = computed(() =>
    (this.chapter()?.prerequisites ?? [])
      .map((slug) => chapterBySlug(slug))
      .filter((chapter) => chapter !== undefined),
  );

  protected pad(order: number): string {
    return order.toString().padStart(2, '0');
  }

  constructor() {
    // Chapter metadata lives with the chapter, so the route stays lazy and the
    // content is never pulled into the main bundle.
    effect(() => {
      const chapter = this.chapter();
      if (chapter) this.seo.update(chapter.title, chapter.summary, `/learn/${chapter.slug}`);
    });
  }
}
