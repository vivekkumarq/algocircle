#!/usr/bin/env node
/**
 * Fails the build when a palette is incomplete or unreadable.
 *
 * Seven palettes share one set of component styles, so a token a palette
 * forgets does not break anything visibly — it silently inherits the light
 * value and the page looks subtly wrong in a way nobody can point at. And a
 * contrast failure on one palette is invisible while you are looking at
 * another. Both are caught here instead.
 *
 *   node tools/check-themes.mjs
 */
import fs from 'node:fs';

const FILE = 'src/styles/_tokens.scss';
const src = fs.readFileSync(FILE, 'utf8');

/** Tokens whose value is a colour we can actually measure. */
const COLOUR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

function blocks(text) {
  const out = new Map();
  const re = /(^|\n)(:root|\[data-theme='([a-z]+)'\])\s*\{([\s\S]*?)\n\}/g;

  let m;
  while ((m = re.exec(text))) {
    const name = m[3] ?? 'root';
    const tokens = new Map();

    for (const line of m[4].split('\n')) {
      const t = /^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/i.exec(line);
      if (t) tokens.set(t[1], t[2].trim());
    }

    // A palette can be declared in more than one block; merge them.
    const existing = out.get(name);
    if (existing) for (const [k, v] of tokens) existing.set(k, v);
    else out.set(name, tokens);
  }
  return out;
}

const palettes = blocks(src);
const root = palettes.get('root');
if (!root) throw new Error('no :root block in ' + FILE);

const themed = [...palettes.entries()].filter(([name]) => name !== 'root');
const problems = [];

/* ---- 1. Every palette must redefine every colour the root defines ---- */

const rootColours = [...root.entries()]
  .filter(([, v]) => COLOUR.test(v))
  .map(([k]) => k);

for (const [name, tokens] of themed) {
  for (const key of rootColours) {
    if (!tokens.has(key)) {
      problems.push(`${name}: never defines ${key}, so it inherits the light value`);
    }
  }
}

/* ---- 2. Text has to be readable on the surface it sits on ---- */

const channel = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

function luminance(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

const ratio = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// [foreground, background, minimum, why]
const PAIRS = [
  ['--text-primary', '--bg-main', 4.5, 'body text'],
  ['--text-primary', '--bg-card', 4.5, 'text on a card'],
  ['--text-secondary', '--bg-main', 4.5, 'secondary text'],
  ['--text-muted', '--bg-main', 3.0, 'muted text'],
  ['--accent-text', '--bg-main', 4.5, 'links'],
  ['--accent-text', '--accent-soft', 4.5, 'text on an accent panel'],
  ['--accent-contrast', '--accent', 4.5, 'text on a primary button'],
];

for (const [name, tokens] of [['root', root], ...themed]) {
  const value = (key) => {
    const own = tokens.get(key) ?? root.get(key);
    return own && COLOUR.test(own) ? own : null;
  };

  for (const [fg, bg, min, what] of PAIRS) {
    const a = value(fg);
    const b = value(bg);
    if (!a || !b) continue;

    const r = ratio(a, b);
    if (r < min) {
      problems.push(
        `${name}: ${what} is ${r.toFixed(2)}:1 (${fg} on ${bg}), below the ${min}:1 minimum`,
      );
    }
  }
}

if (problems.length) {
  console.error(`\n${problems.length} palette problem(s):\n`);
  for (const p of problems) console.error('  ' + p);
  console.error('');
  process.exit(1);
}

console.log(`${themed.length + 1} palettes checked: every token defined, every pair readable.`);
