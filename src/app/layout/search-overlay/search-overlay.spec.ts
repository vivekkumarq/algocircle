import { commandMatches } from './search-overlay';

describe('command palette matching', () => {
  const theme = {
    title: 'Switch to the light theme',
    detail: 'Every palette is in the Theme menu',
    also: 'theme dark light mode night',
  };

  it('matches every word of the query anywhere in the command', () => {
    expect(commandMatches('dark theme', theme)).toBe(true);
    expect(commandMatches('THEME', theme)).toBe(true);
    expect(commandMatches('night mode', theme)).toBe(true);
  });

  it('needs all of the words, not just one', () => {
    expect(commandMatches('dark roadmap', theme)).toBe(false);
  });

  it('matches nothing for an empty query', () => {
    expect(commandMatches('   ', theme)).toBe(false);
  });
});
