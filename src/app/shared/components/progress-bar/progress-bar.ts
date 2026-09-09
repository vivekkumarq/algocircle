import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar" role="progressbar" [attr.aria-valuenow]="clamped()" aria-valuemin="0"
      aria-valuemax="100" [attr.aria-label]="label()">
      <span class="fill" [style.width.%]="clamped()"></span>
    </div>
    @if (showValue()) {
      <span class="value">{{ clamped() }}%</span>
    }
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      width: 100%;
    }

    .bar {
      position: relative;
      flex: 1;
      height: 6px;
      overflow: hidden;
      border-radius: var(--radius-pill);
      background: var(--bg-inset);
      box-shadow: inset 0 0 0 1px var(--border);
    }

    .fill {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: var(--accent);
      transition: width var(--dur-slow) var(--ease);
    }

    .value {
      min-width: 3.2ch;
      font-family: var(--font-mono);
      font-size: 0.74rem;
      color: var(--text-muted);
      text-align: right;
    }
  `,
})
export class ProgressBar {
  readonly value = input(0);
  readonly label = input('Progress');
  readonly showValue = input(true);

  protected readonly clamped = computed(() =>
    Math.max(0, Math.min(100, Math.round(this.value()))),
  );
}
