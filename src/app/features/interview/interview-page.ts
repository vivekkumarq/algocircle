import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QUESTION_SETS, QuestionLevel, TOTAL_QUESTIONS } from '../../data/interview';
import { TOPICS } from '../../data/topics.data';
import { Icon } from '../../shared/components/icon/icon';
import { SeoService } from '../../core/services/seo.service';

type LevelFilter = QuestionLevel | 'All';

@Component({
  selector: 'app-interview-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './interview-page.html',
  styleUrl: './interview-page.scss',
})
export class InterviewPage {
  private readonly seo = inject(SeoService);

  protected readonly total = TOTAL_QUESTIONS;
  protected readonly levels: LevelFilter[] = ['All', 'Easy', 'Medium', 'Hard'];

  protected readonly topic = signal<string>('all');
  protected readonly level = signal<LevelFilter>('All');
  protected readonly query = signal('');

  /** Topic metadata joined with its question count, in curriculum order. */
  protected readonly topicOptions = QUESTION_SETS.map((set) => {
    const meta = TOPICS.find((entry) => entry.slug === set.topic);
    return {
      slug: set.topic,
      label: meta?.label ?? set.topic,
      title: meta?.title ?? set.topic,
      order: meta?.order ?? 0,
      count: set.questions.length,
    };
  });

  protected readonly groups = computed(() => {
    const topic = this.topic();
    const level = this.level();
    const needle = this.query().trim().toLowerCase();

    return this.topicOptions
      .filter((option) => topic === 'all' || option.slug === topic)
      .map((option) => ({
        ...option,
        questions: (QUESTION_SETS.find((set) => set.topic === option.slug)?.questions ?? []).filter(
          (question) =>
            (level === 'All' || question.level === level) &&
            (needle === '' ||
              question.q.toLowerCase().includes(needle) ||
              question.a.toLowerCase().includes(needle)),
        ),
      }))
      .filter((group) => group.questions.length > 0);
  });

  protected readonly matches = computed(() =>
    this.groups().reduce((sum, group) => sum + group.questions.length, 0),
  );

  constructor() {
    this.seo.update(
      'DSA Interview Questions',
      `${TOTAL_QUESTIONS} data structures and algorithms interview questions with answers, grouped by topic.`,
      '/interview',
    );
  }

  protected setTopic(slug: string): void {
    this.topic.set(slug);
  }

  protected setLevel(level: LevelFilter): void {
    this.level.set(level);
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected clear(): void {
    this.query.set('');
    this.topic.set('all');
    this.level.set('All');
  }

  protected pad(order: number): string {
    return order.toString().padStart(2, '0');
  }
}
