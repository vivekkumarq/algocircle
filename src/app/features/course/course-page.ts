import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ADVANCED_COURSE,
  COURSE_LESSONS,
  TOTAL_COURSE_LESSONS,
  TOTAL_COURSE_MINUTES,
  lessonBySlug,
  neighbours,
  sectionOf,
} from '../../data/course';
import { PROBLEMS } from '../../data/problems';
import { TOPICS } from '../../data/topics.data';
import { SeoService } from '../../core/services/seo.service';
import { LayoutService } from '../../core/services/layout.service';
import { Icon } from '../../shared/components/icon/icon';
import { ContentBlocks } from '../../shared/components/content-blocks/content-blocks';

/**
 * The advanced course: an overview at `/course`, one technique at
 * `/course/:slug`. Lessons are authored as the same typed blocks as a chapter,
 * so this page only has to supply the frame — the lesson list, the practice
 * problems and the pager.
 */
@Component({
  selector: 'app-course-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, ContentBlocks],
  templateUrl: './course-page.html',
  styleUrl: './course-page.scss',
})
export class CoursePage {
  private readonly seo = inject(SeoService);
  protected readonly isWide = inject(LayoutService).isWide;

  /**
   * Empty on the overview route; bound from the route parameter otherwise.
   * The router binds `undefined` when the matched route has no `:slug`, so
   * every read goes through `current()` rather than the input directly.
   */
  readonly slug = input('');

  private readonly current = computed(() => this.slug() ?? '');

  protected readonly course = ADVANCED_COURSE;
  protected readonly lessonCount = TOTAL_COURSE_LESSONS;
  protected readonly totalMinutes = TOTAL_COURSE_MINUTES;
  protected readonly hours = Math.round(TOTAL_COURSE_MINUTES / 60);

  protected readonly lesson = computed(() => lessonBySlug(this.current()));
  protected readonly isIndex = computed(() => this.current() === '');
  protected readonly section = computed(() => sectionOf(this.current()));
  protected readonly pager = computed(() => neighbours(this.current()));

  /** Reading order, so the sidebar can number the lessons 1..n. */
  private readonly orderOf = new Map(COURSE_LESSONS.map((lesson, index) => [lesson.slug, index + 1]));

  protected readonly number = computed(() => this.orderOf.get(this.current()) ?? 0);

  private readonly topicBySlug = new Map(TOPICS.map((topic) => [topic.slug, topic]));

  protected readonly topic = computed(() => {
    const lesson = this.lesson();
    return lesson ? this.topicBySlug.get(lesson.topic) : undefined;
  });

  protected readonly practice = computed(() => {
    const lesson = this.lesson();
    if (!lesson) return [];

    return lesson.practice
      .map((slug) => PROBLEMS.find((problem) => problem.slug === slug))
      .filter((problem) => problem !== undefined);
  });

  /** A stable hue per lesson, matching how chapters tint their background. */
  protected readonly hue = computed(() => (this.number() * 47 + 185) % 360);

  constructor() {
    effect(() => {
      const lesson = this.lesson();

      if (lesson) {
        this.seo.update(lesson.title, lesson.tagline, `/course/${lesson.slug}`);
      } else if (this.isIndex()) {
        this.seo.update(
          this.course.name,
          `${TOTAL_COURSE_LESSONS} advanced algorithm techniques, each with the idea, the proof, the code in Java and Python, and the problems that drill it.`,
          '/course',
        );
      }
    });
  }

  protected pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  protected minutesOf(sectionName: string): number {
    const section = this.course.sections.find((item) => item.name === sectionName);
    return section?.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0) ?? 0;
  }

  protected orderIn(slug: string): number {
    return this.orderOf.get(slug) ?? 0;
  }
}
