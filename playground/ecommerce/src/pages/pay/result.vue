<script setup lang="ts">
import { useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()
</script>

<template>
  <div class="result-page">
    <div class="icon">✓</div>
    <h2>支付成功</h2>
    <p>订单已提交，感谢您的购买</p>
    <button class="btn-primary" @click="keepRouter.reLaunch('/')">回到首页</button>
  </div>
</template>

<style scoped>
.result-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #fff;
}
.icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #42b883;
  color: #fff;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
h2 {
  margin-bottom: 8px;
}
p {
  color: #666;
  margin-bottom: 32px;
}
.btn-primary {
  padding: 12px 40px;
  background: #42b883;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
</style>
