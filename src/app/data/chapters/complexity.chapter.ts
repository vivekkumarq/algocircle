import { Chapter } from '../../core/models/chapter.models';

export const COMPLEXITY: Chapter = {
  slug: 'complexity',
  title: 'Complexity Analysis',
  shortTitle: 'Complexity',
  level: 'Foundations',
  order: 3,
  stage: 'complexity',
  readingMinutes: 28,
  definition: {
    heading: 'What complexity analysis is',
    text:
      '**Complexity analysis** describes how the work an algorithm does grows as its input grows, ignoring constants and machine speed. **Big-O** is the notation for it: `O(n)` means the work grows in proportion to the input, `O(n^2)` means doubling the input quadruples the work. It is the one tool that lets you predict whether code will finish before you run it.',
  },
  summary:
    'How to predict the cost of code before running it: Big-O and its siblings, the four rules that cover most analysis, amortised cost, recurrences, and reading the constraints to decide what you are allowed to write.',
  objectives: [
    'Give the time and space complexity of a piece of code and justify it',
    'Distinguish best, average and worst case, and say which one matters',
    'Explain why a dynamic array append is O(1) even though it sometimes copies everything',
    'Solve a simple recurrence with a recursion tree',
    'Read a constraint like `n <= 10^5` and name the complexities that will pass',
  ],
  prerequisites: ['foundations'],
  sections: [
    {
      id: 'what-we-measure',
      title: 'What we measure, and why not seconds',
      blocks: [
        {
          kind: 'callout',
          tone: 'note',
          title: 'In plain words',
          text: 'This chapter teaches you to work out, before running anything, whether your code will finish in a second or in three hours. You are not measuring time — you are counting roughly how many steps it takes as the input gets bigger.',
        },
        {
          kind: 'figure',
          height: 188,
          label: 'Seconds compared with a count of steps as a measure of cost',
          caption: 'This is why the whole subject counts operations instead of timing them.',
          body: `<defs>
  <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
  </marker>
</defs>
<text x="0" y="18" class="dg-s" text-anchor="start">Seconds describe a machine; growth describes the algorithm</text>
<rect x="40" y="40" width="240" height="100" rx="6" class="dg-muted" />
<text x="160" y="68" class="dg-t" text-anchor="middle">measured in seconds</text>
<text x="160" y="94" class="dg-s" text-anchor="middle">changes with the laptop,</text>
<text x="160" y="114" class="dg-s" text-anchor="middle">the language, the mood</text>
<rect x="340" y="40" width="240" height="100" rx="6" class="dg-fill" />
<text x="460" y="68" class="dg-t" text-anchor="middle">counted in steps</text>
<text x="460" y="94" class="dg-s" text-anchor="middle">same answer everywhere,</text>
<text x="460" y="114" class="dg-s" text-anchor="middle">and it predicts</text>
<text x="0" y="176" class="dg-s" text-anchor="start">a faster machine shifts the line down; a better algorithm changes its shape</text>`,
        },
        {
          kind: 'para',
          text: 'Timing a program with a stopwatch tells you about your laptop, your compiler, the current CPU temperature and what else was running. None of that transfers. So instead of seconds we count **elementary operations as a function of the input size**, which is a property of the algorithm itself.',
        },
        {
          kind: 'para',
          text: 'An elementary operation is anything that takes a fixed amount of time regardless of input size: an arithmetic operation, a comparison, an assignment, an array index, a function call.',
        },
        {
          kind: 'code',
          language: 'pseudocode',
          caption: 'Counting exactly, before simplifying',
          source: `sum = 0                 // 1 operation
for i in 0 .. n-1:      // n iterations
    sum = sum + a[i]    //   2 operations each (index + add)
return sum              // 1 operation

total = 2n + 2`,
        },
        {
          kind: 'para',
          text: 'We then throw away the `2` and the `+2`, and call this `O(n)`. That is not laziness — the next section explains why the discarded parts genuinely cannot matter.',
        },
      ],
    },
    {
      id: 'big-o',
      title: 'Big-O, Big-Omega, Big-Theta',
      blocks: [
        {
          kind: 'para',
          text: 'Big-O describes an **upper bound on growth**. Formally: `f(n) = O(g(n))` if there exist positive constants `c` and `n0` such that `f(n) <= c * g(n)` for every `n >= n0`.',
        },
        {
          kind: 'para',
          text: 'Read it in plain language: past some input size, `f` never grows faster than `g` scaled by a constant. The `n0` is why small inputs are ignored, and the `c` is why constant factors are ignored.',
        },
        {
          kind: 'table',
          headers: ['Notation', 'Meaning', 'Everyday phrasing'],
          rows: [
            ['`O(g)`', 'grows no faster than g', 'at most, the ceiling'],
            ['`Omega(g)`', 'grows at least as fast as g', 'at least, the floor'],
            ['`Theta(g)`', 'both bounds hold, so the growth matches g', 'exactly, up to constants'],
          ],
        },
        {
          kind: 'para',
          text: 'Strictly, an algorithm that always takes exactly `n` steps is `Theta(n)`, and saying it is `O(n^2)` is also true but useless. In practice everyone says "O" and means the tight bound; just be aware of what you are claiming when someone asks you to be precise.',
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why constants are dropped',
          text: 'Constants depend on the machine, the language and the compiler — exactly the things we are trying to abstract away. Growth rate does not. Between `1000n` and `n^2`, the quadratic wins as soon as `n > 1000`, and inputs cross that line all the time.',
        },
      ],
    },
    {
      id: 'growth-rates',
      title: 'The growth rates you will actually meet',
      blocks: [
        {
          kind: 'table',
          caption: 'Ordered from best to worst. Almost everything you write will be in the first six rows.',
          headers: ['Complexity', 'Name', 'A typical cause'],
          rows: [
            ['`O(1)`', 'constant', 'array index, hash lookup, arithmetic, stack push'],
            ['`O(log n)`', 'logarithmic', 'binary search, balanced tree operation, heap push'],
            ['`O(n)`', 'linear', 'one pass over the input, hash-map counting'],
            ['`O(n log n)`', 'linearithmic', 'sorting; a loop doing a log-time operation each step'],
            ['`O(n^2)`', 'quadratic', 'nested loop over the same data, all pairs'],
            ['`O(n^3)`', 'cubic', 'triple loop, naive matrix multiply, Floyd-Warshall'],
            ['`O(2^n)`', 'exponential', 'enumerate every subset'],
            ['`O(n!)`', 'factorial', 'enumerate every permutation'],
          ],
        },
        {
          kind: 'visual',
          name: 'big-o',
          caption:
            'Where each growth rate ends up as the input grows.',
        },
        {
          kind: 'diagram',
          caption: 'Shape matters more than any constant you can tune.',
          art: `operations
   ^
   |                                   n^2
   |                                 .
   |                              .
   |                           .            n log n
   |                       .        _ - -
   |                  .    _ -                        n
   |            . _ -              _ _ _ _ _ _ _ _ _ _
   |      _ .-  _ _ _ _ _ _ _ _ _ _
   |  _ - _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ log n
   +--------------------------------------------------> n`,
        },
        {
          kind: 'callout',
          tone: 'key',
          text: '`log n` is tiny. For a billion items, `log2(n)` is about 30. Turning a linear scan into a logarithmic one is usually the single biggest win available, and it is why sorted data and balanced trees matter so much.',
        },
      ],
    },
    {
      id: 'rules',
      title: 'Four rules that cover most analysis',
      blocks: [
        {
          kind: 'steps',
          items: [
            {
              title: 'Sequential blocks add, so the largest wins',
              text: 'A loop of `n` followed by a loop of `n^2` is `O(n + n^2) = O(n^2)`. Lower-order terms are absorbed.',
            },
            {
              title: 'Nested loops multiply',
              text: 'A loop of `n` containing a loop of `m` is `O(n * m)`. If both range over the same data, that is `O(n^2)`.',
            },
            {
              title: 'Constants disappear',
              text: '`O(3n)` is `O(n)`; `O(n/2)` is `O(n)`. Three passes over the data is still linear.',
            },
            {
              title: 'Halving the work gives a log',
              text: 'If each step discards a fixed fraction of what is left, the number of steps is `O(log n)`.',
            },
          ],
        },
        {
          kind: 'heading',
          text: 'Worked examples',
        },
        {
          kind: 'code',
          language: 'pseudocode',
          caption: 'O(n^2) - the inner loop runs a number of times proportional to n',
          source: `for i in 0 .. n-1:
    for j in 0 .. n-1:
        work()`,
        },
        {
          kind: 'code',
          language: 'pseudocode',
          caption: 'Still O(n^2) - half of n^2 is n^2/2, and constants are dropped',
          source: `for i in 0 .. n-1:
    for j in i+1 .. n-1:
        work()`,
        },
        {
          kind: 'code',
          language: 'pseudocode',
          caption: 'O(log n) - i doubles, so it reaches n after about log2(n) steps',
          source: `i = 1
while i < n:
    work()
    i = i * 2`,
        },
        {
          kind: 'code',
          language: 'pseudocode',
          caption: 'O(n log n) - a linear loop, each iteration doing log-time work',
          source: `for i in 0 .. n-1:
    binary_search(a, x)`,
        },
        {
          kind: 'check',
          question: 'Two separate loops over the same array, one after the other. Is that `O(n^2)`?',
          answer: 'No — they are sequential, not nested, so it is `O(n) + O(n) = O(n)`. Nesting is what multiplies; sequencing only adds.',
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'Hidden loops',
          text: 'A library call inside your loop can carry its own cost. `list.contains(x)` on an array list is `O(n)`, `substring` may copy, and `insert(0, x)` shifts everything. A loop that looks linear becomes quadratic through a single innocuous call.',
        },
      ],
    },
    {
      id: 'cases',
      title: 'Best, average and worst case',
      blocks: [
        {
          kind: 'para',
          text: 'The same algorithm can cost different amounts on different inputs of the same size.',
        },
        {
          kind: 'table',
          headers: ['Algorithm', 'Best', 'Average', 'Worst'],
          rows: [
            ['Linear search', '`O(1)` (first element)', '`O(n)`', '`O(n)` (absent)'],
            ['Binary search', '`O(1)` (middle)', '`O(log n)`', '`O(log n)`'],
            ['Quick sort', '`O(n log n)`', '`O(n log n)`', '`O(n^2)` (bad pivots)'],
            ['Merge sort', '`O(n log n)`', '`O(n log n)`', '`O(n log n)`'],
            ['Hash map lookup', '`O(1)`', '`O(1)`', '`O(n)` (all keys collide)'],
          ],
        },
        {
          kind: 'para',
          text: 'Unless told otherwise, **quote the worst case**. It is the only guarantee, and it is what an interviewer expects when they ask "what is the complexity". Mention the average when it differs and matters, as with quick sort and hash maps.',
        },
        {
          kind: 'callout',
          tone: 'note',
          text: 'Quick sort is used in practice despite its quadratic worst case because random or median-of-three pivots make that case vanishingly unlikely, and its constant factors and cache behaviour beat merge sort. Real choices weigh more than the worst-case symbol.',
        },
      ],
    },
    {
      id: 'space',
      title: 'Space complexity',
      blocks: [
        {
          kind: 'para',
          text: 'Space complexity counts the **extra** memory an algorithm needs beyond the input itself — auxiliary space. The input is usually excluded, since you had to be given it either way.',
        },
        {
          kind: 'table',
          headers: ['Pattern', 'Auxiliary space'],
          rows: [
            ['A few counters and indices', '`O(1)`'],
            ['A hash map of every distinct element', '`O(n)`'],
            ['Merge sort', '`O(n)` for the merge buffer'],
            ['Recursion `n` levels deep', '`O(n)` for stack frames'],
            ['Balanced-tree recursion', '`O(log n)` for stack frames'],
            ['A 2D DP table over two dimensions', '`O(n * m)`, often reducible to `O(m)`'],
          ],
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'Recursion is not free',
          text: 'A recursive solution with no allocations still uses `O(depth)` stack space. Saying "constant space" about a recursive DFS on a skewed tree is wrong, and it is a favourite follow-up question.',
        },
      ],
    },
    {
      id: 'amortised',
      title: 'Amortised analysis: the doubling array',
      blocks: [
        {
          kind: 'para',
          text: 'Appending to a dynamic array (`ArrayList`, `vector`, Python `list`) is called `O(1)`, yet sometimes it must allocate a bigger block and copy everything. How can both be true?',
        },
        {
          kind: 'para',
          text: 'Because the expensive step happens rarely, and its cost, spread across the cheap steps that preceded it, is constant. That spread-out cost is the **amortised** cost.',
        },
        {
          kind: 'diagram',
          caption: 'Capacity doubles. Copies happen at 1, 2, 4, 8, 16 ... and total under 2n for n appends.',
          art: `append #:  1   2   3   4   5   6   7   8   9
capacity:  1   2   4   4   8   8   8   8  16
copies:    -   1   2   -   4   -   -   -   8

total copies after n appends = 1 + 2 + 4 + ... < 2n
average per append = O(1)`,
        },
        {
          kind: 'callout',
          tone: 'why',
          text: 'Doubling is what makes this work. If capacity grew by a fixed amount instead, copying would happen every few appends and `n` appends would cost `O(n^2)` in total.',
        },
        {
          kind: 'para',
          text: 'The same reasoning explains why the monotonic stack pattern is linear: a single iteration might pop many elements, but each element is pushed once and popped at most once across the whole run, so the total is `O(n)`.',
        },
      ],
    },
    {
      id: 'recurrences',
      title: 'Recurrences and recursion trees',
      blocks: [
        {
          kind: 'para',
          text: 'Recursive algorithms are analysed with a recurrence: the cost of size `n` written in terms of smaller sizes. Merge sort splits in half, sorts both halves, and merges in linear time:',
        },
        {
          kind: 'visual',
          name: 'recursion-tree',
          caption:
            'Naive Fibonacci: the highlighted calls are the ones being recomputed.',
        },
        {
          kind: 'code',
          language: 'text',
          source: `T(n) = 2 * T(n/2) + O(n)`,
        },
        {
          kind: 'para',
          text: 'Draw the tree. Each level does `O(n)` total work, and there are `log2(n)` levels, so the total is `O(n log n)`.',
        },
        {
          kind: 'diagram',
          art: `level 0:              n                       total n
level 1:        n/2       n/2                 total n
level 2:     n/4   n/4  n/4   n/4             total n
   ...
level log n:  1  1  1  1  1  1  1  1          total n

log(n) levels  x  n per level  =  O(n log n)`,
        },
        {
          kind: 'table',
          caption: 'Recurrences worth recognising on sight.',
          headers: ['Recurrence', 'Solution', 'Example'],
          rows: [
            ['`T(n) = T(n/2) + O(1)`', '`O(log n)`', 'binary search'],
            ['`T(n) = T(n/2) + O(n)`', '`O(n)`', 'quickselect, average case'],
            ['`T(n) = 2T(n/2) + O(1)`', '`O(n)`', 'tree traversal'],
            ['`T(n) = 2T(n/2) + O(n)`', '`O(n log n)`', 'merge sort'],
            ['`T(n) = T(n-1) + O(1)`', '`O(n)`', 'simple linear recursion'],
            ['`T(n) = T(n-1) + O(n)`', '`O(n^2)`', 'selection sort, recursively'],
            ['`T(n) = 2T(n-1) + O(1)`', '`O(2^n)`', 'naive Fibonacci, subsets'],
          ],
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Master theorem, informally',
          text: 'For `T(n) = a*T(n/b) + f(n)`, compare `f(n)` against `n^(log_b a)`. If the recursive work dominates, that term is the answer; if `f(n)` dominates, `f(n)` is; if they match, multiply by `log n`. Recognising the seven rows above covers nearly every interview case without the formalism.',
        },
      ],
    },
    {
      id: 'constraints',
      title: 'Reading constraints to choose an approach',
      blocks: [
        {
          kind: 'para',
          text: 'Constraints in a problem statement are a hint, not decoration. They tell you which complexities can pass, which usually narrows the technique before you have had an idea.',
        },
        {
          kind: 'table',
          caption: 'Assuming roughly 10^8 simple operations per second.',
          headers: ['Constraint', 'Complexity you can afford', 'Techniques that reach it'],
          rows: [
            ['`n <= 10`', '`O(n!)`, `O(n^6)`', 'permutations, brute force everything'],
            ['`n <= 20`', '`O(2^n)`, `O(2^n * n)`', 'subsets, bitmask DP, meet in the middle'],
            ['`n <= 100`', '`O(n^4)`', 'interval DP, Floyd-Warshall on small graphs'],
            ['`n <= 500`', '`O(n^3)`', 'Floyd-Warshall, matrix chain'],
            ['`n <= 5,000`', '`O(n^2)`', 'classic 2D DP, all pairs'],
            ['`n <= 10^5`', '`O(n log n)`, `O(n)`', 'sorting, heaps, two pointers, sliding window, binary search'],
            ['`n <= 10^6`', '`O(n)`, `O(n log n)` if the constant is small', 'single pass, hashing, prefix sums'],
            ['`n <= 10^9`', '`O(log n)`, `O(sqrt n)`', 'maths, binary search on the answer, fast exponentiation'],
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'Read this backwards during an interview. Seeing `n <= 10^5` tells you a nested loop is out and something around `n log n` is expected — which immediately suggests sorting, a heap, binary search or a sliding window.',
        },
        {
          kind: 'check',
          question: '`n <= 20` and the problem asks for the best partition of the elements into two groups. What does the constraint suggest?',
          answer: 'A tiny `n` with an exponential flavour points at subsets: `2^20` is about a million, which is trivially fast. Bitmask enumeration or bitmask DP is almost certainly the intended solution.',
        },
      ],
    },
    {
      id: 'mistakes',
      title: 'Mistakes people make in analysis',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Forgetting the cost of library calls.** `contains` on a list, `substring`, `insert(0, ...)` and set-to-list conversions are not free.',
            '**Ignoring the recursion stack** when quoting space complexity.',
            '**Assuming a hash map is always `O(1)`.** It is on average; adversarial or poorly distributed keys degrade it.',
            '**Analysing the wrong variable.** For a graph, the size is `V` and `E`, not "n". For a string matrix, it is rows times columns.',
            '**Dropping a factor that is not constant.** Comparing strings of length `k` inside a sort makes it `O(n k log n)`, not `O(n log n)`.',
            '**Confusing `log n` with `n`.** Doubling the input adds one step to a logarithmic algorithm; it doubles a linear one.',
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'A complete answer names both costs and the reason: "linear time because each element is pushed and popped at most once, and linear space for the stack in the worst case". Say it that way and the analysis question is finished.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'We count operations as a function of input size, because seconds do not transfer between machines.',
    'Big-O is an upper bound on growth; constants and lower-order terms are dropped because they cannot change the shape.',
    'Sequential code adds, nested loops multiply, halving gives a logarithm.',
    'Quote the worst case unless asked otherwise, and mention the average when it genuinely differs.',
    'Space complexity includes the recursion stack.',
    'Amortised cost spreads a rare expensive step over the cheap ones — this is why doubling arrays and monotonic stacks are linear.',
    'Recognise the seven standard recurrences and you can analyse most recursive algorithms instantly.',
    'Constraints tell you the target complexity before you have an idea; read them first.',
  ],
};
