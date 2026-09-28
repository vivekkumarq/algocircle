import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TOPIC_GROUPS } from '../../data/navigation.data';
import {
  TOPICS,
  TOTAL_TOPIC_MINUTES,
  TOTAL_TOPIC_SECTIONS,
  TopicMeta,
  topicHue,
} from '../../data/topics.data';
import { Icon } from '../../shared/components/icon/icon';
import { TopicGraph } from '../../shared/components/topic-graph/topic-graph';
import { RichPipe } from '../../shared/pipes/rich.pipe';
import { ProgressService } from '../../core/services/progress.service';

/** Sections every topic ends with; the preview shows what is specific to it. */
const SHARED_SECTIONS = new Set(['at-big-tech', 'in-the-wild']);
const PREVIEW = 3;

const label = (slug: string) => TOPICS.find((topic) => topic.slug === slug)?.label ?? slug;

function card(topic: TopicMeta) {
  const own = topic.sections.filter((section) => !SHARED_SECTIONS.has(section.id));
  return {
    ...topic,
    hue: topicHue(topic.order),
    inside: own.slice(0, PREVIEW).map((section) => section.title),
    more: topic.sections.length - PREVIEW,
    after: topic.prerequisites.map(label),
  };
}

@Component({
  selector: 'app-learn-index',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, TopicGraph, RichPipe],
  templateUrl: './learn-index.html',
  styleUrl: './learn-index.scss',
})
export class LearnIndex {
  protected readonly topics = TOPICS;
  protected readonly sections = TOTAL_TOPIC_SECTIONS;
  protected readonly minutes = TOTAL_TOPIC_MINUTES;

  protected readonly done = inject(ProgressService).doneTopics;
  protected readonly doneCount = computed(
    () => TOPICS.filter((topic) => this.done().has(topic.slug)).length,
  );

  protected readonly groups = TOPIC_GROUPS.map((group) => ({
    level: group.level,
    minutes: group.topics.reduce((sum, topic) => sum + topic.minutes, 0),
    topics: group.topics.map(card),
  }));

  constructor() {
    const host = inject(ElementRef).nativeElement as HTMLElement;
    const destroy = inject(DestroyRef);

    // The glow that follows the cursor across a card. A plain listener that
    // writes two custom properties, so moving the mouse never runs change
    // detection; the browser does the rest in CSS.
    afterNextRender(() => {
      const follow = (event: PointerEvent) => {
        const target = (event.target as Element).closest<HTMLElement>('.card');
        if (!target) return;
        const box = target.getBoundingClientRect();
        target.style.setProperty('--mx', `${event.clientX - box.left}px`);
        target.style.setProperty('--my', `${event.clientY - box.top}px`);
      };
      host.addEventListener('pointermove', follow, { passive: true });
      destroy.onDestroy(() => host.removeEventListener('pointermove', follow));
    });
  }

  protected pad(order: number): string {
    return order.toString().padStart(2, '0');
  }
}
