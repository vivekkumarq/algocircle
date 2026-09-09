import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let storage: StorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    storage = TestBed.inject(StorageService);
  });

  it('namespaces and versions every key', () => {
    expect(storage.key('theme')).toBe('algocircle:v1:theme');
  });

  it('returns the fallback when nothing is stored', () => {
    expect(storage.read('missing', 'default')).toBe('default');
  });

  it('round-trips structured values', () => {
    storage.write('progress', { solved: ['two-sum'], streak: 3 });
    expect(storage.read('progress', null)).toEqual({ solved: ['two-sum'], streak: 3 });
  });

  it('drops a corrupt entry instead of throwing', () => {
    localStorage.setItem('algocircle:v1:broken', '{not json');
    expect(storage.read('broken', 'fallback')).toBe('fallback');
    expect(localStorage.getItem('algocircle:v1:broken')).toBeNull();
  });

  it('clears only its own keys', () => {
    storage.write('a', 1);
    localStorage.setItem('unrelated', 'keep me');

    storage.clearAll();

    expect(storage.read('a', null)).toBeNull();
    expect(localStorage.getItem('unrelated')).toBe('keep me');
  });
});
