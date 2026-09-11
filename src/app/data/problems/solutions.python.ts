/**
 * Python solutions, keyed by problem slug.
 *
 * Kept beside the problems rather than inside them so a second language is one
 * file rather than an edit to every record. `problems.spec.ts` fails the build
 * if a problem ever lacks one.
 */
export const PYTHON_SOLUTIONS: Record<string, string> = {
  // ---------------------------------------------------------------- foundations
  'swap-without-temp': `a = a ^ b
b = a ^ b          # (a^b)^b == a
a = a ^ b          # (a^b)^a == b

# Python makes the point moot: a, b = b, a`,

  'count-digits': `def count_digits(n: int) -> int:
    value = abs(n)
    if value == 0:
        return 1

    digits = 0
    while value > 0:
        digits += 1
        value //= 10
    return digits

# Python integers are unbounded, so abs() is always safe here —
# the overflow trap is a Java and C++ concern.`,

  'reverse-array-in-place': `lo, hi = 0, len(a) - 1
while lo < hi:
    a[lo], a[hi] = a[hi], a[lo]
    lo += 1
    hi -= 1`,

  'fizz-trace': `# inner loop runs n - i times for each i
total = sum(n - i for i in range(n))   # == n * (n + 1) // 2`,

  // ---------------------------------------------------------------- complexity
  'classify-loops': `# for i in range(n): work()                  -> O(n)
# for i in range(n):
#     for j in range(n): work()              -> O(n^2)
# for i in range(n):
#     for j in range(i, n): work()           -> O(n^2)  (n^2 / 2)
# i = 1
# while i < n: i *= 2                        -> O(log n)`,

  'amortised-append': `# capacity doubles: copies happen at sizes 1, 2, 4, 8, ...
# total copies over n appends = 1 + 2 + 4 + ... < 2n
# so the cost per append is O(1) amortised

values = []
for x in range(n):
    values.append(x)        # amortised O(1)`,

  'constraints-to-approach': `# n <= 10     -> O(n!)        permutations
# n <= 20     -> O(2^n)      subsets, bitmask DP
# n <= 500    -> O(n^3)      Floyd-Warshall, interval DP
# n <= 5000   -> O(n^2)      classic 2D DP
# n <= 1e5    -> O(n log n)  sort, heap, window, binary search
# n <= 1e9    -> O(log n)    maths, binary search on the answer`,

  'recursion-cost': `# T(n) = T(n/2) + O(1)    -> O(log n)
# T(n) = T(n/2) + O(n)    -> O(n)
# T(n) = 2T(n/2) + O(1)   -> O(n)
# T(n) = 2T(n/2) + O(n)   -> O(n log n)
# T(n) = T(n-1) + O(n)    -> O(n^2)
# T(n) = 2T(n-1) + O(1)   -> O(2^n)`,

  // --------------------------------------------------------------- mathematics
  'gcd-of-array': `from math import gcd
from functools import reduce

def array_gcd(a: list[int]) -> int:
    result = 0                      # gcd(x, 0) == x
    for value in a:
        result = gcd(result, value)
        if result == 1:
            break                   # cannot get smaller
    return result

# or simply: reduce(gcd, a, 0)`,

  'count-primes': `def count_primes(n: int) -> int:
    if n < 3:
        return 0

    composite = [False] * n
    count = 0

    for p in range(2, n):
        if composite[p]:
            continue
        count += 1
        for m in range(p * p, n, p):     # start at p*p
            composite[m] = True
    return count`,

  'power-mod': `def power(base: int, exp: int, mod: int) -> int:
    result = 1
    base %= mod
    while exp > 0:
        if exp & 1:
            result = result * base % mod
        base = base * base % mod
        exp >>= 1
    return result

# Python ships this: pow(base, exp, mod)`,

  'single-number': `from functools import reduce
from operator import xor

def single_number(a: list[int]) -> int:
    return reduce(xor, a, 0)`,

  // -------------------------------------------------------------------- arrays
  'max-subarray-sum': `def max_subarray(a: list[int]) -> int:
    ending_here = best = a[0]
    for value in a[1:]:
        ending_here = max(value, ending_here + value)
        best = max(best, ending_here)
    return best`,

  'subarray-sum-k': `from collections import defaultdict

def subarray_sum(a: list[int], k: int) -> int:
    seen = defaultdict(int)
    seen[0] = 1                       # the empty prefix
    running = count = 0

    for value in a:
        running += value
        count += seen[running - k]
        seen[running] += 1
    return count`,

  'product-except-self': `def product_except_self(a: list[int]) -> list[int]:
    n = len(a)
    out = [1] * n

    for i in range(1, n):
        out[i] = out[i - 1] * a[i - 1]

    suffix = 1
    for i in range(n - 1, -1, -1):
        out[i] *= suffix
        suffix *= a[i]
    return out`,

  'rotate-array': `def rotate(a: list[int], k: int) -> None:
    n = len(a)
    k %= n                            # essential

    def reverse(lo: int, hi: int) -> None:
        while lo < hi:
            a[lo], a[hi] = a[hi], a[lo]
            lo += 1
            hi -= 1

    reverse(0, n - 1)
    reverse(0, k - 1)
    reverse(k, n - 1)`,

  // ------------------------------------------------------------------- strings
  'longest-unique-substring': `def longest_unique(s: str) -> int:
    count = {}
    left = best = 0

    for right, ch in enumerate(s):
        count[ch] = count.get(ch, 0) + 1
        while count[ch] > 1:
            count[s[left]] -= 1
            left += 1
        best = max(best, right - left + 1)
    return best`,

  'group-anagrams': `from collections import defaultdict

def group_anagrams(words: list[str]) -> list[list[str]]:
    groups = defaultdict(list)

    for word in words:
        count = [0] * 26
        for ch in word:
            count[ord(ch) - ord('a')] += 1
        groups[tuple(count)].append(word)

    return list(groups.values())`,

  'longest-palindromic-substring': `def longest_palindrome(s: str) -> str:
    best_lo, best_len = 0, 1

    def expand(lo: int, hi: int) -> None:
        nonlocal best_lo, best_len
        while lo >= 0 and hi < len(s) and s[lo] == s[hi]:
            lo -= 1
            hi += 1
        length = hi - lo - 1
        if length > best_len:
            best_lo, best_len = lo + 1, length

    for centre in range(len(s)):
        expand(centre, centre)          # odd
        expand(centre, centre + 1)      # even

    return s[best_lo:best_lo + best_len]`,

  'valid-palindrome-one-delete': `def valid_palindrome(s: str) -> bool:
    def is_palindrome(lo: int, hi: int) -> bool:
        while lo < hi:
            if s[lo] != s[hi]:
                return False
            lo += 1
            hi -= 1
        return True

    lo, hi = 0, len(s) - 1
    while lo < hi:
        if s[lo] != s[hi]:
            return is_palindrome(lo + 1, hi) or is_palindrome(lo, hi - 1)
        lo += 1
        hi -= 1
    return True`,

  // ------------------------------------------------------------------- hashing
  'two-sum': `def two_sum(a: list[int], target: int) -> list[int]:
    seen = {}
    for i, value in enumerate(a):
        need = target - value
        if need in seen:
            return [seen[need], i]
        seen[value] = i          # insert after checking
    return []`,

  'longest-consecutive': `def longest_consecutive(a: list[int]) -> int:
    values = set(a)
    best = 0

    for value in values:
        if value - 1 in values:
            continue             # not the start of a run
        length = 1
        while value + length in values:
            length += 1
        best = max(best, length)
    return best`,

  'top-k-frequent': `from collections import Counter

def top_k_frequent(a: list[int], k: int) -> list[int]:
    count = Counter(a)

    buckets = [[] for _ in range(len(a) + 1)]
    for value, freq in count.items():
        buckets[freq].append(value)

    out = []
    for freq in range(len(a), 0, -1):
        out.extend(buckets[freq])
        if len(out) >= k:
            return out[:k]
    return out`,

  'valid-sudoku': `def is_valid_sudoku(board: list[list[str]]) -> bool:
    rows = [set() for _ in range(9)]
    cols = [set() for _ in range(9)]
    boxes = [set() for _ in range(9)]

    for r in range(9):
        for c in range(9):
            v = board[r][c]
            if v == '.':
                continue
            b = (r // 3) * 3 + c // 3
            if v in rows[r] or v in cols[c] or v in boxes[b]:
                return False
            rows[r].add(v); cols[c].add(v); boxes[b].add(v)
    return True`,

  // -------------------------------------------------------------- two pointers
  'three-sum': `def three_sum(a: list[int]) -> list[list[int]]:
    a.sort()
    out = []

    for i in range(len(a) - 2):
        if i > 0 and a[i] == a[i - 1]:
            continue                       # duplicate anchor
        lo, hi = i + 1, len(a) - 1

        while lo < hi:
            total = a[i] + a[lo] + a[hi]
            if total == 0:
                out.append([a[i], a[lo], a[hi]])
                while lo < hi and a[lo] == a[lo + 1]: lo += 1
                while lo < hi and a[hi] == a[hi - 1]: hi -= 1
                lo += 1; hi -= 1
            elif total < 0:
                lo += 1
            else:
                hi -= 1
    return out`,

  'container-most-water': `def max_area(h: list[int]) -> int:
    lo, hi, best = 0, len(h) - 1, 0
    while lo < hi:
        best = max(best, min(h[lo], h[hi]) * (hi - lo))
        if h[lo] < h[hi]:
            lo += 1
        else:
            hi -= 1
    return best`,

  'sort-colours': `def sort_colours(a: list[int]) -> None:
    low, mid, high = 0, 0, len(a) - 1

    while mid <= high:
        if a[mid] == 0:
            a[low], a[mid] = a[mid], a[low]
            low += 1; mid += 1
        elif a[mid] == 1:
            mid += 1
        else:
            a[mid], a[high] = a[high], a[mid]
            high -= 1                      # do NOT advance mid`,

  'trapping-rain-water': `def trap(h: list[int]) -> int:
    lo, hi = 0, len(h) - 1
    left_max = right_max = water = 0

    while lo < hi:
        if h[lo] < h[hi]:
            left_max = max(left_max, h[lo])
            water += left_max - h[lo]
            lo += 1
        else:
            right_max = max(right_max, h[hi])
            water += right_max - h[hi]
            hi -= 1
    return water`,

  // ------------------------------------------------------------ sliding window
  'min-window-substring': `from collections import Counter

def min_window(s: str, t: str) -> str:
    need = Counter(t)
    required, formed = len(need), 0
    window = Counter()

    left, best_len, best_start = 0, float('inf'), 0

    for right, ch in enumerate(s):
        window[ch] += 1
        if ch in need and window[ch] == need[ch]:
            formed += 1

        while formed == required:
            if right - left + 1 < best_len:
                best_len, best_start = right - left + 1, left
            out = s[left]; left += 1
            window[out] -= 1
            if out in need and window[out] < need[out]:
                formed -= 1

    return '' if best_len == float('inf') else s[best_start:best_start + best_len]`,

  'at-most-k-distinct': `from collections import defaultdict

def at_most_k(a: list[int], k: int) -> int:
    count = defaultdict(int)
    left = best = 0

    for right, value in enumerate(a):
        count[value] += 1
        while len(count) > k:
            out = a[left]; left += 1
            count[out] -= 1
            if count[out] == 0:
                del count[out]          # or len() lies
        best = max(best, right - left + 1)
    return best`,

  'max-in-each-window': `from collections import deque

def max_window(a: list[int], k: int) -> list[int]:
    dq, out = deque(), []

    for i, value in enumerate(a):
        while dq and a[dq[-1]] <= value:
            dq.pop()
        dq.append(i)

        if dq[0] <= i - k:
            dq.popleft()
        if i >= k - 1:
            out.append(a[dq[0]])
    return out`,

  'min-size-subarray-sum': `def min_subarray_len(a: list[int], s: int) -> int:
    left = total = 0
    best = float('inf')

    for right, value in enumerate(a):
        total += value
        while total >= s:
            best = min(best, right - left + 1)
            total -= a[left]
            left += 1

    return 0 if best == float('inf') else best`,

  // -------------------------------------------------------------- binary search
  'first-last-occurrence': `from bisect import bisect_left, bisect_right

def search_range(a: list[int], target: int) -> list[int]:
    first = bisect_left(a, target)
    last = bisect_right(a, target) - 1
    return [first, last] if first <= last else [-1, -1]`,

  'search-rotated': `def search(a: list[int], target: int) -> int:
    lo, hi = 0, len(a) - 1

    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if a[mid] == target:
            return mid

        if a[lo] <= a[mid]:                        # left half sorted
            if a[lo] <= target < a[mid]: hi = mid - 1
            else:                        lo = mid + 1
        else:                                      # right half sorted
            if a[mid] < target <= a[hi]: lo = mid + 1
            else:                        hi = mid - 1
    return -1`,

  'ship-within-days': `def ship_within_days(weights: list[int], days: int) -> int:
    def needed(cap: int) -> int:
        count, load = 1, 0
        for w in weights:
            if load + w > cap:
                count += 1; load = 0
            load += w
        return count

    lo, hi = max(weights), sum(weights)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if needed(mid) <= days: hi = mid
        else:                   lo = mid + 1
    return lo`,

  'median-two-sorted': `def find_median(a: list[int], b: list[int]) -> float:
    if len(a) > len(b):
        a, b = b, a
    n, m = len(a), len(b)

    lo, hi = 0, n
    while lo <= hi:
        i = (lo + hi) // 2
        j = (n + m + 1) // 2 - i

        a_left  = a[i - 1] if i > 0 else float('-inf')
        a_right = a[i]     if i < n else float('inf')
        b_left  = b[j - 1] if j > 0 else float('-inf')
        b_right = b[j]     if j < m else float('inf')

        if a_left <= b_right and b_left <= a_right:
            if (n + m) % 2:
                return max(a_left, b_left)
            return (max(a_left, b_left) + min(a_right, b_right)) / 2
        if a_left > b_right: hi = i - 1
        else:                lo = i + 1`,

  // ------------------------------------------------------------------- sorting
  'kth-largest': `import random

def quickselect(a: list[int], k: int) -> int:
    k = len(a) - k                      # kth largest -> kth smallest index

    def partition(lo: int, hi: int) -> int:
        pivot = a[hi]; i = lo
        for j in range(lo, hi):
            if a[j] < pivot:
                a[i], a[j] = a[j], a[i]; i += 1
        a[i], a[hi] = a[hi], a[i]
        return i

    lo, hi = 0, len(a) - 1
    while True:
        p = partition(lo, hi)
        if p == k: return a[p]
        if p < k:  lo = p + 1
        else:      hi = p - 1`,

  'merge-intervals-problem': `def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = []

    for start, end in intervals:
        if merged and start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged`,

  'count-inversions': `def count_inversions(a: list[int]) -> int:
    def sort(lo: int, hi: int) -> int:
        if hi - lo <= 1:
            return 0
        mid = (lo + hi) // 2
        count = sort(lo, mid) + sort(mid, hi)

        merged, i, j = [], lo, mid
        while i < mid and j < hi:
            if a[i] <= a[j]:
                merged.append(a[i]); i += 1
            else:
                count += mid - i          # all remaining left values are greater
                merged.append(a[j]); j += 1
        merged += a[i:mid] + a[j:hi]
        a[lo:hi] = merged
        return count

    return sort(0, len(a))`,

  'largest-number': `from functools import cmp_to_key

def largest_number(a: list[int]) -> str:
    parts = [str(x) for x in a]
    parts.sort(key=cmp_to_key(lambda x, y: (y + x > x + y) - (y + x < x + y)))

    return '0' if parts[0] == '0' else ''.join(parts)`,

  // ----------------------------------------------------------------- recursion
  'generate-subsets': `def subsets(a: list[int]) -> list[list[int]]:
    out, current = [], []

    def walk(i: int) -> None:
        if i == len(a):
            out.append(current[:])         # a copy, not the live list
            return
        walk(i + 1)                        # exclude
        current.append(a[i])
        walk(i + 1)                        # include
        current.pop()                      # undo

    walk(0)
    return out`,

  permutations: `def permutations(a: list[int]) -> list[list[int]]:
    out, current = [], []
    used = [False] * len(a)

    def walk() -> None:
        if len(current) == len(a):
            out.append(current[:])
            return
        for i, value in enumerate(a):
            if used[i]:
                continue
            used[i] = True;  current.append(value)
            walk()
            current.pop();   used[i] = False

    walk()
    return out`,

  'combination-sum': `def combination_sum(candidates: list[int], target: int) -> list[list[int]]:
    candidates.sort()
    out, current = [], []

    def walk(start: int, remaining: int) -> None:
        if remaining == 0:
            out.append(current[:])
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break                      # sorted: everything later is bigger
            current.append(candidates[i])
            walk(i, remaining - candidates[i])   # i, not i+1: reuse allowed
            current.pop()

    walk(0, target)
    return out`,

  'n-queens': `def total_n_queens(n: int) -> int:
    cols, diag1, diag2 = set(), set(), set()
    count = 0

    def place(row: int) -> None:
        nonlocal count
        if row == n:
            count += 1
            return
        for col in range(n):
            if col in cols or (row + col) in diag1 or (row - col) in diag2:
                continue
            cols.add(col); diag1.add(row + col); diag2.add(row - col)
            place(row + 1)
            cols.discard(col); diag1.discard(row + col); diag2.discard(row - col)

    place(0)
    return count`,

  // -------------------------------------------------------------- linked lists
  'reverse-linked-list': `def reverse(head):
    previous, current = None, head
    while current:
        ahead = current.next      # save first
        current.next = previous   # flip
        previous, current = current, ahead
    return previous`,

  'linked-list-cycle-start': `def detect_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            probe = head
            while probe is not slow:
                probe = probe.next
                slow = slow.next
            return probe          # cycle entry
    return None`,

  'merge-k-lists': `import heapq

def merge_k_lists(lists):
    heap = [(node.val, i, node) for i, node in enumerate(lists) if node]
    heapq.heapify(heap)

    dummy = tail = ListNode(0)
    while heap:
        _, i, node = heapq.heappop(heap)
        tail.next = node; tail = node
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next`,

  'lru-cache': `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.data = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.data:
            return -1
        self.data.move_to_end(key)          # mark as most recent
        return self.data[key]

    def put(self, key: int, value: int) -> None:
        if key in self.data:
            self.data.move_to_end(key)
        self.data[key] = value
        if len(self.data) > self.capacity:
            self.data.popitem(last=False)   # evict least recent

# OrderedDict is a hash map plus a doubly linked list — exactly the design.`,

  // ------------------------------------------------------------ stacks & queues
  'valid-parentheses': `def is_valid(s: str) -> bool:
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []

    for ch in s:
        if ch in pairs.values():
            stack.append(ch)
        elif not stack or stack.pop() != pairs[ch]:
            return False
    return not stack`,

  'daily-temperatures': `def daily_temperatures(t: list[int]) -> list[int]:
    answer = [0] * len(t)
    stack = []                       # indices, decreasing temperatures

    for i, temp in enumerate(t):
        while stack and t[stack[-1]] < temp:
            day = stack.pop()
            answer[day] = i - day
        stack.append(i)
    return answer`,

  'largest-rectangle-histogram': `def largest_rectangle(h: list[int]) -> int:
    stack, best = [], 0

    for i in range(len(h) + 1):
        height = 0 if i == len(h) else h[i]      # sentinel flushes the stack
        while stack and h[stack[-1]] >= height:
            top = stack.pop()
            left = stack[-1] if stack else -1
            best = max(best, h[top] * (i - left - 1))
        stack.append(i)
    return best`,

  'min-stack': `class MinStack:
    def __init__(self):
        self.stack = []              # (value, min so far)

    def push(self, value: int) -> None:
        smallest = value if not self.stack else min(value, self.stack[-1][1])
        self.stack.append((value, smallest))

    def pop(self) -> None:  self.stack.pop()
    def top(self) -> int:   return self.stack[-1][0]
    def get_min(self) -> int: return self.stack[-1][1]`,

  // -------------------------------------------------------------------- trees
  'tree-diameter': `def diameter(root) -> int:
    best = 0

    def height(node) -> int:
        nonlocal best
        if not node:
            return -1
        left, right = height(node.left), height(node.right)
        best = max(best, left + right + 2)     # path turning here
        return 1 + max(left, right)            # what the parent needs

    height(root)
    return best`,

  'validate-bst': `def is_valid_bst(root) -> bool:
    def valid(node, low, high) -> bool:
        if not node:
            return True
        if not (low < node.val < high):
            return False
        return valid(node.left, low, node.val) and valid(node.right, node.val, high)

    return valid(root, float('-inf'), float('inf'))`,

  'lowest-common-ancestor': `def lca(node, p, q):
    if node is None or node is p or node is q:
        return node

    left  = lca(node.left,  p, q)
    right = lca(node.right, p, q)

    if left and right:
        return node                # targets on opposite sides
    return left or right`,

  'serialise-tree': `def serialise(root) -> str:
    out = []

    def write(node) -> None:
        if not node:
            out.append('#'); return
        out.append(str(node.val))
        write(node.left); write(node.right)

    write(root)
    return ','.join(out)


def deserialise(data: str):
    tokens = iter(data.split(','))

    def read():
        token = next(tokens)
        if token == '#':
            return None
        node = TreeNode(int(token))
        node.left = read(); node.right = read()
        return node

    return read()`,

  // -------------------------------------------------------------------- heaps
  'running-median': `import heapq

class MedianFinder:
    def __init__(self):
        self.lower = []      # max-heap, stored negated
        self.upper = []      # min-heap

    def add(self, value: int) -> None:
        heapq.heappush(self.lower, -value)
        heapq.heappush(self.upper, -heapq.heappop(self.lower))
        if len(self.upper) > len(self.lower):
            heapq.heappush(self.lower, -heapq.heappop(self.upper))

    def median(self) -> float:
        if len(self.lower) > len(self.upper):
            return -self.lower[0]
        return (-self.lower[0] + self.upper[0]) / 2`,

  'k-closest-points': `import heapq

def k_closest(points: list[list[int]], k: int) -> list[list[int]]:
    heap = []                                # max-heap by negated distance

    for x, y in points:
        heapq.heappush(heap, (-(x * x + y * y), [x, y]))
        if len(heap) > k:
            heapq.heappop(heap)              # drop the farthest
    return [point for _, point in heap]`,

  'task-scheduler': `import heapq
from collections import Counter

def least_interval(tasks: list[str], n: int) -> int:
    heap = [-count for count in Counter(tasks).values()]
    heapq.heapify(heap)

    time = 0
    while heap:
        taken = []
        for _ in range(n + 1):
            if heap:
                taken.append(heapq.heappop(heap) + 1)

        for remaining in taken:
            if remaining < 0:
                heapq.heappush(heap, remaining)

        time += len(taken) if not heap else n + 1
    return time`,

  'meeting-rooms': `import heapq

def min_meeting_rooms(meetings: list[list[int]]) -> int:
    meetings.sort(key=lambda x: x[0])
    ends = []

    for start, end in meetings:
        if ends and ends[0] <= start:
            heapq.heappop(ends)          # a room freed up
        heapq.heappush(ends, end)
    return len(ends)`,

  // -------------------------------------------------------------------- graphs
  'number-of-islands': `def num_islands(grid: list[list[str]]) -> int:
    rows, cols = len(grid), len(grid[0])
    islands = 0

    def sink(r: int, c: int) -> None:
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0'
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            sink(r + dr, c + dc)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                islands += 1
                sink(r, c)
    return islands`,

  'course-schedule': `from collections import deque, defaultdict

def course_order(n: int, prerequisites: list[list[int]]) -> list[int]:
    adjacency = defaultdict(list)
    indegree = [0] * n

    for course, needs in prerequisites:
        adjacency[needs].append(course)
        indegree[course] += 1

    ready = deque(v for v in range(n) if indegree[v] == 0)
    order = []

    while ready:
        node = ready.popleft()
        order.append(node)
        for nxt in adjacency[node]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                ready.append(nxt)

    return order if len(order) == n else []   # fewer means a cycle`,

  'network-delay': `import heapq
from collections import defaultdict

def network_delay(times: list[list[int]], n: int, source: int) -> int:
    adjacency = defaultdict(list)
    for u, v, w in times:
        adjacency[u].append((v, w))

    dist = {}
    heap = [(0, source)]

    while heap:
        d, node = heapq.heappop(heap)
        if node in dist:
            continue                      # already settled
        dist[node] = d
        for nxt, weight in adjacency[node]:
            if nxt not in dist:
                heapq.heappush(heap, (d + weight, nxt))

    return max(dist.values()) if len(dist) == n else -1`,

  'word-ladder': `from collections import defaultdict, deque

def ladder_length(begin: str, end: str, words: list[str]) -> int:
    if end not in words:
        return 0

    buckets = defaultdict(list)
    for word in words:
        for i in range(len(word)):
            buckets[word[:i] + '*' + word[i + 1:]].append(word)

    queue = deque([(begin, 1)])
    seen = {begin}

    while queue:
        word, steps = queue.popleft()
        if word == end:
            return steps
        for i in range(len(word)):
            for nxt in buckets[word[:i] + '*' + word[i + 1:]]:
                if nxt not in seen:
                    seen.add(nxt)
                    queue.append((nxt, steps + 1))
    return 0`,

  // -------------------------------------------------------------------- greedy
  'non-overlapping-intervals': `def erase_overlap(intervals: list[list[int]]) -> int:
    intervals.sort(key=lambda x: x[1])          # by END time
    kept, last_end = 0, float('-inf')

    for start, end in intervals:
        if start >= last_end:
            kept += 1
            last_end = end
    return len(intervals) - kept`,

  'gas-station': `def can_complete(gas: list[int], cost: list[int]) -> int:
    total = tank = start = 0

    for i in range(len(gas)):
        gain = gas[i] - cost[i]
        total += gain
        tank += gain
        if tank < 0:
            start = i + 1
            tank = 0
    return start if total >= 0 else -1`,

  'jump-game-ii': `def jump(a: list[int]) -> int:
    jumps = current_end = furthest = 0

    for i in range(len(a) - 1):
        furthest = max(furthest, i + a[i])
        if i == current_end:
            jumps += 1
            current_end = furthest
    return jumps`,

  'partition-labels': `def partition_labels(s: str) -> list[int]:
    last = {ch: i for i, ch in enumerate(s)}
    sizes, start, end = [], 0, 0

    for i, ch in enumerate(s):
        end = max(end, last[ch])
        if i == end:
            sizes.append(end - start + 1)
            start = i + 1
    return sizes`,

  // ------------------------------------------------------- dynamic programming
  'climbing-stairs': `def climb_stairs(n: int) -> int:
    previous, current = 1, 1
    for _ in range(2, n + 1):
        previous, current = current, previous + current
    return current`,

  'coin-change': `def coin_change(coins: list[int], amount: int) -> int:
    dp = [amount + 1] * (amount + 1)      # sentinel above any real answer
    dp[0] = 0

    for x in range(1, amount + 1):
        for coin in coins:
            if coin <= x:
                dp[x] = min(dp[x], dp[x - coin] + 1)

    return -1 if dp[amount] > amount else dp[amount]`,

  'edit-distance': `def edit_distance(a: str, b: str) -> int:
    n, m = len(a), len(b)
    dp = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(n + 1): dp[i][0] = i
    for j in range(m + 1): dp[0][j] = j

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j - 1],   # replace
                                   dp[i - 1][j],       # delete
                                   dp[i][j - 1])       # insert
    return dp[n][m]`,

  'longest-increasing-subsequence': `from bisect import bisect_left

def length_of_lis(a: list[int]) -> int:
    tails = []
    for value in a:
        position = bisect_left(tails, value)
        if position == len(tails):
            tails.append(value)
        else:
            tails[position] = value
    return len(tails)`,

  // ------------------------------------------------------------------ advanced
  'implement-trie': `class Trie:
    def __init__(self):
        self.children = {}
        self.is_word = False

    def insert(self, word: str) -> None:
        node = self
        for ch in word:
            node = node.children.setdefault(ch, Trie())
        node.is_word = True

    def _walk(self, prefix: str):
        node = self
        for ch in prefix:
            node = node.children.get(ch)
            if node is None:
                return None
        return node

    def search(self, word: str) -> bool:
        node = self._walk(word)
        return node is not None and node.is_word

    def starts_with(self, prefix: str) -> bool:
        return self._walk(prefix) is not None`,

  'range-sum-mutable': `class Fenwick:
    def __init__(self, n: int):
        self.tree = [0] * (n + 1)          # 1-indexed internally

    def update(self, i: int, delta: int) -> None:
        i += 1
        while i < len(self.tree):
            self.tree[i] += delta
            i += i & -i

    def prefix_sum(self, i: int) -> int:
        i += 1; total = 0
        while i > 0:
            total += self.tree[i]
            i -= i & -i
        return total

    def range_sum(self, l: int, r: int) -> int:
        return self.prefix_sum(r) - (self.prefix_sum(l - 1) if l else 0)`,

  'maximum-xor-pair': `def find_maximum_xor(a: list[int]) -> int:
    root = {}
    for value in a:                         # build a binary trie
        node = root
        for bit in range(31, -1, -1):
            b = (value >> bit) & 1
            node = node.setdefault(b, {})

    best = 0
    for value in a:
        node, current = root, 0
        for bit in range(31, -1, -1):
            want = ((value >> bit) & 1) ^ 1     # the opposite bit
            if want in node:
                current |= 1 << bit
                node = node[want]
            else:
                node = node[want ^ 1]
        best = max(best, current)
    return best`,

  'sliding-window-median': `import heapq
from collections import defaultdict

# Two heaps plus lazy deletion: a value leaving the window is marked, and
# skipped only once it surfaces at a root. An ordered multiset (SortedList)
# is the simpler alternative if one is available.

def median_sliding_window(a: list[int], k: int) -> list[float]:
    lower, upper = [], []            # max-heap (negated), min-heap
    pending = defaultdict(int)

    def prune(heap, sign):
        while heap and pending[sign * heap[0]] > 0:
            pending[sign * heap[0]] -= 1
            heapq.heappop(heap)
    # ... balance by effective sizes, then read the median from the roots`,
};
