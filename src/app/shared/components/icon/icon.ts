import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * A single stroked-path icon set kept in the bundle rather than pulled from a
 * CDN, so the interface still renders with no network connection.
 */
const ICONS: Record<string, string[]> = {
  book: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'],
  target: [
    'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
    'M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
    'M13 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0',
  ],
  briefcase: [
    'M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z',
    'M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2',
  ],
  chart: ['M3 3v18h18', 'M7 16v-4', 'M12 16V8', 'M17 16v-6'],
  tool: ['M4 6h16', 'M4 12h16', 'M4 18h16', 'M9 4v4', 'M15 10v4', 'M9 16v4'],
  sun: [
    'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
    'M12 2v2',
    'M12 20v2',
    'M4.9 4.9l1.4 1.4',
    'M17.7 17.7l1.4 1.4',
    'M2 12h2',
    'M20 12h2',
    'M4.9 19.1l1.4-1.4',
    'M17.7 6.3l1.4-1.4',
  ],
  moon: ['M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z'],
  monitor: ['M3 4h18v12H3z', 'M8 20h8', 'M12 16v4'],
  menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
  close: ['M18 6 6 18', 'M6 6l12 12'],
  search: ['M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0', 'M20 20l-4.2-4.2'],
  'arrow-right': ['M5 12h14', 'M13 5l7 7-7 7'],
  'arrow-down': ['M12 5v14', 'M19 13l-7 7-7-7'],
  'chevron-down': ['M6 9l6 6 6-6'],
  'chevron-right': ['M9 6l6 6-6 6'],
  check: ['M20 6 9 17l-5-5'],
  code: ['M16 18l6-6-6-6', 'M8 6l-6 6 6 6'],
  terminal: ['M4 17l6-6-6-6', 'M12 19h8'],
  layers: ['M12 2 2 7l10 5 10-5-10-5z', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'],
  zap: ['M13 2 3 14h8l-1 8 10-12h-8l1-8z'],
  map: ['M9 6 3 4v14l6 2 6-2 6 2V6l-6-2-6 2z', 'M9 6v14', 'M15 4v14'],
  eye: ['M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z', 'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0'],
  repeat: ['M17 2l4 4-4 4', 'M3 11V9a4 4 0 0 1 4-4h14', 'M7 22l-4-4 4-4', 'M21 13v2a4 4 0 0 1-4 4H3'],
  clock: ['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0', 'M12 7v5l3 2'],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  flame: ['M12 2c3 4 6 6 6 10a6 6 0 0 1-12 0c0-2 1-3.2 2.2-4.2C9.4 9.9 10.6 9.4 11 8c.6-2 .8-4 1-6z'],
  bookmark: ['M19 21l-7-4.5L5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'],
  compass: ['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0', 'M15.5 8.5l-2 5-5 2 2-5z'],
  network: [
    'M9 5a3 3 0 1 1 6 0 3 3 0 0 1-6 0',
    'M2 19a3 3 0 1 1 6 0 3 3 0 0 1-6 0',
    'M16 19a3 3 0 1 1 6 0 3 3 0 0 1-6 0',
    'M10.5 7.3 6.6 15.4',
    'M13.5 7.3l3.9 8.1',
  ],
  grid: ['M4 4h7v7H4z', 'M13 4h7v7h-7z', 'M4 13h7v7H4z', 'M13 13h7v7h-7z'],
  lock: ['M5 11h14v10H5z', 'M8 11V7a4 4 0 0 1 8 0v4'],
  github: [
    'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5a5.4 5.4 0 0 0-1-3.5 5 5 0 0 0 0-3.5S17.5 2 15 3.5a12.3 12.3 0 0 0-6 0C6.5 2 5.5 2 5.5 2a5 5 0 0 0 0 3.5A5.4 5.4 0 0 0 4.5 9c0 3.5 3 5.5 6 5.5A4.8 4.8 0 0 0 9.5 18v4',
    'M9.5 18c-4.5 2-5-2-7-2',
  ],
  external: ['M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6', 'M15 3h6v6', 'M10 14 21 3'],
};

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth()"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      @for (path of paths(); track path) {
        <path [attr.d]="path" />
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex: none;
      line-height: 0;
    }
  `,
})
export class Icon {
  readonly name = input.required<string>();
  readonly size = input(18);
  readonly strokeWidth = input(1.7);

  protected readonly paths = computed(() => ICONS[this.name()] ?? []);
}
