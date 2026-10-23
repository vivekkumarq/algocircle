import { Injectable, inject } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { SeoService } from './seo.service';

/**
 * Route-driven SEO: `title` and `data.description` on a route are all a page
 * needs to get a document title, meta description and Open Graph tags.
 */
@Injectable({ providedIn: 'root' })
export class AppTitleStrategy extends TitleStrategy {
  private readonly seo = inject(SeoService);
  private path = '';

  override updateTitle(snapshot: RouterStateSnapshot): void {
    // A jump within the page (/learn/graphs#bfs) is still the same page. The
    // page set its own title when it opened and will not set it again, so
    // falling back to the route's defaults here would wipe it.
    const path = snapshot.url.split(/[?#]/)[0];
    if (path === this.path) return;
    this.path = path;

    const title = this.buildTitle(snapshot);
    const description = deepestDescription(snapshot);
    this.seo.update(title, description, path === '/' ? '' : path);
  }
}

function deepestDescription(snapshot: RouterStateSnapshot): string | undefined {
  let route = snapshot.root;
  let description: string | undefined;
  while (route) {
    const value = route.data?.['description'];
    if (typeof value === 'string') description = value;
    if (!route.firstChild) break;
    route = route.firstChild;
  }
  return description;
}
