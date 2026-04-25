<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useKeepRouter } from '@bye_past/vue-keep'

const route = useRoute()
const keepRouter = useKeepRouter()
</script>

<template>
  <div class="detail-page">
    <header class="header">
      <button @click="keepRouter.back()">返回</button>
      <span>商品详情</span>
    </header>
    <div class="content">
      <div class="image-placeholder">商品图片</div>
      <h2>商品 #{{ route.params.id }}</h2>
      <p>这是商品详情页。点击返回按钮，列表页会恢复到之前的滚动位置。</p>
      <button class="btn" @click="keepRouter.reLaunch('/')">回到首页 (reLaunch)</button>
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
.content {
  padding: 16px;
}
.image-placeholder {
  height: 200px;
  background: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  margin-bottom: 16px;
}
h2 {
  margin-bottom: 12px;
}
p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}
.btn {
  padding: 10px 24px;
  background: #42b883;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
