import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Difficulty } from '../../../core/models';

/**
 * Difficulty never relies on colour alone: the label is always spelled out and
 * a shape marker repeats the level for anyone who cannot separate the hues.
 */
@Component({
  selector: 'app-difficulty-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [class]="'badge--' + level().toLowerCase()">
      <span class="marker" aria-hidden="true">{{ marker[level()] }}</span>
      {{ level() }}
    </span>
  `,
  styles: `
    :host { display: inline-flex; }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.16rem 0.55rem;
      border: 1px solid currentcolor;
      border-radius: var(--radius-pill);
      font-size: 0.72rem;
      font-weight: 560;
      letter-spacing: 0.01em;
    }

    .marker { font-size: 0.5rem; letter-spacing: 0.08em; }

    .badge--easy { color: var(--easy); background: var(--easy-soft); }
    .badge--medium { color: var(--medium); background: var(--medium-soft); }
    .badge--hard { color: var(--hard); background: var(--hard-soft); }
  `,
})
export class DifficultyBadge {
  readonly level = input.required<Difficulty>();

  protected readonly marker: Record<Difficulty, string> = {
    Easy: '●',
    Medium: '●●',
    Hard: '●●●',
  };
}
