<script setup lang="ts">
import { useKeepRouter } from '@bye_past/vue-keep'
import { useRoute } from 'vue-router'

const keepRouter = useKeepRouter()
const route = useRoute()

const tabs = [
  { key: 'home', path: '/', label: '首页' },
  { key: 'cart', path: '/cart', label: '购物车' },
  { key: 'profile', path: '/profile', label: '我的' },
]

function switchTo(path: string) {
  keepRouter.switchTab(path)
}
</script>

<template>
  <div class="tab-layout">
    <main class="tab-content">
      <KeepRouterView />
    </main>
    <nav class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-item', { active: route.path === tab.path }]"
        @click="switchTo(tab.path)"
      >
        {{ tab.label }}
      </button>
    </nav>
  </div>
</template>

<style scoped>
.tab-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.tab-content {
  flex: 1;
  padding-bottom: 50px;
}
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 414px;
  display: flex;
  background: #fff;
  border-top: 1px solid #eee;
  z-index: 100;
}
.tab-item {
  flex: 1;
  padding: 8px 0;
  border: none;
  background: none;
  font-size: 12px;
  color: #999;
  cursor: pointer;
}
.tab-item.active {
  color: #42b883;
  font-weight: bold;
}
</style>
