<template>
  <div class="min-h-screen bg-white dark:bg-slate-950">

    <!-- Sticky breadcrumb -->
    <div class="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <nav class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <NuxtLink to="/products/overview" class="hover:text-sky-400 transition-colors">Products</NuxtLink>
          <Icon name="mdi:chevron-right" class="text-slate-300 dark:text-slate-600" />
          <NuxtLink to="/products/local-vibe-coding-blueprint" class="hover:text-sky-400 transition-colors">Vibe Coding Blueprint</NuxtLink>
          <Icon name="mdi:chevron-right" class="text-slate-300 dark:text-slate-600" />
          <span class="text-slate-700 dark:text-slate-300 font-medium">Guide</span>
        </nav>
        <span class="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <Icon name="mdi:code-braces" class="text-sm" />
          Local Vibe Coding
        </span>
      </div>
    </div>

    <!-- Hero -->
    <div class="bg-slate-900 border-b border-slate-800">
      <div class="max-w-7xl mx-auto px-6 py-16 sm:py-20">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
          <Icon name="mdi:code-braces" class="text-sm" />
          Local Vibe Coding Blueprint
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
          The Complete Build Guide
        </h1>
        <p class="text-slate-400 leading-relaxed max-w-2xl text-base">
          The hardware split, Kubernetes manifests, repository indexing, and the draft and verify
          agent loop behind a coding assistant that runs entirely on hardware you own.
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
                   hover:border-emerald-500/40 dark:hover:border-emerald-500/30
                   hover:shadow-lg hover:shadow-emerald-500/5
                   transition-all duration-200"
          >
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
              :class="{
                'bg-emerald-500/10': i % 4 === 0,
                'bg-sky-500/10':     i % 4 === 1,
                'bg-purple-500/10':  i % 4 === 2,
                'bg-amber-500/10':   i % 4 === 3,
              }"
            >
              <Icon
                :name="s.icon"
                class="text-base"
                :class="{
                  'text-emerald-400': i % 4 === 0,
                  'text-sky-400':     i % 4 === 1,
                  'text-purple-400':  i % 4 === 2,
                  'text-amber-400':   i % 4 === 3,
                }"
              />
            </div>
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-400 transition-colors leading-snug mb-1">
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
              class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-400 py-1.5 px-2 rounded-lg hover:bg-emerald-500/5 transition-colors"
            >
              <Icon :name="s.icon" class="text-base flex-shrink-0 opacity-60" />
              {{ s.title }}
            </a>
          </nav>
        </div>
      </aside>

      <!-- Main content -->
      <div class="flex-1 min-w-0 max-w-3xl space-y-20">

        <!-- ── 1. Hardware Split ───────────────────────────────────── -->
        <section id="hardware-split">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:chip" class="text-emerald-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Hardware Split</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
            Two tiers, two jobs. A small always-on drafter that feels instant, and a bigger verifier
            that runs once per draft. The split keeps the interactive path fast and the power bill sane.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div v-for="tier in tiers" :key="tier.name" class="p-5 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/40">
              <div class="flex items-center gap-2 mb-2">
                <Icon :name="tier.icon" class="text-emerald-400 text-lg" />
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ tier.name }}</p>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">{{ tier.role }}</p>
              <ul class="space-y-1.5">
                <li v-for="item in tier.traits" :key="item" class="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Icon name="mdi:check-circle-outline" class="text-emerald-400 shrink-0 mt-0.5" />
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>

          <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/50">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
                  <th class="text-left py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Budget</th>
                  <th class="text-left py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Drafter Tier</th>
                  <th class="text-left py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Verifier Tier</th>
                  <th class="text-left py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in hardwareOptions" :key="row.budget" class="border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <td class="py-2.5 px-4 font-semibold text-emerald-500 dark:text-emerald-400 text-xs whitespace-nowrap">{{ row.budget }}</td>
                  <td class="py-2.5 px-4 text-slate-500 dark:text-slate-400 text-xs">{{ row.drafter }}</td>
                  <td class="py-2.5 px-4 text-slate-500 dark:text-slate-400 text-xs">{{ row.verifier }}</td>
                  <td class="py-2.5 px-4 text-slate-500 dark:text-slate-500 text-xs">{{ row.notes }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ── 2. Ollama on Kubernetes ─────────────────────────────── -->
        <section id="ollama-on-kubernetes">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:kubernetes" class="text-sky-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Ollama on Kubernetes</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
            One Ollama deployment per tier, pinned to the right nodes with labels. The drafter lands on
            the always-on ARM nodes, the verifier lands on the GPU box, and services give each tier a stable address.
          </p>

          <div class="space-y-5">
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Label the nodes</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ labelNodes }}</code></pre>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">ollama-drafter.yaml</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ drafterYaml }}</code></pre>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">ollama-verifier.yaml</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ verifierYaml }}</code></pre>
            </div>
          </div>
        </section>

        <!-- ── 3. Repository Indexing ──────────────────────────────── -->
        <section id="repository-indexing">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:database-search-outline" class="text-purple-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Repository Indexing</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
            The assistant is only as good as the context you feed it. This script walks a repository,
            chunks source files, embeds each chunk through the drafter tier, and stores the vectors locally.
            The same pattern works with Weaviate if you already run it.
          </p>

          <div class="space-y-5">
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">index_repo.py</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ indexRepoPy }}</code></pre>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">retrieve.py</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ retrievePy }}</code></pre>
            </div>
          </div>
        </section>

        <!-- ── 4. Draft and Verify Loop ────────────────────────────── -->
        <section id="draft-verify-loop">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:sync" class="text-amber-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Draft and Verify Loop</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
            The core of the assistant. A small model drafts against retrieved context, a bigger model
            reviews the draft against the task and your conventions, and failures either retry with
            feedback or escalate. The verifier runs once per draft, not once per token, which is why
            it can afford to be the slower model.
          </p>
          <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-8"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ loopDiagram }}</code></pre>
          <div>
            <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">agent_loop.py</p>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ agentLoopPy }}</code></pre>
          </div>
        </section>

        <!-- ── 5. Escalation Playbook ──────────────────────────────── -->
        <section id="escalation-playbook">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:cloud-upload-outline" class="text-emerald-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Escalation Playbook</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
            A local pipeline that never admits defeat wastes more time than it saves. These rules decide
            when a task goes to a hosted model like Claude Code instead of grinding through local retries.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="rule in escalationRules" :key="rule.title" class="p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/40">
              <div class="flex items-center gap-2 mb-2">
                <Icon :name="rule.icon" class="text-emerald-400 text-base flex-shrink-0" />
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ rule.title }}</p>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ rule.detail }}</p>
            </div>
          </div>
        </section>

        <!-- ── 6. Cost and Power Worksheet ─────────────────────────── -->
        <section id="cost-worksheet">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:calculator-variant-outline" class="text-sky-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Cost and Power Worksheet</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
            An honest local vs subscription comparison needs real numbers, not vibes. Measure wall power
            per tier, apply your electricity rate, and amortize the hardware over its useful life.
          </p>

          <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/50 mb-6">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
                  <th class="text-left py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Line Item</th>
                  <th class="text-left py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">How to Measure</th>
                  <th class="text-left py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Typical Range</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in costRows" :key="row.item" class="border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <td class="py-2.5 px-4 font-semibold text-sky-500 dark:text-sky-400 text-xs whitespace-nowrap">{{ row.item }}</td>
                  <td class="py-2.5 px-4 text-slate-500 dark:text-slate-400 text-xs">{{ row.measure }}</td>
                  <td class="py-2.5 px-4 text-slate-500 dark:text-slate-500 text-xs">{{ row.range }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Monthly cost formula</p>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ costFormula }}</code></pre>
          </div>
        </section>

        <!-- More Products -->
        <div class="border-t border-slate-200 dark:border-slate-800 pt-12">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-base font-bold text-slate-900 dark:text-white">More Products</h2>
            <NuxtLink to="/products/overview" class="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors">
              All Products <Icon name="mdi:arrow-right" />
            </NuxtLink>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NuxtLink
              v-for="p in otherProducts"
              :key="p.slug"
              :to="`/products/${p.slug}`"
              class="group flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50
                     bg-slate-50 dark:bg-slate-900/60 hover:border-emerald-500/40 transition-all duration-200"
            >
              <div class="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Icon :name="p.icon" class="text-xl text-slate-400 dark:text-slate-500" />
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-400 transition-colors">{{ p.title }}</p>
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
definePageMeta({ middleware: 'product-owner' })

useSeoMeta({
  title: 'Local Vibe Coding Blueprint Guide',
  description: 'Hardware split, Kubernetes manifests, repository indexing, the draft and verify agent loop, escalation rules, and a cost worksheet for a local AI coding assistant.',
  robots: 'noindex, nofollow',
})

const toc = [
  { id: 'hardware-split',       title: 'Hardware Split',       icon: 'mdi:chip',                        description: 'Drafter tier vs verifier tier, with buying options.' },
  { id: 'ollama-on-kubernetes', title: 'Ollama on Kubernetes', icon: 'mdi:kubernetes',                  description: 'Manifests that pin each model tier to the right nodes.' },
  { id: 'repository-indexing',  title: 'Repository Indexing',  icon: 'mdi:database-search-outline',     description: 'Turn your codebase into a searchable vector store.' },
  { id: 'draft-verify-loop',    title: 'Draft and Verify Loop', icon: 'mdi:sync',                       description: 'Small model drafts, big model reviews, failures retry.' },
  { id: 'escalation-playbook',  title: 'Escalation Playbook',  icon: 'mdi:cloud-upload-outline',        description: 'When to hand a task to a hosted model instead.' },
  { id: 'cost-worksheet',       title: 'Cost Worksheet',       icon: 'mdi:calculator-variant-outline',  description: 'Honest local vs subscription math with power draw.' },
]

const tiers = [
  {
    name: 'Drafter Tier',
    icon: 'mdi:flash-outline',
    role: 'Always on, always warm. Writes every first draft and generates embeddings in the background.',
    traits: [
      'Small model, 7B to 9B, quantized to Q4',
      'Low idle power, safe to run 24/7',
      'Also hosts embedding and indexing jobs',
    ],
  },
  {
    name: 'Verifier Tier',
    icon: 'mdi:shield-check-outline',
    role: 'Runs once per draft. Reviews the output against the task, the retrieved context, and your conventions.',
    traits: [
      'Largest model your VRAM can hold, 30B class',
      'Never writes first drafts, only reviews',
      'Fine to idle or power down between sessions',
    ],
  },
]

const hardwareOptions = [
  { budget: 'Entry',    drafter: 'Single Jetson Orin Nano or a spare 8GB GPU',      verifier: 'Same box, swap models per call',            notes: 'Works, but model swapping costs real time' },
  { budget: 'Mid',      drafter: 'Jetson Orin Nano Super',                          verifier: 'Used RTX 3090, 24GB VRAM',                  notes: 'The setup this series documents' },
  { budget: 'Serious',  drafter: 'Jetson Orin cluster, 2 to 4 nodes',               verifier: 'RTX 4090 or dual 3090s',                    notes: 'Headroom for LoRA training on the side' },
]

const labelNodes = `# Drafter tier: the always-on ARM nodes
kubectl label node jetson-01 tier=drafter
kubectl label node jetson-02 tier=drafter

# Verifier tier: the GPU desktop
kubectl label node gpu-desktop tier=verifier`

const drafterYaml = `# ollama-drafter.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ollama-drafter
  namespace: ai
spec:
  replicas: 1
  selector:
    matchLabels: { app: ollama-drafter }
  template:
    metadata:
      labels: { app: ollama-drafter }
    spec:
      nodeSelector:
        tier: drafter
      containers:
        - name: ollama
          image: ollama/ollama:latest
          ports:
            - containerPort: 11434
          env:
            - name: OLLAMA_KEEP_ALIVE
              value: "24h"          # keep the drafter warm
          volumeMounts:
            - name: models
              mountPath: /root/.ollama
      volumes:
        - name: models
          persistentVolumeClaim:
            claimName: ollama-drafter-models
---
apiVersion: v1
kind: Service
metadata:
  name: ollama-drafter
  namespace: ai
spec:
  selector: { app: ollama-drafter }
  ports:
    - port: 11434`

const verifierYaml = `# ollama-verifier.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ollama-verifier
  namespace: ai
spec:
  replicas: 1
  selector:
    matchLabels: { app: ollama-verifier }
  template:
    metadata:
      labels: { app: ollama-verifier }
    spec:
      nodeSelector:
        tier: verifier
      runtimeClassName: nvidia      # GPU runtime on the desktop node
      containers:
        - name: ollama
          image: ollama/ollama:latest
          ports:
            - containerPort: 11434
          resources:
            limits:
              nvidia.com/gpu: 1
          env:
            - name: OLLAMA_KEEP_ALIVE
              value: "30m"          # fine to unload between sessions
          volumeMounts:
            - name: models
              mountPath: /root/.ollama
      volumes:
        - name: models
          persistentVolumeClaim:
            claimName: ollama-verifier-models
---
apiVersion: v1
kind: Service
metadata:
  name: ollama-verifier
  namespace: ai
spec:
  selector: { app: ollama-verifier }
  ports:
    - port: 11434`

const indexRepoPy = `# index_repo.py
import chromadb
from ollama import Client
from pathlib import Path

DRAFTER_URL = "http://ollama-drafter.ai:11434"
EMBED_MODEL = "nomic-embed-text"
CHUNK_LINES = 60
OVERLAP     = 10
EXTENSIONS  = {".py", ".ts", ".vue", ".go", ".rs", ".md", ".yaml"}

def chunk_file(path: Path) -> list[dict]:
    lines = path.read_text(errors="ignore").splitlines()
    chunks, i = [], 0
    while i < len(lines):
        window = lines[i : i + CHUNK_LINES]
        chunks.append({
            "text":  "\\n".join(window),
            "id":    f"{path.as_posix()}:{i + 1}",
            "meta":  {"file": path.as_posix(), "start_line": i + 1},
        })
        i += CHUNK_LINES - OVERLAP
    return chunks

def index(repo_dir: str, collection_name: str = "repo"):
    client = Client(host=DRAFTER_URL)
    db  = chromadb.PersistentClient(path=".chroma")
    col = db.get_or_create_collection(collection_name)

    for path in Path(repo_dir).rglob("*"):
        if path.suffix not in EXTENSIONS or ".git" in path.parts:
            continue
        chunks = chunk_file(path)
        embeds = [
            client.embeddings(model=EMBED_MODEL, prompt=c["text"]).embedding
            for c in chunks
        ]
        col.upsert(
            documents=[c["text"] for c in chunks],
            embeddings=embeds,
            ids=[c["id"] for c in chunks],
            metadatas=[c["meta"] for c in chunks],
        )
        print(f"Indexed {len(chunks)} chunks from {path}")

if __name__ == "__main__":
    index("path/to/your/repo")`

const retrievePy = `# retrieve.py
import chromadb
from ollama import Client

DRAFTER_URL = "http://ollama-drafter.ai:11434"
EMBED_MODEL = "nomic-embed-text"
TOP_K       = 8

def retrieve(task: str, collection_name: str = "repo") -> str:
    q_embed = Client(host=DRAFTER_URL).embeddings(
        model=EMBED_MODEL, prompt=task
    ).embedding

    col = chromadb.PersistentClient(path=".chroma") \\
        .get_or_create_collection(collection_name)
    results = col.query(query_embeddings=[q_embed], n_results=TOP_K)

    blocks = []
    for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
        blocks.append(f"# {meta['file']} (line {meta['start_line']})\\n{doc}")
    return "\\n\\n".join(blocks)`

const loopDiagram = ` Task + retrieved context
       │
       ▼
 DRAFT   (small model, drafter tier)
       │
       ▼
 VERIFY  (large model, verifier tier)
       │
   ┌───┴────────┐
   ▼            ▼
 PASS         FAIL
   │            │
   ▼            ▼
 Human      retry < 3?
 review     ├─ yes → DRAFT again, with the
   │        │        verifier's feedback
   ▼        └─ no  → ESCALATE to hosted model
 Commit`

const agentLoopPy = `# agent_loop.py
from ollama import Client

DRAFTER  = Client(host="http://ollama-drafter.ai:11434")
VERIFIER = Client(host="http://ollama-verifier.ai:11434")

DRAFT_MODEL  = "your-draft-model:9b"
VERIFY_MODEL = "your-verify-model:35b"
MAX_RETRIES  = 3

VERIFY_PROMPT = """You are a strict code reviewer.
Check the draft against the task and the repository context.
Respond with the single word PASS, or FAIL followed by
specific, actionable feedback. Reject code that is correct
but does not match the conventions in the context."""

def draft(task: str, context: str, feedback: str = "") -> str:
    prompt = f"Task:\\n{task}\\n\\nRepository context:\\n{context}"
    if feedback:
        prompt += f"\\n\\nYour previous draft was rejected:\\n{feedback}"
    r = DRAFTER.chat(model=DRAFT_MODEL,
                     messages=[{"role": "user", "content": prompt}])
    return r.message.content

def verify(task: str, context: str, code: str) -> tuple[bool, str]:
    r = VERIFIER.chat(model=VERIFY_MODEL, messages=[
        {"role": "system", "content": VERIFY_PROMPT},
        {"role": "user",   "content":
            f"Task:\\n{task}\\n\\nContext:\\n{context}\\n\\nDraft:\\n{code}"},
    ])
    text = r.message.content.strip()
    return text.startswith("PASS"), text

def run(task: str, context: str) -> dict:
    feedback = ""
    for attempt in range(1, MAX_RETRIES + 1):
        code = draft(task, context, feedback)
        passed, feedback = verify(task, context, code)
        if passed:
            return {"status": "pass", "code": code, "attempts": attempt}
    # Local pipeline could not converge. Hand off instead of looping.
    return {"status": "escalate", "last_feedback": feedback}`

const escalationRules = [
  {
    title: 'Three strikes',
    icon: 'mdi:counter',
    detail: 'If the verifier rejects three drafts, stop. More local retries past that point almost never converge, they just burn time.',
  },
  {
    title: 'Wide refactors',
    icon: 'mdi:file-multiple-outline',
    detail: 'Changes that touch many files at once are the most common local failure mode. Send them straight to the hosted model.',
  },
  {
    title: 'Novel territory',
    icon: 'mdi:compass-outline',
    detail: 'If the retrieved context has nothing similar to the task, the drafter is guessing. Escalate before the first retry, not after the third.',
  },
  {
    title: 'Log the handoffs',
    icon: 'mdi:notebook-outline',
    detail: 'Every escalation is training data. Recurring categories tell you what to target with LoRA fine-tuning later.',
  },
]

const costRows = [
  { item: 'Drafter power',   measure: 'Smart plug on the always-on nodes, watts at idle and under load', range: '7 to 25 W per Jetson node' },
  { item: 'Verifier power',  measure: 'Smart plug on the GPU box, measure per session not per day',      range: '30 W idle, 350 W under load' },
  { item: 'Electricity',    measure: 'Your utility rate per kWh from the actual bill',                   range: '$0.10 to $0.35 per kWh' },
  { item: 'Hardware',       measure: 'Purchase price divided by expected months of service',             range: '36 to 60 months' },
  { item: 'Subscription',   measure: 'The hosted plan you would otherwise pay for',                      range: '$20 to $200 per month' },
]

const costFormula = `monthly_power  = (drafter_watts * 730h + verifier_watts * usage_h)
                 / 1000 * rate_per_kwh

monthly_local  = monthly_power + hardware_price / lifespan_months

breakeven      = monthly_local vs hosted_plan_per_month

# Run the numbers before buying anything.
# A 3090 you already own changes the math completely.`

const otherProducts = [
  { slug: 'self-hosted-ai-starter-kit',        title: 'Self-Hosted AI Starter Kit',        tagline: 'Run your own models without renting someone else\'s API.', icon: 'mdi:brain' },
  { slug: 'raspberry-pi-ai-cluster-blueprint', title: 'Raspberry Pi AI Cluster Blueprint', tagline: 'Build a real K3s cluster on hardware you own.',            icon: 'mdi:server-network' },
  { slug: 'production-ai-api-boilerplate',     title: 'Production AI API Boilerplate',     tagline: 'Skip the scaffolding, ship the feature.',                  icon: 'mdi:api' },
]
</script>
