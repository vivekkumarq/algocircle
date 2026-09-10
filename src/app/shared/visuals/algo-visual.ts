import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { VISUALS, VisualName } from './visuals';

/**
 * Renders a named diagram from the registry. Chapters reference visuals by
 * name, so lesson content never imports a component.
 */
@Component({
  selector: 'app-algo-visual',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgComponentOutlet],
  template: `
    @if (component(); as visual) {
      <div class="frame">
        <ng-container *ngComponentOutlet="visual" />
      </div>
      @if (caption()) {
        <p class="caption">{{ caption() }}</p>
      }
    }
  `,
  styles: `
    :host {
      display: block;
      margin: var(--space-5) 0;
    }

    .frame {
      padding: var(--space-5) var(--space-4) var(--space-4);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      background: var(--bg-card);
    }

    .caption {
      margin: var(--space-2) 0 0;
      font-size: 0.78rem;
      color: var(--text-muted);
    }
  `,
})
export class AlgoVisual {
  readonly name = input.required<string>();
  readonly caption = input<string | undefined>(undefined);

  protected readonly component = computed(
    () => VISUALS[this.name() as VisualName] ?? null,
  );
}
