"""Export the Jetson benchmark results from Kingdom Tools into data/jetson-leaderboard.json,
the file /jetson-leaderboard renders. Run it from the homelab network, then commit the JSON:

    KT_URL=http://<kingdom-tools-host>:30800 KT_USER=... KT_PASS=... python scripts/export_jetson_leaderboard.py

What goes public: model names, quants, sizes and scores only. Box names are mapped to
Nova / Echo / Charlie; no IPs, hostnames, errors or raw answers leave the lab.

One row per model + quant. All three boxes are the same hardware (Jetson Orin Nano Super
8 GB), so each box's latest successful run is taken and the boxes are averaged.
"""
import datetime
import json
import os
import re
import statistics
import sys
import urllib.request
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "data" / "jetson-leaderboard.json"
BOXES = {"gpu-worker-1": "Nova", "gpu-worker-2": "Echo", "gpu-worker-3": "Charlie"}
SKIP = re.compile(r"^lora-|embed", re.I)  # my own fine-tunes and embedding models aren't chat models
# Thinking variants spend the whole answer budget thinking, so their 0% quality is the test's fault, not
# the model's; the instruct builds of the same models are on the board.
SKIP_EXACT = {"qwen3-vl:2b", "qwen3-vl:4b"}
LIBRARY = {"llama3.2": "Llama 3.2", "functiongemma": "FunctionGemma", "gemma3": "Gemma 3", "qwen3-vl": "Qwen3 VL",
           "qwen2.5vl": "Qwen2.5 VL", "qwen3": "Qwen3", "granite4": "Granite 4"}


def tidy(name: str) -> str:
    words = []
    for w in name.split():
        if w.lower() in ("instruct", "it"):
            continue
        if re.fullmatch(r"[\d.]+[bm]", w, re.I) or re.fullmatch(r"a[\d.]+b", w, re.I):
            w = w.upper()
        elif w.isalpha() and w.islower():
            w = w.capitalize()
        words.append(w)
    return " ".join(words)


def fetch() -> list[dict]:
    url, user, pw = os.environ.get("KT_URL"), os.environ.get("KT_USER"), os.environ.get("KT_PASS")
    if not (url and user and pw):
        sys.exit("Set KT_URL, KT_USER and KT_PASS")
    req = urllib.request.Request(f"{url}/api/auth/login", json.dumps({"username": user, "password": pw}).encode(),
                                 {"Content-Type": "application/json"})
    login = json.load(urllib.request.urlopen(req, timeout=30))
    token = login.get("access_token") or login.get("token")
    req = urllib.request.Request(f"{url}/api/bench/results", headers={"Authorization": f"Bearer {token}"})
    return json.load(urllib.request.urlopen(req, timeout=60))


def name_and_quant(model: str, quant: str | None) -> tuple[str, str]:
    """'hf.co/bartowski/Qwen_Qwen3-4B-Instruct-2507-GGUF:Q4_K_M' -> ('Qwen3 4B Instruct 2507', 'Q4_K_M')."""
    base, _, tag = model.partition(":")
    if not base.startswith("hf.co/"):  # ollama library: qwen3-vl:2b-instruct-q8_0
        m = re.search(r"-(i?q\d\w*|f16)$", tag, re.I)
        if m:
            quant, tag = m.group(1).upper(), tag[:m.start()]
        base = LIBRARY.get(base, base)
    if base.startswith("hf.co/"):
        base = base.split("/", 2)[2]
        if "_" in base:  # bartowski names files Org_Model
            base = base.split("_", 1)[1]
        base = re.sub(r"-GGUF$", "", base, flags=re.I)
        if re.match(r"^(I?Q\d|F16|BF16)", tag, re.I):
            quant = tag.upper()
        tag = ""
    if not quant or quant.lower() == "unknown":
        quant = tag.upper() or "default"
    name = base.replace("-", " ")
    if tag and not re.match(r"^(I?Q\d|F16|latest)", tag, re.I):  # ollama library tags: llama3.2:3b
        name = f"{name} {tag}"
    return tidy(name.replace("-", " ")), quant


def params_b(p: str | None) -> float | None:
    m = re.match(r"([\d.]+)\s*([MB])", p or "", re.I)
    if not m:
        return None
    v = float(m.group(1))
    return round(v / 1000 if m.group(2).upper() == "M" else v, 2)


def mean(vals):
    vals = [v for v in vals if v is not None]
    return round(statistics.mean(vals), 1) if vals else None


def build(results: list[dict]) -> dict:
    latest = {}  # (name, quant, box) -> newest ok run
    for r in results:
        if (not r.get("ok") or SKIP.search(r["model"]) or r["model"] in SKIP_EXACT or r["device"] not in BOXES
                or not r.get("gen_tps")):
            continue
        name, quant = name_and_quant(r["model"], r.get("quant"))
        key = (name, quant, r["device"])
        rank = (r.get("quality") is not None, r["created_at"])  # a fully scored run beats a newer speed-only one
        if key not in latest or rank > (latest[key].get("quality") is not None, latest[key]["created_at"]):
            latest[key] = {**r, "_name": name, "_quant": quant}
    rows = {}
    for (name, quant, _), r in latest.items():
        rows.setdefault((name, quant), []).append(r)
    out = []
    for (name, quant), runs in rows.items():
        out.append({
            "id": re.sub(r"[^a-z0-9]+", "-", f"{name} {quant}".lower()).strip("-"),
            "name": name, "family": name.split(" ")[0], "quant": quant,
            "params_b": params_b(runs[0].get("params")),
            "size_gb": round((runs[0].get("size") or 0) / 1e9, 2) or None,
            "tok_s": mean(r["gen_tps"] for r in runs),
            "prompt_tok_s": mean(r.get("prompt_tps") for r in runs),
            "load_s": mean(r.get("load_s") for r in runs),
            "gpu_pct": mean(r.get("gpu_pct") for r in runs),
            "quality": mean(r.get("quality") for r in runs),
            "tools": mean(r.get("tool_score") for r in runs),
            "code": mean(r.get("code_score") for r in runs),
            "boxes": sorted(BOXES[r["device"]] for r in runs),
            "tested": max(r["created_at"] for r in runs)[:10],
        })
    out.sort(key=lambda x: -(x["tok_s"] or 0))
    return {
        "generated": datetime.date.today().isoformat(),
        "hardware": "NVIDIA Jetson Orin Nano Super 8 GB (×3)",
        "runtime": "Ollama, 4k context, temperature 0",
        "runs": sum(len(v) for v in rows.values()),
        "models": out,
    }


if __name__ == "__main__":
    data = build(fetch())
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{len(data['models'])} model/quant rows from {data['runs']} runs -> {OUT}")
