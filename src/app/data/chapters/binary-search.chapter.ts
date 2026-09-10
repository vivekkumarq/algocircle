import { Chapter } from '../../core/models/chapter.models';

export const BINARY_SEARCH: Chapter = {
  slug: 'binary-search',
  title: 'Binary Search',
  shortTitle: 'Binary Search',
  level: 'Core',
  order: 10,
  stage: 'binary-search',
  readingMinutes: 26,
  summary:
    'Halving a monotonic search space — first over a sorted array, then over the answer itself, which is what turns many "minimise the maximum" problems from impossible into routine.',
  objectives: [
    'Write a binary search that terminates and has no off-by-one error',
    'Implement lower bound and upper bound and say what each returns',
    'Search a rotated sorted array by deciding which half is sorted',
    'Recognise "binary search on the answer" and write the feasibility check',
    'Explain the monotonicity that any binary search depends on',
  ],
  prerequisites: ['arrays', 'complexity'],
  sections: [
    {
      id: 'idea',
      title: 'The idea, and the one requirement',
      blocks: [
        {
          kind: 'para',
          text: 'Binary search needs exactly one thing: a search space that is **monotonic** with respect to your question. Look at the middle, decide which half can be discarded, repeat. Each step halves what is left, so `n` becomes 1 in about `log2(n)` steps.',
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'The array being sorted is not the requirement — it is the most common way of satisfying the requirement. The real condition is that the answer to "is the target to the left or the right?" is consistent everywhere.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Classic search - returns an index, or -1',
          source: `int lo = 0, hi = n - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;         // never lo + hi: that can overflow
    if (a[mid] == target) return mid;
    if (a[mid] < target)  lo = mid + 1;   // target is strictly right
    else                  hi = mid - 1;   // target is strictly left
}
return -1;`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'Three bugs that account for almost all failures',
          text: '`(lo + hi) / 2` overflows for large indices — use `lo + (hi - lo) / 2`. `lo <= hi` versus `lo < hi` changes whether the final single element is examined. And a branch that sets `lo = mid` instead of `mid + 1` can leave the range unchanged, which loops forever.',
        },
      ],
    },
    {
      id: 'invariant',
      title: 'Getting the boundaries right, once',
      blocks: [
        {
          kind: 'para',
          text: 'Rather than memorising variants, keep one invariant in mind and derive the rest. Using a half-open range `[lo, hi)` — `lo` inclusive, `hi` exclusive — removes most of the arithmetic.',
        },
        {
          kind: 'list',
          items: [
            'The answer, if it exists, is always inside `[lo, hi)`.',
            'The loop runs while `lo < hi`; an empty range means `lo == hi`.',
            'The size of the range is simply `hi - lo`.',
            'When the loop ends, `lo == hi` is the boundary you were looking for.',
          ],
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'The half-open form: no -1, no <=',
          source: `int lo = 0, hi = n;                   // hi is exclusive
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (condition(a[mid])) hi = mid;   // mid might be the answer - keep it
    else                   lo = mid + 1;
}
return lo;                             // first index where the condition is true`,
        },
        {
          kind: 'callout',
          tone: 'why',
          text: 'This form finds the **boundary** between "condition false" and "condition true". Nearly every binary search variant is that boundary with a different condition, which is why learning one template beats memorising five.',
        },
      ],
    },
    {
      id: 'bounds',
      title: 'Lower bound, upper bound, and counting',
      blocks: [
        {
          kind: 'table',
          headers: ['Function', 'Condition', 'Returns'],
          rows: [
            ['lower bound', '`a[mid] >= target`', 'first index with a value at least the target'],
            ['upper bound', '`a[mid] > target`', 'first index with a value strictly greater'],
            ['first occurrence', 'lower bound', 'if `a[lo] == target`, that is it'],
            ['last occurrence', 'upper bound', '`upper - 1`'],
            ['count of target', 'both', '`upper - lower`'],
            ['insertion point', 'lower bound', 'where the value would go to keep order'],
          ],
        },
        {
          kind: 'diagram',
          art: `array:   [1][2][2][2][5][7]
index:    0  1  2  3  4  5

target 2:  lower = 1, upper = 4, count = 3
target 3:  lower = 4, upper = 4, count = 0  (absent)`,
        },
        {
          kind: 'callout',
          tone: 'note',
          text: 'These exist in the standard libraries — `Arrays.binarySearch` with adjustments in Java, `lower_bound`/`upper_bound` in C++, and `bisect_left`/`bisect_right` in Python. Know the names, and still be able to write them.',
        },
      ],
    },
    {
      id: 'rotated',
      title: 'Rotated sorted arrays',
      blocks: [
        {
          kind: 'para',
          text: 'A sorted array rotated at an unknown point is no longer monotonic overall — but at any split, **at least one half is still sorted**. That is enough to keep halving.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Search in a rotated array with distinct values',
          source: `int lo = 0, hi = n - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] == target) return mid;

    if (a[lo] <= a[mid]) {                       // left half is sorted
        if (a[lo] <= target && target < a[mid]) hi = mid - 1;
        else                                    lo = mid + 1;
    } else {                                     // right half is sorted
        if (a[mid] < target && target <= a[hi])  lo = mid + 1;
        else                                     hi = mid - 1;
    }
}
return -1;`,
        },
        {
          kind: 'diagram',
          art: `[4][5][6][7][0][1][2]
             ^mid

a[lo]=4 <= a[mid]=7  ->  left half [4..7] is sorted
target 1 is not inside [4, 7)  ->  discard the left half`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'With duplicates, `a[lo] == a[mid] == a[hi]` tells you nothing about which side is sorted. The fallback is to shrink `lo` by one and accept `O(n)` in that degenerate case — mention it rather than pretending the log bound still holds.',
        },
      ],
    },
    {
      id: 'on-answer',
      title: 'Binary search on the answer',
      blocks: [
        {
          kind: 'para',
          text: 'This is the technique that promotes binary search from "search a sorted array" to a general problem-solving tool. When the answer is a number in a known range, and feasibility is monotonic in that number, binary search the answer itself.',
        },
        {
          kind: 'steps',
          items: [
            {
              title: 'Identify what you are choosing',
              text: 'A capacity, a speed, a number of days, a maximum allowed value.',
            },
            {
              title: 'Bound the range',
              text: 'The smallest and largest conceivable answers — usually the max element and the total sum.',
            },
            {
              title: 'Write `feasible(x)`',
              text: 'A greedy or linear check answering "can it be done with x?" It must be false below the answer and true at and above it.',
            },
            {
              title: 'Binary search the boundary',
              text: 'The first `x` where `feasible(x)` becomes true is the answer.',
            },
          ],
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Split an array into m parts, minimising the largest part sum',
          source: `int lo = max(a), hi = sum(a);            // any valid answer lies here
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (feasible(a, m, mid)) hi = mid;
    else                     lo = mid + 1;
}
return lo;

boolean feasible(int[] a, int m, int limit) {
    int parts = 1, running = 0;
    for (int value : a) {
        if (running + value > limit) { parts++; running = 0; }
        running += value;
    }
    return parts <= m;                    // fits within m parts
}`,
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why feasibility must be monotonic',
          text: 'If a limit of 40 works, so does 41 — extra room never hurts. That is what makes the predicate false-then-true with a single boundary, which is the only thing binary search needs.',
        },
        {
          kind: 'table',
          caption: 'The same shape, in different clothes.',
          headers: ['Problem', 'What you binary search', 'feasible(x)'],
          rows: [
            ['Ship packages in D days', 'ship capacity', 'days needed with capacity x is at most D'],
            ['Eat bananas in H hours', 'eating speed', 'hours needed at speed x is at most H'],
            ['Split array to minimise largest sum', 'the largest allowed sum', 'parts needed is at most m'],
            ['Place k cows with max spacing', 'the minimum gap', 'k cows fit with gap at least x'],
            ['Smallest divisor with a sum threshold', 'the divisor', 'the sum of ceilings is within the threshold'],
          ],
        },
        {
          kind: 'check',
          question: 'The problem says "minimise the maximum" or "maximise the minimum". What should you try first?',
          answer: 'Binary search on the answer. That phrasing is the strongest signal in the whole subject — it almost always means a monotonic feasibility check exists.',
        },
      ],
    },
    {
      id: 'other-spaces',
      title: 'Searching other spaces',
      blocks: [
        {
          kind: 'list',
          items: [
            '**2D matrix, rows sorted and each row starting after the previous ends:** treat it as one flat array of length `rows * cols` and map `mid` back with `/` and `%`.',
            '**Matrix sorted by rows and columns only:** start at the top-right corner and move left or down — that is a staircase walk in `O(rows + cols)`, not a binary search.',
            '**Real numbers:** loop a fixed number of times (about 100) or until `hi - lo` is below a tolerance, since exact equality never happens with floating point.',
            '**Unknown length (a stream or an API):** double an index until you overshoot, then binary search inside that range.',
            '**Peak finding:** compare `a[mid]` with `a[mid+1]`; the peak is on the side that goes uphill. It works without any sorting at all.',
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'Peak finding is the clearest proof that binary search is about monotonic decisions, not sorted data. Nothing is sorted, yet each comparison still eliminates half the space.',
        },
      ],
    },
    {
      id: 'checklist',
      title: 'Checklist',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            'Is there a monotonic decision I can make at the midpoint?',
            'Am I searching an index, or searching the answer itself?',
            'Did I use `lo + (hi - lo) / 2`?',
            'Does every branch strictly shrink the range, so the loop must end?',
            'For duplicates: do I want the first, the last, or any occurrence?',
            'Did I test a size-1 array, an empty array, target absent, target at both ends?',
            'For answer-search: is `feasible` genuinely monotonic, and are my bounds valid?',
          ],
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'If a binary search hangs, the cause is a branch that does not shrink the range — typically `lo = mid` when `mid` is already `lo`. Trace a two-element array by hand and the culprit appears immediately.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'Binary search needs monotonicity, not sorting — sorting is just the common way to get it.',
    'One half-open template finds the boundary between false and true; every variant is a different condition.',
    'Use `lo + (hi - lo) / 2` and make sure every branch shrinks the range.',
    'Lower and upper bound give first, last, count and insertion point.',
    'In a rotated array at least one half is always sorted; decide with `a[lo] <= a[mid]`.',
    '"Minimise the maximum" or "maximise the minimum" means binary search on the answer.',
    'The feasibility check must be false below the answer and true above it.',
    'Peak finding works with no sorted data at all, which shows what the technique really needs.',
  ],
};
