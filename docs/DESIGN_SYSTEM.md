# Design system

The site's working pages (tools, projects) use a small set of primitives so new
UI looks like it belongs without copying long Tailwind class strings around.
Marketing pages (home, services, systems hubs) keep their existing styling.

## Principles

- **Slate neutrals, one accent.** Sky is the only brand accent. Emerald, amber
  and rose appear only when they mean something: ok, caution, problem.
- **Compact headers on working pages.** `UiPageHeader` (H1 at 3xl/4xl) instead of
  full-viewport heroes; the content people came for starts above the fold.
- **One radius per role.** `rounded-xl` for surfaces, `rounded-lg` for subtle
  panels, `rounded-md` for controls and badges.
- **Numbers line up.** Inputs, tables and stats use `tabular-nums`.
- **Accessible by default.** Visible focus rings (`ds-focus`), labelled inputs,
  radio-group semantics for segmented controls, `aria-live` on result panels,
  and reduced motion respected globally.

## CSS primitives (`assets/css/tailwind.css`, `@layer components`)

| Class | Use |
|---|---|
| `ds-container` | Page width + gutters (max-w-7xl) |
| `ds-surface` / `ds-subtle` | Card surface / secondary panel |
| `ds-eyebrow`, `ds-h1`, `ds-h2`, `ds-h3`, `ds-body`, `ds-muted`, `ds-label` | Type scale |
| `ds-input` | Text inputs and selects (supports `aria-invalid="true"`) |
| `ds-btn-primary`, `ds-btn-secondary`, `ds-btn-ghost` | Buttons |
| `ds-link` | Inline links |
| `ds-table` | Dense data tables (`th`/`td` padding, row dividers) |
| `ds-focus` | Focus ring for custom interactive elements |

## Components (`components/ui`)

| Component | Props | Notes |
|---|---|---|
| `UiPageHeader` | `eyebrow`, `title`, `description`, `crumbs` | Slots: `actions`, default (below the lede) |
| `UiBadge` | `tone` (`neutral` `info` `success` `warning` `danger`), `dot` | Status and category labels |
| `UiSegmented` | `v-model`, `options`, `label`, `size` | Radio group; arrow keys, Home/End |
| `UiNumberField` | `v-model`, `label`, `min`, `max`, `step`, `unit`, `hint`, `error`, `integer` | Never emits NaN or out-of-range values |
| `HeroBackdrop` | `src`, `side` (`right` / `full`), `tone` (`auto` / `dark`) | Decorative hero art behind a hero (parent needs `relative isolate overflow-hidden`) |

Tool-specific pieces live in `components/tools` (`CalcMemoryBar`,
`CalcFitBadge`, panels) and project pieces in `components/elements/ProjectFacts.vue`.

## Imagery

Every page hero, blog post, insight, product and image-less project has one
generated image (1200×630 JPEG, which doubles as its `og:image`). One look across
the site: dark, cinematic product photography with a cool cyan accent, no
text and no people. The style lives in one place (`STYLE` in
`scripts/generate-images.py`); each image only names its subject.

| File | Role |
|---|---|
| `scripts/image-subjects.json` | One subject line per image (content path, `page:<name>` or `project:<slug>`) |
| `scripts/build-image-manifest.mjs` | Subjects → `image-manifest.json` (output path + stable seed) |
| `scripts/generate-images.py` | Renders with the local SDXL worker (`SD_URL`, default `http://localhost:8788`, the Christian Reels image-worker on the RTX 3090); skips files that exist, so it resumes |
| `scripts/apply-image-frontmatter.mjs` | Sets `excerptImage` in content frontmatter once its image exists; never replaces one that is already set |

Adding a post: add its subject to `image-subjects.json`, then

```bash
node scripts/build-image-manifest.mjs
python scripts/generate-images.py scripts/image-manifest.json --only blog/<Category>/<file>
node scripts/apply-image-frontmatter.mjs
```

To redo an image, change its subject (the seed changes with it) or pass `--force` with `--only`.
Images are decorative (`alt=""`); headings and copy carry the meaning.
