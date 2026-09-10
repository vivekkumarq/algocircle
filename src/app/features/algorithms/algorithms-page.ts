import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ALGORITHMS,
  ALGORITHM_CATEGORIES,
  AlgorithmCategory,
} from '../../data/algorithms.data';
import { TOPICS } from '../../data/topics.data';
import { Icon } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-algorithms-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './algorithms-page.html',
  styleUrl: './algorithms-page.scss',
})
export class AlgorithmsPage {
  protected readonly categories = ALGORITHM_CATEGORIES;
  protected readonly total = ALGORITHMS.length;

  protected readonly category = signal<AlgorithmCategory | 'All'>('All');
  protected readonly query = signal('');

  private readonly topicTitle = new Map(TOPICS.map((topic) => [topic.slug, topic.label]));

  protected readonly groups = computed(() => {
    const category = this.category();
    const needle = this.query().trim().toLowerCase();

    return this.categories
      .filter((name) => category === 'All' || name === category)
      .map((name) => ({
        name,
        entries: ALGORITHMS.filter(
          (entry) =>
            entry.category === name &&
            (needle === '' ||
              entry.name.toLowerCase().includes(needle) ||
              entry.what.toLowerCase().includes(needle) ||
              entry.useWhen.toLowerCase().includes(needle)),
        ),
      }))
      .filter((group) => group.entries.length > 0);
  });

  protected readonly matches = computed(() =>
    this.groups().reduce((sum, group) => sum + group.entries.length, 0),
  );

  protected countFor(category: AlgorithmCategory): number {
    return ALGORITHMS.filter((entry) => entry.category === category).length;
  }

  protected topicLabel(slug: string): string {
    return this.topicTitle.get(slug) ?? slug;
  }

  protected setCategory(category: AlgorithmCategory | 'All'): void {
    this.category.set(category);
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected clear(): void {
    this.query.set('');
    this.category.set('All');
  }
}
