import { Injectable, computed, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';

export type ThemeMode = 'system' | 'light' | 'paper' | 'dark' | 'midnight' | 'forest' | 'contrast';
export type ResolvedTheme = Exclude<ThemeMode, 'system'>;
export type FontChoice = 'sans' | 'serif' | 'rounded' | 'script' | 'marker' | 'mono';
export type SizeChoice = 'small' | 'normal' | 'large';

export interface ThemeOption {
  id: ThemeMode;
  label: string;
  hint: string;
  /** Swatch colours: page, surface, accent. */
  swatch: [string, string, string];
  dark: boolean;
}

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'system', label: 'System', hint: 'Follow the operating system', swatch: ['#ffffff', '#0b0d12', '#3b6cf6'], dark: false },
  { id: 'light', label: 'Light', hint: 'Clean white', swatch: ['#ffffff', '#f1f3f6', '#3b6cf6'], dark: false },
  { id: 'paper', label: 'Paper', hint: 'Warm and easy on the eyes', swatch: ['#fbf8f3', '#efe8dc', '#a2662a'], dark: false },
  { id: 'dark', label: 'Dark', hint: 'Neutral dark', swatch: ['#0b0d12', '#161b24', '#6f95ff'], dark: true },
  { id: 'midnight', label: 'Midnight', hint: 'Deep indigo', swatch: ['#0a0a18', '#191934', '#a78bfa'], dark: true },
  { id: 'forest', label: 'Forest', hint: 'Muted green', swatch: ['#0a1210', '#142320', '#4fd1a5'], dark: true },
  { id: 'contrast', label: 'Contrast', hint: 'Maximum legibility', swatch: ['#000000', '#161616', '#ffd400'], dark: true },
];

export const FONT_OPTIONS: { id: FontChoice; label: string; sample: string }[] = [
  { id: 'sans', label: 'Sans', sample: 'Aa' },
  { id: 'serif', label: 'Serif', sample: 'Aa' },
  { id: 'rounded', label: 'Rounded', sample: 'Aa' },
  { id: 'script', label: 'Script', sample: 'Aa' },
  { id: 'marker', label: 'Marker', sample: 'Aa' },
  { id: 'mono', label: 'Mono', sample: 'Aa' },
];

export const SIZE_OPTIONS: { id: SizeChoice; label: string }[] = [
  { id: 'small', label: 'Small' },
  { id: 'normal', label: 'Normal' },
  { id: 'large', label: 'Large' },
];

const KEY_THEME = 'theme';
const KEY_FONT = 'font';
const KEY_SIZE = 'size';

const THEME_COLOR: Record<ResolvedTheme, string> = {
  light: '#ffffff',
  paper: '#fbf8f3',
  dark: '#0b0d12',
  midnight: '#0a0a18',
  forest: '#0a1210',
  contrast: '#000000',
};

/** Appearance: palette, typeface and text size, persisted per browser. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = inject(StorageService);

  private readonly systemDark = signal(false);
  private readonly mode = signal<ThemeMode>('system');
  private readonly fontChoice = signal<FontChoice>('sans');
  private readonly sizeChoice = signal<SizeChoice>('normal');

  readonly theme = this.mode.asReadonly();
  readonly font = this.fontChoice.asReadonly();
  readonly size = this.sizeChoice.asReadonly();

  readonly themes = THEME_OPTIONS;
  readonly fonts = FONT_OPTIONS;
  readonly sizes = SIZE_OPTIONS;

  /** What is actually painted right now. */
  readonly resolved = computed<ResolvedTheme>(() => {
    const mode = this.mode();
    if (mode === 'system') return this.systemDark() ? 'dark' : 'light';
    return mode;
  });

  readonly isDark = computed(() => THEME_OPTIONS.find((t) => t.id === this.resolved())?.dark ?? false);

  constructor() {
    this.mode.set(this.readStored(KEY_THEME, THEME_OPTIONS.map((t) => t.id), 'system'));
    this.fontChoice.set(
      this.readStored(KEY_FONT, FONT_OPTIONS.map((option) => option.id), 'sans'),
    );
    this.sizeChoice.set(this.readStored(KEY_SIZE, ['small', 'normal', 'large'], 'normal'));

    if (typeof window !== 'undefined' && window.matchMedia) {
      const query = window.matchMedia('(prefers-color-scheme: dark)');
      this.systemDark.set(query.matches);
      query.addEventListener('change', (event) => {
        this.systemDark.set(event.matches);
        this.apply();
      });
    }

    this.apply();
  }

  set(mode: ThemeMode): void {
    this.mode.set(mode);
    this.storage.write(KEY_THEME, mode);
    this.apply();
  }

  setFont(font: FontChoice): void {
    this.fontChoice.set(font);
    this.storage.write(KEY_FONT, font);
    this.apply();
  }

  setSize(size: SizeChoice): void {
    this.sizeChoice.set(size);
    this.storage.write(KEY_SIZE, size);
    this.apply();
  }

  /** Quick toggle used by the keyboard shortcut and the compact header button. */
  toggleDark(): void {
    this.set(this.isDark() ? 'light' : 'dark');
  }

  private apply(): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const resolved = this.resolved();

    root.setAttribute('data-theme', resolved);
    root.setAttribute('data-font', this.fontChoice());
    root.setAttribute('data-size', this.sizeChoice());
    root.style.colorScheme = this.isDark() ? 'dark' : 'light';
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLOR[resolved]);
  }

  private readStored<T extends string>(key: string, allowed: readonly string[], fallback: T): T {
    const stored = this.storage.read<string>(key, fallback);
    return (allowed.includes(stored) ? stored : fallback) as T;
  }
}
