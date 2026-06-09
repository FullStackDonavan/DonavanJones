---
title: "Backend Engineering"
slug: "backend-engineering"
tagline: "Build the services, pipelines, and infrastructure that power AI-integrated production systems"
description:
  - "Backend engineering for AI-integrated systems requires different decisions than traditional API development. When your backend runs inference pipelines, manages embedding services, streams model responses, and coordinates async workers — standard CRUD patterns don't hold."
  - "The core challenge: AI components are expensive, slow, and non-deterministic. ML inference has variable latency. Embeddings are computationally heavy. Building reliably around these characteristics requires explicit strategies for batching, queue management, resource isolation, and graceful degradation."
  - "This series covers 19 articles from building the backend infrastructure for a production AI-powered Bible app — semantic search, embedding pipelines, OCR, streaming AI responses, and a graph database layer for relationship queries."
featuredArticles:
  - path: "/blog/backendengineering/01-monolith-vs-microservices"
    label: "Start Here"
    reason: "The architectural decision that shapes everything else"
  - path: "/blog/backendengineering/04-embeddings"
    label: "Core Service"
    reason: "How embedding services work as backend infrastructure"
  - path: "/blog/backendengineering/06-streaming"
    label: "Key Pattern"
    reason: "Streaming responses from AI models in production"
learningPath:
  - phase: "Architecture Decisions"
    description: "The foundational choices that determine how your system scales, how teams work, and how AI components fit into your infrastructure."
    articles:
      - "Monolith vs Microservices"
      - "AI Services Architecture"
  - phase: "Core Service Patterns"
    description: "Authentication, embeddings, vector search, and streaming — the backend primitives that power modern AI applications."
    articles:
      - "Authentication"
      - "Embeddings"
      - "Vector Search"
      - "Streaming"
      - "Notifications"
  - phase: "AI-Specific Infrastructure"
    description: "The backend services purpose-built for AI workloads: inference, embedding pipelines, OCR, and agent orchestration."
    articles:
      - "Inference Services"
      - "Embedding Services"
      - "OCR Pipelines"
      - "Agent Orchestration"
  - phase: "Performance & Scale"
    description: "Optimization patterns for AI-heavy backends — async workers, GPU allocation, batching, latency tuning, and model loading."
    articles:
      - "Async Workers"
      - "GPU Allocation"
      - "Batching"
      - "Latency Optimization"
      - "Model Loading Strategies"
  - phase: "Graph & Data"
    description: "Graph database patterns for relationship-heavy data models, using PostgreSQL with the AGE extension."
    articles:
      - "Installing AGE"
      - "Cypher Queries in PostgreSQL"
      - "Graph-SQL Hybrid Querying"
faqs:
  - question: "When should I use microservices instead of a monolith for an AI system?"
    answer: "Start with a monolith unless you have a specific, proven reason to split. For AI systems specifically, premature service decomposition creates coordination overhead around shared models, embedding caches, and vector stores that's hard to manage. Split when a specific component — like an embedding service or inference worker — has clearly different scaling requirements or failure characteristics from the rest of the system. Separate what needs to be separate; keep together what changes together."
  - question: "What is an embedding service and why does it need to be a backend service?"
    answer: "An embedding service converts text into high-dimensional vectors using a language model. It needs to be a dedicated backend service because: embedding computation is CPU/GPU-intensive and should be isolated from request-handling processes, embeddings are often reused and benefit from caching, and multiple parts of your system (ingestion pipelines, search endpoints, recommendation logic) all need embeddings but shouldn't duplicate the model loading overhead. Treating it as a first-class service makes it independently scalable and cacheable."
  - question: "How do I handle streaming responses from AI models in a backend API?"
    answer: "Use server-sent events (SSE) or WebSocket streams to forward the model's token-by-token output to the client. In Node.js/Nuxt backends, you pipe the stream from the model API through your server to the client response. Key implementation concerns: set appropriate timeouts (AI inference can take 10-30+ seconds), handle stream interruption gracefully, decide whether to persist the full response only after stream completion, and consider whether the client needs a message ID to reconnect if the stream drops."
  - question: "What is vector search and how does it differ from full-text search?"
    answer: "Full-text search matches keywords — it finds documents containing the words you typed. Vector search finds documents that are semantically similar — it finds documents that mean something similar to your query, even if they use completely different words. Vector search requires pre-computed embeddings stored in a vector database or pgvector-enabled PostgreSQL. For AI applications like RAG, semantic search, and recommendation systems, vector search is often more useful than full-text search. For filtering and exact matching, full-text search is still the right tool."
  - question: "How should I approach GPU allocation in a shared backend environment?"
    answer: "Treat GPU as a scarce, dedicated resource rather than a general compute pool. Use a queue (BullMQ, Redis-based) to serialize inference requests rather than allowing concurrent GPU access that causes memory contention. Profile your models' VRAM usage and set hard limits per worker process. For multi-model environments, consider model loading strategies: lazy loading saves memory but adds latency, eager loading is the opposite. In Kubernetes/K3s environments, use resource limits and node taints to ensure GPU nodes only run GPU workloads."
---

Backend engineering for AI-integrated systems requires a different set of decisions than traditional API development. When your backend runs inference pipelines, manages embedding services, streams model responses, and coordinates async workers — standard CRUD patterns don't hold.

The underlying challenge is that AI components are expensive, slow, and non-deterministic by nature. ML inference has variable latency. Embeddings are computationally heavy. Language models produce probabilistic output that can't be cached naively. Building backends around these characteristics requires explicit strategies for batching, queue management, resource isolation, and graceful degradation — none of which come built into standard backend frameworks.

**This series covers 19 articles from building the backend infrastructure for a production AI-powered Bible app.** The workloads include semantic search over scripture, embedding generation for retrieval pipelines, OCR for ancient manuscript digitization, streaming AI responses, and a graph database layer for relationship queries. Real constraints, real tradeoffs.

## What This Series Covers

**Architecture First** — The monolith vs. microservices decision is more consequential for AI systems than for traditional APIs, because AI components (model inference, embedding caches, vector stores) create unique cross-service dependencies. These articles cover how to structure services when AI is a first-class concern.

**Core Service Patterns** — Authentication, embeddings, vector search, and streaming are the building blocks. Each has AI-specific considerations: embedding caches that need invalidation strategies, vector search that requires tuning for recall vs. latency, streaming that requires timeout and reconnection handling.

**AI Infrastructure Services** — Inference services, embedding pipelines, and OCR processors are distinct service types with their own scaling characteristics. These articles cover how to design them as standalone, independently scalable components rather than embedding them in monolithic handlers.

**Performance at the AI Layer** — Async worker architecture, GPU allocation, batching strategies, and model loading patterns are where AI backends diverge most sharply from standard web backends. These articles cover the engineering decisions that determine whether your system scales cost-effectively or blows the infrastructure budget.

**Graph Querying** — Relationship-heavy data models benefit from graph query patterns. These articles cover integrating the Apache AGE extension into PostgreSQL for Cypher queries alongside standard SQL — without requiring a separate graph database.
