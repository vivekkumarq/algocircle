import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TOPIC_GROUPS } from '../../data/navigation.data';
import { Logo } from '../../shared/components/logo/logo';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Logo],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly groups = TOPIC_GROUPS;
  protected readonly year = new Date().getFullYear();
}
