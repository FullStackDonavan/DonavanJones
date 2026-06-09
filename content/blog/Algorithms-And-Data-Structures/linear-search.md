---
title: "Linear Search"
description: "How Linear Search works in JavaScript — iterating through arrays element by element, time complexity analysis, and when to use it over binary search."
date: 2025-08-07
lastUpdated: "2026-06-09"
category: "algorithms"
tags:
  - javascript
  - data-structures
draft: false
slug: linear-search
author: Donavan Jones
---

# Linear Search

Linear Search is the simplest searching algorithm. It examines each element in a list one by one, from beginning to end, until it finds the target value or exhausts the entire collection. There are no shortcuts, no requirements on the data, and no clever tricks — just a straight scan from left to right.

*Part of the [Algorithms & Data Structures series](/categories/algorithms).*

That simplicity is both its strength and its limitation. Linear Search works on any array, sorted or unsorted, and on any data type with an equality check. But for large datasets, checking every element is slow. Understanding when linear search is the right tool — and when something faster like Binary Search is worth the overhead — is an important part of writing efficient code.

## How Linear Search Works

1. Start at the first element of the array.
2. Compare the current element with the target value.
3. If they match, return the index.
4. If they do not match, move to the next element.
5. Repeat until a match is found or the end of the array is reached.
6. If no match is found, return `-1`.

## JavaScript Implementation

```js
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }

  return -1;
}

console.log(linearSearch([10, 20, 30, 40, 50], 30)); // 2
console.log(linearSearch([10, 20, 30, 40, 50], 99)); // -1
```

The function iterates through every element. The moment it finds a match, it returns the index immediately — it does not continue searching. If the loop completes without finding the target, it returns `-1` to signal the value is not in the array.

## Tracing Through an Example

For `linearSearch([10, 20, 30, 40, 50], 30)`:

| Step | Index | Element | Match? |
|---|---|---|---|
| 1 | 0 | 10 | No |
| 2 | 1 | 20 | No |
| 3 | 2 | 30 | **Yes** — return 2 |

For `linearSearch([10, 20, 30, 40, 50], 99)`:

| Step | Index | Element | Match? |
|---|---|---|---|
| 1 | 0 | 10 | No |
| 2 | 1 | 20 | No |
| 3 | 2 | 30 | No |
| 4 | 3 | 40 | No |
| 5 | 4 | 50 | No |
| End | — | — | Return -1 |

## Time Complexity

| Case | Complexity | When it occurs |
|---|---|---|
| Best case | O(1) | Target is the first element |
| Average case | O(n) | Target is somewhere in the middle |
| Worst case | O(n) | Target is at the end or not present |

Linear Search is O(n) because in the worst case it must examine every element. Doubling the size of the array doubles the maximum number of comparisons.

## Space Complexity

| Implementation | Complexity |
|---|---|
| Iterative | O(1) |

Linear Search requires no additional data structures. It uses a fixed number of variables regardless of input size.

---

*Explore more articles in the [Algorithms & Data Structures series](/categories/algorithms).*

---

## Linear Search on Strings

The same pattern works for arrays of strings:

```js
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}

const names = ["Alice", "Bob", "Carol", "David"];
console.log(linearSearch(names, "Carol")); // 2
console.log(linearSearch(names, "Eve"));   // -1
```

Any data type works as long as `===` produces a meaningful equality check. For custom comparison logic — partial matches, case-insensitive strings, objects — you can swap out the equality check for any predicate.

## Built-In JavaScript Linear Search Methods

Several of JavaScript's built-in array methods use linear search internally:

```js
const arr = [10, 20, 30, 40, 50];

// indexOf — returns index or -1
console.log(arr.indexOf(30));           // 2
console.log(arr.indexOf(99));           // -1

// includes — returns boolean
console.log(arr.includes(30));          // true
console.log(arr.includes(99));          // false

// find — returns the first matching element
console.log(arr.find(n => n > 25));     // 30

// findIndex — returns the index of the first match
console.log(arr.findIndex(n => n > 25)); // 2
```

All of these iterate through the array in order and are O(n) in the worst case. When you reach for `find` or `includes` in everyday code, you are using linear search.

## Linear Search vs. Binary Search

| Feature | Linear Search | Binary Search |
|---|---|---|
| Array must be sorted | No | Yes |
| Time complexity | O(n) | O(log n) |
| Space complexity | O(1) | O(1) iterative |
| Works on unsorted data | Yes | No |
| Best for | Small or unsorted arrays | Large sorted arrays |

For a sorted array of 1,000,000 elements, binary search takes at most 20 comparisons. Linear search may take up to 1,000,000. The difference matters at scale — but for a 10-element array, sorting first and running binary search introduces more overhead than it saves.

## When to Use Linear Search

Linear Search is the right choice when:

- The array is unsorted and sorting first is not practical
- The dataset is small enough that O(n) performance is acceptable
- You are doing a one-time search where pre-sorting costs more than the search
- The comparison logic is complex — custom objects, partial matches, case-insensitive checks
- You are already using a built-in method like `find`, `includes`, or `indexOf`

Linear Search is not appropriate when:

- The array is large and sorted — use Binary Search
- The same data will be searched many times — sort once, then use Binary Search
- Working with database indexes or sorted collections where O(log n) lookup is available

## Practical Example: Finding a User by ID

```js
function findUserById(users, id) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      return users[i];
    }
  }
  return null;
}

const users = [
  { id: 101, name: "Alice" },
  { id: 102, name: "Bob" },
  { id: 103, name: "Carol" },
];

console.log(findUserById(users, 102));
// { id: 102, name: "Bob" }
```

The objects are not sorted by any natural key, so linear search is the straightforward choice. If this list grew large and was searched frequently by ID, the right engineering decision would be to store users in a `Map` keyed by ID for O(1) lookup.

## Final Thoughts

Linear Search is the algorithm you already knew before you started studying algorithms. Every time you have scanned a list looking for a value, you were doing linear search. It is simple, universal, and completely correct for small or unsorted datasets.

Its limitation is that it does not scale. For large sorted collections where search performance matters, Binary Search is dramatically faster. Learning linear search and its constraints gives you the baseline against which every more efficient searching algorithm is measured.

---

*[← Back to Algorithms & Data Structures](/categories/algorithms)*
