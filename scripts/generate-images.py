#!/usr/bin/env python3
"""Generate site images with the local SDXL worker (Christian Reels image-worker).

    python scripts/generate-images.py scripts/image-manifest.json [--only ID ...] [--force]

The manifest is a JSON list of {"id", "out", "prompt", "seed"?, "negative"?}.
Each image is rendered at 1344x768 (SDXL's native 16:9-ish bucket), centre-
cropped to 1200x630 (the Open Graph size) and saved as a progressive JPEG under
public/. Existing files are skipped, so the run can be stopped and resumed.
Requests go one at a time: the worker is shared with the Christian Reels
pipeline, which simply waits/retries while the GPU is busy.

Env: SD_URL (default http://localhost:8788)
"""
import base64
import io
import json
import os
import sys
import time
import urllib.error
import urllib.request

from PIL import Image

SD_URL = os.environ.get("SD_URL", "http://localhost:8788")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# One look for the whole site: dark, cinematic, slate/navy with a cool sky-blue
# accent, no text (SDXL can't spell), no people (avoids uncanny faces).
STYLE = (
    "cinematic editorial photograph, dark moody studio lighting, deep navy and slate background, "
    "cool cyan rim light, shallow depth of field, high detail, clean minimal composition, "
    "negative space on the left, 35mm, professional product photography, precise straight edges, accurate geometry"
)
NEGATIVE = (
    "text, letters, words, typography, watermark, logo, signature, caption, label, ui, screenshot, "
    "people, person, face, hands, cartoon, anime, illustration, painting, lowres, blurry, jpeg artifacts, "
    "oversaturated, neon pink, cluttered, deformed, warped lines, crooked lines, bent edges, distorted geometry, "
    "chessboard, checkerboard, numbers, digits, clock face, calendar, brand logo, raspberry logo, apple logo, bitcoin, cryptocurrency symbol, decals, stickers, engraved lettering"
)


def generate(prompt: str, negative: str, seed: int) -> Image.Image:
    body = json.dumps({
        "prompt": f"{prompt}, {STYLE}",
        "negative_prompt": negative,
        "width": 1344,
        "height": 768,
        "n": 1,
        "seed": seed,
        "num_inference_steps": 30,
        "guidance_scale": 6.5,
    }).encode()
    for attempt in range(8):
        req = urllib.request.Request(f"{SD_URL}/v1/images/generations", data=body, headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=600) as r:
                data = json.load(r)
            return Image.open(io.BytesIO(base64.b64decode(data["image_base64"]))).convert("RGB")
        except urllib.error.HTTPError as e:
            if e.code == 503:  # GPU busy (another job) or model loading: back off
                time.sleep(min(120, 10 * 2 ** attempt))
                continue
            raise RuntimeError(f"HTTP {e.code}: {e.read()[:300]!r}")
        except urllib.error.URLError:
            time.sleep(15)
    raise RuntimeError("worker kept refusing")


def to_og(img: Image.Image) -> Image.Image:
    # scale to 1200 wide, then centre-crop height to 630
    w, h = 1200, round(img.height * 1200 / img.width)
    img = img.resize((w, h), Image.LANCZOS)
    top = max(0, (h - 630) // 2)
    return img.crop((0, top, 1200, top + 630))


def main() -> None:
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    manifest = json.load(open(args[0], encoding="utf-8"))
    only = set(args[args.index("--only") + 1:]) if "--only" in args else None
    force = "--force" in args
    todo = [m for m in manifest if (not only or m["id"] in only)]
    done = skipped = failed = 0
    for i, m in enumerate(todo, 1):
        out = os.path.join(ROOT, "public", m["out"].lstrip("/"))
        if os.path.exists(out) and not force:
            skipped += 1
            continue
        os.makedirs(os.path.dirname(out), exist_ok=True)
        t0 = time.time()
        try:
            img = generate(m["prompt"], m.get("negative", NEGATIVE), int(m.get("seed", 1000 + i)))
            to_og(img).save(out, "JPEG", quality=82, optimize=True, progressive=True)
            done += 1
            print(f"[{i}/{len(todo)}] {m['id']} -> {m['out']} ({time.time() - t0:.0f}s, {os.path.getsize(out) // 1024} KB)", flush=True)
        except Exception as e:  # noqa: BLE001
            failed += 1
            print(f"[{i}/{len(todo)}] FAILED {m['id']}: {e}", flush=True)
    print(f"done {done}, skipped {skipped}, failed {failed}", flush=True)


if __name__ == "__main__":
    main()
