import { Injectable, signal } from '@angular/core';

/** Shared chrome state: the mobile navigation drawer and the desktop sidebar. */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly mobileNav = signal(false);
  private readonly sidebar = signal(true);
  private readonly wide = signal(true);

  readonly mobileNavOpen = this.mobileNav.asReadonly();
  readonly sidebarOpen = this.sidebar.asReadonly();

  /** True once there is room for the sidebar and the table of contents. */
  readonly isWide = this.wide.asReadonly();

  constructor() {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const query = window.matchMedia('(min-width: 1100px)');
    this.wide.set(query.matches);
    query.addEventListener('change', (event) => {
      this.wide.set(event.matches);
      if (event.matches) this.closeMobileNav();
    });
  }

  toggleMobileNav(): void {
    this.mobileNav.update((open) => !open);
    this.lockScroll(this.mobileNav());
  }

  closeMobileNav(): void {
    if (!this.mobileNav()) return;
    this.mobileNav.set(false);
    this.lockScroll(false);
  }

  toggleSidebar(): void {
    this.sidebar.update((open) => !open);
  }

  private lockScroll(locked: boolean): void {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = locked ? 'hidden' : '';
  }
}
