<template>
  <PatternSection>
    <div class="min-h-screen bg-white dark:bg-slate-950">

      <!-- Sticky breadcrumb -->
      <div class="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <nav class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <NuxtLink to="/products/overview" class="hover:text-sky-400 transition-colors">Products</NuxtLink>
            <Icon name="mdi:chevron-right" class="text-slate-300 dark:text-slate-600" />
            <NuxtLink to="/products/self-hosted-ai-starter-kit" class="hover:text-sky-400 transition-colors">Starter Kit</NuxtLink>
            <Icon name="mdi:chevron-right" class="text-slate-300 dark:text-slate-600" />
            <span class="text-slate-700 dark:text-slate-300 font-medium">Guide</span>
          </nav>
          <span class="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500">
            <Icon name="mdi:brain" class="text-sm" />
            AI Engineering
          </span>
        </div>
      </div>

      <!-- Body -->
      <div class="max-w-7xl mx-auto px-6 py-12 lg:flex lg:gap-14">

        <!-- TOC sidebar -->
        <aside class="hidden lg:block w-52 flex-shrink-0">
          <div class="sticky top-16 pt-2">
            <p class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Contents</p>
            <nav class="space-y-0.5">
              <a v-for="s in toc" :key="s.id" :href="`#${s.id}`"
                class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-400 dark:hover:text-sky-400 py-1.5 px-2 rounded-lg hover:bg-sky-500/5 transition-colors">
                <Icon :name="s.icon" class="text-base flex-shrink-0" />
                {{ s.title }}
              </a>
            </nav>
          </div>
        </aside>

        <!-- Main content -->
        <div class="flex-1 min-w-0 max-w-3xl">

          <!-- Intro -->
          <div class="mb-14">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-xs font-medium mb-5">
              <Icon name="mdi:brain" />
              Self-Hosted AI Starter Kit
            </div>
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
              The Complete Setup Guide
            </h1>
            <p class="mt-3 text-slate-500 dark:text-slate-400 leading-relaxed">
              Ollama setup, RAG architecture, embedding pipeline templates, FastAPI examples, and prompt patterns — everything you need to run AI workloads on your own hardware.
            </p>
          </div>

          <!-- ── 1. Ollama Setup ─────────────────────────────────────── -->
          <section id="ollama-setup" class="mb-16">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                <Icon name="mdi:robot-outline" class="text-sky-400 text-base" />
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Ollama Setup</h2>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              Ollama runs models locally via a REST API — same interface regardless of whether you're on ARM64, x86, or GPU. Install it first, then pull a model that fits your hardware.
            </p>

            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Install</h3>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-6"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ ollamaInstall }}</code></pre>

            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Model selection by hardware</h3>
            <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/50 mb-6">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
                    <th class="text-left py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Hardware</th>
                    <th class="text-left py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Recommended model</th>
                    <th class="text-left py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(m, i) in modelTable" :key="i" class="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td class="py-2.5 px-4 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{{ m.hw }}</td>
                    <td class="py-2.5 px-4 font-mono text-xs text-sky-500 dark:text-sky-400">{{ m.model }}</td>
                    <td class="py-2.5 px-4 text-xs text-slate-500">{{ m.notes }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Pull models and test</h3>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ ollamaTest }}</code></pre>
          </section>

          <!-- ── 2. RAG Architecture ─────────────────────────────────── -->
          <section id="rag-architecture" class="mb-16">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Icon name="mdi:vector-combine" class="text-purple-400 text-base" />
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">RAG Architecture</h2>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              Retrieval-Augmented Generation grounds the LLM in your data at query time. The model never "learns" your data — it retrieves relevant chunks and uses them as context each time.
            </p>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-6"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ ragDiagram }}</code></pre>
            <div class="space-y-4">
              <div v-for="(stage, i) in ragStages" :key="i" class="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60">
                <span class="w-7 h-7 rounded-full bg-purple-500/10 text-purple-500 text-xs font-bold flex items-center justify-center flex-shrink-0">{{ i + 1 }}</span>
                <div>
                  <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ stage.title }}</p>
                  <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ stage.description }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- ── 3. Embedding Pipeline ───────────────────────────────── -->
          <section id="embedding-pipeline" class="mb-16">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Icon name="mdi:pipe" class="text-emerald-400 text-base" />
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Embedding Pipeline Templates</h2>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              Two functions: one to ingest documents (chunk → embed → store), one to query them (embed query → retrieve top-k → assemble context). Install ChromaDB and the Ollama Python library first.
            </p>
            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Install</h3>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-6"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">pip install chromadb ollama</code></pre>
            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Ingest pipeline</h3>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-6"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ ingestPipeline }}</code></pre>
            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Query pipeline</h3>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ queryPipeline }}</code></pre>
          </section>

          <!-- ── 4. FastAPI Examples ─────────────────────────────────── -->
          <section id="fastapi-examples" class="mb-16">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Icon name="mdi:api" class="text-amber-400 text-base" />
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">FastAPI Examples</h2>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              Wire the pipeline into a proper API surface. This endpoint accepts a question, retrieves relevant chunks, assembles a prompt, and returns the answer with source references.
            </p>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-4"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ fastapiCode }}</code></pre>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ fastapiRun }}</code></pre>
          </section>

          <!-- ── 5. Prompt Patterns ──────────────────────────────────── -->
          <section id="prompt-patterns" class="mb-16">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                <Icon name="mdi:message-text-outline" class="text-sky-400 text-base" />
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Prompt Patterns</h2>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Local models are less forgiving than hosted ones. These patterns keep responses grounded in context, reduce hallucination, and work reliably on 3B–7B parameter models.
            </p>
            <div class="space-y-6">
              <div v-for="pattern in promptPatterns" :key="pattern.name" class="rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center gap-2">
                  <Icon name="mdi:code-braces" class="text-slate-400 text-sm" />
                  <span class="text-sm font-semibold text-slate-700 dark:text-slate-300">{{ pattern.name }}</span>
                </div>
                <div class="px-5 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p class="text-xs text-slate-500 dark:text-slate-400">{{ pattern.description }}</p>
                </div>
                <pre class="bg-slate-900 overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ pattern.template }}</code></pre>
              </div>
            </div>
          </section>

          <!-- More Products -->
          <div class="border-t border-slate-200 dark:border-slate-800 pt-12">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-base font-bold text-slate-900 dark:text-white">More Products</h2>
              <NuxtLink to="/products/overview" class="text-sm text-sky-500 hover:text-sky-400 flex items-center gap-1 transition-colors">
                All Products <Icon name="mdi:arrow-right" class="text-base" />
              </NuxtLink>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NuxtLink v-for="p in otherProducts" :key="p.slug" :to="`/products/${p.slug}`"
                class="group flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 hover:border-sky-500/40 transition-all duration-200">
                <div class="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <Icon :name="p.icon" class="text-xl text-slate-400 dark:text-slate-500" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-sky-400 transition-colors">{{ p.title }}</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ p.tagline }}</p>
                </div>
              </NuxtLink>
            </div>
          </div>

        </div>
      </div>
    </div>
  </PatternSection>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Self-Hosted AI Starter Kit — Guide',
  description: 'Ollama setup, RAG architecture, embedding pipeline templates, FastAPI examples, and prompt patterns for local AI inference.',
  robots: 'noindex, nofollow',
})

const toc = [
  { id: 'ollama-setup',       title: 'Ollama Setup',        icon: 'mdi:robot-outline' },
  { id: 'rag-architecture',   title: 'RAG Architecture',    icon: 'mdi:vector-combine' },
  { id: 'embedding-pipeline', title: 'Embedding Pipeline',  icon: 'mdi:pipe' },
  { id: 'fastapi-examples',   title: 'FastAPI Examples',    icon: 'mdi:api' },
  { id: 'prompt-patterns',    title: 'Prompt Patterns',     icon: 'mdi:message-text-outline' },
]

const ollamaInstall = `# Linux / ARM64 (Raspberry Pi, Jetson, etc.)
curl -fsSL https://ollama.ai/install.sh | sh

# Enable and start as a system service
sudo systemctl enable ollama
sudo systemctl start ollama

# Confirm it's running
curl http://localhost:11434/api/tags`

const modelTable = [
  { hw: 'ARM64 8GB RAM (Pi 4/5)', model: 'llama3.2:3b', notes: 'Fits comfortably, good quality for Q&A' },
  { hw: 'ARM64 16GB RAM',         model: 'mistral:7b',   notes: 'Better reasoning, needs memory headroom' },
  { hw: 'GPU 8GB VRAM',           model: 'llama3.1:8b',  notes: 'GPU acceleration, significantly faster' },
  { hw: 'Any (embeddings)',       model: 'nomic-embed-text', notes: 'Use this for all embedding tasks' },
]

const ollamaTest = `# Pull the inference model and the embedding model
ollama pull llama3.2:3b
ollama pull nomic-embed-text

# Test inference
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2:3b",
  "prompt": "Explain what a vector database is in one sentence.",
  "stream": false
}'

# Test embeddings — returns a 768-dim float array
curl http://localhost:11434/api/embeddings -d '{
  "model": "nomic-embed-text",
  "prompt": "Kubernetes node affinity"
}'

# Expose on the network (for containers or remote nodes)
OLLAMA_HOST=0.0.0.0 ollama serve`

const ragDiagram = `INGEST PHASE (runs once per document set)
─────────────────────────────────────────
[Raw Documents]
      │
      ▼
[Chunker]          split into ~512-token overlapping windows
      │
      ▼
[Embedding Model]  nomic-embed-text via Ollama
      │
      ▼
[Vector Store]     ChromaDB (local) or pgvector (Postgres)

QUERY PHASE (runs on every user question)
─────────────────────────────────────────
[User Question]
      │
      ▼
[Embedding Model]  same model as ingest
      │
      ▼
[Vector Search]    k-nearest-neighbor, returns top 3–5 chunks
      │
      ▼
[Context Assembly] chunks + system prompt + question
      │
      ▼
[LLM]              llama3.2:3b or mistral:7b via Ollama
      │
      ▼
[Response + Sources]`

const ragStages = [
  { title: 'Chunk', description: '512 tokens per chunk, 64-token overlap between consecutive chunks. Split on paragraph boundaries when possible to avoid cutting mid-thought.' },
  { title: 'Embed', description: 'Run each chunk through nomic-embed-text to get a 768-dimensional float vector. Store the vector alongside the chunk text and its source path.' },
  { title: 'Retrieve', description: 'On each query, embed the question, then find the top-k most similar chunks by cosine distance. k=3 is a good starting point.' },
  { title: 'Assemble and generate', description: 'Concatenate the retrieved chunks as context. Pass to the LLM with a system prompt that instructs it to answer from context only — this is the main hallucination brake.' },
]

const ingestPipeline = `import ollama
import chromadb
from pathlib import Path

client = chromadb.Client()
collection = client.get_or_create_collection("docs")

def embed_text(text: str) -> list[float]:
    response = ollama.embeddings(model="nomic-embed-text", prompt=text)
    return response["embedding"]

def chunk_text(text: str, size: int = 512, overlap: int = 64) -> list[str]:
    words = text.split()
    chunks = []
    for i in range(0, len(words), size - overlap):
        chunks.append(" ".join(words[i : i + size]))
    return chunks

def ingest_file(path: Path) -> int:
    text = path.read_text(encoding="utf-8")
    chunks = chunk_text(text)
    for i, chunk in enumerate(chunks):
        embedding = embed_text(chunk)
        collection.add(
            documents=[chunk],
            embeddings=[embedding],
            ids=[f"{path.stem}-chunk-{i}"],
            metadatas=[{"source": str(path), "chunk_index": i}],
        )
    print(f"Ingested {len(chunks)} chunks from {path.name}")
    return len(chunks)

# Usage
for md_file in Path("./docs").glob("**/*.md"):
    ingest_file(md_file)`

const queryPipeline = `def query(question: str, top_k: int = 3) -> dict:
    # Embed the question
    query_embedding = embed_text(question)

    # Find closest chunks
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        include=["documents", "metadatas", "distances"],
    )

    context = "\\n\\n".join(results["documents"][0])
    sources = [m.get("source", "") for m in results["metadatas"][0]]

    # Grounded prompt — LLM answers from context only
    prompt = f"""Answer based only on the context below.
If the context does not contain enough information, say so.

Context:
{context}

Question: {question}
Answer:"""

    response = ollama.generate(model="llama3.2:3b", prompt=prompt)
    return {
        "answer": response["response"],
        "sources": list(set(sources)),
    }

# Usage
result = query("How do I configure a K3s control plane?")
print(result["answer"])
print("Sources:", result["sources"])`

const fastapiCode = `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import ollama
import chromadb

app = FastAPI(title="Local AI API")
client = chromadb.Client()
collection = client.get_or_create_collection("docs")

class QueryRequest(BaseModel):
    question: str
    top_k: int = 3

class QueryResponse(BaseModel):
    answer: str
    sources: list[str]

@app.post("/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    try:
        embed = ollama.embeddings(
            model="nomic-embed-text",
            prompt=request.question,
        )
        results = collection.query(
            query_embeddings=[embed["embedding"]],
            n_results=request.top_k,
            include=["documents", "metadatas"],
        )
        context = "\\n\\n".join(results["documents"][0])
        sources = list({m.get("source", "") for m in results["metadatas"][0]})

        response = ollama.generate(
            model="llama3.2:3b",
            prompt=f"Answer from context only:\\n\\n{context}\\n\\nQuestion: {request.question}\\nAnswer:",
        )
        return QueryResponse(answer=response["response"], sources=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok", "model": "llama3.2:3b"}`

const fastapiRun = `# Run locally
pip install fastapi uvicorn ollama chromadb
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Test the endpoint
curl -X POST http://localhost:8000/query \\
  -H "Content-Type: application/json" \\
  -d '{"question": "What is the control plane responsible for?", "top_k": 3}'`

const promptPatterns = [
  {
    name: 'Grounded Answer (prevents hallucination)',
    description: 'The workhorse. Instructs the model to only use the provided context. If the context is empty or irrelevant, the model says so instead of making something up.',
    template: `Answer the question below using ONLY the provided context.
If the context does not contain enough information, respond with:
"I don't have enough information in the provided context to answer this."

Context:
{context}

Question: {question}
Answer:`,
  },
  {
    name: 'Structured Extraction (returns JSON)',
    description: 'For pulling structured data out of unstructured text. Works best on small, clearly scoped models when the JSON schema is simple.',
    template: `Extract the following fields from the text below.
Return valid JSON only. No explanation, no markdown fences.

Text:
{text}

Extract these fields:
- name: string
- date: ISO 8601 string
- action: string
- status: "completed" | "pending" | "failed"

JSON:`,
  },
  {
    name: 'Step-by-Step Reasoning',
    description: 'Forces the model to show its reasoning before answering. Improves accuracy on questions that require logical steps. More tokens, but more reliable on smaller models.',
    template: `Think step by step before giving your final answer.

Context:
{context}

Question: {question}

Reasoning steps:
1.`,
  },
  {
    name: 'Confidence Check',
    description: 'Use this after getting an answer to assess how well the context actually supports it. Useful for filtering out low-confidence responses before showing them to users.',
    template: `Rate how well the context supports the answer below.
Score 1–5: 5 means the context directly states the answer. 1 means the context is unrelated.

Context:
{context}

Answer to evaluate:
{answer}

Score (1–5):
Reasoning:`,
  },
]

const otherProducts = [
  { slug: 'raspberry-pi-ai-cluster-blueprint', title: 'Raspberry Pi AI Cluster Blueprint', tagline: 'Build the rack without the trial and error.', icon: 'mdi:server-network' },
  { slug: 'production-ai-api-boilerplate', title: 'Production AI API Boilerplate', tagline: 'Skip the scaffolding, ship the feature.', icon: 'mdi:api' },
]
</script>
