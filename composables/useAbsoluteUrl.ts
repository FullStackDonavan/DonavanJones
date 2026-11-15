// Returns a function that turns a site path ("/img/x.jpg") into an absolute
// URL on the canonical origin. og:image and twitter:image must be absolute;
// frontmatter image paths (excerptImage) are relative.
export function useAbsoluteUrl() {
  const SITE = ((useRuntimeConfig().public.appDomain as string) || 'https://donavanjones.com').replace(/\/+$/, '')
  return (path?: string | null) => {
    if (!path) return undefined
    return /^https?:\/\//.test(path) ? path : `${SITE}${path.startsWith('/') ? '' : '/'}${path}`
  }
}
