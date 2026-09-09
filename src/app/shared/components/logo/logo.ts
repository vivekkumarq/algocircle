import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * The AlgoCircle mark: six nodes on a ring, with a traversal running around it
 * lighting each node as it arrives — an algorithm walking a circle.
 * The animation is ambient and stops entirely under `prefers-reduced-motion`.
 */
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
      <circle cx="16" cy="16" r="14.6" class="plate" />
      <circle cx="16" cy="16" r="10.5" class="ring" />

      <g class="sweep">
        <path d="M16 5.5 A10.5 10.5 0 0 1 25.09 10.75" class="arc" />
        <circle cx="25.09" cy="10.75" r="1.6" class="traveller" />
      </g>

      @for (node of nodes; track node.i) {
        <circle
          [attr.cx]="node.x"
          [attr.cy]="node.y"
          r="2.3"
          class="node"
          [style.animation-delay]="node.delay"
        />
      }

      <circle cx="16" cy="16" r="1.7" class="core" />
    </svg>
  `,
  styleUrl: './logo.scss',
})
export class Logo {
  readonly size = input(28);

  /** Six evenly spaced points on the ring, each lit as the traversal reaches it. */
  protected readonly nodes = Array.from({ length: 6 }, (_, i) => {
    const angle = (-90 + i * 60) * (Math.PI / 180);
    return {
      i,
      x: +(16 + 10.5 * Math.cos(angle)).toFixed(2),
      y: +(16 + 10.5 * Math.sin(angle)).toFixed(2),
      // The traveller leads the arc, so the node it is heading for lights first.
      delay: `${(i + 5) % 6}s`,
    };
  });
}
