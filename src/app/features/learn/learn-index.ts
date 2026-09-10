import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TOPIC_GROUPS } from '../../data/navigation.data';
import { TOPICS, TOTAL_TOPIC_MINUTES, TOTAL_TOPIC_SECTIONS } from '../../data/topics.data';
import { Icon } from '../../shared/components/icon/icon';
import { TopicGraph } from '../../shared/components/topic-graph/topic-graph';

@Component({
  selector: 'app-learn-index',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, TopicGraph],
  templateUrl: './learn-index.html',
  styleUrl: './learn-index.scss',
})
export class LearnIndex {
  protected readonly topics = TOPICS;
  protected readonly groups = TOPIC_GROUPS;
  protected readonly sections = TOTAL_TOPIC_SECTIONS;
  protected readonly minutes = TOTAL_TOPIC_MINUTES;

  protected pad(order: number): string {
    return order.toString().padStart(2, '0');
  }
}
