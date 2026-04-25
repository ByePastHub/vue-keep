<script setup lang="ts"></script>

<template>
  <div class="profile-page">
    <div class="avatar">U</div>
    <h2>用户中心</h2>
    <div class="menu">
      <div class="menu-item">我的订单</div>
      <div class="menu-item">收货地址</div>
      <div class="menu-item">设置</div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  padding: 40px 16px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #42b883;
  color: #fff;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}
h2 {
  margin-bottom: 24px;
}
.menu {
  text-align: left;
}
.menu-item {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
}
.menu-item:active {
  background: #f0f0f0;
}
</style>
