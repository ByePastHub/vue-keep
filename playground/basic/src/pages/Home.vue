<script setup lang="ts">
import { useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()
</script>

<template>
  <div class="home">
    <h1>Vue Keep Demo</h1>
    <p>页面缓存库，复刻微信小程序页面栈体验</p>
    <button @click="keepRouter.push('/list')">进入列表页</button>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
}
h1 {
  margin-bottom: 10px;
}
p {
  color: #666;
  margin-bottom: 20px;
}
button {
  padding: 10px 24px;
  background: #42b883;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}
</style>
