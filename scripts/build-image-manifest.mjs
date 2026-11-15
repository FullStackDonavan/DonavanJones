#!/usr/bin/env node
// Turn scripts/image-subjects.json into scripts/image-manifest.json:
// output path and a stable seed per image (so a regenerated image looks the
// same unless its subject changes).
//
//   content key  blog/AI-Engineering/03-tool-calling -> /img/blog/ai-engineering/03-tool-calling.jpg
//   page:<name>                                      -> /img/heroes/<name>.jpg
//   project:<slug>                                   -> /img/projects/<slug>/cover.jpg
//   section:<name>                                   -> /img/sections/<name>.jpg
//   category:<slug>                                  -> /img/categories/<slug>.jpg
import { readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIR = dirname(fileURLToPath(import.meta.url))
const subjects = JSON.parse(readFileSync(join(DIR, 'image-subjects.json'), 'utf8'))

export function imagePathFor(key) {
  if (key.startsWith('page:')) return `/img/heroes/${key.slice(5)}.jpg`
  if (key.startsWith('section:')) return `/img/sections/${key.slice(8)}.jpg`
  if (key.startsWith('card:')) return `/img/cards/${key.slice(5)}.jpg`
  if (key.startsWith('category:')) return `/img/categories/${key.slice(9)}.jpg`
  if (key.startsWith('project:')) return `/img/projects/${key.slice(8)}/cover.jpg`
  const parts = key.split('/')
  const file = parts.pop()
  return `/img/${parts.map((p) => p.toLowerCase()).join('/')}/${file}.jpg`
}

const manifest = Object.entries(subjects)
  .filter(([k]) => !k.startsWith('_'))
  .map(([id, prompt]) => ({
    id,
    out: imagePathFor(id),
    prompt,
    seed: parseInt(createHash('sha1').update(id + prompt).digest('hex').slice(0, 7), 16),
  }))

writeFileSync(join(DIR, 'image-manifest.json'), JSON.stringify(manifest, null, 1) + '\n')
console.log(`${manifest.length} images`)
