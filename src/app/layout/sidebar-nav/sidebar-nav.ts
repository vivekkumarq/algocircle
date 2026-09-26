import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { TOPIC_GROUPS } from '../../data/navigation.data';
import { Icon } from '../../shared/components/icon/icon';
import { LayoutService } from '../../core/services/layout.service';

/**
 * The curriculum as a plain numbered list. Shared by the desktop sidebar and
 * the mobile drawer so there is one definition of the navigation.
 *
 * Each topic expands to its section headings, so the rail answers "what is
 * actually inside this topic?" without opening it. One at a time: twenty
 * topics with every outline showing would be a wall rather than a menu.
 */
@Component({
  selector: 'app-sidebar-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './sidebar-nav.html',
  styleUrl: './sidebar-nav.scss',
})
export class SidebarNav {
  private readonly layout = inject(LayoutService);
  private readonly router = inject(Router);

  protected readonly groups = TOPIC_GROUPS;

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  /** The topic being read, if any — its outline opens by itself. */
  private readonly reading = computed(() => /^\/learn\/([a-z0-9-]+)/.exec(this.url())?.[1] ?? '');

  private readonly opened = signal('');

  constructor() {
    effect(() => this.opened.set(this.reading()));
  }

  protected isOpen(slug: string): boolean {
    return this.opened() === slug;
  }

  protected toggle(slug: string): void {
    this.opened.update((current) => (current === slug ? '' : slug));
  }

  protected pad(order: number): string {
    return order.toString().padStart(2, '0');
  }

  protected onNavigate(): void {
    this.layout.closeMobileNav();
  }
}
