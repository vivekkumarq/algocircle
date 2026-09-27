import { richText } from './rich.pipe';

describe('rich text', () => {
  it('renders code and bold', () => {
    expect(richText('use `a[i]` **once**')).toBe('use <code>a[i]</code> <strong>once</strong>');
  });

  it('escapes everything else, including markup inside code', () => {
    expect(richText('<img src=x onerror=alert(1)> `<b>`')).toBe(
      '&lt;img src=x onerror=alert(1)&gt; <code>&lt;b&gt;</code>',
    );
  });

  it('leaves unpaired markers alone', () => {
    expect(richText('a ` b and 2 ** 3')).toBe('a ` b and 2 ** 3');
  });

  it('treats a missing value as empty', () => {
    expect(richText(undefined)).toBe('');
  });
});
