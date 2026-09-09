import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The AlgoCircle mark: three connected nodes on a traversal ring. */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="AlgoCircle"
    >
      <circle cx="16" cy="16" r="14.2" class="plate" />
      <circle cx="16" cy="16" r="10.6" class="ring" />
      <path d="M16 5.4 6.8 21.3h18.4z" class="edges" />
      <circle cx="16" cy="5.4" r="3" class="node node--accent" />
      <circle cx="6.8" cy="21.3" r="3" class="node" />
      <circle cx="25.2" cy="21.3" r="3" class="node" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      line-height: 0;
    }

    .plate {
      fill: var(--accent-soft);
    }

    .ring {
      stroke: var(--accent);
      stroke-width: 1.3;
      stroke-dasharray: 3.4 3.2;
      opacity: 0.55;
    }

    .edges {
      stroke: var(--accent);
      stroke-width: 1.5;
      stroke-linejoin: round;
      opacity: 0.85;
    }

    .node {
      fill: var(--bg-main);
      stroke: var(--accent);
      stroke-width: 1.6;
    }

    .node--accent {
      fill: var(--accent);
    }
  `,
})
export class Logo {
  readonly size = input(28);
}
