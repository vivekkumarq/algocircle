import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GUIDES, guideBySlug } from '../../data/guides/guides.data';
import { SeoService } from '../../core/services/seo.service';
import { LayoutService } from '../../core/services/layout.service';
import { Icon } from '../../shared/components/icon/icon';
import { ContentBlocks } from '../../shared/components/content-blocks/content-blocks';

/**
 * The "how to learn" corner: index at /guide, one guide at /guide/:slug.
 * Reuses the chapter content renderer, so guides are written as the same
 * typed blocks as the curriculum.
 */
@Component({
  selector: 'app-guide-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, ContentBlocks],
  templateUrl: './guide-page.html',
  styleUrl: './guide-page.scss',
})
export class GuidePage {
  private readonly seo = inject(SeoService);
  protected readonly isWide = inject(LayoutService).isWide;

  /** Empty on the index route; bound from the route parameter otherwise. */
  readonly slug = input('');

  protected readonly guides = GUIDES;
  protected readonly guide = computed(() => (this.slug() ? guideBySlug(this.slug()) : undefined));
  protected readonly isIndex = computed(() => !this.slug());

  protected readonly position = computed(() => {
    const index = GUIDES.findIndex((guide) => guide.slug === this.slug());
    if (index < 0) return null;
    return {
      previous: index > 0 ? GUIDES[index - 1] : undefined,
      next: index < GUIDES.length - 1 ? GUIDES[index + 1] : undefined,
    };
  });

  constructor() {
    effect(() => {
      const guide = this.guide();
      if (guide) this.seo.update(guide.title, guide.tagline, `/guide/${guide.slug}`);
      else if (this.isIndex()) {
        this.seo.update(
          'How to learn DSA',
          'How to build problem-solving logic from zero, how to turn an idea into working code, and a realistic study plan.',
          '/guide',
        );
      }
    });
  }
}
