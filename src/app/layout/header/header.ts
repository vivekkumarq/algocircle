import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Icon } from '../../shared/components/icon/icon';
import { Logo } from '../../shared/components/logo/logo';
import { LayoutService } from '../../core/services/layout.service';
import { SearchService } from '../../core/services/search.service';
import { AppearanceMenu } from '../appearance-menu/appearance-menu';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, Icon, Logo, AppearanceMenu],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly layout = inject(LayoutService);

  protected readonly menuOpen = this.layout.mobileNavOpen;

  /** The overlay listens for this on the document, so the button and the
      keyboard shortcut share one code path. */
  protected openSearch(): void {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }));
  }

  protected toggleMenu(): void {
    this.layout.toggleMobileNav();
  }
}
