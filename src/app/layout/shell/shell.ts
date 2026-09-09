import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarNav } from '../sidebar-nav/sidebar-nav';
import { ProgressService } from '../../core/services/progress.service';
import { ROADMAP_STAGES } from '../../data/roadmaps/roadmap.data';
import { ProgressBar } from '../../shared/components/progress-bar/progress-bar';

/**
 * Two-column application layout: a persistent sidebar on desktop, and the
 * routed page beside it. The marketing home page renders outside this shell.
 */
@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SidebarNav, ProgressBar],
  template: `
    <aside class="rail">
      <div class="rail__inner">
        <app-sidebar-nav />
        <div class="rail__progress">
          <p class="rail__label">Roadmap progress</p>
          <app-progress-bar [value]="percent()" label="Roadmap progress" />
          <p class="rail__hint">{{ done() }} of {{ total }} stages marked complete</p>
        </div>
      </div>
    </aside>

    <div class="page">
      <router-outlet />
    </div>
  `,
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly progress = inject(ProgressService);

  protected readonly total = ROADMAP_STAGES.length;
  protected readonly done = computed(() => this.progress.completedTopics().size);
  protected readonly percent = computed(() => Math.round((this.done() / this.total) * 100));
}
