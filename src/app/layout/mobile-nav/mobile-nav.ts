import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { SidebarNav } from '../sidebar-nav/sidebar-nav';
import { LayoutService } from '../../core/services/layout.service';
import { Icon } from '../../shared/components/icon/icon';

/** Off-canvas navigation for tablet and phone widths. */
@Component({
  selector: 'app-mobile-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SidebarNav, Icon],
  template: `
    @if (open()) {
      <div class="scrim" (click)="close()" aria-hidden="true"></div>
      <div id="mobile-nav" class="drawer" role="dialog" aria-modal="true" aria-label="Navigation">
        <div class="drawer__top">
          <button type="button" class="search" (click)="openSearch()">
            <app-icon name="search" [size]="15" />
            Search the curriculum
            <span class="kbd">/</span>
          </button>
        </div>
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
      backdrop-filter: blur(4px);
      animation: fade var(--dur) var(--ease);
    }

    .drawer {
      position: fixed;
      inset: var(--header-h) 0 0 auto;
      z-index: calc(var(--z-overlay) + 1);
      display: flex;
      flex-direction: column;
      width: min(360px, calc(100vw - 1.25rem));
      padding-bottom: var(--safe-b);
      padding-right: var(--safe-r);
      overflow-y: auto;
      overscroll-behavior: contain;
      border-left: 1px solid var(--border);
      background: var(--bg-main);
      box-shadow: var(--shadow-lg);
      animation: slide var(--dur) var(--ease);
    }

    .drawer__top {
      position: sticky;
      top: 0;
      z-index: 1;
      padding: var(--space-4) var(--space-4) var(--space-3);
      background: var(--bg-main);
    }

    .search {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      width: 100%;
      min-height: var(--touch);
      padding: 0.45rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: var(--bg-subtle);
      color: var(--text-muted);
      font-size: 0.86rem;
    }

    .search .kbd {
      margin-left: auto;
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

  protected openSearch(): void {
    this.close();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }));
  }
}
