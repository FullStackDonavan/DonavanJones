---
title: "Sliding Window"
description: "Understanding the Sliding Window pattern in JavaScript — how it solves subarray and substring problems in O(n) with contiguous data structure examples."
date: 2025-09-06
lastUpdated: "2026-06-09"
category: "algorithms"
tags:
  - javascript
  - data-structures
  - problem-solving-patterns
draft: false
slug: sliding-window
author: Donavan Jones
---

# Sliding Window

The Sliding Window pattern is a common algorithmic technique used to reduce the time complexity of problems involving arrays or strings. Instead of using nested loops, the pattern allows you to move a subset of data across a collection while updating values dynamically.

This technique is especially useful for:

- Finding maximum or minimum sums
- Longest or shortest substrings
- Contiguous subarrays
- Performance optimization problems

Using a sliding window can often reduce a brute-force solution from O(n²) to O(n).

*Part of the [Algorithms & Data Structures series](/categories/algorithms).*

## Basic Idea

A “window” represents a range of elements inside an array or string.

The window can:

- Expand
- Shrink
- Slide forward

As the window moves, you update calculations incrementally instead of recalculating everything from scratch.

## Example Problem

Find the maximum sum of 3 consecutive numbers in an array.

```js
const numbers = [1, 2, 3, 4, 5, 6];
````

### Brute Force Approach

```js
function maxSum(arr, size) {
  let max = 0;

  for (let i = 0; i < arr.length - size + 1; i++) {
    let temp = 0;

    for (let j = 0; j < size; j++) {
      temp += arr[i + j];
    }

    max = Math.max(max, temp);
  }

  return max;
}

console.log(maxSum(numbers, 3));
```

This works, but it recalculates the same values repeatedly.

Time complexity:

```txt
O(n²)
```

## Sliding Window Solution

```js
function maxSum(arr, size) {
  let windowSum = 0;
  let maxSum = 0;

  // Create initial window
  for (let i = 0; i < size; i++) {
    windowSum += arr[i];
  }

  maxSum = windowSum;

  // Slide the window
  for (let i = size; i < arr.length; i++) {
    windowSum = windowSum - arr[i - size] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

console.log(maxSum(numbers, 3));
```

## How It Works

Initial window:

```txt
[1, 2, 3] = 6
```

Slide forward:

```txt
Remove 1
Add 4

[2, 3, 4] = 9
```

Slide again:

```txt
Remove 2
Add 5

[3, 4, 5] = 12
```

The algorithm avoids recalculating the entire sum each time.

Time complexity:

```txt
O(n)
```

---

*Explore more articles in the [Algorithms & Data Structures series](/categories/algorithms).*

---

## Common Sliding Window Problems

### Fixed Window Size

Examples:

- Maximum sum subarray
- Average of subarrays
- Consecutive elements

### Dynamic Window Size

Examples:

- Longest substring without repeating characters
- Smallest subarray with a target sum
- Character replacement problems

## Example: Longest Unique Substring

```js
function longestSubstring(str) {
  let left = 0;
  let seen = new Set();
  let maxLength = 0;

  for (let right = 0; right < str.length; right++) {
    while (seen.has(str[right])) {
      seen.delete(str[left]);
      left++;
    }

    seen.add(str[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

console.log(longestSubstring("abcabcbb"));
```

## When to Use Sliding Window

The pattern is useful when:

- Working with contiguous sequences
- Looking for ranges or subsets
- Repeated calculations happen in loops
- You need better performance than nested loops

## Final Thoughts

The Sliding Window pattern is one of the most important optimization techniques in algorithm design. It appears frequently in coding interviews, competitive programming, and real-world applications involving streams, arrays, and strings.

Mastering this pattern will help you write more efficient and scalable JavaScript solutions.

---

## Further Reading

::AuthoritativeLinks
---
title: "Sources"
links:
  - label: "Sliding Window Protocol — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Sliding_window_protocol"
    type: "wikipedia"
    description: "According to this overview, the sliding window concept originates in networking — managing a moving range of data without reprocessing the full set on each step."
  - label: "Substring — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Substring"
    type: "wikipedia"
    description: "Definition of a substring — the core data structure that dynamic sliding window problems operate over when finding longest or shortest matching sequences."
  - label: "Time Complexity — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Time_complexity"
    type: "wikipedia"
    description: "Formal definition of time complexity — the framework for explaining how the sliding window reduces O(n²) subarray iteration to O(n) by reusing prior computation."
  - label: "Dynamic Programming — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Dynamic_programming"
    type: "wikipedia"
    description: "The algorithmic paradigm that shares the sliding window's core insight: avoid redundant work by reusing previously computed results."
---
::

---

*[← Back to Algorithms & Data Structures](/categories/algorithms)*
