import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Icon } from '../../shared/components/icon/icon';
import {
  FontChoice,
  SizeChoice,
  ThemeMode,
  ThemeService,
} from '../../core/services/theme.service';

/** Header popover for palette, typeface and text size. */
@Component({
  selector: 'app-appearance-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './appearance-menu.html',
  styleUrl: './appearance-menu.scss',
})
export class AppearanceMenu {
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly theme = inject(ThemeService);

  protected readonly open = signal(false);
  protected readonly current = computed(
    () => this.theme.themes.find((option) => option.id === this.theme.theme()) ?? this.theme.themes[0],
  );

  protected toggle(): void {
    this.open.update((open) => !open);
  }

  protected choose(mode: ThemeMode): void {
    this.theme.set(mode);
  }

  protected chooseFont(font: FontChoice): void {
    this.theme.setFont(font);
  }

  protected chooseSize(size: SizeChoice): void {
    this.theme.setSize(size);
  }

  @HostListener('document:keydown.escape')
  protected close(): void {
    this.open.set(false);
  }

  @HostListener('document:pointerdown', ['$event'])
  protected onOutsideClick(event: PointerEvent): void {
    if (!this.open()) return;
    if (!this.host.nativeElement.contains(event.target as Node)) this.open.set(false);
  }
}
