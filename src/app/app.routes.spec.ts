import { Routes } from '@angular/router';
import { routes } from './app.routes';
import { TOPICS } from './data/topics.data';

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

  it('serves the topic index and every topic through one parameterised route', () => {
    expect(paths.has('/learn')).toBe(true);
    expect(paths.has('/learn/:slug')).toBe(true);
  });

  it('keeps the old roadmap URL working', () => {
    const shell = routes.find((route) => route.children?.length);
    const roadmap = shell?.children?.find((route) => route.path === 'roadmap');
    expect(roadmap?.redirectTo).toBe('learn');
  });

  it('lazy-loads every routed page', () => {
    const walk = (config: Routes): void => {
      for (const route of config) {
        if (!route.children && !route.redirectTo) expect(route.loadComponent).toBeDefined();
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

  it('has no placeholder routes left', () => {
    const serialised = JSON.stringify(routes);
    expect(serialised).not.toContain('coming-soon');
    expect(serialised).not.toContain('phase');
  });

  it('gives every topic a slug the router can match', () => {
    expect(TOPICS.length).toBeGreaterThan(0);
    for (const topic of TOPICS) expect(topic.slug).toMatch(/^[a-z0-9-]+$/);
  });
});
