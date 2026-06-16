export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { firstName, email, productTitle, productSlug } = body

  if (!email) {
    throw createError({ statusCode: 400, message: 'Email is required.' })
  }

  const apiKey = process.env.GHL
  const locationId = process.env.GHL_LOCATION_ID

  if (!apiKey || !locationId) {
    throw createError({ statusCode: 500, message: `Missing env vars — GHL: ${!!apiKey}, GHL_LOCATION_ID: ${!!locationId}` })
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    Version: '2021-07-28',
  }

  let contactId: string | null = null

  try {
    const res = await $fetch<{ contact?: { id?: string } }>(
      'https://services.leadconnectorhq.com/contacts/',
      {
        method: 'POST',
        headers,
        body: {
          email,
          locationId,
          source: 'Product Lead Magnet',
          tags: ['product-lead'],
          ...(firstName ? { firstName: firstName.trim() } : {}),
        },
      }
    )
    contactId = res?.contact?.id ?? null
  } catch (err: unknown) {
    const e = err as { data?: unknown; status?: number; message?: string }
    const detail = JSON.stringify(e?.data ?? e?.message ?? err)
    throw createError({ statusCode: 502, message: `GHL ${e?.status ?? '?'}: ${detail}` })
  }

  if (contactId && (productTitle || productSlug)) {
    await $fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
      method: 'POST',
      headers,
      body: { body: `Requested product: ${productTitle ?? productSlug}` },
    }).catch((e: unknown) => {
      console.warn('[product-lead] note failed:', JSON.stringify((e as { data?: unknown })?.data))
    })
  }

  return { ok: true }
})
