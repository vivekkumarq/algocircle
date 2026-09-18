import { Chapter } from '../../core/models/chapter.models';

export const GREEDY: Chapter = {
  slug: 'greedy',
  title: 'Greedy Algorithms',
  shortTitle: 'Greedy',
  level: 'Advanced',
  order: 18,
  stage: 'greedy',
  readingMinutes: 24,
  definition: {
    heading: 'What a greedy algorithm is',
    text:
      'A **greedy algorithm** builds an answer one decision at a time, always taking what looks best right now and never reconsidering. It produces the shortest code you will write and the easiest solutions to get subtly wrong — so a greedy solution is only finished when you can say **why** the locally best choice is also globally safe.',
  },
  summary:
    'Making the locally best choice — and, more importantly, proving the local choice is safe. Greedy is short to write and easy to get wrong; the exchange argument is what separates the two.',
  objectives: [
    'State the two properties a problem needs before greedy can work',
    'Justify a greedy choice with an exchange argument',
    'Solve interval scheduling, merging and platform problems by choosing the right sort key',
    'Recognise when greedy fails and dynamic programming is required',
    'Combine greedy with sorting and with a heap',
  ],
  prerequisites: ['sorting', 'heaps'],
  sections: [
    {
      id: 'idea',
      title: 'The idea, and the risk',
      blocks: [
        {
          kind: 'callout',
          tone: 'note',
          title: 'In plain words',
          text: 'Take the best-looking option right now and never reconsider. It produces the shortest solutions you will write and the easiest ones to get wrong, so most of this chapter is about proving the choice is safe.',
        },
        {
          kind: 'para',
          text: 'A greedy algorithm builds a solution one decision at a time, always taking what looks best right now and never reconsidering. When it works it is beautifully short — usually a sort followed by a single scan. When it does not, it produces a confident, plausible, wrong answer.',
        },
        {
          kind: 'callout',
          tone: 'trap',
          title: 'The real danger',
          text: 'A wrong greedy passes the small examples in the problem statement almost every time. That is why "it worked on the sample" is not evidence, and why the justification matters more here than in any other technique.',
        },
        {
          kind: 'compare',
          columns: [
            {
              title: 'Greedy',
              points: [
                'One pass, one decision per step, never revisited.',
                'Typically `O(n log n)` from the sort.',
                'Constant or linear memory.',
                'Correct only when the greedy choice property holds.',
              ],
            },
            {
              title: 'Dynamic programming',
              points: [
                'Considers every choice and keeps the best.',
                'Typically polynomial in states times transitions.',
                'Needs a table.',
                'Correct whenever the recurrence is right.',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'when',
      title: 'The two properties it needs',
      blocks: [
        {
          kind: 'steps',
          items: [
            {
              title: 'Greedy choice property',
              text: 'There is an optimal solution that contains the choice you are about to make. You never have to sacrifice now to win later.',
            },
            {
              title: 'Optimal substructure',
              text: 'After making that choice, the remaining problem is a smaller instance of the same problem, and solving it optimally completes an optimal whole.',
            },
          ],
        },
        {
          kind: 'para',
          text: 'The second property is shared with dynamic programming. The first is what greedy adds, and it is the one that fails.',
        },
        {
          kind: 'callout',
          tone: 'key',
          title: 'The exchange argument, in one sentence',
          text: 'Take any optimal solution that does **not** contain your greedy choice, swap in your choice, and show the result is still valid and no worse. If you can do that, greedy is provably correct.',
        },
        {
          kind: 'para',
          text: 'Worked example — activity selection. Sort by finish time and always take the earliest finisher that still fits. Suppose an optimal schedule starts with some other activity `X`. Your choice `G` finishes no later than `X`, so replacing `X` with `G` cannot conflict with anything that came after `X`. The count is unchanged, so the swapped schedule is still optimal — and it now contains your greedy choice.',
        },
      ],
    },
    {
      id: 'intervals',
      title: 'Interval problems: the sort key is the algorithm',
      blocks: [
        {
          kind: 'para',
          text: 'Almost every interval problem is solved by choosing what to sort by. Get that right and the scan is five lines; get it wrong and no amount of clever scanning recovers.',
        },
        {
          kind: 'visual',
          name: 'interval-greedy',
          caption:
            'Sorted by finish time. Each step either takes the interval or skips it, and never reconsiders.',
        },
        {
          kind: 'table',
          headers: ['Problem', 'Sort by', 'Then'],
          rows: [
            ['Maximum non-overlapping intervals', '**end** time', 'take an interval if it starts at or after the last taken end'],
            ['Minimum removals to remove overlaps', '**end** time', 'the same scan; the answer is `n` minus what you kept'],
            ['Merge overlapping intervals', '**start** time', 'extend the current interval, or start a new one'],
            ['Minimum meeting rooms', '**start** time', 'a min-heap of end times gives the peak overlap'],
            ['Insert into sorted intervals', 'already sorted', 'three phases: before, merging, after'],
            ['Minimum arrows to burst balloons', '**end** point', 'shoot at the current end; skip everything it hits'],
          ],
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Maximum non-overlapping intervals - sort by end',
          source: `Arrays.sort(intervals, (x, y) -> x[1] - y[1]);

int count = 0, lastEnd = Integer.MIN_VALUE;
for (int[] interval : intervals) {
    if (interval[0] >= lastEnd) { count++; lastEnd = interval[1]; }
}`,
        },
        {
          kind: 'callout',
          tone: 'why',
          title: 'Why end time and not start time or shortest',
          text: 'Finishing earliest leaves the most room for everything after it. Sorting by start can take one long interval that blocks several short ones; sorting by duration can take a short interval sitting awkwardly across two slots. Only the earliest finish survives the exchange argument.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Merging overlaps - sort by start',
          source: `Arrays.sort(intervals, (x, y) -> x[0] - y[0]);

List<int[]> merged = new ArrayList<>();
for (int[] interval : intervals) {
    if (!merged.isEmpty() && interval[0] <= merged.get(merged.size() - 1)[1])
        merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], interval[1]);
    else
        merged.add(interval);
}`,
        },
      ],
    },
    {
      id: 'classics',
      title: 'Classic greedy algorithms',
      blocks: [
        {
          kind: 'table',
          headers: ['Problem', 'Greedy rule', 'Why it is safe'],
          rows: [
            ['Fractional knapsack', 'take the highest value per unit weight first', 'fractions mean no capacity is ever wasted'],
            ['Huffman coding', 'merge the two least frequent symbols', 'the rarest symbols belong deepest in the tree'],
            ['Minimum platforms', 'sweep arrivals and departures in time order', 'the peak concurrency is the answer'],
            ['Gas station circuit', 'reset the start when the running tank goes negative', 'no station in the failed stretch can be a valid start'],
            ['Jump game', 'track the furthest index reachable so far', 'reachability is monotone along the array'],
            ['Coin change, canonical coins', 'take the largest coin that fits', 'holds for systems like 1, 2, 5, 10 — not in general'],
            ['Kruskal MST', 'add the cheapest edge that joins two components', 'the cut property'],
            ['Dijkstra', 'settle the nearest unvisited vertex', 'non-negative weights mean it cannot improve later'],
          ],
        },
        {
          kind: 'visual',
          name: 'merge-intervals',
          caption:
            'Sorted by start instead: one forward pass either extends the current block or starts a new one.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Gas station - one pass, and the reset is the whole insight',
          source: `int total = 0, tank = 0, start = 0;
for (int i = 0; i < n; i++) {
    int gain = gas[i] - cost[i];
    total += gain;
    tank  += gain;
    if (tank < 0) { start = i + 1; tank = 0; }   // nothing in [start..i] can work
}
return total >= 0 ? start : -1;`,
        },
        {
          kind: 'callout',
          tone: 'why',
          text: 'If the tank goes negative at index `i`, then no station between the old start and `i` can be a valid start either — each of those would begin with even less fuel. That is what licenses skipping them all instead of retrying each one.',
        },
      ],
    },
    {
      id: 'with-heap',
      title: 'Greedy with a heap',
      blocks: [
        {
          kind: 'para',
          text: 'When the best choice changes as you go, a heap keeps it available. Sorting fixes an order once; a heap re-decides at every step.',
        },
        {
          kind: 'code',
          language: 'java',
          caption: 'Connect ropes at minimum cost - always join the two shortest',
          source: `PriorityQueue<Integer> heap = new PriorityQueue<>(List.of(ropes));

int cost = 0;
while (heap.size() > 1) {
    int combined = heap.poll() + heap.poll();
    cost += combined;
    heap.offer(combined);
}`,
        },
        {
          kind: 'table',
          headers: ['Problem', 'Heap holds'],
          rows: [
            ['Huffman coding', 'nodes by frequency, smallest first'],
            ['Task scheduler with cooldown', 'remaining counts, largest first'],
            ['Meeting rooms', 'end times of ongoing meetings'],
            ['Minimum refuelling stops', 'fuel available at stations already passed'],
            ['IPO / project selection', 'affordable projects by profit'],
          ],
        },
      ],
    },
    {
      id: 'when-it-fails',
      title: 'When greedy fails',
      blocks: [
        {
          kind: 'para',
          text: 'The clearest counterexample is coin change with an awkward denomination set.',
        },
        {
          kind: 'diagram',
          caption: 'Greedy commits to the 9 and can never recover.',
          art: `coins = [1, 5, 9],  target = 15

greedy:  9 + 5 + 1        -> 3 coins
optimal: 5 + 5 + 5        -> 2 coins`,
        },
        {
          kind: 'para',
          text: 'Taking the 9 leaves 6, which cannot be made from two coins. The greedy choice property fails: no optimal solution contains the 9, so the first decision was already wrong. Dynamic programming, which considers both taking and skipping, gets it right.',
        },
        {
          kind: 'table',
          headers: ['Signal', 'Likely technique'],
          rows: [
            ['A choice now can hurt later', 'dynamic programming'],
            ['"Maximum value with a weight limit" (0/1 knapsack)', 'dynamic programming'],
            ['"Minimum number of coins", arbitrary denominations', 'dynamic programming'],
            ['"Maximum count of non-overlapping things"', 'greedy after sorting'],
            ['Fractions or divisible items are allowed', 'greedy'],
            ['You can prove an exchange argument', 'greedy'],
          ],
        },
        {
          kind: 'check',
          question: 'Fractional knapsack is greedy, but 0/1 knapsack is not. What changes?',
          answer: 'With fractions you can always fill the capacity exactly, so taking the best value-per-weight first can never waste space. With whole items, taking the best ratio can leave a gap that a different combination would have filled — the greedy choice is no longer guaranteed to appear in an optimal solution.',
        },
      ],
    },
    {
      id: 'method',
      title: 'A method for greedy problems',
      blocks: [
        {
          kind: 'steps',
          items: [
            {
              title: 'Guess the rule',
              text: 'Earliest end, largest ratio, most frequent first, cheapest edge. Usually there are only two or three candidates.',
            },
            {
              title: 'Attack it with a counterexample',
              text: 'Spend two minutes trying to break it on a small input. This is faster than proving it, and it is how wrong rules are caught.',
            },
            {
              title: 'If it survives, sketch the exchange',
              text: 'Show that swapping your choice into any optimal solution keeps it valid and no worse.',
            },
            {
              title: 'Only then write the code',
              text: 'It will be a sort plus a scan, or a heap plus a loop.',
            },
          ],
        },
        {
          kind: 'callout',
          tone: 'key',
          text: 'In an interview, say the rule and the reason together: "sort by end time, because finishing earliest leaves the most room for the rest". That single clause is what distinguishes a justified greedy from a lucky guess.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'Greedy needs the greedy choice property and optimal substructure; the first one is what fails.',
    'The exchange argument is the proof: swap your choice into an optimal solution and show it is no worse.',
    'For intervals, choosing the sort key is the algorithm — end time to count, start time to merge.',
    'Earliest finish wins because it leaves the most room for what follows.',
    'A heap keeps the best choice available when it changes as you go.',
    'Greedy fails when a choice now can block a better combination later.',
    'Coin change with arbitrary denominations is the standard counterexample.',
    'Try to break the rule with a small case before trying to prove it.',
  ],
};
