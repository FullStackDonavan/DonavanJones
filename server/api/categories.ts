// api/categories.ts

import type { ICategory } from '~/types/ICategory'; // Use type-only import

export default (name: string): ICategory[][] => {
  const rowSize = 2;

 const categories: ICategory[] = [
  {
    title: 'AI Engineering',
    message: 'Explore core concepts and published notes for building safe, maintainable AI systems.',
    image: '/img/logos/ai.svg',
    link: '/categories/ai-engineering',
    lessonQuantity: 0,
    tags: [{ title: 'ai-engineering', link: '/tags/ai-engineering' }],
  },
  {
    title: 'Algorithms & Data Structures',
    message: 'Study algorithmic patterns and data structure strategies for performant applications.',
    image: '/img/logos/algorithms.svg',
    link: '/categories/algorithms-and-data-structures',
    lessonQuantity: 0,
    tags: [{ title: 'algorithms', link: '/tags/algorithms' }],
  },
  {
    title: 'Backend Engineering',
    message: 'Backend engineering practices, API design, and architecture for scalable systems.',
    image: '/img/logos/backend.svg',
    link: '/categories/backend-engineering',
    lessonQuantity: 0,
    tags: [{ title: 'backend-engineering', link: '/tags/backend-engineering' }],
  },
  {
    title: 'Infrastructure Engineering',
    message: 'Infrastructure topics for deployment, observability, and resilient production environments.',
    image: '/img/logos/infrastructure.svg',
    link: '/categories/infrastructure-engineering',
    lessonQuantity: 0,
    tags: [{ title: 'infrastructure-engineering', link: '/tags/infrastructure-engineering' }],
  },
];


  let row: ICategory[][] = [];
  let i, l, chunkSize = rowSize;

  for (i = 0, l = categories.length; i < l; i += chunkSize) {
    row.push(categories.slice(i, i + chunkSize));
  }
  return row;
};
