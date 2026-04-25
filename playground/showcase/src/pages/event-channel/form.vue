<script setup lang="ts">
import { ref } from 'vue'
import { useKeepRouter, useEventChannel } from '@bye_past/vue-keep'
import AppHeader from '../../components/AppHeader.vue'

const keepRouter = useKeepRouter()
const channel = useEventChannel()

const form = ref({
  name: '',
  email: '',
  message: '',
})

function submit() {
  if (!form.value.name || !form.value.email) {
    alert('请填写姓名和邮箱')
    return
  }
  channel?.emit('onSubmit', { ...form.value })
  keepRouter.back()
}

function cancel() {
  channel?.emit('onCancel')
  keepRouter.back()
}
</script>

<template>
  <div class="page page-with-header">
    <AppHeader title="表单页">
      <template #right>
        <button class="save-btn" @click="submit">提交</button>
      </template>
    </AppHeader>

    <div class="form">
      <div class="field">
        <label>姓名</label>
        <input v-model="form.name" placeholder="请输入姓名" />
      </div>
      <div class="field">
        <label>邮箱</label>
        <input v-model="form.email" type="email" placeholder="请输入邮箱" />
      </div>
      <div class="field">
        <label>留言</label>
        <textarea v-model="form.message" placeholder="请输入留言" rows="4"></textarea>
      </div>

      <div class="actions">
        <button class="btn btn-primary" style="flex: 1" @click="submit">提交并返回</button>
        <button class="btn btn-outline" @click="cancel">取消</button>
      </div>

      <p class="hint">提交后数据通过 <code>channel.emit('onSubmit', data)</code> 传回上一页</p>
    </div>
  </div>
</template>

<style scoped>
.save-btn {
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: none;
}

.form {
  padding: 16px;
}

.field {
  margin-bottom: 16px;
}

.field label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
}

.field input,
.field textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-family: inherit;
  background: var(--color-surface);
  transition: border-color 0.2s;
  outline: none;
}

.field input:focus,
.field textarea:focus {
  border-color: var(--color-primary);
}

.field textarea {
  resize: vertical;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 24px;
}

.hint {
  margin-top: 16px;
  font-size: 12px;
  color: var(--color-text-muted);
  text-align: center;
}

code {
  background: var(--color-bg);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
}
</style>
