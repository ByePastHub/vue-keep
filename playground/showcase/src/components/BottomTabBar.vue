<script setup lang="ts">
import { useKeepRouter } from '@bye_past/vue-keep'
import { useRoute } from 'vue-router'

const keepRouter = useKeepRouter()
const route = useRoute()

const tabs = [
  { key: 'home', path: '/tabs', label: '首页', icon: '🏠' },
  { key: 'explore', path: '/tabs/explore', label: '发现', icon: '🔍' },
  { key: 'profile', path: '/tabs/profile', label: '我的', icon: '👤' },
]

// 切换到底部 Tab 页面
async function switchTo(path: string) {
  await keepRouter.switchTab(path)
}
</script>

<template>
  <nav class="tab-bar">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      :class="['tab-item', { active: route.path === tab.path }]"
      @click="switchTo(tab.path)"
    >
      <span class="tab-icon">{{ tab.icon }}</span>
      <span class="tab-label">{{ tab.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  height: 56px;
  display: flex;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  background: none;
  color: var(--color-text-muted);
  transition: color 0.2s;
}

.tab-item.active {
  color: var(--color-primary);
}

.tab-icon {
  font-size: 20px;
}

.tab-label {
  font-size: 10px;
  font-weight: 500;
}
</style>
