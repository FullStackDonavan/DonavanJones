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
    tags: [
      { title: 'memory', link: '/tags/memory' },
      { title: 'agents', link: '/tags/agents' },
      { title: 'vector-db', link: '/tags/vector-db' },
      { title: 'retrieval', link: '/tags/retrieval' },
      { title: 'tools', link: '/tags/tools' },
      { title: 'orchestration', link: '/tags/orchestration' },
      { title: 'state', link: '/tags/state' },
      { title: 'autogen', link: '/tags/autogen' },
      { title: 'frameworks', link: '/tags/frameworks' },
      { title: 'theology', link: '/tags/theology' },
      { title: 'chunking', link: '/tags/chunking' },
      { title: 'embeddings', link: '/tags/embeddings' },
      { title: 'semantic', link: '/tags/semantic' },
      { title: 'citations', link: '/tags/citations' },
      { title: 'hallucination', link: '/tags/hallucination' },
      { title: 'pipelines', link: '/tags/pipelines' },
      { title: 'bible-study', link: '/tags/bible-study' },
      { title: 'prompt', link: '/tags/prompt' },
      { title: 'generation', link: '/tags/generation' },
      { title: 'consistency', link: '/tags/consistency' },
      { title: 'moderation', link: '/tags/moderation' },
      { title: 'debate', link: '/tags/debate' },
      { title: 'voice', link: '/tags/voice' },
      { title: 'ocr', link: '/tags/ocr' },
      { title: 'manuscripts', link: '/tags/manuscripts' },
      { title: 'ideas', link: '/tags/ideas' },
      { title: 'planning', link: '/tags/planning' },
    ],
  },
  {
    title: 'Algorithms & Data Structures',
    message: 'Study algorithmic patterns and data structure strategies for performant applications.',
    image: '/img/logos/algorithms.svg',
    link: '/categories/algorithms',
    lessonQuantity: 0,
    tags: [
      { title: 'algorithms', link: '/tags/algorithms' },
      { title: 'javascript', link: '/tags/javascript' },
      { title: 'data-structures', link: '/tags/data-structures' },
      { title: 'problem-solving-patterns', link: '/tags/problem-solving-patterns' },
    ],
  },
  {
    title: 'Backend Engineering',
    message: 'Backend engineering practices, API design, and architecture for scalable systems.',
    image: '/img/logos/backend.svg',
    link: '/categories/backend-engineering',
    lessonQuantity: 0,
    tags: [
      { title: 'architecture', link: '/tags/architecture' },
      { title: 'microservices', link: '/tags/microservices' },
      { title: 'ai', link: '/tags/ai' },
      { title: 'services', link: '/tags/services' },
      { title: 'authentication', link: '/tags/authentication' },
      { title: 'embeddings', link: '/tags/embeddings' },
      { title: 'vector-search', link: '/tags/vector-search' },
      { title: 'streaming', link: '/tags/streaming' },
      { title: 'notifications', link: '/tags/notifications' },
      { title: 'inference', link: '/tags/inference' },
      { title: 'ocr', link: '/tags/ocr' },
      { title: 'orchestration', link: '/tags/orchestration' },
      { title: 'async', link: '/tags/async' },
      { title: 'workers', link: '/tags/workers' },
      { title: 'gpu', link: '/tags/gpu' },
      { title: 'batching', link: '/tags/batching' },
      { title: 'latency', link: '/tags/latency' },
      { title: 'optimization', link: '/tags/optimization' },
      { title: 'models', link: '/tags/models' },
      { title: 'postgres', link: '/tags/postgres' },
      { title: 'age', link: '/tags/age' },
      { title: 'cypher', link: '/tags/cypher' },
      { title: 'graph', link: '/tags/graph' }
    ]
  },
  {
    title: 'Infrastructure Engineering',
    message: 'Infrastructure topics for deployment, observability, and resilient production environments.',
    image: '/img/logos/infrastructure.svg',
    link: '/categories/infrastructure-engineering',
    lessonQuantity: 0,
    tags: [
      { title: 'k3s', link: '/tags/k3s' },
      { title: 'raspberry-pi', link: '/tags/raspberry-pi' },
      { title: 'hardware', link: '/tags/hardware' },
      { title: 'homelab', link: '/tags/homelab' },
      { title: 'setup', link: '/tags/setup' },
      { title: 'networking', link: '/tags/networking' },
      { title: 'kubernetes', link: '/tags/kubernetes' },
      { title: 'storage', link: '/tags/storage' },
      { title: 'ingress', link: '/tags/ingress' },
      { title: 'monitoring', link: '/tags/monitoring' },
      { title: 'troubleshooting', link: '/tags/troubleshooting' },
      { title: 'diagrams', link: '/tags/diagrams' },
      { title: 'architecture', link: '/tags/architecture' },
      { title: 'arm64', link: '/tags/arm64' },
      { title: 'cluster', link: '/tags/cluster' },
      { title: 'control-plane', link: '/tags/control-plane' },
      { title: 'cooling', link: '/tags/cooling' },
      { title: 'power', link: '/tags/power' },
      { title: 'cost', link: '/tags/cost' },
      { title: 'performance', link: '/tags/performance' },
      { title: 'dns', link: '/tags/dns' },
      { title: 'expansion', link: '/tags/expansion' },
      { title: 'gitea', link: '/tags/gitea' },
      { title: 'ci-cd', link: '/tags/ci-cd' },
      { title: 'design', link: '/tags/design' },
      { title: 'topology', link: '/tags/topology' },
      { title: 'skills', link: '/tags/skills' },
      { title: 'nodes', link: '/tags/nodes' },
      { title: 'organization', link: '/tags/organization' },
      { title: 'pods', link: '/tags/pods' },
      { title: 'rack', link: '/tags/rack' },
      { title: 'ai', link: '/tags/ai' },
      { title: 'workloads', link: '/tags/workloads' },
      { title: 'strategy', link: '/tags/strategy' },
      { title: 'systems', link: '/tags/systems' },
      { title: 'motivation', link: '/tags/motivation' },
      { title: 'git', link: '/tags/git' }
    ]
  }
];


  let row: ICategory[][] = [];
  let i, l, chunkSize = rowSize;

  for (i = 0, l = categories.length; i < l; i += chunkSize) {
    row.push(categories.slice(i, i + chunkSize));
  }
  return row;
};
