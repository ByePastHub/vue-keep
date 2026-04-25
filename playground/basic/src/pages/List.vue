<script setup lang="ts">
import { ref } from 'vue'
import { useKeepRouter, onPageShow } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()
const items = ref(
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `商品 ${i + 1}`,
    price: Math.floor(Math.random() * 500 + 10),
  })),
)

const showCount = ref(0)

onPageShow((ctx) => {
  showCount.value++
  if (!ctx.isFirstShow) {
    console.log('从详情页返回，滚动位置已恢复')
  }
})
</script>

<template>
  <div class="list-page">
    <header class="header">
      <button @click="keepRouter.back()">返回</button>
      <span>商品列表 (onPageShow: {{ showCount }}次)</span>
    </header>
    <div class="list">
      <div
        v-for="item in items"
        :key="item.id"
        class="item"
        @click="keepRouter.push(`/detail/${item.id}`)"
      >
        <div class="item-title">{{ item.title }}</div>
        <div class="item-price">¥{{ item.price }}</div>
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
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-bottom: 8px;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
}
.item:active {
  background: #f0f0f0;
}
.item-title {
  font-size: 16px;
}
.item-price {
  color: #e4393c;
  font-weight: bold;
}
</style>
