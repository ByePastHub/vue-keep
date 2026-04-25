<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useKeepRouter } from '@bye_past/vue-keep'
import AppHeader from '../../components/AppHeader.vue'

const route = useRoute()
const keepRouter = useKeepRouter()
const id = route.params.id
const color = `hsl(${(Number(id) * 17) % 360}, 65%, 72%)`
</script>

<template>
  <div class="page page-with-header">
    <AppHeader :title="`商品 #${id}`" />

    <div class="detail-hero" :style="{ background: color }">
      <span class="hero-text">商品 {{ id }}</span>
    </div>

    <div class="detail-body">
      <h2>商品 {{ id }} 详情</h2>
      <p class="price">¥{{ Math.floor(Math.random() * 800 + 50) }}</p>
      <p class="desc">
        这是商品详情页。点击左上角返回按钮，列表页会恢复到之前的滚动位置。 Vue Keep
        使用三层防御策略恢复滚动：nextTick → ResizeObserver → 超时兜底。
      </p>

      <div class="info-card card">
        <div class="info-row">
          <span class="info-label">页面 ID</span>
          <span class="info-value">{{ id }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">路由</span>
          <span class="info-value">/scroll/detail/{{ id }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">滚动恢复</span>
          <span class="info-value">返回时自动恢复</span>
        </div>
      </div>

      <button
        class="btn btn-primary"
        style="width: 100%; margin-top: 16px"
        @click="keepRouter.back()"
      >
        ← 返回列表（观察滚动恢复）
      </button>
    </div>
  </div>
</template>

<style scoped>
.detail-hero {
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-text {
  font-size: 32px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.7);
}

.detail-body {
  padding: 20px 16px;
}

h2 {
  font-size: 20px;
  margin-bottom: 6px;
}

.price {
  font-size: 24px;
  font-weight: 800;
  color: var(--color-danger);
  margin-bottom: 12px;
}

.desc {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: 20px;
}

.info-card {
  padding: 4px 0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid var(--color-border);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 13px;
  color: var(--color-text-muted);
}

.info-value {
  font-size: 13px;
  font-weight: 500;
}
</style>
