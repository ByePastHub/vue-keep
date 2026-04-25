<script setup lang="ts">
import { ref } from 'vue'
import { useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()

interface Address {
  name: string
  phone: string
  detail: string
}

const address = ref<Address | null>(null)

function selectAddress() {
  keepRouter.push('/address/edit', {
    events: {
      onSave(addr: Address) {
        address.value = addr
      },
    },
  })
}

function pay() {
  keepRouter.reLaunch('/pay/result')
}
</script>

<template>
  <div class="checkout-page">
    <header class="header">
      <button @click="keepRouter.back()">返回</button>
      <span>确认订单</span>
    </header>
    <div class="content">
      <div class="section" @click="selectAddress">
        <h3>收货地址</h3>
        <div v-if="address" class="address-info">
          <div>{{ address.name }} {{ address.phone }}</div>
          <div class="address-detail">{{ address.detail }}</div>
        </div>
        <div v-else class="address-empty">点击选择收货地址 →</div>
      </div>

      <div class="section">
        <h3>商品信息</h3>
        <div class="order-item">
          <span>iPhone 16 Pro x1</span>
          <span class="order-price">¥8999</span>
        </div>
      </div>

      <div class="section">
        <div class="total-row">
          <span>合计</span>
          <span class="total-price">¥8999</span>
        </div>
      </div>

      <button class="pay-btn" @click="pay">提交订单</button>
    </div>
  </div>
</template>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background: #f5f5f5;
}
.header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
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
  padding: 12px;
}
.section {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
}
.section h3 {
  font-size: 15px;
  margin-bottom: 8px;
}
.address-info {
  font-size: 14px;
}
.address-detail {
  color: #666;
  margin-top: 4px;
}
.address-empty {
  color: #999;
}
.order-item {
  display: flex;
  justify-content: space-between;
}
.order-price {
  color: #e4393c;
}
.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
}
.total-price {
  color: #e4393c;
  font-size: 20px;
  font-weight: bold;
}
.pay-btn {
  width: 100%;
  padding: 14px;
  background: #e4393c;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 20px;
}
</style>
