import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { createStepPlayer } from './step-player';

/* ---------------------------------------------------------------------------
   Animated diagrams.

   Each visual builds its frames by actually running the algorithm, so the
   picture cannot drift away from the explanation next to it. Styling lives in
   `styles/_visuals.scss` under `.viz-*`.
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

/* ============================== Growth rates ============================== */

@Component({
  selector: 'viz-big-o',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="viz viz-loop">
      <svg viewBox="0 0 320 150" role="img" aria-label="Growth of common complexity classes">
        <line x1="34" y1="130" x2="310" y2="130" class="viz-edge" />
        <line x1="34" y1="130" x2="34" y2="12" class="viz-edge" />
        <text x="172" y="146" class="viz-caption">input size n</text>
        <text x="10" y="70" class="viz-caption" transform="rotate(-90 10 70)">work</text>

        <path d="M34 130 C 120 128, 200 124, 310 120" class="viz-curve viz-curve--log" />
        <path d="M34 130 L 310 74" class="viz-curve viz-curve--n" />
        <path d="M34 130 C 140 110, 230 74, 310 40" class="viz-curve viz-curve--nlogn" />
        <path d="M34 130 C 180 128, 250 92, 292 12" class="viz-curve viz-curve--n2" />

        <text x="313" y="120" class="viz-caption" text-anchor="start">log n</text>
        <text x="313" y="74" class="viz-caption" text-anchor="start">n</text>
        <text x="313" y="40" class="viz-caption" text-anchor="start">n log n</text>
        <text x="294" y="9" class="viz-caption" text-anchor="middle">n²</text>
      </svg>
      <figcaption class="viz-legend">
        <span><i style="background: var(--easy)"></i> cheap to grow</span>
        <span><i style="background: var(--medium)"></i> acceptable</span>
        <span><i style="background: var(--hard)"></i> collapses on large input</span>
      </figcaption>
    </figure>
  `,
})
export class VizBigO {}

/* ============================== Array memory ============================== */

@Component({
  selector: 'viz-array-memory',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="viz">
      <svg viewBox="0 0 320 108" role="img" aria-label="An array laid out in contiguous memory">
        @for (cell of cells; track cell.index) {
          <g>
            <rect
              [attr.x]="cell.x"
              y="30"
              width="52"
              height="34"
              rx="5"
              class="viz-node"
              [class.viz-node--active]="cell.index === 3"
            />
            <text [attr.x]="cell.x + 26" y="47" class="viz-label" [class.viz-label--on]="cell.index === 3">
              {{ cell.value }}
            </text>
            <text [attr.x]="cell.x + 26" y="22" class="viz-caption">[{{ cell.index }}]</text>
            <text [attr.x]="cell.x + 26" y="78" class="viz-caption">{{ cell.address }}</text>
          </g>
        }
        <text x="160" y="100" class="viz-caption">address of a[i] = base + i × 4 bytes</text>
      </svg>
    </figure>
  `,
})
export class VizArrayMemory {
  protected readonly cells = [17, 4, 23, 8, 15].map((value, index) => ({
    index,
    value,
    x: 8 + index * 62,
    address: 1000 + index * 4,
  }));
}

/* ============================= Binary search ============================== */

interface SearchFrame {
  lo: number;
  hi: number;
  mid: number;
  note: string;
  found: boolean;
}

@Component({
  selector: 'viz-binary-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="viz">
      <div class="viz-row">
        @for (value of values; track $index) {
          <span
            class="viz-cell"
            [class.viz-cell--dropped]="$index < frame().lo || $index > frame().hi"
            [class.viz-cell--active]="$index === frame().mid && !frame().found"
            [class.viz-cell--found]="$index === frame().mid && frame().found"
          >
            {{ value }}
          </span>
        }
      </div>
      <div class="viz-index">
        @for (value of values; track $index) {
          <span>{{ $index }}</span>
        }
      </div>
      <p class="viz-note">{{ frame().note }}</p>
      ${CONTROLS}
    </figure>
  `,
})
export class VizBinarySearch {
  protected readonly values = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
  private readonly target = 23;
  protected readonly frames = this.build();
  protected readonly player = createStepPlayer(() => this.frames.length);
  protected readonly frame = computed(() => this.frames[this.player.index()]);

  private build(): SearchFrame[] {
    const frames: SearchFrame[] = [];
    let lo = 0;
    let hi = this.values.length - 1;

    frames.push({ lo, hi, mid: -1, found: false, note: `Looking for ${this.target}. The whole array is still in play.` });

    while (lo <= hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      const value = this.values[mid];

      if (value === this.target) {
        frames.push({ lo, hi, mid, found: true, note: `a[${mid}] = ${value}. Found it in ${frames.length} comparisons.` });
        break;
      }

      if (value < this.target) {
        frames.push({ lo, hi, mid, found: false, note: `a[${mid}] = ${value}, smaller than ${this.target}. Everything to the left can be discarded.` });
        lo = mid + 1;
      } else {
        frames.push({ lo, hi, mid, found: false, note: `a[${mid}] = ${value}, larger than ${this.target}. Everything to the right can be discarded.` });
        hi = mid - 1;
      }
      frames.push({ lo, hi, mid: -1, found: false, note: `Search space is now indices ${lo} to ${hi} — ${hi - lo + 1} values left.` });
    }

    return frames;
  }
}

/* =============================== Prefix sums ============================== */

@Component({
  selector: 'viz-prefix-sum',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="viz">
      <p class="viz-note">
        Sum of a[{{ range.l }}..{{ range.r }}] = prefix[{{ range.r + 1 }}] − prefix[{{ range.l }}] =
        {{ prefix[range.r + 1] }} − {{ prefix[range.l] }} = {{ prefix[range.r + 1] - prefix[range.l] }}
      </p>

      <p class="viz-caption-label">array</p>
      <div class="viz-row">
        @for (value of values; track $index) {
          <span class="viz-cell" [class.viz-cell--active]="$index >= range.l && $index <= range.r">
            {{ value }}
          </span>
        }
      </div>

      <p class="viz-caption-label">prefix (one longer, starting at 0)</p>
      <div class="viz-row">
        @for (value of prefix; track $index) {
          <span
            class="viz-cell"
            [class.viz-cell--marked]="$index === range.l || $index === range.r + 1"
          >
            {{ value }}
          </span>
        }
      </div>

      <div class="viz-controls">
        @for (option of ranges; track option.label) {
          <button
            type="button"
            class="viz-btn"
            [class.viz-btn--primary]="option.label === active"
            (click)="pick(option)"
          >
            {{ option.label }}
          </button>
        }
      </div>
    </figure>
  `,
})
export class VizPrefixSum {
  protected readonly values = [3, 1, 4, 1, 5, 9];
  protected readonly prefix = this.values.reduce<number[]>(
    (acc, value) => [...acc, acc[acc.length - 1] + value],
    [0],
  );

  protected readonly ranges = [
    { label: 'a[1..4]', l: 1, r: 4 },
    { label: 'a[0..2]', l: 0, r: 2 },
    { label: 'a[3..5]', l: 3, r: 5 },
  ];

  protected range = this.ranges[0];
  protected active = this.ranges[0].label;

  protected pick(option: { label: string; l: number; r: number }): void {
    this.range = option;
    this.active = option.label;
  }
}

/* =============================== Two pointers ============================= */

interface PointerFrame {
  lo: number;
  hi: number;
  note: string;
  done: boolean;
}

@Component({
  selector: 'viz-two-pointers',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="viz">
      <div class="viz-row">
        @for (value of values; track $index) {
          <span
            class="viz-cell"
            [class.viz-cell--dropped]="$index < frame().lo || $index > frame().hi"
            [class.viz-cell--active]="$index === frame().lo || $index === frame().hi"
            [class.viz-cell--found]="frame().done && ($index === frame().lo || $index === frame().hi)"
          >
            {{ value }}
          </span>
        }
      </div>
      <div class="viz-index">
        @for (value of values; track $index) {
          <span>{{ $index === frame().lo ? 'lo' : $index === frame().hi ? 'hi' : '·' }}</span>
        }
      </div>
      <p class="viz-note">{{ frame().note }}</p>
      ${CONTROLS}
    </figure>
  `,
})
export class VizTwoPointers {
  protected readonly values = [1, 3, 4, 6, 8, 9, 14];
  private readonly target = 13;
  protected readonly frames = this.build();
  protected readonly player = createStepPlayer(() => this.frames.length);
  protected readonly frame = computed(() => this.frames[this.player.index()]);

  private build(): PointerFrame[] {
    const frames: PointerFrame[] = [];
    let lo = 0;
    let hi = this.values.length - 1;

    while (lo < hi) {
      const sum = this.values[lo] + this.values[hi];

      if (sum === this.target) {
        frames.push({ lo, hi, done: true, note: `${this.values[lo]} + ${this.values[hi]} = ${this.target}. Found a pair.` });
        break;
      }

      if (sum < this.target) {
        frames.push({ lo, hi, done: false, note: `${this.values[lo]} + ${this.values[hi]} = ${sum}, too small. ${this.values[lo]} cannot pair with anything smaller than ${this.values[hi]}, so move lo right.` });
        lo++;
      } else {
        frames.push({ lo, hi, done: false, note: `${this.values[lo]} + ${this.values[hi]} = ${sum}, too big. Move hi left.` });
        hi--;
      }
    }

    return frames;
  }
}

/* =============================== Stack vs queue =========================== */

@Component({
  selector: 'viz-stack-queue',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="viz">
      <svg viewBox="0 0 320 150" role="img" aria-label="A stack returns the newest item, a queue the oldest">
        <text x="80" y="14" class="viz-caption">STACK — last in, first out</text>
        <text x="240" y="14" class="viz-caption">QUEUE — first in, first out</text>

        @for (item of stack(); track item.id) {
          <g>
            <rect [attr.x]="52" [attr.y]="item.y" width="56" height="24" rx="4"
              class="viz-node" [class.viz-node--active]="item.leaving" />
            <text [attr.x]="80" [attr.y]="item.y + 12" class="viz-label"
              [class.viz-label--on]="item.leaving">{{ item.value }}</text>
          </g>
        }
        <path d="M118 34 l14 0 m-14 0 l6 -5 m-6 5 l6 5" class="viz-edge" />
        <text x="150" y="34" class="viz-caption">out</text>

        @for (item of queue(); track item.id) {
          <g>
            <rect [attr.x]="item.x" y="48" width="42" height="26" rx="4"
              class="viz-node" [class.viz-node--active]="item.leaving" />
            <text [attr.x]="item.x + 21" y="61" class="viz-label"
              [class.viz-label--on]="item.leaving">{{ item.value }}</text>
          </g>
        }
        <path d="M182 61 l-12 0 m12 0 l-6 -5 m6 5 l-6 5" class="viz-edge" />
        <text x="196" y="88" class="viz-caption">out ←</text>
        <text x="300" y="88" class="viz-caption">← in</text>

        <text x="160" y="128" class="viz-caption">{{ note() }}</text>
      </svg>
      ${CONTROLS}
    </figure>
  `,
})
export class VizStackQueue {
  private readonly values = ['A', 'B', 'C', 'D'];

  protected readonly frames = [
    { pushed: 1, popped: 0, note: 'Push A.' },
    { pushed: 2, popped: 0, note: 'Push B.' },
    { pushed: 3, popped: 0, note: 'Push C.' },
    { pushed: 4, popped: 0, note: 'Push D. Both hold A B C D.' },
    { pushed: 4, popped: 1, note: 'Remove one: the stack gives back D, the queue gives back A.' },
    { pushed: 4, popped: 2, note: 'Remove again: stack gives C, queue gives B.' },
  ];

  protected readonly player = createStepPlayer(() => this.frames.length);
  protected readonly note = computed(() => this.frames[this.player.index()].note);

  protected readonly stack = computed(() => {
    const { pushed, popped } = this.frames[this.player.index()];
    const items = this.values.slice(0, pushed - popped);
    return items.map((value, i) => ({
      id: value,
      value,
      y: 96 - i * 26,
      leaving: i === items.length - 1,
    }));
  });

  protected readonly queue = computed(() => {
    const { pushed, popped } = this.frames[this.player.index()];
    const items = this.values.slice(popped, pushed);
    return items.map((value, i) => ({
      id: value,
      value,
      x: 190 + i * 46,
      leaving: i === 0,
    }));
  });
}

/* ============================ Linked list reversal ======================== */

@Component({
  selector: 'viz-linked-reverse',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="viz">
      <svg viewBox="0 0 320 118" role="img" aria-label="Reversing a linked list one link at a time">
        @for (node of nodes; track node.value) {
          <g>
            <rect
              [attr.x]="node.x"
              y="42"
              width="46"
              height="30"
              rx="6"
              class="viz-node"
              [class.viz-node--active]="node.index === frame().current"
              [class.viz-node--done]="node.index < frame().current"
            />
            <text [attr.x]="node.x + 23" y="57" class="viz-label"
              [class.viz-label--on]="node.index === frame().current">{{ node.value }}</text>
          </g>
        }

        @for (link of links; track link.from) {
          <path
            [attr.d]="flipped(link.from) ? link.back : link.forward"
            class="viz-edge"
            [class.viz-edge--on]="flipped(link.from)"
            marker-end="url(#viz-arrow)"
          />
        }

        <defs>
          <marker id="viz-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill="currentColor" class="viz-arrowhead" />
          </marker>
        </defs>

        <text x="160" y="104" class="viz-caption">{{ frame().note }}</text>
      </svg>
      ${CONTROLS}
    </figure>
  `,
})
export class VizLinkedReverse {
  protected readonly nodes = [1, 2, 3, 4].map((value, index) => ({
    value,
    index,
    x: 20 + index * 72,
  }));

  protected readonly links = this.nodes.slice(0, -1).map((node, index) => ({
    from: index,
    forward: `M${node.x + 46} 57 L${node.x + 68} 57`,
    back: `M${node.x + 68} 57 L${node.x + 46} 57`,
  }));

  protected readonly frames = [
    { current: 0, flippedUpTo: -1, note: 'previous = null, current = node 1.' },
    { current: 1, flippedUpTo: 0, note: 'Save the next node, point 1 backwards at null, advance.' },
    { current: 2, flippedUpTo: 1, note: 'Point 2 back at 1.' },
    { current: 3, flippedUpTo: 2, note: 'Point 3 back at 2.' },
    { current: 4, flippedUpTo: 3, note: 'Point 4 back at 3. current is null, so previous — node 4 — is the new head.' },
  ];

  protected readonly player = createStepPlayer(() => this.frames.length);
  protected readonly frame = computed(() => this.frames[this.player.index()]);

  protected flipped(index: number): boolean {
    return index <= this.frame().flippedUpTo;
  }
}

/* ============================== Tree traversal ============================ */

type TraversalOrder = 'preorder' | 'inorder' | 'postorder';

interface TreeNodeView {
  id: number;
  label: string;
  x: number;
  y: number;
  left?: number;
  right?: number;
}

@Component({
  selector: 'viz-tree-traversal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="viz">
      <div class="viz-controls">
        @for (option of orders; track option) {
          <button
            type="button"
            class="viz-btn"
            [class.viz-btn--primary]="option === order"
            (click)="setOrder(option)"
          >
            {{ option }}
          </button>
        }
      </div>

      <svg viewBox="0 0 320 150" role="img" aria-label="Binary tree traversal order">
        @for (edge of edges; track edge.d) {
          <path [attr.d]="edge.d" class="viz-edge" />
        }
        @for (node of nodes; track node.id) {
          <g>
            <circle
              [attr.cx]="node.x"
              [attr.cy]="node.y"
              r="15"
              class="viz-node"
              [class.viz-node--active]="visitedIndex(node.id) === step()"
              [class.viz-node--done]="visitedIndex(node.id) !== -1 && visitedIndex(node.id) < step()"
            />
            <text [attr.x]="node.x" [attr.y]="node.y" class="viz-label"
              [class.viz-label--on]="visitedIndex(node.id) === step()">{{ node.label }}</text>
          </g>
        }
        <text x="160" y="140" class="viz-caption">{{ sequence() }}</text>
      </svg>
      ${CONTROLS}
    </figure>
  `,
})
export class VizTreeTraversal {
  protected readonly nodes: TreeNodeView[] = [
    { id: 0, label: 'F', x: 160, y: 24, left: 1, right: 2 },
    { id: 1, label: 'B', x: 96, y: 66, left: 3, right: 4 },
    { id: 2, label: 'G', x: 224, y: 66, right: 5 },
    { id: 3, label: 'A', x: 62, y: 108 },
    { id: 4, label: 'D', x: 130, y: 108 },
    { id: 5, label: 'I', x: 258, y: 108 },
  ];

  protected readonly edges = [
    { d: 'M160 24 L96 66' },
    { d: 'M160 24 L224 66' },
    { d: 'M96 66 L62 108' },
    { d: 'M96 66 L130 108' },
    { d: 'M224 66 L258 108' },
  ];

  protected readonly orders: TraversalOrder[] = ['preorder', 'inorder', 'postorder'];
  protected order: TraversalOrder = 'preorder';

  protected frames = this.walk('preorder');
  protected readonly player = createStepPlayer(() => this.frames.length);
  protected readonly step = computed(() => this.player.index());

  protected readonly sequence = computed(() =>
    this.frames
      .slice(0, this.step() + 1)
      .map((id) => this.nodes[id].label)
      .join(' → '),
  );

  protected setOrder(order: TraversalOrder): void {
    this.order = order;
    this.frames = this.walk(order);
    this.player.reset();
  }

  protected visitedIndex(id: number): number {
    return this.frames.indexOf(id);
  }

  private walk(order: TraversalOrder): number[] {
    const out: number[] = [];

    const visit = (id: number | undefined): void => {
      if (id === undefined) return;
      const node = this.nodes[id];
      if (order === 'preorder') out.push(id);
      visit(node.left);
      if (order === 'inorder') out.push(id);
      visit(node.right);
      if (order === 'postorder') out.push(id);
    };

    visit(0);
    return out;
  }
}

/* ============================= Graph traversal ============================ */

type TraversalMode = 'bfs' | 'dfs';

interface GraphFrame {
  current: number;
  visited: number[];
  frontier: number[];
  edge: string | null;
  note: string;
}

@Component({
  selector: 'viz-graph-traversal',
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
            {{ option === 'bfs' ? 'Breadth-first' : 'Depth-first' }}
          </button>
        }
      </div>

      <svg viewBox="0 0 320 150" role="img" aria-label="Graph traversal animation">
        @for (edge of edges; track edge.key) {
          <line
            [attr.x1]="nodes[edge.a].x" [attr.y1]="nodes[edge.a].y"
            [attr.x2]="nodes[edge.b].x" [attr.y2]="nodes[edge.b].y"
            class="viz-edge"
            [class.viz-edge--on]="frame().edge === edge.key"
          />
        }

        @for (node of nodes; track node.id) {
          <g>
            <circle
              [attr.cx]="node.x" [attr.cy]="node.y" r="16"
              class="viz-node"
              [class.viz-node--active]="frame().current === node.id"
              [class.viz-node--queued]="frame().frontier.includes(node.id)"
              [class.viz-node--done]="frame().visited.includes(node.id) && frame().current !== node.id"
            />
            <text [attr.x]="node.x" [attr.y]="node.y" class="viz-label"
              [class.viz-label--on]="frame().current === node.id">{{ node.label }}</text>
          </g>
        }
      </svg>

      <p class="viz-note">{{ frame().note }}</p>
      <div class="viz-legend">
        <span><i style="background: var(--medium-soft); border-color: var(--medium)"></i> in the queue or stack</span>
        <span><i style="background: var(--accent)"></i> being processed</span>
        <span><i style="background: var(--easy-soft); border-color: var(--easy)"></i> finished</span>
      </div>
      ${CONTROLS}
    </figure>
  `,
})
export class VizGraphTraversal {
  protected readonly nodes = [
    { id: 0, label: 'A', x: 40, y: 74 },
    { id: 1, label: 'B', x: 112, y: 30 },
    { id: 2, label: 'C', x: 112, y: 118 },
    { id: 3, label: 'D', x: 190, y: 30 },
    { id: 4, label: 'E', x: 190, y: 118 },
    { id: 5, label: 'F', x: 268, y: 74 },
  ];

  private readonly adjacency: number[][] = [[1, 2], [0, 3], [0, 3, 4], [1, 2, 5], [2, 5], [3, 4]];

  protected readonly edges = this.buildEdges();
  protected readonly modes: TraversalMode[] = ['bfs', 'dfs'];
  protected mode: TraversalMode = 'bfs';

  protected frames: GraphFrame[] = this.build('bfs');

  protected readonly player = createStepPlayer(() => this.frames.length, 1300);
  protected readonly frame = computed(() => this.frames[this.player.index()]);

  protected setMode(mode: TraversalMode): void {
    this.mode = mode;
    this.frames = this.build(mode);
    this.player.reset();
  }

  private buildEdges(): { key: string; a: number; b: number }[] {
    const seen = new Set<string>();
    const edges: { key: string; a: number; b: number }[] = [];

    this.adjacency.forEach((neighbours, a) => {
      for (const b of neighbours) {
        const key = [Math.min(a, b), Math.max(a, b)].join('-');
        if (seen.has(key)) continue;
        seen.add(key);
        edges.push({ key, a: Math.min(a, b), b: Math.max(a, b) });
      }
    });

    return edges;
  }

  private edgeKey(a: number, b: number): string {
    return [Math.min(a, b), Math.max(a, b)].join('-');
  }

  private build(mode: TraversalMode): GraphFrame[] {
    const label = (id: number): string => this.nodes[id].label;
    const frames: GraphFrame[] = [];
    const visited: number[] = [];
    const container: number[] = [0];
    const seen = new Set<number>([0]);

    frames.push({
      current: -1,
      visited: [],
      frontier: [0],
      edge: null,
      note:
        mode === 'bfs'
          ? 'Start at A. The queue holds the vertices waiting to be explored.'
          : 'Start at A. The stack holds the vertices waiting to be explored.',
    });

    while (container.length) {
      const node = mode === 'bfs' ? container.shift()! : container.pop()!;
      visited.push(node);

      frames.push({
        current: node,
        visited: [...visited],
        frontier: [...container],
        edge: null,
        note:
          mode === 'bfs'
            ? `Take ${label(node)} from the front of the queue. Everything reached so far used the fewest possible edges.`
            : `Take ${label(node)} from the top of the stack and follow it as deep as it goes.`,
      });

      for (const next of this.adjacency[node]) {
        if (seen.has(next)) continue;
        seen.add(next);
        container.push(next);

        frames.push({
          current: node,
          visited: [...visited],
          frontier: [...container],
          edge: this.edgeKey(node, next),
          note:
            mode === 'bfs'
              ? `${label(next)} has not been reached yet — add it to the back of the queue.`
              : `${label(next)} has not been reached yet — push it onto the stack.`,
        });
      }
    }

    frames.push({
      current: -1,
      visited: [...visited],
      frontier: [],
      edge: null,
      note: `${mode === 'bfs' ? 'Breadth-first' : 'Depth-first'} order: ${visited.map(label).join(' → ')}.`,
    });

    return frames;
  }
}

/* ================================== Heap ================================== */

@Component({
  selector: 'viz-heap',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="viz">
      <svg viewBox="0 0 320 175" role="img" aria-label="A heap is a complete tree stored in a flat array">
        @for (edge of edges(); track edge.key) {
          <line [attr.x1]="edge.x1" [attr.y1]="edge.y1" [attr.x2]="edge.x2" [attr.y2]="edge.y2" class="viz-edge" />
        }
        @for (node of tree(); track node.index) {
          <g>
            <circle [attr.cx]="node.x" [attr.cy]="node.y" r="15" class="viz-node"
              [class.viz-node--active]="node.index === frame().moving"
              [class.viz-node--queued]="node.index === frame().compare" />
            <text [attr.x]="node.x" [attr.y]="node.y" class="viz-label"
              [class.viz-label--on]="node.index === frame().moving">{{ node.value }}</text>
          </g>
        }

        <text x="160" y="132" class="viz-caption">stored as one array</text>
        @for (node of tree(); track node.index) {
          <g>
            <rect [attr.x]="12 + node.index * 44" y="140" width="40" height="24" rx="4" class="viz-node"
              [class.viz-node--active]="node.index === frame().moving" />
            <text [attr.x]="32 + node.index * 44" y="152" class="viz-label"
              [class.viz-label--on]="node.index === frame().moving">{{ node.value }}</text>
          </g>
        }
      </svg>
      <p class="viz-note">{{ frame().note }}</p>
      ${CONTROLS}
    </figure>
  `,
})
export class VizHeap {
  private readonly positions = [
    { x: 160, y: 22 },
    { x: 92, y: 62 },
    { x: 228, y: 62 },
    { x: 58, y: 102 },
    { x: 126, y: 102 },
    { x: 194, y: 102 },
    { x: 262, y: 102 },
  ];

  protected readonly frames = this.build();
  protected readonly player = createStepPlayer(() => this.frames.length);
  protected readonly frame = computed(() => this.frames[this.player.index()]);

  protected readonly tree = computed(() =>
    this.frame().values.map((value, index) => ({
      index,
      value,
      x: this.positions[index].x,
      y: this.positions[index].y,
    })),
  );

  protected readonly edges = computed(() =>
    this.frame().values.flatMap((_, index) => {
      const parent = Math.floor((index - 1) / 2);
      if (index === 0) return [];
      return [
        {
          key: `${parent}-${index}`,
          x1: this.positions[parent].x,
          y1: this.positions[parent].y,
          x2: this.positions[index].x,
          y2: this.positions[index].y,
        },
      ];
    }),
  );

  private build(): { values: number[]; moving: number; compare: number; note: string }[] {
    const values = [4, 9, 7, 15, 12, 11, 2];
    const frames = [
      { values: [...values], moving: 6, compare: -1, note: 'Insert 2 at the end — the only place that keeps the tree complete.' },
    ];

    let i = values.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (values[parent] <= values[i]) break;

      frames.push({
        values: [...values],
        moving: i,
        compare: parent,
        note: `${values[i]} is smaller than its parent ${values[parent]} — swap them.`,
      });

      [values[parent], values[i]] = [values[i], values[parent]];
      i = parent;

      frames.push({ values: [...values], moving: i, compare: -1, note: `2 moves up one level. Only this path changed — everything else is untouched.` });
    }

    frames.push({ values: [...values], moving: 0, compare: -1, note: 'Heap property restored in three swaps: at most the height of the tree.' });
    return frames;
  }
}

/* ============================== Hash buckets ============================== */

@Component({
  selector: 'viz-hash-buckets',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="viz">
      <svg viewBox="0 0 320 160" role="img" aria-label="A hash function maps keys to buckets">
        <rect x="8" y="14" width="86" height="26" rx="6" class="viz-node viz-node--active" />
        <text x="51" y="27" class="viz-label viz-label--on">{{ frame().key }}</text>
        <text x="51" y="52" class="viz-caption">key</text>

        <path d="M98 27 L138 27" class="viz-edge viz-edge--on" />
        <text x="118" y="18" class="viz-caption">hash</text>

        <rect x="142" y="14" width="70" height="26" rx="6" class="viz-node" />
        <text x="177" y="27" class="viz-label">% 5</text>

        @for (bucket of buckets(); track bucket.index) {
          <g>
            <rect x="150" [attr.y]="bucket.y" width="40" height="20" rx="4" class="viz-node"
              [class.viz-node--active]="bucket.index === frame().bucket" />
            <text x="170" [attr.y]="bucket.y + 10" class="viz-label"
              [class.viz-label--on]="bucket.index === frame().bucket">{{ bucket.index }}</text>

            @for (entry of bucket.entries; track entry.id) {
              <g>
                <rect [attr.x]="200 + entry.slot * 54" [attr.y]="bucket.y" width="48" height="20" rx="4"
                  class="viz-node viz-node--done" />
                <text [attr.x]="224 + entry.slot * 54" [attr.y]="bucket.y + 10" class="viz-label">{{ entry.key }}</text>
                <path [attr.d]="'M190 ' + (bucket.y + 10) + ' L' + (200 + entry.slot * 54) + ' ' + (bucket.y + 10)"
                  class="viz-edge" />
              </g>
            }
          </g>
        }
      </svg>
      <p class="viz-note">{{ frame().note }}</p>
      ${CONTROLS}
    </figure>
  `,
})
export class VizHashBuckets {
  private readonly inserts = [
    { key: 'cat', bucket: 2 },
    { key: 'dog', bucket: 4 },
    { key: 'owl', bucket: 2 },
    { key: 'fox', bucket: 0 },
  ];

  protected readonly frames = this.inserts.map((insert, index) => ({
    key: insert.key,
    bucket: insert.bucket,
    upTo: index,
    note:
      index === 2
        ? `"owl" hashes to bucket 2, which already holds "cat". That is a collision — the bucket keeps a short chain.`
        : `"${insert.key}" hashes to bucket ${insert.bucket}. Finding it later takes one step, not a scan.`,
  }));

  protected readonly player = createStepPlayer(() => this.frames.length);
  protected readonly frame = computed(() => this.frames[this.player.index()]);

  protected readonly buckets = computed(() => {
    const upTo = this.frame().upTo;

    return [0, 1, 2, 3, 4].map((index) => {
      const entries = this.inserts
        .slice(0, upTo + 1)
        .filter((insert) => insert.bucket === index)
        .map((insert, slot) => ({ id: insert.key, key: insert.key, slot }));

      return { index, y: 62 + index * 20, entries };
    });
  });
}

/* =============================== Sorting bars ============================= */

@Component({
  selector: 'viz-sorting-bars',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="viz">
      <svg viewBox="0 0 320 130" role="img" aria-label="Insertion sort moving one element into place">
        @for (bar of bars(); track bar.id) {
          <g>
            <rect
              [attr.x]="bar.x"
              [attr.y]="110 - bar.height"
              [attr.width]="30"
              [attr.height]="bar.height"
              rx="3"
              class="viz-bar"
              [class.viz-bar--compare]="bar.state === 'compare'"
              [class.viz-bar--swap]="bar.state === 'moving'"
              [class.viz-bar--sorted]="bar.state === 'sorted'"
            />
            <text [attr.x]="bar.x + 15" y="124" class="viz-caption">{{ bar.value }}</text>
          </g>
        }
      </svg>
      <p class="viz-note">{{ frame().note }}</p>
      ${CONTROLS}
    </figure>
  `,
})
export class VizSortingBars {
  protected readonly frames = this.build();
  protected readonly player = createStepPlayer(() => this.frames.length, 900);
  protected readonly frame = computed(() => this.frames[this.player.index()]);

  protected readonly bars = computed(() =>
    this.frame().values.map((value, index) => ({
      id: `${value}`,
      value,
      x: 12 + index * 39,
      height: value * 9,
      state: this.stateFor(index),
    })),
  );

  private stateFor(index: number): string {
    const frame = this.frame();
    if (index === frame.moving) return 'moving';
    if (index === frame.compare) return 'compare';
    if (index < frame.sortedUpTo) return 'sorted';
    return 'idle';
  }

  private build(): { values: number[]; moving: number; compare: number; sortedUpTo: number; note: string }[] {
    const values = [7, 3, 9, 2, 8, 5, 11, 4];
    const frames = [
      { values: [...values], moving: -1, compare: -1, sortedUpTo: 1, note: 'A single element is already sorted, so start at index 1.' },
    ];

    for (let i = 1; i < values.length; i++) {
      const key = values[i];
      let j = i - 1;

      frames.push({ values: [...values], moving: i, compare: -1, sortedUpTo: i, note: `Take ${key} and find where it belongs in the sorted part on the left.` });

      while (j >= 0 && values[j] > key) {
        frames.push({ values: [...values], moving: j + 1, compare: j, sortedUpTo: i, note: `${values[j]} is bigger than ${key}, so shift it one place right.` });
        values[j + 1] = values[j];
        j--;
      }

      values[j + 1] = key;
      frames.push({ values: [...values], moving: j + 1, compare: -1, sortedUpTo: i + 1, note: `${key} drops into place. The first ${i + 1} values are sorted.` });
    }

    frames.push({ values: [...values], moving: -1, compare: -1, sortedUpTo: values.length, note: 'Sorted. Nearly ordered input makes the inner loop almost never run, which is why this is fast on small or nearly sorted arrays.' });
    return frames;
  }
}

/* ============================== Recursion tree ============================ */

@Component({
  selector: 'viz-recursion-tree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="viz viz-loop">
      <svg viewBox="0 0 320 160" role="img" aria-label="Repeated subproblems in naive Fibonacci">
        @for (edge of edges; track edge.d) {
          <path [attr.d]="edge.d" class="viz-edge" />
        }
        @for (node of nodes; track node.id) {
          <g>
            <circle [attr.cx]="node.x" [attr.cy]="node.y" r="15" class="viz-node"
              [class.viz-node--queued]="node.repeat" />
            <text [attr.x]="node.x" [attr.y]="node.y" class="viz-label">{{ node.label }}</text>
          </g>
        }
        <text x="160" y="152" class="viz-caption">
          highlighted calls are recomputed — caching them collapses the tree to a line
        </text>
      </svg>
    </figure>
  `,
})
export class VizRecursionTree {
  protected readonly nodes = [
    { id: 0, label: '5', x: 160, y: 20, repeat: false },
    { id: 1, label: '4', x: 96, y: 58, repeat: false },
    { id: 2, label: '3', x: 232, y: 58, repeat: true },
    { id: 3, label: '3', x: 56, y: 98, repeat: true },
    { id: 4, label: '2', x: 132, y: 98, repeat: true },
    { id: 5, label: '2', x: 200, y: 98, repeat: true },
    { id: 6, label: '1', x: 268, y: 98, repeat: false },
    { id: 7, label: '2', x: 30, y: 134, repeat: true },
    { id: 8, label: '1', x: 84, y: 134, repeat: false },
  ];

  protected readonly edges = [
    { d: 'M160 20 L96 58' },
    { d: 'M160 20 L232 58' },
    { d: 'M96 58 L56 98' },
    { d: 'M96 58 L132 98' },
    { d: 'M232 58 L200 98' },
    { d: 'M232 58 L268 98' },
    { d: 'M56 98 L30 134' },
    { d: 'M56 98 L84 134' },
  ];
}

/* ============================== Sliding window ============================ */

@Component({
  selector: 'viz-sliding-window',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="viz">
      <div class="viz-row">
        @for (value of values; track $index) {
          <span
            class="viz-cell"
            [class.viz-cell--active]="$index >= frame().left && $index <= frame().right"
            [class.viz-cell--marked]="$index === frame().right"
          >
            {{ value }}
          </span>
        }
      </div>
      <div class="viz-index">
        @for (value of values; track $index) {
          <span>{{ $index === frame().left ? 'L' : $index === frame().right ? 'R' : '·' }}</span>
        }
      </div>
      <p class="viz-note">{{ frame().note }}</p>
      ${CONTROLS}
    </figure>
  `,
})
export class VizSlidingWindow {
  protected readonly values = ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'];
  protected readonly frames = this.build();
  protected readonly player = createStepPlayer(() => this.frames.length, 950);
  protected readonly frame = computed(() => this.frames[this.player.index()]);

  private build(): { left: number; right: number; note: string }[] {
    const frames: { left: number; right: number; note: string }[] = [];
    const count = new Map<string, number>();
    let left = 0;
    let best = 0;

    for (let right = 0; right < this.values.length; right++) {
      const entering = this.values[right];
      count.set(entering, (count.get(entering) ?? 0) + 1);

      frames.push({
        left,
        right,
        note: `Extend the window to include "${entering}".`,
      });

      while ((count.get(entering) ?? 0) > 1) {
        const leaving = this.values[left];
        count.set(leaving, (count.get(leaving) ?? 0) - 1);
        left++;
        frames.push({
          left,
          right,
          note: `"${entering}" now appears twice, so drop "${leaving}" from the left until it does not.`,
        });
      }

      const length = right - left + 1;
      if (length > best) {
        best = length;
        frames.push({ left, right, note: `Window is valid again and ${length} long — a new best.` });
      }
    }

    frames.push({ left, right: this.values.length - 1, note: `Longest window with no repeat: ${best}. Each element entered and left at most once, so the whole scan is linear.` });
    return frames;
  }
}

/* ================================ Registry ================================ */

export const VISUALS = {
  'big-o': VizBigO,
  'array-memory': VizArrayMemory,
  'binary-search': VizBinarySearch,
  'prefix-sum': VizPrefixSum,
  'two-pointers': VizTwoPointers,
  'sliding-window': VizSlidingWindow,
  'stack-queue': VizStackQueue,
  'linked-reverse': VizLinkedReverse,
  'tree-traversal': VizTreeTraversal,
  'graph-traversal': VizGraphTraversal,
  heap: VizHeap,
  'hash-buckets': VizHashBuckets,
  sorting: VizSortingBars,
  'recursion-tree': VizRecursionTree,
} as const;

export type VisualName = keyof typeof VISUALS;
