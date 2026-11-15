#!/usr/bin/env node
// Point each content file's `excerptImage` at its generated image, once the
// image exists in public/. Never overwrites an excerptImage that is already
// set (real screenshots win). Touches only that one frontmatter line.
//
//   node scripts/apply-image-frontmatter.mjs [--dry-run]
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const dry = process.argv.includes('--dry-run')
const manifest = JSON.parse(readFileSync(join(ROOT, 'scripts', 'image-manifest.json'), 'utf8'))

function contentFile(id) {
  if (id.startsWith('page:') || id.startsWith('category:') || id.startsWith('card:') || id.startsWith('section:')) return null
  if (id.startsWith('project:')) {
    const slug = id.slice(8)
    const dir = join(ROOT, 'content', 'projects')
    const f = readdirSync(dir).find((n) => n.replace(/^\d+\./, '') === `${slug}.md`)
    return f ? join(dir, f) : null
  }
  return join(ROOT, 'content', `${id}.md`)
}

let set = 0, kept = 0, missingImg = 0
for (const m of manifest) {
  const file = contentFile(m.id)
  if (!file) continue
  if (!existsSync(join(ROOT, 'public', m.out))) { missingImg++; continue }
  const text = readFileSync(file, 'utf8')
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!fm) continue
  const eol = text.includes('\r\n') ? '\r\n' : '\n'
  const line = fm[1].match(/^excerptImage:[ \t]*(.*)$/m)
  if (line && line[1].trim() && line[1].trim() !== '""' && line[1].trim() !== "''") { kept++; continue }
  const newFm = line
    ? fm[1].replace(/^excerptImage:.*$/m, `excerptImage: ${m.out}`)
    : `${fm[1]}${eol}excerptImage: ${m.out}`
  if (!dry) writeFileSync(file, text.replace(fm[1], newFm))
  set++
}
console.log(`${dry ? 'would set' : 'set'} ${set}, kept existing ${kept}, image not generated yet ${missingImg}`)
