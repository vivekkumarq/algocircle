import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withNavigationErrorHandler,
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
      // A tab opened before a deploy still asks for the old build's page
      // chunks, which Pages no longer has, so a link to any page not yet
      // visited did nothing. Load that page afresh from the new build. Never
      // for the first navigation, so a broken build cannot reload forever.
      withNavigationErrorHandler(({ error, url }) => {
        const message = String((error as Error | undefined)?.message ?? error);
        const missingChunk = /dynamically imported module|Importing a module script failed/i.test(
          message,
        );
        if (missingChunk && navigator.onLine && inject(Router).navigated) location.assign(url);
      }),
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
