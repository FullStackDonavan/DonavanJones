<template>
  <div class="skeleton-door fixed inset-0 z-[140] flex items-center justify-center bg-transparent" role="status" aria-live="polite">
    <!-- logo sits above the doors initially, then fades before doors open -->
    <div :class="['logo-wrap absolute pointer-events-none', { 'logo-hidden': !logoVisible }]">
      <PulsingLogo @draw-done="onLogoDrawn" />
    </div>

    <!-- left and right door panels -->
    <div :class="['door-panel left', { open: isOpen }]" aria-hidden="true"></div>
    <div :class="['door-panel right', { open: isOpen }]" aria-hidden="true"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PulsingLogo from '@/components/PulsingLogo.vue'

const emit = defineEmits(['done'])

const isOpen = ref(false)
const logoVisible = ref(true)
const _logoHandled = ref(false)

// timings for fade and door animation (match CSS transition)
const LOGO_FADE = 350
const ANIM_DURATION = 1200
// additional wait after the draw completes before starting fade/open (ms)
// wait 2 seconds after the draw completes before starting fade/open (ms)
// the sequence is: draw completes -> wait WAIT_AFTER_DRAW -> fade logo -> open doors
const WAIT_AFTER_DRAW = 2000

function onLogoDrawn() {
  if (_logoHandled.value) return
  _logoHandled.value = true

  // wait a bit after the draw completes so the logo can settle / be admired
  setTimeout(() => {
    // fade logo out
    logoVisible.value = false

    // start doors after fade completes
    setTimeout(() => {
      isOpen.value = true

      // emit done when doors finish opening
      setTimeout(() => {
        emit('done')
      }, ANIM_DURATION)
    }, LOGO_FADE)
  }, WAIT_AFTER_DRAW)
}
</script>

<style scoped>
.skeleton-door {
  /* ensure it sits above content while visible */
  pointer-events: auto;
  background: transparent;
}

.logo-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  /* put logo above the doors */
  z-index: 160;
  pointer-events: none;
  transition: opacity 350ms ease, transform 350ms ease;
  opacity: 1;
}

.logo-wrap.logo-hidden {
  opacity: 0;
  transform: scale(0.97);
}

.door-panel {
  position: absolute;
  top: 0;
  height: 100vh;
  width: 50vw;
  background: linear-gradient(180deg, #0f172a 0%, #0b1220 100%);
  box-shadow: 0 10px 30px rgba(2,6,23,0.6);
  z-index: 150;
  transition: transform 1200ms cubic-bezier(.2,.9,.2,1);
}

.door-panel.left {
  left: 0;
  transform: translateX(0);
}

.door-panel.right {
  right: 0;
  transform: translateX(0);
}

/* when .open is applied, panels slide away from center */
.door-panel.left.open {
  transform: translateX(-110%);
}
.door-panel.right.open {
  transform: translateX(110%);
}

/* small visual accent: inner edge shadow */
.door-panel.left::after,
.door-panel.right::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 16px;
  pointer-events: none;
}
.door-panel.left::after {
  right: -8px;
  background: linear-gradient(90deg, rgba(0,0,0,0.35), rgba(0,0,0,0));
}
.door-panel.right::after {
  left: -8px;
  background: linear-gradient(270deg, rgba(0,0,0,0.35), rgba(0,0,0,0));
}

/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .door-panel {
    transition: none !important;
  }
  .door-panel.left.open,
  .door-panel.right.open {
    transform: translateX(120%);
  }
}

</style>
