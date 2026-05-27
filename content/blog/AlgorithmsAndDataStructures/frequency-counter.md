---
title: "Understanding the Frequency Counter Pattern in JavaScript"
description: "A deep dive into the Frequency Counter pattern with examples and a JavaScript implementation."
date: 2025-07-24
tags: [algorithms, javascript, frequency-counter, data-structures]
---

# Understanding the Frequency Counter Pattern in JavaScript

The Frequency Counter pattern uses objects (hash maps) to store frequencies of values or characters to solve problems efficiently by reducing time complexity.

---

## What is the Frequency Counter Pattern?

Instead of using nested loops to compare elements (which results in O(n²) complexity), we use objects to keep track of the frequency of items and then compare those frequencies.

---

## Example Problem: Check if Two Strings Are Anagrams

An anagram means the strings contain the same characters with the same frequencies, but possibly in a different order.

### Solution Approach

1. If the strings have different lengths, they can’t be anagrams.
2. Use frequency counters (objects) to count characters in both strings.
3. Compare the frequency counts.


Below is a component I built as part of my learning process to demonstrate the pattern in action:

<FrequencyCounter />

---

## JavaScript Implementation

```js
function validAnagram(str1, str2) {
  if (str1.length !== str2.length) return false;

  const frequencyCounter1 = {};
  const frequencyCounter2 = {};

  for (let char of str1) {
    frequencyCounter1[char] = (frequencyCounter1[char] || 0) + 1;
  }

  for (let char of str2) {
    frequencyCounter2[char] = (frequencyCounter2[char] || 0) + 1;
  }

  for (let key in frequencyCounter1) {
    if (frequencyCounter1[key] !== frequencyCounter2[key]) {
      return false;
    }
  }

  return true;
}

// Example usage:
console.log(validAnagram('anagram', 'nagaram')); // true
console.log(validAnagram('rat', 'car')); // false
