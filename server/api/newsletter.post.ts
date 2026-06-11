export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, firstName } = body

  if (!email) {
    throw createError({ statusCode: 400, message: 'Email is required.' })
  }

  const apiKey = process.env.GHL
  const locationId = process.env.GHL_LOCATION_ID

  if (!apiKey || !locationId) {
    console.error('[newsletter] Missing GHL or GHL_LOCATION_ID env var')
    throw createError({ statusCode: 500, message: 'Newsletter service unavailable.' })
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    Version: '2021-07-28',
  }

  try {
    await $fetch<{ contact?: { id?: string } }>(
      'https://services.leadconnectorhq.com/contacts/',
      {
        method: 'POST',
        headers,
        body: {
          email,
          locationId,
          source: 'Newsletter Signup',
          tags: ['newsletter'],
          ...(firstName ? { firstName: firstName.trim() } : {}),
        },
      }
    )
  } catch (err: unknown) {
    const e = err as { data?: unknown; status?: number }
    console.error('[newsletter] create failed:', e?.status, JSON.stringify(e?.data))
    throw createError({ statusCode: 502, message: 'Could not subscribe. Please try again.' })
  }

  return { ok: true }
})
