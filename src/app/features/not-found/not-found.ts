import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  template: `
    <div class="wrap">
      <p class="code">404</p>
      <h1>We couldn't find that page</h1>
      <p class="lead">
        The link may be out of date, or the section may not be built yet. The roadmap is the
        quickest way back to something useful.
      </p>
      <div class="actions">
        <a class="btn btn--primary" routerLink="/roadmap">
          Go to the roadmap <app-icon name="arrow-right" [size]="15" />
        </a>
        <a class="btn btn--secondary" routerLink="/">Back to home</a>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: grid;
      place-items: center;
      min-height: 56vh;
      padding: var(--space-6) var(--space-5);
    }

    .wrap {
      max-width: 52ch;
      text-align: center;
    }

    .code {
      margin: 0 0 var(--space-3);
      font-family: var(--font-mono);
      font-size: 3rem;
      font-weight: 600;
      color: var(--accent-text);
      letter-spacing: -0.04em;
    }

    .lead {
      margin-inline: auto;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
      justify-content: center;
      margin-top: var(--space-5);
    }
  `,
})
export class NotFound {}
