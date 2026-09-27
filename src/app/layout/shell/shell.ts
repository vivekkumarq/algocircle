import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarNav } from '../sidebar-nav/sidebar-nav';
import { RailHandle } from '../../shared/components/rail-handle/rail-handle';
import { LayoutService } from '../../core/services/layout.service';

/**
 * Two-column layout: the topic list on the left, the routed page beside it,
 * and between them a handle that folds the list away. The landing page
 * renders outside this shell.
 */
@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SidebarNav, RailHandle],
  host: { '[class.is-folded]': '!layout.sidebarOpen()' },
  template: `
    <aside class="rail" [attr.inert]="layout.sidebarOpen() ? null : ''">
      <div class="rail__inner">
        <app-sidebar-nav />
      </div>
    </aside>

    <app-rail-handle
      class="handle"
      side="left"
      label="the topic list"
      [open]="layout.sidebarOpen()"
      (openChange)="layout.setSidebar($event)"
    />

    <div class="page">
      <router-outlet />
    </div>
  `,
  styleUrl: './shell.scss',
})
export class Shell {
  protected readonly layout = inject(LayoutService);
}
