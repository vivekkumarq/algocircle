import { TestBed } from '@angular/core/testing';
import { RailHandle } from './rail-handle';

describe('rail handle', () => {
  function make(side: 'left' | 'right', open: boolean) {
    const fixture = TestBed.createComponent(RailHandle);
    fixture.componentRef.setInput('side', side);
    fixture.componentRef.setInput('open', open);
    fixture.componentRef.setInput('label', 'the panel');
    fixture.detectChanges();

    const emitted: boolean[] = [];
    fixture.componentInstance.openChange.subscribe((value) => emitted.push(value));

    const grip: HTMLButtonElement = fixture.nativeElement.querySelector('.grip');
    // jsdom has no pointer capture; the handle only needs the call to exist.
    grip.setPointerCapture = () => undefined;
    return { grip, emitted };
  }

  function drag(grip: HTMLElement, dx: number) {
    const at = (type: string, x: number) =>
      grip.dispatchEvent(Object.assign(new MouseEvent(type, { clientX: x, button: 0 }), { pointerId: 1 }));
    at('pointerdown', 100);
    at('pointermove', 100 + dx / 2);
    at('pointermove', 100 + dx);
    at('pointerup', 100 + dx);
    grip.click(); // a real drag ends in a click on the same element
  }

  it('toggles on a plain click', () => {
    const { grip, emitted } = make('left', true);
    grip.click();
    expect(emitted).toEqual([false]);
  });

  it('hides when dragged towards its own edge, and the trailing click does nothing', () => {
    const left = make('left', true);
    drag(left.grip, -60);
    expect(left.emitted).toEqual([false]);

    const right = make('right', true);
    drag(right.grip, 60);
    expect(right.emitted).toEqual([false]);
  });

  it('shows when dragged back towards the text', () => {
    const { grip, emitted } = make('left', false);
    drag(grip, 60);
    expect(emitted).toEqual([true]);
  });

  it('ignores a drag in the direction it already is', () => {
    const { grip, emitted } = make('right', true);
    drag(grip, -60);
    expect(emitted).toEqual([]);
  });

  it('says what it will do', () => {
    const { grip } = make('right', false);
    expect(grip.getAttribute('aria-expanded')).toBe('false');
    expect(grip.getAttribute('aria-label')).toBe('Show the panel');
  });
});
