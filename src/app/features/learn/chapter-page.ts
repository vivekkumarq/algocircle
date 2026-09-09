import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CHAPTERS, chapterBySlug } from '../../data/chapters';
import { stageBySlug, ROADMAP_STAGES } from '../../data/roadmaps/roadmap.data';
import { ProgressService } from '../../core/services/progress.service';
import { SeoService } from '../../core/services/seo.service';
import { Icon } from '../../shared/components/icon/icon';
import { DifficultyBadge } from '../../shared/components/difficulty-badge/difficulty-badge';
import { ContentBlocks } from '../../shared/components/content-blocks/content-blocks';

@Component({
  selector: 'app-chapter-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, DifficultyBadge, ContentBlocks],
  templateUrl: './chapter-page.html',
  styleUrl: './chapter-page.scss',
})
export class ChapterPage {
  private readonly progress = inject(ProgressService);
  private readonly seo = inject(SeoService);

  /** Bound from the route parameter by `withComponentInputBinding()`. */
  readonly slug = input.required<string>();

  protected readonly chapter = computed(() => chapterBySlug(this.slug()));
  protected readonly stage = computed(() => stageBySlug(this.slug()));

  protected readonly position = computed(() => {
    const index = CHAPTERS.findIndex((chapter) => chapter.slug === this.slug());
    if (index < 0) return null;
    return {
      previous: index > 0 ? CHAPTERS[index - 1] : undefined,
      next: index < CHAPTERS.length - 1 ? CHAPTERS[index + 1] : undefined,
    };
  });

  protected readonly isComplete = computed(() => this.progress.completedTopics().has(this.slug()));

  protected readonly prerequisiteStages = computed(() =>
    (this.stage()?.prerequisites ?? []).map(
      (slug) => ROADMAP_STAGES.find((stage) => stage.slug === slug) ?? null,
    ),
  );

  protected toggleComplete(): void {
    this.progress.toggleTopic(this.slug());
  }

  constructor() {
    // Chapter metadata lives with the chapter, not in the route table, so the
    // route stays lazy and the content is not pulled into the main bundle.
    effect(() => {
      const chapter = this.chapter();
      const stage = this.stage();
      const title = chapter?.title ?? stage?.title;
      const summary = chapter?.summary ?? stage?.summary;
      if (title) this.seo.update(title, summary, `/learn/${this.slug()}`);
    });
  }
}
