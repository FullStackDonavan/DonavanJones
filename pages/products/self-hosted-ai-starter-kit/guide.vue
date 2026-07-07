<template>
  <div class="min-h-screen bg-white dark:bg-slate-950">

    <!-- Sticky breadcrumb -->
    <div class="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <nav class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <NuxtLink to="/products/overview" class="hover:text-sky-400 transition-colors">Products</NuxtLink>
          <Icon name="mdi:chevron-right" class="text-slate-300 dark:text-slate-600" />
          <NuxtLink to="/products/self-hosted-ai-starter-kit" class="hover:text-sky-400 transition-colors">AI Starter Kit</NuxtLink>
          <Icon name="mdi:chevron-right" class="text-slate-300 dark:text-slate-600" />
          <span class="text-slate-700 dark:text-slate-300 font-medium">Guide</span>
        </nav>
        <span class="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
          <Icon name="mdi:brain" class="text-sm" />
          AI Engineering
        </span>
      </div>
    </div>

    <!-- Hero -->
    <div class="bg-slate-900 border-b border-slate-800">
      <div class="max-w-7xl mx-auto px-6 py-16 sm:py-20">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-6">
          <Icon name="mdi:brain" class="text-sm" />
          Self-Hosted AI Starter Kit
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
          The Complete Setup Guide
        </h1>
        <p class="text-slate-400 leading-relaxed max-w-2xl text-base">
          Ollama setup, RAG architecture, embedding pipeline, FastAPI templates, and prompt patterns — everything to run your own AI stack without paying per token.
        </p>
      </div>
    </div>

    <!-- What's Inside cards -->
    <div class="bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6 py-10">
        <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-6">What's Inside</p>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            v-for="(s, i) in toc"
            :key="s.id"
            :href="`#${s.id}`"
            class="group block p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60
                   hover:border-purple-500/40 dark:hover:border-purple-500/30
                   hover:shadow-lg hover:shadow-purple-500/5
                   transition-all duration-200"
          >
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
              :class="{
                'bg-purple-500/10':  i % 4 === 0,
                'bg-sky-500/10':     i % 4 === 1,
                'bg-emerald-500/10': i % 4 === 2,
                'bg-amber-500/10':   i % 4 === 3,
              }"
            >
              <Icon
                :name="s.icon"
                class="text-base"
                :class="{
                  'text-purple-400':  i % 4 === 0,
                  'text-sky-400':     i % 4 === 1,
                  'text-emerald-400': i % 4 === 2,
                  'text-amber-400':   i % 4 === 3,
                }"
              />
            </div>
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-400 transition-colors leading-snug mb-1">
              {{ s.title }}
            </p>
            <p class="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">{{ s.description }}</p>
          </a>
        </div>
      </div>
    </div>

    <!-- Body: sidebar + content -->
    <div class="max-w-7xl mx-auto px-6 py-14 lg:flex lg:gap-14">

      <!-- TOC sidebar -->
      <aside class="hidden lg:block w-52 flex-shrink-0">
        <div class="sticky top-16 pt-2">
          <p class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Sections</p>
          <nav class="space-y-0.5">
            <a
              v-for="s in toc"
              :key="s.id"
              :href="`#${s.id}`"
              class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-purple-400 py-1.5 px-2 rounded-lg hover:bg-purple-500/5 transition-colors"
            >
              <Icon :name="s.icon" class="text-base flex-shrink-0 opacity-60" />
              {{ s.title }}
            </a>
          </nav>
        </div>
      </aside>

      <!-- Main content -->
      <div class="flex-1 min-w-0 max-w-3xl space-y-20">

        <!-- ── 1. Ollama Setup ─────────────────────────────────────── -->
        <section id="ollama-setup">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:robot-outline" class="text-purple-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Ollama Setup</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
            Ollama handles model management, quantization selection, and a local REST API identical in shape to OpenAI's. Install once, swap models without touching your application code.
          </p>

          <div class="space-y-5">
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Install</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ ollamaInstall }}</code></pre>
            </div>

            <p class="text-sm text-slate-500 dark:text-slate-400">
              Choose a model based on your hardware. Anything under 8B runs comfortably at 8-bit on 16 GB RAM. At 4-bit you can push larger models.
            </p>

            <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/50">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
                    <th class="text-left py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Model</th>
                    <th class="text-left py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Size</th>
                    <th class="text-left py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">RAM (Q4)</th>
                    <th class="text-left py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="m in models" :key="m.name" class="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td class="py-2.5 px-4 font-mono text-purple-500 dark:text-purple-400 text-xs">{{ m.name }}</td>
                    <td class="py-2.5 px-4 text-slate-500 dark:text-slate-400 text-xs">{{ m.size }}</td>
                    <td class="py-2.5 px-4 text-slate-500 dark:text-slate-400 text-xs">{{ m.ram }}</td>
                    <td class="py-2.5 px-4 text-slate-500 dark:text-slate-500 text-xs">{{ m.use }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Quick test</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ ollamaTest }}</code></pre>
            </div>
          </div>
        </section>

        <!-- ── 2. RAG Architecture ─────────────────────────────────── -->
        <section id="rag-architecture">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:sitemap-outline" class="text-sky-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">RAG Architecture</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
            Retrieval-Augmented Generation gives the model access to your documents at query time without fine-tuning. Ingest once, query forever.
          </p>
          <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-8"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ ragDiagram }}</code></pre>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="stage in ragStages" :key="stage.step" class="p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/40">
              <div class="flex items-center gap-2 mb-2">
                <span class="w-6 h-6 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold flex items-center justify-center flex-shrink-0">{{ stage.step }}</span>
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ stage.title }}</p>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ stage.detail }}</p>
            </div>
          </div>
        </section>

        <!-- ── 3. Embedding Pipeline ───────────────────────────────── -->
        <section id="embedding-pipeline">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:pipe" class="text-emerald-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Embedding Pipeline</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
            Two scripts: one to ingest documents into ChromaDB, one to query at runtime. Uses Ollama's embedding endpoint — no external API calls.
          </p>

          <div class="space-y-5">
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">ingest.py</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ ingestPy }}</code></pre>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">query.py</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ queryPy }}</code></pre>
            </div>
          </div>
        </section>

        <!-- ── 4. FastAPI Examples ─────────────────────────────────── -->
        <section id="fastapi-examples">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:api" class="text-amber-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">FastAPI Examples</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
            Production-ready endpoints with streaming support, RAG integration, and proper error handling. Drop these into your existing FastAPI app.
          </p>

          <div class="space-y-5">
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Streaming chat endpoint</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ streamEndpoint }}</code></pre>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">RAG query endpoint</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ ragEndpoint }}</code></pre>
            </div>
          </div>
        </section>

        <!-- ── 5. Prompt Patterns ──────────────────────────────────── -->
        <section id="prompt-patterns">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:message-text-outline" class="text-purple-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Prompt Patterns</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
            Named patterns that consistently work with local models. Local models are more sensitive to prompt format than hosted APIs — these were written to handle that.
          </p>
          <div class="space-y-5">
            <div v-for="p in promptPatterns" :key="p.name" class="rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <div class="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
                <span class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ p.name }}</span>
                <span class="text-xs text-slate-400">{{ p.use }}</span>
              </div>
              <pre class="bg-slate-900 overflow-x-auto"><code class="block px-5 py-4 text-sm text-slate-300 font-mono leading-loose">{{ p.template }}</code></pre>
            </div>
          </div>
        </section>

        <!-- More Products -->
        <div class="border-t border-slate-200 dark:border-slate-800 pt-12">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-base font-bold text-slate-900 dark:text-white">More Products</h2>
            <NuxtLink to="/products/overview" class="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
              All Products <Icon name="mdi:arrow-right" />
            </NuxtLink>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NuxtLink
              v-for="p in otherProducts"
              :key="p.slug"
              :to="`/products/${p.slug}`"
              class="group flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50
                     bg-slate-50 dark:bg-slate-900/60 hover:border-purple-500/40 transition-all duration-200"
            >
              <div class="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Icon :name="p.icon" class="text-xl text-slate-400 dark:text-slate-500" />
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-purple-400 transition-colors">{{ p.title }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ p.tagline }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Self-Hosted AI Starter Kit — Guide',
  description: 'Ollama setup, RAG architecture, embedding pipeline, FastAPI examples, and prompt patterns for running your own AI stack.',
  robots: 'noindex, nofollow',
})

const toc = [
  { id: 'ollama-setup',       title: 'Ollama Setup',       icon: 'mdi:robot-outline',        description: 'Install, configure, and run models locally.' },
  { id: 'rag-architecture',   title: 'RAG Architecture',   icon: 'mdi:sitemap-outline',      description: 'How retrieval-augmented generation fits together.' },
  { id: 'embedding-pipeline', title: 'Embedding Pipeline', icon: 'mdi:pipe',                 description: 'Ingest docs and query them at runtime.' },
  { id: 'fastapi-examples',   title: 'FastAPI Examples',   icon: 'mdi:api',                  description: 'Streaming chat and RAG endpoints ready to use.' },
  { id: 'prompt-patterns',    title: 'Prompt Patterns',    icon: 'mdi:message-text-outline', description: 'Named patterns tuned for local model behavior.' },
]

const models = [
  { name: 'llama3.2:3b',    size: '3B',  ram: '2.2 GB', use: 'Fast tasks, Raspberry Pi, edge' },
  { name: 'llama3.1:8b',    size: '8B',  ram: '4.7 GB', use: 'Coding assist, default local pick' },
  { name: 'mistral:7b',     size: '7B',  ram: '4.1 GB', use: 'Instruction following, summaries' },
  { name: 'deepseek-r1:8b', size: '8B',  ram: '4.9 GB', use: 'Reasoning chains, structured output' },
  { name: 'qwen2.5:14b',    size: '14B', ram: '8.7 GB', use: 'Code generation, strong overall' },
  { name: 'llama3.1:70b',   size: '70B', ram: '40 GB',  use: 'Max quality — needs A100/H100 or 2×4090' },
]

const ollamaInstall = `# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh

# Pull a model
ollama pull llama3.1:8b

# List installed models
ollama list`

const ollamaTest = `# Direct CLI test
ollama run llama3.1:8b "Explain RAG in two sentences"

# REST API (identical shape to OpenAI)
curl http://localhost:11434/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama3.1:8b",
    "messages": [{"role": "user", "content": "Hello"}]
  }'`

const ragDiagram = `── INGEST ──────────────────────────────────────
 Documents (.md, .pdf, .txt)
       │
       ▼
 Chunk (512 tokens, 64 overlap)
       │
       ▼
 Embed via Ollama (nomic-embed-text)
       │
       ▼
 Store in ChromaDB (local on-disk)

── QUERY ───────────────────────────────────────
 User question
       │
       ▼
 Embed question (same model)
       │
       ▼
 Similarity search → Top-k chunks
       │
       ▼
 Build prompt: [system] + [chunks] + [question]
       │
       ▼
 Generate with Ollama → Streamed response`

const ragStages = [
  { step: 1, title: 'Chunk',    detail: 'Split documents into 512-token windows with 64-token overlap so context carries across boundaries.' },
  { step: 2, title: 'Embed',    detail: 'Ollama\'s nomic-embed-text turns each chunk into a 768-dim vector. No external API needed.' },
  { step: 3, title: 'Store',    detail: 'ChromaDB persists vectors to disk. No server to manage — just a directory.' },
  { step: 4, title: 'Retrieve', detail: 'Embed the user\'s question, cosine-search the collection, return top-k chunks.' },
  { step: 5, title: 'Augment',  detail: 'Inject retrieved chunks into the system prompt before the user\'s message.' },
  { step: 6, title: 'Generate', detail: 'Ollama streams the answer. The model answers from retrieved context, not from training data.' },
]

const ingestPy = `# ingest.py
import chromadb
from ollama import Client
from pathlib import Path

EMBED_MODEL = "nomic-embed-text"
CHUNK_SIZE  = 512
OVERLAP     = 64

def chunk_text(text: str) -> list[str]:
    words = text.split()
    chunks, i = [], 0
    while i < len(words):
        chunk = " ".join(words[i : i + CHUNK_SIZE])
        chunks.append(chunk)
        i += CHUNK_SIZE - OVERLAP
    return chunks

def embed(texts: list[str]) -> list[list[float]]:
    client = Client()
    return [client.embeddings(model=EMBED_MODEL, prompt=t).embedding for t in texts]

def ingest(docs_dir: str = "docs", collection_name: str = "knowledge"):
    db = chromadb.PersistentClient(path=".chroma")
    col = db.get_or_create_collection(collection_name)

    for path in Path(docs_dir).rglob("*.md"):
        text   = path.read_text()
        chunks = chunk_text(text)
        embeds = embed(chunks)
        ids    = [f"{path.stem}_{i}" for i in range(len(chunks))]
        col.add(documents=chunks, embeddings=embeds, ids=ids)
        print(f"Ingested {len(chunks)} chunks from {path.name}")

if __name__ == "__main__":
    ingest()`

const queryPy = `# query.py
import chromadb
from ollama import Client

EMBED_MODEL = "nomic-embed-text"
CHAT_MODEL  = "llama3.1:8b"
TOP_K       = 5

def query(question: str, collection_name: str = "knowledge") -> str:
    db  = chromadb.PersistentClient(path=".chroma")
    col = db.get_or_create_collection(collection_name)

    q_embed = Client().embeddings(model=EMBED_MODEL, prompt=question).embedding
    results = col.query(query_embeddings=[q_embed], n_results=TOP_K)
    context = "\\n\\n".join(results["documents"][0])

    system = f"""Answer using only the context below. If the answer isn't there, say so.

Context:
{context}"""

    response = Client().chat(
        model=CHAT_MODEL,
        messages=[
            {"role": "system",  "content": system},
            {"role": "user",    "content": question},
        ],
    )
    return response.message.content`

const streamEndpoint = `# routers/chat.py
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from ollama import Client
import json

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/stream")
async def stream_chat(messages: list[dict]):
    def generate():
        client = Client()
        for chunk in client.chat(
            model="llama3.1:8b",
            messages=messages,
            stream=True,
        ):
            delta = chunk.message.content or ""
            yield f"data: {json.dumps({'content': delta})}\\n\\n"
        yield "data: [DONE]\\n\\n"

    return StreamingResponse(generate(), media_type="text/event-stream")`

const ragEndpoint = `# routers/rag.py
from fastapi import APIRouter
from pydantic import BaseModel
from .query import query   # re-uses query.py from the pipeline section

router = APIRouter(prefix="/rag", tags=["rag"])

class Question(BaseModel):
    question: str
    collection: str = "knowledge"

@router.post("/query")
async def rag_query(body: Question) -> dict:
    answer = query(body.question, body.collection)
    return {"answer": answer}`

const promptPatterns = [
  {
    name: 'Structured Output',
    use: 'Returns JSON every time',
    template: `You are a JSON API. Respond ONLY with valid JSON matching this schema — no prose, no markdown fences.

Schema:
{
  "summary": "string",
  "tags": ["string"],
  "confidence": 0.0–1.0
}

Input: {{user_input}}`,
  },
  {
    name: 'Chain of Thought',
    use: 'Complex reasoning',
    template: `Think through this step by step before answering.

1. Restate the problem in your own words.
2. List what you know that's relevant.
3. Work through the logic.
4. State your conclusion.

Question: {{question}}`,
  },
  {
    name: 'Document Summary',
    use: 'Summarise long chunks',
    template: `Summarise the document below. Return:
- 3-sentence executive summary
- 5 key bullet points
- Any action items

Document:
{{document}}`,
  },
  {
    name: 'Code Review',
    use: 'Code feedback',
    template: `Review the code below for: correctness, edge cases, performance, and style.
Be specific. Reference line numbers if relevant. Don't rewrite the whole thing.

\`\`\`{{language}}
{{code}}
\`\`\``,
  },
]

const otherProducts = [
  { slug: 'raspberry-pi-ai-cluster-blueprint', title: 'Raspberry Pi AI Cluster Blueprint', tagline: 'Build a real K3s cluster on hardware you own.',  icon: 'mdi:server-network' },
  { slug: 'production-ai-api-boilerplate',     title: 'Production AI API Boilerplate',     tagline: 'Skip the scaffolding, ship the feature.',        icon: 'mdi:api' },
  { slug: 'local-vibe-coding-blueprint',       title: 'Local Vibe Coding Blueprint',       tagline: 'Run your own AI coding assistant on hardware you own.', icon: 'mdi:code-braces' },
]
</script>
