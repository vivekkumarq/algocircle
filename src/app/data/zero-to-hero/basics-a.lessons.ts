import { CourseLesson } from '../course/course.model';
import { exercise } from './build';

const PLAN_FIRST: CourseLesson = {
  slug: 'plan-in-english',
  title: 'Plan in English, then translate',
  tagline:
    'Code is a translation of a plan. Write the plan as comments first, and most lines of code become a lookup.',
  topic: 'foundations',
  minutes: 12,
  practice: [],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'If you cannot say the steps in English, no programming language will help. If you can, each sentence has a standard translation, and writing the code is mostly looking those up. This lesson gives you that phrasebook.',
    },
    { kind: 'heading', text: 'Every program has three parts' },
    {
      kind: 'list',
      items: [
        '**Input:** what you are given (an array, a number, a string).',
        '**Process:** the steps, in order. This is the part you plan in English.',
        '**Output:** what you return or print.',
      ],
    },
    {
      kind: 'para',
      text: 'Before typing, write the process as numbered sentences. Then turn each sentence into a comment and write one or two lines of code under it. You are never facing a blank screen: you are always translating one small sentence.',
    },
    { kind: 'heading', text: 'The phrasebook' },
    {
      kind: 'table',
      headers: ['When the plan says…', 'Java', 'Python'],
      rows: [
        ['for each number in the array', '`for (int x : nums)`', '`for x in nums:`'],
        ['for each position `i`', '`for (int i = 0; i < n; i++)`', '`for i in range(n):`'],
        ['if it is even', '`if (x % 2 == 0)`', '`if x % 2 == 0:`'],
        ['add it to the total', '`total += x;`', '`total += x`'],
        ['count it', '`count++;`', '`count += 1`'],
        ['keep the bigger one', '`best = Math.max(best, x);`', '`best = max(best, x)`'],
        ['stop as soon as you find it', '`return x;` or `break;`', '`return x` or `break`'],
        ['repeat while `n` is above zero', '`while (n > 0)`', '`while n > 0:`'],
        ['swap `a` and `b`', '`int t = a; a = b; b = t;`', '`a, b = b, a`'],
        ['the last digit of `n`', '`n % 10`', '`n % 10`'],
        ['remove the last digit', '`n = n / 10;`', '`n = n // 10`'],
      ],
      caption: 'About fifteen phrases cover most beginner programs. Learn them until you stop thinking about them.',
    },
    ...exercise({
      title: 'Exercise 1: Sum of an array',
      problem: 'Return the sum of all numbers in an array. `[3, 8, 2]` gives `13`.',
      byHand: 'You keep a running total in your head. It starts at 0, and you add each number as you read it: 3, then 11, then 13.',
      plan: ['Start a total at zero.', 'For each number in the array…', '…add it to the total.', 'Return the total.'],
      java: `int arraySum(int[] nums) {
    // 1. Start a total at zero: nothing has been added yet.
    int total = 0;
    // 2. For each number in the array...
    for (int x : nums) {
        // 3. ...add it to the total.
        total += x;
    }
    // 4. Return the total.
    return total;
}`,
      python: `def array_sum(nums: list[int]) -> int:
    # 1. Start a total at zero: nothing has been added yet.
    total = 0
    # 2. For each number in the array...
    for x in nums:
        # 3. ...add it to the total.
        total += x
    # 4. Return the total.
    return total`,
    }),
    ...exercise({
      title: 'Exercise 2: Count the even numbers',
      problem: 'Return how many numbers in the array are even. `[4, 7, 10, 3, 6]` gives `3`.',
      byHand: 'You read each number, ask "is it even?", and if so you raise one finger. At the end you count your fingers.',
      plan: [
        'Start a count at zero.',
        'For each number in the array…',
        '…if it is even (dividing by 2 leaves no remainder)…',
        '…count it.',
        'Return the count.',
      ],
      java: `int countEven(int[] nums) {
    // 1. Start a count at zero.
    int count = 0;
    // 2. For each number in the array...
    for (int x : nums) {
        // 3. ...if dividing by 2 leaves no remainder, it is even...
        if (x % 2 == 0) {
            // 4. ...so count it.
            count++;
        }
    }
    // 5. Return the count.
    return count;
}`,
      python: `def count_even(nums: list[int]) -> int:
    # 1. Start a count at zero.
    count = 0
    # 2. For each number in the array...
    for x in nums:
        # 3. ...if dividing by 2 leaves no remainder, it is even...
        if x % 2 == 0:
            # 4. ...so count it.
            count += 1
    # 5. Return the count.
    return count`,
    }),
    ...exercise({
      title: 'Exercise 3: Average of the marks',
      problem: 'Return the average of a list of marks as a decimal. `[70, 85, 90]` gives `81.666…`. An empty list gives `0`.',
      byHand: 'Add the marks up (245), count them (3), divide: 245 ÷ 3 = 81.67. If there are no marks, there is nothing to divide, so the answer is 0.',
      plan: [
        'If there are no marks, return 0, because dividing by zero is not allowed.',
        'Add up all the marks.',
        'Divide the total by how many marks there are, as a decimal.',
        'Return the result.',
      ],
      java: `double average(int[] marks) {
    // 1. No marks: there is nothing to divide, and dividing by zero would crash.
    if (marks.length == 0) {
        return 0;
    }
    // 2. Add up all the marks.
    int total = 0;
    for (int mark : marks) {
        total += mark;
    }
    // 3. Divide as a decimal. Without (double), 245 / 3 would be 81, not 81.67.
    return (double) total / marks.length;
}`,
      python: `def average(marks: list[int]) -> float:
    # 1. No marks: there is nothing to divide, and dividing by zero would crash.
    if len(marks) == 0:
        return 0
    # 2. Add up all the marks.
    total = 0
    for mark in marks:
        total += mark
    # 3. Divide. In Python, / always gives a decimal (// would round down).
    return total / len(marks)`,
    }),
    {
      kind: 'callout',
      tone: 'trap',
      text: 'In Java, dividing one `int` by another throws away the decimals: `7 / 2` is `3`, not `3.5`. Convert one side to `double` first: `(double) total / count`. Python\'s `/` always gives a decimal; `//` is the one that rounds down.',
    },
    {
      kind: 'check',
      question: 'Your turn: write the English plan for "return the product of all numbers in an array".',
      answer: '1. Start the product at **1**, not 0, because anything multiplied by 0 stays 0. 2. For each number, multiply it into the product. 3. Return the product. Choosing the right starting value is half of every "running total" problem.',
    },
    {
      kind: 'check',
      question: 'Your turn: plan "return how many numbers are between 10 and 20, inclusive".',
      answer: '1. Start a count at 0. 2. For each number… 3. …if it is at least 10 **and** at most 20 (`x >= 10 && x <= 20`; Python: `10 <= x <= 20`)… 4. …count it. 5. Return the count.',
    },
  ],
};

const RUNNING_MEMORY: CourseLesson = {
  slug: 'loops-that-remember',
  title: 'Loops that remember',
  tagline:
    'Most loops carry a small memory from one turn to the next: a total, a count, the best so far. Choosing that memory is the whole design.',
  topic: 'foundations',
  minutes: 13,
  practice: [],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'A loop forgets everything at the end of each turn, except the variables declared **outside** it. Those variables are the loop\'s memory. Most beginner problems are solved by choosing what to remember and how each element changes it.',
    },
    { kind: 'heading', text: 'Three questions for every loop' },
    {
      kind: 'steps',
      items: [
        { title: 'What do I need to remember?', text: 'A total? A count? The largest so far? Its position?' },
        { title: 'What does it start as?', text: 'The value that is correct before you have looked at anything.' },
        { title: 'How does each element change it?', text: 'This becomes the body of the loop.' },
      ],
    },
    {
      kind: 'table',
      headers: ['Task', 'Remember', 'Starts as', 'Each element…'],
      rows: [
        ['Sum', '`total`', '`0`', '`total += x`'],
        ['Count the positives', '`count`', '`0`', 'if `x > 0`: `count++`'],
        ['Largest value', '`best`', 'the first element', 'if `x > best`: `best = x`'],
        ['Is every value positive?', '`allPositive`', '`true`', 'if `x <= 0`: `allPositive = false`'],
        ['Position of the largest', '`bestIndex`', '`0`', 'if `nums[i] > nums[bestIndex]`: `bestIndex = i`'],
      ],
    },
    ...exercise({
      title: 'Exercise 1: The largest number',
      problem: 'Return the largest number in a non-empty array. `[3, -2, 9, 4]` gives `9`.',
      byHand: 'You look at the first number and think "3 is the biggest so far". Then -2: no. 9: yes, now 9 is the biggest. 4: no. Answer 9.',
      plan: [
        'Assume the first number is the largest.',
        'For each number in the array…',
        '…if it is bigger than the largest so far…',
        '…remember it as the new largest.',
        'Return the largest.',
      ],
      java: `int largest(int[] nums) {
    // 1. Before comparing anything, the first number is the best we know.
    //    (Starting at 0 would be wrong for an array like [-5, -2].)
    int best = nums[0];
    // 2. For each number in the array...
    for (int x : nums) {
        // 3. ...if it beats the best so far...
        if (x > best) {
            // 4. ...it becomes the new best.
            best = x;
        }
    }
    // 5. After seeing every number, best is the largest.
    return best;
}`,
      python: `def largest(nums: list[int]) -> int:
    # 1. Before comparing anything, the first number is the best we know.
    #    (Starting at 0 would be wrong for a list like [-5, -2].)
    best = nums[0]
    # 2. For each number in the list...
    for x in nums:
        # 3. ...if it beats the best so far...
        if x > best:
            # 4. ...it becomes the new best.
            best = x
    # 5. After seeing every number, best is the largest.
    return best`,
    }),
    ...exercise({
      title: 'Exercise 2: The second largest number',
      problem: 'Return the second largest *different* value. `[5, 9, 2, 9, 7]` gives `7` (the two 9s count once). Assume at least two different values exist.',
      byHand: 'Keep two things in mind: the champion and the runner-up. When a new number beats the champion, the old champion drops to runner-up. When it is between them (and not equal to the champion), it becomes the runner-up.',
      plan: [
        'Remember two values: the largest and the second largest. Start both lower than any possible number.',
        'For each number…',
        '…if it beats the largest: the old largest becomes second, and this number becomes largest.',
        '…otherwise, if it beats the second and is not equal to the largest: it becomes second.',
        'Return the second.',
      ],
      java: `int secondLargest(int[] nums) {
    // 1. Two memories. MIN_VALUE is lower than any int, so any real number beats it.
    int first = Integer.MIN_VALUE;
    int second = Integer.MIN_VALUE;
    // 2. For each number...
    for (int x : nums) {
        if (x > first) {
            // 3. A new champion: the old champion drops to second place...
            second = first;
            // ...and x takes first place.
            first = x;
        } else if (x > second && x != first) {
            // 4. Between the two, and not a tie with the champion: new runner-up.
            second = x;
        }
    }
    // 5. The runner-up is the answer.
    return second;
}`,
      python: `def second_largest(nums: list[int]) -> int:
    # 1. Two memories. -infinity is lower than any number, so any real number beats it.
    first = second = float("-inf")
    # 2. For each number...
    for x in nums:
        if x > first:
            # 3. A new champion: the old champion drops to second place,
            #    and x takes first place.
            second, first = first, x
        elif x > second and x != first:
            # 4. Between the two, and not a tie with the champion: new runner-up.
            second = x
    # 5. The runner-up is the answer.
    return second`,
    }),
    ...exercise({
      title: 'Exercise 3: How many marks are above average?',
      problem: 'Return how many marks are strictly above the average. `[40, 80, 60, 100]` has average 70, so the answer is `2` (80 and 100).',
      byHand: 'You cannot know whether 40 is above average until you have seen all the marks. So you go through the list twice: once to find the average, once to count.',
      plan: [
        'First pass: add all marks and divide by how many there are. That is the average.',
        'Second pass: start a count at zero.',
        'For each mark, if it is greater than the average, count it.',
        'Return the count.',
      ],
      java: `int aboveAverage(int[] marks) {
    // 1. First pass: we need the average before we can compare anything to it.
    int total = 0;
    for (int mark : marks) {
        total += mark;
    }
    // (double) keeps the decimals: 245 / 4 must be 61.25, not 61.
    double average = (double) total / marks.length;

    // 2. Second pass: a fresh count.
    int count = 0;
    // 3. For each mark, if it is above the average, count it.
    for (int mark : marks) {
        if (mark > average) {
            count++;
        }
    }
    // 4. Return the count.
    return count;
}`,
      python: `def above_average(marks: list[int]) -> int:
    # 1. First pass: we need the average before we can compare anything to it.
    total = 0
    for mark in marks:
        total += mark
    average = total / len(marks)

    # 2. Second pass: a fresh count.
    count = 0
    # 3. For each mark, if it is above the average, count it.
    for mark in marks:
        if mark > average:
            count += 1
    # 4. Return the count.
    return count`,
    }),
    {
      kind: 'callout',
      tone: 'key',
      text: 'Needing two passes is not a failure. When a decision depends on something you only know at the end (the average, the total, the largest), compute that first, then loop again. Two passes is still `O(n)`.',
    },
    {
      kind: 'callout',
      tone: 'trap',
      text: 'Starting "largest so far" at `0` looks right and passes most tests, then fails on `[-5, -3, -8]`, where it returns 0, a number that is not even in the array. Start from the first element, or from the smallest possible value.',
    },
    {
      kind: 'check',
      question: 'Your turn: return the **position** (index) of the smallest number. What do you remember, and what does it start as?',
      answer: 'Remember `bestIndex`, starting at `0`. For each `i` from 1 onward, if `nums[i] < nums[bestIndex]`, set `bestIndex = i`. You do not need to remember the value separately, because `nums[bestIndex]` is it.',
    },
  ],
};

const CONDITIONS: CourseLesson = {
  slug: 'deciding-at-every-step',
  title: 'Deciding at every step',
  tagline:
    'An if is a question about the current value. Most condition bugs come from asking the right questions in the wrong order.',
  topic: 'foundations',
  minutes: 12,
  practice: ['fizz-trace'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'With an `if … else if … else` ladder, the computer stops at the **first** question that says yes. So put the most specific question first, and let each later question assume the earlier ones said no.',
    },
    { kind: 'heading', text: 'Turning words into conditions' },
    {
      kind: 'table',
      headers: ['The problem says…', 'Java', 'Python'],
      rows: [
        ['`x` is divisible by 3', '`x % 3 == 0`', '`x % 3 == 0`'],
        ['`x` is between 10 and 20', '`x >= 10 && x <= 20`', '`10 <= x <= 20`'],
        ['`x` is outside 1 to 100', '`x < 1 || x > 100`', '`x < 1 or x > 100`'],
        ['both are true', '`a && b`', '`a and b`'],
        ['at least one is true', '`a || b`', '`a or b`'],
        ['it is not true', '`!a`', '`not a`'],
      ],
    },
    ...exercise({
      title: 'Exercise 1: FizzBuzz',
      problem: 'For each number from 1 to `n`: if it is divisible by both 3 and 5 write `FizzBuzz`, by 3 only `Fizz`, by 5 only `Buzz`, otherwise the number itself. Return the list.',
      byHand: 'Try 15 first. It is divisible by 3, so if you ask "divisible by 3?" first you would write Fizz, which is wrong. So "both 3 and 5" must be asked before either one alone.',
      plan: [
        'Make an empty list for the answers.',
        'For each number from 1 to n…',
        '…if divisible by both 3 and 5, add "FizzBuzz" (most specific, so first).',
        '…else if divisible by 3, add "Fizz".',
        '…else if divisible by 5, add "Buzz".',
        '…else add the number as text.',
        'Return the list.',
      ],
      java: `List<String> fizzBuzz(int n) {
    // 1. A list to collect one answer per number.
    List<String> out = new ArrayList<>();
    // 2. For each number from 1 to n (note <=, because n is included)...
    for (int i = 1; i <= n; i++) {
        if (i % 3 == 0 && i % 5 == 0) {
            // 3. Most specific rule first, or 15 would stop at "Fizz".
            out.add("FizzBuzz");
        } else if (i % 3 == 0) {
            // 4. Reaching here means "not both", so only 3 divides it.
            out.add("Fizz");
        } else if (i % 5 == 0) {
            // 5. Not both, not 3, so only 5 divides it.
            out.add("Buzz");
        } else {
            // 6. None of the rules matched: the number itself.
            out.add(String.valueOf(i));
        }
    }
    // 7. Return the list.
    return out;
}`,
      python: `def fizz_buzz(n: int) -> list[str]:
    # 1. A list to collect one answer per number.
    out = []
    # 2. For each number from 1 to n (range stops before n + 1, so n is included)...
    for i in range(1, n + 1):
        if i % 3 == 0 and i % 5 == 0:
            # 3. Most specific rule first, or 15 would stop at "Fizz".
            out.append("FizzBuzz")
        elif i % 3 == 0:
            # 4. Reaching here means "not both", so only 3 divides it.
            out.append("Fizz")
        elif i % 5 == 0:
            # 5. Not both, not 3, so only 5 divides it.
            out.append("Buzz")
        else:
            # 6. None of the rules matched: the number itself.
            out.append(str(i))
    # 7. Return the list.
    return out`,
    }),
    ...exercise({
      title: 'Exercise 2: Is it a leap year?',
      problem: 'A year is a leap year if it is divisible by 4, except years divisible by 100, except again years divisible by 400. So 2024 is, 1900 is not, 2000 is.',
      byHand: 'Test 2000: divisible by 400, so leap, done. If you had asked "divisible by 100?" first, you would have said "not leap": wrong. The exceptions are more specific, so they come first, starting with the most specific one.',
      plan: [
        'If divisible by 400: leap.',
        'Else if divisible by 100: not leap.',
        'Else if divisible by 4: leap.',
        'Otherwise: not leap.',
      ],
      java: `boolean isLeap(int year) {
    // 1. The rarest, most specific rule first: every 400 years IS a leap year.
    if (year % 400 == 0) {
        return true;
    }
    // 2. Here we know it is not a multiple of 400, so a multiple of 100 is NOT leap.
    if (year % 100 == 0) {
        return false;
    }
    // 3. Not a century year at all, so the ordinary rule applies.
    if (year % 4 == 0) {
        return true;
    }
    // 4. None of the rules made it a leap year.
    return false;
}`,
      python: `def is_leap(year: int) -> bool:
    # 1. The rarest, most specific rule first: every 400 years IS a leap year.
    if year % 400 == 0:
        return True
    # 2. Here we know it is not a multiple of 400, so a multiple of 100 is NOT leap.
    if year % 100 == 0:
        return False
    # 3. Not a century year at all, so the ordinary rule applies.
    if year % 4 == 0:
        return True
    # 4. None of the rules made it a leap year.
    return False`,
    }),
    ...exercise({
      title: 'Exercise 3: Grade from marks',
      problem: 'Marks 90 and above get `A`, 75–89 `B`, 60–74 `C`, 40–59 `D`, below 40 `F`. Anything below 0 or above 100 is `Invalid`.',
      byHand: 'For 82: is it invalid? No. Is it 90 or more? No. Is it 75 or more? Yes, so B. Notice you never asked "is it below 90?" for B: you already knew, because the 90 question said no.',
      plan: [
        'If the marks are outside 0–100, return "Invalid".',
        'If 90 or more, return "A".',
        'If 75 or more (and so below 90), return "B".',
        'If 60 or more, return "C".',
        'If 40 or more, return "D".',
        'Otherwise return "F".',
      ],
      java: `String grade(int marks) {
    // 1. Reject impossible input before grading it.
    if (marks < 0 || marks > 100) {
        return "Invalid";
    }
    // 2. Highest band first. Each later check can assume the ones above failed.
    if (marks >= 90) return "A";
    // 3. We only get here if marks < 90, so ">= 75" means 75 to 89.
    if (marks >= 75) return "B";
    // 4. Here marks < 75.
    if (marks >= 60) return "C";
    // 5. Here marks < 60.
    if (marks >= 40) return "D";
    // 6. Everything left is below 40.
    return "F";
}`,
      python: `def grade(marks: int) -> str:
    # 1. Reject impossible input before grading it.
    if marks < 0 or marks > 100:
        return "Invalid"
    # 2. Highest band first. Each later check can assume the ones above failed.
    if marks >= 90:
        return "A"
    # 3. We only get here if marks < 90, so ">= 75" means 75 to 89.
    if marks >= 75:
        return "B"
    # 4. Here marks < 75.
    if marks >= 60:
        return "C"
    # 5. Here marks < 60.
    if marks >= 40:
        return "D"
    # 6. Everything left is below 40.
    return "F"`,
    }),
    {
      kind: 'callout',
      tone: 'trap',
      text: 'Writing separate `if`s where you meant `else if`. With separate `if`s, a number like 15 can match several rules and get several answers. When only one rule should apply, chain them with `else if` (`elif`) or `return` as soon as one matches.',
    },
    {
      kind: 'check',
      question: 'Your turn: return "positive", "negative" or "zero" for a number. In what order would you ask, and how many conditions do you need?',
      answer: 'Two conditions are enough: `if x > 0` → "positive", `else if x < 0` → "negative", `else` → "zero". The last case needs no test, because it is whatever is left.',
    },
  ],
};

const DIGITS: CourseLesson = {
  slug: 'taking-a-number-apart',
  title: 'Taking a number apart',
  tagline:
    'n % 10 gives the last digit and n / 10 removes it. Repeat until nothing is left, and you have visited every digit.',
  topic: 'mathematics',
  minutes: 12,
  practice: ['count-digits'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'Dividing by 10 shifts a number one place to the right. The remainder (`% 10`) is the digit that fell off; the quotient (`/ 10`, or `// 10` in Python) is what is left. Loop until the number reaches 0.',
    },
    {
      kind: 'diagram',
      art: `n       n % 10   n / 10
4729      9       472
 472      2        47
  47      7         4
   4      4         0   <- stop: nothing left`,
      caption: 'Digits come out from the right: 9, 2, 7, 4.',
    },
    ...exercise({
      title: 'Exercise 1: Sum of the digits',
      problem: 'Return the sum of the digits of a non-negative number. `4729` gives `4 + 7 + 2 + 9 = 22`.',
      byHand: 'Take off the last digit (9), add it to a total, cross it out. Repeat with what is left (472) until nothing is left.',
      plan: ['Start a total at zero.', 'While the number is above zero…', '…add its last digit to the total…', '…and remove that digit.', 'Return the total.'],
      java: `int digitSum(int n) {
    // 1. Nothing added yet.
    int total = 0;
    // 2. While there are digits left...
    while (n > 0) {
        // 3. ...n % 10 is the last digit: add it.
        total += n % 10;
        // 4. ...dividing by 10 drops that digit (int division throws away the remainder).
        n = n / 10;
    }
    // 5. Every digit has been added.
    return total;
}`,
      python: `def digit_sum(n: int) -> int:
    # 1. Nothing added yet.
    total = 0
    # 2. While there are digits left...
    while n > 0:
        # 3. ...n % 10 is the last digit: add it.
        total += n % 10
        # 4. ...// drops that digit. (Plain / would give a decimal like 472.9.)
        n = n // 10
    # 5. Every digit has been added.
    return total`,
    }),
    ...exercise({
      title: 'Exercise 2: Reverse a number',
      problem: 'Return the number with its digits reversed. `4729` gives `9274`.',
      byHand: 'Digits come off the right end in the order 9, 2, 7, 4, which is exactly the reversed order. Build the answer by "appending" each one: 9, then 92, then 927, then 9274. Appending a digit to a number means multiplying by 10 and adding it.',
      plan: [
        'Start the reversed number at zero.',
        'While the number is above zero…',
        '…take its last digit…',
        '…append it to the reversed number (times 10, plus the digit)…',
        '…and remove it from the number.',
        'Return the reversed number.',
      ],
      java: `int reverseNumber(int n) {
    // 1. Empty so far.
    int reversed = 0;
    // 2. While digits remain...
    while (n > 0) {
        // 3. ...take the last digit.
        int digit = n % 10;
        // 4. ...shift reversed one place left and put the digit in the empty spot:
        //    92 * 10 + 7 = 927.
        reversed = reversed * 10 + digit;
        // 5. ...and drop the digit from n.
        n = n / 10;
    }
    // 6. Done.
    return reversed;
}`,
      python: `def reverse_number(n: int) -> int:
    # 1. Empty so far.
    reversed_n = 0
    # 2. While digits remain...
    while n > 0:
        # 3. ...take the last digit.
        digit = n % 10
        # 4. ...shift one place left and put the digit in the empty spot:
        #    92 * 10 + 7 = 927.
        reversed_n = reversed_n * 10 + digit
        # 5. ...and drop the digit from n.
        n = n // 10
    # 6. Done.
    return reversed_n`,
    }),
    ...exercise({
      title: 'Exercise 3: Is the number a palindrome?',
      problem: 'A palindrome reads the same both ways: `1221` and `7` are, `1231` is not. Negative numbers are not (the minus sign is only on one side).',
      byHand: 'Reverse it and compare with the original. But reversing destroys the number as you go, so write the original down first.',
      plan: [
        'If the number is negative, return false.',
        'Keep a copy of the original.',
        'Reverse the number (exercise 2).',
        'Return whether the reverse equals the copy.',
      ],
      java: `boolean isPalindromeNumber(int n) {
    // 1. "-121" reversed is "121-": never the same.
    if (n < 0) {
        return false;
    }
    // 2. The loop below will shrink n to 0, so keep the original safe.
    int original = n;
    // 3. Reverse, exactly as in exercise 2.
    int reversed = 0;
    while (n > 0) {
        reversed = reversed * 10 + n % 10;
        n = n / 10;
    }
    // 4. Same both ways?
    return reversed == original;
}`,
      python: `def is_palindrome_number(n: int) -> bool:
    # 1. "-121" reversed is "121-": never the same.
    if n < 0:
        return False
    # 2. The loop below will shrink n to 0, so keep the original safe.
    original = n
    # 3. Reverse, exactly as in exercise 2.
    reversed_n = 0
    while n > 0:
        reversed_n = reversed_n * 10 + n % 10
        n = n // 10
    # 4. Same both ways?
    return reversed_n == original`,
    }),
    {
      kind: 'callout',
      tone: 'trap',
      text: 'The `while (n > 0)` loop destroys `n`. If you need the original afterwards, as in the palindrome check, copy it **before** the loop. A related trap: for `n = 0` the loop never runs, so "count the digits" would return 0 instead of 1. Handle 0 on its own.',
    },
    {
      kind: 'check',
      question: 'Your turn: count the digits of a non-negative number (`4729` has 4, `0` has 1). Write the plan.',
      answer: 'If `n` is 0, return 1. Otherwise start a count at 0, and while `n > 0`: add 1 to the count and set `n = n / 10`. Return the count. You never even need the digit itself, only how many times you can remove one.',
    },
  ],
};

export const BASICS_A: CourseLesson[] = [PLAN_FIRST, RUNNING_MEMORY, CONDITIONS, DIGITS];
