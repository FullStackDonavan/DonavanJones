---
title: "Recursion"
description: "How recursion works in JavaScript — base cases, the call stack, helper method vs pure recursion, and practical problem-solving examples with time complexity analysis."
date: 2025-08-28
category: "algorithms"
tags:
  - javascript
  - data-structures
draft: false
slug: recursion
author: Donavan Jones
---

# Recursion

Recursion is a technique where a function solves a problem by calling itself with a simpler version of the same input. Instead of a loop that iterates until a condition is met, a recursive function delegates the remaining work to itself — each call working on a reduced version of the problem — until it reaches a condition where the answer is known directly.

*Part of the [Algorithms & Data Structures series](/categories/algorithms).*

Recursion appears throughout computer science: tree traversal, file system exploration, merge sort, quicksort, depth-first graph search, and backtracking algorithms all rely on it. Understanding recursion is foundational to understanding how those more complex algorithms work.

## The Two Parts of Every Recursive Function

Every correct recursive function has exactly two components:

**Base case** — the condition where the function stops calling itself and returns a value directly. Without a base case, the function calls itself forever until the call stack overflows with a "Maximum call stack size exceeded" error.

**Recursive case** — where the function calls itself with a smaller or simpler version of the input. Each recursive call must bring the problem closer to the base case.

```js
function factorial(n) {
  // Base case: 0! is defined as 1
  if (n === 0) {
    return 1;
  }

  // Recursive case: n! = n × (n-1)!
  return n * factorial(n - 1);
}

console.log(factorial(5)); // 120
```

Tracing the execution of `factorial(5)`:

```
factorial(5)
  → 5 * factorial(4)
       → 4 * factorial(3)
            → 3 * factorial(2)
                 → 2 * factorial(1)
                      → 1 * factorial(0)
                               → 1   (base case)
                      = 1 * 1  = 1
                 = 2 * 1       = 2
            = 3 * 2            = 6
       = 4 * 6                 = 24
  = 5 * 24                     = 120
```

Each call waits on the stack until the base case is reached, then the results cascade back up.

## The Call Stack

When a function calls itself, JavaScript pushes a new frame onto the call stack for each invocation. Each frame holds that call's local variables and the point to return to when it completes.

```js
function countdown(n) {
  if (n <= 0) {
    console.log("Done!");
    return;
  }

  console.log(n);
  countdown(n - 1);
}

countdown(3);
// 3
// 2
// 1
// Done!
```

With `countdown(3)`, the call stack grows like this:

```
countdown(0)  ← top (base case, returns first)
countdown(1)
countdown(2)
countdown(3)  ← bottom (first call)
```

When `countdown(0)` hits the base case and returns, each frame pops off in reverse order. A deep recursion without a reachable base case causes a **stack overflow** — JavaScript's call stack has a finite size, typically around 10,000–15,000 frames.

---

*Explore more articles in the [Algorithms & Data Structures series](/categories/algorithms).*

---

## Helper Method Recursion

Sometimes the recursive logic is cleanest inside a nested helper function, keeping the outer function's interface simple. This is the helper method pattern:

```js
function collectOddValues(arr) {
  const result = [];

  function helper(input) {
    if (input.length === 0) {
      return;
    }

    if (input[0] % 2 !== 0) {
      result.push(input[0]);
    }

    helper(input.slice(1));
  }

  helper(arr);
  return result;
}

console.log(collectOddValues([1, 2, 3, 4, 5, 6, 7]));
// [1, 3, 5, 7]
```

The helper function handles the recursion and accumulates results into `result`, which the outer function returns. This avoids threading the accumulator through every call's parameter list.

## Pure Recursion

The same logic without a helper, building the result as the calls return:

```js
function collectOddValues(arr) {
  if (arr.length === 0) {
    return [];
  }

  if (arr[0] % 2 !== 0) {
    return [arr[0], ...collectOddValues(arr.slice(1))];
  }

  return collectOddValues(arr.slice(1));
}

console.log(collectOddValues([1, 2, 3, 4, 5, 6, 7]));
// [1, 3, 5, 7]
```

Pure recursion avoids shared mutable state but creates new arrays at each level. For large inputs this has performance implications; the helper method approach is often more efficient when an accumulator is needed.

## Recursion vs. Iteration

Most recursive problems can also be solved iteratively. The choice depends on readability and the nature of the problem:

| Consideration | Recursion | Iteration |
|---|---|---|
| Readability for nested structures | Natural | Can become complex |
| Readability for simple loops | Verbose | Natural |
| Stack space | O(n) call frames | O(1) extra space |
| Stack overflow risk | Yes, for deep inputs | No |
| Performance overhead | Slightly higher | Slightly lower |
| Best use cases | Trees, graphs, divide-and-conquer | Arrays, simple counting |

For problems with natural hierarchical or nested structure — traversing a DOM tree, exploring a directory, parsing nested JSON — recursion is almost always cleaner. For flat iteration over an array, a loop is simpler.

## Common Recursion Examples

### Power Function

```js
function power(base, exponent) {
  if (exponent === 0) {
    return 1;
  }

  return base * power(base, exponent - 1);
}

console.log(power(2, 10)); // 1024
```

### Fibonacci Sequence

```js
function fibonacci(n) {
  if (n <= 2) {
    return 1;
  }

  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
```

This naive implementation recalculates the same values repeatedly. `fibonacci(50)` is prohibitively slow without memoization — the time complexity is O(2ⁿ) because each call branches into two more. In practice, use dynamic programming or memoization for the Fibonacci sequence beyond small inputs.

### Flatten a Nested Array

```js
function flatten(arr) {
  let result = [];

  for (let item of arr) {
    if (Array.isArray(item)) {
      result = result.concat(flatten(item));
    } else {
      result.push(item);
    }
  }

  return result;
}

console.log(flatten([[1, 2], [3, [4, 5]]]));
// [1, 2, 3, 4, 5]
```

Flattening a nested structure is a natural fit for recursion because the nesting depth is unknown. An iterative solution would need to manage a stack explicitly — you are essentially writing the same algorithm with more code.

## Time and Space Complexity

Recursive complexity depends on how many calls are made, how much work happens at each level, and how deep the call stack grows:

| Problem | Time | Space (call stack) |
|---|---|---|
| Factorial | O(n) | O(n) |
| Power | O(n) | O(n) |
| Binary search (recursive) | O(log n) | O(log n) |
| Fibonacci (naive) | O(2ⁿ) | O(n) |
| Merge sort | O(n log n) | O(n) |

The space complexity reflects the maximum depth of the call stack, not just the input size. A recursive binary search on 1,000,000 elements grows the call stack only 20 frames deep — O(log n) space.

## Common Mistakes

**No base case** — the function calls itself indefinitely:

```js
// Will crash with "Maximum call stack size exceeded"
function infinite(n) {
  return infinite(n - 1);
}
```

**Base case never reached** — the recursive step moves away from the base case:

```js
// n grows instead of shrinking — same crash
function broken(n) {
  if (n === 0) return "done";
  return broken(n + 1);
}
```

**Forgetting to return the recursive call** — the function always returns `undefined`:

```js
function factorial(n) {
  if (n === 0) return 1;
  factorial(n - 1); // missing return — always returns undefined
}
```

## Final Thoughts

Recursion is one of the most important concepts in algorithms and technical interviews. It feels unfamiliar at first because most early programming focuses on loops. Once the base case / recursive case pattern becomes intuitive, it unlocks a natural way to think about nested structures, divide-and-conquer algorithms, tree traversal, and backtracking.

The three questions to ask when writing any recursive solution:

- What is the base case — the simplest valid input with a known answer?
- How does each recursive call move closer to the base case?
- Does every code path return a value?

Answer those correctly and the recursion will work.

---

*[← Back to Algorithms & Data Structures](/categories/algorithms)*
