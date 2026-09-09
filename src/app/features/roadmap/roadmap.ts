import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROADMAP_STAGES, TOTAL_CONCEPTS, TOTAL_HOURS } from '../../data/roadmaps/roadmap.data';
import { CHAPTERS } from '../../data/chapters';
import { ProgressService } from '../../core/services/progress.service';
import { Icon } from '../../shared/components/icon/icon';
import { DifficultyBadge } from '../../shared/components/difficulty-badge/difficulty-badge';
import { ProgressBar } from '../../shared/components/progress-bar/progress-bar';

@Component({
  selector: 'app-roadmap',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, DifficultyBadge, ProgressBar],
  templateUrl: './roadmap.html',
  styleUrl: './roadmap.scss',
})
export class Roadmap {
  private readonly progress = inject(ProgressService);

  protected readonly stages = ROADMAP_STAGES;
  protected readonly totalConcepts = TOTAL_CONCEPTS;
  protected readonly totalHours = TOTAL_HOURS;

  protected readonly completed = this.progress.completedTopics;
  protected readonly completedCount = computed(() => this.completed().size);
  protected readonly percent = computed(() =>
    Math.round((this.completedCount() / this.stages.length) * 100),
  );

  /** The first stage whose prerequisites are met but which is not done yet. */
  protected readonly nextStage = computed(() => {
    const done = this.completed();
    return (
      this.stages.find(
        (stage) => !done.has(stage.slug) && stage.prerequisites.every((slug) => done.has(slug)),
      ) ?? this.stages.find((stage) => !done.has(stage.slug))
    );
  });

  private readonly written = new Set(CHAPTERS.map((chapter) => chapter.slug));

  protected hasChapter(slug: string): boolean {
    return this.written.has(slug);
  }

  protected isComplete(slug: string): boolean {
    return this.completed().has(slug);
  }

  protected isLocked(index: number): boolean {
    const done = this.completed();
    return !this.stages[index].prerequisites.every((slug) => done.has(slug));
  }

  protected toggle(slug: string): void {
    this.progress.toggleTopic(slug);
  }

  protected reset(): void {
    this.progress.reset();
  }

  protected titleFor(slug: string): string {
    return this.stages.find((stage) => stage.slug === slug)?.title ?? slug;
  }

  protected pad(order: number): string {
    return order.toString().padStart(2, '0');
  }
}
