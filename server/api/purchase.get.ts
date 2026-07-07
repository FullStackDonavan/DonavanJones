export default defineEventHandler(async (event) => {
  // The purchase button is a plain HTML form POST; a GET here means a stray
  // navigation (back button after checkout, reload, bot/link-preview scan).
  // Without this handler Nitro falls through to the SPA renderer, which
  // throws an unhandled "Page not found" error instead of a clean redirect.
  await sendRedirect(event, '/')
})
