import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PATTERNS, patternBySlug } from '../../data/patterns/patterns.data';
import { PROBLEMS } from '../../data/problems';
import { TOPICS } from '../../data/topics.data';
import { SeoService } from '../../core/services/seo.service';
import { Icon } from '../../shared/components/icon/icon';

/**
 * Index at /patterns, one pattern at /patterns/:slug. Each pattern lists the
 * worked problems that drill it, which is the link between recognising a shape
 * and actually practising it.
 */
@Component({
  selector: 'app-patterns-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './patterns-page.html',
  styleUrl: './patterns-page.scss',
})
export class PatternsPage {
  private readonly seo = inject(SeoService);

  readonly slug = input('');

  protected readonly patterns = PATTERNS;
  protected readonly pattern = computed(() => (this.slug() ? patternBySlug(this.slug()) : undefined));
  protected readonly isIndex = computed(() => !this.slug());

  /** Pattern rows for the index table, with a problem count each. */
  protected readonly rows = PATTERNS.map((pattern) => ({
    ...pattern,
    topicLabel: TOPICS.find((topic) => topic.slug === pattern.topic)?.label ?? pattern.topic,
    problems: PROBLEMS.filter((problem) => problem.pattern === pattern.slug).length,
  }));

  protected readonly problems = computed(() =>
    PROBLEMS.filter((problem) => problem.pattern === this.slug()),
  );

  protected readonly topicLabel = computed(
    () => TOPICS.find((topic) => topic.slug === this.pattern()?.topic)?.label ?? '',
  );

  protected readonly position = computed(() => {
    const index = PATTERNS.findIndex((pattern) => pattern.slug === this.slug());
    if (index < 0) return null;
    return {
      previous: index > 0 ? PATTERNS[index - 1] : undefined,
      next: index < PATTERNS.length - 1 ? PATTERNS[index + 1] : undefined,
    };
  });

  constructor() {
    effect(() => {
      const pattern = this.pattern();

      if (pattern) {
        this.seo.update(
          `${pattern.name} pattern`,
          `${pattern.tagline} Recognition signals, template, variations and the problems that drill it.`,
          `/patterns/${pattern.slug}`,
        );
      } else if (this.isIndex()) {
        this.seo.update(
          'DSA patterns',
          `The ${PATTERNS.length} recurring problem shapes, each with the signals that give it away and the problems that drill it.`,
          '/patterns',
        );
      }
    });
  }
}
