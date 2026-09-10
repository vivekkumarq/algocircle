import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarNav } from '../sidebar-nav/sidebar-nav';

/**
 * Two-column layout: the topic list on the left, the routed page beside it.
 * The landing page renders outside this shell.
 */
@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SidebarNav],
  template: `
    <aside class="rail">
      <div class="rail__inner">
        <app-sidebar-nav />
      </div>
    </aside>

    <div class="page">
      <router-outlet />
    </div>
  `,
  styleUrl: './shell.scss',
})
export class Shell {}
