import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  Course,
  lessonBySlug,
  lessonsOf,
  neighbours,
  sectionOf,
} from '../../data/course/course.model';
import { PROBLEMS } from '../../data/problems';
import { TOPICS } from '../../data/topics.data';
import { SeoService } from '../../core/services/seo.service';
import { LayoutService } from '../../core/services/layout.service';
import { Icon } from '../../shared/components/icon/icon';
import { ContentBlocks } from '../../shared/components/content-blocks/content-blocks';
import { RichPipe } from '../../shared/pipes/rich.pipe';

/**
 * A course: an overview at `/<path>`, one lesson at `/<path>/:slug`. The
 * course itself arrives through the route (resolved from a lazy import), so
 * every course shares this frame without sharing a chunk. Lessons are
 * authored as the same typed blocks as a chapter, so this page only supplies
 * the lesson list, the practice problems and the pager.
 */
@Component({
  selector: 'app-course-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, ContentBlocks, RichPipe],
  templateUrl: './course-page.html',
  styleUrl: './course-page.scss',
})
export class CoursePage {
  private readonly seo = inject(SeoService);
  protected readonly isWide = inject(LayoutService).isWide;

  /** Bound from the route's resolver. */
  readonly course = input.required<Course>();

  /**
   * Empty on the overview route; bound from the route parameter otherwise.
   * The router binds `undefined` when the matched route has no `:slug`, so
   * every read goes through `current()` rather than the input directly.
   */
  readonly slug = input('');

  private readonly current = computed(() => this.slug() ?? '');

  protected readonly base = computed(() => '/' + this.course().path);
  private readonly lessons = computed(() => lessonsOf(this.course()));
  protected readonly lessonCount = computed(() => this.lessons().length);
  protected readonly hours = computed(() =>
    Math.round(this.lessons().reduce((sum, lesson) => sum + lesson.minutes, 0) / 60),
  );
  protected readonly first = computed(() => this.lessons()[0]);

  protected readonly lesson = computed(() => lessonBySlug(this.course(), this.current()));
  protected readonly isIndex = computed(() => this.current() === '');
  protected readonly section = computed(() => sectionOf(this.course(), this.current()));
  protected readonly pager = computed(() => neighbours(this.course(), this.current()));

  /** Reading order, so the sidebar can number the lessons 1..n. */
  private readonly orderOf = computed(
    () => new Map(this.lessons().map((lesson, index) => [lesson.slug, index + 1])),
  );

  protected readonly number = computed(() => this.orderOf().get(this.current()) ?? 0);

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
      const course = this.course();

      if (lesson) {
        this.seo.update(lesson.title, lesson.tagline, `${this.base()}/${lesson.slug}`);
      } else if (this.isIndex()) {
        this.seo.update(course.name, course.tagline, this.base());
      }
    });
  }

  protected pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  protected minutesOf(sectionName: string): number {
    const section = this.course().sections.find((item) => item.name === sectionName);
    return section?.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0) ?? 0;
  }

  protected orderIn(slug: string): number {
    return this.orderOf().get(slug) ?? 0;
  }
}
