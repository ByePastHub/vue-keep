<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useKeepRouter } from '@bye_past/vue-keep'

const route = useRoute()
const keepRouter = useKeepRouter()
const count = ref(1)
</script>

<template>
  <div class="detail-page">
    <header class="header">
      <button @click="keepRouter.back()">返回</button>
      <span>商品详情</span>
    </header>
    <div class="content">
      <div class="image">商品 #{{ route.params.id }}</div>
      <div class="info">
        <h2>商品 {{ route.params.id }} 详情</h2>
        <div class="price">¥2999</div>
        <p class="desc">这是一个演示商品，展示 Vue Keep 的页面缓存和滚动恢复功能。</p>
      </div>
      <div class="actions">
        <div class="qty">
          <button @click="count = Math.max(1, count - 1)">-</button>
          <span>{{ count }}</span>
          <button @click="count++">+</button>
        </div>
        <button class="buy-btn" @click="keepRouter.push('/checkout')">立即购买</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #fff;
}
.header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}
.header button {
  padding: 4px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}
.image {
  height: 300px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #999;
}
.info {
  padding: 16px;
}
.info h2 {
  margin-bottom: 8px;
}
.price {
  color: #e4393c;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
}
.desc {
  color: #666;
  line-height: 1.6;
}
.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-top: 1px solid #eee;
}
.qty {
  display: flex;
  align-items: center;
  gap: 12px;
}
.qty button {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 16px;
}
.buy-btn {
  padding: 10px 32px;
  background: #e4393c;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
