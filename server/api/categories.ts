// api/categories.ts

import type { ICategory } from '~/types/ICategory'; // Use type-only import

export default (name: string): ICategory[][] => {
  const rowSize = 2;

  const categories: ICategory[] = [
    {
      title: 'PHP',
      message: 'PHP Projects that I have Worked On',
      image: '/img/nuxt3.svg',
      link: '/categories/php',
      lessonQuantity: 1,
      tags: [{ title: 'Front End', link: '/frontend-courses' }]
    },
    {
      title: 'JavaScript',
      message: 'JavaScript Projects that I have Worked On',
      image: '/img/laravel.svg',
      link: '/categories/laravel',
      lessonQuantity: 2,
      tags: [{ title: 'Back End', link: '/backend-courses' }]
    },
    // ... other categories
  ];

  let row: ICategory[][] = [];
  let i, l, chunkSize = rowSize;

  for (i = 0, l = categories.length; i < l; i += chunkSize) {
    row.push(categories.slice(i, i + chunkSize));
  }
  return row;
};
