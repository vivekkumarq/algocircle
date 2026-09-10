import { Chapter } from '../../core/models/chapter.models';

export const MATHEMATICS: Chapter = {
  slug: 'mathematics',
  title: 'Mathematics for DSA',
  shortTitle: 'Mathematics',
  level: 'Foundations',
  order: 4,
  stage: 'mathematics',
  readingMinutes: 26,
  summary:
    'The number theory, combinatorics and bit tricks that turn brute-force problems into one-line formulas: GCD, primes, modular arithmetic, counting and XOR.',
  objectives: [
    'Compute GCD and LCM efficiently and explain why the Euclidean algorithm terminates',
    'Generate all primes up to a million with a sieve',
    'Work under a modulus without overflowing, including division by modular inverse',
    'Compute large powers in logarithmic time',
    'Use XOR properties to solve problems with no extra memory',
  ],
  prerequisites: ['complexity'],
  sections: [
    {
      id: 'divisibility',
      title: 'Divisibility, factors and multiples',
      blocks: [
        {
          kind: 'para',
          text: '`a` divides `b` when `b % a == 0`. Almost every number-theory problem is a question about divisors dressed up, so the first tool is finding them quickly.',
        },
        {
          kind: 'para',
          text: 'Divisors come in pairs: if `d` divides `n`, so does `n / d`. One of the pair is always at most the square root of `n`, so you only need to test up to `sqrt(n)`.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'All divisors of n in O(sqrt n)',
          source: `List<Integer> divisors = new ArrayList<>();
for (int d = 1; (long) d * d <= n; d++) {
    if (n % d == 0) {
        divisors.add(d);
        if (d != n / d) divisors.add(n / d);   // avoid adding sqrt(n) twice
    }
}`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'Write the loop condition as `(long) d * d <= n`, not `d <= Math.sqrt(n)`. The square root returns a floating-point value, and rounding at the boundary silently drops a divisor.',
        },
        {
          kind: 'diagram',
          caption: 'Divisor pairs of 36 mirror around the square root.',
          art: `n = 36,  sqrt(36) = 6

  1  x 36
  2  x 18
  3  x 12
  4  x  9
  6  x  6      <- the pivot; every pair below is a mirror of one above`,
        },
      ],
    },
    {
      id: 'gcd-lcm',
      title: 'GCD, LCM and the Euclidean algorithm',
      blocks: [
        {
          kind: 'para',
          text: 'The greatest common divisor of `a` and `b` is the largest number dividing both. Testing every candidate is `O(min(a, b))`. Euclid does it in `O(log min(a, b))` with one observation: **any common divisor of `a` and `b` also divides `a % b`**.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Two lines, logarithmic time',
          source: `int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}

long lcm(int a, int b) {
    return (long) a / gcd(a, b) * b;   // divide first, or you overflow
}`,
        },
        {
          kind: 'diagram',
          caption: 'gcd(48, 18): the remainder shrinks fast, which is where the log comes from.',
          art: `gcd(48, 18) -> 48 % 18 = 12
gcd(18, 12) -> 18 % 12 =  6
gcd(12,  6) -> 12 %  6 =  0
gcd( 6,  0) -> 6`,
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why it terminates quickly',
          text: 'After two steps the larger value is at least halved, so the number of steps is bounded by about `2 * log2(min(a, b))`. For values under a billion that is roughly sixty operations.',
        },
        {
          kind: 'list',
          items: [
            '`gcd(a, 0) = a`, which is the base case and also the identity you use when folding an array.',
            '`gcd(a, b) * lcm(a, b) = a * b`, which is where the LCM formula comes from.',
            'GCD of a whole array: fold it — `g = gcd(g, x)` for each element.',
            'Two numbers are **coprime** when their GCD is 1.',
          ],
        },
      ],
    },
    {
      id: 'primes',
      title: 'Primes and the sieve',
      blocks: [
        {
          kind: 'para',
          text: 'Testing one number for primality takes `O(sqrt n)`. Testing every number up to `n` that way is `O(n sqrt n)`, which is far too slow. The Sieve of Eratosthenes marks composites instead of testing them.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Single primality test',
          source: `boolean isPrime(int n) {
    if (n < 2) return false;
    if (n % 2 == 0) return n == 2;
    for (int d = 3; (long) d * d <= n; d += 2)
        if (n % d == 0) return false;
    return true;
}`,
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Sieve of Eratosthenes - all primes below n in about O(n log log n)',
          source: `boolean[] composite = new boolean[n + 1];
for (int p = 2; (long) p * p <= n; p++) {
    if (composite[p]) continue;
    for (int multiple = p * p; multiple <= n; multiple += p)
        composite[multiple] = true;      // start at p*p; smaller multiples are done
}`,
        },
        {
          kind: 'diagram',
          caption: 'Each prime crosses out its own multiples; the survivors are prime.',
          art: `2  3  4  5  6  7  8  9 10 11 12 13 14 15 16
p=2:      X     X     X     X     X     X     X
p=3:               X        X        X        (9, 12, 15)
survivors: 2 3 5 7 11 13`,
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'Whenever a problem asks about primes for many values, sieve once and answer in `O(1)` each. Storing the smallest prime factor during the sieve also gives you full factorisation in `O(log n)` per query.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Prime factorisation of a single number',
          source: `for (int d = 2; (long) d * d <= n; d++) {
    while (n % d == 0) { factors.add(d); n /= d; }
}
if (n > 1) factors.add(n);   // whatever remains is prime`,
        },
      ],
    },
    {
      id: 'modular',
      title: 'Modular arithmetic',
      blocks: [
        {
          kind: 'para',
          text: 'Problems ask for answers "modulo 10^9 + 7" because exact answers overflow long before the input is large. Taking the modulus at every step keeps values small, and the arithmetic still works — for addition, subtraction and multiplication.',
        },
        {
          kind: 'table',
          headers: ['Operation', 'Rule'],
          rows: [
            ['Addition', '`(a + b) % m = ((a % m) + (b % m)) % m`'],
            ['Subtraction', '`(a - b) % m = ((a % m) - (b % m) + m) % m`'],
            ['Multiplication', '`(a * b) % m = ((a % m) * (b % m)) % m`'],
            ['Division', 'not direct — multiply by the modular inverse'],
          ],
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'Two traps that cost marks',
          text: 'In Java and C++, `-3 % 5` is `-2`, not `3`. Add `m` before taking the modulus again. And multiply in 64-bit: `(int) a * (int) b` overflows before the modulus is ever applied.',
        },
        {
          kind: 'para',
          text: '`10^9 + 7` is chosen because it is prime and because the product of two values below it still fits in a signed 64-bit integer.',
        },
      ],
    },
    {
      id: 'fast-power',
      title: 'Fast exponentiation and modular inverse',
      blocks: [
        {
          kind: 'para',
          text: 'Computing `a^b` by multiplying `b` times is `O(b)`. Squaring repeatedly makes it `O(log b)`, using the identity `a^b = (a^(b/2))^2`, with one extra factor of `a` when `b` is odd.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Binary exponentiation under a modulus',
          source: `long power(long base, long exp, long mod) {
    long result = 1;
    base %= mod;
    while (exp > 0) {
        if ((exp & 1) == 1) result = result * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return result;
}`,
        },
        {
          kind: 'diagram',
          caption: '3^13: the binary form of the exponent picks which squares to multiply.',
          art: `13 = 1101 in binary

bit 0 (1): multiply by 3^1
bit 1 (0): skip 3^2
bit 2 (1): multiply by 3^4
bit 3 (1): multiply by 3^8

3^13 = 3^1 * 3^4 * 3^8`,
        },
        {
          kind: 'para',
          text: 'For a **prime** modulus `m`, Fermat\'s little theorem gives the modular inverse directly: `a^(m-2) mod m` behaves as division by `a`. That is what turns factorial-based combinatorics into modular arithmetic.',
        },
        {
          kind: 'code',
          language: 'java',
          source: `long inverse(long a, long mod) {   // mod must be prime
    return power(a, mod - 2, mod);
}`,
        },
      ],
    },
    {
      id: 'combinatorics',
      title: 'Counting: permutations and combinations',
      blocks: [
        {
          kind: 'table',
          headers: ['Question', 'Formula', 'Meaning'],
          rows: [
            ['Arrange all n items', '`n!`', 'order matters, use everything'],
            ['Arrange r of n', '`n! / (n-r)!`', 'order matters, pick r'],
            ['Choose r of n', '`n! / (r! (n-r)!)`', 'order does not matter'],
            ['Subsets of a set', '`2^n`', 'each element is in or out'],
            ['Sequences of length r from k symbols', '`k^r`', 'repetition allowed'],
          ],
        },
        {
          kind: 'para',
          text: 'The identity `C(n, r) = C(n-1, r-1) + C(n-1, r)` says: either the last item is chosen or it is not. That single line is both Pascal\'s triangle and your first DP recurrence.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: "Pascal's triangle - every binomial coefficient up to n, no division needed",
          source: `long[][] c = new long[n + 1][n + 1];
for (int i = 0; i <= n; i++) {
    c[i][0] = 1;
    for (int j = 1; j <= i; j++)
        c[i][j] = (c[i - 1][j - 1] + c[i - 1][j]) % MOD;
}`,
        },
        {
          kind: 'check',
          question: 'Why does `2^n` count subsets?',
          answer: 'Each of the `n` elements is independently either in the subset or out of it, giving two choices per element and `2 * 2 * ... * 2 = 2^n` combinations. This is also why bitmasks and subsets go together: an `n`-bit number is exactly one subset.',
        },
      ],
    },
    {
      id: 'logs',
      title: 'Logarithms, and why they appear everywhere',
      blocks: [
        {
          kind: 'para',
          text: '`log_b(n)` answers "how many times can I divide `n` by `b` before reaching 1". Any algorithm that repeatedly halves its work has a logarithm in its complexity, which is why `log` shows up in binary search, balanced trees, heaps and divide and conquer.',
        },
        {
          kind: 'table',
          headers: ['n', 'log2(n)', 'Meaning'],
          rows: [
            ['16', '4', '4 halvings'],
            ['1,024', '10', ''],
            ['1,000,000', '~20', 'a million items, twenty comparisons'],
            ['1,000,000,000', '~30', 'a billion items, thirty comparisons'],
          ],
        },
        {
          kind: 'callout',
          tone: 'note',
          text: 'The base is irrelevant in Big-O, because changing base only multiplies by a constant. `log2 n`, `log10 n` and `ln n` are all `O(log n)`.',
        },
      ],
    },
    {
      id: 'bits',
      title: 'Bit manipulation basics',
      blocks: [
        {
          kind: 'para',
          text: 'Numbers are binary underneath, and reading them that way makes some problems trivial.',
        },
        {
          kind: 'table',
          headers: ['Goal', 'Expression'],
          rows: [
            ['Test bit `i`', '`(n >> i) & 1`'],
            ['Set bit `i`', '`n | (1 << i)`'],
            ['Clear bit `i`', '`n & ~(1 << i)`'],
            ['Toggle bit `i`', '`n ^ (1 << i)`'],
            ['Is `n` a power of two', '`n > 0 && (n & (n - 1)) == 0`'],
            ['Remove the lowest set bit', '`n & (n - 1)`'],
            ['Isolate the lowest set bit', '`n & -n`'],
            ['Multiply / divide by 2', '`n << 1` / `n >> 1`'],
            ['Is `n` odd', '`(n & 1) == 1`'],
          ],
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why `n & (n - 1)` clears the lowest set bit',
          text: 'Subtracting one flips the lowest set bit to 0 and turns every zero below it into 1. Anding the two keeps only the bits above, so counting set bits becomes a loop that runs once per set bit rather than once per bit.',
        },
      ],
    },
    {
      id: 'xor',
      title: 'XOR: the operator worth knowing properly',
      blocks: [
        {
          kind: 'para',
          text: 'XOR returns 1 when exactly one input is 1. Four properties make it a problem-solving tool rather than a curiosity.',
        },
        {
          kind: 'list',
          items: [
            '`a ^ a = 0` — a value cancels itself.',
            '`a ^ 0 = a` — zero is the identity.',
            'It is **commutative and associative**, so order does not matter.',
            'It is its own inverse: `a ^ b ^ b = a`.',
          ],
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Every value appears twice except one - find it in O(n) time, O(1) space',
          source: `int result = 0;
for (int value : a) result ^= value;
return result;   // pairs cancel, the lone value survives`,
        },
        {
          kind: 'para',
          text: 'The same cancellation gives you the missing number in `0..n`, swapping two variables without a temporary, and prefix XOR for subarray questions — `xor[l..r] = prefix[r] ^ prefix[l-1]`, exactly like prefix sums.',
        },
        {
          kind: 'check',
          question: 'Every value appears twice except two. How do you find both in linear time and constant space?',
          answer: 'XOR everything: the result is `x ^ y` for the two unique values. Any set bit in it is a bit where `x` and `y` differ, so take the lowest set bit with `d = r & -r`, split the array into elements with that bit set and not set, and XOR each group separately.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'Divisors pair around the square root, so testing up to `sqrt(n)` finds all of them.',
    'Euclid computes GCD in logarithmic time; LCM follows from `gcd * lcm = a * b`.',
    'Sieve once to answer many prime questions; store smallest prime factors to factorise fast.',
    'Under a modulus, take the remainder at every step, fix negative remainders, and multiply in 64-bit.',
    'Binary exponentiation gives large powers in `O(log b)` — and the modular inverse for a prime modulus.',
    "`C(n,r) = C(n-1,r-1) + C(n-1,r)` is both Pascal's triangle and your first recurrence.",
    'A logarithm counts halvings, which is why it appears in every divide-and-conquer cost.',
    'XOR cancels duplicates, is order independent, and is its own inverse.',
  ],
};
