---

title: "Recursion"
description: "Recursion in JavaScript and algorithmic problem solving."
date: 2025-07-24
category: "algorithms"
tags:

- javascript
- data-structures

---

# Recursion

Recursion is a programming technique where a function calls itself to solve a problem by breaking it into smaller versions of the same problem. It is especially useful when a task can be naturally divided into subproblems, such as traversing trees, exploring folders, or solving divide-and-conquer problems.

A recursive function usually has two parts:

1. A **base case*- that stops the recursion.
2. A **recursive case*- that keeps reducing the problem.

## Example

```js
function factorial(n) {
  if (n === 0) {
    return 1;
  }

  return n - factorial(n - 1);
}

console.log(factorial(5)); // 120
```

In this example, `factorial(5)` becomes `5 - factorial(4)`, then `4 - factorial(3)`, and so on until it reaches the base case.

## Why recursion matters

Recursion is common in technical interviews and real-world development because it helps with:

- tree and graph traversal
- searching nested data
- file system exploration
- backtracking problems
- divide-and-conquer algorithms

## Things to watch for

Recursive solutions are elegant, but they can also be expensive if they repeat work unnecessarily. A missing base case can cause infinite recursion, and deep recursion can lead to a stack overflow.

## Common recursion pattern

When writing a recursive solution, ask:

- What is the smallest valid input?
- What should happen at the base case?
- How does each call get closer to the base case?
- Does the function return the correct value at every step?

## Conclusion

Recursion is one of the most important problem-solving patterns in programming. Once you understand the base case and the recursive step, many seemingly difficult problems become much easier to solve.
