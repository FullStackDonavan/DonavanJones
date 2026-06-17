<template>
  <PatternSection>
    <div class="min-h-screen bg-white dark:bg-slate-950">

      <!-- Sticky breadcrumb -->
      <div class="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <nav class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <NuxtLink to="/products/overview" class="hover:text-sky-400 transition-colors">Products</NuxtLink>
            <Icon name="mdi:chevron-right" class="text-slate-300 dark:text-slate-600" />
            <NuxtLink to="/products/production-ai-api-boilerplate" class="hover:text-sky-400 transition-colors">Boilerplate</NuxtLink>
            <Icon name="mdi:chevron-right" class="text-slate-300 dark:text-slate-600" />
            <span class="text-slate-700 dark:text-slate-300 font-medium">Guide</span>
          </nav>
          <span class="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            <Icon name="mdi:api" class="text-sm" />
            Backend Engineering
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
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium mb-5">
              <Icon name="mdi:api" />
              Production AI API Boilerplate
            </div>
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
              The Complete Boilerplate
            </h1>
            <p class="mt-3 text-slate-500 dark:text-slate-400 leading-relaxed">
              FastAPI project structure, authentication, vector search, embedding services, Docker files, and CI/CD — the scaffolding already in place so you start on day one with the actual product logic.
            </p>
          </div>

          <!-- ── 1. Project Structure ────────────────────────────────── -->
          <section id="project-structure" class="mb-16">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                <Icon name="mdi:api" class="text-sky-400 text-base" />
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">FastAPI Project Structure</h2>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              The directory layout that scales past a single <code class="font-mono text-xs">main.py</code>. Routers handle HTTP, services hold business logic, schemas define request/response shapes — each layer stays in its own place.
            </p>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-6"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ folderTree }}</code></pre>
            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">main.py</h3>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-6"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ mainPy }}</code></pre>
            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">config.py (settings via environment variables)</h3>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ configPy }}</code></pre>
          </section>

          <!-- ── 2. Authentication ───────────────────────────────────── -->
          <section id="authentication" class="mb-16">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Icon name="mdi:shield-lock-outline" class="text-purple-400 text-base" />
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Authentication</h2>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              JWT-based auth using <code class="font-mono text-xs">python-jose</code> and <code class="font-mono text-xs">passlib</code>. The login route returns a bearer token; a FastAPI dependency (<code class="font-mono text-xs">get_current_user</code>) protects any route that needs it.
            </p>
            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">services/auth.py — token creation and verification</h3>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-6"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ authService }}</code></pre>
            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">routers/auth.py — login endpoint</h3>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-6"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ authRouter }}</code></pre>
            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">dependencies.py — protect any route with Depends(get_current_user)</h3>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ authDeps }}</code></pre>
          </section>

          <!-- ── 3. Vector Search ────────────────────────────────────── -->
          <section id="vector-search" class="mb-16">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Icon name="mdi:magnify-scan" class="text-emerald-400 text-base" />
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Vector Search</h2>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              ChromaDB handles vector storage and nearest-neighbor search. The service layer abstracts the ChromaDB client so it's easy to swap for pgvector or Qdrant later.
            </p>
            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">services/search.py</h3>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-6"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ searchService }}</code></pre>
            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">routers/search.py — protected query endpoint</h3>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ searchRouter }}</code></pre>
          </section>

          <!-- ── 4. Embedding Services ───────────────────────────────── -->
          <section id="embedding-services" class="mb-16">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Icon name="mdi:vector-combine" class="text-amber-400 text-base" />
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Embedding Services</h2>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              Async embedding via <code class="font-mono text-xs">httpx</code> so the API stays non-blocking during the Ollama call. The ingest route accepts file uploads, chunks the content, and stores vectors.
            </p>
            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">services/embedding.py</h3>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-6"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ embeddingService }}</code></pre>
            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">routers/ingest.py — document ingestion endpoint</h3>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ ingestRouter }}</code></pre>
          </section>

          <!-- ── 5. Docker Files ─────────────────────────────────────── -->
          <section id="docker-files" class="mb-16">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                <Icon name="mdi:docker" class="text-sky-400 text-base" />
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Docker Files</h2>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              The same container that runs locally deploys to production. <code class="font-mono text-xs">docker-compose.yml</code> brings up the API, Postgres, and ChromaDB together — one command to get a fully wired local environment.
            </p>
            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Dockerfile</h3>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-6"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ dockerfile }}</code></pre>
            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">docker-compose.yml</h3>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-4"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ dockerCompose }}</code></pre>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ dockerCommands }}</code></pre>
          </section>

          <!-- ── 6. CI/CD Examples ───────────────────────────────────── -->
          <section id="cicd-examples" class="mb-16">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Icon name="mdi:sync-circle" class="text-purple-400 text-base" />
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">CI/CD Examples</h2>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              GitHub Actions workflow that runs tests on every PR, then builds and pushes a Docker image to the container registry on merge to main. The test job spins up a real Postgres service container — no mocking the database.
            </p>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ cicdYaml }}</code></pre>
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
  title: 'Production AI API Boilerplate — Guide',
  description: 'FastAPI project structure, JWT auth, vector search, embedding services, Docker, and CI/CD for a production AI-backed API.',
  robots: 'noindex, nofollow',
})

const toc = [
  { id: 'project-structure',   title: 'Project Structure',  icon: 'mdi:api' },
  { id: 'authentication',      title: 'Authentication',     icon: 'mdi:shield-lock-outline' },
  { id: 'vector-search',       title: 'Vector Search',      icon: 'mdi:magnify-scan' },
  { id: 'embedding-services',  title: 'Embedding Services', icon: 'mdi:vector-combine' },
  { id: 'docker-files',        title: 'Docker Files',       icon: 'mdi:docker' },
  { id: 'cicd-examples',       title: 'CI/CD',              icon: 'mdi:sync-circle' },
]

const folderTree = `api/
├── app/
│   ├── main.py              # FastAPI app, lifespan, routers
│   ├── config.py            # Settings via pydantic-settings + .env
│   ├── dependencies.py      # get_current_user, get_db, etc.
│   ├── routers/
│   │   ├── auth.py          # POST /auth/login
│   │   ├── search.py        # POST /search/query
│   │   └── ingest.py        # POST /ingest/document
│   ├── models/
│   │   └── user.py          # SQLAlchemy User model
│   ├── schemas/
│   │   ├── auth.py          # LoginRequest, TokenResponse
│   │   └── search.py        # QueryRequest, QueryResponse
│   └── services/
│       ├── auth.py          # JWT create/verify, password hashing
│       ├── embedding.py     # embed_text(), batch_embed()
│       └── search.py        # vector_query()
├── tests/
│   ├── conftest.py          # Fixtures: test client, test DB
│   ├── test_auth.py
│   └── test_search.py
├── alembic/                 # DB migrations
│   └── versions/
├── Dockerfile
├── docker-compose.yml
├── pyproject.toml
└── .github/
    └── workflows/
        └── ci.yml`

const mainPy = `from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.routers import auth, search, ingest
from app.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: connection pool warm-up, embedding model check
    yield
    # Shutdown: close DB connections

app = FastAPI(
    title=settings.app_name,
    lifespan=lifespan,
    docs_url="/docs" if settings.debug else None,
)

app.include_router(auth.router,   prefix="/auth",   tags=["auth"])
app.include_router(search.router, prefix="/search", tags=["search"])
app.include_router(ingest.router, prefix="/ingest", tags=["ingest"])

@app.get("/health")
async def health():
    return {"status": "ok"}`

const configPy = `from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Production AI API"
    debug: bool = False
    secret_key: str                          # Required — no default
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    database_url: str                        # Required — postgresql://...
    ollama_url: str = "http://localhost:11434"
    embedding_model: str = "nomic-embed-text"
    llm_model: str = "llama3.2:3b"
    chroma_host: str = "chroma"
    chroma_port: int = 8000

    class Config:
        env_file = ".env"

settings = Settings()`

const authService = `from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    payload = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    payload.update({"exp": expire})
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm],
        )
    except JWTError:
        raise ValueError("Invalid or expired token")`

const authRouter = `from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.services.auth import create_access_token, verify_password
from app.schemas.auth import TokenResponse
from app.config import settings

router = APIRouter()

# In production, get_user() queries your DB
async def get_user(email: str):
    # TODO: replace with real DB lookup
    users = {"admin@example.com": {"email": "admin@example.com", "hashed_password": "..."}}
    return users.get(email)

@router.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await get_user(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token(
        data={"sub": user["email"]},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )
    return TokenResponse(access_token=token, token_type="bearer")`

const authDeps = `from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.services.auth import decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    try:
        payload = decode_token(token)
        email: str = payload.get("sub", "")
        if not email:
            raise ValueError()
        return email
    except (ValueError, Exception):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Usage in any router:
# @router.post("/protected")
# async def protected(user: str = Depends(get_current_user)):
#     return {"user": user}`

const searchService = `import chromadb
from app.services.embedding import embed_text
from app.config import settings

_collection = None

def get_collection():
    global _collection
    if _collection is None:
        client = chromadb.HttpClient(host=settings.chroma_host, port=settings.chroma_port)
        _collection = client.get_or_create_collection("documents")
    return _collection

async def vector_query(question: str, top_k: int = 5) -> list[dict]:
    embedding = await embed_text(question)
    results = get_collection().query(
        query_embeddings=[embedding],
        n_results=top_k,
        include=["documents", "metadatas", "distances"],
    )
    return [
        {
            "content": doc,
            "source": meta.get("source", ""),
            "score": round(1 - dist, 4),
        }
        for doc, meta, dist in zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0],
        )
    ]`

const searchRouter = `from fastapi import APIRouter, Depends
from app.dependencies import get_current_user
from app.services.search import vector_query
from app.schemas.search import QueryRequest, QueryResponse
from app.config import settings
import httpx

router = APIRouter()

@router.post("/query", response_model=QueryResponse)
async def search(request: QueryRequest, user: str = Depends(get_current_user)):
    chunks = await vector_query(request.question, top_k=request.top_k)
    context = "\\n\\n".join(c["content"] for c in chunks)
    sources = list({c["source"] for c in chunks if c["source"]})

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(
            f"{settings.ollama_url}/api/generate",
            json={
                "model": settings.llm_model,
                "prompt": f"Answer from context only:\\n\\n{context}\\n\\nQuestion: {request.question}\\nAnswer:",
                "stream": False,
            },
        )
    answer = resp.json().get("response", "")
    return QueryResponse(answer=answer, sources=sources)`

const embeddingService = `import httpx
from app.config import settings

async def embed_text(text: str) -> list[float]:
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(
            f"{settings.ollama_url}/api/embeddings",
            json={"model": settings.embedding_model, "prompt": text},
        )
        resp.raise_for_status()
    return resp.json()["embedding"]

async def batch_embed(texts: list[str]) -> list[list[float]]:
    # Sequential for now — add concurrency with asyncio.gather if needed
    return [await embed_text(t) for t in texts]`

const ingestRouter = `from fastapi import APIRouter, Depends, UploadFile, HTTPException
from app.dependencies import get_current_user
from app.services.embedding import embed_text
from app.services.search import get_collection

router = APIRouter()

def chunk_text(text: str, size: int = 512, overlap: int = 64) -> list[str]:
    words = text.split()
    return [" ".join(words[i : i + size]) for i in range(0, len(words), size - overlap)]

@router.post("/document")
async def ingest_document(file: UploadFile, user: str = Depends(get_current_user)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="File name required")
    content = (await file.read()).decode("utf-8")
    chunks = chunk_text(content)
    collection = get_collection()
    for i, chunk in enumerate(chunks):
        embedding = await embed_text(chunk)
        collection.add(
            documents=[chunk],
            embeddings=[embedding],
            ids=[f"{file.filename}-chunk-{i}"],
            metadatas=[{"source": file.filename, "chunk": i}],
        )
    return {"file": file.filename, "chunks_ingested": len(chunks)}`

const dockerfile = `FROM python:3.11-slim

WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y --no-install-recommends \\
    curl build-essential \\
    && rm -rf /var/lib/apt/lists/*

# Install Python deps before copying app code (cache layer)
COPY pyproject.toml .
RUN pip install --no-cache-dir .

# Copy app
COPY app/ ./app/

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]`

const dockerCompose = `version: "3.9"

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      SECRET_KEY: "change-me-in-production"
      DATABASE_URL: "postgresql://postgres:postgres@db:5432/api"
      OLLAMA_URL: "http://host.docker.internal:11434"
      CHROMA_HOST: "chroma"
      CHROMA_PORT: "8000"
    depends_on:
      db:
        condition: service_healthy
      chroma:
        condition: service_started
    volumes:
      - ./app:/app/app   # hot-reload in dev

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: api
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    volumes:
      - postgres_data:/var/lib/postgresql/data

  chroma:
    image: chromadb/chroma:latest
    ports:
      - "8001:8000"
    volumes:
      - chroma_data:/chroma/chroma

volumes:
  postgres_data:
  chroma_data:`

const dockerCommands = `# Start everything
docker compose up --build

# Run in background
docker compose up -d --build

# Check logs
docker compose logs -f api

# Stop and remove volumes
docker compose down -v`

const cicdYaml = `# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_DB: api_test
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"
          cache: "pip"

      - name: Install dependencies
        run: pip install -e ".[dev]"

      - name: Run tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/api_test
          SECRET_KEY: test-secret-key-for-ci
          OLLAMA_URL: http://localhost:11434   # not available in CI — tests should mock
          CHROMA_HOST: localhost
          CHROMA_PORT: "8001"
        run: pytest tests/ -v --tb=short --cov=app --cov-report=term-missing

  build:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Log in to GitHub Container Registry
        run: echo "\${{ secrets.GITHUB_TOKEN }}" | docker login ghcr.io -u \${{ github.actor }} --password-stdin

      - name: Build and push Docker image
        run: |
          IMAGE=ghcr.io/\${{ github.repository }}
          docker build -t $IMAGE:\${{ github.sha }} -t $IMAGE:latest .
          docker push $IMAGE:\${{ github.sha }}
          docker push $IMAGE:latest`

const otherProducts = [
  { slug: 'raspberry-pi-ai-cluster-blueprint', title: 'Raspberry Pi AI Cluster Blueprint', tagline: 'Build the rack without the trial and error.', icon: 'mdi:server-network' },
  { slug: 'self-hosted-ai-starter-kit', title: 'Self-Hosted AI Starter Kit', tagline: "Run your own models without renting someone else's API.", icon: 'mdi:brain' },
]
</script>
