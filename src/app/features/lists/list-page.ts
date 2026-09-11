import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CORE_75, listBySlug, listSize } from '../../data/problems/core75.data';
import { PROBLEMS } from '../../data/problems';
import { PATTERNS } from '../../data/patterns/patterns.data';
import { SeoService } from '../../core/services/seo.service';
import { Icon } from '../../shared/components/icon/icon';

type Level = 'All' | 'Easy' | 'Medium' | 'Hard';

/**
 * A curated practice list: the classic interview categories, each holding the
 * problems from the catalogue in the order they should be attempted. Solutions
 * live on the problem page, where they stay hidden until asked for.
 */
@Component({
  selector: 'app-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './list-page.html',
  styleUrl: './list-page.scss',
})
export class ListPage {
  /** Route parameter; an unknown slug falls back to the core list. */
  readonly slug = input<string>();

  protected readonly list = computed(() => listBySlug(this.slug() ?? '') ?? CORE_75);
  protected readonly total = computed(() => listSize(this.list()));

  protected readonly query = signal('');
  protected readonly level = signal<Level>('All');
  protected readonly levels: readonly Level[] = ['All', 'Easy', 'Medium', 'Hard'];

  private readonly bySlug = new Map(PROBLEMS.map((problem) => [problem.slug, problem]));
  private readonly patternName = new Map(PATTERNS.map((pattern) => [pattern.slug, pattern.name]));

  private readonly all = computed(() =>
    this.list()
      .groups.flatMap((group) => group.slugs)
      .map((slug) => this.bySlug.get(slug))
      .filter((problem) => problem !== undefined),
  );

  protected readonly counts = computed(() => ({
    easy: this.all().filter((problem) => problem.difficulty === 'Easy').length,
    medium: this.all().filter((problem) => problem.difficulty === 'Medium').length,
    hard: this.all().filter((problem) => problem.difficulty === 'Hard').length,
  }));

  protected readonly groups = computed(() => {
    const needle = this.query().trim().toLowerCase();
    const level = this.level();

    return this.list()
      .groups.map((group) => ({
        name: group.name,
        rows: group.slugs
          .map((slug) => this.bySlug.get(slug))
          .filter((problem) => problem !== undefined)
          .filter(
            (problem) =>
              (level === 'All' || problem.difficulty === level) &&
              (needle === '' ||
                problem.title.toLowerCase().includes(needle) ||
                problem.statement.toLowerCase().includes(needle)),
          )
          .map((problem) => ({
            slug: problem.slug,
            title: problem.title,
            statement: problem.statement,
            difficulty: problem.difficulty,
            pattern: this.patternName.get(problem.pattern) ?? problem.pattern,
            patternSlug: problem.pattern,
          })),
        size: group.slugs.length,
      }))
      .filter((group) => group.rows.length > 0);
  });

  protected readonly matches = computed(() =>
    this.groups().reduce((sum, group) => sum + group.rows.length, 0),
  );

  constructor() {
    const seo = inject(SeoService);

    effect(() => {
      const list = this.list();
      seo.update(
        `${list.name} — curated DSA practice`,
        `${listSize(list)} curated DSA problems grouped by category, each with graded hints and solutions in Java and Python.`,
        `/list/${list.slug}`,
      );
    });
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected setLevel(level: Level): void {
    this.level.set(level);
  }

  protected clear(): void {
    this.query.set('');
    this.level.set('All');
  }
}
