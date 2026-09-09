import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NAV_SECTIONS } from '../../data/navigation.data';
import { Logo } from '../../shared/components/logo/logo';
import { Icon } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Logo, Icon],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly sections = NAV_SECTIONS;
  protected readonly year = new Date().getFullYear();
}
