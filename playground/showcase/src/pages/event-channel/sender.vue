<script setup lang="ts">
import { ref } from 'vue'
import { useKeepRouter, onPageShow } from '@bye_past/vue-keep'
import AppHeader from '../../components/AppHeader.vue'
import GuideTip from '../../components/GuideTip.vue'

const keepRouter = useKeepRouter()

interface FormData {
  name: string
  email: string
  message: string
}

const receivedData = ref<FormData | null>(null)
const receiveCount = ref(0)

onPageShow((ctx) => {
  if (!ctx.isFirstShow) {
    // 从表单页返回
  }
})

function openForm() {
  keepRouter.push('/channel/form', {
    events: {
      onSubmit(data: FormData) {
        receivedData.value = data
        receiveCount.value++
      },
      onCancel() {
        receivedData.value = null
      },
    },
  })
}
</script>

<template>
  <div class="page page-with-header">
    <AppHeader title="EventChannel" />

    <GuideTip
      text="点击「打开表单」按钮，在表单页填写数据并提交。数据会通过 EventChannel 传回本页面，无需全局状态管理。"
    />

    <div class="content">
      <button class="btn btn-primary open-btn" @click="openForm">📝 打开表单页</button>

      <div v-if="receivedData" class="result-card card">
        <div class="result-header">
          <span class="result-title">收到数据</span>
          <span class="result-count">第 {{ receiveCount }} 次</span>
        </div>
        <div class="result-body">
          <div class="result-row">
            <span class="result-label">姓名</span>
            <span class="result-value">{{ receivedData.name }}</span>
          </div>
          <div class="result-row">
            <span class="result-label">邮箱</span>
            <span class="result-value">{{ receivedData.email }}</span>
          </div>
          <div class="result-row">
            <span class="result-label">留言</span>
            <span class="result-value">{{ receivedData.message }}</span>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📡</div>
        <p>尚未收到数据</p>
        <p class="empty-hint">点击上方按钮打开表单页</p>
      </div>

      <div class="code-hint card" style="margin-top: 16px">
        <div style="padding: 16px">
          <h3 style="font-size: 14px; margin-bottom: 8px">工作原理</h3>
          <p style="font-size: 13px; color: var(--color-text-secondary); line-height: 1.6">
            源页面通过 <code>keepRouter.push(path, { events: { ... } })</code> 注册监听器，
            目标页面通过 <code>useEventChannel().emit('onSubmit', data)</code> 发送数据。 Channel
            在页面销毁时自动清理。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content {
  padding: 0 16px;
}

.open-btn {
  width: 100%;
  padding: 14px;
  font-size: 16px;
}

.result-card {
  margin-top: 16px;
  overflow: hidden;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: color-mix(in srgb, var(--color-success) 8%, transparent);
  border-bottom: 1px solid var(--color-border);
}

.result-title {
  font-weight: 600;
  color: var(--color-success);
}

.result-count {
  font-size: 12px;
  color: var(--color-text-muted);
}

.result-body {
  padding: 4px 0;
}

.result-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid var(--color-border);
}

.result-row:last-child {
  border-bottom: none;
}

.result-label {
  font-size: 13px;
  color: var(--color-text-muted);
}

.result-value {
  font-size: 13px;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: var(--color-text-muted);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-state p {
  font-size: 15px;
  margin-bottom: 4px;
}

.empty-hint {
  font-size: 13px !important;
  color: var(--color-text-muted);
}

code {
  background: var(--color-bg);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
