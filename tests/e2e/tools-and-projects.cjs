// Browser smoke test for the /tools calculators and /projects overview.
// Not part of `vitest` (needs a running server and a Chrome binary):
//   npm run dev -- --port 3333
//   The repo's own playwright install is broken (BrowserType is not a constructor),
//   so run a copy from a folder with a working playwright-core:
//   mkdir /tmp/e2e && cd /tmp/e2e && npm i playwright-core@1.49.1 && cp <repo>/tests/e2e/tools-and-projects.cjs .
//   cd <repo> && node /tmp/e2e/tools-and-projects.cjs
// Env: BASE (default http://localhost:3333), CHROME (path to chrome.exe),
//      OUT (where interaction screenshots go, default screenshots/after).
const { chromium } = require('playwright-core')
const OUT = process.env.OUT || 'screenshots/after'
const BASE = process.env.BASE || 'http://localhost:3333'
let fails = 0
const ok = (cond, msg) => { console.log((cond ? 'PASS ' : 'FAIL ') + msg); if (!cond) fails++ }

;(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe' })
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' })
  const p = await ctx.newPage()
  const errors = []
  p.on('pageerror', (e) => errors.push(e.message))
  p.on('console', (m) => { if (m.type() === 'error' && !/ERR_CONNECTION_REFUSED|24678/.test(m.text())) errors.push(m.text()) })

  // ── VRAM calculator
  await p.goto(BASE + '/tools/vram-calculator', { waitUntil: 'networkidle' })
  ok((await p.inputValue('#model-preset')) === 'llama-3.1-8b', 'SSR model select shows Llama 3.1 8B')
  const total0 = await p.textContent('#result-h + p')
  ok(total0.trim() === '6.5 GB', `default total is 6.5 GB (got ${total0.trim()})`)

  await p.click('button:has-text("70B")')
  await p.click('[role=radio]:has-text("FP16")')
  await p.waitForTimeout(400)
  const total1 = (await p.textContent('#result-h + p')).trim()
  ok(parseFloat(total1) > 140, `70B FP16 total > 140 GB (got ${total1})`)
  ok(await p.isVisible('text=Needs CPU offload'), '70B FP16 shows "Needs CPU offload"')
  await p.waitForTimeout(400)
  ok(/m=llama-3.3-70b/.test(p.url()) && /q=FP16/.test(p.url()), `URL reflects state (${p.url().split('?')[1]})`)
  await p.screenshot({ path: `${OUT}/interaction-vram-70b-fp16-offload.png`, fullPage: false })

  // keyboard: arrow keys move precision
  await p.focus('[role=radio][aria-checked=true] >> nth=0')
  await p.keyboard.press('ArrowRight')
  await p.waitForTimeout(200)
  ok((await p.getAttribute('[role=radiogroup][aria-label="Weight precision"] [aria-checked=true]', 'role')) === 'radio' &&
     (await p.textContent('[role=radiogroup][aria-label="Weight precision"] [aria-checked=true]')).trim() === 'BF16', 'ArrowRight moves FP16 → BF16')

  // validation: KV heads that don't divide heads
  await p.click('button[aria-controls=arch-fields]').catch(() => {})
  const kvHeadsVisible = await p.isVisible('#f-kv-heads')
  if (!kvHeadsVisible) await p.click('button[aria-controls=arch-fields]')
  await p.fill('#f-kv-heads', '7')
  await p.waitForTimeout(300)
  ok(await p.isVisible('text=Attention heads must be a multiple of KV heads.'), 'invalid KV heads shows field error')
  ok(await p.isVisible('text=Fix the highlighted architecture fields'), 'results replaced by fix-fields message')
  ok((await p.inputValue('#model-preset')) === 'custom', 'editing architecture switches to Custom')
  await p.screenshot({ path: `${OUT}/interaction-vram-validation.png`, fullPage: false })
  await p.fill('#f-kv-heads', 'abc').catch(() => {})
  await p.fill('#f-layers', '0')
  await p.waitForTimeout(200)
  ok(await p.isVisible('text=Enter 1–512.'), 'out-of-range layers rejected at input')

  // shared link reproduces state (SSR)
  const p2 = await ctx.newPage()
  await p2.goto(BASE + '/tools/vram-calculator?m=qwen2.5-32b&q=Q4_K_M&gpu=rtx-3060-12&ctx=32768', { waitUntil: 'networkidle' })
  ok((await p2.inputValue('#model-preset')) === 'qwen2.5-32b', 'shared link sets model')
  ok((await p2.inputValue('#gpu-select')) === 'rtx-3060-12', 'shared link sets GPU')
  ok(await p2.isVisible('text=Needs CPU offload'), 'Qwen2.5 32B on a 3060 needs offload')
  const bad = await ctx.newPage()
  await bad.goto(BASE + '/tools/vram-calculator?m=nope&q=Q9&ctx=-5&n=abc&gpu=x', { waitUntil: 'networkidle' })
  ok((await bad.inputValue('#model-preset')) === 'llama-3.1-8b' && (await bad.inputValue('#gpu-select')) === 'rtx-3090', 'unknown model/GPU ids fall back to defaults')
  ok(/[0-9.]+ GB/.test(await bad.textContent('#result-h + p')), 'garbage numbers are clamped, results still render')
  await p2.close(); await bad.close()

  // ── KV cache
  await p.goto(BASE + '/tools/kv-cache-calculator?m=llama-3.1-8b', { waitUntil: 'networkidle' })
  await p.click('button:has-text("Reset")')
  await p.waitForTimeout(300)
  ok(/1\.00 GB/.test(await p.textContent('main, body')), 'Llama 3.1 8B 8K FP16 KV = 1.00 GB')
  await p.click('[role=radiogroup][aria-label="Context length"] >> text=128K')
  await p.click('[role=radiogroup][aria-label="KV cache precision"] >> text=FP8')
  await p.waitForTimeout(300)
  ok(/8\.00 GB/.test(await p.textContent('body')), '128K at FP8 = 8.00 GB')
  await p.screenshot({ path: `${OUT}/interaction-kv-128k-fp8.png`, fullPage: false })

  // ── GPU comparison: add a custom GPU, toggle count
  await p.goto(BASE + '/tools/gpu-comparison', { waitUntil: 'networkidle' })
  await p.click('button:has-text("Reset")')
  await p.click('button:has-text("Add GPU")')
  ok(await p.isVisible('text=Give the GPU a name.'), 'custom GPU requires a name')
  await p.fill('#custom-name', 'RTX A4000 16GB')
  await p.fill('#f-custom-vram', '16').catch(async () => p.fill('#custom-vram', '16'))
  await p.click('button:has-text("Add GPU")')
  await p.waitForTimeout(300)
  ok((await p.locator('article h3:has-text("RTX A4000 16GB")').count()) === 1, 'custom GPU appears as a comparison card')
  await p.locator('[role=radiogroup][aria-label="Number of RTX 3060 12GB"] >> text=×2').click()
  await p.waitForTimeout(300)
  ok((await p.locator('article h3:has-text("2× RTX 3060 12GB")').count()) === 1, '×2 creates a 2-GPU configuration')
  await p.screenshot({ path: `${OUT}/interaction-gpu-custom-and-multi.png`, fullPage: true })
  await p.reload({ waitUntil: 'networkidle' })
  await p.waitForTimeout(500)
  ok((await p.locator('label:has-text("RTX A4000 16GB")').count()) === 1, 'custom GPU persists after reload (localStorage)')

  // ── Projects: search, filter, empty state, table
  await p.goto(BASE + '/projects/overview', { waitUntil: 'networkidle' })
  await p.fill('#project-search', 'temporal')
  await p.waitForTimeout(300)
  const n = await p.locator('main ul > li h2, ul.grid > li h2').count()
  ok(n >= 2 && n < 7, `search "temporal" narrows results (${n})`)
  await p.fill('#project-search', 'zzzz-nothing')
  await p.waitForTimeout(300)
  ok(await p.isVisible('text=No projects match these filters'), 'empty state shown')
  await p.screenshot({ path: `${OUT}/interaction-projects-empty-state.png`, fullPage: false })
  await p.click('button:has-text("Clear filters") >> nth=0')
  await p.selectOption('#project-category', 'SaaS')
  await p.click('[role=radio]:has-text("Table")')
  await p.waitForTimeout(300)
  ok(/category=SaaS/.test(p.url()) && /view=table/.test(p.url()), 'filters reflected in URL')
  ok((await p.locator('table tbody tr').count()) === 5, 'SaaS filter shows 5 projects in table')
  await p.screenshot({ path: `${OUT}/interaction-projects-table-saas.png`, fullPage: false })
  await p.goto(BASE + '/projects/overview?status=In%20Progress', { waitUntil: 'networkidle' })
  ok((await p.locator('ul.grid > li').count()) === 5, 'status filter from URL renders server-side')
  await p.click('ul.grid > li a >> nth=0')
  await p.waitForLoadState('networkidle')
  ok(/\/projects\//.test(p.url()) && (await p.waitForSelector('#facts-h', { timeout: 10000 }).then(() => true, () => false)), `card navigates to detail (${p.url()})`)

  // ── Theme toggle is a keyboard-focusable button
  await p.goto(BASE + '/', { waitUntil: 'networkidle' })
  ok((await p.locator('button[aria-label="Toggle dark mode"]').count()) >= 1, 'theme toggle is a button with a label')

  ok(errors.length === 0, `no page errors (${errors.slice(0, 3).join(' | ')})`)
  await b.close()
  console.log(fails ? `${fails} FAILED` : 'ALL PASSED')
  process.exit(fails ? 1 : 0)
})()
