// Give every page a real file, so GitHub Pages answers deep links with 200.
//
// Pages only knows about files. Without this, /learn/hashing is served from
// 404.html: the app still boots and shows the page, but the HTTP status is
// 404, so search engines and link previews treat every page but the home
// page as missing. Pages resolves /learn/hashing to learn/hashing.html, so a
// copy of the app shell there fixes the status with no change to the URL.
//
// The routes come from the sitemap, which is also what search engines read.
// Before writing anything, every slug in the content data is checked against
// it, so a new topic or problem cannot ship without an entry.
//
//   node tools/static-routes.mjs [outDir]
import { copyFileSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const OUT = process.argv[2] ?? 'dist/algocircle/browser';
const DATA = 'src/app/data';

const sitemap = readFileSync('public/sitemap.xml', 'utf8');
const paths = [...sitemap.matchAll(/<loc>https?:\/\/[^/<]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]);

/** Top-level `slug: '...'` values in every data file under a folder. */
function slugs(folder) {
  const found = new Set();
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts')) {
        for (const m of readFileSync(path, 'utf8').matchAll(/^\s{2,6}slug: '([a-z0-9-]+)'/gm)) found.add(m[1]);
      }
    }
  };
  walk(join(DATA, folder));
  return found;
}

// Slugs that live in these folders but are not pages of that section.
const NOT_PAGES = new Set(['/problems/core-75', '/course/advanced-algorithms']);
const expected = [
  ...[...slugs('chapters')].map((s) => `/learn/${s}`),
  ...[...slugs('patterns')].map((s) => `/patterns/${s}`),
  ...[...slugs('problems')].map((s) => `/problems/${s}`),
  ...[...slugs('course')].map((s) => `/course/${s}`),
  ...[...slugs('guides')].map((s) => `/guide/${s}`),
].filter((path) => !NOT_PAGES.has(path));

const listed = new Set(paths);
const missing = expected.filter((path) => !listed.has(path));
if (missing.length) {
  console.error(`public/sitemap.xml is missing ${missing.length} page(s):\n  ${missing.join('\n  ')}`);
  process.exit(1);
}

const shell = join(OUT, 'index.html');
const put = (file) => {
  mkdirSync(dirname(file), { recursive: true });
  copyFileSync(shell, file);
};

let written = 0;
for (const path of paths) {
  if (path === '/') continue;
  const name = path.replace(/^\/|\/$/g, '');
  put(join(OUT, `${name}.html`));
  // /learn is a page and also a folder of pages. Should Pages prefer the
  // folder and redirect to /learn/, that has an entry too.
  if (paths.some((other) => other.startsWith(`${path}/`))) put(join(OUT, name, 'index.html'));
  written++;
}

console.log(`${written} pages given a static entry; sitemap covers all ${expected.length} content pages.`);
