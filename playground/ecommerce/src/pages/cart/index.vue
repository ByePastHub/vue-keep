<script setup lang="ts">
import { ref } from 'vue'
import { useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()
const cartItems = ref([
  { id: 1, title: 'iPhone 16 Pro', price: 8999, qty: 1 },
  { id: 2, title: 'AirPods Pro 3', price: 1899, qty: 2 },
])

const total = ref(cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0))
</script>

<template>
  <div class="cart-page">
    <h2 class="title">购物车</h2>
    <div class="cart-list">
      <div v-for="item in cartItems" :key="item.id" class="cart-item">
        <div class="cart-img">{{ item.title.charAt(0) }}</div>
        <div class="cart-info">
          <div>{{ item.title }}</div>
          <div class="cart-bottom">
            <span class="cart-price">¥{{ item.price }}</span>
            <span class="cart-qty">x{{ item.qty }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="cart-footer">
      <span class="cart-total">合计: ¥{{ total }}</span>
      <button class="checkout-btn" @click="keepRouter.push('/checkout')">去结算</button>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  padding: 16px;
  padding-bottom: 120px;
}
.title {
  margin-bottom: 16px;
}
.cart-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.cart-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
}
.cart-img {
  width: 80px;
  height: 80px;
  background: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #999;
  flex-shrink: 0;
}
.cart-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.cart-bottom {
  display: flex;
  justify-content: space-between;
}
.cart-price {
  color: #e4393c;
  font-weight: bold;
}
.cart-qty {
  color: #999;
}
.cart-footer {
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 414px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #eee;
}
.cart-total {
  font-size: 18px;
  font-weight: bold;
  color: #e4393c;
}
.checkout-btn {
  padding: 10px 32px;
  background: #e4393c;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
