import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/components/icon/icon';
import { DifficultyBadge } from '../../shared/components/difficulty-badge/difficulty-badge';
import {
  ROADMAP_STAGES,
  TOTAL_CONCEPTS,
  TOTAL_HOURS,
} from '../../data/roadmaps/roadmap.data';
import { PATTERN_PREVIEWS } from '../../data/patterns/pattern-preview.data';

interface Step {
  label: string;
  detail: string;
}

interface Feature {
  icon: string;
  title: string;
  body: string;
  route: string;
}

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, DifficultyBadge],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly stageCount = ROADMAP_STAGES.length;
  protected readonly conceptCount = TOTAL_CONCEPTS;
  protected readonly totalHours = TOTAL_HOURS;
  protected readonly previewStages = ROADMAP_STAGES.slice(0, 10);
  protected readonly remainingStages = ROADMAP_STAGES.length - 10;

  protected readonly patterns = PATTERN_PREVIEWS;
  protected readonly activePattern = signal(this.patterns[0].slug);
  protected readonly pattern = computed(
    () => this.patterns.find((item) => item.slug === this.activePattern()) ?? this.patterns[0],
  );

  /** Illustrative values for the dashboard preview, clearly labelled as a sample. */
  protected readonly sampleMastery = [
    { label: 'Arrays', value: 92 },
    { label: 'Hashing', value: 78 },
    { label: 'Binary Search', value: 64 },
    { label: 'Trees', value: 51 },
    { label: 'Graphs', value: 38 },
    { label: 'Dynamic Programming', value: 22 },
  ];

  protected pad(order: number): string {
    return order.toString().padStart(2, '0');
  }

  protected selectPattern(slug: string): void {
    this.activePattern.set(slug);
  }

  /** The learning loop the platform is built around. */
  protected readonly loop: Step[] = [
    { label: 'Learn', detail: 'Read the concept with worked examples' },
    { label: 'Visualise', detail: 'Watch the algorithm run step by step' },
    { label: 'Recognise', detail: 'Map the problem to a known pattern' },
    { label: 'Solve', detail: 'Work from brute force to optimal' },
    { label: 'Explain', detail: 'Say the trade-offs out loud' },
    { label: 'Revise', detail: 'Return on a spaced schedule' },
  ];

  /** What a problem page walks you through, in order. */
  protected readonly solveFlow: Step[] = [
    { label: 'Understand', detail: 'Restate the problem and pin down the constraints.' },
    { label: 'Think', detail: 'Search for a pattern before searching for code.' },
    { label: 'Hint', detail: 'Four graded nudges — take only as many as you need.' },
    { label: 'Brute force', detail: 'Get something correct, and cost it honestly.' },
    { label: 'Optimise', detail: 'Remove the repeated work the brute force exposed.' },
    { label: 'Why it works', detail: 'The invariant or argument that makes it correct.' },
    { label: 'Complexity', detail: 'Time and space, best and worst case.' },
    { label: 'Edge cases', detail: 'Empty input, duplicates, overflow, single element.' },
    { label: 'Explain', detail: 'A short script for narrating the solution in a round.' },
  ];

  protected readonly features: Feature[] = [
    {
      icon: 'map',
      title: 'An ordered roadmap',
      body: 'Every stage lists its prerequisites and what to study next, so you never guess at the sequence.',
      route: '/roadmap',
    },
    {
      icon: 'layers',
      title: 'Pattern library',
      body: 'Recognition signals, a generic template, common variations and the mistakes that cost marks.',
      route: '/patterns',
    },
    {
      icon: 'eye',
      title: 'Algorithm visualiser',
      body: 'Play, pause and step through sorting, searching, graph and tree algorithms with the state shown at each step.',
      route: '/visualizer',
    },
    {
      icon: 'target',
      title: 'Problem DNA',
      body: 'Each problem exposes its pattern, prerequisites, recognition signals and the trap most people fall into.',
      route: '/problems',
    },
    {
      icon: 'repeat',
      title: 'Spaced revision',
      body: 'Solved problems return after 1, 3, 7, 21 and 45 days so the work you did last month still counts.',
      route: '/progress/revision',
    },
    {
      icon: 'chart',
      title: 'Honest analytics',
      body: 'Mastery per topic and per pattern, computed from your attempts, hints used and accuracy.',
      route: '/progress',
    },
    {
      icon: 'briefcase',
      title: 'Interview simulation',
      body: 'Timed mock rounds and online-assessment conditions, scored as practice feedback rather than a verdict.',
      route: '/interview/mock',
    },
    {
      icon: 'lock',
      title: 'Yours, on your device',
      body: 'No account, no server, no tracking. Progress lives in your browser storage and can be reset at any time.',
      route: '/progress',
    },
  ];

  protected readonly faqs = [
    {
      q: 'Do I need an account?',
      a: 'No. AlgoCircle is a static site with no backend and no sign-up. Progress, notes and bookmarks are stored in your browser, which also means they stay on the device you study on.',
    },
    {
      q: 'Which language should I use?',
      a: 'Any of them. Explanations are language-neutral and the templates are written as readable pseudocode, with Java, C++ and Python implementations on the problem pages.',
    },
    {
      q: 'Is this a replacement for practising on a judge?',
      a: 'No. It teaches the concepts, patterns and reasoning, then points you at problems to solve. Running your solutions against a full test suite is still worth doing on a judge of your choice.',
    },
    {
      q: 'How long does the full path take?',
      a: `The roadmap estimates roughly ${TOTAL_HOURS} focused hours across ${ROADMAP_STAGES.length} stages. At two hours a day that is a few months, and the roadmap lets you skip stages you already know.`,
    },
    {
      q: 'Is the content copied from other DSA sites?',
      a: 'No. The curriculum covers the same well-known algorithms every course does, but the explanations, examples and diagrams here are written for this project.',
    },
    {
      q: 'Does it work offline?',
      a: 'Once the page has loaded, yes. All learning content ships with the application rather than being fetched from an API.',
    },
  ];
}
