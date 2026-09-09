import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { SidebarNav } from '../sidebar-nav/sidebar-nav';
import { LayoutService } from '../../core/services/layout.service';

/** Off-canvas navigation for tablet and phone widths. */
@Component({
  selector: 'app-mobile-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SidebarNav],
  template: `
    @if (open()) {
      <div class="scrim" (click)="close()" aria-hidden="true"></div>
      <div id="mobile-nav" class="drawer" role="dialog" aria-modal="true" aria-label="Navigation">
        <app-sidebar-nav />
      </div>
    }
  `,
  styles: `
    .scrim {
      position: fixed;
      inset: var(--header-h) 0 0;
      z-index: var(--z-overlay);
      background: var(--bg-overlay);
      animation: fade var(--dur) var(--ease);
    }

    .drawer {
      position: fixed;
      inset: var(--header-h) 0 0 auto;
      z-index: calc(var(--z-overlay) + 1);
      width: min(310px, 86vw);
      overflow-y: auto;
      border-left: 1px solid var(--border);
      background: var(--bg-main);
      box-shadow: var(--shadow-lg);
      animation: slide var(--dur) var(--ease);
    }

    @keyframes fade {
      from { opacity: 0; }
    }

    @keyframes slide {
      from { transform: translateX(100%); }
    }

    @media (min-width: 1024px) {
      :host { display: none; }
    }
  `,
})
export class MobileNav {
  private readonly layout = inject(LayoutService);
  protected readonly open = this.layout.mobileNavOpen;

  @HostListener('document:keydown.escape')
  protected close(): void {
    this.layout.closeMobileNav();
  }
}
