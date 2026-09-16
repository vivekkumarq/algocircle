import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Icon } from '../../shared/components/icon/icon';
import { Logo } from '../../shared/components/logo/logo';
import { LayoutService } from '../../core/services/layout.service';
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
  private readonly host = inject(ElementRef<HTMLElement>);

  protected readonly menuOpen = this.layout.mobileNavOpen;
  protected readonly moreOpen = signal(false);

  /** The overlay listens for this on the document, so the button and the
      keyboard shortcut share one code path. */
  protected openSearch(): void {
    this.moreOpen.set(false);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }));
  }

  protected toggleMenu(): void {
    this.moreOpen.set(false);
    this.layout.toggleMobileNav();
  }

  protected toggleMore(): void {
    this.moreOpen.update((open) => !open);
  }

  @HostListener('document:keydown.escape')
  protected closeMore(): void {
    this.moreOpen.set(false);
  }

  @HostListener('document:pointerdown', ['$event'])
  protected onOutsideClick(event: PointerEvent): void {
    if (!this.moreOpen()) return;
    if (!this.host.nativeElement.contains(event.target as Node)) this.moreOpen.set(false);
  }
}
