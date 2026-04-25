<script setup lang="ts">
import { useKeepRouter } from '@bye_past/vue-keep'
import FeatureCard from '../../components/FeatureCard.vue'

const keepRouter = useKeepRouter()

const features = [
  {
    icon: '📚',
    title: '导航栈可视化',
    desc: 'push / back / replace / reLaunch 实时栈变化',
    path: '/nav/stack',
    color: '#3b82f6',
  },
  {
    icon: '📜',
    title: '滚动恢复',
    desc: '长列表 → 详情 → 返回，位置自动恢复',
    path: '/scroll/list',
    color: '#10b981',
  },
  {
    icon: '🎬',
    title: '动画预设',
    desc: 'slide / fade / zoom 方向感知切换',
    path: '/animation',
    color: '#8b5cf6',
  },
  {
    icon: '📡',
    title: 'EventChannel',
    desc: '页面间数据传递，类似微信小程序',
    path: '/channel',
    color: '#f59e0b',
  },
  {
    icon: '🔒',
    title: '缓存控制',
    desc: 'constCache / destroy / LRU 淘汰',
    path: '/cache',
    color: '#ef4444',
  },
  {
    icon: '📑',
    title: 'Tab 切换',
    desc: 'switchTab 保持各 Tab 独立子栈',
    path: '/tabs',
    color: '#06b6d4',
  },
  {
    icon: '🔄',
    title: '生命周期',
    desc: 'onPageShow / onPageHide 可视化日志',
    path: '/lifecycle',
    color: '#ec4899',
  },
]
</script>

<template>
  <div class="home-page page">
    <div class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <div class="logo">VK</div>
        <h1 class="hero-title">Vue Keep</h1>
        <p class="hero-subtitle">页面缓存库 · 复刻微信小程序页面栈体验</p>
        <div class="hero-tags">
          <span class="tag">gzip &lt; 5KB</span>
          <span class="tag">TypeScript</span>
          <span class="tag">Vue 3</span>
        </div>
      </div>
    </div>

    <div class="features-section">
      <div class="section-label">功能演示</div>
      <div class="features-list">
        <FeatureCard
          v-for="f in features"
          :key="f.path"
          :icon="f.icon"
          :title="f.title"
          :desc="f.desc"
          :color="f.color"
          @click="keepRouter.push(f.path)"
        />
      </div>
    </div>

    <div class="footer">
      <p>点击右下角 📊 按钮查看实时调试面板</p>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  padding-bottom: 40px;
}

.hero {
  position: relative;
  padding: 48px 24px 32px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border-radius: 0 0 32px 32px;
}

.hero-content {
  position: relative;
  text-align: center;
  color: white;
}

.logo {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -1px;
}

.hero-title {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 6px;
}

.hero-subtitle {
  font-size: 14px;
  opacity: 0.85;
  margin-bottom: 16px;
}

.hero-tags {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.tag {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.18);
  font-size: 12px;
  font-weight: 500;
}

.features-section {
  padding: 0 16px;
  margin-top: 24px;
}

.section-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer {
  text-align: center;
  padding: 32px 16px 0;
  color: var(--color-text-muted);
  font-size: 13px;
}
</style>
