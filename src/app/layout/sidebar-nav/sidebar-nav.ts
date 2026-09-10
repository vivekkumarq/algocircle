import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TOPIC_GROUPS } from '../../data/navigation.data';
import { LayoutService } from '../../core/services/layout.service';

/**
 * The curriculum as a plain numbered list. Shared by the desktop sidebar and
 * the mobile drawer so there is one definition of the navigation.
 */
@Component({
  selector: 'app-sidebar-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar-nav.html',
  styleUrl: './sidebar-nav.scss',
})
export class SidebarNav {
  private readonly layout = inject(LayoutService);

  protected readonly groups = TOPIC_GROUPS;

  protected pad(order: number): string {
    return order.toString().padStart(2, '0');
  }

  protected onNavigate(): void {
    this.layout.closeMobileNav();
  }
}
