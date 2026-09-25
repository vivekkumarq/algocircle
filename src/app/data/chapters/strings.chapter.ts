import { Chapter } from '../../core/models/chapter.models';

export const STRINGS: Chapter = {
  slug: 'strings',
  title: 'Strings',
  shortTitle: 'Strings',
  level: 'Core',
  order: 6,
  stage: 'strings',
  readingMinutes: 28,
  definition: {
    heading: 'What a string is',
    text:
      'A **string** is an array of characters, usually over a fixed alphabet and, in many languages, immutable — so every apparent edit builds a new string. Treating it as an array is what unlocks the techniques: the same two-pointer, window and frequency-count moves you use on numbers work on characters, plus a few tricks that only make sense when the alphabet is small.',
  },
  summary:
    'Character-level reasoning first — frequency, anagrams, palindromes — then the matching algorithms that beat the naive scan: rolling hash, KMP, Z and Manacher.',
  objectives: [
    'Compare strings by canonical form instead of by sorting every time',
    'Expand around centres to find palindromic substrings',
    'Explain why the naive pattern search is `O(n m)` and what KMP removes',
    'Build a rolling hash and know when it can be wrong',
    'Choose between hashing, KMP and Z for a matching problem',
  ],
  prerequisites: ['arrays'],
  sections: [
    {
      id: 'strings-are-arrays',
      title: 'A string is an array with rules',
      blocks: [
        {
          kind: 'callout',
          tone: 'note',
          title: 'In plain words',
          text: 'A string is just an array of characters, so everything from the arrays chapter still applies. What is new is that there are only 26 letters, which makes plain counting surprisingly powerful.',
        },
        {
          kind: 'para',
          text: 'Everything from the arrays chapter applies: indexing is `O(1)`, scanning is `O(n)`, two pointers work. The differences are immutability in some languages, and the fact that the alphabet is usually small — often just 26 letters — which makes frequency arrays extremely effective.',
        },
        {
          kind: 'table',
          headers: ['Operation', 'Cost', 'Note'],
          rows: [
            ['`s.charAt(i)`', '`O(1)`', 'plain index'],
            ['`s.length()`', '`O(1)`', 'stored, not counted'],
            ['`s + t`', '`O(n + m)`', 'builds a new string in Java and Python'],
            ['`s.substring(i, j)`', '`O(j - i)`', 'copies in modern Java'],
            ['`s.equals(t)`', '`O(n)`', 'compares character by character'],
            ['Sorting characters', '`O(n log n)`', 'often replaceable by counting'],
          ],
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'The accidental quadratic',
          text: 'Building a string with `+=` inside a loop copies everything built so far on every iteration. Use `StringBuilder` in Java, `join` in Python, or `+=` on a `std::string` in C++ where it is genuinely mutable.',
        },
      ],
    },
    {
      id: 'frequency',
      title: 'Counting characters',
      blocks: [
        {
          kind: 'para',
          text: 'When the alphabet is fixed, a 26-slot array beats a hash map: no hashing, no collisions, perfect cache behaviour, and comparing two counts is a fixed 26-step loop.',
        },
        {
          kind: 'visual',
          name: 'hash-buckets',
          caption:
            'Counting characters is the same lookup idea, with the character as the key.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Anagram check in O(n) rather than O(n log n)',
          source: `if (s.length() != t.length()) return false;

int[] count = new int[26];
for (int i = 0; i < s.length(); i++) {
    count[s.charAt(i) - 'a']++;
    count[t.charAt(i) - 'a']--;
}
for (int c : count) if (c != 0) return false;
return true;`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `if len(s) != len(t):
    return False

count = [0] * 26
for cs, ct in zip(s, t):
    count[ord(cs) - ord('a')] += 1
    count[ord(ct) - ord('a')] -= 1

return all(c == 0 for c in count)`,
        },
        {
          kind: 'para',
          text: 'To **group** anagrams you need a canonical form — one representative string that every anagram maps to. Sorted characters work, and so does the count vector rendered as a key, which avoids the sort entirely.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Grouping without sorting: the count itself is the key',
          source: `Map<String, List<String>> groups = new HashMap<>();
for (String word : words) {
    int[] count = new int[26];
    for (char c : word.toCharArray()) count[c - 'a']++;
    String key = Arrays.toString(count);
    groups.computeIfAbsent(key, k -> new ArrayList<>()).add(word);
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `from collections import defaultdict

groups = defaultdict(list)

for word in words:
    count = [0] * 26
    for c in word:
        count[ord(c) - ord('a')] += 1

    groups[tuple(count)].append(word)   # a tuple is hashable; a list is not`,
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'Canonical form is a reusable idea, not a string trick: map every member of an equivalence class to one representative, then group by it with a hash map.',
        },
      ],
    },
    {
      id: 'palindromes',
      title: 'Palindromes and expanding around centres',
      blocks: [
        {
          kind: 'para',
          text: 'Checking whether a string is a palindrome is two pointers moving inward. Finding the **longest palindromic substring** is different: every palindrome has a centre, so try all centres and expand outward while the characters match.',
        },
        {
          kind: 'visual',
          name: 'palindrome',
          caption:
            'Every character and every gap is a centre. Watch it try each one and keep the widest.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Expand around centre - O(n^2) time, O(1) space',
          source: `int best = 0, start = 0;
for (int centre = 0; centre < n; centre++) {
    expand(centre, centre);       // odd length,  aba
    expand(centre, centre + 1);   // even length, abba
}

void expand(int lo, int hi) {
    while (lo >= 0 && hi < n && s.charAt(lo) == s.charAt(hi)) { lo--; hi++; }
    int length = hi - lo - 1;     // the loop overshot by one on each side
    if (length > best) { best = length; start = lo + 1; }
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `best, start = 0, 0

def expand(lo: int, hi: int) -> None:
    global best, start

    while lo >= 0 and hi < len(s) and s[lo] == s[hi]:
        lo -= 1
        hi += 1

    length = hi - lo - 1               # the loop overshot by one on each side
    if length > best:
        best, start = length, lo + 1

for centre in range(len(s)):
    expand(centre, centre)             # odd length,  aba
    expand(centre, centre + 1)         # even length, abba`,
        },
        {
          kind: 'diagram',
          caption: 'There are 2n-1 centres: n characters and n-1 gaps between them.',
          art: `s =   a   b   a   b   a
      ^ ^ ^ ^ ^ ^ ^ ^ ^
      | | | | | | | | |
      char and gap centres alternate`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'Forgetting the even-length centres is the classic bug: `"abba"` has no single middle character, so a solution that only expands from characters silently returns `"bb"`.',
        },
        {
          kind: 'para',
          text: 'Manacher\'s algorithm reduces this to `O(n)` by reusing the mirror of previously computed palindromes. It is rarely required in interviews, but knowing that `O(n)` exists is worth a sentence when you present the `O(n^2)` solution.',
        },
      ],
    },
    {
      id: 'naive-search',
      title: 'Pattern matching, and why the naive way is slow',
      blocks: [
        {
          kind: 'para',
          text: 'Find pattern `p` (length `m`) inside text `t` (length `n`). The obvious approach tries every starting position and compares forward.',
        },
        {
          kind: 'visual',
          name: 'string-match',
          caption:
            'Switch between the naive scan and KMP and compare the comparison counts.',
        },
        {
          kind: 'code',
          language: 'pseudocode',
          source: `for start in 0 .. n-m:
    k = 0
    while k < m and t[start + k] == p[k]:
        k += 1
    if k == m: report a match at start`,
        },
        {
          kind: 'para',
          text: 'Usually this is fine. The worst case is not: with text `"aaaa...a"` and pattern `"aaa...ab"`, every start compares almost the whole pattern before failing, giving `O(n m)`.',
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'What is being wasted',
          text: 'After a mismatch the naive scan throws away everything it just learned and restarts one character later. Every fast algorithm below is a different way of keeping that information.',
        },
      ],
    },
    {
      id: 'rolling-hash',
      title: 'Rolling hash and Rabin-Karp',
      blocks: [
        {
          kind: 'para',
          text: 'Compare a fingerprint instead of the characters. Treat a string as a number in base `b` modulo a large prime; sliding the window one step costs `O(1)` instead of `O(m)`.',
        },
        {
          kind: 'figure',
          height: 208,
          label: 'A window over a string with one character leaving and one arriving',
          caption: 'The hash is updated, never recomputed — that is what makes it worth it.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">Drop the leading character, append the new one</text>
<rect x="70" y="34" width="64" height="42" rx="4" class="dg-muted" />
<text x="102" y="59.5" class="dg-t" text-anchor="middle">a</text>
<rect x="142" y="34" width="64" height="42" rx="4" class="dg-fill" />
<text x="174" y="59.5" class="dg-t" text-anchor="middle">b</text>
<rect x="214" y="34" width="64" height="42" rx="4" class="dg-fill" />
<text x="246" y="59.5" class="dg-t" text-anchor="middle">c</text>
<rect x="286" y="34" width="64" height="42" rx="4" class="dg-fill2" />
<text x="318" y="59.5" class="dg-on" text-anchor="middle">d</text>
<rect x="358" y="34" width="64" height="42" rx="4" class="dg-box" />
<text x="390" y="59.5" class="dg-t" text-anchor="middle">e</text>
<text x="102" y="96" class="dg-s" text-anchor="middle">leaves</text>
<text x="318" y="96" class="dg-s" text-anchor="middle">arrives</text>
<path class="dg-line" marker-end="url(#ah)" d="M102 92 L102 80" />
<path class="dg-line" marker-end="url(#ah)" d="M318 92 L318 80" />
<text x="310" y="136" class="dg-m" text-anchor="middle">hash = (hash − a · b^(m-1)) · b + d</text>
<text x="310" y="162" class="dg-s" text-anchor="middle">constant work per position, so the scan is O(n)</text>
<text x="0" y="196" class="dg-s" text-anchor="start">a match on the hash still needs a real comparison — hashes collide</text>`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Rolling the window forward by one character',
          source: `// hash of s[i..i+m-1] = s[i]*b^(m-1) + s[i+1]*b^(m-2) + ... + s[i+m-1]
hash = (hash - s.charAt(i) * power) % mod;   // drop the leading character
hash = (hash * b + s.charAt(i + m)) % mod;   // append the new one
if (hash < 0) hash += mod;`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `# hash of s[i..i+m-1] = s[i]*b^(m-1) + s[i+1]*b^(m-2) + ... + s[i+m-1]
hash = (hash - ord(s[i]) * power) % mod       # drop the leading character
hash = (hash * b + ord(s[i + m])) % mod       # append the new one

# Python's % already returns a non-negative result, so no fix-up is needed`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'Hashes can collide',
          text: 'Equal hashes do not prove equal strings. Verify a hit with a direct comparison, or use two independent moduli. A solution that reports matches on hash equality alone is wrong, and interviewers do ask.',
        },
        {
          kind: 'para',
          text: 'Expected cost is `O(n + m)`. The same rolling idea answers "is this substring repeated", "longest duplicate substring" (with binary search on the length) and fast substring comparison.',
        },
      ],
    },
    {
      id: 'kmp',
      title: 'KMP: never re-compare what you already matched',
      blocks: [
        {
          kind: 'para',
          text: 'KMP precomputes, for each prefix of the pattern, the length of the longest proper prefix that is also a suffix. On a mismatch it jumps the pattern forward by that amount instead of restarting, and the text pointer never moves backwards.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'The prefix function (failure table)',
          source: `int[] lps = new int[m];
int len = 0;
for (int i = 1; i < m; ) {
    if (p.charAt(i) == p.charAt(len)) lps[i++] = ++len;
    else if (len > 0) len = lps[len - 1];   // fall back, do not restart
    else lps[i++] = 0;
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `lps = [0] * m
length = 0
i = 1

while i < m:
    if p[i] == p[length]:
        length += 1
        lps[i] = length
        i += 1
    elif length > 0:
        length = lps[length - 1]      # fall back, do not restart
    else:
        lps[i] = 0
        i += 1`,
        },
        {
          kind: 'diagram',
          caption: 'For "ababaca", lps[i] is the longest prefix that is also a suffix of p[0..i].',
          art: `pattern:  a  b  a  b  a  c  a
index:    0  1  2  3  4  5  6
lps:      0  0  1  2  3  0  1

At i = 4 the prefix "aba" is also the suffix "aba", so lps[4] = 3.`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Search in O(n + m), with the text pointer never moving back',
          source: `int i = 0, j = 0;
while (i < n) {
    if (t.charAt(i) == p.charAt(j)) { i++; j++; }
    if (j == m) { report(i - j); j = lps[j - 1]; }
    else if (i < n && t.charAt(i) != p.charAt(j)) {
        if (j > 0) j = lps[j - 1];
        else i++;
    }
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `i = j = 0

while i < len(t):
    if t[i] == p[j]:
        i += 1
        j += 1

    if j == m:
        report(i - j)
        j = lps[j - 1]
    elif i < len(t) and t[i] != p[j]:
        if j > 0:
            j = lps[j - 1]
        else:
            i += 1`,
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'The prefix function is useful on its own: it answers "shortest string to append to make this a palindrome", "smallest repeating unit of a string", and periodicity questions.',
        },
      ],
    },
    {
      id: 'z-algorithm',
      title: 'The Z algorithm',
      blocks: [
        {
          kind: 'para',
          text: '`z[i]` is the length of the longest substring starting at `i` that matches a prefix of the string. It is often easier to reason about than KMP and solves the same problems.',
        },
        {
          kind: 'para',
          text: 'To search for `p` in `t`, build the Z array of `p + "#" + t`. Any position where `z[i] == m` is a match. The separator must be a character that appears in neither string.',
        },
        {
          kind: 'diagram',
          art: `s = a a b a a b
z = _ 1 0 3 1 0
        ^        z[3] = 3: "aab" starting at index 3 matches the prefix "aab"`,
        },
        {
          kind: 'compare',
          columns: [
            {
              title: 'Reach for KMP when',
              points: [
                'You need the prefix function itself (periods, borders).',
                'Streaming: the text arrives one character at a time.',
              ],
            },
            {
              title: 'Reach for Z or hashing when',
              points: [
                'You want the simplest correct code under time pressure.',
                'You need to compare arbitrary substrings, not just a fixed pattern (hashing).',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'checklist',
      title: 'A checklist for string problems',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Is the alphabet small and fixed? Use a frequency array, not a map.',
            'Am I comparing rearrangements? Find a **canonical form** and group by it.',
            'Does the problem say **substring**? That is contiguous — window or matching techniques.',
            'Does it say **subsequence**? That is order-preserving with gaps — usually dynamic programming.',
            'Am I building a string in a loop? Use a builder.',
            'Palindromes: expand around all `2n-1` centres, and remember the even case.',
            'Repeated substring search: rolling hash first, then verify matches.',
            'Have I handled empty strings, a single character, and case sensitivity?',
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'Most string questions are array questions with a small alphabet. Reach for counting and two pointers before reaching for a named algorithm — and when a named algorithm is needed, say why the naive scan is not good enough.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'A string is an array of characters; the small alphabet is what makes counting so effective.',
    'Canonical forms turn "are these rearrangements" into a hash-map grouping.',
    'Longest palindromic substring: expand around all `2n-1` centres, odd and even.',
    'The naive search is `O(n m)` because it discards what it learned on a mismatch.',
    'Rolling hash gives expected linear matching — always verify a hit before reporting it.',
    'KMP jumps using the longest prefix that is also a suffix, and never moves the text pointer back.',
    'The Z array answers the same questions and is often easier to derive under pressure.',
  ],
};
