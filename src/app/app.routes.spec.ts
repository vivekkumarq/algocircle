import { Routes } from '@angular/router';
import { routes } from './app.routes';
import { HEADER_LINKS, NAV_SECTIONS } from './data/navigation.data';

/** Collects every concrete path the router can match, ignoring wildcards. */
function collectPaths(config: Routes, prefix = ''): string[] {
  return config.flatMap((route) => {
    if (route.path === '**') return [];
    const path = [prefix, route.path].filter(Boolean).join('/');
    const self = route.loadComponent ? ['/' + path] : [];
    return [...self, ...collectPaths(route.children ?? [], path)];
  });
}

describe('route table', () => {
  const paths = new Set(collectPaths(routes));

  it('serves the landing page at the root', () => {
    const home = routes.find((route) => route.path === '' && route.pathMatch === 'full');
    expect(home?.loadComponent).toBeDefined();
  });

  it('has a target for every sidebar link', () => {
    for (const section of NAV_SECTIONS) {
      for (const item of section.items) {
        expect(paths.has(item.route)).toBe(true);
      }
    }
  });

  it('has a target for every header link', () => {
    for (const link of HEADER_LINKS) {
      expect(paths.has(link.route)).toBe(true);
    }
  });

  it('lazy-loads every routed page', () => {
    const walk = (config: Routes): void => {
      for (const route of config) {
        if (!route.children) expect(route.loadComponent).toBeDefined();
        if (route.children) walk(route.children);
      }
    };
    walk(routes);
  });

  it('ends with a catch-all that renders the not-found page', () => {
    const shell = routes.find((route) => route.children?.length);
    const wildcard = shell?.children?.at(-1);
    expect(wildcard?.path).toBe('**');
    expect(wildcard?.title).toBe('Page not found');
  });
});
