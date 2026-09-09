import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/components/icon/icon';

/**
 * A routed placeholder for sections scheduled in a later build phase. Inputs
 * are filled from the route's `data`, so the route table stays the single
 * source of truth for what each section will contain.
 */
@Component({
  selector: 'app-coming-soon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  template: `
    <header class="head">
      <p class="eyebrow"><app-icon [name]="icon()" [size]="14" /> {{ breadcrumb() }}</p>
      <h1>{{ heading() }}</h1>
      <p class="lead">{{ blurb() }}</p>
      <p class="phase">Scheduled for build phase {{ phase() }}</p>
    </header>

    @if (plans().length) {
      <section class="plan surface">
        <h2>What this section will hold</h2>
        <ul>
          @for (item of plans(); track item) {
            <li><app-icon name="check" [size]="14" /> {{ item }}</li>
          }
        </ul>
      </section>
    }

    <p class="links">
      Meanwhile:
      <a routerLink="/roadmap">follow the roadmap</a> or
      <a routerLink="/">revisit the overview</a>.
    </p>
  `,
  styleUrl: './coming-soon.scss',
})
export class ComingSoon {
  readonly heading = input('Coming soon');
  readonly blurb = input('This section is being built.');
  readonly breadcrumb = input('AlgoCircle');
  readonly icon = input('layers');
  readonly phase = input(2);
  readonly plans = input<string[]>([]);
}
