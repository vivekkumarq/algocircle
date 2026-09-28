import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { LayoutService } from '../../core/services/layout.service';
import { ThemeService } from '../../core/services/theme.service';

/** Everything the keyboard can do, for the help sheet. */
const SHEET = [
  {
    title: 'Anywhere',
    keys: [
      { keys: ['Ctrl', 'K'], label: 'Command palette: search, jump, switch theme' },
      { keys: ['/'], label: 'Search' },
      { keys: ['T'], label: 'Switch between light and dark' },
      { keys: ['['], label: 'Show or hide the topic list' },
      { keys: [']'], label: 'Show or hide "On this page"' },
      { keys: ['?'], label: 'This sheet' },
    ],
  },
  {
    title: 'In a lesson',
    keys: [
      { keys: ['J'], label: 'Next section' },
      { keys: ['K'], label: 'Previous section' },
      { keys: ['N'], label: 'Next topic' },
      { keys: ['P'], label: 'Previous topic' },
    ],
  },
] as const;

/** True while the reader is typing, when single-letter shortcuts must stay quiet. */
export function isTyping(event: KeyboardEvent): boolean {
  const target = event.target as HTMLElement | null;
  return !!target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
}

/** A plain key press: no Ctrl, Alt or Cmd, not typing, not already handled. */
export function isPlainKey(event: KeyboardEvent): boolean {
  return !event.ctrlKey && !event.metaKey && !event.altKey && !event.defaultPrevented && !isTyping(event);
}

/**
 * Site-wide single-key shortcuts and the `?` sheet that lists them. The
 * command palette (Ctrl+K, /) and the lesson keys (J, K, N, P) live with the
 * components they drive; this one owns the rest.
 */
@Component({
  selector: 'app-shortcuts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (layout.helpOpen()) {
      <div class="scrim" (click)="layout.setHelp(false)" aria-hidden="true"></div>
      <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="shortcuts-title">
        <header>
          <h2 id="shortcuts-title">Keyboard shortcuts</h2>
          <button type="button" class="close" (click)="layout.setHelp(false)" aria-label="Close">
            <span class="kbd">Esc</span>
          </button>
        </header>
        @for (group of sheet; track group.title) {
          <p class="group">{{ group.title }}</p>
          <dl>
            @for (item of group.keys; track item.label) {
              <div>
                <dt>
                  @for (key of item.keys; track key) {
                    <span class="kbd">{{ key }}</span>
                  }
                </dt>
                <dd>{{ item.label }}</dd>
              </div>
            }
          </dl>
        }
      </div>
    }
  `,
  styleUrl: './shortcuts.scss',
})
export class Shortcuts {
  protected readonly layout = inject(LayoutService);
  private readonly theme = inject(ThemeService);
  protected readonly sheet = SHEET;

  @HostListener('document:keydown', ['$event'])
  protected onKey(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.layout.helpOpen()) {
      this.layout.setHelp(false);
      return;
    }
    if (!isPlainKey(event)) return;

    switch (event.key) {
      case '?':
        this.layout.setHelp(!this.layout.helpOpen());
        break;
      case 't':
      case 'T':
        this.theme.toggleDark();
        break;
      case '[':
        this.layout.setSidebar(!this.layout.sidebarOpen());
        break;
      case ']':
        this.layout.setContents(!this.layout.contentsOpen());
        break;
      default:
        return;
    }
    event.preventDefault();
  }
}
