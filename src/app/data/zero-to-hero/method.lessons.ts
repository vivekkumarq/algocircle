import { CourseLesson } from '../course/course.model';
import { code } from './build';

export const HOW_TO_THINK: CourseLesson = {
  slug: 'how-to-think',
  title: 'How to think through any problem',
  tagline:
    'The seven steps this whole course repeats, shown once on a small problem, so a blank screen always has a next move.',
  topic: 'why-dsa',
  minutes: 14,
  practice: ['two-sum', 'reverse-array-in-place'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'Being "bad at logic" is not a talent problem. It is one missing habit: trying to jump from the problem straight to code. This course replaces that jump with seven small steps you can always take, even when you have no idea yet.',
    },

    { kind: 'heading', text: 'Why your mind goes blank' },
    {
      kind: 'para',
      text: 'You read a problem, try to *see* the code, and nothing comes. That is normal, because nobody sees the code first. Experienced programmers solve a tiny example by hand, notice what they did, and then write that down in a programming language. They just do it so fast it looks like magic.',
    },
    {
      kind: 'para',
      text: 'There are also two different skills hiding in "I can\'t solve it": **finding the steps** and **writing the steps in code**. When both are weak at once, everything feels impossible. Train them separately and both get easier.',
    },
    {
      kind: 'compare',
      columns: [
        {
          title: 'What a stuck beginner does',
          points: [
            'Reads the problem once and starts typing',
            'Tries to think of the fastest solution first',
            'Keeps the whole idea in their head',
            'Reads the answer after five minutes',
          ],
        },
        {
          title: 'What this course trains',
          points: [
            'Solves a tiny example on paper first',
            'Writes the slow, obvious solution first',
            'Writes the plan as comments, then fills in code',
            'Takes one hint, then writes it from memory later',
          ],
        },
      ],
    },

    { kind: 'heading', text: 'The seven steps' },
    {
      kind: 'steps',
      items: [
        {
          title: 'Understand it',
          text: 'Say the problem in your own words. What goes in, what comes out? What happens with an empty input, one element, negatives, duplicates?',
        },
        {
          title: 'Solve it by hand',
          text: 'Take 4 or 5 values. Solve it on paper, slowly, as a person, not a programmer. Write down what you look at and what you remember.',
        },
        {
          title: 'Say the rule in one sentence',
          text: 'Describe what you just did by hand in one sentence. This sentence is your algorithm. The code is only a translation of it.',
        },
        {
          title: 'Brute force first',
          text: 'Write the slowest correct solution: plain loops, nothing clever. A slow answer that works beats a fast answer you cannot finish.',
        },
        {
          title: 'Find what is repeated',
          text: 'Ask: what does my brute force do again and again? A repeated scan, a sum recomputed, the same question asked twice. That repetition is where the speed is hiding.',
        },
        {
          title: 'Write the better solution, one commented line at a time',
          text: 'Write the plan as comments first. Then put one or two lines of code under each comment.',
        },
        {
          title: 'Dry run it',
          text: 'Run your code by hand on the example, one row per loop turn, in a small table. Most bugs show up in the first three rows.',
        },
      ],
    },

    { kind: 'heading', text: 'All seven steps, on one small problem' },
    {
      kind: 'para',
      text: '**Problem:** given an array of numbers, return `true` if any number appears more than once, otherwise `false`. **Example:** `[4, 1, 7, 1, 9]` gives `true`, because `1` appears twice.',
    },

    { kind: 'heading', text: 'Step 1: Understand it' },
    {
      kind: 'list',
      items: [
        '**Input:** an array of whole numbers. **Output:** `true` or `false`.',
        'Empty array, or only one number: no duplicate is possible, so `false`.',
        'Negative numbers and zero are ordinary numbers; nothing special happens.',
        'We only need to know *whether* a duplicate exists, not which one or how many.',
      ],
    },

    { kind: 'heading', text: 'Step 2: Solve it by hand' },
    {
      kind: 'para',
      text: 'Read `[4, 1, 7, 1, 9]` left to right like a person would, keeping a list of what you have already seen:',
    },
    {
      kind: 'table',
      headers: ['I look at', 'Have I seen it before?', 'What I remember now'],
      rows: [
        ['`4`', 'No', '`4`'],
        ['`1`', 'No', '`4, 1`'],
        ['`7`', 'No', '`4, 1, 7`'],
        ['`1`', '**Yes!** Stop, the answer is `true`', '—'],
      ],
    },

    { kind: 'heading', text: 'Step 3: Say the rule in one sentence' },
    {
      kind: 'callout',
      tone: 'key',
      title: 'The rule',
      text: 'Go through the numbers one by one, remembering each; if the current number is already remembered, there is a duplicate.',
    },

    { kind: 'heading', text: 'Step 4: Brute force first' },
    {
      kind: 'para',
      text: 'The most obvious way: compare every number with every number after it. Two loops, nothing clever.',
    },
    ...code(
      `boolean hasDuplicateBrute(int[] nums) {
    // Pick each number in turn...
    for (int i = 0; i < nums.length; i++) {
        // ...and compare it with every number after it.
        for (int j = i + 1; j < nums.length; j++) {
            // Same value at two different positions: a duplicate.
            if (nums[i] == nums[j]) {
                return true;
            }
        }
    }
    // Every pair was checked and none matched.
    return false;
}`,
      `def has_duplicate_brute(nums: list[int]) -> bool:
    # Pick each number in turn...
    for i in range(len(nums)):
        # ...and compare it with every number after it.
        for j in range(i + 1, len(nums)):
            # Same value at two different positions: a duplicate.
            if nums[i] == nums[j]:
                return True
    # Every pair was checked and none matched.
    return False`,
      'Brute force: every pair.',
    ),
    {
      kind: 'para',
      text: '**Cost:** about `n × n / 2` comparisons, so `O(n²)` time. For 100,000 numbers that is 5 billion comparisons: far too slow, but correct. Now you have something that works to improve.',
    },

    { kind: 'heading', text: 'Step 5: Find what is repeated' },
    {
      kind: 'callout',
      tone: 'why',
      title: 'What the brute force keeps redoing',
      text: 'For every number, the inner loop asks "does this value appear somewhere else?" by scanning the array again. It re-reads the same numbers `n` times. By hand you did not do that: you **remembered** what you had seen. A `HashSet` (Python: `set`) is exactly that memory, and it answers "have I seen this?" in one step.',
    },

    { kind: 'heading', text: 'Step 6: The better solution, line by line' },
    ...code(
      `boolean hasDuplicate(int[] nums) {
    // Memory of every value seen so far. A HashSet answers
    // "is this value in here?" in one step, not by scanning.
    Set<Integer> seen = new HashSet<>();

    // Look at each number once, left to right, like by hand.
    for (int value : nums) {
        // Seen it already? Then it appears twice: we are done.
        if (seen.contains(value)) {
            return true;
        }
        // First time: remember it for the numbers still to come.
        seen.add(value);
    }

    // Reached the end without a repeat, so every value was unique.
    return false;
}`,
      `def has_duplicate(nums: list[int]) -> bool:
    # Memory of every value seen so far. A set answers
    # "is this value in here?" in one step, not by scanning.
    seen = set()

    # Look at each number once, left to right, like by hand.
    for value in nums:
        # Seen it already? Then it appears twice: we are done.
        if value in seen:
            return True
        # First time: remember it for the numbers still to come.
        seen.add(value)

    # Reached the end without a repeat, so every value was unique.
    return False`,
      'The rule from step 3, translated line by line.',
    ),
    {
      kind: 'para',
      text: '**Cost:** one pass, so `O(n)` time, plus `O(n)` memory for the set. We spent memory to save time. That trade appears again and again in this course.',
    },
    {
      kind: 'para',
      text: 'Compare the code with the sentence from step 3: *go through the numbers* is the `for` loop, *remembering each* is `seen.add`, *already remembered* is `contains` / `in`. The code really is just the sentence, translated.',
    },

    { kind: 'heading', text: 'Step 7: Dry run it' },
    {
      kind: 'table',
      headers: ['Turn', '`value`', '`seen` before', 'In `seen`?', 'What happens'],
      rows: [
        ['1', '`4`', '`{}`', 'no', 'add `4`'],
        ['2', '`1`', '`{4}`', 'no', 'add `1`'],
        ['3', '`7`', '`{4, 1}`', 'no', 'add `7`'],
        ['4', '`1`', '`{4, 1, 7}`', '**yes**', 'return `true`'],
      ],
      caption: 'Same steps as the by-hand table. That is the point.',
    },

    { kind: 'heading', text: 'When you are stuck' },
    {
      kind: 'para',
      text: 'Being stuck is part of the process, not a sign you are bad at this. What matters is doing something useful while stuck. Use a timer:',
    },
    {
      kind: 'table',
      headers: ['Time', 'What to do'],
      rows: [
        ['0–10 min', 'Re-read the problem. Make the example smaller. Solve it by hand.'],
        ['10–20 min', 'Write the brute force, even if it is very slow.'],
        ['20–30 min', 'Ask: what is repeated? Would sorting, a HashMap, or two pointers help?'],
        ['30–40 min', 'Read **one** hint. Not the solution. Then try again.'],
        ['After 45 min', 'Read the approach, close it, and write the code yourself. Solve it again from scratch three days later.'],
      ],
    },

    { kind: 'heading', text: 'How to use this course' },
    {
      kind: 'list',
      items: [
        '**Type every line yourself.** Copy-pasting teaches your clipboard, not you.',
        '**Do the logic-building lessons first**, even if they look easy. They make the language disappear, so later you only have to think about the problem.',
        '**One pattern lesson a day** is plenty. Then solve one of its practice problems using all seven steps.',
        '**Revisit each lesson after three days.** Hide the code, read only the problem, and write the solution from scratch.',
        '**Keep a notebook** with the rule sentence from each lesson. After a month, that notebook is your toolbox.',
      ],
    },
    {
      kind: 'callout',
      tone: 'trap',
      text: 'Reading a solution feels like learning, but it is not. You only learn it when you can write it without looking. Whenever you read an answer, close it and write it from memory the next day.',
    },
    {
      kind: 'check',
      question: 'You read a new problem and have no idea at all. What is the very first thing you do?',
      answer: 'Take a tiny example of 4 or 5 values and solve it by hand on paper, slowly, writing down what you look at and what you remember at each step. Those notes are the start of the algorithm. Then say them as one sentence and write the brute force.',
    },
  ],
};
