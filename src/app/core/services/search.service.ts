import { Injectable, signal } from '@angular/core';

export type SearchKind =
  | 'Topic'
  | 'Section'
  | 'Pattern'
  | 'Problem'
  | 'Algorithm'
  | 'Question'
  | 'Guide'
  | 'Lesson';

export interface SearchEntry {
  kind: SearchKind;
  title: string;
  /** Second line in the result row. */
  detail: string;
  /** Where clicking goes. */
  route: string[];
  fragment?: string;
  /** Lowercased haystack, built once. */
  haystack: string;
  /** Lowercased title, for cheap prefix scoring. */
  lowerTitle: string;
}

export interface SearchResult extends SearchEntry {
  score: number;
}

const KIND_WEIGHT: Record<SearchKind, number> = {
  Topic: 6,
  Pattern: 5,
  Problem: 4,
  Section: 3,
  Algorithm: 3,
  Lesson: 3,
  Guide: 2,
  Question: 1,
};

/**
 * One client-side index over everything on the site.
 *
 * The heavy content — chapters, questions, problems — is imported only when
 * search is first opened, so it never lands in the initial bundle.
 */
@Injectable({ providedIn: 'root' })
export class SearchService {
  private entries: SearchEntry[] = [];
  private loading?: Promise<void>;

  readonly ready = signal(false);

  async ensureIndex(): Promise<void> {
    if (this.ready()) return;
    this.loading ??= this.build();
    await this.loading;
  }

  search(query: string, limit = 24): SearchResult[] {
    const needle = query.trim().toLowerCase();
    if (needle.length < 2) return [];

    const terms = needle.split(/\s+/);
    const results: SearchResult[] = [];

    for (const entry of this.entries) {
      let score = 0;

      for (const term of terms) {
        const inTitle = entry.lowerTitle.indexOf(term);
        const inBody = entry.haystack.indexOf(term);

        if (inTitle === 0) score += 12;
        else if (inTitle > 0) score += 7;
        else if (inBody >= 0) score += 2;
        else {
          score = 0;
          break;
        }
      }

      if (score > 0) results.push({ ...entry, score: score + KIND_WEIGHT[entry.kind] });
    }

    return results.sort((a, b) => b.score - a.score || a.title.length - b.title.length).slice(0, limit);
  }

  private async build(): Promise<void> {
    const [chapters, patterns, problems, algorithms, questions, guides, course] =
      await Promise.all([
        import('../../data/chapters'),
        import('../../data/patterns/patterns.data'),
        import('../../data/problems'),
        import('../../data/algorithms.data'),
        import('../../data/interview'),
        import('../../data/guides/guides.data'),
        import('../../data/course'),
      ]);

    const entries: SearchEntry[] = [];
    const add = (entry: Omit<SearchEntry, 'haystack' | 'lowerTitle'> & { body?: string }): void => {
      entries.push({
        ...entry,
        lowerTitle: entry.title.toLowerCase(),
        haystack: `${entry.title} ${entry.detail} ${entry.body ?? ''}`.toLowerCase(),
      });
    };

    for (const chapter of chapters.CHAPTERS) {
      add({
        kind: 'Topic',
        title: chapter.title,
        detail: chapter.summary,
        route: ['/learn', chapter.slug],
        body: chapter.objectives.join(' ') + ' ' + chapter.keyTakeaways.join(' '),
      });

      for (const section of chapter.sections) {
        add({
          kind: 'Section',
          title: section.title,
          detail: `${chapter.title} · section`,
          route: ['/learn', chapter.slug],
          fragment: section.id,
          body: section.blocks
            .map((block) =>
              'text' in block ? block.text : 'title' in block && block.title ? block.title : '',
            )
            .join(' '),
        });
      }
    }

    for (const pattern of patterns.PATTERNS) {
      add({
        kind: 'Pattern',
        title: pattern.name,
        detail: pattern.tagline,
        route: ['/patterns', pattern.slug],
        body: pattern.signals.join(' ') + ' ' + pattern.idea,
      });
    }

    for (const problem of problems.PROBLEMS) {
      add({
        kind: 'Problem',
        title: problem.title,
        detail: problem.statement,
        route: ['/problems', problem.slug],
        body: problem.insight,
      });
    }

    for (const algorithm of algorithms.ALGORITHMS) {
      add({
        kind: 'Algorithm',
        title: algorithm.name,
        detail: algorithm.what,
        route: ['/algorithms'],
        body: `${algorithm.how} ${algorithm.useWhen} ${algorithm.category}`,
      });
    }

    for (const set of questions.QUESTION_SETS) {
      for (const question of set.questions) {
        add({
          kind: 'Question',
          title: question.q,
          detail: question.a,
          route: ['/interview'],
        });
      }
    }

    for (const guide of guides.GUIDES) {
      add({ kind: 'Guide', title: guide.title, detail: guide.tagline, route: ['/guide', guide.slug] });

      for (const section of guide.sections) {
        add({
          kind: 'Guide',
          title: section.title,
          detail: `${guide.title} · section`,
          route: ['/guide', guide.slug],
          fragment: section.id,
        });
      }
    }

    for (const lesson of course.COURSE_LESSONS) {
      add({
        kind: 'Lesson',
        title: lesson.title,
        detail: lesson.tagline,
        route: ['/course', lesson.slug],
        body: lesson.blocks
          .map((block) => ('text' in block ? block.text : ''))
          .join(' '),
      });
    }

    this.entries = entries;
    this.ready.set(true);
  }
}
