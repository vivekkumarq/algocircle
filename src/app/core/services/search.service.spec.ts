import { TestBed } from '@angular/core/testing';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let search: SearchService;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    search = TestBed.inject(SearchService);
    await search.ensureIndex();
  });

  it('builds its index lazily and only once', async () => {
    expect(search.ready()).toBe(true);
    await search.ensureIndex();
    expect(search.ready()).toBe(true);
  });

  it('ignores queries shorter than two characters', () => {
    expect(search.search('a')).toEqual([]);
    expect(search.search('')).toEqual([]);
  });

  it('finds a topic by name', () => {
    const results = search.search('dijkstra');
    expect(results.length).toBeGreaterThan(0);
  });

  it('ranks a title match above a body match', () => {
    const results = search.search('sliding window');
    expect(results[0].title.toLowerCase()).toContain('sliding window');
  });

  it('searches across every kind of content', () => {
    const kinds = new Set<string>();
    for (const term of ['binary search', 'heap', 'greedy', 'recursion', 'logic']) {
      search.search(term, 40).forEach((result) => kinds.add(result.kind));
    }

    expect(kinds.has('Topic')).toBe(true);
    expect(kinds.has('Pattern')).toBe(true);
    expect(kinds.has('Problem')).toBe(true);
    expect(kinds.has('Question')).toBe(true);
  });

  it('returns nothing for a term that does not appear', () => {
    expect(search.search('zzzzqqqq')).toEqual([]);
  });

  it('respects the result limit', () => {
    expect(search.search('the', 5).length).toBeLessThanOrEqual(5);
  });
});
