import { CourseLesson } from '../course/course.model';
import { exercise } from './build';

const NESTED: CourseLesson = {
  slug: 'nested-loops-and-patterns',
  title: 'Nested loops and patterns',
  tagline:
    'The outer loop picks a row; the inner loop does everything inside that row. A small table from row number to row contents writes the inner loop for you.',
  topic: 'foundations',
  minutes: 13,
  practice: ['classify-loops'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'Star patterns are not a puzzle to memorise. They teach the one skill nested loops need: describing what happens in row `i` using `i`. Make a table with one line per row, spot how the contents depend on the row number, and that formula becomes the inner loop\'s limit.',
    },
    { kind: 'heading', text: 'The method: a row table' },
    {
      kind: 'steps',
      items: [
        { title: 'Draw the output for a small n', text: 'Say `n = 4`. Draw it on paper.' },
        { title: 'Write one line per row', text: 'Row number, then what is in it: how many spaces, how many stars, which numbers.' },
        { title: 'Find the formula', text: 'Row 1 has 1 star, row 2 has 2… so row `i` has `i` stars.' },
        { title: 'Translate', text: 'Outer loop: `i` from 1 to `n`. Inner loop: runs as many times as the formula says. Then end the line.' },
      ],
    },
    ...exercise({
      title: 'Exercise 1: A right triangle',
      problem: 'Print a triangle of `n` rows where row `i` has `i` stars.',
      byHand: 'For `n = 4`: row 1 `*`, row 2 `**`, row 3 `***`, row 4 `****`. The table says: row `i` → `i` stars.',
      plan: ['For each row i from 1 to n…', '…print a star, i times…', '…then move to the next line.'],
      java: `void triangle(int n) {
    // 1. One turn of the outer loop = one row. Rows are numbered 1 to n.
    for (int i = 1; i <= n; i++) {
        // 2. The row table says row i has i stars, so the inner loop runs i times.
        for (int j = 1; j <= i; j++) {
            // print (not println) keeps the stars on the same line.
            System.out.print("*");
        }
        // 3. The row is finished: start a new line.
        System.out.println();
    }
}`,
      python: `def triangle(n: int) -> None:
    # 1. One turn of the outer loop = one row. Rows are numbered 1 to n.
    for i in range(1, n + 1):
        # 2. The row table says row i has i stars, so the inner loop runs i times.
        for j in range(i):
            # end="" keeps the stars on the same line.
            print("*", end="")
        # 3. The row is finished: start a new line.
        print()
    # (Python can also write row i as print("*" * i). Learn the loop first.)`,
    }),
    ...exercise({
      title: 'Exercise 2: A number triangle',
      problem: 'Print `n` rows where row `i` is the numbers 1 to `i`, separated by spaces.',
      byHand: 'For `n = 4`: `1`, `1 2`, `1 2 3`, `1 2 3 4`. Same shape as exercise 1; only what you print changes. Row `i` prints the inner counter `j` instead of a star.',
      plan: ['For each row i from 1 to n…', '…for each j from 1 to i, print j and a space…', '…then move to the next line.'],
      java: `void numberTriangle(int n) {
    // 1. Outer loop: which row.
    for (int i = 1; i <= n; i++) {
        // 2. Inner loop: count 1, 2, ..., i. The counter itself is what we print.
        for (int j = 1; j <= i; j++) {
            System.out.print(j + " ");
        }
        // 3. End the row.
        System.out.println();
    }
}`,
      python: `def number_triangle(n: int) -> None:
    # 1. Outer loop: which row.
    for i in range(1, n + 1):
        # 2. Inner loop: count 1, 2, ..., i. The counter itself is what we print.
        for j in range(1, i + 1):
            print(j, end=" ")
        # 3. End the row.
        print()`,
    }),
    ...exercise({
      title: 'Exercise 3: A centred pyramid',
      problem: 'Print a centred pyramid of `n` rows: one star at the top, two more on each row below, and the last row `2n − 1` stars wide. The row table after the code draws it for `n = 4`.',
      byHand: 'Count spaces and stars in each row for `n = 4`. Row 1: 3 spaces, 1 star. Row 2: 2 spaces, 3 stars. Row 3: 1 space, 5 stars. Row 4: 0 spaces, 7 stars. Spaces go down by one: `n - i`. Stars go up by two: `2 × i - 1`.',
      plan: [
        'For each row i from 1 to n…',
        '…print n − i spaces…',
        '…then print 2 × i − 1 stars…',
        '…then move to the next line.',
      ],
      java: `void pyramid(int n) {
    // 1. One row per turn.
    for (int i = 1; i <= n; i++) {
        // 2. From the row table: row i starts with n - i spaces.
        for (int s = 1; s <= n - i; s++) {
            System.out.print(" ");
        }
        // 3. From the row table: row i has 2 * i - 1 stars (1, 3, 5, 7...).
        for (int k = 1; k <= 2 * i - 1; k++) {
            System.out.print("*");
        }
        // 4. End the row.
        System.out.println();
    }
}`,
      python: `def pyramid(n: int) -> None:
    # 1. One row per turn.
    for i in range(1, n + 1):
        # 2. From the row table: row i starts with n - i spaces.
        for s in range(n - i):
            print(" ", end="")
        # 3. From the row table: row i has 2 * i - 1 stars (1, 3, 5, 7...).
        for k in range(2 * i - 1):
            print("*", end="")
        # 4. End the row.
        print()`,
    }),
    {
      kind: 'diagram',
      art: `row  spaces  stars
 1     3       1         *
 2     2       3        ***
 3     1       5       *****
 4     0       7      *******
     n - i   2i - 1`,
      caption: 'The row table for the pyramid. The bottom line is the inner loops.',
    },
    {
      kind: 'callout',
      tone: 'key',
      text: 'Two loops, one inside the other, each running up to `n`, do about `n × n` steps. That is what `O(n²)` means. Most brute-force solutions in this course are nested loops, and most improvements remove the inner one.',
    },
    {
      kind: 'callout',
      tone: 'trap',
      text: 'Using the wrong limit in the inner loop (`j <= n` instead of `j <= i`) prints a square instead of a triangle. Forgetting the line break after the inner loop prints everything on one line. When a pattern looks wrong, check the row table first, then the limits.',
    },
    {
      kind: 'check',
      question: 'Your turn: an upside-down triangle where row 1 has `n` stars and the last row has 1. How many stars are in row `i`?',
      answer: 'Make the table for `n = 4`: rows 1–4 have 4, 3, 2, 1 stars. That is `n - i + 1`. So the inner loop runs from 1 to `n - i + 1`. Everything else is the same as exercise 1.',
    },
  ],
};

const STRINGS: CourseLesson = {
  slug: 'walking-through-a-string',
  title: 'Walking through a string',
  tagline:
    'A string is an array of characters. Visiting, counting and comparing positions work exactly as they do on an array.',
  topic: 'strings',
  minutes: 12,
  practice: ['valid-palindrome-one-delete'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'Treat a string as an array of characters: `s.charAt(i)` in Java, `s[i]` in Python, with positions from `0` to `length - 1`. Everything you learned about loops over arrays applies unchanged.',
    },
    ...exercise({
      title: 'Exercise 1: Count the vowels',
      problem: 'Return how many vowels (a, e, i, o, u, in either case) a string contains. `"Programming"` gives `3`.',
      byHand: 'Read each letter; if it is one of a, e, i, o, u, raise a finger. Capital letters count too, so compare the lower-case version.',
      plan: ['Start a count at zero.', 'For each character…', '…turn it to lower case…', '…if it is one of "aeiou", count it.', 'Return the count.'],
      java: `int countVowels(String s) {
    // 1. Nothing counted yet.
    int count = 0;
    // 2. Visit every character, position by position.
    for (int i = 0; i < s.length(); i++) {
        // 3. Lower-case it so 'A' and 'a' are treated the same.
        char c = Character.toLowerCase(s.charAt(i));
        // 4. indexOf returns -1 when c is not in "aeiou", so >= 0 means "is a vowel".
        if ("aeiou".indexOf(c) >= 0) {
            count++;
        }
    }
    // 5. Return the count.
    return count;
}`,
      python: `def count_vowels(s: str) -> int:
    # 1. Nothing counted yet.
    count = 0
    # 2. Visit every character.
    for c in s:
        # 3. Lower-case it so "A" and "a" are treated the same,
        # 4. then "in" checks whether it is one of the five vowels.
        if c.lower() in "aeiou":
            count += 1
    # 5. Return the count.
    return count`,
    }),
    ...exercise({
      title: 'Exercise 2: Reverse a string',
      problem: 'Return the string backwards. `"hello"` gives `"olleh"`.',
      byHand: 'Start at the last letter and read towards the first, writing each letter down: o, l, l, e, h.',
      plan: ['Start with an empty result.', 'For each position from the last down to the first…', '…append that character to the result.', 'Return the result.'],
      java: `String reverse(String s) {
    // 1. StringBuilder grows in place. Adding to a String with + copies the
    //    whole string every time, which gets slow for long strings.
    StringBuilder out = new StringBuilder();
    // 2. Walk backwards: from the last index (length - 1) down to 0.
    for (int i = s.length() - 1; i >= 0; i--) {
        // 3. Append the character at this position.
        out.append(s.charAt(i));
    }
    // 4. Turn the builder back into a String.
    return out.toString();
}`,
      python: `def reverse(s: str) -> str:
    # 1. Collect characters in a list; joining once at the end is faster
    #    than adding to a string over and over.
    out = []
    # 2. Walk backwards: from the last index (len - 1) down to 0.
    for i in range(len(s) - 1, -1, -1):
        # 3. Add the character at this position.
        out.append(s[i])
    # 4. Glue the characters into one string.
    return "".join(out)
    # (Python's shortcut is s[::-1]. Know the loop first.)`,
    }),
    ...exercise({
      title: 'Exercise 3: Is it a palindrome?',
      problem: 'Return whether a string reads the same both ways. `"racecar"` is, `"rocket"` is not.',
      byHand: 'Put one finger on the first letter and one on the last. Same? Move both fingers inward and compare again. If any pair differs, it is not a palindrome. When the fingers meet, it is.',
      plan: [
        'Put one index at the start and one at the end.',
        'While the start index is before the end index…',
        '…if the two characters differ, return false.',
        '…otherwise move both one step inward.',
        'If the loop finishes, return true.',
      ],
      java: `boolean isPalindrome(String s) {
    // 1. Two fingers: one on each end.
    int left = 0;
    int right = s.length() - 1;
    // 2. Keep going until the fingers meet in the middle.
    while (left < right) {
        // 3. One mismatched pair is enough to say no.
        if (s.charAt(left) != s.charAt(right)) {
            return false;
        }
        // 4. This pair matched: move both fingers inward.
        left++;
        right--;
    }
    // 5. Every pair matched.
    return true;
}`,
      python: `def is_palindrome(s: str) -> bool:
    # 1. Two fingers: one on each end.
    left, right = 0, len(s) - 1
    # 2. Keep going until the fingers meet in the middle.
    while left < right:
        # 3. One mismatched pair is enough to say no.
        if s[left] != s[right]:
            return False
        # 4. This pair matched: move both fingers inward.
        left += 1
        right -= 1
    # 5. Every pair matched.
    return True`,
    }),
    {
      kind: 'callout',
      tone: 'key',
      text: 'Exercise 3 used two indices moving towards each other. That is the **two pointers** pattern, and it gets its own lesson later. You already know it.',
    },
    {
      kind: 'callout',
      tone: 'trap',
      text: 'In Java, compare two `String`s with `a.equals(b)`, not `a == b`. `==` asks "is this the same object in memory?" and can be false for two strings with identical letters. Single characters (`char`) are fine with `==`.',
    },
    {
      kind: 'check',
      question: 'Your turn: return how many times a character `c` appears in a string `s`.',
      answer: 'Count starts at 0. For each position `i`, if `s.charAt(i) == c` (Python: `s[i] == c`), add 1. Return the count. It is the "count the even numbers" exercise again, on characters.',
    },
  ],
};

const IN_PLACE: CourseLesson = {
  slug: 'changing-an-array-in-place',
  title: 'Changing an array in place',
  tagline:
    'Rearranging the array you were given, without making a new one. Two tools do most of the work: a swap, and an index that says where to write next.',
  topic: 'arrays',
  minutes: 13,
  practice: ['reverse-array-in-place', 'swap-without-temp', 'rotate-array', 'sort-colours'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: '"In place" means using the array itself as your workspace, with only a few extra variables. Interviewers ask for it because it shows you can move values around without losing any. The two tools: **swap two positions**, and a **write index** that marks where the next kept value goes.',
    },
    ...exercise({
      title: 'Exercise 1: Reverse an array in place',
      problem: 'Reverse the array itself. `[1, 2, 3, 4, 5]` becomes `[5, 4, 3, 2, 1]`.',
      byHand: 'Swap the first and last, then the second and second-last, moving inward. Stop when you reach the middle; going further would swap them back.',
      plan: [
        'One index at the start, one at the end.',
        'While start is before end…',
        '…swap the two values (using a temporary variable)…',
        '…move both indices inward.',
      ],
      java: `void reverseInPlace(int[] nums) {
    // 1. Two indices, one at each end.
    int left = 0;
    int right = nums.length - 1;
    // 2. Stop at the middle; past it we would undo our own swaps.
    while (left < right) {
        // 3. Swap. Save one value first, or the first assignment would lose it.
        int temp = nums[left];
        nums[left] = nums[right];
        nums[right] = temp;
        // 4. Both ends are now correct: move inward.
        left++;
        right--;
    }
}`,
      python: `def reverse_in_place(nums: list[int]) -> None:
    # 1. Two indices, one at each end.
    left, right = 0, len(nums) - 1
    # 2. Stop at the middle; past it we would undo our own swaps.
    while left < right:
        # 3. Swap. Python evaluates the right side first, so no temp is needed.
        nums[left], nums[right] = nums[right], nums[left]
        # 4. Both ends are now correct: move inward.
        left += 1
        right -= 1`,
    }),
    ...exercise({
      title: 'Exercise 2: Rotate left by one',
      problem: 'Move every value one place to the left, and the first value to the end. `[1, 2, 3, 4]` becomes `[2, 3, 4, 1]`.',
      byHand: 'Pick up the first value and hold it. Slide every other value one step left. Put the held value in the empty last slot.',
      plan: [
        'Save the first value.',
        'For each position from 0 to the second-last…',
        '…copy the value from the next position into it.',
        'Put the saved value in the last position.',
      ],
      java: `void rotateLeftByOne(int[] nums) {
    if (nums.length == 0) return;
    // 1. Hold the first value: the shifting below will overwrite position 0.
    int first = nums[0];
    // 2. Shift left. Going left to right is safe: each value is read before it
    //    is overwritten.
    for (int i = 0; i < nums.length - 1; i++) {
        // 3. The value one step to the right moves here.
        nums[i] = nums[i + 1];
    }
    // 4. The held value fills the gap at the end.
    nums[nums.length - 1] = first;
}`,
      python: `def rotate_left_by_one(nums: list[int]) -> None:
    if not nums:
        return
    # 1. Hold the first value: the shifting below will overwrite position 0.
    first = nums[0]
    # 2. Shift left. Going left to right is safe: each value is read before it
    #    is overwritten.
    for i in range(len(nums) - 1):
        # 3. The value one step to the right moves here.
        nums[i] = nums[i + 1]
    # 4. The held value fills the gap at the end.
    nums[-1] = first`,
    }),
    ...exercise({
      title: 'Exercise 3: Move zeros to the end',
      problem: 'Move all zeros to the end, keeping the other values in their original order. `[0, 3, 0, 5, 7]` becomes `[3, 5, 7, 0, 0]`.',
      byHand: 'Imagine rewriting the array from the left, copying over only the non-zero values: 3, 5, 7. You wrote 3 values, so positions 3 and 4 are left over; fill them with zeros.',
      plan: [
        'Keep a write index, starting at 0: where the next non-zero value goes.',
        'For each value…',
        '…if it is not zero, write it at the write index and move the write index on.',
        'Fill every position from the write index to the end with zero.',
      ],
      java: `void moveZeros(int[] nums) {
    // 1. Where the next non-zero value should be written.
    int write = 0;
    // 2. Read every value, left to right.
    for (int read = 0; read < nums.length; read++) {
        // 3. Keep non-zeros, in order, packed at the front.
        if (nums[read] != 0) {
            nums[write] = nums[read];
            write++;
        }
    }
    // 4. Everything from write onwards is leftover space: fill it with zeros.
    while (write < nums.length) {
        nums[write] = 0;
        write++;
    }
}`,
      python: `def move_zeros(nums: list[int]) -> None:
    # 1. Where the next non-zero value should be written.
    write = 0
    # 2. Read every value, left to right.
    for read in range(len(nums)):
        # 3. Keep non-zeros, in order, packed at the front.
        if nums[read] != 0:
            nums[write] = nums[read]
            write += 1
    # 4. Everything from write onwards is leftover space: fill it with zeros.
    while write < len(nums):
        nums[write] = 0
        write += 1`,
    }),
    {
      kind: 'callout',
      tone: 'key',
      text: 'The write index never overtakes the read index, so writing never destroys a value that has not been read yet. That one fact is why "keep some values, drop others" can be done in place.',
    },
    {
      kind: 'callout',
      tone: 'trap',
      text: 'Swapping with `a = b; b = a;` loses `a`: after the first line both hold `b`. Save one value in a temporary variable first (Python\'s `a, b = b, a` does that for you). The same trap appears when shifting: shift left by walking left to right, and shift right by walking right to left.',
    },
    {
      kind: 'check',
      question: 'Your turn: remove every copy of a value `v` from an array in place, and return how many values are left.',
      answer: 'Exactly exercise 3 without the filling step: a write index from 0; for each value that is **not** `v`, write it at `write` and increase `write`. At the end `write` is the number of values kept.',
    },
  ],
};

const FUNCTIONS: CourseLesson = {
  slug: 'small-functions',
  title: 'Break it into small functions',
  tagline:
    'When a problem feels too big, split it into steps, give each step a function, and solve the steps one at a time.',
  topic: 'foundations',
  minutes: 13,
  practice: ['count-primes', 'gcd-of-array'],
  blocks: [
    {
      kind: 'callout',
      tone: 'note',
      title: 'In plain words',
      text: 'A function is a named step with an input and an output. "Print all primes up to 50" is hard to hold in your head at once. "Is this one number prime?" is easy. Write the easy question as a function, test it, then use it.',
    },
    ...exercise({
      title: 'Exercise 1: Is a number prime?',
      problem: 'A prime is a number greater than 1 whose only divisors are 1 and itself. Return whether `n` is prime. `13` is, `15` is not (3 × 5).',
      byHand: 'Try dividing 37 by 2, 3, 4, 5, 6. Nothing works. Do you need to try 7? 7 × 7 = 49 is already bigger than 37. If 37 had a divisor bigger than 6, its partner would be smaller than 6, and you already tried all of those. So you can stop at the square root.',
      plan: [
        'Numbers below 2 are not prime.',
        'For each divisor d starting at 2, while d × d is at most n…',
        '…if d divides n, it is not prime.',
        'If no divisor was found, it is prime.',
      ],
      java: `boolean isPrime(int n) {
    // 1. 0, 1 and negatives are not prime by definition.
    if (n < 2) {
        return false;
    }
    // 2. Divisors come in pairs (d and n / d), and one of each pair is at most
    //    the square root. So once d * d > n, every pair has been tested.
    for (int d = 2; d * d <= n; d++) {
        // 3. Found a divisor other than 1 and n: not prime.
        if (n % d == 0) {
            return false;
        }
    }
    // 4. Nothing divided it.
    return true;
}`,
      python: `def is_prime(n: int) -> bool:
    # 1. 0, 1 and negatives are not prime by definition.
    if n < 2:
        return False
    # 2. Divisors come in pairs (d and n // d), and one of each pair is at most
    #    the square root. So once d * d > n, every pair has been tested.
    d = 2
    while d * d <= n:
        # 3. Found a divisor other than 1 and n: not prime.
        if n % d == 0:
            return False
        d += 1
    # 4. Nothing divided it.
    return True`,
    }),
    ...exercise({
      title: 'Exercise 2: Every prime up to n',
      problem: 'Return a list of all primes from 2 to `n`. For `20`: `[2, 3, 5, 7, 11, 13, 17, 19]`.',
      byHand: 'Go through 2, 3, 4, … 20 and ask the exercise 1 question about each one. You already know how to answer it, so this problem is just a loop around it.',
      plan: ['Make an empty list.', 'For each number from 2 to n…', '…if isPrime says yes, add it to the list.', 'Return the list.'],
      java: `List<Integer> primesUpTo(int n) {
    // 1. Collect the answers here.
    List<Integer> primes = new ArrayList<>();
    // 2. Ask about every candidate from 2 to n.
    for (int x = 2; x <= n; x++) {
        // 3. The hard part is already solved and tested: just call it.
        if (isPrime(x)) {
            primes.add(x);
        }
    }
    // 4. Done.
    return primes;
}`,
      python: `def primes_up_to(n: int) -> list[int]:
    # 1. Collect the answers here.
    primes = []
    # 2. Ask about every candidate from 2 to n.
    for x in range(2, n + 1):
        # 3. The hard part is already solved and tested: just call it.
        if is_prime(x):
            primes.append(x)
    # 4. Done.
    return primes`,
    }),
    ...exercise({
      title: 'Exercise 3: Add digits until one is left',
      problem: 'Keep replacing a number with the sum of its digits until it has one digit. `9875` → `29` → `11` → `2`.',
      byHand: 'Each step is "sum the digits", which you wrote in an earlier lesson. The new part is only: repeat it while the number has more than one digit, that is, while it is 10 or more.',
      plan: ['While the number is 10 or more…', '…replace it with the sum of its digits (reuse digitSum).', 'Return the number.'],
      java: `int digitSum(int n) {
    // The helper from "Taking a number apart", unchanged.
    int total = 0;
    while (n > 0) {
        total += n % 10;
        n = n / 10;
    }
    return total;
}

int addUntilOneDigit(int n) {
    // 1. Two or more digits means 10 or more.
    while (n >= 10) {
        // 2. One step of the process, done by a function we trust.
        n = digitSum(n);
    }
    // 3. A single digit is left.
    return n;
}`,
      python: `def digit_sum(n: int) -> int:
    # The helper from "Taking a number apart", unchanged.
    total = 0
    while n > 0:
        total += n % 10
        n = n // 10
    return total


def add_until_one_digit(n: int) -> int:
    # 1. Two or more digits means 10 or more.
    while n >= 10:
        # 2. One step of the process, done by a function we trust.
        n = digit_sum(n)
    # 3. A single digit is left.
    return n`,
    }),
    {
      kind: 'callout',
      tone: 'key',
      text: 'Name a function after what it **returns**: `isPrime`, `digitSum`, `largest`. If you cannot name it in two or three words, it is probably doing two jobs, so split it.',
    },
    {
      kind: 'callout',
      tone: 'trap',
      text: 'A function that **prints** its answer cannot be reused: `primesUpTo` could not call an `isPrime` that prints "yes". Return values from functions, and print only at the very end, in one place.',
    },
    {
      kind: 'check',
      question: 'Your turn: a perfect number equals the sum of its divisors other than itself (6 = 1 + 2 + 3). Which functions would you write to list every perfect number up to 10,000?',
      answer: '`sumOfDivisors(n)`: loop `d` from 1 to `n - 1`, adding each `d` that divides `n`. Then `isPerfect(n)`: return `sumOfDivisors(n) == n`. Then a loop from 1 to 10,000 calling `isPerfect`. Each function is three or four lines and can be tested on its own.',
    },
  ],
};

export const BASICS_B: CourseLesson[] = [NESTED, STRINGS, IN_PLACE, FUNCTIONS];
