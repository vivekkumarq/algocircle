import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TOPICS } from '../../../data/topics.data';
import { GRAPH_LAYOUT, TOPIC_POSITIONS } from '../../../data/topic-graph.data';

interface GraphNode {
  slug: string;
  label: string;
  order: number;
  level: string;
  minutes: number;
  sections: number;
  summary: string;
  x: number;
  y: number;
  cx: number;
  cy: number;
}

interface GraphEdge {
  id: string;
  from: string;
  to: string;
  d: string;
}

/**
 * The curriculum as a dependency map: every topic, with an edge from each of
 * its prerequisites. Hovering a topic traces everything it depends on and
 * everything that depends on it, so you can see what a topic unlocks before
 * you commit to reading it.
 */
@Component({
  selector: 'app-topic-graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './topic-graph.html',
  styleUrl: './topic-graph.scss',
})
export class TopicGraph {
  protected readonly layout = GRAPH_LAYOUT;
  protected readonly width =
    GRAPH_LAYOUT.columns * GRAPH_LAYOUT.colPitch + GRAPH_LAYOUT.padding * 2;
  protected readonly height =
    GRAPH_LAYOUT.rows * GRAPH_LAYOUT.rowPitch + GRAPH_LAYOUT.padding * 2;

  protected readonly nodes: GraphNode[] = TOPICS.map((topic) => {
    const position = TOPIC_POSITIONS[topic.slug] ?? { col: 0, row: 0 };
    const x =
      GRAPH_LAYOUT.padding +
      position.col * GRAPH_LAYOUT.colPitch +
      (GRAPH_LAYOUT.colPitch - GRAPH_LAYOUT.nodeWidth) / 2;
    const y = GRAPH_LAYOUT.padding + position.row * GRAPH_LAYOUT.rowPitch;

    return {
      slug: topic.slug,
      label: topic.label,
      order: topic.order,
      level: topic.level,
      minutes: topic.minutes,
      sections: topic.sections,
      summary: topic.summary,
      x,
      y,
      cx: x + GRAPH_LAYOUT.nodeWidth / 2,
      cy: y + GRAPH_LAYOUT.nodeHeight / 2,
    };
  });

  private readonly byslug = new Map(this.nodes.map((node) => [node.slug, node]));

  protected readonly edges: GraphEdge[] = TOPICS.flatMap((topic) =>
    topic.prerequisites.flatMap((from) => {
      const a = this.byslug.get(from);
      const b = this.byslug.get(topic.slug);
      if (!a || !b) return [];

      const startY = a.y + GRAPH_LAYOUT.nodeHeight;
      const endY = b.y;
      const midY = (startY + endY) / 2;

      return [
        {
          id: `${from}->${topic.slug}`,
          from,
          to: topic.slug,
          // A vertical-ish cubic curve reads more cleanly than a straight line
          // when columns differ.
          d: `M${a.cx} ${startY} C ${a.cx} ${midY}, ${b.cx} ${midY}, ${b.cx} ${endY}`,
        },
      ];
    }),
  );

  private readonly prerequisitesOf = new Map(
    TOPICS.map((topic) => [topic.slug, topic.prerequisites]),
  );

  protected readonly active = signal<string | null>(null);

  /** The hovered topic, everything it needs, and everything that needs it. */
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
    return slug ? (this.byslug.get(slug) ?? null) : null;
  });

  protected state(slug: string): string {
    const related = this.related();
    if (!related) return 'idle';
    if (related.slug === slug) return 'current';
    if (related.ancestors.has(slug)) return 'needs';
    if (related.descendants.has(slug)) return 'unlocks';
    return 'dim';
  }

  protected edgeState(edge: GraphEdge): string {
    const related = this.related();
    if (!related) return 'idle';

    const onPathUp =
      (related.ancestors.has(edge.from) || edge.from === related.slug) &&
      (related.ancestors.has(edge.to) || edge.to === related.slug);
    const onPathDown =
      (related.descendants.has(edge.from) || edge.from === related.slug) &&
      (related.descendants.has(edge.to) || edge.to === related.slug);

    return onPathUp || onPathDown ? 'on' : 'dim';
  }

  protected enter(slug: string): void {
    this.active.set(slug);
  }

  protected leave(): void {
    this.active.set(null);
  }

  protected pad(order: number): string {
    return order.toString().padStart(2, '0');
  }
}
