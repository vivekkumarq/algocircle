import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

/** Where the mark sits, and how it is turned, for one section of the site. */
interface Placement {
  /** Distance from the right edge, in viewport width units. */
  right: number;
  /** Distance from the top, in viewport height units. */
  top: number;
  size: number;
  rotate: number;
  /** Hue rotation applied to the accent tint, so sections feel distinct. */
  hue: number;
}

const SECTIONS: Record<string, Placement> = {
  '': { right: -8, top: 6, size: 66, rotate: -8, hue: 0 },
  learn: { right: -12, top: 14, size: 62, rotate: 6, hue: 12 },
  roadmap: { right: -6, top: 22, size: 58, rotate: -14, hue: -18 },
  patterns: { right: -14, top: 10, size: 64, rotate: 12, hue: 26 },
  problems: { right: -10, top: 18, size: 60, rotate: -6, hue: -30 },
  list: { right: -13, top: 12, size: 63, rotate: 9, hue: 40 },
  algorithms: { right: -9, top: 20, size: 61, rotate: -11, hue: -12 },
  course: { right: -15, top: 8, size: 67, rotate: 14, hue: 52 },
  interview: { right: -11, top: 16, size: 59, rotate: -9, hue: 34 },
  guide: { right: -12, top: 24, size: 57, rotate: 5, hue: -40 },
};

const DEFAULT: Placement = SECTIONS[''];

/**
 * A single translucent AlgoCircle mark behind every page.
 *
 * It is one fixed element that never repaints on scroll: the drift animation
 * touches `transform` only, and the whole thing is skipped under
 * `prefers-reduced-motion`. Each section of the site places and tints it
 * differently, so the background quietly tells you where you are.
 */
@Component({
  selector: 'app-watermark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="mark"
      aria-hidden="true"
      [style.--wm-right.vw]="place().right"
      [style.--wm-top.vh]="place().top"
      [style.--wm-size.vmin]="place().size"
      [style.--wm-rotate.deg]="place().rotate"
      [style.--wm-hue.deg]="place().hue"
    >
      <svg viewBox="0 0 32 32" fill="none" focusable="false">
        <circle cx="16" cy="16" r="14.6" class="plate" />
        <circle cx="16" cy="16" r="10.5" class="ring" />
        @for (node of nodes; track node.i) {
          <circle [attr.cx]="node.x" [attr.cy]="node.y" r="2.3" class="node" />
        }
        <circle cx="16" cy="16" r="1.7" class="core" />
        <path d="M16 5.5 A10.5 10.5 0 0 1 25.09 10.75" class="arc" />
      </svg>
    </div>
  `,
  styleUrl: './watermark.scss',
})
export class Watermark {
  private readonly router = inject(Router);

  /** First path segment of the current URL, which is the section. */
  private readonly section = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => this.sectionOf(event.urlAfterRedirects)),
      startWith(this.sectionOf(this.router.url)),
    ),
    { initialValue: '' },
  );

  protected readonly place = computed(() => SECTIONS[this.section()] ?? DEFAULT);

  /** The six ring nodes, matching the logo exactly. */
  protected readonly nodes = Array.from({ length: 6 }, (_, i) => {
    const angle = (-90 + i * 60) * (Math.PI / 180);
    return {
      i,
      x: +(16 + 10.5 * Math.cos(angle)).toFixed(2),
      y: +(16 + 10.5 * Math.sin(angle)).toFixed(2),
    };
  });

  private sectionOf(url: string): string {
    return url.split('?')[0].split('#')[0].split('/').filter(Boolean)[0] ?? '';
  }
}
