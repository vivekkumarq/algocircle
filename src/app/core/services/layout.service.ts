import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';

/**
 * Shared chrome state: the mobile navigation drawer, and the two desktop side
 * panels a reader can fold away to focus on the text. The panels remember
 * their state between visits.
 */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly storage = inject(StorageService);

  private readonly mobileNav = signal(false);
  private readonly sidebar = signal(this.storage.read('panel-left', true));
  private readonly contents = signal(this.storage.read('panel-right', true));
  private readonly wide = signal(true);

  readonly mobileNavOpen = this.mobileNav.asReadonly();
  /** The topic list on the left. */
  readonly sidebarOpen = this.sidebar.asReadonly();
  /** The "On this page" list on the right of a lesson. */
  readonly contentsOpen = this.contents.asReadonly();

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

  setSidebar(open: boolean): void {
    this.sidebar.set(open);
    this.storage.write('panel-left', open);
  }

  setContents(open: boolean): void {
    this.contents.set(open);
    this.storage.write('panel-right', open);
  }

  private lockScroll(locked: boolean): void {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = locked ? 'hidden' : '';
  }
}
