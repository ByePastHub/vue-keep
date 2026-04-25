<script setup lang="ts">
import { ref } from 'vue'
import { useKeepRouter, onPageShow, onPageHide } from '@bye_past/vue-keep'
import AppHeader from '../../components/AppHeader.vue'
import GuideTip from '../../components/GuideTip.vue'

const keepRouter = useKeepRouter()

interface LogEntry {
  time: string
  hook: string
  detail: string
  color: string
}

const logs = ref<LogEntry[]>([])

function addLog(hook: string, detail: string, color: string) {
  logs.value.unshift({
    time: new Date().toLocaleTimeString(),
    hook,
    detail,
    color,
  })
  if (logs.value.length > 30) logs.value.pop()
}

onPageShow((ctx) => {
  addLog(
    'onPageShow',
    `isFirstShow: ${ctx.isFirstShow}, direction: ${ctx.direction}`,
    'var(--color-success)',
  )
})

onPageHide((ctx) => {
  addLog('onPageHide', `direction: ${ctx.direction}`, 'var(--color-warning)')
})
</script>

<template>
  <div class="page page-with-header">
    <AppHeader title="生命周期" />

    <GuideTip
      text="观察 onPageShow / onPageHide 的触发时机。点击「进入子页面」然后返回，观察日志变化。"
    />

    <div class="actions">
      <button class="btn btn-primary" @click="keepRouter.push('/lifecycle/sub')">进入子页面</button>
      <button class="btn btn-outline" @click="logs = []">清空日志</button>
    </div>

    <div class="log-section">
      <div class="log-title">生命周期日志 ({{ logs.length }})</div>
      <div class="log-list">
        <TransitionGroup name="log">
          <div v-for="(log, i) in logs" :key="`${log.time}-${i}`" class="log-entry">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-hook" :style="{ color: log.color }">{{ log.hook }}</span>
            <span class="log-detail">{{ log.detail }}</span>
          </div>
        </TransitionGroup>
        <div v-if="logs.length === 0" class="log-empty">等待生命周期事件...</div>
      </div>
    </div>

    <div class="card" style="margin: 16px">
      <div
        style="padding: 16px; font-size: 13px; color: var(--color-text-secondary); line-height: 1.6"
      >
        <strong>onPageShow</strong> 在页面首次挂载和从缓存恢复时触发，通过
        <code>isFirstShow</code> 区分。 <br /><br />
        <strong>onPageHide</strong> 在页面被缓存或被销毁时触发。 <br /><br />
        相比 Vue 原生的 onMounted/onActivated，这两个钩子提供了导航方向和来源路由等上下文信息。
      </div>
    </div>
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  gap: 8px;
  padding: 0 16px;
}

.log-section {
  margin: 16px;
  padding: 16px;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.log-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
}

.log-list {
  max-height: 300px;
  overflow-y: auto;
}

.log-entry {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 12px;
}

.log-time {
  color: var(--color-text-muted);
  font-family: 'SF Mono', monospace;
  flex-shrink: 0;
}

.log-hook {
  font-weight: 700;
  flex-shrink: 0;
}

.log-detail {
  color: var(--color-text-secondary);
  font-family: 'SF Mono', monospace;
}

.log-empty {
  text-align: center;
  padding: 20px;
  color: var(--color-text-muted);
}

code {
  background: var(--color-bg);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.log-enter-active {
  transition: all 0.3s ease;
}
.log-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
