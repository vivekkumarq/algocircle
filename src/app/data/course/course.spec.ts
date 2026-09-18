import {
  ADVANCED_COURSE,
  COURSE_LESSONS,
  TOTAL_COURSE_LESSONS,
  TOTAL_COURSE_MINUTES,
  courseBySlug,
  lessonBySlug,
  neighbours,
  sectionOf,
} from './index';
import { PROBLEMS } from '../problems';
import { TOPICS } from '../topics.data';
import { VISUALS } from '../../shared/visuals/visuals';

describe('advanced course', () => {
  it('has unique lesson slugs', () => {
    const slugs = COURSE_LESSONS.map((lesson) => lesson.slug);
    expect(new Set(slugs).size).toBe(TOTAL_COURSE_LESSONS);
  });

  it('finds the course and every lesson by slug', () => {
    expect(courseBySlug(ADVANCED_COURSE.slug)).toBe(ADVANCED_COURSE);
    for (const lesson of COURSE_LESSONS) {
      expect(lessonBySlug(lesson.slug)).toBe(lesson);
      expect(sectionOf(lesson.slug)).toBeDefined();
    }
  });

  it('links every lesson to a real curriculum topic', () => {
    const topicSlugs = new Set(TOPICS.map((topic) => topic.slug));
    for (const lesson of COURSE_LESSONS) {
      expect(topicSlugs.has(lesson.topic), `${lesson.slug} -> ${lesson.topic}`).toBe(true);
    }
  });

  it('suggests practice problems that exist', () => {
    const known = new Set(PROBLEMS.map((problem) => problem.slug));
    for (const lesson of COURSE_LESSONS) {
      expect(lesson.practice.length).toBeGreaterThan(0);
      for (const slug of lesson.practice) {
        expect(known.has(slug), `${lesson.slug} practises unknown "${slug}"`).toBe(true);
      }
    }
  });

  it('describes every lesson and section', () => {
    for (const section of ADVANCED_COURSE.sections) {
      expect(section.lessons.length).toBeGreaterThan(0);
      expect(section.blurb.length).toBeGreaterThan(30);
    }

    for (const lesson of COURSE_LESSONS) {
      expect(lesson.title.length).toBeGreaterThan(3);
      expect(lesson.tagline.length).toBeGreaterThan(30);
      expect(lesson.minutes).toBeGreaterThan(4);
    }
  });

  it('opens every lesson with a plain-words callout', () => {
    for (const lesson of COURSE_LESSONS) {
      const first = lesson.blocks[0];
      expect(first.kind, lesson.slug).toBe('callout');
      if (first.kind === 'callout') expect(first.title).toBe('In plain words');
    }
  });

  it('shows both Java and Python in every lesson', () => {
    for (const lesson of COURSE_LESSONS) {
      const languages = new Set(
        lesson.blocks.filter((block) => block.kind === 'code').map((block) => block.language),
      );
      expect(languages.has('java') || languages.has('pseudocode'), lesson.slug).toBe(true);
      expect(languages.has('python'), `${lesson.slug} has no Python`).toBe(true);
    }
  });

  it('ends every lesson with a check-yourself question', () => {
    for (const lesson of COURSE_LESSONS) {
      const last = lesson.blocks.at(-1);
      expect(last?.kind, lesson.slug).toBe('check');
    }
  });

  it('warns about the common mistake in every lesson', () => {
    for (const lesson of COURSE_LESSONS) {
      const hasTrap = lesson.blocks.some(
        (block) => block.kind === 'callout' && block.tone === 'trap',
      );
      expect(hasTrap, `${lesson.slug} has no trap callout`).toBe(true);
    }
  });

  it('only references visuals that are registered', () => {
    for (const lesson of COURSE_LESSONS) {
      for (const block of lesson.blocks) {
        if (block.kind === 'visual') {
          expect(Object.keys(VISUALS), lesson.slug).toContain(block.name);
        }
      }
    }
  });

  it('reports totals computed from the data, not hard-coded', () => {
    expect(TOTAL_COURSE_LESSONS).toBe(
      ADVANCED_COURSE.sections.reduce((sum, section) => sum + section.lessons.length, 0),
    );
    expect(TOTAL_COURSE_MINUTES).toBe(
      COURSE_LESSONS.reduce((sum, lesson) => sum + lesson.minutes, 0),
    );
  });

  it('chains the lessons into a readable order', () => {
    const first = COURSE_LESSONS[0];
    const last = COURSE_LESSONS[TOTAL_COURSE_LESSONS - 1];

    expect(neighbours(first.slug).previous).toBeUndefined();
    expect(neighbours(first.slug).next).toBe(COURSE_LESSONS[1]);
    expect(neighbours(last.slug).next).toBeUndefined();
  });

  it('shows every Java snippet with a Python one beside it', () => {
    for (const lesson of COURSE_LESSONS) {
      lesson.blocks.forEach((block, i) => {
        if (block.kind !== 'code' || block.language !== 'java') return;

        const next = lesson.blocks[i + 1];
        expect(
          next?.kind === 'code' && next.language === 'python',
          `${lesson.slug}: a Java block has no Python beside it`,
        ).toBe(true);
      });
    }
  });
});
