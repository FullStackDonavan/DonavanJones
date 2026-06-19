export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, company, project, budget, timeline, source } = body

  if (!name || !email) {
    throw createError({ statusCode: 400, message: 'Name and email are required.' })
  }

  const apiKey    = process.env.GHL
  const locationId = process.env.GHL_LOCATION_ID

  if (!apiKey || !locationId) {
    console.error('[contact] Missing GHL or GHL_LOCATION_ID env var')
    throw createError({ statusCode: 500, message: 'Contact service unavailable.' })
  }

  const [firstName, ...rest] = name.trim().split(' ')
  const lastName = rest.join(' ') || ''

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    Version: '2021-07-28',
  }

  // Create contact
  let contactId: string | null = null
  try {
    const res = await $fetch<{ contact?: { id?: string } }>(
      'https://services.leadconnectorhq.com/contacts/',
      {
        method: 'POST',
        headers,
        body: {
          firstName,
          lastName,
          email,
          locationId,
          source: source || 'Hire Me Form',
          tags: ['hire-me', 'website-lead'],
          ...(company ? { companyName: company } : {}),
        },
      }
    )
    contactId = res?.contact?.id ?? null
    console.log('[contact] created:', contactId)
  } catch (err: unknown) {
    const e = err as { data?: unknown; status?: number }
    console.error('[contact] create failed:', e?.status, JSON.stringify(e?.data))
    throw createError({ statusCode: 502, message: 'Could not save your message. Please email directly.' })
  }

  // Attach project details as a note
  if (contactId) {
    const noteBody = [
      project  ? `Project: ${project}`   : null,
      budget   ? `Budget: ${budget}`     : null,
      timeline ? `Timeline: ${timeline}` : null,
    ].filter(Boolean).join('\n')

    if (noteBody) {
      await $fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
        method: 'POST',
        headers,
        body: { body: noteBody },
      }).catch((e: unknown) => {
        console.warn('[contact] note failed (non-fatal):', JSON.stringify((e as { data?: unknown })?.data))
      })
    }
  }

  return { ok: true }
})
