import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../../shared/components/icon/icon';

/**
 * A way back up from the bottom of a long page. It fades in on a scroll
 * timeline once the reader is a screen and a half down — no scroll listener,
 * the browser does it off the main thread. Browsers without scroll timelines
 * simply never show it; the page still scrolls.
 */
@Component({
  selector: 'app-back-to-top',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <button type="button" (click)="up()" aria-label="Back to the top" title="Back to the top">
      <app-icon name="arrow-down" [size]="17" />
    </button>
  `,
  styles: `
    :host {
      display: none;
    }

    @supports (animation-timeline: scroll()) {
      :host {
        position: fixed;
        right: max(var(--space-4), var(--safe-r));
        bottom: max(var(--space-4), var(--safe-b));
        z-index: calc(var(--z-overlay) - 5);
        display: block;
        animation: appear linear both;
        animation-timeline: scroll(root block);
        animation-range: 110vh 150vh;
      }
    }

    @keyframes appear {
      from {
        opacity: 0;
        visibility: hidden;
        transform: translateY(12px) scale(0.9);
      }
      to {
        opacity: 1;
        visibility: visible;
        transform: none;
      }
    }

    button {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      padding: 0;
      border: 1px solid var(--border-strong);
      border-radius: 50%;
      background: var(--glass);
      backdrop-filter: blur(10px);
      box-shadow: var(--shadow-md);
      color: var(--text-secondary);
      cursor: pointer;
      transition:
        color var(--dur-fast) var(--ease),
        border-color var(--dur-fast) var(--ease),
        transform var(--dur-fast) var(--ease);
    }

    button:hover {
      border-color: var(--accent);
      color: var(--accent-text);
      transform: translateY(-2px);
    }

    button app-icon {
      transform: rotate(180deg);
    }
  `,
})
export class BackToTop {
  protected up(): void {
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
  }
}
