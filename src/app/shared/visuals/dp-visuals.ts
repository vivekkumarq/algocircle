import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { createStepPlayer } from './step-player';

/* ---------------------------------------------------------------------------
   Diagrams for the string, greedy and dynamic-programming topics.
   Like the others, each one builds its frames by running the real algorithm.
   --------------------------------------------------------------------------- */

const CONTROLS = `
  <div class="viz-controls">
    <button type="button" class="viz-btn" (click)="player.previous()" [disabled]="player.atStart()">Back</button>
    <button type="button" class="viz-btn viz-btn--primary" (click)="player.toggle()">
      {{ player.playing() ? 'Pause' : 'Play' }}
    </button>
    <button type="button" class="viz-btn" (click)="player.next()" [disabled]="player.atEnd()">Step</button>
    <button type="button" class="viz-btn" (click)="player.reset()">Reset</button>
    <span class="viz-progress">{{ player.index() + 1 }} / {{ frames.length }}</span>
  </div>
`;

/* ============================== DP table ================================== */

type DpMode = 'edit' | 'lcs';

interface DpFrame {
  grid: number[][];
  row: number;
  col: number;
  /** Cells the current one was computed from. */
  from: [number, number][];
  note: string;
}

@Component({
  selector: 'viz-dp-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="viz">
      <div class="viz-controls">
        @for (option of modes; track option) {
          <button
            type="button"
            class="viz-btn"
            [class.viz-btn--primary]="option === mode"
            (click)="setMode(option)"
          >
            {{ option === 'edit' ? 'Edit distance' : 'Longest common subsequence' }}
          </button>
        }
      </div>

      <div class="dp-scroll">
        <table class="dp">
          <tbody>
            <tr>
              <td class="dp__corner"></td>
              <td class="dp__head">""</td>
              @for (ch of b; track $index) {
                <td class="dp__head">{{ ch }}</td>
              }
            </tr>
            @for (row of frame().grid; track $index; let r = $index) {
              <tr>
                <td class="dp__head">{{ r === 0 ? '""' : a[r - 1] }}</td>
                @for (value of row; track $index; let c = $index) {
                  <td
                    class="dp__cell"
                    [class.dp__cell--current]="r === frame().row && c === frame().col"
                    [class.dp__cell--source]="isSource(r, c)"
                    [class.dp__cell--filled]="isFilled(r, c)"
                  >
                    {{ isFilled(r, c) || (r === frame().row && c === frame().col) ? value : '' }}
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>

      <p class="viz-note">{{ frame().note }}</p>
      ${CONTROLS}
    </figure>
  `,
})
export class VizDpTable {
  protected readonly a = ['r', 'o', 's'];
  protected readonly b = ['h', 'o', 'r', 's', 'e'];

  protected readonly modes: DpMode[] = ['edit', 'lcs'];
  protected mode: DpMode = 'edit';

  protected frames: DpFrame[] = this.build('edit');
  protected readonly player = createStepPlayer(() => this.frames.length, 700);
  protected readonly frame = computed(() => this.frames[this.player.index()]);

  protected setMode(mode: DpMode): void {
    this.mode = mode;
    this.frames = this.build(mode);
    this.player.reset();
  }

  protected isSource(row: number, col: number): boolean {
    return this.frame().from.some(([r, c]) => r === row && c === col);
  }

  /** A cell is shown once the walk has passed it. */
  protected isFilled(row: number, col: number): boolean {
    const frame = this.frame();
    return row < frame.row || (row === frame.row && col < frame.col);
  }

  private build(mode: DpMode): DpFrame[] {
    const n = this.a.length;
    const m = this.b.length;
    const grid = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
    const frames: DpFrame[] = [];

    if (mode === 'edit') {
      for (let i = 0; i <= n; i++) grid[i][0] = i;
      for (let j = 0; j <= m; j++) grid[0][j] = j;

      frames.push({
        grid: grid.map((row) => [...row]),
        row: 0,
        col: 0,
        from: [],
        note: 'Base cases: turning a string into the empty string costs one deletion per character.',
      });
    } else {
      frames.push({
        grid: grid.map((row) => [...row]),
        row: 0,
        col: 0,
        from: [],
        note: 'Base cases: the longest common subsequence with an empty string is always 0.',
      });
    }

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        const match = this.a[i - 1] === this.b[j - 1];

        if (mode === 'edit') {
          if (match) {
            grid[i][j] = grid[i - 1][j - 1];
            frames.push({
              grid: grid.map((row) => [...row]),
              row: i,
              col: j,
              from: [[i - 1, j - 1]],
              note: `'${this.a[i - 1]}' matches '${this.b[j - 1]}', so nothing to pay — copy the diagonal: ${grid[i][j]}.`,
            });
          } else {
            grid[i][j] = 1 + Math.min(grid[i - 1][j - 1], grid[i - 1][j], grid[i][j - 1]);
            frames.push({
              grid: grid.map((row) => [...row]),
              row: i,
              col: j,
              from: [
                [i - 1, j - 1],
                [i - 1, j],
                [i, j - 1],
              ],
              note: `'${this.a[i - 1]}' and '${this.b[j - 1]}' differ. Take the cheapest of replace, delete and insert, plus one: ${grid[i][j]}.`,
            });
          }
        } else {
          if (match) {
            grid[i][j] = grid[i - 1][j - 1] + 1;
            frames.push({
              grid: grid.map((row) => [...row]),
              row: i,
              col: j,
              from: [[i - 1, j - 1]],
              note: `'${this.a[i - 1]}' matches '${this.b[j - 1]}', so extend the diagonal by one: ${grid[i][j]}.`,
            });
          } else {
            grid[i][j] = Math.max(grid[i - 1][j], grid[i][j - 1]);
            frames.push({
              grid: grid.map((row) => [...row]),
              row: i,
              col: j,
              from: [
                [i - 1, j],
                [i, j - 1],
              ],
              note: `No match, so drop a character from one side and keep the better result: ${grid[i][j]}.`,
            });
          }
        }
      }
    }

    const answer = grid[n][m];
    frames.push({
      grid: grid.map((row) => [...row]),
      row: n,
      col: m,
      from: [],
      note:
        mode === 'edit'
          ? `The bottom-right corner is the answer: ${answer} edits turn "ros" into "horse". Every cell was computed once, so it is O(n x m).`
          : `The bottom-right corner is the answer: the longest common subsequence has length ${answer}. Every cell was computed once, so it is O(n x m).`,
    });

    return frames;
  }
}

/* ========================== Palindrome centres ============================ */

@Component({
  selector: 'viz-palindrome',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="viz">
      <div class="viz-row">
        @for (ch of letters; track $index) {
          <span
            class="viz-cell"
            [class.viz-cell--active]="$index >= frame().lo && $index <= frame().hi"
            [class.viz-cell--found]="frame().best && $index >= frame().lo && $index <= frame().hi"
          >
            {{ ch }}
          </span>
        }
      </div>
      <div class="viz-index">
        @for (ch of letters; track $index) {
          <span>{{ $index }}</span>
        }
      </div>
      <p class="viz-note">{{ frame().note }}</p>
      ${CONTROLS}
    </figure>
  `,
})
export class VizPalindrome {
  protected readonly letters = ['b', 'a', 'b', 'a', 'd'];
  protected readonly frames = this.build();
  protected readonly player = createStepPlayer(() => this.frames.length, 850);
  protected readonly frame = computed(() => this.frames[this.player.index()]);

  private build(): { lo: number; hi: number; best: boolean; note: string }[] {
    const frames: { lo: number; hi: number; best: boolean; note: string }[] = [];
    const n = this.letters.length;
    let bestLo = 0;
    let bestLength = 1;

    const expand = (start: number, end: number, kind: string): void => {
      let lo = start;
      let hi = end;

      if (hi < n && this.letters[lo] !== this.letters[hi]) {
        frames.push({ lo: start, hi: Math.min(end, n - 1), best: false, note: `${kind}: the two characters differ, so nothing grows from here.` });
        return;
      }

      while (lo >= 0 && hi < n && this.letters[lo] === this.letters[hi]) {
        frames.push({ lo, hi, best: false, note: `${kind}: "${this.letters.slice(lo, hi + 1).join('')}" is a palindrome — try widening it.` });
        lo--;
        hi++;
      }

      const length = hi - lo - 1;
      if (length > bestLength) {
        bestLength = length;
        bestLo = lo + 1;
        frames.push({ lo: lo + 1, hi: hi - 1, best: true, note: `New longest: "${this.letters.slice(lo + 1, hi).join('')}", length ${length}.` });
      }
    };

    for (let centre = 0; centre < n; centre++) {
      expand(centre, centre, `Odd centre at index ${centre}`);
      expand(centre, centre + 1, `Even centre between ${centre} and ${centre + 1}`);
    }

    frames.push({
      lo: bestLo,
      hi: bestLo + bestLength - 1,
      best: true,
      note: `Every one of the 2n-1 centres was tried. Longest palindromic substring: "${this.letters.slice(bestLo, bestLo + bestLength).join('')}".`,
    });

    return frames;
  }
}

/* ============================ Pattern matching ============================ */

@Component({
  selector: 'viz-string-match',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="viz">
      <div class="viz-controls">
        @for (option of modes; track option) {
          <button
            type="button"
            class="viz-btn"
            [class.viz-btn--primary]="option === mode"
            (click)="setMode(option)"
          >
            {{ option === 'naive' ? 'Naive scan' : 'KMP' }}
          </button>
        }
      </div>

      <p class="viz-caption-label">text</p>
      <div class="viz-row">
        @for (ch of text; track $index) {
          <span
            class="viz-cell"
            [class.viz-cell--active]="$index === frame().shift + frame().matched"
            [class.viz-cell--found]="frame().hit && $index >= frame().shift && $index < frame().shift + pattern.length"
            [class.viz-cell--marked]="
              !frame().hit && $index >= frame().shift && $index < frame().shift + frame().matched
            "
          >
            {{ ch }}
          </span>
        }
      </div>

      <p class="viz-caption-label">pattern, aligned at index {{ frame().shift }}</p>
      <div class="viz-row">
        @for (ch of text; track $index) {
          <span
            class="viz-cell"
            [class.viz-cell--dropped]="$index < frame().shift || $index >= frame().shift + pattern.length"
          >
            {{
              $index >= frame().shift && $index < frame().shift + pattern.length
                ? pattern[$index - frame().shift]
                : ''
            }}
          </span>
        }
      </div>

      <p class="viz-note">{{ frame().note }}</p>
      ${CONTROLS}
    </figure>
  `,
})
export class VizStringMatch {
  protected readonly text = 'abababcabab'.split('');
  protected readonly pattern = 'ababc'.split('');

  protected readonly modes = ['naive', 'kmp'] as const;
  protected mode: 'naive' | 'kmp' = 'naive';

  protected frames = this.build('naive');
  protected readonly player = createStepPlayer(() => this.frames.length, 750);
  protected readonly frame = computed(() => this.frames[this.player.index()]);

  protected setMode(mode: 'naive' | 'kmp'): void {
    this.mode = mode;
    this.frames = this.build(mode);
    this.player.reset();
  }

  private lps(): number[] {
    const table = new Array<number>(this.pattern.length).fill(0);
    let length = 0;

    for (let i = 1; i < this.pattern.length; ) {
      if (this.pattern[i] === this.pattern[length]) table[i++] = ++length;
      else if (length > 0) length = table[length - 1];
      else table[i++] = 0;
    }

    return table;
  }

  private build(mode: 'naive' | 'kmp'): { shift: number; matched: number; hit: boolean; note: string }[] {
    const frames: { shift: number; matched: number; hit: boolean; note: string }[] = [];
    const n = this.text.length;
    const m = this.pattern.length;
    let comparisons = 0;

    if (mode === 'naive') {
      for (let shift = 0; shift + m <= n; shift++) {
        let matched = 0;
        while (matched < m && this.text[shift + matched] === this.pattern[matched]) {
          matched++;
          comparisons++;
        }

        if (matched === m) {
          frames.push({ shift, matched, hit: true, note: `Full match at index ${shift}, after ${comparisons} comparisons.` });
        } else {
          comparisons++;
          frames.push({
            shift,
            matched,
            hit: false,
            note: `Matched ${matched} character${matched === 1 ? '' : 's'}, then a mismatch. The naive scan throws that away and restarts one place along.`,
          });
        }
      }
      frames.push({ shift: 0, matched: 0, hit: false, note: `Naive total: ${comparisons} comparisons, because every mismatch discards what was already learned.` });
      return frames;
    }

    const table = this.lps();
    let i = 0;
    let j = 0;

    while (i < n) {
      comparisons++;
      if (this.text[i] === this.pattern[j]) {
        i++;
        j++;
        if (j === m) {
          frames.push({ shift: i - m, matched: m, hit: true, note: `Full match at index ${i - m}, after ${comparisons} comparisons.` });
          j = table[j - 1];
        } else {
          frames.push({ shift: i - j, matched: j, hit: false, note: `Matched ${j}, keep going. The text pointer never moves backwards.` });
        }
      } else if (j > 0) {
        const previous = j;
        j = table[j - 1];
        frames.push({ shift: i - j, matched: j, hit: false, note: `Mismatch after ${previous} matched. The prefix table says ${j} of them are still valid, so slide the pattern instead of restarting.` });
      } else {
        i++;
        frames.push({ shift: i, matched: 0, hit: false, note: 'Mismatch on the first character — advance the text by one.' });
      }
    }

    frames.push({ shift: 0, matched: 0, hit: false, note: `KMP total: ${comparisons} comparisons. It never re-reads a character of the text.` });
    return frames;
  }
}

/* ============================ Greedy intervals ============================ */

interface IntervalFrame {
  considering: number;
  taken: number[];
  rejected: number[];
  note: string;
}

@Component({
  selector: 'viz-interval-greedy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="viz">
      <svg viewBox="0 0 320 150" role="img" aria-label="Selecting the most non-overlapping intervals">
        <line x1="10" y1="132" x2="310" y2="132" class="viz-edge" />
        @for (tick of ticks; track tick) {
          <text [attr.x]="10 + tick * 30" y="145" class="viz-caption">{{ tick }}</text>
        }

        @for (interval of intervals; track interval.id) {
          <g>
            <rect
              [attr.x]="10 + interval.start * 30"
              [attr.y]="14 + interval.lane * 22"
              [attr.width]="(interval.end - interval.start) * 30"
              height="16"
              rx="5"
              class="viz-node"
              [class.viz-node--active]="interval.id === frame().considering"
              [class.viz-node--done]="frame().taken.includes(interval.id)"
              [class.viz-node--queued]="frame().rejected.includes(interval.id)"
            />
            <text
              [attr.x]="10 + interval.start * 30 + 6"
              [attr.y]="22 + interval.lane * 22"
              class="viz-label"
              text-anchor="start"
              [class.viz-label--on]="interval.id === frame().considering"
            >
              {{ interval.label }}
            </text>
          </g>
        }
      </svg>

      <p class="viz-note">{{ frame().note }}</p>
      <div class="viz-legend">
        <span><i style="background: var(--accent)"></i> considering</span>
        <span><i style="background: var(--easy-soft); border-color: var(--easy)"></i> taken</span>
        <span><i style="background: var(--medium-soft); border-color: var(--medium)"></i> rejected, it overlaps</span>
      </div>
      ${CONTROLS}
    </figure>
  `,
})
export class VizIntervalGreedy {
  protected readonly ticks = [0, 2, 4, 6, 8, 10];

  /** Already sorted by end time — which is the whole algorithm. */
  protected readonly intervals = [
    { id: 0, label: 'A', start: 0, end: 3, lane: 0 },
    { id: 1, label: 'B', start: 1, end: 4, lane: 1 },
    { id: 2, label: 'C', start: 3, end: 5, lane: 2 },
    { id: 3, label: 'D', start: 4, end: 7, lane: 3 },
    { id: 4, label: 'E', start: 6, end: 9, lane: 4 },
  ];

  protected readonly frames = this.build();
  protected readonly player = createStepPlayer(() => this.frames.length, 1000);
  protected readonly frame = computed(() => this.frames[this.player.index()]);

  private build(): IntervalFrame[] {
    const frames: IntervalFrame[] = [
      {
        considering: -1,
        taken: [],
        rejected: [],
        note: 'Sorted by finish time. Finishing earliest leaves the most room for whatever comes next.',
      },
    ];

    const taken: number[] = [];
    const rejected: number[] = [];
    let lastEnd = Number.NEGATIVE_INFINITY;

    for (const interval of this.intervals) {
      if (interval.start >= lastEnd) {
        taken.push(interval.id);
        lastEnd = interval.end;
        frames.push({
          considering: interval.id,
          taken: [...taken],
          rejected: [...rejected],
          note: `${interval.label} starts at ${interval.start}, at or after the last finish. Take it; the clock moves to ${interval.end}.`,
        });
      } else {
        rejected.push(interval.id);
        frames.push({
          considering: interval.id,
          taken: [...taken],
          rejected: [...rejected],
          note: `${interval.label} starts at ${interval.start}, before the last finish at ${lastEnd}. It overlaps, so skip it.`,
        });
      }
    }

    frames.push({
      considering: -1,
      taken: [...taken],
      rejected: [...rejected],
      note: `${taken.length} intervals kept. No other choice does better — swapping any of them for a later finisher can only reduce the room left.`,
    });

    return frames;
  }
}

/* ============================ Merge intervals ============================= */

@Component({
  selector: 'viz-merge-intervals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="viz">
      <svg viewBox="0 0 320 140" role="img" aria-label="Merging overlapping intervals">
        <text x="10" y="14" class="viz-caption" text-anchor="start">input, sorted by start</text>
        @for (interval of intervals; track interval.id) {
          <g>
            <rect
              [attr.x]="10 + interval.start * 28"
              [attr.y]="22 + interval.lane * 18"
              [attr.width]="(interval.end - interval.start) * 28"
              height="13"
              rx="4"
              class="viz-node"
              [class.viz-node--active]="interval.id === frame().considering"
            />
          </g>
        }

        <text x="10" y="104" class="viz-caption" text-anchor="start">merged so far</text>
        @for (merged of frame().merged; track $index) {
          <rect
            [attr.x]="10 + merged[0] * 28"
            y="112"
            [attr.width]="(merged[1] - merged[0]) * 28"
            height="14"
            rx="4"
            class="viz-node viz-node--done"
          />
        }
      </svg>

      <p class="viz-note">{{ frame().note }}</p>
      ${CONTROLS}
    </figure>
  `,
})
export class VizMergeIntervals {
  protected readonly intervals = [
    { id: 0, start: 1, end: 4, lane: 0 },
    { id: 1, start: 3, end: 6, lane: 1 },
    { id: 2, start: 8, end: 10, lane: 2 },
    { id: 3, start: 9, end: 11, lane: 3 },
  ];

  protected readonly frames = this.build();
  protected readonly player = createStepPlayer(() => this.frames.length, 950);
  protected readonly frame = computed(() => this.frames[this.player.index()]);

  private build(): { considering: number; merged: [number, number][]; note: string }[] {
    const frames: { considering: number; merged: [number, number][]; note: string }[] = [
      { considering: -1, merged: [], note: 'Sort by start. Then any interval that could overlap the current one begins at or after it, so one forward pass is enough.' },
    ];

    const merged: [number, number][] = [];

    for (const interval of this.intervals) {
      const last = merged[merged.length - 1];

      if (last && interval.start <= last[1]) {
        last[1] = Math.max(last[1], interval.end);
        frames.push({
          considering: interval.id,
          merged: merged.map((m) => [...m] as [number, number]),
          note: `[${interval.start}, ${interval.end}] starts before the current block ends — extend it to ${last[1]}.`,
        });
      } else {
        merged.push([interval.start, interval.end]);
        frames.push({
          considering: interval.id,
          merged: merged.map((m) => [...m] as [number, number]),
          note: `[${interval.start}, ${interval.end}] starts after the last block ended — begin a new block.`,
        });
      }
    }

    frames.push({
      considering: -1,
      merged: merged.map((m) => [...m] as [number, number]),
      note: `${merged.length} blocks left. The sort costs O(n log n); the merge itself is a single linear pass.`,
    });

    return frames;
  }
}
