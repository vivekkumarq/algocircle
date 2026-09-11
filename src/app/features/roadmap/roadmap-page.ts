import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TOPICS } from '../../data/topics.data';
import { GRAPH_LAYOUT, TOPIC_POSITIONS } from '../../data/topic-graph.data';
import { PROBLEMS } from '../../data/problems';
import { SeoService } from '../../core/services/seo.service';
import { Icon } from '../../shared/components/icon/icon';

interface Node {
  slug: string;
  label: string;
  order: number;
  level: string;
  summary: string;
  minutes: number;
  sections: number;
  problems: number;
  x: number;
  y: number;
  cx: number;
}

/**
 * The full-screen roadmap: a pannable, zoomable map of the curriculum where
 * every node is a link. Drag to pan, scroll or pinch to zoom, and the controls
 * in the corner reset or fit the whole map.
 */
@Component({
  selector: 'app-roadmap-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './roadmap-page.html',
  styleUrl: './roadmap-page.scss',
})
export class RoadmapPage {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly surface = viewChild<ElementRef<HTMLElement>>('surface');

  protected readonly layout = GRAPH_LAYOUT;
  protected readonly width = GRAPH_LAYOUT.columns * GRAPH_LAYOUT.colPitch + GRAPH_LAYOUT.padding * 2;
  protected readonly height = GRAPH_LAYOUT.rows * GRAPH_LAYOUT.rowPitch + GRAPH_LAYOUT.padding * 2;

  protected readonly nodes: Node[] = TOPICS.map((topic) => {
    const position = TOPIC_POSITIONS[topic.slug] ?? { col: 0, row: 0 };
    const x =
      GRAPH_LAYOUT.padding +
      position.col * GRAPH_LAYOUT.colPitch +
      (GRAPH_LAYOUT.colPitch - GRAPH_LAYOUT.nodeWidth) / 2;

    return {
      slug: topic.slug,
      label: topic.label,
      order: topic.order,
      level: topic.level,
      summary: topic.summary,
      minutes: topic.minutes,
      sections: topic.sections,
      problems: PROBLEMS.filter((problem) => problem.topic === topic.slug).length,
      x,
      y: GRAPH_LAYOUT.padding + position.row * GRAPH_LAYOUT.rowPitch,
      cx: x + GRAPH_LAYOUT.nodeWidth / 2,
    };
  });

  private readonly bySlug = new Map(this.nodes.map((node) => [node.slug, node]));

  protected readonly edges = TOPICS.flatMap((topic) =>
    topic.prerequisites.flatMap((from) => {
      const a = this.bySlug.get(from);
      const b = this.bySlug.get(topic.slug);
      if (!a || !b) return [];

      const startY = a.y + GRAPH_LAYOUT.nodeHeight;
      const endY = b.y;
      const midY = (startY + endY) / 2;

      return [
        {
          id: `${from}->${topic.slug}`,
          from,
          to: topic.slug,
          d: `M${a.cx} ${startY} C ${a.cx} ${midY}, ${b.cx} ${midY}, ${b.cx} ${endY}`,
        },
      ];
    }),
  );

  private readonly prerequisitesOf = new Map(
    TOPICS.map((topic) => [topic.slug, topic.prerequisites]),
  );

  // ---- view transform ----------------------------------------------------
  protected readonly zoom = signal(1);
  protected readonly panX = signal(0);
  protected readonly panY = signal(0);
  protected readonly dragging = signal(false);

  protected readonly transform = computed(
    () => `translate(${this.panX()}px, ${this.panY()}px) scale(${this.zoom()})`,
  );

  private pointerStart: { x: number; y: number; panX: number; panY: number } | null = null;
  private moved = false;
  /** Set once the reader takes control, so auto-fitting stops interfering. */
  private touched = false;

  // ---- hover -------------------------------------------------------------
  protected readonly active = signal<string | null>(null);

  protected readonly related = computed(() => {
    const slug = this.active();
    if (!slug) return null;

    const ancestors = new Set<string>();
    const walkUp = (current: string): void => {
      for (const parent of this.prerequisitesOf.get(current) ?? []) {
        if (ancestors.has(parent)) continue;
        ancestors.add(parent);
        walkUp(parent);
      }
    };
    walkUp(slug);

    const descendants = new Set<string>();
    const walkDown = (current: string): void => {
      for (const topic of TOPICS) {
        if (!topic.prerequisites.includes(current) || descendants.has(topic.slug)) continue;
        descendants.add(topic.slug);
        walkDown(topic.slug);
      }
    };
    walkDown(slug);

    return { slug, ancestors, descendants };
  });

  protected readonly hovered = computed(() => {
    const slug = this.active();
    return slug ? (this.bySlug.get(slug) ?? null) : null;
  });

  constructor() {
    // Open showing the whole map rather than the middle of it, and keep it
    // fitted while the window resizes — until the reader pans or zooms, after
    // which the view is theirs.
    afterNextRender(() => {
      const element = this.surface()?.nativeElement;
      if (!element) return;

      const observer = new ResizeObserver(() => {
        if (this.touched) observer.disconnect();
        else this.fit();
      });

      observer.observe(element);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });

    inject(SeoService).update(
      'DSA Roadmap',
      'The whole curriculum as a map you can pan and zoom. Every topic links to its lesson, and hovering one traces what it needs and what it unlocks.',
      '/roadmap',
    );
  }

  protected state(slug: string): string {
    const related = this.related();
    if (!related) return 'idle';
    if (related.slug === slug) return 'current';
    if (related.ancestors.has(slug)) return 'needs';
    if (related.descendants.has(slug)) return 'unlocks';
    return 'dim';
  }

  protected edgeState(edge: { from: string; to: string }): string {
    const related = this.related();
    if (!related) return 'idle';

    const up =
      (related.ancestors.has(edge.from) || edge.from === related.slug) &&
      (related.ancestors.has(edge.to) || edge.to === related.slug);
    const down =
      (related.descendants.has(edge.from) || edge.from === related.slug) &&
      (related.descendants.has(edge.to) || edge.to === related.slug);

    return up || down ? 'on' : 'dim';
  }

  // ---- interaction -------------------------------------------------------

  protected onPointerDown(event: PointerEvent): void {
    if (event.button !== 0) return;
    this.touched = true;
    this.pointerStart = { x: event.clientX, y: event.clientY, panX: this.panX(), panY: this.panY() };
    this.moved = false;
    this.dragging.set(true);
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.pointerStart) return;

    const dx = event.clientX - this.pointerStart.x;
    const dy = event.clientY - this.pointerStart.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) this.moved = true;

    this.panX.set(this.pointerStart.panX + dx);
    this.panY.set(this.pointerStart.panY + dy);
  }

  protected onPointerUp(event: PointerEvent): void {
    this.pointerStart = null;
    this.dragging.set(false);
    (event.currentTarget as HTMLElement).releasePointerCapture?.(event.pointerId);
  }

  protected onWheel(event: WheelEvent): void {
    event.preventDefault();
    this.touched = true;
    this.scale(event.deltaY < 0 ? 1.12 : 1 / 1.12);
  }

  /** A drag that ended on a node should not also navigate. */
  protected openTopic(event: Event, slug: string): void {
    if (this.moved) {
      event.preventDefault();
      return;
    }
    void this.router.navigate(['/learn', slug]);
  }

  protected zoomIn(): void {
    this.touched = true;
    this.scale(1.2);
  }

  protected zoomOut(): void {
    this.touched = true;
    this.scale(1 / 1.2);
  }

  protected fit(): void {
    const element = this.surface()?.nativeElement;
    if (!element) return;

    if (element.clientHeight < 80) return;      // styles have not landed yet

    const margin = 28;
    const scale = Math.min(
      (element.clientWidth - margin) / this.width,
      (element.clientHeight - margin) / this.height,
      1.4,
    );

    // Never shrink past readable: the map is taller than it is wide, so on a
    // short window it is better to fit the width and let the reader pan down.
    this.zoom.set(Math.max(scale, 0.62));
    this.panX.set(0);
    this.panY.set(0);
  }

  protected reset(): void {
    this.touched = true;
    this.zoom.set(1);
    this.panX.set(0);
    this.panY.set(0);
  }

  private scale(factor: number): void {
    this.zoom.update((value) => Math.min(2.5, Math.max(0.3, value * factor)));
  }

  protected pad(order: number): string {
    return order.toString().padStart(2, '0');
  }
}
