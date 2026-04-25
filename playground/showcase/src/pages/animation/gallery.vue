<script setup lang="ts">
import { useKeepRouter } from '@bye_past/vue-keep'
import AppHeader from '../../components/AppHeader.vue'
import GuideTip from '../../components/GuideTip.vue'

const keepRouter = useKeepRouter()

const presets = [
  { name: 'slide', label: 'Slide', desc: '前进从右滑入，后退从左滑入', icon: '↔️' },
  { name: 'fade', label: 'Fade', desc: '淡入淡出过渡', icon: '🌫️' },
  { name: 'zoom', label: 'Zoom', desc: '前进放大进入，后退缩小进入', icon: '🔍' },
]

// 进入指定动画预设的子页面
async function tryPreset(name: string) {
  await keepRouter.push(`/animation/sub/${name}`)
}
</script>

<template>
  <div class="page page-with-header">
    <AppHeader title="动画预设" />

    <GuideTip
      text="每张卡片会通过 route meta 覆盖当前页面动画预设。进入子页面观察进入动画，点击返回观察反向动画。"
    />

    <div class="preset-list">
      <div v-for="p in presets" :key="p.name" class="preset-card card" @click="tryPreset(p.name)">
        <div class="preset-icon">{{ p.icon }}</div>
        <div class="preset-body">
          <div class="preset-name">{{ p.label }}</div>
          <div class="preset-desc">{{ p.desc }}</div>
        </div>
        <div class="preset-action">
          <span class="btn btn-sm btn-primary">体验</span>
        </div>
      </div>
    </div>

    <div class="note card" style="margin: 16px">
      <div style="padding: 16px">
        <h3 style="font-size: 14px; margin-bottom: 8px">CSS 预设特性</h3>
        <ul class="note-list">
          <li>方向感知：前进和后退使用不同动画方向</li>
          <li>无障碍：包含 prefers-reduced-motion 媒体查询</li>
          <li>GPU 加速：使用 will-change 和 transform</li>
          <li>首屏跳过：默认不播放首次渲染动画</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preset-list {
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preset-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  cursor: pointer;
  transition: transform 0.15s;
}

.preset-card:active {
  transform: scale(0.98);
}

.preset-icon {
  font-size: 28px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.preset-body {
  flex: 1;
}

.preset-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 2px;
}

.preset-desc {
  font-size: 12px;
  color: var(--color-text-muted);
}

.note-list {
  padding-left: 18px;
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.8;
}
</style>
