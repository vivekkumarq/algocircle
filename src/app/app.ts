import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { MobileNav } from './layout/mobile-nav/mobile-nav';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, MobileNav],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // Instantiated here so the stored theme is applied for the whole session.
  private readonly theme = inject(ThemeService);

  /**
   * `<base href>` would turn a bare `#main` into a navigation back to the
   * landing page, so the skip link moves focus itself.
   */
  protected focusMain(event: Event): void {
    event.preventDefault();
    document.getElementById('main')?.focus();
  }
}
