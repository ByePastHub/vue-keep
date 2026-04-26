<script setup lang="ts">
import { useKeepRouter } from '@bye_past/vue-keep'
import { useRouter } from 'vue-router'

withDefaults(
  defineProps<{
    title: string
    showBack?: boolean
    transparent?: boolean
  }>(),
  {
    showBack: true,
    transparent: false,
  },
)

const keepRouter = useKeepRouter()
const router = useRouter()

// 返回上一页，兜底回到首页
async function goBack() {
  if (window.history.length > 1) {
    keepRouter.back()
    return
  }
  await router.push('/')
}
</script>

<template>
  <header :class="['app-header', { transparent }]">
    <button v-if="showBack" class="back-btn" @click="goBack">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
    <h1 class="title">{{ title }}</h1>
    <div class="right">
      <slot name="right" />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: white;
  z-index: 100;
}

.app-header.transparent {
  background: transparent;
  color: var(--color-text);
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-full);
  color: inherit;
  flex-shrink: 0;
  transition: background 0.2s;
}

.back-btn:active {
  background: rgba(255, 255, 255, 0.25);
}

.transparent .back-btn {
  background: rgba(0, 0, 0, 0.05);
}

.title {
  flex: 1;
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  margin: 0 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.right {
  width: 36px;
  flex-shrink: 0;
}
</style>
