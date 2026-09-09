import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROADMAP_STAGES, TOTAL_CONCEPTS } from '../../data/roadmaps/roadmap.data';
import { CHAPTERS, TOTAL_READING_MINUTES, chapterBySlug } from '../../data/chapters';
import { Level } from '../../core/models';
import { ProgressService } from '../../core/services/progress.service';
import { Icon } from '../../shared/components/icon/icon';
import { DifficultyBadge } from '../../shared/components/difficulty-badge/difficulty-badge';

const LEVELS: Level[] = ['Foundations', 'Core', 'Advanced', 'Expert'];

@Component({
  selector: 'app-learn-index',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, DifficultyBadge],
  templateUrl: './learn-index.html',
  styleUrl: './learn-index.scss',
})
export class LearnIndex {
  private readonly progress = inject(ProgressService);

  protected readonly levels = LEVELS;
  protected readonly activeLevel = signal<Level | 'All'>('All');
  protected readonly publishedCount = CHAPTERS.length;
  protected readonly totalStages = ROADMAP_STAGES.length;
  protected readonly totalConcepts = TOTAL_CONCEPTS;
  protected readonly readingMinutes = TOTAL_READING_MINUTES;

  protected readonly entries = computed(() => {
    const level = this.activeLevel();
    return ROADMAP_STAGES.filter((stage) => level === 'All' || stage.level === level).map(
      (stage) => {
        const chapter = chapterBySlug(stage.slug);
        return {
          stage,
          chapter,
          published: !!chapter,
          sections: chapter?.sections.length ?? 0,
          minutes: chapter?.readingMinutes ?? 0,
        };
      },
    );
  });

  protected readonly completed = this.progress.completedTopics;

  protected setLevel(level: Level | 'All'): void {
    this.activeLevel.set(level);
  }

  protected countFor(level: Level | 'All'): number {
    if (level === 'All') return ROADMAP_STAGES.length;
    return ROADMAP_STAGES.filter((stage) => stage.level === level).length;
  }

  protected pad(order: number): string {
    return order.toString().padStart(2, '0');
  }
}
