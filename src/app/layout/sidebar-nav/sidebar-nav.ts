import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAV_SECTIONS } from '../../data/navigation.data';
import { Icon } from '../../shared/components/icon/icon';
import { LayoutService } from '../../core/services/layout.service';

/**
 * The section tree used by both the desktop sidebar and the mobile drawer,
 * so there is one definition of the navigation markup.
 */
@Component({
  selector: 'app-sidebar-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './sidebar-nav.html',
  styleUrl: './sidebar-nav.scss',
})
export class SidebarNav {
  private readonly layout = inject(LayoutService);

  protected readonly sections = NAV_SECTIONS;
  protected readonly collapsed = signal<ReadonlySet<string>>(new Set<string>());

  protected isCollapsed(id: string): boolean {
    return this.collapsed().has(id);
  }

  protected toggle(id: string): void {
    const next = new Set(this.collapsed());
    if (!next.delete(id)) next.add(id);
    this.collapsed.set(next);
  }

  protected onNavigate(): void {
    this.layout.closeMobileNav();
  }
}
