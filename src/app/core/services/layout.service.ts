import { Injectable, signal } from '@angular/core';

/** Shared chrome state: the mobile navigation drawer and the desktop sidebar. */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly mobileNav = signal(false);
  private readonly sidebar = signal(true);

  readonly mobileNavOpen = this.mobileNav.asReadonly();
  readonly sidebarOpen = this.sidebar.asReadonly();

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
