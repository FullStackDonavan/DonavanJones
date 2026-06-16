#!/usr/bin/env python3
"""Insert CTA MDC components into blog articles based on scripts/cta_plan.csv.

Idempotent: skips any file that already contains a CTA component block.
"""
import os, re, csv

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(ROOT, "scripts", "cta_plan.csv")

FOLDER_BY_SLUG_PREFIX = {
    "/blog/ai-engineering/": "AI-Engineering",
    "/blog/algorithms-and-data-structures/": "Algorithms-And-Data-Structures",
    "/blog/backendengineering/": "BackendEngineering",
    "/blog/infrastructureengineering/": "InfrastructureEngineering",
}

CTA_TYPE_TO_COMPONENT = {
    "Explore a category pillar page": "CtaCategoryPillar",
    "View a system architecture page": "CtaSystemArchitecture",
    "Try one of my applications": "CtaTryApp",
    "View my portfolio": "CtaPortfolio",
    "Contact me about freelance work": "CtaContactWork",
    "Download a PDF guide or checklist": "CtaDownloadGuide",
    "Read a related article": "CtaRelatedArticle",
    "Join an email newsletter": "CtaNewsletter",
}

PRICE_RE = re.compile(r"\(\$(\d+)\)")


def yaml_escape(s: str) -> str:
    s = s.replace('\\', '\\\\').replace('"', '\\"')
    return s


def build_block(cta_type: str, row: dict, indent: str = "") -> list[str]:
    component = CTA_TYPE_TO_COMPONENT[cta_type]
    props = {}
    props["buttonText"] = row["button_text"]
    props["supportingCopy"] = row["supporting_copy"]
    if cta_type != "Join an email newsletter":
        props["destinationUrl"] = row["destination_url"]
    if cta_type == "Download a PDF guide or checklist":
        m = PRICE_RE.search(row["supporting_copy"])
        if m:
            props["price"] = f"${m.group(1)}"

    colons = ":::" if indent else "::"
    lines = [f"{indent}{colons}{component}", f"{indent}---"]
    for k, v in props.items():
        lines.append(f'{indent}{k}: "{yaml_escape(v)}"')
    lines.append(f"{indent}---")
    lines.append(f"{indent}{colons}")
    return lines


def is_fence_toggle(line: str) -> bool:
    return line.strip().startswith("```")


def find_safe_blank_indices(lines: list[str]) -> list[int]:
    """Blank-line indices that are safe paragraph breaks (not in code/table/list context)."""
    safe = []
    in_fence = False
    for i, line in enumerate(lines):
        if is_fence_toggle(line):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        if line.strip() != "":
            continue
        prev_line = lines[i - 1].rstrip() if i > 0 else ""
        next_line = lines[i + 1].rstrip() if i + 1 < len(lines) else ""
        if prev_line.startswith("|") or next_line.startswith("|"):
            continue
        if re.match(r"^\s*([-*]|\d+\.)\s", prev_line) or re.match(r"^\s*([-*]|\d+\.)\s", next_line):
            continue
        if prev_line.startswith("#"):
            continue
        if prev_line == "" or next_line == "":
            continue
        if prev_line.startswith("```") or next_line.startswith("```"):
            continue
        safe.append(i)
    return safe


def pick_positions(candidates: list[int], n: int) -> list[int]:
    if not candidates:
        return []
    if n <= 0:
        return []
    fractions = [(i + 1) / (n + 1) for i in range(n)]
    chosen = []
    used = set()
    for frac in fractions:
        target = candidates[min(len(candidates) - 1, int(round(frac * (len(candidates) - 1))))]
        # nudge to avoid collisions
        idx_in_candidates = candidates.index(target)
        while target in used and idx_in_candidates + 1 < len(candidates):
            idx_in_candidates += 1
            target = candidates[idx_in_candidates]
        used.add(target)
        chosen.append(target)
    return sorted(set(chosen))


def process_article(filepath: str, rows: list[dict]):
    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()

    if "::Cta" in text:
        return "skipped (already has CTAs)"

    lines = text.split("\n")

    part_idx = None
    for i, line in enumerate(lines):
        if re.match(r"^\*Part of the .*\*$", line.strip()):
            part_idx = i
            break
    if part_idx is None:
        return "ERROR: no '*Part of the...*' anchor found"

    fr_idx = None
    for i, line in enumerate(lines):
        if line.strip() == "## Further Reading":
            fr_idx = i
            break
    if fr_idx is None:
        return "ERROR: no '## Further Reading' anchor found"

    # if a lone '---' immediately precedes Further Reading (with a blank line), cut before it
    cut_idx = fr_idx
    j = fr_idx - 1
    while j >= 0 and lines[j].strip() == "":
        j -= 1
    if j >= 0 and lines[j].strip() == "---":
        cut_idx = j

    intro_rows = [r for r in rows if r["placement"] == "Intro"]
    mid_rows = [r for r in rows if r["placement"] in ("Mid-article", "Exit intent")]
    end_rows = [r for r in rows if r["placement"] == "End of article"]
    newsletter_rows = [r for r in rows if r["cta_type"] == "Join an email newsletter"]

    # ---- Section A: up to and including the "Part of..." line ----
    section_a = lines[: part_idx + 1]

    # ---- Section B: body between anchor and cut point ----
    section_b = lines[part_idx + 1 : cut_idx]

    # ---- Section C: from cut point to end ----
    section_c = lines[cut_idx:]

    # insert intro block right after Section A
    intro_block = []
    for r in intro_rows:
        intro_block += build_block(r["cta_type"], r)

    # insert mid-article block(s) into section_b at safe positions
    candidates = find_safe_blank_indices(section_b)
    positions = pick_positions(candidates, len(mid_rows))

    new_section_b = []
    insert_map = {pos: r for pos, r in zip(positions, mid_rows)}
    if len(positions) < len(mid_rows):
        # not enough safe spots found; stack remaining ones at the last available spot (or end)
        leftover = mid_rows[len(positions):]
    else:
        leftover = []

    for i, line in enumerate(section_b):
        new_section_b.append(line)
        if i in insert_map:
            new_section_b.append("")
            new_section_b += build_block(insert_map[i]["cta_type"], insert_map[i])

    for r in leftover:
        new_section_b.append("")
        new_section_b += build_block(r["cta_type"], r)

    # ---- end-of-article card row (Download / Related / Newsletter) ----
    card_rows = end_rows + [r for r in newsletter_rows if r not in end_rows]
    card_block = []
    if card_rows:
        card_block.append("::CtaCardRow")
        for idx, r in enumerate(card_rows):
            card_block += build_block(r["cta_type"], r, indent="  ")
            if idx != len(card_rows) - 1:
                card_block.append("")
        card_block.append("::")

    # ---- assemble ----
    out = []
    out += section_a
    out.append("")
    out += intro_block
    out += new_section_b
    if card_block:
        out.append("")
        out += card_block
        out.append("")
    out += section_c

    new_text = "\n".join(out)
    new_text = re.sub(r"\n{4,}", "\n\n\n", new_text)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_text)

    return f"OK ({len(intro_rows)} intro, {len(mid_rows)} mid, {len(card_rows)} card)"


def main():
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        all_rows = list(reader)

    by_slug = {}
    for r in all_rows:
        for prefix in FOLDER_BY_SLUG_PREFIX:
            if r["slug"].startswith(prefix):
                by_slug.setdefault(r["slug"], []).append(r)
                break

    results = []
    for slug, rows in sorted(by_slug.items()):
        prefix = next(p for p in FOLDER_BY_SLUG_PREFIX if slug.startswith(p))
        folder = FOLDER_BY_SLUG_PREFIX[prefix]
        filename = slug[len(prefix):] + ".md"
        filepath = os.path.join(ROOT, "content", "blog", folder, filename)
        if not os.path.isfile(filepath):
            results.append((slug, f"ERROR: file not found at {filepath}"))
            continue
        status = process_article(filepath, rows)
        results.append((slug, status))

    ok = sum(1 for _, s in results if s.startswith("OK"))
    skipped = sum(1 for _, s in results if s.startswith("skipped"))
    errors = [(s, st) for s, st in results if st.startswith("ERROR")]

    print(f"Processed {len(results)} articles: {ok} updated, {skipped} skipped, {len(errors)} errors")
    for slug, status in results:
        print(f"  {status:55s} {slug}")


if __name__ == "__main__":
    main()
