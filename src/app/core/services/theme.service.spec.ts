import { TestBed } from '@angular/core/testing';
import { THEME_OPTIONS, ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
  });

  it('defaults to following the system, with sans text at normal size', () => {
    const theme = TestBed.inject(ThemeService);

    expect(theme.theme()).toBe('system');
    expect(theme.font()).toBe('sans');
    expect(theme.size()).toBe('normal');
  });

  it('offers a palette for every option it advertises', () => {
    const theme = TestBed.inject(ThemeService);

    expect(theme.themes.length).toBe(THEME_OPTIONS.length);
    expect(theme.themes.map((option) => option.id)).toContain('midnight');
    expect(new Set(theme.themes.map((option) => option.id)).size).toBe(theme.themes.length);
  });

  it('paints the chosen palette on the document', () => {
    const theme = TestBed.inject(ThemeService);
    theme.set('forest');

    expect(theme.resolved()).toBe('forest');
    expect(theme.isDark()).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('forest');
  });

  it('applies the typeface and text size as separate attributes', () => {
    const theme = TestBed.inject(ThemeService);
    theme.setFont('serif');
    theme.setSize('large');

    expect(document.documentElement.getAttribute('data-font')).toBe('serif');
    expect(document.documentElement.getAttribute('data-size')).toBe('large');
  });

  it('persists every choice under its own versioned key', () => {
    const theme = TestBed.inject(ThemeService);
    theme.set('paper');
    theme.setFont('mono');
    theme.setSize('small');

    expect(localStorage.getItem('algocircle:v1:theme')).toBe('"paper"');
    expect(localStorage.getItem('algocircle:v1:font')).toBe('"mono"');
    expect(localStorage.getItem('algocircle:v1:size')).toBe('"small"');
  });

  it('restores stored choices on start-up', () => {
    localStorage.setItem('algocircle:v1:theme', '"contrast"');
    localStorage.setItem('algocircle:v1:font', '"serif"');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});

    const theme = TestBed.inject(ThemeService);
    expect(theme.theme()).toBe('contrast');
    expect(theme.font()).toBe('serif');
  });

  it('ignores a stored value that is no longer valid', () => {
    localStorage.setItem('algocircle:v1:theme', '"neon"');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});

    expect(TestBed.inject(ThemeService).theme()).toBe('system');
  });

  it('toggles between light and dark', () => {
    const theme = TestBed.inject(ThemeService);
    theme.set('light');

    theme.toggleDark();
    expect(theme.theme()).toBe('dark');

    theme.toggleDark();
    expect(theme.theme()).toBe('light');
  });
});
