import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
  });

  it('defaults to following the system', () => {
    const theme = TestBed.inject(ThemeService);
    expect(theme.theme()).toBe('system');
  });

  it('resolves an explicit choice and paints it on the document', () => {
    const theme = TestBed.inject(ThemeService);
    theme.set('dark');

    expect(theme.resolved()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('persists the choice under the versioned key', () => {
    TestBed.inject(ThemeService).set('light');
    expect(localStorage.getItem('algocircle:v1:theme')).toBe('"light"');
  });

  it('cycles light, dark, then system', () => {
    const theme = TestBed.inject(ThemeService);
    theme.set('light');

    theme.cycle();
    expect(theme.theme()).toBe('dark');

    theme.cycle();
    expect(theme.theme()).toBe('system');

    theme.cycle();
    expect(theme.theme()).toBe('light');
  });

  it('restores a stored choice on start-up', () => {
    localStorage.setItem('algocircle:v1:theme', '"dark"');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});

    expect(TestBed.inject(ThemeService).theme()).toBe('dark');
  });
});
