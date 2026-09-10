import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Icon } from '../../shared/components/icon/icon';
import { Logo } from '../../shared/components/logo/logo';
import { LayoutService } from '../../core/services/layout.service';
import { ThemeService } from '../../core/services/theme.service';

const THEME_ICON = { light: 'sun', dark: 'moon', system: 'monitor' } as const;
const THEME_LABEL = {
  light: 'Light theme',
  dark: 'Dark theme',
  system: 'System theme',
} as const;

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, Icon, Logo],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly layout = inject(LayoutService);
  protected readonly theme = inject(ThemeService);

  protected readonly menuOpen = this.layout.mobileNavOpen;
  protected readonly themeIcon = computed(() => THEME_ICON[this.theme.theme()]);
  protected readonly themeLabel = computed(
    () => `${THEME_LABEL[this.theme.theme()]}. Activate to change.`,
  );

  protected toggleMenu(): void {
    this.layout.toggleMobileNav();
  }

  protected cycleTheme(): void {
    this.theme.cycle();
  }
}
