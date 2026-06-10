---
title: "Binary Search"
description: "Learn how Binary Search works in JavaScript — step-by-step examples, O(log n) time complexity analysis, sorted array requirements, and practical use cases."
date: 2025-08-14
lastUpdated: "2026-06-09"
category: "algorithms"
tags:
  - javascript
  - data-structures
draft: false
slug: binary-search
author: Donavan Jones
---

# Binary Search

Binary Search is an efficient searching algorithm used to find a target value inside a **sorted array**. Instead of checking every element one by one like Linear Search, Binary Search repeatedly divides the search space in half until the target is found or the search range becomes empty.

Because it cuts the search area in half each step, Binary Search is much faster on large datasets.

*Part of the [Algorithms & Data Structures series](/categories/algorithms).*

## How Binary Search Works

The algorithm follows these steps:

1. Find the middle element of the array.
2. Compare the middle element with the target value.
3. If the target matches the middle element, return the index.
4. If the target is smaller, continue searching the left half.
5. If the target is larger, continue searching the right half.
6. Repeat until the value is found or no elements remain.

## Example Array

```js
const numbers = [1, 3, 5, 7, 9, 11, 13, 15];
````

If we want to search for `11`:

- Start in the middle (`7`)
- `11` is greater than `7`
- Search the right half
- Middle becomes `11`
- Value found

## Binary Search in JavaScript

```js
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);

    if (arr[middle] === target) {
      return middle;
    }

    if (arr[middle] < target) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  return -1;
}

const numbers = [1, 3, 5, 7, 9, 11, 13, 15];

console.log(binarySearch(numbers, 11)); // 5
```

## Time Complexity

| Operation    | Complexity |
| ------------ | ---------- |
| Best Case    | O(1)       |
| Average Case | O(log n)   |
| Worst Case   | O(log n)   |

Binary Search is significantly faster than Linear Search for large sorted datasets.

## Space Complexity

| Implementation | Complexity |
| -------------- | ---------- |
| Iterative      | O(1)       |
| Recursive      | O(log n)   |

---

*Explore more articles in the [Algorithms & Data Structures series](/categories/algorithms).*

---

## When to Use Binary Search

Binary Search is useful when:

- The data is already sorted
- Fast lookups are needed
- Working with large datasets
- Searching IDs, usernames, timestamps, or ordered values

## Common Mistake

Binary Search only works correctly on **sorted arrays**.

This will produce incorrect results:

```js
const numbers = [9, 1, 15, 3, 7];
```

Always sort the array first before using Binary Search.

## Recursive Version

```js
function recursiveBinarySearch(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) {
    return -1;
  }

  const middle = Math.floor((left + right) / 2);

  if (arr[middle] === target) {
    return middle;
  }

  if (arr[middle] < target) {
    return recursiveBinarySearch(arr, target, middle + 1, right);
  }

  return recursiveBinarySearch(arr, target, left, middle - 1);
}
```

## Final Thoughts

Binary Search is one of the most important algorithms in computer science and technical interviews. Understanding how it works helps build stronger problem-solving skills and introduces the concept of divide-and-conquer algorithms.

Once you understand Binary Search, it becomes easier to learn more advanced searching and tree-based algorithms.

---

## Further Reading

::AuthoritativeLinks
---
title: "Sources"
links:
  - label: "Binary Search Algorithm — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Binary_search_algorithm"
    type: "wikipedia"
    description: "According to this overview, binary search achieves O(log n) by halving the search space on each comparison — the formal definition the implementation is based on."
  - label: "Big O Notation — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Big_O_notation"
    type: "wikipedia"
    description: "The formal notation for describing algorithm time and space complexity — the framework used to analyze binary search's logarithmic performance."
  - label: "Search Algorithm — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Search_algorithm"
    type: "wikipedia"
    description: "Overview of search algorithm categories — places binary search relative to linear and hash-based alternatives."
  - label: "Sorted Array — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Sorted_array"
    type: "wikipedia"
    description: "According to this overview, a sorted array is the prerequisite data structure for binary search — the property that enables logarithmic lookup."
---
::

---

*[← Back to Algorithms & Data Structures](/categories/algorithms)*
