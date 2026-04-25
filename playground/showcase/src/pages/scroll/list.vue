<script setup lang="ts">
import { ref } from 'vue'
import { useKeepRouter, onPageShow } from '@bye_past/vue-keep'
import AppHeader from '../../components/AppHeader.vue'
import GuideTip from '../../components/GuideTip.vue'
import FeatureBadge from '../../components/FeatureBadge.vue'

const keepRouter = useKeepRouter()
const showCount = ref(0)
const lastDirection = ref('-')

const items = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  title: `商品 ${i + 1}`,
  price: Math.floor(Math.random() * 800 + 50),
  color: `hsl(${(i * 17) % 360}, 65%, 72%)`,
}))

onPageShow((ctx) => {
  showCount.value++
  lastDirection.value = ctx.direction
})
</script>

<template>
  <div class="page page-with-header">
    <AppHeader title="滚动恢复" />

    <GuideTip
      text="向下滚动列表，点击任意商品进入详情，然后点返回 — 滚动位置会自动恢复到之前的位置。"
    />

    <div class="status-bar">
      <FeatureBadge :label="`onPageShow × ${showCount}`" color="var(--color-info)" />
      <FeatureBadge :label="`方向: ${lastDirection}`" color="var(--color-accent)" />
    </div>

    <div class="product-grid">
      <div
        v-for="item in items"
        :key="item.id"
        class="product-card card"
        @click="keepRouter.push(`/scroll/detail/${item.id}`)"
      >
        <div class="product-img" :style="{ background: item.color }">
          {{ item.title.charAt(0) }}{{ item.id }}
        </div>
        <div class="product-info">
          <div class="product-title">{{ item.title }}</div>
          <div class="product-price">¥{{ item.price }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-bar {
  display: flex;
  gap: 8px;
  padding: 0 16px;
  margin-bottom: 12px;
}

.product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 0 16px;
}

.product-card {
  cursor: pointer;
  transition: transform 0.15s;
  overflow: hidden;
}

.product-card:active {
  transform: scale(0.97);
}

.product-img {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
}

.product-info {
  padding: 10px 12px;
}

.product-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.product-price {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-danger);
}
</style>
