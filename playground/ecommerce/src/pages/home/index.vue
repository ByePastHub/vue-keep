<script setup lang="ts">
import { useKeepRouter, onPageShow } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()

const categories = [
  { id: 'phone', name: '手机', count: 128 },
  { id: 'laptop', name: '笔记本', count: 86 },
  { id: 'headphone', name: '耳机', count: 64 },
  { id: 'tablet', name: '平板', count: 42 },
]

const hotItems = [
  { id: 1, title: 'iPhone 16 Pro', price: 8999 },
  { id: 2, title: 'MacBook Air M4', price: 9499 },
  { id: 3, title: 'AirPods Pro 3', price: 1899 },
]

onPageShow((ctx) => {
  if (ctx.isFirstShow) {
    console.log('[Home] 首次加载')
  } else {
    console.log('[Home] 从缓存恢复')
  }
})
</script>

<template>
  <div class="home">
    <h2 class="section-title">分类</h2>
    <div class="categories">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="cat-card"
        @click="keepRouter.push(`/list/${cat.id}`)"
      >
        <div class="cat-name">{{ cat.name }}</div>
        <div class="cat-count">{{ cat.count }}件</div>
      </div>
    </div>

    <h2 class="section-title">热门推荐</h2>
    <div class="hot-list">
      <div
        v-for="item in hotItems"
        :key="item.id"
        class="hot-item"
        @click="keepRouter.push(`/detail/${item.id}`)"
      >
        <div class="hot-img">{{ item.title.charAt(0) }}</div>
        <div class="hot-info">
          <div class="hot-title">{{ item.title }}</div>
          <div class="hot-price">¥{{ item.price }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 16px;
}
.section-title {
  font-size: 18px;
  margin: 16px 0 12px;
}
.section-title:first-child {
  margin-top: 0;
}
.categories {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.cat-card {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
}
.cat-card:active {
  background: #f0f0f0;
}
.cat-name {
  font-size: 16px;
  font-weight: 500;
}
.cat-count {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
.hot-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.hot-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
}
.hot-item:active {
  background: #f0f0f0;
}
.hot-img {
  width: 80px;
  height: 80px;
  background: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #999;
  flex-shrink: 0;
}
.hot-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.hot-title {
  font-size: 15px;
}
.hot-price {
  color: #e4393c;
  font-weight: bold;
}
</style>
