#!/usr/bin/env python3
import os, re, csv, io

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOG_DIR = os.path.join(ROOT, "content", "blog")
INSIGHTS_DIR = os.path.join(ROOT, "content", "Insights")

# ---------- frontmatter parsing ----------
def parse_frontmatter(path):
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    m = re.match(r"^---\n(.*?)\n---\n", text, re.DOTALL)
    if not m:
        return {}
    fm_text = m.group(1)
    data = {}
    lines = fm_text.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        kv = re.match(r"^([A-Za-z_]+):\s*(.*)$", line)
        if kv:
            key, val = kv.group(1), kv.group(2).strip()
            if val == "":
                # possible list block follows
                items = []
                j = i + 1
                while j < len(lines) and re.match(r"^\s*-\s*(.*)$", lines[j]):
                    items.append(re.match(r"^\s*-\s*(.*)$", lines[j]).group(1).strip().strip('"'))
                    j += 1
                if items:
                    data[key] = items
                    i = j
                    continue
                else:
                    data[key] = ""
            else:
                data[key] = val.strip('"')
        i += 1
    return data

# ---------- nuxt content _path replication ----------
def refine_url_part(name):
    # strips a leading "NN." (digits + dot) prefix only; dash-numbered prefixes are kept
    return re.sub(r"^(\d+\.)?(.*)$", r"\2", name)

def slugify_lower(s):
    s = s.strip().lower()
    s = re.sub(r"[^a-z0-9\-]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s

def compute_path(rel_dir, filename_noext, base_segment):
    parts = [base_segment] + ([rel_dir] if rel_dir else []) + [filename_noext]
    out = []
    for p in parts:
        out.append(slugify_lower(refine_url_part(p)))
    return "/" + "/".join(out)

# ---------- collect articles ----------
articles = []

for sub in sorted(os.listdir(BLOG_DIR)):
    sub_path = os.path.join(BLOG_DIR, sub)
    if not os.path.isdir(sub_path):
        continue
    for fn in sorted(os.listdir(sub_path)):
        if not fn.endswith(".md"):
            continue
        full = os.path.join(sub_path, fn)
        fm = parse_frontmatter(full)
        if not fm or fm.get("draft") == "true":
            continue
        noext = fn[:-3]
        path = compute_path(sub, noext, "blog")
        articles.append({
            "title": fm.get("title", ""),
            "description": fm.get("description", ""),
            "category": fm.get("category", ""),
            "tags": fm.get("tags", []),
            "folder": sub,
            "filename": noext,
            "path": path,
            "section": "blog",
        })

for fn in sorted(os.listdir(INSIGHTS_DIR)):
    if not fn.endswith(".md"):
        continue
    full = os.path.join(INSIGHTS_DIR, fn)
    fm = parse_frontmatter(full)
    if not fm or fm.get("draft") == "true":
        continue
    noext = fn[:-3]
    path = compute_path("", noext, "insights")
    articles.append({
        "title": fm.get("title", ""),
        "description": fm.get("description", ""),
        "category": fm.get("category", ""),
        "tags": fm.get("tags", []),
        "folder": "Insights",
        "filename": noext,
        "path": path,
        "section": "insights",
    })

print(f"Parsed {len(articles)} articles")

# ---------- grouping for related-article linking ----------
by_folder = {}
for a in articles:
    by_folder.setdefault(a["folder"], []).append(a)

def related_article(article):
    siblings = [s for s in by_folder[article["folder"]] if s["path"] != article["path"]]
    if not siblings:
        return None
    idx = by_folder[article["folder"]].index(article)
    # next in sequence, wrap around
    seq = by_folder[article["folder"]]
    next_idx = (idx + 1) % len(seq)
    if seq[next_idx]["path"] == article["path"] and len(seq) > 1:
        next_idx = (next_idx + 1) % len(seq)
    return seq[next_idx]

# manual adjacency for algorithms (non-numbered filenames)
ALGO_PAIRS = {
    "binary-search": "linear-search",
    "linear-search": "binary-search",
    "sliding-window": "multiple-pointers",
    "multiple-pointers": "frequency-counter",
    "frequency-counter": "sliding-window",
    "recursion": "divide-and-conquer-pattern",
    "divide-and-conquer-pattern": "recursion",
}

def related_for(article):
    if article["folder"] == "Algorithms-And-Data-Structures":
        target_fn = ALGO_PAIRS.get(article["filename"])
        if target_fn:
            for s in by_folder[article["folder"]]:
                if s["filename"] == target_fn:
                    return s
    return related_article(article)

# ---------- category -> pillar / system mapping ----------
CATEGORY_PILLAR = {
    "ai-engineering": "/categories/ai-engineering",
    "backend-engineering": "/categories/backend-engineering",
    "infrastructure-engineering": "/categories/infrastructure-engineering",
    "algorithms": "/categories/algorithms",
}
CATEGORY_SYSTEM = {
    "ai-engineering": "/systems/ai",
    "backend-engineering": "/systems/backend",
    "infrastructure-engineering": "/systems/infrastructure",
}
CATEGORY_AUDIENCE = {
    "ai-engineering": "AI/backend engineers building RAG pipelines and agent systems",
    "backend-engineering": "Backend engineers and technical leads designing service architecture",
    "infrastructure-engineering": "DevOps and infrastructure engineers running self-hosted/homelab Kubernetes",
    "algorithms": "Junior developers and interview candidates studying CS fundamentals",
    "insights": "Small business owners and operators in Lakeland and Central Florida",
}

# backend-engineering articles directly tied to the Bible Verse app's AI backend
BACKEND_APP_TIE = {
    "02-ai-services", "04-embeddings", "05-vector-search", "06-streaming",
    "07-notifications", "08-inference-services", "09-embedding-services",
    "10-ocr-pipelines", "11-agent-orchestration",
}
# backend-engineering articles that read as architecture/strategy decisions (commercial intent)
BACKEND_COMMERCIAL = {
    "01-monolith-vs-microservices", "12-async-workers", "13-gpu-allocation",
    "14-batching", "15-latency-optimization", "16-model-loading-strategies",
}
# infrastructure-engineering articles that are strategic/decision-oriented
INFRA_COMMERCIAL = {
    "37-why-i-built-a-homelab", "22-infrastructure-design", "18-cost-vs-performance-tradeoffs",
    "20-future-expansion-plans", "35-systems-thinking", "02-hardware-list-and-costs",
    "11-architecture-diagrams", "13-cluster-architecture-homelab",
}

# paid digital products — one per technical category, placeholder URLs until
# real product/checkout pages exist
DIGITAL_PRODUCTS = {
    "ai-engineering": (
        "Get The AI Starter Kit",
        "Get the Self-Hosted AI Starter Kit — Ollama setup, RAG architecture diagrams, "
        "embedding pipeline templates, and FastAPI examples ($29).",
        "/products/self-hosted-ai-starter-kit",
    ),
    "backend-engineering": (
        "Get The API Boilerplate",
        "Get the Production AI API Boilerplate — FastAPI starter, auth, vector search, "
        "Docker, and CI/CD examples ($49).",
        "/products/production-ai-api-boilerplate",
    ),
    "infrastructure-engineering": (
        "Get The Cluster Blueprint",
        "Get the Raspberry Pi AI Cluster Blueprint — hardware list, network diagrams, "
        "Kubernetes manifests, and Grafana dashboards ($19).",
        "/products/raspberry-pi-ai-cluster-blueprint",
    ),
    "local-vibe-coding": (
        "Get The Vibe Coding Blueprint",
        "Get the Local Vibe Coding Blueprint: hardware split guide, Kubernetes manifests, "
        "repo indexing scripts, and the draft and verify agent loop ($39).",
        "/products/local-vibe-coding-blueprint",
    ),
}

INSIGHTS_CATEGORY_LINK = {
    "01-why-lakeland-startups-should-consider-ai-automation": ("/categories/ai-engineering", "Commercial"),
    "02-hiring-a-software-developer-in-lakeland": ("/categories/backend-engineering", "Transactional"),
    "03-building-custom-business-software-in-central-florida": ("/categories/backend-engineering", "Commercial"),
    "04-ai-opportunities-for-small-businesses-in-lakeland": ("/categories/ai-engineering", "Commercial"),
}

def truncate(s, n=70):
    return s if len(s) <= n else s[: n - 1].rstrip() + "…"

rows = []

for a in articles:
    cat = a["category"]
    title = a["title"]
    path = a["path"]
    rel = related_for(a)
    rel_title = rel["title"] if rel else None
    rel_path = rel["path"] if rel else None

    if a["section"] == "blog" and cat in ("ai-engineering", "backend-engineering", "infrastructure-engineering"):
        audience = CATEGORY_AUDIENCE[cat]
        intent = "Informational"
        if cat == "backend-engineering" and a["filename"] in BACKEND_COMMERCIAL:
            intent = "Commercial"
        if cat == "infrastructure-engineering" and a["filename"] in INFRA_COMMERCIAL:
            intent = "Commercial"

        ctas = []
        ctas.append((
            "Explore a category pillar page", "Browse More Like This",
            f"See every {cat.replace('-', ' ')} deep-dive in this series.",
            CATEGORY_PILLAR[cat], "Intro",
        ))
        ctas.append((
            "View a system architecture page", "See The Full System",
            f"See how this fits into the production {cat.replace('-', ' ')} system it was built for.",
            CATEGORY_SYSTEM[cat], "Mid-article",
        ))

        product_count = 0
        if cat == "ai-engineering":
            ctas.append((
                "Try one of my applications", "Try The Live AI App",
                "Try the RAG-powered Bible study app these patterns were built for.",
                "https://versehub.app/register", "Mid-article",
            ))
            product_count += 1
        elif cat == "backend-engineering" and a["filename"] in BACKEND_APP_TIE:
            ctas.append((
                "Try one of my applications", "Try The Live AI App",
                "See this exact backend pattern running in production on a live app.",
                "https://versehub.app/register", "Mid-article",
            ))
            product_count += 1
        elif cat == "backend-engineering" and a["filename"] in BACKEND_COMMERCIAL:
            ctas.append((
                "Contact me about freelance work", "Get Help With This",
                "Weighing this same tradeoff on your own system? Let's talk it through.",
                "/hire-me", "Exit intent",
            ))
            product_count += 1
        elif cat == "infrastructure-engineering" and a["filename"] in INFRA_COMMERCIAL:
            ctas.append((
                "Contact me about freelance work", "Get Help With This",
                "Planning a similar build or migration? Let's talk it through.",
                "/hire-me", "Exit intent",
            ))
            product_count += 1

        # paid digital product — second product CTA slot, stays within the ≤2 cap
        btn, copy, dest = DIGITAL_PRODUCTS[cat]
        ctas.append((
            "Download a PDF guide or checklist", btn, copy, dest, "End of article",
        ))
        product_count += 1

        if rel:
            ctas.append((
                "Read a related article", f"Read: {truncate(rel_title, 40)}",
                f"Continue with \"{rel_title}\" for the next piece of this system.",
                rel_path, "End of article",
            ))

        ctas.append((
            "Join an email newsletter", "Get New Posts By Email",
            f"Get new {cat.replace('-', ' ')} breakdowns delivered before they're public.",
            "/newsletter", "Sticky sidebar",
        ))

        for cta_type, btn, copy, dest, placement in ctas:
            rows.append([title, path, cat, audience, intent, cta_type, btn, copy, dest, placement])

    elif a["section"] == "blog" and cat == "algorithms":
        audience = CATEGORY_AUDIENCE["algorithms"]
        intent = "Informational"
        ctas = []
        ctas.append((
            "Explore a category pillar page", "Browse The Full Series",
            "See every algorithm and data structure pattern in this series.",
            CATEGORY_PILLAR["algorithms"], "Intro",
        ))
        ctas.append((
            "View my portfolio", "See It Used In Production",
            "See these exact patterns applied inside real, shipped projects.",
            "/projects/overview", "Mid-article",
        ))
        if rel:
            ctas.append((
                "Read a related article", f"Read: {truncate(rel_title, 40)}",
                f"Pair this with \"{rel_title}\" — they're commonly used together.",
                rel_path, "End of article",
            ))
        ctas.append((
            "Join an email newsletter", "Get New Posts By Email",
            "Get new algorithm breakdowns and backend deep-dives by email.",
            "/newsletter", "Sticky sidebar",
        ))
        for cta_type, btn, copy, dest, placement in ctas:
            rows.append([title, path, cat, audience, intent, cta_type, btn, copy, dest, placement])

    elif a["section"] == "insights":
        audience = CATEGORY_AUDIENCE["insights"]
        cat_link, intent = INSIGHTS_CATEGORY_LINK.get(a["filename"], ("/insights/overview", "Commercial"))
        ctas = []
        ctas.append((
            "Explore a category pillar page", "See The Engineering Behind It",
            "See the engineering skill set behind what's being described here.",
            cat_link, "Intro",
        ))
        ctas.append((
            "Book a consultation", "Book A Free Consultation",
            "Get a free consultation on what this could look like for your business.",
            "/hire-me", "Mid-article",
        ))
        ctas.append((
            "View my portfolio", "See A Real Case Study",
            "See a real 92-business SaaS platform built from the ground up for a local company.",
            "/projects/business-benefit-alliance", "Mid-article",
        ))
        if rel:
            ctas.append((
                "Read a related article", f"Read: {truncate(rel_title, 40)}",
                f"Continue with \"{rel_title}\" for more on this topic.",
                rel_path, "End of article",
            ))
        ctas.append((
            "Join an email newsletter", "Get Local Business Tips",
            "Get monthly AI and software tips for Lakeland and Central Florida business owners.",
            "/newsletter", "Sticky sidebar",
        ))
        ctas.append((
            "Contact me about freelance work", "Talk About Your Project",
            "Ready to scope your project? Reach out and let's talk specifics.",
            "/hire-me", "Exit intent",
        ))
        for cta_type, btn, copy, dest, placement in ctas:
            rows.append([title, path, cat, audience, intent, cta_type, btn, copy, dest, placement])

# ---------- write CSV ----------
out_path = os.path.join(ROOT, "scripts", "cta_plan.csv")
with open(out_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
    writer.writerow(["title", "slug", "category", "target_audience", "search_intent",
                      "cta_type", "button_text", "supporting_copy", "destination_url", "placement"])
    for r in rows:
        writer.writerow(r)

print(f"Wrote {len(rows)} CTA rows to {out_path}")

# ---------- summary stats ----------
from collections import Counter
cat_counts = Counter(r[2] for r in rows)
print("\nCTA count per category:")
for c, n in cat_counts.items():
    print(f"  {c}: {n}")

commercial = [r for r in rows if r[4] in ("Commercial", "Transactional")]
strong_titles = sorted(set((r[0], r[4]) for r in commercial), key=lambda x: (x[1] != "Transactional",))
print(f"\nArticles with Commercial/Transactional intent: {len(set(r[0] for r in commercial))}")
