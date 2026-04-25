<script setup lang="ts">
import { ref } from 'vue'
import { useKeepRouter, useEventChannel } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()
const channel = useEventChannel()

const form = ref({
  name: '',
  phone: '',
  detail: '',
})

function save() {
  if (!form.value.name || !form.value.phone || !form.value.detail) {
    alert('请填写完整信息')
    return
  }
  channel.emit('onSave', { ...form.value })
  keepRouter.back()
}
</script>

<template>
  <div class="address-page">
    <header class="header">
      <button @click="keepRouter.back()">取消</button>
      <span>编辑地址</span>
      <button class="save-btn" @click="save">保存</button>
    </header>
    <div class="form">
      <div class="field">
        <label>姓名</label>
        <input v-model="form.name" placeholder="请输入收货人姓名" />
      </div>
      <div class="field">
        <label>手机号</label>
        <input v-model="form.phone" placeholder="请输入手机号" />
      </div>
      <div class="field">
        <label>详细地址</label>
        <input v-model="form.detail" placeholder="请输入详细地址" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.address-page {
  min-height: 100vh;
  background: #f5f5f5;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
.save-btn {
  background: #42b883 !important;
  color: #fff;
  border: none !important;
}
.form {
  padding: 12px;
}
.field {
  background: #fff;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 8px;
}
.field label {
  display: block;
  font-size: 13px;
  color: #999;
  margin-bottom: 4px;
}
.field input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 4px 0;
}
</style>
