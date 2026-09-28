import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/components/icon/icon';
import { TopicGraph } from '../../shared/components/topic-graph/topic-graph';
import { TOPIC_GROUPS } from '../../data/navigation.data';
import { TOPICS, TOTAL_TOPIC_MINUTES, TOTAL_TOPIC_SECTIONS } from '../../data/topics.data';
import { PATTERN_PREVIEWS } from '../../data/patterns/pattern-preview.data';
import { SITE_STATS } from '../../data/site-stats.data';
import { RichPipe } from '../../shared/pipes/rich.pipe';
import { HighlightPipe } from '../../shared/pipes/highlight.pipe';
import { ProgressService } from '../../core/services/progress.service';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, TopicGraph, RichPipe, HighlightPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly topicCount = TOPICS.length;
  protected readonly sectionCount = TOTAL_TOPIC_SECTIONS;
  protected readonly minutes = TOTAL_TOPIC_MINUTES;
  protected readonly groups = TOPIC_GROUPS;

  protected readonly stats = SITE_STATS;
  protected readonly courseHours = Math.round(SITE_STATS.courseMinutes / 60);

  private readonly progress = inject(ProgressService);

  protected readonly doneCount = computed(
    () => TOPICS.filter((topic) => this.progress.doneTopics().has(topic.slug)).length,
  );

  /** The topic and section the reader was last in, if they have started. */
  protected readonly resume = computed(() => {
    const last = this.progress.lastRead();
    const topic = last && TOPICS.find((item) => item.slug === last.slug);
    if (!last || !topic) return null;
    const section = topic.sections.find((item) => item.id === last.section);
    return { slug: topic.slug, topic: topic.title, section: section?.id, sectionTitle: section?.title };
  });

  protected readonly patterns = PATTERN_PREVIEWS;
  protected readonly activePattern = signal(this.patterns[0].slug);
  protected readonly pattern = computed(
    () => this.patterns.find((item) => item.slug === this.activePattern()) ?? this.patterns[0],
  );

  protected selectPattern(slug: string): void {
    this.activePattern.set(slug);
  }

  /** What every topic page contains, in the order it appears. */
  protected readonly anatomy = [
    { icon: 'target', title: 'What you will be able to do', body: 'Concrete outcomes stated up front, so you know what the topic is for.' },
    { icon: 'book', title: 'The concept, from scratch', body: 'Plain-language explanation with the reasoning behind it, not just the definition.' },
    { icon: 'grid', title: 'Diagrams and worked examples', body: 'Memory layouts, traversals and step-by-step traces you can follow on paper.' },
    { icon: 'code', title: 'Code in the shape you would write it', body: 'Short, commented implementations with the invariant called out.' },
    { icon: 'zap', title: 'Complexity, honestly stated', body: 'Time and space, best and worst case, and what the constants hide.' },
    { icon: 'shield', title: 'The traps', body: 'The specific mistakes that break each technique, marked where they happen.' },
    { icon: 'compass', title: 'Check yourself', body: 'A question at the end of hard sections, with the answer one click away.' },
    { icon: 'layers', title: 'Key takeaways', body: 'The compressed version, for revision later.' },
  ];

  protected readonly faqs = [
    {
      q: 'Where should I start?',
      a: 'Topic 01, Why DSA. It explains what data structures and algorithms actually are and why a slow program stays slow on fast hardware, before any code. If you already know that, go straight to Foundations or jump to whatever topic you need.',
    },
    {
      q: 'Do I need an account?',
      a: 'No. AlgoCircle is a static site with no backend and no sign-up, and every topic is open from the first visit. The topics you mark complete, the problems you solve and the place you were reading are kept in your own browser — nothing is sent anywhere.',
    },
    {
      q: 'Which language should I use?',
      a: 'Any of them. The explanations are language-neutral, and every code sample comes in both Java and Python — pick one on any snippet and the whole site follows that choice.',
    },
    {
      q: 'Is this enough on its own?',
      a: 'It teaches the concepts, the reasoning and the patterns. You still need to solve problems on a judge of your choice — reading about binary search is not the same as writing one that terminates.',
    },
    {
      q: 'Is the content copied from other DSA sites?',
      a: 'No. The curriculum covers the same well-known algorithms every course does, because there is only one Dijkstra — but the explanations, examples and diagrams here are written for this project.',
    },
    {
      q: 'Does it work offline?',
      a: 'Once the page has loaded, yes. All content ships with the application rather than being fetched from an API.',
    },
  ];
}
