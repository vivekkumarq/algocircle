import { ZERO_TO_HERO } from './index';
import { lessonsOf, lessonBySlug, neighbours, sectionOf } from '../course/course.model';
import { PROBLEMS } from '../problems';
import { PATTERNS } from '../patterns/patterns.data';
import { TOPICS } from '../topics.data';

const LESSONS = lessonsOf(ZERO_TO_HERO);

describe('Zero to Hero', () => {
  it('has unique lesson slugs that resolve back to their lesson', () => {
    expect(new Set(LESSONS.map((lesson) => lesson.slug)).size).toBe(LESSONS.length);
    for (const lesson of LESSONS) {
      expect(lessonBySlug(ZERO_TO_HERO, lesson.slug)).toBe(lesson);
      expect(sectionOf(ZERO_TO_HERO, lesson.slug)).toBeDefined();
    }
  });

  it('starts with the method and chains every lesson to the next', () => {
    expect(LESSONS[0].slug).toBe('how-to-think');
    expect(neighbours(ZERO_TO_HERO, LESSONS[0].slug).next).toBe(LESSONS[1]);
    expect(neighbours(ZERO_TO_HERO, LESSONS.at(-1)!.slug).next).toBeUndefined();
  });

  it('links every lesson to a real topic, pattern and practice problem', () => {
    const topics = new Set(TOPICS.map((topic) => topic.slug));
    const patterns = new Set(PATTERNS.map((pattern) => pattern.slug));
    const problems = new Set(PROBLEMS.map((problem) => problem.slug));
    for (const lesson of LESSONS) {
      expect(topics.has(lesson.topic), `${lesson.slug} -> topic ${lesson.topic}`).toBe(true);
      if (lesson.pattern) {
        expect(patterns.has(lesson.pattern), `${lesson.slug} -> pattern ${lesson.pattern}`).toBe(true);
      }
      for (const slug of lesson.practice) {
        expect(problems.has(slug), `${lesson.slug} practises unknown "${slug}"`).toBe(true);
      }
    }
  });

  it('teaches every pattern in the library', () => {
    const taught = new Set(LESSONS.map((lesson) => lesson.pattern));
    for (const pattern of PATTERNS) {
      expect(taught.has(pattern.slug), `no lesson for ${pattern.slug}`).toBe(true);
    }
  });

  it('sends the reader to every problem in the catalogue somewhere', () => {
    const practised = new Set(LESSONS.flatMap((lesson) => lesson.practice));
    for (const problem of PROBLEMS) {
      expect(practised.has(problem.slug), `${problem.slug} is in no practice list`).toBe(true);
    }
  });

  it('gives every lesson the same frame: plain words first, a trap, a check last', () => {
    for (const lesson of LESSONS) {
      const first = lesson.blocks[0];
      expect(first.kind === 'callout' && first.title === 'In plain words', lesson.slug).toBe(true);
      expect(lesson.blocks.some((b) => b.kind === 'callout' && b.tone === 'trap'), lesson.slug).toBe(true);
      expect(lesson.blocks.at(-1)?.kind, lesson.slug).toBe('check');
      expect(lesson.tagline.length, lesson.slug).toBeGreaterThan(30);
    }
  });

  it('walks every pattern lesson through the seven steps in order', () => {
    const steps = [
      'Step 1: Understand it',
      'Step 2: Solve it by hand',
      'Step 3: Say the rule in one sentence',
      'Step 4: Brute force first',
      'Step 5: Find what is repeated',
      'Step 6: The better solution, line by line',
      'Step 7: Dry run it',
    ];
    for (const lesson of LESSONS.filter((item) => item.pattern)) {
      const headings = lesson.blocks.flatMap((b) => (b.kind === 'heading' ? [b.text] : []));
      expect(headings.filter((h) => h.startsWith('Step ')), lesson.slug).toEqual(steps);
    }
  });

  it('shows every Java snippet with a Python one beside it', () => {
    for (const lesson of LESSONS) {
      lesson.blocks.forEach((block, i) => {
        if (block.kind !== 'code' || block.language !== 'java') return;
        const next = lesson.blocks[i + 1];
        expect(next?.kind === 'code' && next.language === 'python', `${lesson.slug} block ${i}`).toBe(true);
      });
    }
  });

  it('never shows a code snippet without comments', () => {
    for (const lesson of LESSONS) {
      for (const block of lesson.blocks) {
        if (block.kind !== 'code') continue;
        const marker = block.language === 'python' ? '#' : '//';
        const comments = block.source.split('\n').filter((line) => line.trim().startsWith(marker) || line.includes(` ${marker} `));
        expect(comments.length, `${lesson.slug}: an uncommented ${block.language} snippet`).toBeGreaterThan(0);
      }
    }
  });
});
