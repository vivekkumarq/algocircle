import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Block, CodeLanguage } from '../../../core/models/chapter.models';
import { Icon } from '../icon/icon';
import { AlgoVisual } from '../../visuals/algo-visual';

type CodeBlock = Extract<Block, { kind: 'code' }>;

/** A block, or a run of code blocks collapsed into one language switcher. */
type Item = Exclude<Block, { kind: 'code' }> | { kind: 'code-group'; tabs: CodeBlock[] };

const CALLOUT_ICON = { key: 'zap', note: 'book', trap: 'shield', why: 'compass' } as const;
const CALLOUT_LABEL = {
  key: 'Key idea',
  note: 'Note',
  trap: 'Common trap',
  why: 'Why it works',
} as const;

/** Renders a chapter's typed blocks. The only place lesson markup is defined. */
@Component({
  selector: 'app-content-blocks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, AlgoVisual],
  templateUrl: './content-blocks.html',
  styleUrl: './content-blocks.scss',
})
export class ContentBlocks {
  private readonly sanitizer = inject(DomSanitizer);

  readonly blocks = input.required<Block[]>();

  /**
   * Runs of adjacent code blocks become one tabbed group, so a lesson that
   * shows the same idea in Java and Python renders as a switcher rather than
   * two stacked listings.
   */
  protected readonly items = computed<Item[]>(() => {
    const out: Item[] = [];

    for (const block of this.blocks()) {
      const previous = out.at(-1);

      if (block.kind === 'code' && previous?.kind === 'code-group') {
        // Only group different languages; two Java snippets are two snippets.
        if (!previous.tabs.some((tab) => tab.language === block.language)) {
          previous.tabs.push(block);
          continue;
        }
      }

      out.push(block.kind === 'code' ? { kind: 'code-group', tabs: [block] } : block);
    }

    return out;
  });

  /** One preference for the whole page: pick Python once and every block follows. */
  protected readonly language = signal<CodeLanguage | null>(null);

  protected shown(tabs: CodeBlock[]): CodeBlock {
    const preferred = this.language();
    return tabs.find((tab) => tab.language === preferred) ?? tabs[0];
  }

  protected choose(language: CodeLanguage): void {
    this.language.set(language);
  }

  /** Source of the snippet most recently copied, so one button can confirm. */
  protected readonly copied = signal<string | null>(null);

  private confirmation?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.confirmation));
  }

  protected async copy(source: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(source);
      this.copied.set(source);
    } catch {
      // Clipboard access can be refused; leaving the label alone says so.
      return;
    }

    clearTimeout(this.confirmation);
    this.confirmation = setTimeout(() => this.copied.set(null), 1600);
  }

  protected readonly calloutIcon = CALLOUT_ICON;
  protected readonly calloutLabel = CALLOUT_LABEL;

  /**
   * Escapes the authored text first, then re-introduces only `code` and
   * **bold**, so lesson prose can never inject markup.
   */
  protected rich(text: string): SafeHtml {
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    const marked = escaped
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    return this.sanitizer.bypassSecurityTrustHtml(marked);
  }
}
