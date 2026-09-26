import { Component, inject } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { MobileNav } from './layout/mobile-nav/mobile-nav';
import { SearchOverlay } from './layout/search-overlay/search-overlay';
import { Watermark } from './layout/watermark/watermark';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, MobileNav, SearchOverlay, Watermark],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // Instantiated here so the stored theme is applied for the whole session.
  private readonly theme = inject(ThemeService);

  constructor() {
    // The router scrolls anchors to the very top of the window, ignoring the
    // `scroll-margin-top` the headings carry, so a section arrived at from
    // another page lands underneath the sticky header. Tell the scroller how
    // tall that header is instead.
    inject(ViewportScroller).setOffset(() => [
      0,
      (document.querySelector('app-header')?.getBoundingClientRect().height ?? 0) + 16,
    ]);
  }

  /**
   * `<base href>` would turn a bare `#main` into a navigation back to the
   * landing page, so the skip link moves focus itself.
   */
  protected focusMain(event: Event): void {
    event.preventDefault();
    document.getElementById('main')?.focus();
  }
}
