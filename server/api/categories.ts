// api/categories.ts

import type { ICategory } from '~/types/ICategory'; // Use type-only import

export default (name: string): ICategory[][] => {
  const rowSize = 2;

  const categories: ICategory[] = [
    {
      title: 'PHP',
      message: 'PHP Projects that I have Worked On',
      image: '/img/logos/php.svg',
      link: '/categories/php',
      lessonQuantity: 1,
      tags: [{ title: 'WordPress', link: '/tags/wordpress' },{ title: 'Custom', link: '/tags/custom' }]
    },
    {
      title: 'JavaScript',
      message: 'JavaScript Projects that I have Worked On',
      image: '/img/logos/javascript.png',
      link: '/categories/javascript',
      lessonQuantity: 2,
      tags: [{ title: 'Nuxt', link: '/tags/nuxt' }, { title: 'Astro', link: '/tags/astro' }]
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
