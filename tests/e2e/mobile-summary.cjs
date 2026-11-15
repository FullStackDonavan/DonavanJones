// Browser check for the sticky mobile results bar on the /tools calculators.
//   npm run dev -- --port 3333
//   The repo's own playwright install is broken (BrowserType is not a constructor),
//   so run a copy from a folder with a working playwright-core:
//   mkdir /tmp/e2e && cd /tmp/e2e && npm i playwright-core@1.49.1 && cp <repo>/tests/e2e/mobile-summary.cjs .
//   cd <repo> && node /tmp/e2e/mobile-summary.cjs
// Env: BASE (default http://localhost:3333), CHROME (path to chrome.exe)
const { chromium } = require('playwright-core')
let fails = 0
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ }
;(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe' })
  const errors = []
  for (const [vp, w, h] of [['mobile', 390, 844], ['tablet', 834, 1112], ['desktop', 1440, 900]]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, colorScheme: 'dark' })
    p.on('pageerror', (e) => errors.push(e.message))
    for (const path of ['/tools/vram-calculator', '/tools/kv-cache-calculator', '/tools/gpu-comparison']) {
      await p.goto((process.env.BASE || 'http://localhost:3333') + path, { waitUntil: 'networkidle', timeout: 120000 })
      await p.waitForTimeout(600)
      const bar = p.locator('[aria-label="Results summary"]')
      const visible = await bar.isVisible()
      if (vp === 'desktop') { ok(!visible, `${vp} ${path}: bar hidden on desktop`); continue }
      ok(visible, `${vp} ${path}: bar visible at top of page`)
      if (path === '/tools/vram-calculator' && vp === 'mobile') {
        await p.screenshot({ path: `screenshots/after/mobile-sticky-summary-vram.png` })
        // live update
        const before = await bar.textContent()
        await p.click('button:has-text("70B")')
        await p.waitForTimeout(300)
        const after = await bar.textContent()
        ok(before !== after && /Needs CPU offload/.test(after), 'bar updates live (70B → offload)')
        await p.screenshot({ path: `screenshots/after/mobile-sticky-summary-70b.png` })
      }
      await bar.locator("button[aria-label=\"Jump to results\"]").click()
      await p.waitForTimeout(1200)
      ok(!(await bar.isVisible()), `${vp} ${path}: "Results" scrolls to results and bar hides`)
      const focused = await p.evaluate(() => document.activeElement?.id)
      ok(focused === 'results', `${vp} ${path}: focus moved to results`)
      await p.evaluate(() => window.scrollTo(0, 0))
      await p.waitForTimeout(600)
      ok(await bar.isVisible(), `${vp} ${path}: bar returns when scrolled back up`)
    }
    await p.close()
  }
  ok(errors.length === 0, 'no page errors ' + errors.join(' | '))
  await b.close()
  console.log(fails ? fails + ' FAILED' : 'ALL PASSED')
  process.exit(fails ? 1 : 0)
})()
