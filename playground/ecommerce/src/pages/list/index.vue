<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useKeepRouter, onPageShow } from '@bye_past/vue-keep'

const route = useRoute()
const keepRouter = useKeepRouter()

const items = ref(
  Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    title: `${route.params.category} 商品 ${i + 1}`,
    price: Math.floor(Math.random() * 5000 + 100),
  })),
)

onPageShow((ctx) => {
  if (!ctx.isFirstShow) {
    console.log(`[List] 从详情页返回，方向: ${ctx.direction}`)
  }
})
</script>

<template>
  <div class="list-page">
    <header class="header">
      <button @click="keepRouter.back()">返回</button>
      <span>{{ route.params.category }} 列表</span>
    </header>
    <div class="list">
      <div
        v-for="item in items"
        :key="item.id"
        class="item"
        @click="keepRouter.push(`/detail/${item.id}`)"
      >
        <div class="item-img">{{ item.title.charAt(0) }}</div>
        <div class="item-info">
          <div>{{ item.title }}</div>
          <div class="item-price">¥{{ item.price }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-page {
  min-height: 100vh;
}
.header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #eee;
  z-index: 10;
}
.header button {
  padding: 4px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}
.list {
  padding: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.item {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}
.item:active {
  opacity: 0.8;
}
.item-img {
  height: 120px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #999;
}
.item-info {
  padding: 8px;
}
.item-price {
  color: #e4393c;
  font-weight: bold;
  margin-top: 4px;
}
</style>
