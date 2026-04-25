<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useKeepRouter } from '@bye_past/vue-keep'
import AppHeader from '../../components/AppHeader.vue'

const route = useRoute()
const keepRouter = useKeepRouter()
const presetName =
  typeof route.meta.keep?.transition === 'string' ? route.meta.keep.transition : 'slide'
</script>

<template>
  <div class="page page-with-header">
    <AppHeader title="动画子页面" />

    <div class="content">
      <div class="anim-visual">
        <div class="circle"></div>
      </div>
      <h2>动画效果演示</h2>
      <p>
        你刚才看到的是 <strong>{{ presetName }}</strong> 预设的前进动画。
      </p>
      <p>点击返回按钮，会看到反向的后退动画。</p>

      <button
        class="btn btn-primary"
        style="width: 100%; margin-top: 24px"
        @click="keepRouter.back()"
      >
        ← 返回（观察后退动画）
      </button>
    </div>
  </div>
</template>

<style scoped>
.content {
  padding: 24px 16px;
  text-align: center;
}

.anim-visual {
  width: 120px;
  height: 120px;
  margin: 20px auto 24px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--color-primary), #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
}

h2 {
  font-size: 20px;
  margin-bottom: 8px;
}

p {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 4px;
}
</style>
