<template>
  <div class="min-h-screen bg-white dark:bg-slate-950">

    <!-- Sticky breadcrumb -->
    <div class="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <nav class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <NuxtLink to="/products/overview" class="hover:text-sky-400 transition-colors">Products</NuxtLink>
          <Icon name="mdi:chevron-right" class="text-slate-300 dark:text-slate-600" />
          <NuxtLink to="/products/production-ai-api-boilerplate" class="hover:text-sky-400 transition-colors">API Boilerplate</NuxtLink>
          <Icon name="mdi:chevron-right" class="text-slate-300 dark:text-slate-600" />
          <span class="text-slate-700 dark:text-slate-300 font-medium">Guide</span>
        </nav>
        <span class="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <Icon name="mdi:api" class="text-sm" />
          Backend Engineering
        </span>
      </div>
    </div>

    <!-- Hero -->
    <div class="bg-slate-900 border-b border-slate-800">
      <div class="max-w-7xl mx-auto px-6 py-16 sm:py-20">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
          <Icon name="mdi:api" class="text-sm" />
          Production AI API Boilerplate
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
          The Complete Boilerplate Guide
        </h1>
        <p class="text-slate-400 leading-relaxed max-w-2xl text-base">
          Project structure, authentication, vector search, embedding services, Docker config, and CI/CD — the full scaffold for a production AI API, ready to fork and ship.
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

        <!-- ── 1. Project Structure ────────────────────────────────── -->
        <section id="project-structure">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:folder-open-outline" class="text-emerald-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Project Structure</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
            A layout that scales past a single <code class="font-mono text-xs">main.py</code> file. Routers, services, and domain logic are separated so adding a feature doesn't mean touching every layer.
          </p>
          <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-6"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ folderTree }}</code></pre>
          <div class="space-y-5">
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">main.py</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ mainPy }}</code></pre>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">config.py</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ configPy }}</code></pre>
            </div>
          </div>
        </section>

        <!-- ── 2. Authentication ───────────────────────────────────── -->
        <section id="authentication">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:shield-lock-outline" class="text-sky-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Authentication</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
            JWT-based auth with bcrypt password hashing. The dependency injection pattern means any router can require authentication with a single import.
          </p>
          <div class="space-y-5">
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">services/auth.py</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ authService }}</code></pre>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">routers/auth.py</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ authRouter }}</code></pre>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">dependencies.py</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ dependencies }}</code></pre>
            </div>
          </div>
        </section>

        <!-- ── 3. Vector Search ────────────────────────────────────── -->
        <section id="vector-search">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:magnify" class="text-purple-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Vector Search</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
            pgvector on Postgres for production. The same interface works with ChromaDB locally so you don't need Postgres running during development.
          </p>
          <div class="space-y-5">
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">services/search.py</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ searchService }}</code></pre>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">routers/search.py</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ searchRouter }}</code></pre>
            </div>
          </div>
        </section>

        <!-- ── 4. Embedding Services ───────────────────────────────── -->
        <section id="embedding-services">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:vector-combine" class="text-amber-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Embedding Services</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
            A single embedding service that switches between Ollama (local) and OpenAI (cloud) via environment variable. Ingest endpoint handles chunking, embedding, and storage in one call.
          </p>
          <div class="space-y-5">
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">services/embedding.py</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ embeddingService }}</code></pre>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">routers/ingest.py</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ ingestRouter }}</code></pre>
            </div>
          </div>
        </section>

        <!-- ── 5. Docker Files ─────────────────────────────────────── -->
        <section id="docker-files">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:docker" class="text-emerald-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Docker Files</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
            Multi-stage build keeps the final image small. The compose file wires the API, Postgres with pgvector, and Ollama together for local development.
          </p>
          <div class="space-y-5">
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Dockerfile</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ dockerfile }}</code></pre>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">docker-compose.yml</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ dockerCompose }}</code></pre>
            </div>
          </div>
        </section>

        <!-- ── 6. CI/CD Examples ───────────────────────────────────── -->
        <section id="cicd-examples">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:github" class="text-sky-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">CI/CD Examples</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
            Full GitHub Actions workflow: lint, test, build, push to GHCR, and deploy on merge to main. Swap the deploy step for your hosting target.
          </p>
          <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ ciWorkflow }}</code></pre>
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
useSeoMeta({
  title: 'Production AI API Boilerplate — Guide',
  description: 'Project structure, authentication, vector search, embedding services, Docker config, and CI/CD for a production AI API.',
  robots: 'noindex, nofollow',
})

const toc = [
  { id: 'project-structure',   title: 'Project Structure',   icon: 'mdi:folder-open-outline',  description: 'Directory layout that scales past a single main.py.' },
  { id: 'authentication',      title: 'Authentication',      icon: 'mdi:shield-lock-outline',  description: 'JWT + bcrypt with FastAPI dependency injection.' },
  { id: 'vector-search',       title: 'Vector Search',       icon: 'mdi:magnify',              description: 'pgvector in prod, ChromaDB locally — same interface.' },
  { id: 'embedding-services',  title: 'Embedding Services',  icon: 'mdi:vector-combine',       description: 'Switch between Ollama and OpenAI via env var.' },
  { id: 'docker-files',        title: 'Docker Files',        icon: 'mdi:docker',               description: 'Multi-stage build + compose for local dev.' },
  { id: 'cicd-examples',       title: 'CI/CD Examples',      icon: 'mdi:github',               description: 'Full GitHub Actions: lint → test → build → deploy.' },
]

const folderTree = `ai-api/
├── app/
│   ├── main.py
│   ├── config.py
│   ├── dependencies.py
│   ├── routers/
│   │   ├── auth.py
│   │   ├── chat.py
│   │   ├── search.py
│   │   └── ingest.py
│   └── services/
│       ├── auth.py
│       ├── embedding.py
│       └── search.py
├── tests/
│   ├── test_auth.py
│   ├── test_search.py
│   └── test_ingest.py
├── Dockerfile
├── docker-compose.yml
├── pyproject.toml
└── .github/
    └── workflows/
        └── ci.yml`

const mainPy = `# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, chat, search, ingest
from app.config import settings

app = FastAPI(title=settings.app_name, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(search.router)
app.include_router(ingest.router)

@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}`

const configPy = `# app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "AI API"
    secret_key: str
    database_url: str
    ollama_base_url: str = "http://localhost:11434"
    openai_api_key: str = ""
    embed_provider: str = "ollama"   # "ollama" | "openai"
    embed_model: str = "nomic-embed-text"
    chat_model: str = "llama3.1:8b"
    cors_origins: list[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"

settings = Settings()`

const authService = `# app/services/auth.py
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM   = "HS256"
EXPIRES_MIN = 60 * 24  # 1 day

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(minutes=EXPIRES_MIN)
    return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
    except JWTError:
        return {}`

const authRouter = `# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.services.auth import verify_password, create_access_token
from app.dependencies import get_db   # your db session dep

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/token")
async def login(form: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)):
    user = await db.users.find_by_email(form.username)
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return {"access_token": create_access_token({"sub": str(user.id)}), "token_type": "bearer"}`

const dependencies = `# app/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.services.auth import decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

async def require_auth(token: str = Depends(oauth2_scheme)) -> dict:
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return payload

# Usage in any router:
# @router.get("/me")
# async def me(user = Depends(require_auth)):
#     return user`

const searchService = `# app/services/search.py
from app.config import settings

async def similarity_search(embedding: list[float], top_k: int = 5) -> list[dict]:
    if settings.database_url.startswith("postgresql"):
        return await _pg_search(embedding, top_k)
    return await _chroma_search(embedding, top_k)

async def _pg_search(embedding: list[float], top_k: int) -> list[dict]:
    # requires pgvector extension: CREATE EXTENSION vector;
    # column: embedding vector(768)
    from app.db import get_pool
    pool = await get_pool()
    rows = await pool.fetch(
        """
        SELECT content, 1 - (embedding <=> $1::vector) AS similarity
        FROM documents
        ORDER BY embedding <=> $1::vector
        LIMIT $2
        """,
        embedding,
        top_k,
    )
    return [dict(r) for r in rows]

async def _chroma_search(embedding: list[float], top_k: int) -> list[dict]:
    import chromadb
    db  = chromadb.PersistentClient(path=".chroma")
    col = db.get_or_create_collection("knowledge")
    res = col.query(query_embeddings=[embedding], n_results=top_k)
    return [{"content": d} for d in res["documents"][0]]`

const searchRouter = `# app/routers/search.py
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.services.search import similarity_search
from app.services.embedding import embed
from app.dependencies import require_auth

router = APIRouter(prefix="/search", tags=["search"])

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5

@router.post("/")
async def search(body: SearchRequest, _=Depends(require_auth)):
    embedding = await embed(body.query)
    results   = await similarity_search(embedding, body.top_k)
    return {"results": results}`

const embeddingService = `# app/services/embedding.py
from app.config import settings

async def embed(text: str) -> list[float]:
    if settings.embed_provider == "openai":
        return await _openai_embed(text)
    return await _ollama_embed(text)

async def _ollama_embed(text: str) -> list[float]:
    import httpx
    async with httpx.AsyncClient() as client:
        r = await client.post(
            f"{settings.ollama_base_url}/api/embeddings",
            json={"model": settings.embed_model, "prompt": text},
        )
    return r.json()["embedding"]

async def _openai_embed(text: str) -> list[float]:
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=settings.openai_api_key)
    r = await client.embeddings.create(model="text-embedding-3-small", input=text)
    return r.data[0].embedding`

const ingestRouter = `# app/routers/ingest.py
from fastapi import APIRouter, Depends, UploadFile, File
from app.services.embedding import embed
from app.services.search import store_document   # upsert to pg or chroma
from app.dependencies import require_auth

router = APIRouter(prefix="/ingest", tags=["ingest"])
CHUNK_SIZE, OVERLAP = 512, 64

def chunk(text: str) -> list[str]:
    words = text.split()
    out, i = [], 0
    while i < len(words):
        out.append(" ".join(words[i : i + CHUNK_SIZE]))
        i += CHUNK_SIZE - OVERLAP
    return out

@router.post("/")
async def ingest(file: UploadFile = File(...), _=Depends(require_auth)):
    text   = (await file.read()).decode()
    chunks = chunk(text)
    for c in chunks:
        vector = await embed(c)
        await store_document(c, vector)
    return {"chunks": len(chunks)}`

const dockerfile = `# Build
FROM python:3.12-slim AS builder
WORKDIR /build
COPY pyproject.toml .
RUN pip install --no-cache-dir build && pip install --no-cache-dir .

# Runtime
FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY app/ ./app/

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`

const dockerCompose = `services:
  api:
    build: .
    ports:
      - "8000:8000"
    env_file: .env
    depends_on:
      db:
        condition: service_healthy
      ollama:
        condition: service_started

  db:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_DB: aiapi
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 5

  ollama:
    image: ollama/ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama

volumes:
  pg_data:
  ollama_data:`

const ciWorkflow = `# .github/workflows/ci.yml
name: CI / CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: \${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: pgvector/pgvector:pg16
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: aiapi_test
        ports:
          - 5432:5432
        options: --health-cmd pg_isready --health-interval 5s --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
          cache: pip
      - run: pip install -e ".[dev]"
      - run: ruff check app tests
      - run: pytest tests/ -v
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost/aiapi_test
          SECRET_KEY: ci-secret-key
          EMBED_PROVIDER: ollama

  build-push:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: \${{ env.REGISTRY }}
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:latest

  deploy:
    needs: build-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: |
          # Replace with your deploy command
          # e.g. kubectl set image deployment/api api=ghcr.io/...
          echo "Deploy step — wire to your hosting target here"`

const otherProducts = [
  { slug: 'raspberry-pi-ai-cluster-blueprint', title: 'Raspberry Pi AI Cluster Blueprint', tagline: 'Build a real K3s cluster on hardware you own.',          icon: 'mdi:server-network' },
  { slug: 'self-hosted-ai-starter-kit',        title: 'Self-Hosted AI Starter Kit',        tagline: "Run your own models without renting someone else's API.", icon: 'mdi:brain' },
  { slug: 'local-vibe-coding-blueprint',       title: 'Local Vibe Coding Blueprint',       tagline: 'Run your own AI coding assistant on hardware you own.',   icon: 'mdi:code-braces' },
]
</script>
