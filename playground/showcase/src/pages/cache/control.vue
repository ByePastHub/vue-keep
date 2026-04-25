<script setup lang="ts">
import { inject, computed } from 'vue'
import { useKeepRouter, KEEP_STORE_KEY } from '@bye_past/vue-keep'
import type { CoreStore } from '@bye_past/vue-keep'
import AppHeader from '../../components/AppHeader.vue'
import GuideTip from '../../components/GuideTip.vue'
import FeatureBadge from '../../components/FeatureBadge.vue'

const keepRouter = useKeepRouter()
const store = inject(KEEP_STORE_KEY) as CoreStore

const stack = computed(() => {
  const entries: { id: string; name: string; fullPath: string; constCache: boolean }[] = []
  for (const [, s] of store.state.stacks) {
    for (const e of s)
      entries.push({ id: e.id, name: e.name, fullPath: e.fullPath, constCache: e.constCache })
  }
  return entries
})

let counter = 0

function pushNormal() {
  counter++
  keepRouter.push(`/cache/sub/${counter}`)
}

function pushConst() {
  counter++
  keepRouter.push(`/cache/sub/${counter}`, { constCache: true })
}

function destroyAll() {
  keepRouter.destroy('ALL')
}

function destroyNonConst() {
  keepRouter.destroy((entry: any) => !entry.constCache)
}
</script>

<template>
  <div class="page page-with-header">
    <AppHeader title="缓存控制" />

    <GuideTip
      text="创建普通页面和 constCache 页面，观察 destroy 操作的效果。constCache 页面不会被 LRU 淘汰或 destroy('ALL') 清除。"
    />

    <div class="actions">
      <button class="btn btn-primary" @click="pushNormal">Push 普通页面</button>
      <button
        class="btn btn-outline"
        style="border-color: var(--color-warning); color: var(--color-warning)"
        @click="pushConst"
      >
        Push constCache
      </button>
    </div>

    <div class="actions" style="margin-top: 8px">
      <button class="btn btn-danger btn-sm" @click="destroyAll">Destroy ALL</button>
      <button class="btn btn-sm btn-outline" @click="destroyNonConst">Destroy 非 const</button>
    </div>

    <div class="stack-section">
      <div class="stack-title">缓存栈 ({{ stack.length }})</div>
      <div class="stack-list">
        <div
          v-for="(entry, i) in stack"
          :key="entry.id"
          :class="['stack-entry', { current: i === stack.length - 1 }]"
        >
          <span class="entry-name">{{ entry.name || entry.fullPath }}</span>
          <FeatureBadge v-if="entry.constCache" label="constCache" color="var(--color-warning)" />
          <FeatureBadge v-else label="normal" color="var(--color-text-muted)" />
        </div>
        <div v-if="stack.length === 0" class="stack-empty">栈为空</div>
      </div>
    </div>

    <div class="info card" style="margin: 16px">
      <div
        style="padding: 16px; font-size: 13px; color: var(--color-text-secondary); line-height: 1.6"
      >
        <strong>constCache</strong> 标记的页面受到保护：
        <ul style="padding-left: 18px; margin-top: 6px">
          <li>LRU 淘汰时会跳过 constCache 页面</li>
          <li>可通过路由 meta 或导航选项设置</li>
          <li>适用于首页、Tab 页等需要常驻的页面</li>
        </ul>
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

.stack-section {
  margin: 16px;
  padding: 16px;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.stack-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
}

.stack-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stack-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: var(--color-bg);
  border-radius: 8px;
  font-size: 13px;
}

.stack-entry.current {
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  border: 1.5px solid var(--color-primary);
}

.entry-name {
  font-weight: 500;
}

.stack-empty {
  text-align: center;
  padding: 16px;
  color: var(--color-text-muted);
}
</style>
