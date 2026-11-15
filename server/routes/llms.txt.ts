import { serverQueryContent } from '#content/server'

const SITE_URL = (process.env.APP_DOMAIN || 'https://donavanjones.com').replace(/\/+$/, '')

// Pillar/hub page for each blog category
const HUBS: Record<string, { title: string; hub: string }> = {
  'ai-homelab-engineering':     { title: 'AI Homelab Engineering', hub: '/systems/ai-homelab' },
  'agentic-ai-systems':         { title: 'Agentic AI Systems', hub: '/systems/agentic-ai' },
  'ai-engineering':             { title: 'AI Engineering', hub: '/systems/ai' },
  'local-vibe-coding':          { title: 'Local Vibe Coding', hub: '/systems/local-vibe-coding' },
  'ai-cost-optimization':       { title: 'AI Cost Optimization', hub: '/systems/ai-homelab' },
  'versehub-engineering':       { title: 'VerseHub Engineering', hub: '/projects/versehub' },
  'infrastructure-engineering': { title: 'Infrastructure Engineering', hub: '/systems/infrastructure' },
  'backend-engineering':        { title: 'Backend Engineering', hub: '/systems/backend' },
  'algorithms':                 { title: 'Algorithms and Data Structures', hub: '/systems/backend' },
}

export default defineEventHandler(async (event) => {
  const docs = await serverQueryContent(event, '/blog')
    .where({ draft: { $ne: true } })
    .only(['_path', 'title', 'description', 'category', 'date'])
    .find()

  const byCat: Record<string, typeof docs> = {}
  for (const d of docs) {
    const c = (Array.isArray(d.category) ? d.category[0] : d.category) || 'other'
    ;(byCat[c] ||= []).push(d)
  }

  const lines: string[] = [
    '# Donavan Jones',
    '',
    '> Full-stack and AI systems engineer in Lakeland, Florida. Builds and operates a self-hosted local AI cluster: a 7-node K3s cluster of 4 Raspberry Pis and 3 NVIDIA Jetson Orin Nano Super 8GB boards, plus an RTX 3090 workstation. It serves RAG, voice (Kokoro TTS, Whisper STT), image generation and agent workflows for VerseHub (https://versehub.app). Writes first-hand about local LLM inference on memory-constrained hardware, agent orchestration with Temporal, LLM output verification, observability, and self-hosted Kubernetes.',
    '',
    'Available for user-research interviews, design-partner/early-tester work, technical advisory and contract engineering with teams building local AI hardware, agent runtimes or inference software.',
    '',
    '## Key pages',
    `- [Local AI infrastructure & agent systems](${SITE_URL}/services/local-ai-infrastructure): what he operates, lessons learned, how to work with him`,
    `- [System overview](${SITE_URL}/system-overview): architecture of the whole platform`,
    `- [LLM VRAM calculator](${SITE_URL}/tools/vram-calculator): GPU memory for a model at FP32–Q2 (effective bits per weight), KV cache and overhead, fit on RTX 3090/3080/3060 or custom GPUs`,
    `- [KV cache calculator](${SITE_URL}/tools/kv-cache-calculator): KV cache by context length, batch and precision (GQA/MQA aware), max context and concurrency per GPU`,
    `- [GPU comparison](${SITE_URL}/tools/gpu-comparison): side-by-side fit, headroom, context capacity and bandwidth decode ceiling`,
    `- [About](${SITE_URL}/about): background and experience`,
    `- [Resume](${SITE_URL}/resume)`,
    `- [Hire me / contact](${SITE_URL}/hire-me)`,
    `- [Kingdom Tools](${SITE_URL}/projects/kingdom-tools): his internal platform for provisioning, drift detection and per-device model management`,
    `- [VerseHub](${SITE_URL}/projects/versehub): production AI Bible-study platform running on the cluster`,
    `- [Jetson model leaderboard](${SITE_URL}/jetson-leaderboard): measured model performance on Jetson Orin Nano Super`,
    '',
  ]

  const order = Object.keys(HUBS)
  const cats = Object.keys(byCat).sort((a, b) => {
    const ia = order.indexOf(a), ib = order.indexOf(b)
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib)
  })

  for (const c of cats) {
    const meta = HUBS[c]
    lines.push(`## ${meta?.title || c}`)
    if (meta) lines.push(`Hub: ${SITE_URL}${meta.hub}`, '')
    const posts = byCat[c].sort((a, b) => String(a._path).localeCompare(String(b._path)))
    for (const p of posts) {
      lines.push(`- [${p.title}](${SITE_URL}${p._path})${p.description ? `: ${p.description}` : ''}`)
    }
    lines.push('')
  }

  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return lines.join('\n')
})
