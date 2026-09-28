import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';

/** Navigations quicker than this finish before anything is shown. */
const GRACE_MS = 120;

/**
 * A slim bar across the top while a page's code is on its way. Pages load
 * lazily, so the first visit to a section waits for its chunk; without this
 * the old page simply sat there. Quick navigations never show it, so it does
 * not flicker on every click.
 */
@Component({
  selector: 'app-route-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-loading]': "state() === 'loading'",
    '[class.is-done]': "state() === 'done'",
    'aria-hidden': 'true',
  },
  template: `<span class="bar"></span>`,
  styles: `
    :host {
      position: fixed;
      inset: 0 0 auto;
      z-index: calc(var(--z-overlay) + 5);
      height: 2px;
      pointer-events: none;
    }

    .bar {
      display: block;
      height: 100%;
      background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 60%, white));
      box-shadow: 0 0 10px color-mix(in srgb, var(--accent) 70%, transparent);
      opacity: 0;
      transform: scaleX(0);
      transform-origin: left;
    }

    /* Races ahead, then slows: it never reaches the end until the page does. */
    :host(.is-loading) .bar {
      opacity: 1;
      animation: load 6s cubic-bezier(0.08, 0.7, 0.2, 1) forwards;
    }

    :host(.is-done) .bar {
      opacity: 0;
      transform: scaleX(1);
      transition:
        transform 180ms ease-out,
        opacity 260ms ease-in 160ms;
    }

    @keyframes load {
      from {
        transform: scaleX(0.04);
      }
      to {
        transform: scaleX(0.9);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      :host(.is-loading) .bar {
        animation: none;
        transform: scaleX(0.6);
      }
    }
  `,
})
export class RouteProgress {
  protected readonly state = signal<'idle' | 'loading' | 'done'>('idle');

  constructor() {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const subscription = inject(Router).events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        clearTimeout(timer);
        timer = setTimeout(() => this.state.set('loading'), GRACE_MS);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        clearTimeout(timer);
        if (this.state() === 'loading') this.state.set('done');
      }
    });
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(timer);
      subscription.unsubscribe();
    });
  }
}
