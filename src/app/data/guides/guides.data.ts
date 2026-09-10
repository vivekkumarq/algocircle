import { Block } from '../../core/models/chapter.models';

export interface Guide {
  slug: string;
  title: string;
  tagline: string;
  icon: string;
  readingMinutes: number;
  sections: { id: string; title: string; blocks: Block[] }[];
}

const BUILD_LOGIC: Guide = {
  slug: 'build-logic',
  title: 'How to build problem-solving logic',
  tagline:
    'Nobody is born able to see the solution. This is the ladder from "I stare at the screen" to "I know what shape this is" — four stages, with what to practise at each.',
  icon: 'compass',
  readingMinutes: 14,
  sections: [
    {
      id: 'why-hard',
      title: 'Why it feels impossible at first',
      blocks: [
        {
          kind: 'callout',
          tone: 'note',
          title: 'In plain words',
          text: 'When you look at a problem and see nothing, that is not a lack of talent. It is a lack of **vocabulary** — you have not yet met enough problem shapes for one of them to feel familiar.',
        },
        {
          kind: 'para',
          text: 'Experienced problem solvers are not thinking faster than you. They are pattern matching. They read "longest substring with at most K distinct" and a window appears, because they have seen thirty problems with that shape. The gap between you and them is a list of shapes, not raw intelligence.',
        },
        {
          kind: 'para',
          text: 'That is good news, because a vocabulary can be built deliberately. What follows is the order that works, and the trap at each stage.',
        },
        {
          kind: 'compare',
          columns: [
            {
              title: 'What people think is happening',
              points: [
                'They see the optimal solution instantly.',
                'They memorised this exact problem.',
                'They are just better at maths.',
              ],
            },
            {
              title: 'What is actually happening',
              points: [
                'They recognise a shape they have met before.',
                'They start from brute force, silently, in two seconds.',
                'They know what the constraints rule out before they think.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'stage-one',
      title: 'Stage 1 — Make the language disappear',
      blocks: [
        {
          kind: 'para',
          text: 'Before any algorithm, writing code must stop costing you attention. If you are thinking about loop syntax, there is nothing left over for the actual problem.',
        },
        {
          kind: 'list',
          items: [
            'Write a loop that prints 1 to 100 without looking anything up.',
            'Reverse an array in place. Find the maximum. Count how many values are even.',
            'Write a function that takes an array and returns a new one. Know whether you copied or aliased it.',
            'Read a nested loop and say what it prints, before running it.',
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'The test for this stage: you can write a twenty-line function without a syntax error and without a search engine. That is all. It usually takes a week or two, not months.',
        },
      ],
    },
    {
      id: 'stage-two',
      title: 'Stage 2 — Trace by hand, every time',
      blocks: [
        {
          kind: 'para',
          text: 'This is the stage most people skip, and skipping it is why they get stuck for months. Before you write code for a problem, solve a small instance **on paper**, writing down each step as a human would do it.',
        },
        {
          kind: 'steps',
          items: [
            {
              title: 'Take four or five elements',
              text: 'Not the example in the problem — a smaller one you invent, so you cannot pattern match on the answer.',
            },
            {
              title: 'Solve it as a person, slowly',
              text: 'Actually do it. Write the intermediate values. Notice what you looked at and what you ignored.',
            },
            {
              title: 'Write down the rule you followed',
              text: 'In a sentence. "I kept the biggest thing I had seen so far." That sentence is the algorithm.',
            },
            {
              title: 'Now translate the sentence to code',
              text: 'The variables in your sentence become the variables in the loop.',
            },
          ],
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why this works',
          text: 'You already solve small instances correctly by instinct. The difficulty is never the logic — it is noticing what your own instinct did. Writing it down turns an unconscious rule into an explicit one you can code.',
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'If you cannot solve a five-element case by hand, you do not have a coding problem. You have not understood the question yet, and no amount of typing will fix that.',
        },
      ],
    },
    {
      id: 'stage-three',
      title: 'Stage 3 — Always start with brute force',
      blocks: [
        {
          kind: 'para',
          text: 'Beginners try to jump to the clever solution and freeze. Strong problem solvers write the obvious, slow, definitely-correct solution first — quickly, and often only in their head.',
        },
        {
          kind: 'para',
          text: 'Brute force is not a fallback. It is a **tool for finding the optimisation**, because it shows you exactly which work is being repeated.',
        },
        {
          kind: 'code',
          language: 'pseudocode',
          caption: 'The brute force tells you what to remove',
          source: `# brute force: for every pair, add them up
for i in 0 .. n-1:
    for j in i+1 .. n-1:
        if a[i] + a[j] == target: return (i, j)

# what is repeated? For each i, we re-scan the whole array
# looking for one specific value: target - a[i].
# "Looking for one specific value" is a lookup -> use a hash map.`,
        },
        {
          kind: 'steps',
          items: [
            { title: 'Write the slow version', text: 'Nested loops, extra arrays, whatever is obvious.' },
            { title: 'State its complexity out loud', text: '"This is O(n²) because for each element I scan the rest."' },
            { title: 'Ask what is repeated', text: 'A repeated scan, a repeated sum, a recomputed maximum, the same subproblem twice.' },
            { title: 'Remove that repetition', text: 'Remember it (hash map, prefix sum, memoisation) or avoid needing it (sort, two pointers, window).' },
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'Almost every optimisation in this subject is one sentence: **stop recomputing what you already knew one step ago.** Prefix sums, sliding windows, memoisation, running maxima and monotonic stacks are all that sentence in different clothes.',
        },
      ],
    },
    {
      id: 'stage-four',
      title: 'Stage 4 — Collect shapes, not solutions',
      blocks: [
        {
          kind: 'para',
          text: 'Once brute force is automatic, start naming what you are looking at. After each problem you solve, write one line in a notebook — not the code, the **shape**.',
        },
        {
          kind: 'table',
          caption: 'The kind of note that is worth keeping.',
          headers: ['Problem', 'Shape', 'What gave it away'],
          rows: [
            ['Longest substring, no repeats', 'sliding window', '"longest" + contiguous'],
            ['Pair summing to target, sorted', 'two pointers', 'sorted + pair'],
            ['Minimum days to ship', 'binary search on answer', '"minimise the maximum"'],
            ['Next warmer temperature', 'monotonic stack', '"next greater element"'],
            ['Ways to climb stairs', 'dynamic programming', '"count the ways" + overlapping'],
            ['Fewest moves in a grid', 'BFS', '"fewest steps" + equal costs'],
          ],
        },
        {
          kind: 'para',
          text: 'After twenty or thirty such lines, something changes: you start reading problems and feeling a pull toward a shape before you have finished the sentence. That feeling is the skill. It is built by naming, not by volume.',
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'The volume trap',
          text: 'Solving two hundred problems without naming the shape produces someone who has solved two hundred problems and can solve none of the next ten. Fifty problems with a shape written down beats three hundred without.',
        },
      ],
    },
    {
      id: 'stuck',
      title: 'What to do when you are stuck',
      blocks: [
        {
          kind: 'para',
          text: 'Being stuck is the normal state, not a failure signal. What matters is having a procedure so that stuck time is productive rather than a stare.',
        },
        {
          kind: 'steps',
          items: [
            {
              title: '0–10 minutes: re-read and shrink',
              text: 'Restate the problem in your own words. Write the smallest input and its expected output. Half of all "stuck" is a misread question.',
            },
            {
              title: '10–20 minutes: brute force',
              text: 'Write the slow solution even if it is useless. It gives you something correct to optimise, and it often reveals the structure.',
            },
            {
              title: '20–30 minutes: run the checklist',
              text: 'Would sorting help? Is it contiguous? Am I looking something up? Is this a graph? Do subproblems repeat? What do the constraints rule out?',
            },
            {
              title: '30–40 minutes: take one hint, not the solution',
              text: 'A hint keeps the thinking yours. The solution ends it. If a hint unlocks it, you still learned the step you were missing.',
            },
            {
              title: 'After 45 minutes: read the approach, then close it',
              text: 'Understand the idea, close the page, and re-derive the code yourself from the idea alone. Then re-solve the whole thing tomorrow from scratch.',
            },
          ],
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why the "close it and re-derive" step matters',
          text: 'Reading a solution feels like learning and is not. The memory forms when you retrieve, not when you recognise. The re-derivation is where the entire value of a hard problem sits.',
        },
      ],
    },
    {
      id: 'checklist',
      title: 'The checklist to run on any problem',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'What exactly is the input, and what exactly is the output? What is the answer for an empty input?',
            'What do the **constraints** allow? `n <= 20` means exponential, `n <= 10^5` rules out nested loops.',
            'Would **sorting** make this easier? It costs `n log n` and unlocks two pointers and binary search.',
            'Does the problem say **contiguous**? That is a window or a prefix sum.',
            'Am I **searching for a specific value**? That is a hash map.',
            'Am I asked for the **smallest or largest repeatedly**? That is a heap.',
            'Are things **connected**, or is this a grid or a set of states? That is a graph.',
            'Do the **same subproblems repeat**? That is memoisation.',
            'Is the answer a **number with a monotone feasibility test**? Binary search the answer.',
            'What are the edge cases: empty, one element, duplicates, negatives, overflow?',
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'Print this list. Run it out loud on every problem for two weeks and it stops being a list — it becomes what you think automatically when you read a question.',
        },
      ],
    },
  ],
};

const CODE_IT_UP: Guide = {
  slug: 'write-the-code',
  title: 'From idea to working code',
  tagline:
    'You know the approach and still get it wrong at the keyboard. This is how to translate an idea into code that works the first time, and how to talk about it while you do.',
  icon: 'code',
  readingMinutes: 12,
  sections: [
    {
      id: 'before-typing',
      title: 'Before you type anything',
      blocks: [
        {
          kind: 'callout',
          tone: 'note',
          title: 'In plain words',
          text: 'Most bugs are decided before the first line is typed. Spending two minutes naming your variables and your invariant saves twenty minutes of confused debugging.',
        },
        {
          kind: 'steps',
          items: [
            {
              title: 'Name the state',
              text: 'Say what each variable means in words. "`left` is the start of the current window." "`dp[i]` is the best total using the first `i` items."',
            },
            {
              title: 'State the invariant',
              text: 'One sentence that is true before the loop and after every iteration. "Everything before `write` is the compacted result."',
            },
            {
              title: 'Decide the boundaries',
              text: 'Inclusive or exclusive? Prefer half-open `[lo, hi)` — the length is `hi - lo`, empty is `lo == hi`, and most fence-post bugs vanish.',
            },
            {
              title: 'Decide what happens at the ends',
              text: 'What does the first iteration do? What is left after the last one? Trailing state you forgot to flush is a classic.',
            },
          ],
        },
      ],
    },
    {
      id: 'writing',
      title: 'While you write',
      blocks: [
        {
          kind: 'list',
          items: [
            '**Write the loop skeleton first**, then fill the body. An empty loop with correct bounds is easier to get right than both at once.',
            '**Handle the base cases at the top.** Empty input, one element, and null returns go before the main logic, not inside it.',
            '**Use long for sums.** If values can be large, the total overflows an `int` long before you notice.',
            '**Never write `(lo + hi) / 2`.** Write `lo + (hi - lo) / 2`.',
            '**Do not mutate what you are iterating.** Build a result, or use an index-based loop deliberately.',
            '**Copy mutable state when you store it.** Adding the same working list twice gives you two references to one object.',
          ],
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'The four bugs that account for most failures',
          text: 'Off-by-one at a boundary; forgetting the empty or single-element case; integer overflow in a sum or a midpoint; and storing a reference where a copy was needed.',
        },
      ],
    },
    {
      id: 'verify',
      title: 'Verify before you claim it works',
      blocks: [
        {
          kind: 'para',
          text: 'Do not run it first. Read it first — running it teaches you that it is wrong, but reading it teaches you why.',
        },
        {
          kind: 'steps',
          items: [
            { title: 'Trace the smallest input', text: 'Empty, then one element. Follow your own code line by line.' },
            { title: 'Trace a normal input of four elements', text: 'Write a table with one column per variable and one row per iteration.' },
            { title: 'Check the first and last iteration specifically', text: 'That is where boundaries break.' },
            { title: 'Check the awkward cases', text: 'All values equal, all negative, duplicates, target absent, already sorted, reverse sorted.' },
            { title: 'Say the complexity out loud', text: 'If you cannot state it, you have not finished.' },
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'In an interview, tracing an example out loud before saying "I think this is right" is worth more than the code being perfect. It shows the thing they are actually assessing.',
        },
      ],
    },
    {
      id: 'explain',
      title: 'How to explain your solution',
      blocks: [
        {
          kind: 'para',
          text: 'You will spend more of your career explaining designs than writing them, and an interview is mostly an explanation with some typing attached. There is a script.',
        },
        {
          kind: 'steps',
          items: [
            { title: 'Restate the problem', text: '"So we need the length of the longest run with no repeated character."' },
            { title: 'Give the brute force and its cost', text: '"The obvious way checks every substring, which is O(n²)."' },
            { title: 'Name the waste', text: '"But when we move the start forward, we already know what is in the window."' },
            { title: 'Name the technique', text: '"So this is a sliding window with a frequency map."' },
            { title: 'State the invariant', text: '"The window always contains no repeated character."' },
            { title: 'Then code, narrating the non-obvious lines', text: 'Not every line — just the ones a reader would question.' },
            { title: 'Finish with complexity and edge cases', text: '"Linear time, O(k) space, and it handles the empty string because the loop never runs."' },
          ],
        },
        {
          kind: 'callout',
          tone: 'why',
          text: 'Two candidates who both fail to reach the optimal solution are not scored the same. The one who reasoned aloud, named the pattern and analysed their own brute force passes; the one who typed silently does not.',
        },
      ],
    },
  ],
};

const STUDY_PLAN: Guide = {
  slug: 'study-plan',
  title: 'A realistic plan, and how to practise',
  tagline:
    'How much time this actually takes, in what order, and how to practise so that what you learn in week two is still there in week ten.',
  icon: 'clock',
  readingMinutes: 11,
  sections: [
    {
      id: 'time',
      title: 'How long this really takes',
      blocks: [
        {
          kind: 'callout',
          tone: 'note',
          title: 'In plain words',
          text: 'At about two focused hours a day, going from nothing to interview-ready takes roughly three to five months. Anyone promising two weeks is selling something.',
        },
        {
          kind: 'table',
          caption: 'The reading time is the small part; the practice is the rest.',
          headers: ['Phase', 'Roughly', 'What you are doing'],
          rows: [
            ['Foundations', 'weeks 1–2', 'Topics 01–04: why, memory, complexity, the maths you actually need'],
            ['Core structures', 'weeks 3–8', 'Topics 05–16: arrays through heaps, with problems after each'],
            ['Advanced', 'weeks 9–13', 'Topics 17–20: graphs, greedy, DP, range structures'],
            ['Consolidation', 'weeks 14+', 'Mixed practice with no topic label, timed, plus revision of everything earlier'],
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'Two focused hours a day beats eight distracted hours on a Saturday. The material is cumulative, so consistency compounds and cramming does not.',
        },
      ],
    },
    {
      id: 'session',
      title: 'What one good session looks like',
      blocks: [
        {
          kind: 'steps',
          items: [
            { title: '10 min — revise', text: 'Re-solve one problem you already solved days ago. From scratch, not from memory of the code.' },
            { title: '25 min — learn', text: 'Read one section of a topic. Stop and draw the diagram yourself before looking at ours.' },
            { title: '60 min — practise', text: 'Two or three problems on that topic. Brute force first, then optimise, then write down the shape.' },
            { title: '10 min — record', text: 'One line per problem: the shape, and what gave it away. This is the part that compounds.' },
            { title: '15 min — explain', text: 'Say one of the solutions out loud as if to another person. Out loud, in full sentences.' },
          ],
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'A session with no revision and no writing-down is entertainment. It feels productive, and in a month almost none of it will still be there.',
        },
      ],
    },
    {
      id: 'spacing',
      title: 'Why spaced revision is not optional',
      blocks: [
        {
          kind: 'para',
          text: 'Memory forms on **retrieval**, not on exposure. Re-reading a solution feels like learning and produces almost nothing; re-deriving it after a gap produces a great deal.',
        },
        {
          kind: 'diagram',
          caption: 'Re-solve at increasing gaps. A problem you can still derive after 45 days is genuinely yours.',
          art: `solve it
   |
   +-- 1 day  --> re-solve from scratch
        |
        +-- 3 days --> re-solve
             |
             +-- 7 days --> re-solve
                  |
                  +-- 21 days --> re-solve
                       |
                       +-- 45 days --> it is yours`,
        },
        {
          kind: 'list',
          items: [
            'Keep a list of solved problems with the date. A spreadsheet is enough.',
            'Each session, re-solve whatever is due — from the problem statement, not from your old code.',
            'If you cannot re-derive it, reset that problem to day one. That is information, not failure.',
            'Revising costs about ten minutes a day and roughly doubles what you retain.',
          ],
        },
      ],
    },
    {
      id: 'practice-well',
      title: 'How to practise so it counts',
      blocks: [
        {
          kind: 'compare',
          columns: [
            {
              title: 'Practice that works',
              points: [
                'Brute force first, every time.',
                'A 45-minute limit before taking a hint.',
                'Write the shape down afterwards.',
                'Re-solve old problems on a schedule.',
                'Explain solutions out loud.',
                'Mixed practice with no topic label, once a week.',
              ],
            },
            {
              title: 'Practice that does not',
              points: [
                'Reading solutions and nodding.',
                'Solving only within the topic you just read.',
                'Chasing a solved count.',
                'Skipping the edge cases because tests pass.',
                'Never returning to anything.',
                'Copying code you did not derive.',
              ],
            },
          ],
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why mixed practice matters',
          text: 'Solving ten window problems in a row means the window is given to you. In an interview nobody tells you the topic, so once a week take problems with the labels hidden — that is the only practice that trains recognition.',
        },
      ],
    },
    {
      id: 'progress',
      title: 'How to tell you are actually improving',
      blocks: [
        {
          kind: 'para',
          text: 'Solved counts are a bad signal. These are better, roughly in the order they appear.',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'You can restate a problem correctly, in your own words, without re-reading it.',
            'You reach a working brute force within five minutes, on most problems.',
            'You state the complexity of your own code without being asked.',
            'You guess the technique before you finish reading, and are right more than half the time.',
            'You find your own bug by tracing rather than by running.',
            'You can re-derive a problem from three weeks ago.',
            'You can explain a solution out loud without hesitating.',
            'You can say why the greedy is safe, or why the DP state is complete.',
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'The finish line is not "solved 500 problems". It is: given an unfamiliar problem, you can find the shape, choose a structure, reason about cost, implement it, explain it — and still remember it next month.',
        },
      ],
    },
  ],
};

export const GUIDES: Guide[] = [BUILD_LOGIC, CODE_IT_UP, STUDY_PLAN];

export function guideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}
