#!/usr/bin/env node
// Refresh git metadata in content/projects/*.md from the projects' local
// checkouts. Run on the development machine (the `localPath` folders only
// exist there); the deployed site never touches those paths, it only reads the
// committed markdown.
//
//   node scripts/sync-local-projects.mjs          # update files
//   node scripts/sync-local-projects.mjs --check  # report drift, exit 1 if any
//
// Updates only these frontmatter keys, and only when the file already has a
// `localPath`: firstCommit, lastCommit, commitCount, repository (from `origin`,
// with credentials and a trailing .git removed).
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIR = join(ROOT, 'content', 'projects')
const check = process.argv.includes('--check')

function git(cwd, args) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return ''
  }
}

function frontmatterValue(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))
  if (!m) return undefined
  return m[1].trim().replace(/^['"]|['"]$/g, '')
}

function setKey(fm, key, value) {
  const line = `${key}: ${typeof value === 'number' ? value : JSON.stringify(value)}`
  const re = new RegExp(`^${key}:.*$`, 'm')
  if (re.test(fm)) return fm.replace(re, line)
  // insert after localPath so the source-related keys stay together
  return fm.replace(/^(localPath:.*)$/m, `$1\n${line}`)
}

let drift = 0
for (const file of readdirSync(DIR).filter((f) => f.endsWith('.md'))) {
  const path = join(DIR, file)
  const text = readFileSync(path, 'utf8')
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) continue
  let fm = m[1]
  const localPath = frontmatterValue(fm, 'localPath')
  if (!localPath) continue
  if (!existsSync(localPath)) {
    console.log(`skip  ${file}: ${localPath} not found on this machine`)
    continue
  }
  if (!git(localPath, ['rev-parse', '--is-inside-work-tree'])) {
    console.log(`skip  ${file}: ${localPath} is not a git repository`)
    continue
  }
  const dates = git(localPath, ['log', '--format=%ad', '--date=short']).split('\n').filter(Boolean)
  const remote = git(localPath, ['remote', 'get-url', 'origin'])
    .replace(/\/\/[^@/]+@/, '//') // strip credentials
    .replace(/\.git$/, '')
  const next = {
    lastCommit: dates[0],
    firstCommit: dates[dates.length - 1],
    commitCount: dates.length,
    ...(remote ? { repository: remote } : {}),
  }
  const before = fm
  for (const [k, v] of Object.entries(next)) if (v !== undefined && v !== '') fm = setKey(fm, k, v)
  if (fm === before) {
    console.log(`ok    ${file}`)
    continue
  }
  drift++
  console.log(`${check ? 'drift' : 'write'} ${file}: ${JSON.stringify(next)}`)
  if (!check) writeFileSync(path, text.replace(m[1], fm))
}
if (check && drift) process.exit(1)
