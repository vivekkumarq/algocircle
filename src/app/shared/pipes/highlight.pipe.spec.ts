import { highlightCode, toLines } from './highlight.pipe';

const kinds = (html: string) =>
  [...html.matchAll(/<span class="tok-(\w)">([^<]*)<\/span>/g)].map(([, kind, text]) => `${kind}:${text}`);

describe('syntax highlighting', () => {
  it('colours Java keywords, types, calls, numbers, strings and comments', () => {
    const html = highlightCode('int n = list.size(); // count\nString s = "a";', 'java');
    expect(kinds(html)).toEqual(['k:int', 'f:size', 'c:// count', 't:String', 's:"a"']);
  });

  it('colours Python keywords, builtins and comments', () => {
    const html = highlightCode('def f(a):\n    return len(a)  # size', 'python');
    expect(kinds(html)).toEqual(['k:def', 'f:f', 'k:return', 't:len', 'c:# size']);
  });

  it('keeps numbers as numbers, including a suffix', () => {
    expect(kinds(highlightCode('long x = 10L + 0x1F;', 'java'))).toEqual(['k:long', 'n:10L', 'n:0x1F']);
  });

  it('escapes the source, so a snippet cannot inject markup', () => {
    const html = highlightCode('List<Integer> a; // <b>x</b>', 'java');
    expect(html).not.toContain('<b>');
    expect(html).toContain('&lt;<span class="tok-t">Integer</span>&gt;');
    expect(html).toContain('&lt;b&gt;');
  });

  it('does not start a string inside a comment', () => {
    expect(kinds(highlightCode("# don't stop", 'python'))).toEqual(["c:# don't stop"]);
  });

  it('leaves an unknown language as plain escaped text', () => {
    expect(highlightCode('a < b', 'text')).toBe('a &lt; b');
  });
});

describe('one span per line', () => {
  it('wraps every line, tagged with its indentation, keeping empty lines', () => {
    expect(toLines('a\n    b\n\n  c')).toBe(
      '<span class="ln ln-0">a</span><span class="ln ln-4">    b</span>' +
        '<span class="ln ln-0"></span><span class="ln ln-2">  c</span>',
    );
  });

  it('closes and reopens a token that runs across a line break', () => {
    const html = toLines(highlightCode('/* one\n   two */ x', 'java'));
    expect(html).toBe(
      '<span class="ln ln-0"><span class="tok-c">/* one</span></span>' +
        '<span class="ln ln-3"><span class="tok-c">   two */</span> x</span>',
    );
  });
});
