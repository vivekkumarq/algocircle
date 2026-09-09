import { Chapter } from '../../core/models/chapter.models';

export const FOUNDATIONS: Chapter = {
  slug: 'foundations',
  title: 'Programming Foundations',
  shortTitle: 'Foundations',
  level: 'Foundations',
  order: 2,
  stage: 'foundations',
  readingMinutes: 26,
  summary:
    'The machinery every algorithm is written with: how values live in memory, what a reference really is, why an array is fast, and what the call stack is doing while your recursion runs.',
  objectives: [
    'Predict whether assigning a variable copies data or shares it',
    'Explain why reading `a[i]` costs the same regardless of `i`',
    'Describe what happens in memory when a function calls itself',
    'State the loop invariant of a loop you wrote',
    'Find a bug by tracing code on paper instead of guessing',
  ],
  prerequisites: ['why-dsa'],
  sections: [
    {
      id: 'values-and-types',
      title: 'Values, variables and types',
      blocks: [
        {
          kind: 'para',
          text: 'A variable is a **name bound to a location in memory**. The type tells the machine two things: how many bytes that location occupies, and how to interpret the bits stored there.',
        },
        {
          kind: 'table',
          caption: 'Typical sizes. Exact values vary by language and platform; the orders of magnitude do not.',
          headers: ['Type', 'Bytes', 'Range or meaning', 'Where it bites you'],
          rows: [
            ['`int` (32-bit)', '4', 'about -2.1 billion to 2.1 billion', 'sums of large arrays overflow silently'],
            ['`long` (64-bit)', '8', 'about -9.2 x 10^18 to 9.2 x 10^18', 'the usual fix for overflow'],
            ['`double`', '8', 'approximate real numbers', '`0.1 + 0.2 != 0.3`; never compare with `==`'],
            ['`char`', '1-2', 'a single character code', 'letters can be used as array indices'],
            ['`boolean`', '1', 'true or false', 'cheap flags and visited arrays'],
          ],
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'Integer overflow is silent',
          text: 'Adding one to the largest `int` does not raise an error — it wraps around to the smallest. Summing an array of a hundred thousand values near a billion each overflows long before you notice. When totals can be large, use a 64-bit type.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'The same arithmetic, two outcomes',
          source: `int a = 2_000_000_000;
int b = 2_000_000_000;
System.out.println(a + b);              // -294967296  (wrapped)
System.out.println((long) a + b);       // 4000000000  (correct)`,
        },
      ],
    },
    {
      id: 'memory-model',
      title: 'Where your data actually lives',
      blocks: [
        {
          kind: 'para',
          text: 'Memory is one enormous numbered sequence of bytes. Your program uses two regions of it differently, and almost every confusing bug in early DSA work comes from not knowing which one is in play.',
        },
        {
          kind: 'diagram',
          caption: 'The stack grows and shrinks with function calls; the heap holds anything that must outlive them.',
          art: `          STACK                              HEAP
   (automatic, fast, small)        (manual or GC, large, slower)

  +----------------------+          +--------------------------+
  | solve()   n=5, i=2   |          |  [7][3][9][1][4]         | <- an array
  +----------------------+          +--------------------------+
  | main()    args, list |--------->|  Node{val:3, next:.} ----+--> Node{...}
  +----------------------+          +--------------------------+
       grows downward                     allocated on demand`,
        },
        {
          kind: 'compare',
          columns: [
            {
              title: 'The stack',
              points: [
                'One frame per active function call.',
                'Holds parameters, local variables and the return address.',
                'Freed automatically the instant the function returns.',
                'Very fast: allocation is moving a pointer.',
                'Small — a few megabytes. Deep recursion overflows it.',
              ],
            },
            {
              title: 'The heap',
              points: [
                'Holds objects, arrays and anything with a lifetime you control.',
                'Reached through a reference stored on the stack.',
                'Freed by a garbage collector, or by you in C++.',
                'Slower to allocate; can fragment.',
                'Large — limited by available RAM.',
              ],
            },
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'A local variable holding an object does not contain the object. It contains the **address** of the object on the heap. That single sentence explains almost every surprise in the next section.',
        },
      ],
    },
    {
      id: 'value-vs-reference',
      title: 'Value versus reference: the classic confusion',
      blocks: [
        {
          kind: 'para',
          text: 'When you assign one variable to another, does the data get copied, or do both names now point at the same data? The answer depends on the type, and getting it wrong produces bugs that look like magic.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Primitives copy the value; arrays and objects copy the address',
          source: `int x = 5;
int y = x;          // y gets its own copy of 5
y = 9;
// x is still 5

int[] a = {1, 2, 3};
int[] b = a;        // b gets a copy of the ADDRESS, not of the data
b[0] = 99;
// a[0] is now 99 as well - there was only ever one array`,
        },
        {
          kind: 'diagram',
          art: `PRIMITIVE                          REFERENCE

 x: [ 5 ]                          a: [ 0x7ff0 ] --+
 y: [ 5 ]   two boxes              b: [ 0x7ff0 ] --+--> [1][99][3]
                                                          one array`,
        },
        {
          kind: 'para',
          text: 'The same rule governs function arguments. Passing an `int` gives the function a private copy; passing an array gives it the address, so any change it makes is visible to the caller after it returns.',
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'The bug this causes',
          text: 'Building a list of results in backtracking and adding the *same* working list each time gives you a result full of identical entries — every element is the same reference, and the last mutation overwrote them all. The fix is to add a **copy**: `result.add(new ArrayList<>(current))`.',
        },
        {
          kind: 'check',
          question: 'A function receives an array and does `arr = new int[5]` inside. Does the caller see a new array?',
          answer: 'No. The function reassigned its own local copy of the reference, which points somewhere new only inside the function. The caller still points at the original array. Mutating `arr[0]` would have been visible; reassigning `arr` is not.',
        },
      ],
    },
    {
      id: 'arrays-in-memory',
      title: 'Why array indexing is instant',
      blocks: [
        {
          kind: 'para',
          text: 'An array is a single contiguous block of memory holding equally sized elements. That is the entire definition, and every property of arrays follows from it.',
        },
        {
          kind: 'diagram',
          caption: 'Address of element i = base + i * elementSize. One multiplication and one addition, for any i.',
          art: `index:      0      1      2      3      4
           +------+------+------+------+------+
values:    |  17  |   4  |  23  |   8  |  15  |
           +------+------+------+------+------+
address:   1000   1004   1008   1012   1016      (4 bytes each)

a[3]  ->  1000 + 3 * 4  =  1012  ->  8`,
        },
        {
          kind: 'list',
          items: [
            '**Reading or writing `a[i]` is O(1)**, and the cost does not depend on `i` or on the length.',
            '**Inserting in the middle is O(n)**, because everything after the gap must shift.',
            '**The size is fixed** at creation; growing means allocating a bigger block and copying.',
            '**Iteration is unusually fast** because neighbouring elements share a cache line, so the CPU has already fetched the next one.',
          ],
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why this matters later',
          text: 'When you meet a linked list, every one of these properties flips: O(n) to reach an index, O(1) to insert once you are there, no fixed size, and poor cache behaviour. Neither is better — they are opposite trade-offs, and the question is always which one your problem needs.',
        },
      ],
    },
    {
      id: 'strings',
      title: 'Strings and the cost of building them',
      blocks: [
        {
          kind: 'para',
          text: 'A string is an array of characters with extra convenience. In Java, Python and C#, strings are **immutable** — every operation that appears to modify one actually builds a new string.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'The same loop, quadratic and linear',
          source: `// O(n^2): each += copies the whole string built so far
String s = "";
for (int i = 0; i < n; i++) s += i;

// O(n): a mutable buffer, resized rarely, copied once at the end
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) sb.append(i);
String s2 = sb.toString();`,
        },
        {
          kind: 'para',
          text: 'For n = 100,000 the first loop performs billions of character copies and the second performs a few hundred thousand. This is the single most common accidental quadratic in interview code.',
        },
        {
          kind: 'table',
          headers: ['Language', 'Mutable builder'],
          rows: [
            ['Java', '`StringBuilder`'],
            ['C++', '`std::string` is already mutable; use `+=` freely, and `reserve()` if you know the size'],
            ['Python', 'collect into a list, then `"".join(parts)`'],
          ],
        },
      ],
    },
    {
      id: 'functions-and-stack',
      title: 'Functions and the call stack',
      blocks: [
        {
          kind: 'para',
          text: 'Calling a function pushes a **stack frame**: a small record holding its arguments, its local variables and the address to return to. Returning pops that frame. Nothing else happens, and understanding this makes recursion stop feeling like magic.',
        },
        {
          kind: 'code',
          language: 'java',
          source: `int factorial(int n) {
    if (n <= 1) return 1;          // base case
    return n * factorial(n - 1);   // recursive case
}`,
        },
        {
          kind: 'diagram',
          caption: 'factorial(4): frames pile up until the base case, then unwind, each multiplying on the way out.',
          art: `call phase                       return phase

factorial(4)                     4 * 6  = 24
  factorial(3)                   3 * 2  = 6
    factorial(2)                 2 * 1  = 2
      factorial(1) -> 1          1`,
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'Every recursive function needs two things: a **base case** that returns without recursing, and a **recursive case** that moves strictly closer to it. Missing either one gives you infinite recursion and a stack overflow.',
        },
        {
          kind: 'para',
          text: 'Recursion depth costs memory. A recursion `n` levels deep uses O(n) stack space even if it allocates nothing itself, which is why a recursive traversal of a linked list with a million nodes crashes while the loop version does not.',
        },
        {
          kind: 'check',
          question: 'Why does a recursive solution sometimes crash where an iterative one with the same complexity does not?',
          answer: 'The stack is only a few megabytes. Each frame costs tens of bytes, so depth in the hundreds of thousands exhausts it. The iterative version keeps its state on the heap, which is orders of magnitude larger.',
        },
      ],
    },
    {
      id: 'loops-and-invariants',
      title: 'Loops and the invariant idea',
      blocks: [
        {
          kind: 'para',
          text: 'A **loop invariant** is a statement that is true before the loop starts, stays true after every iteration, and therefore is true when the loop ends. It is the closest thing to a proof that you will use daily, and it is what makes tricky loops writable.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Invariant: max holds the largest value among a[0..i-1]',
          source: `int max = a[0];                    // true for the first element
for (int i = 1; i < a.length; i++) {
    if (a[i] > max) max = a[i];    // still true after extending by one
}
// loop ended with i == a.length, so max holds the largest of all`,
        },
        {
          kind: 'para',
          text: 'State the invariant before you write the body and the boundaries stop being guesswork. Most off-by-one errors are an invariant that was true for `a[0..i-1]` being used as though it were true for `a[0..i]`.',
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'Half-open ranges',
          text: 'Prefer `[lo, hi)` — inclusive start, exclusive end. The length is simply `hi - lo`, an empty range is `lo == hi`, and splitting at `mid` gives `[lo, mid)` and `[mid, hi)` with no gaps or overlaps. Most fence-post bugs disappear with this convention.',
        },
      ],
    },
    {
      id: 'objects',
      title: 'Classes, objects and custom structures',
      blocks: [
        {
          kind: 'para',
          text: 'A class groups related data, and sometimes behaviour, under one name. In DSA you use them mainly to define the nodes that structures are built from.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'The building blocks of a linked list and a binary tree',
          source: `class ListNode {
    int val;
    ListNode next;          // reference to the next node, or null
    ListNode(int val) { this.val = val; }
}

class TreeNode {
    int val;
    TreeNode left, right;   // two references instead of one
    TreeNode(int val) { this.val = val; }
}`,
        },
        {
          kind: 'para',
          text: 'That is the whole difference between a list and a binary tree at the data level: one forward reference versus two. Everything else is which order you follow them in.',
        },
        {
          kind: 'callout',
          tone: 'note',
          text: 'When you store your own objects in a hash set or use them as map keys, you must define equality and hashing consistently (`equals`/`hashCode` in Java, `__eq__`/`__hash__` in Python, a hash functor in C++). Skipping this gives lookups that silently never match.',
        },
      ],
    },
    {
      id: 'io',
      title: 'Reading input without losing time',
      blocks: [
        {
          kind: 'para',
          text: 'On large inputs, unbuffered input and output can dominate your running time. If a solution is timing out and the algorithm is provably fast enough, check the I/O before you rewrite the algorithm.',
        },
        {
          kind: 'table',
          headers: ['Language', 'Slow', 'Fast'],
          rows: [
            ['Java', '`Scanner`', '`BufferedReader` + `StringTokenizer`, and `StringBuilder` for output'],
            ['C++', '`cin` with sync enabled', '`ios_base::sync_with_stdio(false); cin.tie(nullptr);`'],
            ['Python', '`input()` in a loop', '`sys.stdin.readline`, or `sys.stdin.read().split()` once'],
          ],
        },
      ],
    },
    {
      id: 'debugging',
      title: 'Debugging by hand-tracing',
      blocks: [
        {
          kind: 'para',
          text: 'The most valuable debugging skill in this subject is not a debugger. It is a table on paper.',
        },
        {
          kind: 'steps',
          items: [
            {
              title: 'Shrink the input',
              text: 'Find the smallest input that still fails. Four elements is usually enough, and the bug is easier to see than in the original hundred.',
            },
            {
              title: 'Draw a column per variable',
              text: 'One row per iteration. Fill it in by reading the code, not by running it — you are testing your understanding, not the machine.',
            },
            {
              title: 'Compare against what you expected',
              text: 'The first row where reality diverges from your expectation contains the bug, and it is nearly always a boundary or an update in the wrong order.',
            },
            {
              title: 'Check the usual suspects',
              text: 'Empty input, a single element, all values equal, negatives, the very first and very last index, and an update that happens before the check instead of after.',
            },
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'If you cannot trace your own code by hand on five elements, you do not yet understand it well enough to explain it in an interview — and explaining it is half of what is being assessed.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'A variable is a name for a memory location; the type fixes its size and interpretation.',
    'The stack holds call frames and dies with the call; the heap holds objects reached through references.',
    'Primitives copy on assignment, references share. This one rule explains most beginner bugs.',
    'Arrays are contiguous, so indexing is O(1) and middle insertion is O(n).',
    'Immutable strings make `+=` in a loop quadratic; use a builder.',
    'Recursion is stack frames. A base case, progress toward it, and O(depth) memory.',
    'State the loop invariant first and the boundaries stop being guesswork.',
    'Trace on paper with tiny inputs before reaching for a debugger.',
  ],
};
