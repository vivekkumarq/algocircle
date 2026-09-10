import { QUESTION_SETS, TOTAL_QUESTIONS, countByLevel, questionsForTopic } from './index';
import { TOPICS } from '../topics.data';

describe('interview questions', () => {
  it('holds at least five hundred questions', () => {
    expect(TOTAL_QUESTIONS).toBeGreaterThanOrEqual(500);
  });

  it('has a set for every topic, in curriculum order', () => {
    expect(QUESTION_SETS.length).toBe(TOPICS.length);
    QUESTION_SETS.forEach((set, index) => expect(set.topic).toBe(TOPICS[index].slug));
  });

  it('only references topics that exist', () => {
    const slugs = new Set(TOPICS.map((topic) => topic.slug));
    for (const set of QUESTION_SETS) expect(slugs.has(set.topic)).toBe(true);
  });

  it('gives every topic a useful number of questions', () => {
    for (const set of QUESTION_SETS) {
      expect(set.questions.length).toBeGreaterThanOrEqual(10);
    }
  });

  it('fills in a question, an answer and a level for every entry', () => {
    for (const set of QUESTION_SETS) {
      for (const question of set.questions) {
        expect(question.q.length).toBeGreaterThan(5);
        expect(question.a.length).toBeGreaterThan(20);
        expect(['Easy', 'Medium', 'Hard']).toContain(question.level);
      }
    }
  });

  it('does not repeat a question inside a topic', () => {
    for (const set of QUESTION_SETS) {
      const asked = set.questions.map((question) => question.q.toLowerCase());
      expect(new Set(asked).size).toBe(asked.length);
    }
  });

  it('covers all three difficulty levels', () => {
    expect(countByLevel('Easy')).toBeGreaterThan(0);
    expect(countByLevel('Medium')).toBeGreaterThan(0);
    expect(countByLevel('Hard')).toBeGreaterThan(0);
    expect(countByLevel('Easy') + countByLevel('Medium') + countByLevel('Hard')).toBe(
      TOTAL_QUESTIONS,
    );
  });

  it('looks questions up by topic', () => {
    expect(questionsForTopic('graphs').length).toBeGreaterThan(0);
    expect(questionsForTopic('nope')).toEqual([]);
  });
});
