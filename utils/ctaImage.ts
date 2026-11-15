/**
 * Background art for a call-to-action, chosen from where it links, so a CTA
 * shows the image of the page it sends you to:
 *
 *   /blog/<cat>/<post>, /insights/<post>  -> that article's image
 *   /categories/<slug>                    -> the category cover
 *   /systems/<x>, /system-overview, …     -> that page's hero
 *   /projects/<slug>, /products/<slug>    -> the project / product image
 *   /hire-me, /services, contact links    -> a generic "work with me" image
 *
 * Every mapping points at a file under public/img; tests/unit/cta_image.test.ts
 * checks each destinationUrl used in content resolves to a file that exists.
 */

const CATEGORIES = new Set([
  'ai-engineering', 'algorithms', 'backend-engineering', 'infrastructure-engineering', 'local-vibe-coding',
  'agentic-ai-systems', 'ai-homelab-engineering', 'ai-cost-optimization', 'versehub-engineering',
])

const PAGES: Record<string, string> = {
  '/system-overview': '/img/heroes/system-overview.jpg',
  '/systems/ai': '/img/heroes/systems-ai.jpg',
  '/systems/backend': '/img/heroes/systems-backend.jpg',
  '/systems/infrastructure': '/img/heroes/systems-infrastructure.jpg',
  '/systems/agentic-ai': '/img/heroes/systems-agentic-ai.jpg',
  '/systems/ai-homelab': '/img/heroes/systems-ai-homelab.jpg',
  '/systems/local-vibe-coding': '/img/heroes/systems-local-vibe-coding.jpg',
  '/jetson-leaderboard': '/img/heroes/jetson-leaderboard.jpg',
  '/tools': '/img/heroes/tools.jpg',
  '/tools/vram-calculator': '/img/cards/tool-vram.jpg',
  '/tools/kv-cache-calculator': '/img/cards/tool-kv-cache.jpg',
  '/tools/gpu-comparison': '/img/cards/tool-gpu-comparison.jpg',
  '/projects/overview': '/img/heroes/projects.jpg',
  '/products/overview': '/img/heroes/products.jpg',
  '/blog/overview': '/img/heroes/blog.jpg',
  '/insights/overview': '/img/heroes/insights.jpg',
  '/about': '/img/heroes/about.jpg',
  '/resume': '/img/cards/cta-hire.jpg',
  '/newsletter': '/img/heroes/newsletter.jpg',
  '/services': '/img/heroes/services.jpg',
  '/services/ai-automation': '/img/heroes/services-ai-automation.jpg',
  '/services/web-development': '/img/heroes/services-web-development.jpg',
  '/services/local-business-ai': '/img/heroes/services-local-business-ai.jpg',
  '/services/local-ai-infrastructure': '/img/heroes/services-local-ai-infrastructure.jpg',
  '/hire-me': '/img/cards/cta-projects.jpg',
  '/': '/img/heroes/home.jpg',
}

const PROJECTS: Record<string, string> = {
  'versehub': '/img/projects/versehub/cover.jpg',
  'christian-reels': '/img/projects/christian-reels/cover.jpg',
  'tpa-platform': '/img/projects/tpa-platform/cover.jpg',
  'truecrew': '/img/projects/truecrew/home.png',
  'turfline': '/img/projects/turfline/home.png',
  'kingdom-tools': '/img/projects/kingdom-tools/devices.png',
  'business-benefit-alliance': '/img/portfolio/nbba.png',
}

// content/products files keep their numeric order prefix in the image name
const PRODUCTS: Record<string, string> = {
  'raspberry-pi-ai-cluster-blueprint': '/img/products/1.raspberry-pi-ai-cluster-blueprint.jpg',
  'self-hosted-ai-starter-kit': '/img/products/2.self-hosted-ai-starter-kit.jpg',
  'production-ai-api-boilerplate': '/img/products/3.production-ai-api-boilerplate.jpg',
  'local-vibe-coding-blueprint': '/img/products/4.local-vibe-coding-blueprint.jpg',
  'tiny-tool-calling-model-blueprint': '/img/products/5.tiny-tool-calling-model-blueprint.jpg',
}

/** Default when a link has no art of its own (contact, external sites, …). */
export const CTA_FALLBACK = '/img/cards/cta-projects.jpg'

export function ctaImage(url?: string | null): string {
  if (!url) return CTA_FALLBACK
  if (/^https?:\/\/(www\.)?versehub\.app/.test(url)) return PROJECTS.versehub
  if (/^https?:\/\//.test(url) || url.startsWith('mailto:')) return CTA_FALLBACK

  const path = url.split(/[?#]/)[0].replace(/\/+$/, '') || '/'
  if (PAGES[path]) return PAGES[path]

  const [, section, a, b] = path.split('/')
  if (section === 'blog' && a && b) return `/img/blog/${a.toLowerCase()}/${b}.jpg`
  if (section === 'insights' && a) return `/img/insights/${a}.jpg`
  if (section === 'categories' && a && CATEGORIES.has(a)) return `/img/categories/${a}.jpg`
  if (section === 'projects' && a && PROJECTS[a]) return PROJECTS[a]
  if (section === 'products' && a && PRODUCTS[a]) return PRODUCTS[a]
  if (section === 'services' || section === 'hire-me') return CTA_FALLBACK
  return CTA_FALLBACK
}
