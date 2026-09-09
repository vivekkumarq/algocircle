import { Injectable, computed, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const THEME_COLOR: Record<ResolvedTheme, string> = { light: '#ffffff', dark: '#0b0d12' };

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = inject(StorageService);

  private readonly systemDark = signal(false);
  private readonly mode = signal<ThemeMode>('system');

  /** User selection: light, dark, or follow the operating system. */
  readonly theme = this.mode.asReadonly();

  /** What is actually painted right now. */
  readonly resolved = computed<ResolvedTheme>(() => {
    const mode = this.mode();
    if (mode === 'system') return this.systemDark() ? 'dark' : 'light';
    return mode;
  });

  constructor() {
    this.mode.set(this.readStored());

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
    this.storage.write(STORAGE_KEY, mode);
    this.apply();
  }

  /** Cycles light -> dark -> system, the order used by the header toggle. */
  cycle(): void {
    const order: ThemeMode[] = ['light', 'dark', 'system'];
    const nextIndex = (order.indexOf(this.mode()) + 1) % order.length;
    this.set(order[nextIndex]);
  }

  private apply(): void {
    if (typeof document === 'undefined') return;
    const resolved = this.resolved();
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.style.colorScheme = resolved;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLOR[resolved]);
  }

  private readStored(): ThemeMode {
    const stored = this.storage.read<ThemeMode>(STORAGE_KEY, 'system');
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  }
}
