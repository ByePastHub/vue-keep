<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue'
import BottomTabBar from '../components/BottomTabBar.vue'
</script>

<template>
  <div class="tab-layout">
    <AppHeader title="Tab 切换演示" />
    <main class="tab-content page-with-header">
      <KeepRouterView />
    </main>
    <BottomTabBar />
  </div>
</template>

<style scoped>
.tab-layout {
  min-height: 100vh;
}

.tab-content {
  padding-bottom: 60px;
}
</style>
