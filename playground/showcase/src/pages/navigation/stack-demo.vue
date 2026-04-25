<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import { useKeepRouter, KEEP_STORE_KEY } from '@bye_past/vue-keep'
import type { CoreStore } from '@bye_past/vue-keep'
import AppHeader from '../../components/AppHeader.vue'
import GuideTip from '../../components/GuideTip.vue'

const keepRouter = useKeepRouter()
const store = inject(KEEP_STORE_KEY) as CoreStore

const stack = computed(() => {
  const entries: { id: string; name: string; fullPath: string }[] = []
  for (const [, s] of store.state.stacks) {
    for (const e of s) entries.push({ id: e.id, name: e.name, fullPath: e.fullPath })
  }
  return entries
})

const log = ref<string[]>([])

function addLog(msg: string) {
  log.value.unshift(`[${new Date().toLocaleTimeString()}] ${msg}`)
  if (log.value.length > 20) log.value.pop()
}

async function doPush() {
  addLog('push → /nav/stack (自身)')
  await keepRouter.push('/nav/stack')
}

async function doReplace() {
  addLog('replace → /nav/stack')
  await keepRouter.replace('/nav/stack')
}

function doBack() {
  addLog('back()')
  keepRouter.back()
}

async function doReLaunch() {
  addLog('reLaunch → /')
  await keepRouter.reLaunch('/')
}
</script>

<template>
  <div class="page page-with-header">
    <AppHeader title="导航栈可视化" />

    <GuideTip
      text="点击下方按钮观察页面栈的实时变化。push 入栈、back 出栈、replace 替换栈顶、reLaunch 清空重建。"
    />

    <div class="actions">
      <button class="btn btn-primary" @click="doPush">Push</button>
      <button class="btn btn-outline" @click="doReplace">Replace</button>
      <button class="btn btn-outline" @click="doBack">Back</button>
      <button class="btn btn-danger btn-sm" @click="doReLaunch">reLaunch /</button>
    </div>

    <div class="stack-viz">
      <div class="viz-title">当前页面栈 ({{ stack.length }})</div>
      <div class="viz-stack">
        <TransitionGroup name="stack-item">
          <div
            v-for="(entry, i) in stack"
            :key="entry.id"
            :class="['viz-entry', { current: i === stack.length - 1 }]"
          >
            <span class="entry-idx">{{ i }}</span>
            <span class="entry-name">{{ entry.name || '(anonymous)' }}</span>
            <span class="entry-path">{{ entry.fullPath }}</span>
          </div>
        </TransitionGroup>
      </div>
    </div>

    <div class="log-section">
      <div class="viz-title">操作日志</div>
      <div class="log-list">
        <div v-for="(msg, i) in log" :key="i" class="log-item">{{ msg }}</div>
        <div v-if="log.length === 0" class="log-empty">暂无操作</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  gap: 8px;
  padding: 0 16px;
  flex-wrap: wrap;
}

.stack-viz {
  margin: 20px 16px 0;
  padding: 16px;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.viz-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
}

.viz-stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.viz-entry {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: var(--color-bg);
  border-radius: 8px;
  font-size: 13px;
  transition: all 0.3s;
}

.viz-entry.current {
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
  border: 1.5px solid var(--color-primary);
}

.entry-idx {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: var(--color-text-muted);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

.current .entry-idx {
  background: var(--color-primary);
}

.entry-name {
  font-weight: 600;
}

.entry-path {
  color: var(--color-text-muted);
  font-size: 11px;
  margin-left: auto;
}

.log-section {
  margin: 16px;
  padding: 16px;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.log-list {
  max-height: 200px;
  overflow-y: auto;
}

.log-item {
  font-size: 12px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: var(--color-text-secondary);
  padding: 3px 0;
  border-bottom: 1px solid var(--color-border);
}

.log-empty {
  color: var(--color-text-muted);
  font-size: 13px;
  text-align: center;
  padding: 12px;
}

.stack-item-enter-active {
  transition: all 0.3s ease;
}
.stack-item-leave-active {
  transition: all 0.2s ease;
}
.stack-item-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.stack-item-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
