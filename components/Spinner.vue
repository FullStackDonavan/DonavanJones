<template>
  <div class="spinner"></div>
</template>

<style scoped>
.spinner {
  border: 8px solid rgba(255, 255, 255, 0.3); /* Light gray background */
  border-radius: 50%;
  border-top: 8px solid #ffffff; /* White spinner */
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-top: 10px; /* Space between logo and spinner */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
