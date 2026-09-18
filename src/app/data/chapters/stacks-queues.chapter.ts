import { Chapter } from '../../core/models/chapter.models';

export const STACKS_QUEUES: Chapter = {
  slug: 'stacks-queues',
  title: 'Stacks & Queues',
  shortTitle: 'Stacks & Queues',
  level: 'Core',
  order: 14,
  stage: 'stacks-queues',
  readingMinutes: 26,
  definition: {
    heading: 'What stacks and queues are',
    text:
      'A **stack** is last-in-first-out: you push and pop at the same end, like a pile of plates. A **queue** is first-in-first-out: you push at one end and pop from the other, like a line of people. Both restrict where you may add and remove, and that restriction is the point — it makes the order of processing a property of the structure rather than something you have to manage.',
  },
  summary:
    'Two containers defined by the order they give things back, and the monotonic variants that answer "next greater element" style questions in a single pass instead of a nested loop.',
  objectives: [
    'Choose between a stack and a queue from the structure of the problem',
    'Validate and evaluate bracketed expressions',
    'Write the monotonic stack template and say why it is linear',
    'Solve largest-rectangle style problems with boundaries from a stack',
    'Use a deque as a monotonic queue for sliding-window extremes',
  ],
  prerequisites: ['linked-lists'],
  sections: [
    {
      id: 'two-orders',
      title: 'Two containers, two orders',
      blocks: [
        {
          kind: 'callout',
          tone: 'note',
          title: 'In plain words',
          text: 'A stack is a pile of plates — you can only take the top one. A queue is the line at a counter — whoever arrived first is served first. That really is the whole difference, and it decides which problems each one solves.',
        },
        {
          kind: 'compare',
          columns: [
            {
              title: 'Stack — last in, first out',
              points: [
                'Push and pop at the same end.',
                'Models nesting and "the most recent unfinished thing".',
                'Undo, bracket matching, expression evaluation, DFS.',
                'The call stack is literally this.',
              ],
            },
            {
              title: 'Queue — first in, first out',
              points: [
                'Push at the back, pop at the front.',
                'Models fairness and "distance from the start".',
                'Scheduling, buffering, BFS, level-order traversal.',
                'A deque allows both ends.',
              ],
            },
          ],
        },
        {
          kind: 'visual',
          name: 'stack-queue',
          caption:
            'Same four items pushed into both. The difference is only which end comes back out.',
        },
        {
          kind: 'table',
          headers: ['Operation', 'Cost', 'Java', 'C++', 'Python'],
          rows: [
            ['Push', '`O(1)`', '`Deque.push` / `offerLast`', '`push_back`', '`append`'],
            ['Pop', '`O(1)`', '`pop` / `pollFirst`', '`pop_back` / `pop_front`', '`pop` / `popleft`'],
            ['Peek', '`O(1)`', '`peek` / `peekFirst`', '`back` / `front`', '`[-1]` / `[0]`'],
          ],
        },
        {
          kind: 'callout',
          tone: 'note',
          text: 'In Java, prefer `ArrayDeque` over the legacy `Stack` class: `Stack` is synchronised, slower, and iterates in a surprising order. `ArrayDeque` serves as both a stack and a queue.',
        },
      ],
    },
    {
      id: 'brackets',
      title: 'Brackets and nesting',
      blocks: [
        {
          kind: 'para',
          text: 'Anything nested is a stack problem, because the thing you must close first is always the most recently opened one.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Valid parentheses',
          source: `Deque<Character> stack = new ArrayDeque<>();
Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');

for (char c : s.toCharArray()) {
    if (pairs.containsValue(c)) stack.push(c);
    else if (pairs.containsKey(c)) {
        if (stack.isEmpty() || stack.pop() != pairs.get(c)) return false;
    }
}
return stack.isEmpty();   // anything left open means invalid`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `pairs = {')': '(', ']': '[', '}': '{'}
stack = []

for c in s:
    if c in pairs.values():
        stack.append(c)
    elif c in pairs:
        if not stack or stack.pop() != pairs[c]:
            return False

return not stack     # anything left open means invalid`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'Two checks are easy to forget: popping from an empty stack when a closer arrives first, and a non-empty stack at the end. `"("` and `")("` both fail only if you test both.',
        },
      ],
    },
    {
      id: 'expressions',
      title: 'Expression notations',
      blocks: [
        {
          kind: 'table',
          headers: ['Notation', 'Form', 'Example', 'Needs precedence rules'],
          rows: [
            ['Infix', 'operator between operands', '`3 + 4 * 2`', 'yes'],
            ['Prefix (Polish)', 'operator first', '`+ 3 * 4 2`', 'no'],
            ['Postfix (Reverse Polish)', 'operator last', '`3 4 2 * +`', 'no'],
          ],
        },
        {
          kind: 'para',
          text: 'Postfix needs no brackets and no precedence table, which is why compilers and calculators convert to it. Evaluating it is a stack loop of five lines.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Evaluate postfix',
          source: `Deque<Integer> stack = new ArrayDeque<>();
for (String token : tokens) {
    if (isOperator(token)) {
        int b = stack.pop(), a = stack.pop();   // note the order
        stack.push(apply(token, a, b));
    } else stack.push(Integer.parseInt(token));
}
return stack.pop();`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `stack = []

for token in tokens:
    if is_operator(token):
        b = stack.pop()          # note the order
        a = stack.pop()
        stack.append(apply(token, a, b))
    else:
        stack.append(int(token))

return stack.pop()`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'The second value popped is the **left** operand. Getting this backwards passes tests for `+` and `*` and silently fails for `-` and `/`.',
        },
      ],
    },
    {
      id: 'monotonic-stack',
      title: 'The monotonic stack',
      blocks: [
        {
          kind: 'para',
          text: 'This is the reason stacks matter in interviews. Whenever you need, for every element, the nearest element on one side that is bigger or smaller, a stack whose values stay sorted answers all of them in one pass.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Next greater element to the right - O(n)',
          source: `int[] answer = new int[n];
Arrays.fill(answer, -1);
Deque<Integer> stack = new ArrayDeque<>();   // indices, values decreasing

for (int i = 0; i < n; i++) {
    while (!stack.isEmpty() && a[stack.peek()] < a[i]) {
        answer[stack.pop()] = a[i];          // a[i] is the next greater for that index
    }
    stack.push(i);
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `answer = [-1] * len(a)
stack = []                       # indices, values decreasing

for i, value in enumerate(a):
    while stack and a[stack[-1]] < value:
        answer[stack.pop()] = value   # value is the next greater for that index
    stack.append(i)`,
        },
        {
          kind: 'diagram',
          caption: 'Each index is pushed once and popped once, which is why it is linear.',
          art: `a = [2, 1, 2, 4, 3]

i=0  push 0          stack: [2]
i=1  1 < 2, push 1   stack: [2,1]
i=2  2 > 1 -> pop 1, answer[1]=2
     2 = 2, push 2   stack: [2,2]
i=3  4 pops 2 and 2  answer[2]=4, answer[0]=4
     push 3          stack: [4]
i=4  3 < 4, push 4   stack: [4,3]`,
        },
        {
          kind: 'table',
          caption: 'One template, four variants — change the comparison and the direction.',
          headers: ['You want', 'Scan direction', 'Pop while'],
          rows: [
            ['Next greater to the right', 'left to right', 'top value `<` current'],
            ['Next smaller to the right', 'left to right', 'top value `>` current'],
            ['Previous greater to the left', 'left to right', 'top value `<=` current, then peek'],
            ['Previous smaller to the left', 'left to right', 'top value `>=` current, then peek'],
          ],
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why it is `O(n)` despite the inner `while`',
          text: 'Amortised counting: each index enters the stack exactly once and leaves at most once, so the total number of pops across the whole run is at most `n`. The inner loop can be long on one iteration only because it was short on many others.',
        },
      ],
    },
    {
      id: 'histogram',
      title: 'Largest rectangle: boundaries from a stack',
      blocks: [
        {
          kind: 'para',
          text: 'For each bar in a histogram, the widest rectangle of that height extends until a strictly shorter bar on each side. Those two boundaries are exactly "previous smaller" and "next smaller" — so one monotonic stack solves it.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Largest rectangle in a histogram - O(n)',
          source: `Deque<Integer> stack = new ArrayDeque<>();   // increasing heights
int best = 0;

for (int i = 0; i <= n; i++) {
    int height = (i == n) ? 0 : h[i];        // sentinel flushes the stack
    while (!stack.isEmpty() && h[stack.peek()] >= height) {
        int top = stack.pop();
        int left = stack.isEmpty() ? -1 : stack.peek();
        int width = i - left - 1;
        best = Math.max(best, h[top] * width);
    }
    stack.push(i);
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `stack = []                       # increasing heights
best = 0

for i in range(len(h) + 1):
    height = 0 if i == len(h) else h[i]     # sentinel flushes the stack

    while stack and h[stack[-1]] >= height:
        top = stack.pop()
        left = stack[-1] if stack else -1
        width = i - left - 1
        best = max(best, h[top] * width)

    stack.append(i)`,
        },
        {
          kind: 'diagram',
          art: `heights: [2, 1, 5, 6, 2, 3]

bar of height 5 at index 2:
  previous smaller -> index 1
  next smaller     -> index 4
  width = 4 - 1 - 1 = 2,  area = 10

bar of height 6: width 1, area 6
best = 10`,
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'The sentinel — one virtual bar of height 0 at the end — removes the "flush whatever is left" loop after the main pass. Adding a sentinel to avoid a trailing special case is a technique worth reusing.',
        },
        {
          kind: 'para',
          text: 'The maximal rectangle in a binary matrix is this same routine run once per row, with each row treated as a histogram of consecutive ones above it.',
        },
      ],
    },
    {
      id: 'queues',
      title: 'Queues, circular buffers and deques',
      blocks: [
        {
          kind: 'para',
          text: 'A queue implemented on a plain array by shifting elements is `O(n)` per removal. A **circular buffer** fixes that: keep head and tail indices and wrap them with a modulus, so both ends are `O(1)` and memory is reused.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Circular queue - the wrap is the whole idea',
          source: `void enqueue(int value) {
    buffer[tail] = value;
    tail = (tail + 1) % capacity;
    size++;
}

int dequeue() {
    int value = buffer[head];
    head = (head + 1) % capacity;
    size--;
    return value;
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `def enqueue(self, value: int) -> None:
    self.buffer[self.tail] = value
    self.tail = (self.tail + 1) % self.capacity
    self.size += 1


def dequeue(self) -> int:
    value = self.buffer[self.head]
    self.head = (self.head + 1) % self.capacity
    self.size -= 1
    return value`,
        },
        {
          kind: 'callout',
          tone: 'trap',
          text: 'With only head and tail, a full buffer and an empty one look identical. Track the size explicitly, or leave one slot unused — pick one and say which.',
        },
        {
          kind: 'para',
          text: 'A **deque** allows push and pop at both ends. It covers stacks, queues, and the monotonic queue below, which is why most libraries offer it as the single general container.',
        },
      ],
    },
    {
      id: 'monotonic-queue',
      title: 'The monotonic queue',
      blocks: [
        {
          kind: 'para',
          text: 'A monotonic stack answers "nearest bigger element". A monotonic **deque** answers "maximum inside the current window", because it can also discard from the front when an element slides out of range.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Maximum of every window of size k - O(n)',
          source: `Deque<Integer> deque = new ArrayDeque<>();   // indices, values decreasing

for (int i = 0; i < n; i++) {
    while (!deque.isEmpty() && a[deque.peekLast()] <= a[i]) deque.pollLast();
    deque.offerLast(i);

    if (deque.peekFirst() <= i - k) deque.pollFirst();   // slid out of the window
    if (i >= k - 1) report(a[deque.peekFirst()]);
}`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `from collections import deque

window = deque()                 # indices, values decreasing

for i, value in enumerate(a):
    while window and a[window[-1]] <= value:
        window.pop()
    window.append(i)

    if window[0] <= i - k:
        window.popleft()         # slid out of the window
    if i >= k - 1:
        report(a[window[0]])`,
        },
        {
          kind: 'callout',
          tone: 'why',
          text: 'A smaller value that arrived earlier can never be the maximum again while a larger, newer value is still in the window — it will leave first. So dropping it is permanently safe, and each index is touched twice at most.',
        },
      ],
    },
    {
      id: 'design',
      title: 'Design questions built on these',
      blocks: [
        {
          kind: 'table',
          headers: ['Asked to build', 'Approach'],
          rows: [
            ['Stack with `getMin` in `O(1)`', 'a second stack holding the running minimum, or store `(value, min)` pairs'],
            ['Queue from two stacks', 'push onto one; when popping, move everything to the second stack if it is empty — amortised `O(1)`'],
            ['Stack from two queues', 'make one operation `O(n)`; choose whether push or pop pays'],
            ['Browser back and forward', 'two stacks, moving entries between them'],
            ['Hit counter over a time window', 'a queue holding timestamps; drop from the front while they are too old'],
          ],
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Min stack - the trick is storing the minimum alongside each value',
          source: `Deque<int[]> stack = new ArrayDeque<>();   // {value, minimum so far}

void push(int value) {
    int min = stack.isEmpty() ? value : Math.min(value, stack.peek()[1]);
    stack.push(new int[] { value, min });
}

int getMin() { return stack.peek()[1]; }`,
        },
        {
          kind: 'code',
          language: 'python',
          source: `stack: list[tuple[int, int]] = []     # (value, minimum so far)


def push(value: int) -> None:
    smallest = value if not stack else min(value, stack[-1][1])
    stack.append((value, smallest))


def get_min() -> int:
    return stack[-1][1]`,
        },
        {
          kind: 'check',
          question: 'Why is a queue built from two stacks amortised `O(1)` and not `O(n)`?',
          answer: 'Each element moves from the input stack to the output stack exactly once in its lifetime. A single pop may move many elements, but those moves are paid for by the pushes that put them there — the same amortised argument as a doubling array.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'A stack models nesting and recency; a queue models fairness and distance.',
    'Anything nested — brackets, expressions, undo, DFS — is a stack.',
    'Postfix removes precedence and brackets, and evaluates with one stack loop.',
    'A monotonic stack answers next or previous greater and smaller in one linear pass.',
    'It is linear because each index is pushed once and popped at most once.',
    'Largest rectangle is previous-smaller and next-smaller boundaries plus a sentinel.',
    'A circular buffer makes both queue ends `O(1)`; track the size to tell full from empty.',
    'A monotonic deque gives the maximum of every sliding window in linear total time.',
  ],
};
