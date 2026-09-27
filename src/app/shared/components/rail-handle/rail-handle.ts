import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** How far a drag has to travel before it counts as "hide" or "show". */
const DRAG = 24;

/**
 * The seam between a side panel and the reading column. The line is the
 * panel's border; the triangle on it hides the panel when clicked, or when
 * dragged towards the edge of the screen, and brings it back the other way.
 */
@Component({
  selector: 'app-rail-handle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-left]': "side() === 'left'",
    '[class.is-open]': 'open()',
  },
  template: `
    <button
      type="button"
      class="grip"
      [attr.aria-expanded]="open()"
      [attr.aria-label]="(open() ? 'Hide ' : 'Show ') + label()"
      [title]="(open() ? 'Hide ' : 'Show ') + label() + ' (click or drag)'"
      (pointerdown)="down($event)"
      (pointermove)="move($event)"
      (pointerup)="startX = null"
      (pointercancel)="startX = null"
      (click)="click()"
    >
      <svg viewBox="0 0 10 10" aria-hidden="true"><path d="M6.8 1.8 2.6 5l4.2 3.2z" /></svg>
    </button>
  `,
  styleUrl: './rail-handle.scss',
})
export class RailHandle {
  readonly side = input.required<'left' | 'right'>();
  readonly open = input.required<boolean>();
  readonly label = input.required<string>();
  readonly openChange = output<boolean>();

  protected startX: number | null = null;
  private dragged = false;

  protected down(event: PointerEvent): void {
    if (event.button !== 0) return;
    this.startX = event.clientX;
    this.dragged = false;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  protected move(event: PointerEvent): void {
    if (this.startX === null) return;
    const dx = event.clientX - this.startX;
    if (Math.abs(dx) < DRAG) return;

    // Towards the screen edge hides; back towards the text shows.
    const hide = this.side() === 'left' ? dx < 0 : dx > 0;
    this.dragged = true;
    this.startX = null;
    if (hide === this.open()) this.openChange.emit(!hide);
  }

  protected click(): void {
    // A drag ends in a click on the same element; it has already acted.
    if (this.dragged) {
      this.dragged = false;
      return;
    }
    this.openChange.emit(!this.open());
  }
}
