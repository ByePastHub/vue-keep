<script setup lang="ts">
import { ref, computed, inject, watch } from 'vue'
import { KEEP_STORE_KEY } from '@bye_past/vue-keep'
import type { CoreStore } from '@bye_past/vue-keep'

const store = inject(KEEP_STORE_KEY) as CoreStore | undefined
const collapsed = ref(true)

const stack = computed(() => {
  if (!store) return []
  const entries: { id: string; name: string; fullPath: string; constCache: boolean }[] = []
  for (const [, s] of store.state.stacks) {
    for (const e of s) {
      entries.push({ id: e.id, name: e.name, fullPath: e.fullPath, constCache: e.constCache })
    }
  }
  return entries
})

const lastNav = computed(() => store?.state.lastNavigation)
const direction = computed(() => lastNav.value?.direction ?? '-')
const method = computed(() => lastNav.value?.method ?? '-')
const stackSize = computed(() => stack.value.length)

const directionEmoji = computed(() => {
  switch (direction.value) {
    case 'forward':
      return '→'
    case 'back':
      return '←'
    default:
      return '↔'
  }
})

// 闪烁效果
const flash = ref(false)
watch(lastNav, () => {
  flash.value = true
  setTimeout(() => (flash.value = false), 400)
})
</script>

<template>
  <div v-if="store" class="debug-panel">
    <button class="toggle-btn" :class="{ flash }" @click="collapsed = !collapsed">
      <span class="toggle-icon">{{ collapsed ? '📊' : '✕' }}</span>
      <span v-if="collapsed" class="toggle-badge">{{ stackSize }}</span>
    </button>

    <Transition name="panel">
      <div v-if="!collapsed" class="panel-body">
        <div class="panel-header">
          <span class="panel-title">Debug Panel</span>
          <span class="nav-info"> {{ directionEmoji }} {{ method }} </span>
        </div>

        <div class="stack-section">
          <div class="stack-label">Page Stack ({{ stackSize }})</div>
          <div class="stack-list">
            <div
              v-for="(entry, i) in stack"
              :key="entry.id"
              :class="['stack-item', { current: i === stack.length - 1 }]"
            >
              <span class="stack-index">{{ i }}</span>
              <span class="stack-name">{{ entry.name || entry.fullPath }}</span>
              <span v-if="entry.constCache" class="const-badge">const</span>
            </div>
            <div v-if="stack.length === 0" class="stack-empty">Empty</div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.debug-panel {
  position: fixed;
  bottom: 20px;
  right: max(calc((100vw - 430px) / 2 + 12px), 12px);
  z-index: 9999;
  font-size: 12px;
}

.toggle-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: var(--color-accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  position: absolute;
  bottom: 0;
  right: 0;
  transition:
    transform 0.2s,
    background 0.3s;
}

.toggle-btn:active {
  transform: scale(0.92);
}

.toggle-btn.flash {
  background: var(--color-primary);
}

.toggle-icon {
  font-size: 18px;
}

.toggle-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  background: var(--color-danger);
  color: white;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.panel-body {
  position: absolute;
  bottom: 52px;
  right: 0;
  width: 240px;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: var(--color-accent);
  color: white;
}

.panel-title {
  font-weight: 600;
  font-size: 13px;
}

.nav-info {
  font-size: 11px;
  opacity: 0.8;
}

.stack-section {
  padding: 10px 12px;
}

.stack-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.stack-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stack-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border-radius: 6px;
  background: var(--color-bg);
  font-size: 11px;
}

.stack-item.current {
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
  font-weight: 600;
}

.stack-index {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: var(--color-text-muted);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
}

.current .stack-index {
  background: var(--color-primary);
}

.stack-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.const-badge {
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--color-warning);
  color: white;
  font-weight: 700;
}

.stack-empty {
  color: var(--color-text-muted);
  text-align: center;
  padding: 8px;
}

.panel-enter-active,
.panel-leave-active {
  transition: all 0.2s ease;
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}
</style>
