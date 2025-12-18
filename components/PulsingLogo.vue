<template>
  <div class="logo-container">
    <img src="/img/logo.png" alt="Logo" class="pulsing-logo" />
  </div>
</template>

<style scoped>
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.pulsing-logo {
  width: 100px;
  height: auto;
  animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>
