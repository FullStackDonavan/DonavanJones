---
title: "Linear Search"
description: "Linear Search"
date: 2025-08-07
category: "algorithms"
tags:
- javascript
- data-structures
---

# Linear Search

Linear search is one of the simplest search algorithms. It checks each item in a list one by one until it finds the target value or reaches the end of the list.

## How it works

1. Start at the beginning of the array.
2. Compare the current item with the target.
3. If they match, return the index.
4. If no match is found, return `-1`.

## Example

```js
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}

console.log(linearSearch([10, 20, 30, 40], 30)); // 2
```

## Time complexity

- Best case: `O(1)`
- Average case: `O(n)`
- Worst case: `O(n)`

## When to use it

Linear search is useful for small arrays or unsorted data where simplicity matters more than speed.
