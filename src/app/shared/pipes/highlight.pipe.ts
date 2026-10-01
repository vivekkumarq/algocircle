import { Pipe, PipeTransform } from '@angular/core';

/**
 * Syntax colouring for the code on the site: Java, Python and the Python-like
 * pseudocode the patterns use. One pass over the source with a single regular
 * expression; every piece of text is escaped, and the only markup produced is
 * `<span class="tok-…">`, so a snippet can never inject HTML of its own. The
 * colours are theme tokens (`--syn-*`), checked for contrast in every palette.
 */

type Kind = 'k' | 's' | 'n' | 't' | 'f' | 'c';

interface Grammar {
  pattern: RegExp;
  keywords: Set<string>;
  builtins: Set<string>;
  /** Java-style: a capitalised name is a type. */
  capitalTypes: boolean;
}

const words = (list: string) => new Set(list.split(/\s+/).filter(Boolean));

const JAVA_KEYWORDS = words(`
  abstract assert boolean break byte case catch char class const continue default do double
  else enum extends final finally float for if implements import instanceof int interface long
  native new package private protected public record return short static super switch
  synchronized this throw throws try var void volatile while yield true false null`);

const PYTHON_KEYWORDS = words(`
  and as assert async await break class continue def del elif else except False finally for
  from global if import in is lambda None nonlocal not or pass raise return True try while
  with yield self`);

const PYTHON_BUILTINS = words(`
  abs all any bin bool bisect_left bisect_right chr Counter defaultdict deque dict divmod
  enumerate filter float heapify heappop heappush heapq int isinstance len list map max min
  next ord pow print range reversed set sorted str sum tuple zip inf`);

// Pseudocode reads like Python with a few extra verbs.
const PSEUDO_KEYWORDS = new Set([
  ...PYTHON_KEYWORDS,
  ...words('function procedure then do end to downto let repeat until each of null true false'),
]);

const NUMBER = String.raw`\b(?:0[xX][\da-fA-F_]+|\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?)[lLfFdD]?\b`;
const DOUBLE = String.raw`"(?:[^"\\\n]|\\.)*"`;
const SINGLE = String.raw`'(?:[^'\\\n]|\\.)*'`;
const WORD = String.raw`[A-Za-z_$][\w$]*`;

const pattern = (comment: string, string: string) =>
  new RegExp(`(?<c>${comment})|(?<s>${string})|(?<n>${NUMBER})|(?<w>${WORD})`, 'g');

const C_STYLE = String.raw`\/\*[\s\S]*?\*\/|\/\/[^\n]*`;
const HASH = String.raw`#[^\n]*`;

const GRAMMARS: Record<string, Grammar> = {
  java: {
    pattern: pattern(C_STYLE, `${DOUBLE}|${SINGLE}`),
    keywords: JAVA_KEYWORDS,
    builtins: new Set(),
    capitalTypes: true,
  },
  python: {
    pattern: pattern(HASH, `"""[\\s\\S]*?"""|'''[\\s\\S]*?'''|${DOUBLE}|${SINGLE}`),
    keywords: PYTHON_KEYWORDS,
    builtins: PYTHON_BUILTINS,
    capitalTypes: false,
  },
  pseudocode: {
    pattern: pattern(`${C_STYLE}|${HASH}`, `${DOUBLE}|${SINGLE}`),
    keywords: PSEUDO_KEYWORDS,
    builtins: PYTHON_BUILTINS,
    capitalTypes: false,
  },
};
// TypeScript and C++ snippets are close enough to Java's shape.
GRAMMARS['typescript'] = GRAMMARS['java'];
GRAMMARS['cpp'] = GRAMMARS['java'];

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function kindOfWord(word: string, rest: string, grammar: Grammar): Kind | null {
  if (grammar.keywords.has(word)) return 'k';
  if (/^\s*\(/.test(rest)) return grammar.builtins.has(word) ? 't' : 'f';
  if (grammar.builtins.has(word)) return 't';
  if (grammar.capitalTypes && /^[A-Z]/.test(word)) return 't';
  return null;
}

export function highlightCode(source: string | null | undefined, language: string | null | undefined): string {
  const code = source ?? '';
  const grammar = GRAMMARS[language ?? ''];
  if (!grammar) return escape(code);

  const re = new RegExp(grammar.pattern.source, 'g');
  let out = '';
  let last = 0;

  for (let m = re.exec(code); m; m = re.exec(code)) {
    if (m.index > last) out += escape(code.slice(last, m.index));
    const text = m[0];
    const groups = m.groups ?? {};

    let kind: Kind | null = null;
    if (groups['c'] !== undefined) kind = 'c';
    else if (groups['s'] !== undefined) kind = 's';
    else if (groups['n'] !== undefined) kind = 'n';
    else kind = kindOfWord(text, code.slice(re.lastIndex, re.lastIndex + 8), grammar);

    out += kind ? `<span class="tok-${kind}">${escape(text)}</span>` : escape(text);
    last = re.lastIndex;
  }

  return out + escape(code.slice(last));
}

/**
 * Puts each line of highlighted code in its own `<span class="ln ln-N">`, N
 * being the line's indentation. On a narrow screen a long line can then wrap
 * with a hanging indent (see `_base.scss`): the continuation sits under the
 * line's own code, not back at column 0. A token that runs across a line break
 * (a block comment) is closed at the break and reopened on the next line.
 */
export function toLines(html: string): string {
  let carried = '';
  return html
    .split('\n')
    .map((raw) => {
      let line = carried ? `<span class="${carried}">${raw}` : raw;
      const opened = [...line.matchAll(/<span class="([^"]+)">/g)];
      const closed = line.split('</span>').length - 1;
      carried = opened.length > closed ? opened[opened.length - 1][1] : '';
      if (carried) line += '</span>';
      const indent = /^ */.exec(line.replace(/<[^>]+>/g, ''))![0].length;
      return `<span class="ln ln-${Math.min(indent, 32)}">${line}</span>`;
    })
    .join('');
}

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  transform(source: string | null | undefined, language: string | null | undefined): string {
    return toLines(highlightCode(source, language));
  }
}
