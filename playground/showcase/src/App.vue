<script setup lang="ts">
import DebugPanel from './components/DebugPanel.vue'
</script>

<template>
  <div class="app-shell">
    <KeepRouterView />
    <DebugPanel />
  </div>
</template>

<style scoped>
.app-shell {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}
</style>
