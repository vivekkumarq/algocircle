import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { Icon } from '../../shared/components/icon/icon';

/**
 * A way back up from the bottom of a long page, shown once the reader is a
 * screen and a half down. Where the browser has scroll timelines it fades in
 * on one, off the main thread. Elsewhere (Firefox, older Safari) a single
 * IntersectionObserver watches a marker placed at that depth - still no
 * scroll listener.
 */
@Component({
  selector: 'app-back-to-top',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: { '[class.is-shown]': 'shown()' },
  template: `
    <button type="button" (click)="up()" aria-label="Back to the top" title="Back to the top">
      <app-icon name="arrow-down" [size]="17" />
    </button>
  `,
  styles: `
    :host {
      position: fixed;
      right: max(var(--space-4), var(--safe-r));
      bottom: max(var(--space-4), var(--safe-b));
      z-index: calc(var(--z-overlay) - 5);
      display: block;
      opacity: 0;
      visibility: hidden;
      transform: translateY(12px) scale(0.9);
      transition:
        opacity var(--dur) var(--ease),
        transform var(--dur) var(--ease),
        visibility var(--dur);
    }

    :host(.is-shown) {
      opacity: 1;
      visibility: visible;
      transform: none;
    }

    @supports (animation-timeline: scroll()) {
      :host {
        transition: none;
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
  /** Only used where scroll timelines are missing. */
  protected readonly shown = signal(false);

  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      if (CSS.supports('animation-timeline: scroll()') || typeof IntersectionObserver === 'undefined') return;

      // A strip covering the page's first 1.1 screens: once none of it is in
      // view, the reader is far enough down to want the button. It starts at
      // the very top so a jump past it (a contents link) still changes its
      // state; a small marker at that depth would be skipped over unseen.
      const marker = document.createElement('div');
      marker.setAttribute('aria-hidden', 'true');
      marker.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:110vh;pointer-events:none;';
      document.body.append(marker);

      const observer = new IntersectionObserver(([entry]) => this.shown.set(!entry.isIntersecting));
      observer.observe(marker);
      destroy.onDestroy(() => {
        observer.disconnect();
        marker.remove();
      });
    });
  }

  protected up(): void {
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
  }
}
