import { DestroyRef, Signal, computed, inject, signal } from '@angular/core';

export interface StepPlayer {
  /** Index of the step currently on screen. */
  readonly index: Signal<number>;
  readonly playing: Signal<boolean>;
  readonly atStart: Signal<boolean>;
  readonly atEnd: Signal<boolean>;
  next(): void;
  previous(): void;
  toggle(): void;
  reset(): void;
}

/**
 * Shared playback for the animated diagrams: play, pause, step and reset over
 * a fixed number of frames. Stops itself when the component is destroyed and
 * never starts on its own, so a page full of diagrams costs nothing until the
 * reader presses play.
 */
export function createStepPlayer(total: () => number, intervalMs = 1100): StepPlayer {
  const index = signal(0);
  const playing = signal(false);
  let timer: ReturnType<typeof setInterval> | undefined;

  const stop = (): void => {
    if (timer !== undefined) clearInterval(timer);
    timer = undefined;
    playing.set(false);
  };

  inject(DestroyRef).onDestroy(stop);

  const advance = (): void => {
    const last = total() - 1;
    if (index() >= last) {
      stop();
      return;
    }
    index.update((value) => value + 1);
  };

  return {
    index: index.asReadonly(),
    playing: playing.asReadonly(),
    atStart: computed(() => index() === 0),
    atEnd: computed(() => index() >= total() - 1),

    next: () => {
      stop();
      index.update((value) => Math.min(value + 1, total() - 1));
    },

    previous: () => {
      stop();
      index.update((value) => Math.max(value - 1, 0));
    },

    toggle: () => {
      if (playing()) {
        stop();
        return;
      }
      if (index() >= total() - 1) index.set(0);
      playing.set(true);
      timer = setInterval(advance, intervalMs);
    },

    reset: () => {
      stop();
      index.set(0);
    },
  };
}
