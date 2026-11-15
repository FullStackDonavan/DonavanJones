import { describe, it, expect } from 'vitest'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { ctaImage, CTA_FALLBACK } from '../../utils/ctaImage'

const ROOT = join(__dirname, '..', '..')
const pub = (p: string) => join(ROOT, 'public', p)

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n)
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.md') ? [p] : []
  })
}

describe('ctaImage', () => {
  it('maps destinations to the right kind of art', () => {
    expect(ctaImage('/blog/ai-engineering/03-tool-calling')).toBe('/img/blog/ai-engineering/03-tool-calling.jpg')
    expect(ctaImage('/blog/BackendEngineering/08-inference-services')).toBe('/img/blog/backendengineering/08-inference-services.jpg')
    expect(ctaImage('/categories/agentic-ai-systems')).toBe('/img/categories/agentic-ai-systems.jpg')
    expect(ctaImage('/systems/backend')).toBe('/img/heroes/systems-backend.jpg')
    expect(ctaImage('/products/self-hosted-ai-starter-kit')).toBe('/img/products/2.self-hosted-ai-starter-kit.jpg')
    expect(ctaImage('/projects/versehub')).toBe('/img/projects/versehub/cover.jpg')
    expect(ctaImage('https://versehub.app/')).toBe('/img/projects/versehub/cover.jpg')
  })

  it('ignores query, hash and trailing slashes', () => {
    expect(ctaImage('/hire-me#contact')).toBe('/img/cards/cta-projects.jpg')
    expect(ctaImage('/systems/ai/?ref=cta')).toBe('/img/heroes/systems-ai.jpg')
  })

  it('falls back for unknown, external and empty links', () => {
    expect(ctaImage('/categories/SaaS')).toBe(CTA_FALLBACK)
    expect(ctaImage('https://github.com/x')).toBe(CTA_FALLBACK)
    expect(ctaImage('')).toBe(CTA_FALLBACK)
    expect(ctaImage(undefined)).toBe(CTA_FALLBACK)
  })

  it('every destinationUrl used in content resolves to an image that exists', () => {
    const files = walk(join(ROOT, 'content'))
    const urls = new Set<string>()
    for (const f of files) {
      for (const m of readFileSync(f, 'utf8').matchAll(/destinationUrl:\s*["']?([^"'\s]+)["']?/g)) urls.add(m[1])
    }
    expect(urls.size).toBeGreaterThan(20)
    const missing = [...urls].map((u) => [u, ctaImage(u)]).filter(([, img]) => !existsSync(pub(img)))
    expect(missing).toEqual([])
  })

  it('every mapped page/project/product image exists', () => {
    for (const u of ['/', '/about', '/resume', '/tools', '/tools/vram-calculator', '/projects/kingdom-tools',
      '/projects/business-benefit-alliance', '/projects/truecrew', '/products/tiny-tool-calling-model-blueprint',
      '/services/local-ai-infrastructure', '/jetson-leaderboard', '/newsletter']) {
      expect(existsSync(pub(ctaImage(u))), u).toBe(true)
    }
  })
})
