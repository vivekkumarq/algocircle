import { Chapter } from '../../core/models/chapter.models';

export const WHY_DSA: Chapter = {
  slug: 'why-dsa',
  title: 'Why DSA? Start here',
  shortTitle: 'Why DSA',
  level: 'Foundations',
  order: 1,
  stage: 'why-dsa',
  readingMinutes: 18,
  summary:
    'Before any code: what data structures and algorithms actually are, why a slow program stays slow no matter how fast your laptop is, and what changes once you can reason about cost.',
  objectives: [
    'Explain what a data structure and an algorithm are, in your own words',
    'Show with numbers why one correct program can be unusable and another instant',
    'Recognise DSA in software you already use every day',
    'Describe what an interviewer is actually measuring when they ask a DSA question',
    'Decide how to study this subject without memorising anything',
  ],
  prerequisites: [],
  sections: [
    {
      id: 'what-is-this',
      title: 'What does "data structures and algorithms" even mean?',
      blocks: [
        {
          kind: 'para',
          text: 'Strip away the intimidating name and there are only two ideas, and you already use both of them outside of programming.',
        },
        {
          kind: 'compare',
          columns: [
            {
              title: 'A data structure is how you arrange things',
              points: [
                'A shopping list on paper: items in a line, one after another.',
                'A dictionary: entries sorted alphabetically so you can jump to a page.',
                'A stack of plates: you can only take the top one.',
                'A family tree: each person connects down to their children.',
              ],
            },
            {
              title: 'An algorithm is the procedure you follow',
              points: [
                'Reading a list top to bottom until you find the item.',
                'Opening a dictionary in the middle and deciding to go left or right.',
                'Washing plates by always taking the top of the stack.',
                'Walking a family tree to find everyone descended from one person.',
              ],
            },
          ],
        },
        {
          kind: 'para',
          text: 'In programming the words mean exactly the same thing. A **data structure** is a way of holding data in memory. An **algorithm** is a finite, unambiguous sequence of steps that turns some input into the output you want.',
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'The two are inseparable. The arrangement decides which procedures are cheap. Looking up a word is fast in a sorted dictionary and painfully slow in a shoebox of loose paper slips — same words, same question, different structure.',
        },
        {
          kind: 'para',
          text: 'That is the entire subject. Everything ahead — arrays, hash tables, trees, graphs, dynamic programming — is people discovering better arrangements and better procedures, and proving how much they cost.',
        },
      ],
    },
    {
      id: 'first-example',
      title: 'A first example: finding one name among a million',
      blocks: [
        {
          kind: 'para',
          text: 'You have a phone directory with one million entries, and you need the number for one person. Two honest strategies, both of which always give the right answer.',
        },
        {
          kind: 'heading',
          text: 'Strategy 1: read every entry',
        },
        {
          kind: 'code',
          language: 'pseudocode',
          caption: 'Linear search - works on any list, sorted or not',
          source: `for each entry in directory:
    if entry.name == target:
        return entry.number
return "not found"`,
        },
        {
          kind: 'para',
          text: 'If the person is the first entry you are done in one step. If they are last, you performed one million comparisons. On average, half a million.',
        },
        {
          kind: 'heading',
          text: 'Strategy 2: open it in the middle',
        },
        {
          kind: 'para',
          text: 'A directory is sorted, and that is extra information the first strategy threw away. Open the middle page. If the name you want sorts before that page, the entire second half is now irrelevant — not "less likely", but impossible. Discard it and repeat.',
        },
        {
          kind: 'code',
          language: 'pseudocode',
          caption: 'Binary search - requires sorted data',
          source: `lo = 0
hi = n - 1
while lo <= hi:
    mid = (lo + hi) / 2
    if directory[mid].name == target: return directory[mid].number
    if directory[mid].name <  target: lo = mid + 1
    else:                             hi = mid - 1
return "not found"`,
        },
        {
          kind: 'diagram',
          caption: 'Each comparison throws away half of what is left.',
          art: `1,000,000 entries left
   |  compare once
   v
  500,000
   |
   v
  250,000  ->  125,000  ->  62,500  ->  31,250  ->  15,625
   ->  7,813  ->  3,907  ->  1,954  ->  977  ->  489
   ->  245  ->  123  ->  62  ->  31  ->  16  ->  8  ->  4  ->  2  ->  1

20 comparisons. Done.`,
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'One million steps versus twenty. Both programs are correct. Both are short. One is **fifty thousand times** less work, and the only difference is that the second one exploits how the data is arranged.',
        },
        {
          kind: 'check',
          question: 'If the directory grows from one million to two million names, how many extra comparisons does binary search need?',
          answer: 'Exactly one. Doubling the data adds a single halving step. Linear search, by contrast, needs a million more. This is the difference the rest of the course is about.',
        },
      ],
    },
    {
      id: 'growth',
      title: 'The growth rate is the whole story',
      blocks: [
        {
          kind: 'para',
          text: 'What matters is not how long your program takes on your test input. It is how the time **grows** as the input grows. That growth pattern has a name and a notation, which you will meet properly in the complexity chapter, but you can read the table now.',
        },
        {
          kind: 'para',
          text: 'Assume a machine that performs roughly 100 million simple operations per second, which is a realistic figure for ordinary code.',
        },
        {
          kind: 'table',
          caption: 'Approximate running time by growth rate and input size. Dashes mean "you will not live to see it finish".',
          headers: ['Growth', 'n = 10', 'n = 1,000', 'n = 100,000', 'n = 1,000,000', 'Typical source'],
          rows: [
            ['O(1)', 'instant', 'instant', 'instant', 'instant', 'array index, hash lookup'],
            ['O(log n)', 'instant', 'instant', 'instant', 'instant', 'binary search'],
            ['O(n)', 'instant', 'instant', '~1 ms', '~10 ms', 'one pass over the data'],
            ['O(n log n)', 'instant', 'instant', '~17 ms', '~200 ms', 'sorting'],
            ['O(n^2)', 'instant', '~10 ms', '~100 s', '~3 hours', 'nested loop over the data'],
            ['O(2^n)', 'instant', '-', '-', '-', 'try every subset'],
            ['O(n!)', '~4 ms', '-', '-', '-', 'try every ordering'],
          ],
        },
        {
          kind: 'para',
          text: 'Read the `O(n^2)` row again. On a thousand items it finishes before you blink. On a hundred thousand items — still a small dataset by any modern standard — the same code takes over a minute and a half. Nothing broke. No bug was introduced. The growth rate simply caught up with it.',
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'The trap that catches every beginner',
          text: 'Code that passes your five-element test can be completely unusable in production. Correctness and efficiency are two separate questions, and testing only ever answers the first one.',
        },
      ],
    },
    {
      id: 'hardware',
      title: '"I will just buy a faster computer"',
      blocks: [
        {
          kind: 'para',
          text: 'This is the most natural objection, and it is worth taking seriously rather than waving away. Hardware really has become enormously faster. So why not let it solve the problem?',
        },
        {
          kind: 'para',
          text: 'Because buying hardware multiplies your speed by a constant, while a better algorithm changes the shape of the curve. A constant loses to a shape every time, as soon as the input is large enough.',
        },
        {
          kind: 'table',
          caption: 'A machine 100x faster running the quadratic algorithm, against an ordinary machine running the n log n one.',
          headers: ['Input size', 'O(n^2) on a 100x faster machine', 'O(n log n) on a normal machine'],
          rows: [
            ['1,000', '0.0001 s', '0.0001 s'],
            ['100,000', '1 s', '0.017 s'],
            ['1,000,000', '100 s', '0.2 s'],
            ['10,000,000', '~2.8 hours', '~2.3 s'],
          ],
        },
        {
          kind: 'para',
          text: 'The expensive machine wins at small sizes and loses catastrophically at large ones. There is always an input size past which the better algorithm wins, and in real systems you usually cross it — user counts grow, logs accumulate, images get bigger.',
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why this argument is airtight',
          text: 'Hardware gives you a **multiplier**. An algorithm gives you a **function**. Multiplying a bad function by 100 leaves a bad function; `100 x n^2` still grows quadratically. That is why algorithmic improvement is the only kind that keeps paying off as you scale.',
        },
      ],
    },
    {
      id: 'everywhere',
      title: 'Where this is already running your day',
      blocks: [
        {
          kind: 'para',
          text: 'DSA is not an interview ritual invented by companies. It is the machinery under nearly everything you touched today.',
        },
        {
          kind: 'table',
          headers: ['Something you used', 'What is underneath'],
          rows: [
            ['Maps giving you a route in a second', "Graph shortest-path algorithms (Dijkstra, A*) over a road network with millions of intersections"],
            ['Typing in a search box and seeing suggestions', 'Tries and prefix structures that jump straight to the words starting with what you typed'],
            ['Your phone unlocking with a fingerprint', 'Feature matching and nearest-neighbour search in high-dimensional space'],
            ['A database answering a query instantly', 'B-trees and hash indexes; without an index the same query scans every row'],
            ['Undo in any editor', 'A stack — the last change you made is the first one taken back'],
            ['A ZIP file, or any compressed image', 'Huffman coding, built from a greedy algorithm and a priority queue'],
            ['`git` telling you what changed in a file', 'The longest common subsequence problem, solved with dynamic programming'],
            ['A social feed ranked for you', 'Heaps for top-K selection, plus graph traversal over the follow network'],
            ['Spell check and autocorrect', 'Edit distance, again dynamic programming'],
            ['Any online multiplayer game', 'Spatial partitioning trees deciding what is near enough to matter'],
          ],
        },
        {
          kind: 'para',
          text: 'None of these were invented to be exercises. They were invented because someone had a problem that a naive approach could not solve at the required size, and the structure or the algorithm was the answer.',
        },
      ],
    },
    {
      id: 'not-only-speed',
      title: 'It is not only about speed',
      blocks: [
        {
          kind: 'para',
          text: 'Time is the headline cost, but it is not the only one you will be asked to reason about.',
        },
        {
          kind: 'steps',
          items: [
            {
              title: 'Memory',
              text: 'A hash map that answers in constant time may need more memory than the machine has. Sometimes the right answer is a slower algorithm that fits.',
            },
            {
              title: 'Clarity',
              text: 'A clever solution nobody on the team can maintain is a liability. Complexity you cannot explain is complexity you should not ship.',
            },
            {
              title: 'The shape of the input',
              text: 'Data that is nearly sorted, or has few distinct values, or arrives as a stream you cannot re-read, changes which algorithm is right.',
            },
            {
              title: 'Predictability',
              text: 'An algorithm that is usually fast but occasionally very slow can be worse than one that is always merely acceptable, especially when a user is waiting.',
            },
          ],
        },
        {
          kind: 'callout',
          tone: 'note',
          text: 'This is why real answers sound like "linear time, but it needs a second array of size n — if memory is tight I would use the in-place version and pay an extra log factor". Trade-offs, not trophies.',
        },
      ],
    },
    {
      id: 'interviews',
      title: 'Why interviews are built on this',
      blocks: [
        {
          kind: 'para',
          text: 'Companies do not ask about binary search because their product needs binary search written from scratch. They ask because it is one of the few things that can be observed reliably in an hour.',
        },
        {
          kind: 'list',
          items: [
            '**Can you define a problem precisely?** Most candidates start coding before they know what the output should be for an empty input.',
            '**Can you find a working solution at all?** Brute force counts. Getting to something correct is the first checkpoint.',
            '**Can you see the waste?** The gap between brute force and optimal is almost always repeated work you can name.',
            '**Can you predict cost without running the code?** This is the skill that transfers directly to reviewing a colleague\'s pull request.',
            '**Can you explain your reasoning to another person?** You will spend more of your career explaining designs than writing them.',
            '**Do you handle the awkward cases?** Empty input, one element, duplicates, overflow, all-negative numbers.',
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'The problem is a lens, not the point. Two candidates can both fail to reach the optimal solution, and the one who reasoned out loud, named the pattern and analysed their brute force will pass while the one who silently typed a memorised answer will not.',
        },
        {
          kind: 'para',
          text: 'It is a flawed format and it is fair to say so. It is also the format in front of you, and the skills it tests are genuinely useful, which makes preparing for it a much better use of time than resenting it.',
        },
      ],
    },
    {
      id: 'myths',
      title: 'What DSA is not',
      blocks: [
        {
          kind: 'compare',
          columns: [
            {
              title: 'It is not',
              points: [
                'Memorising several hundred problems and their solutions.',
                'A test of natural talent that you either have or do not.',
                'Competitive programming — that is a related sport with different priorities.',
                'Something you finish, tick off, and never return to.',
                'Tied to a language. The ideas are the same in Java, C++, Python or anything else.',
              ],
            },
            {
              title: 'It is',
              points: [
                'A vocabulary of maybe twenty-five recurring problem shapes.',
                'A skill built by deliberate practice, like sight-reading music.',
                'A way to predict cost before you write code.',
                'Cumulative — graphs make sense once trees do, DP makes sense once recursion does.',
                'Directly useful in ordinary work, not only in interviews.',
              ],
            },
          ],
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'The memorisation trap',
          text: 'Memorising solutions feels like progress because the number of solved problems goes up. It collapses the moment a problem is worded differently from the one you memorised — which, in an interview, it always is. Learn the pattern and the reason; the code follows from them.',
        },
      ],
    },
    {
      id: 'how-to-learn',
      title: 'How to actually learn this',
      blocks: [
        {
          kind: 'para',
          text: 'The order below is not arbitrary. Each step exists because skipping it is the most common way people stall.',
        },
        {
          kind: 'steps',
          items: [
            {
              title: 'Understand the concept before the code',
              text: 'If you cannot draw what a hash map does on paper, writing one will not teach you. Read the concept, then draw the small case by hand.',
            },
            {
              title: 'Trace it manually on a tiny input',
              text: 'Four or five elements, on paper, writing down every variable at every step. This single habit prevents most off-by-one errors you will ever write.',
            },
            {
              title: 'Watch it run',
              text: 'A visualisation shows you the invariant — the thing that stays true at every step — far faster than reading the loop does.',
            },
            {
              title: 'Name the pattern',
              text: 'Before writing code, say which shape this is: two pointers, sliding window, binary search on the answer, and so on. Being wrong here is fine and informative.',
            },
            {
              title: 'Write brute force first, deliberately',
              text: 'It establishes correctness and, more importantly, shows you exactly which work is being repeated. The optimal solution is usually "remove that repetition".',
            },
            {
              title: 'Optimise, then state the complexity out loud',
              text: 'Say the time and space cost as a sentence. If you cannot, you have not finished the problem.',
            },
            {
              title: 'Explain it as if to another person',
              text: 'Out loud, in full sentences. Gaps in understanding are silent when you think and obvious when you speak.',
            },
            {
              title: 'Come back to it later',
              text: 'A problem solved once and never revisited is forgotten within weeks. Spaced revision after 1, 3, 7, 21 and 45 days is what turns effort into memory.',
            },
          ],
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'On pace',
          text: 'Two focused hours a day beats eight distracted ones on a weekend. The material is cumulative, so consistency compounds and cramming does not.',
        },
        {
          kind: 'check',
          question: 'You have been stuck on a problem for forty minutes. What should you do?',
          answer: 'Take one hint, not the solution. A hint keeps the thinking yours; the solution ends it. If you are still stuck after the next hint, read the approach, close it, wait a day, and re-solve it from scratch — the second attempt is where the learning happens.',
        },
      ],
    },
    {
      id: 'prerequisites',
      title: 'What you need before the next chapter',
      blocks: [
        {
          kind: 'para',
          text: 'Very little, and less than most people assume.',
        },
        {
          kind: 'list',
          items: [
            'One programming language you can write a loop and a function in. Java, C++ and Python are the usual choices for interviews; any of them is fine.',
            'The ability to run a program and print output.',
            'School-level arithmetic. No calculus, no formal proof technique.',
            'Willingness to work on paper before working in an editor.',
          ],
        },
        {
          kind: 'para',
          text: 'You do **not** need a computer science degree, a maths background, or any prior exposure to algorithms. The next chapter starts from variables and memory.',
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'If you can write a loop that prints the numbers 1 to 10, you have everything you need to start.',
        },
      ],
    },
    {
      id: 'use-this-site',
      title: 'How AlgoCircle is organised',
      blocks: [
        {
          kind: 'para',
          text: 'The site follows the loop described above, and each part has one job.',
        },
        {
          kind: 'table',
          headers: ['Section', 'What it is for'],
          rows: [
            ['Roadmap', 'The ordered path. Every stage states its prerequisites, so you always know whether you are ready for it.'],
            ['Learn', 'The chapters. Concepts explained from scratch, with diagrams, worked examples and traps called out.'],
            ['Patterns', 'The recurring problem shapes, each with the signals that give it away and a template.'],
            ['Visualizer', 'Watch an algorithm run, one step at a time, with the state shown at every step.'],
            ['Practice', 'Problems, filtered how you like, with graded hints before any solution.'],
            ['Progress', 'What you have done, what you are weak at, and what is due for revision.'],
            ['Interview', 'Timed rounds and company-oriented preparation once the fundamentals are in place.'],
          ],
        },
        {
          kind: 'para',
          text: 'Progress is stored in your own browser. There is no account and no server, which also means clearing your browser data clears your progress.',
        },
        {
          kind: 'para',
          text: 'The next chapter, **Programming Foundations**, covers the machinery every algorithm is written with: variables, memory, references, functions and the call stack. If you already know it, mark it complete on the roadmap and move to Complexity Analysis.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'A data structure is how data is arranged; an algorithm is the procedure you run on it. The arrangement decides which procedures are cheap.',
    'How the running time grows with input size matters far more than how fast it is on your test case.',
    'Faster hardware multiplies your speed by a constant; a better algorithm changes the shape of the curve, and the shape always wins eventually.',
    'DSA already runs maps, search, databases, compression, version control and every feed you scroll.',
    'Interviews use these problems to observe how you define, reason, optimise and explain — the problem is the lens, not the point.',
    'Learn patterns and reasons, not solutions. Memorised answers collapse on rewording.',
    'You need one language and a loop. Nothing else.',
  ],
};
