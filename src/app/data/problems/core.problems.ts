import { WorkedProblem } from './problem.model';

export const CORE_PROBLEMS: WorkedProblem[] = [
  // ---------------------------------------------------------------- foundations
  {
    slug: 'swap-without-temp',
    title: 'Swap two values without a third variable',
    topic: 'foundations',
    pattern: 'bit-manipulation',
    difficulty: 'Easy',
    statement: 'Given two integer variables, exchange their contents without declaring any extra variable.',
    example: { input: 'a = 5, b = 9', output: 'a = 9, b = 5' },
    hints: [
      'Arithmetic can encode both values in one variable temporarily.',
      'XOR is its own inverse: `x ^ y ^ y` gives back `x`.',
      'What happens if both names refer to the same storage?',
    ],
    bruteForce: { idea: 'Use a temporary variable. Perfectly fine in real code — the puzzle is the constraint.', complexity: 'O(1)' },
    optimal: {
      idea: 'XOR three times. Each step keeps enough information to recover both values, because XOR cancels on repetition.',
      complexity: 'O(1) time, O(1) space',
      language: 'java',
      code: `a = a ^ b;
b = a ^ b;   // (a^b)^b == a
a = a ^ b;   // (a^b)^a == b`,
    },
    insight: 'It breaks when both sides are the same variable — `a ^ a` is zero, wiping the value. That edge case is the actual point of the question.',
  },
  {
    slug: 'count-digits',
    title: 'Count the digits of an integer',
    topic: 'foundations',
    pattern: 'bit-manipulation',
    difficulty: 'Easy',
    statement: 'Return how many decimal digits an integer has. Handle negatives and zero.',
    example: { input: 'n = -4025', output: '4' },
    hints: [
      'Repeated division by ten removes one digit each time.',
      'Zero has one digit but the loop would run zero times.',
      'What is the largest negative int, and what happens when you negate it?',
    ],
    bruteForce: { idea: 'Convert to a string and take its length, subtracting one for a minus sign.', complexity: 'O(d)' },
    optimal: {
      idea: 'Divide by ten until nothing remains, counting the steps. Handle zero explicitly and use a 64-bit value so negating the minimum int does not overflow.',
      complexity: 'O(d) time, O(1) space',
      language: 'java',
      code: `long value = Math.abs((long) n);
if (value == 0) return 1;

int digits = 0;
while (value > 0) { digits++; value /= 10; }
return digits;`,
    },
    insight: 'Two edge cases carry the whole question: zero, and `Integer.MIN_VALUE`, whose absolute value does not fit in an int.',
  },
  {
    slug: 'reverse-array-in-place',
    title: 'Reverse an array in place',
    topic: 'foundations',
    pattern: 'two-pointers',
    difficulty: 'Easy',
    statement: 'Reverse the order of an array without allocating a second one.',
    example: { input: '[1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]' },
    hints: [
      'Which pairs of positions need to exchange?',
      'Both ends move toward each other.',
      'When should the loop stop for an odd length?',
    ],
    bruteForce: { idea: 'Build a new array by reading the original backwards, then copy it back.', complexity: 'O(n) time, O(n) space' },
    optimal: {
      idea: 'Swap the two ends and move inward. Stopping at the midpoint is enough — a middle element in an odd-length array stays where it is.',
      complexity: 'O(n) time, O(1) space',
      language: 'java',
      code: `int lo = 0, hi = a.length - 1;
while (lo < hi) {
    int temp = a[lo]; a[lo] = a[hi]; a[hi] = temp;
    lo++; hi--;
}`,
    },
    insight: 'Writing `lo < hi` rather than `lo <= hi` avoids a pointless self-swap at the centre, and is the same boundary you will use everywhere else.',
  },
  {
    slug: 'fizz-trace',
    title: 'Predict the output without running it',
    topic: 'foundations',
    pattern: 'hashing',
    difficulty: 'Easy',
    statement: 'Given a short nested loop, state exactly what it prints and how many times the body executes — before running it.',
    example: { input: 'for i in 0..3: for j in i..3: print(i, j)', output: '10 lines', note: '4 + 3 + 2 + 1' },
    hints: [
      'How many times does the inner loop run for each value of the outer one?',
      'Add those counts up rather than simulating.',
      'Does that sum have a closed form?',
    ],
    bruteForce: { idea: 'Run it and count. Fine for a small case, useless for reasoning about `n`.', complexity: 'O(n²)' },
    optimal: {
      idea: 'The inner loop runs `n - i` times for each `i`, so the total is `n + (n-1) + ... + 1 = n(n+1)/2`. That is the standard triangular count behind every "all pairs" loop.',
      complexity: 'O(n²) iterations',
      language: 'text',
      code: `i = 0 -> 4 iterations
i = 1 -> 3
i = 2 -> 2
i = 3 -> 1
total  = 4+3+2+1 = 10 = n(n+1)/2`,
    },
    insight: 'Hand-tracing is not a beginner crutch — it is how you cost a loop without running it, and it is the same skill as complexity analysis.',
  },

  // ---------------------------------------------------------------- complexity
  {
    slug: 'classify-loops',
    title: 'Give the complexity of four loops',
    topic: 'complexity',
    pattern: 'binary-search',
    difficulty: 'Easy',
    statement: 'For each snippet, state the time complexity and justify it in one sentence.',
    example: { input: 'while (i < n) i *= 2;', output: 'O(log n)', note: 'i doubles, so it reaches n after log2(n) steps' },
    hints: [
      'Sequential blocks add; nested loops multiply.',
      'A variable that doubles or halves gives a logarithm.',
      'An inner loop from `i` to `n` still averages `n/2` iterations.',
    ],
    bruteForce: { idea: 'Time it with a stopwatch. That measures your machine, not the algorithm.', complexity: 'unusable' },
    optimal: {
      idea: 'Count operations as a function of `n`, drop constants and lower-order terms, then name the growth class.',
      complexity: 'analysis, not code',
      language: 'text',
      code: `for i in 0..n: work()                 -> O(n)
for i in 0..n: for j in 0..n: work()  -> O(n^2)
for i in 0..n: for j in i..n: work()  -> O(n^2)   (n^2/2)
i = 1; while i < n: i *= 2            -> O(log n)`,
    },
    insight: 'The third one catches people: half of `n²` is still `n²`, because constants are dropped.',
  },
  {
    slug: 'amortised-append',
    title: 'Why is appending to a dynamic array O(1)?',
    topic: 'complexity',
    pattern: 'prefix-sum',
    difficulty: 'Medium',
    statement: 'A dynamic array sometimes allocates a bigger block and copies everything. Explain why an append is still described as constant time.',
    example: { input: 'n appends into an empty list', output: 'fewer than 2n copies in total' },
    hints: [
      'How often does a resize actually happen?',
      'Write down the sizes at which copying occurs.',
      'Sum that series.',
    ],
    bruteForce: { idea: 'Claim it is O(n) because of the copy. That is the worst case of one operation, not the cost per operation.', complexity: 'O(n) worst single op' },
    optimal: {
      idea: 'Capacity doubles, so copies happen at 1, 2, 4, 8 … and total `1 + 2 + 4 + … < 2n` across `n` appends. Spread over `n` operations that is constant each — the amortised cost.',
      complexity: 'O(1) amortised',
      language: 'text',
      code: `appends:   1  2  3  4  5  6  7  8
capacity:  1  2  4  4  8  8  8  8
copies:    -  1  2  -  4  -  -  -

total copies < 2n  ->  O(1) per append`,
    },
    insight: 'Growing by a fixed amount instead of doubling would make `n` appends O(n²). The doubling is what makes the series converge.',
  },
  {
    slug: 'constraints-to-approach',
    title: 'Read the constraint, name the approach',
    topic: 'complexity',
    pattern: 'binary-search-on-answer',
    difficulty: 'Medium',
    statement: 'Given only the input limits, state which complexities can pass and which techniques typically reach them.',
    example: { input: 'n <= 200000', output: 'O(n) or O(n log n)', note: 'sorting, hashing, two pointers, a window, binary search' },
    hints: [
      'Assume roughly 10^8 simple operations per second.',
      'Work out what n² would cost at that limit.',
      'Small n with a large answer usually means exponential is intended.',
    ],
    bruteForce: { idea: 'Write something, submit, and see if it times out. Slow and uninformative.', complexity: 'n/a' },
    optimal: {
      idea: 'Turn the limit into an operation budget first, then pick from the techniques that fit it. This narrows the search before you have had an idea.',
      complexity: 'analysis',
      language: 'text',
      code: `n <= 10       -> O(n!)        permutations
n <= 20       -> O(2^n)       subsets, bitmask DP
n <= 500      -> O(n^3)       Floyd-Warshall, interval DP
n <= 5000     -> O(n^2)       classic 2D DP
n <= 10^5     -> O(n log n)   sort, heap, window, binary search
n <= 10^9     -> O(log n)     maths, binary search on the answer`,
    },
    insight: 'Constraints are a hint, not decoration. Reading them first often tells you the technique before you understand the problem.',
  },
  {
    slug: 'recursion-cost',
    title: 'Cost a recursive function from its tree',
    topic: 'complexity',
    pattern: 'divide-and-conquer',
    difficulty: 'Medium',
    statement: 'Given a recursive function, derive its time complexity by drawing the recursion tree rather than guessing.',
    example: { input: 'T(n) = 2T(n/2) + O(n)', output: 'O(n log n)' },
    hints: [
      'How much work happens at each level of the tree, in total?',
      'How many levels are there?',
      'Multiply those two.',
    ],
    bruteForce: { idea: 'Guess from the shape of the code. Works until two recursive calls appear.', complexity: 'unreliable' },
    optimal: {
      idea: 'Nodes times work per node. Each level of `2T(n/2) + O(n)` does `O(n)` in total and there are `log n` levels, so the answer is `O(n log n)`.',
      complexity: 'analysis',
      language: 'text',
      code: `T(n) = T(n/2) + O(1)    -> O(log n)     binary search
T(n) = T(n/2) + O(n)    -> O(n)         quickselect, average
T(n) = 2T(n/2) + O(1)   -> O(n)         tree traversal
T(n) = 2T(n/2) + O(n)   -> O(n log n)   merge sort
T(n) = T(n-1) + O(n)    -> O(n^2)       selection sort
T(n) = 2T(n-1) + O(1)   -> O(2^n)       naive Fibonacci`,
    },
    insight: 'If the tree shows the same subproblem more than once, you have not found the complexity — you have found the memoisation.',
  },

  // --------------------------------------------------------------- mathematics
  {
    slug: 'gcd-of-array',
    title: 'GCD of a whole array',
    topic: 'mathematics',
    pattern: 'divide-and-conquer',
    difficulty: 'Easy',
    statement: 'Return the greatest common divisor of every value in an array.',
    example: { input: '[12, 18, 30]', output: '6' },
    hints: [
      'GCD of three numbers is the GCD of the first two, combined with the third.',
      '`gcd(a, 0) = a`, which makes a useful starting value.',
      'Can you stop early?',
    ],
    bruteForce: { idea: 'Try every candidate from the smallest value downwards and test whether it divides everything.', complexity: 'O(n · min)' },
    optimal: {
      idea: 'Fold the array with Euclid. GCD is associative, so combining pairwise left to right gives the GCD of the whole set.',
      complexity: 'O(n log max) time, O(1) space',
      language: 'java',
      code: `int result = 0;                       // gcd(a, 0) = a
for (int value : a) {
    result = gcd(result, value);
    if (result == 1) break;           // cannot get smaller
}
return result;

int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }`,
    },
    insight: 'Folding with an identity element turns a "whole collection" question into a two-argument one. The same trick works for XOR, min, max and LCM.',
  },
  {
    slug: 'count-primes',
    title: 'Count primes below n',
    topic: 'mathematics',
    pattern: 'frequency-counting',
    difficulty: 'Medium',
    statement: 'Return how many prime numbers are strictly less than a given `n`, where `n` can be up to a few million.',
    example: { input: 'n = 30', output: '10', note: '2, 3, 5, 7, 11, 13, 17, 19, 23, 29' },
    hints: [
      'Testing each number separately repeats an enormous amount of work.',
      'Instead of testing, eliminate: each prime rules out its own multiples.',
      'Where can the inner loop safely start?',
    ],
    bruteForce: { idea: 'Test each number for primality by trial division up to its square root.', complexity: 'O(n · sqrt n)' },
    optimal: {
      idea: 'Sieve of Eratosthenes. Mark multiples of each prime, starting at `p * p` because every smaller multiple already has a smaller prime factor.',
      complexity: 'O(n log log n) time, O(n) space',
      language: 'java',
      code: `boolean[] composite = new boolean[n];
int count = 0;

for (int p = 2; p < n; p++) {
    if (composite[p]) continue;
    count++;
    for (long m = (long) p * p; m < n; m += p) composite[(int) m] = true;
}
return count;`,
    },
    insight: 'Starting the inner loop at `p * p` rather than `2p` is not a micro-optimisation — it is why the total work collapses to nearly linear.',
  },
  {
    slug: 'power-mod',
    title: 'Compute a^b mod m for huge b',
    topic: 'mathematics',
    pattern: 'divide-and-conquer',
    difficulty: 'Medium',
    statement: 'Compute `a` raised to the power `b`, modulo `m`, where `b` can be as large as 10^18.',
    example: { input: 'a = 3, b = 13, m = 1000000007', output: '1594323' },
    hints: [
      'Multiplying `b` times is impossible at that size.',
      '`a^b = (a^(b/2))²`, with one extra factor when `b` is odd.',
      'Which bits of `b` decide what gets multiplied in?',
    ],
    bruteForce: { idea: 'Multiply in a loop `b` times, taking the modulus each step.', complexity: 'O(b) — impossible' },
    optimal: {
      idea: 'Binary exponentiation: square the base repeatedly and multiply into the result wherever a bit of the exponent is set. That is one step per bit.',
      complexity: 'O(log b) time, O(1) space',
      language: 'java',
      code: `long result = 1;
base %= mod;
while (exp > 0) {
    if ((exp & 1) == 1) result = result * base % mod;
    base = base * base % mod;
    exp >>= 1;
}
return result;`,
    },
    insight: 'The same routine gives the modular inverse for a prime modulus: `a^(m-2) mod m` behaves as division by `a`.',
  },
  {
    slug: 'single-number',
    title: 'Every value appears twice except one',
    topic: 'mathematics',
    pattern: 'bit-manipulation',
    difficulty: 'Easy',
    statement: 'Every element of an array appears exactly twice, except one that appears once. Find it using constant extra space.',
    example: { input: '[4, 1, 2, 1, 2]', output: '4' },
    hints: [
      'A hash map solves it, but uses O(n) memory.',
      'Is there an operation where a value cancels itself?',
      'Does the order of that operation matter?',
    ],
    bruteForce: { idea: 'Count occurrences in a hash map, then scan for the one with a count of 1.', complexity: 'O(n) time, O(n) space' },
    optimal: {
      idea: 'XOR everything. Because `x ^ x = 0` and XOR is commutative, all pairs cancel regardless of order and only the lone value survives.',
      complexity: 'O(n) time, O(1) space',
      language: 'java',
      code: `int result = 0;
for (int value : a) result ^= value;
return result;`,
    },
    insight: 'The extension is the real interview question: with two unique values, XOR everything, take any set bit of the result to split the array, and XOR each half separately.',
  },
];
