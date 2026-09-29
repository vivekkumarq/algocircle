import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { routes } from './app.routes';
import { AppTitleStrategy } from './core/services/app-title.strategy';

/** The path a snapshot resolves to, without query or fragment. */
function pathOf(snapshot: ActivatedRouteSnapshot): string {
  let leaf = snapshot;
  while (leaf.firstChild) leaf = leaf.firstChild;
  return leaf.pathFromRoot.flatMap((route) => route.url.map((segment) => segment.path)).join('/');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // Route `data` fills placeholder page inputs without an extra resolver.
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
      // Clicking a section you already jumped to, after scrolling away, is the
      // same URL again; without this the router ignores it and nothing moves.
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
      // A GPU-composited cross-fade between pages where the browser supports
      // it; everywhere else the navigation is simply instant, as before. A
      // jump within one page skips it: fading the whole page to reach a
      // section would flash on every contents click.
      withViewTransitions({
        skipInitialTransition: true,
        // (In development builds Angular logs the skipped transition's
        // AbortError; production builds swallow it.)
        onViewTransitionCreated: ({ transition, from, to }) => {
          if (pathOf(from) === pathOf(to)) transition.skipTransition();
        },
      }),
    ),
    { provide: TitleStrategy, useClass: AppTitleStrategy },
  ],
};
