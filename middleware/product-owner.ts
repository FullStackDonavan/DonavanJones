import { defineNuxtRouteMiddleware, navigateTo, useRequestHeaders } from "#app";

// Gates /products/<slug>/guide pages: unauthenticated visitors go to login
// (and return after), authenticated non-buyers go back to the product page.
export default defineNuxtRouteMiddleware(async (to) => {
  const match = to.path.match(/^\/products\/([^/]+)\/guide\/?$/)
  const slug = match?.[1]

  if (!slug) {
    return
  }

  try {
    const headers = process.server ? useRequestHeaders(['cookie']) : {}
    const access = await $fetch<{ authenticated: boolean, owns: boolean }>('/api/products/owns', {
      query: { slug },
      headers: headers as HeadersInit,
    })

    if (!access.authenticated) {
      return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }

    if (!access.owns) {
      return navigateTo(`/products/${slug}?locked=1`)
    }
  } catch {
    // Fail closed: if the ownership check errors, send to the product page
    return navigateTo(`/products/${slug}`)
  }
})
