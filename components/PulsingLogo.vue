<template>
  <div ref="root" class="logo-container" aria-hidden="true">
    <!-- Inline SVG for draw-in animation -->
    <svg
      ref="svg"
      class="logo-svg"
      width="120"
      height="140"
      viewBox="0 0 120 140"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Logo"
    >
        <defs>
          <linearGradient id="boxGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#a0e9ff" />
            <stop offset="100%" stop-color="#1e6fb8" />
          </linearGradient>
        </defs>
  <g ref="group" stroke-linecap="round" stroke-linejoin="round">
          <!-- Background box (drawn first) -->
          <!-- path used so getTotalLength works consistently -->
          <!-- extended vertically to create a taller rectangle -->
          <path ref="boxPath" class="stroke-box" d="M18 10 H102 V130 H18 Z" />
          <!-- extra overlay path used to draw a thicker border after letters finish -->
          <path ref="boxBorderPath" class="stroke-box-border" d="M18 10 H102 V130 H18 Z" />
          <!-- Letter D and J as text (Impact) — revealed with a scaleX clip-like animation -->
          <g ref="dGroup" class="d-group" transform="translate(0,0)">
            <!-- D placed left of center (center x = 60) -->
            <text ref="dText" class="text-d" x="52" y="76" dominant-baseline="middle" text-anchor="middle" fill="#08306b">D</text>
          </g>
          <g ref="jGroup" class="j-group" transform="translate(0,0)">
            <!-- J placed right of center (center x = 60) -->
            <text ref="jText" class="text-j" x="80" y="76" dominant-baseline="middle" text-anchor="middle" fill="#08306b">J</text>
          </g>
        </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const root = ref(null)
const svg = ref(null)
const group = ref(null)
 const boxPath = ref(null)
 const boxBorderPath = ref(null)
 const dGroup = ref(null)
 const jGroup = ref(null)
 const dText = ref(null)
 const jText = ref(null)
let tl = null
let gsapLib = null
const emit = defineEmits(['drawDone'])

onMounted(async () => {
  // Respect reduced motion
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) {
    // Make strokes/text visible (final state) and notify parent immediately
    if (boxPath.value) {
      boxPath.value.style.visibility = 'visible'
      boxPath.value.style.fillOpacity = 1
    }
    if (boxBorderPath.value) {
      boxBorderPath.value.style.visibility = 'visible'
      boxBorderPath.value.style.strokeDashoffset = 0
    }
    if (dGroup.value && dText.value) {
      dGroup.value.style.visibility = 'visible'
      dGroup.value.style.transform = 'scaleX(1)'
      dText.value.style.fill = '#ffffff'
    }
    if (jGroup.value && jText.value) {
      jGroup.value.style.visibility = 'visible'
      jGroup.value.style.transform = 'scaleX(1)'
      jText.value.style.fill = '#ffffff'
    }
    emit('drawDone')
    return
  }

  try {
    const mod = await import('gsap')
    gsapLib = mod.gsap || mod.default || mod


    // prepare box for draw animation (D/J will be revealed with scaleX)
    const elements = [boxPath.value].filter(Boolean)
    elements.forEach((p) => {
      const len = p.getTotalLength()
      p.style.strokeDasharray = len
      p.style.strokeDashoffset = len
      p.style.visibility = 'visible'
    })

    // prepare D/J groups for reveal using GSAP so they render and animate reliably
    const revealGroups = [dGroup.value, jGroup.value].filter(Boolean)
    if (revealGroups.length) {
      // ensure they're in a known starting state (scaleX: 0) and hidden
      // we'll make them visible (opacity:1) in the timeline right before animating
      gsapLib.set(revealGroups, { scaleX: 0, transformOrigin: 'center center', opacity: 0 })
    }

    // prepare border overlay for later tracing (hidden until letters complete)
    if (boxBorderPath.value) {
      const lenB = boxBorderPath.value.getTotalLength()
      boxBorderPath.value.style.strokeDasharray = lenB
      boxBorderPath.value.style.strokeDashoffset = lenB
      boxBorderPath.value.style.visibility = 'hidden'
    }

    // ensure the box fill is initially transparent
    if (boxPath.value) boxPath.value.style.fillOpacity = 0

    tl = gsapLib.timeline()
    // draw box first, then fade its fill, then draw D and J
    tl.to(boxPath.value, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out' })
      .to(boxPath.value, { fillOpacity: 1, duration: 0.45, ease: 'power1.out' }, '+=0.05')
  // reveal groups (make them visible) then animate the left-to-right scale reveal
  .set(revealGroups, { opacity: 1 })
  .to(dGroup.value, { scaleX: 1, transformOrigin: 'center center', duration: 1.1, ease: 'power2.out' }, '-=0.2')
  .to(jGroup.value, { scaleX: 1, transformOrigin: 'center center', duration: 0.9, ease: 'power2.out' }, '-=0.45')

    // small pop after draw
    tl.to(group.value, { scale: 1.04, duration: 0.18, yoyo: true, repeat: 1, ease: 'power1.inOut' }, '+=0.05')

  // after drawn, make the letters white so they read as finished
  tl.to([dText.value, jText.value], { fill: '#ffffff', duration: 0.18, ease: 'power1.out' }, '+=0.05')

    // trace a thicker border along the box edge so it becomes a stronger accent
    if (boxBorderPath.value) {
      // reveal the overlay path then draw it
      tl.call(() => { boxBorderPath.value.style.visibility = 'visible' }, null, '+=0.05')
      tl.to(boxBorderPath.value, { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out' }, '+=0.06')
    }

    // emit when draw timeline completes
    tl.eventCallback('onComplete', () => emit('drawDone'))
  } catch (e) {
    // fallback: reveal strokes and notify parent
    if (boxPath.value) {
      boxPath.value.style.visibility = 'visible'
      boxPath.value.style.fillOpacity = 1
    }
    if (boxBorderPath.value) {
      boxBorderPath.value.style.visibility = 'visible'
      boxBorderPath.value.style.strokeDashoffset = 0
    }
    if (dGroup.value && dText.value) {
      dGroup.value.style.visibility = 'visible'
      dGroup.value.style.transform = 'scaleX(1)'
      dText.value.style.fill = '#ffffff'
    }
    if (jGroup.value && jText.value) {
      jGroup.value.style.visibility = 'visible'
      jGroup.value.style.transform = 'scaleX(1)'
      jText.value.style.fill = '#ffffff'
    }
    emit('drawDone')
  }
})

onBeforeUnmount(() => {
  if (tl) tl.kill()
  if (gsapLib) {
    try {
      gsapLib.killTweensOf([group.value, boxPath.value, boxBorderPath.value, dGroup.value, jGroup.value, dText.value, jText.value])
    } catch (e) {}
  }
})
</script>

<style scoped>
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.logo-svg {
  display: block;
  width: 110px;
  height: auto; /* preserve SVG aspect ratio so vertical layout isn't squashed */
}

.stroke-d {
  stroke: currentColor;
  visibility: hidden; /* revealed by JS */
}

.stroke-j {
  stroke: #f97316; /* accent color */
  stroke-linecap: round;
  stroke-linejoin: round;
  visibility: hidden; /* revealed by JS */
}

.stroke-box {
  stroke: #08306b; /* dark blue border */
  stroke-width: 3;
  fill: url(#boxGrad);
  fill-opacity: 0; /* animated in */
  visibility: hidden;
}

.stroke-box-border {
  stroke: #04294f; /* darker blue border overlay */
  stroke-width: 6;
  fill: none;
  visibility: hidden;
}

.text-d {
  font-family: Impact, 'Arial Black', sans-serif;
  font-size: 72px;
  font-weight: 900;
  fill: #08306b; /* start dark, will transition to white */
  dominant-baseline: middle;
}

.text-j {
  font-family: Impact, 'Arial Black', sans-serif;
  font-size: 72px;
  font-weight: 900;
  fill: #08306b; /* start dark (match D), will transition to white */
  dominant-baseline: middle;
}

.d-group,
.j-group {
  /* Ensure SVG transforms use the element bounding box and origin is the left center for a wipe effect */
  transform-box: fill-box;
  transform-origin: left center;
  opacity: 0; /* hidden by default so DJ is not visible on load */
}
</style>

