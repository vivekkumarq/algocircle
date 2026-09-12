import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROBLEMS, TOTAL_PROBLEMS, problemBySlug } from '../../data/problems';
import { PYTHON_SOLUTIONS } from '../../data/problems/solutions.python';
import { ProblemDifficulty } from '../../data/problems/problem.model';
import { PATTERNS, patternBySlug } from '../../data/patterns/patterns.data';
import { TOPICS } from '../../data/topics.data';
import { SeoService } from '../../core/services/seo.service';
import { Icon } from '../../shared/components/icon/icon';

type LevelFilter = ProblemDifficulty | 'All';

/**
 * Index at /problems, one worked problem at /problems/:slug. The detail view
 * reveals hints one at a time and keeps the solution behind a final click, so
 * the thinking stays with the reader for as long as possible.
 */
@Component({
  selector: 'app-problems-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './problems-page.html',
  styleUrl: './problems-page.scss',
})
export class ProblemsPage {
  private readonly seo = inject(SeoService);

  readonly slug = input('');

  protected readonly total = TOTAL_PROBLEMS;
  protected readonly levels: LevelFilter[] = ['All', 'Easy', 'Medium', 'Hard'];

  protected readonly problem = computed(() => (this.slug() ? problemBySlug(this.slug()) : undefined));
  protected readonly isIndex = computed(() => !this.slug());

  // ---- index state -------------------------------------------------------
  protected readonly topicFilter = signal<string>('all');
  protected readonly levelFilter = signal<LevelFilter>('All');
  protected readonly query = signal('');

  protected readonly topicOptions = TOPICS.map((topic) => ({
    slug: topic.slug,
    label: topic.label,
    order: topic.order,
    count: PROBLEMS.filter((problem) => problem.topic === topic.slug).length,
  })).filter((option) => option.count > 0);

  protected readonly groups = computed(() => {
    const topic = this.topicFilter();
    const level = this.levelFilter();
    const needle = this.query().trim().toLowerCase();

    return this.topicOptions
      .filter((option) => topic === 'all' || option.slug === topic)
      .map((option) => ({
        ...option,
        problems: PROBLEMS.filter(
          (problem) =>
            problem.topic === option.slug &&
            (level === 'All' || problem.difficulty === level) &&
            (needle === '' ||
              problem.title.toLowerCase().includes(needle) ||
              problem.statement.toLowerCase().includes(needle)),
        ),
      }))
      .filter((group) => group.problems.length > 0);
  });

  protected readonly matches = computed(() =>
    this.groups().reduce((sum, group) => sum + group.problems.length, 0),
  );

  // ---- detail state ------------------------------------------------------
  protected readonly language = signal<'java' | 'python'>('java');
  protected readonly hintsShown = signal(0);
  protected readonly approachShown = signal(false);
  protected readonly solutionShown = signal(false);

  protected readonly patternOf = computed(() => {
    const problem = this.problem();
    return problem ? patternBySlug(problem.pattern) : undefined;
  });

  protected readonly topicOf = computed(() => {
    const problem = this.problem();
    return problem ? TOPICS.find((topic) => topic.slug === problem.topic) : undefined;
  });

  protected readonly code = computed(() => {
    const problem = this.problem();
    if (!problem) return '';
    return this.language() === 'python'
      ? (PYTHON_SOLUTIONS[problem.slug] ?? '# solution coming')
      : problem.optimal.code;
  });

  protected readonly related = computed(() => {
    const problem = this.problem();
    if (!problem) return [];
    return PROBLEMS.filter(
      (other) => other.pattern === problem.pattern && other.slug !== problem.slug,
    ).slice(0, 4);
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.confirmation));

    effect(() => {
      const problem = this.problem();

      if (problem) {
        // Reset the reveal state whenever the route moves to another problem.
        this.hintsShown.set(0);
        this.approachShown.set(false);
        this.solutionShown.set(false);
        this.seo.update(problem.title, problem.statement, `/problems/${problem.slug}`);
      } else if (this.isIndex()) {
        this.seo.update(
          'Worked problems',
          `${TOTAL_PROBLEMS} DSA problems worked from brute force to optimal, with graded hints.`,
          '/problems',
        );
      }
    });
  }

  protected setLanguage(language: 'java' | 'python'): void {
    this.language.set(language);
  }

  /** Confirmation state for the copy button on the implementation block. */
  protected readonly copied = signal(false);

  private confirmation?: ReturnType<typeof setTimeout>;

  protected async copyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.copied.set(true);
    } catch {
      return;
    }

    clearTimeout(this.confirmation);
    this.confirmation = setTimeout(() => this.copied.set(false), 1600);
  }

  protected revealHint(): void {
    this.hintsShown.update((count) => count + 1);
  }

  protected revealApproach(): void {
    this.approachShown.set(true);
  }

  protected revealSolution(): void {
    this.solutionShown.set(true);
  }

  protected setTopic(slug: string): void {
    this.topicFilter.set(slug);
  }

  protected setLevel(level: LevelFilter): void {
    this.levelFilter.set(level);
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected clear(): void {
    this.query.set('');
    this.topicFilter.set('all');
    this.levelFilter.set('All');
  }

  protected patternName(slug: string): string {
    return PATTERNS.find((pattern) => pattern.slug === slug)?.name ?? slug;
  }

  protected pad(order: number): string {
    return order.toString().padStart(2, '0');
  }
}
