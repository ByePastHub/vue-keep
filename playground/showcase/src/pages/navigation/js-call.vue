<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '../../components/AppHeader.vue'
import GuideTip from '../../components/GuideTip.vue'
import {
  backFromPlainJs,
  pushStackFromPlainJs,
  readKeepRouterFromPlainJs,
  relaunchHomeFromPlainJs,
  replaceSelfFromPlainJs,
  type PlainJsNavigationResult,
} from '../../services/plain-js-navigation.js'

interface ActionItem {
  key: string // 操作标识
  label: string // 按钮文案
  tone: 'primary' | 'outline' | 'danger' // 按钮风格
  run: () => PlainJsNavigationResult | Promise<PlainJsNavigationResult> // 执行函数
}

const route = useRoute()
const logs = ref<PlainJsNavigationResult[]>([])
const pendingKey = ref('')

const currentFullPath = computed(() => route.fullPath)

const actions: ActionItem[] = [
  {
    key: 'read',
    label: '读取实例',
    tone: 'primary',
    run: readKeepRouterFromPlainJs,
  },
  {
    key: 'replace',
    label: 'JS Replace',
    tone: 'outline',
    run: replaceSelfFromPlainJs,
  },
  {
    key: 'push',
    label: 'JS Push',
    tone: 'outline',
    run: pushStackFromPlainJs,
  },
  {
    key: 'back',
    label: 'JS Back',
    tone: 'outline',
    run: backFromPlainJs,
  },
  {
    key: 'relaunch',
    label: 'JS reLaunch',
    tone: 'danger',
    run: relaunchHomeFromPlainJs,
  },
]

/** 记录普通 JS 模块调用结果 */
function addLog(result: PlainJsNavigationResult): void {
  logs.value.unshift(result)
  if (logs.value.length > 8) {
    logs.value.pop()
  }
}

/** 执行普通 JS 模块中的导航动作 */
async function runAction(item: ActionItem): Promise<void> {
  if (pendingKey.value) return
  pendingKey.value = item.key
  try {
    const result = await item.run()
    addLog(result)
  } finally {
    pendingKey.value = ''
  }
}
</script>

<template>
  <div class="page page-with-header js-call-page">
    <AppHeader title="普通 JS 调用" />

    <GuideTip
      text="这些按钮调用的是 services/plain-js-navigation.js 中的函数，用来验证组件外 JS 模块可以在安装后通过 useKeepRouter / getKeepRouter 获取实例。"
    />

    <div class="status-card card">
      <div class="status-label">当前路由</div>
      <div class="status-path">{{ currentFullPath }}</div>
    </div>

    <div class="actions">
      <button
        v-for="item in actions"
        :key="item.key"
        :class="[
          'btn',
          item.tone === 'primary' ? 'btn-primary' : '',
          item.tone === 'outline' ? 'btn-outline' : '',
          item.tone === 'danger' ? 'btn-danger' : '',
        ]"
        :disabled="Boolean(pendingKey)"
        @click="runAction(item)"
      >
        {{ pendingKey === item.key ? '执行中...' : item.label }}
      </button>
    </div>

    <div class="module-card card">
      <div class="module-title">调用模块</div>
      <code>playground/showcase/src/services/plain-js-navigation.js</code>
    </div>

    <div class="log-section card">
      <div class="log-title">调用日志</div>
      <div v-if="logs.length === 0" class="log-empty">暂无调用</div>
      <div v-for="log in logs" :key="`${log.time}-${log.action}`" class="log-item">
        <span class="log-time">{{ log.time }}</span>
        <span class="log-action">{{ log.action }}</span>
        <span class="log-detail">{{ log.detail }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.js-call-page {
  padding-left: 16px;
  padding-right: 16px;
}

.status-card,
.module-card,
.log-section {
  padding: 16px;
  margin-top: 16px;
}

.status-label,
.module-title,
.log-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.status-path {
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  color: var(--color-primary-dark);
  font-size: 13px;
  word-break: break-all;
}

.actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
}

.actions .btn {
  min-height: 42px;
  padding-left: 10px;
  padding-right: 10px;
}

.actions .btn:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.module-card code {
  display: block;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: #111827;
  color: #d1fae5;
  font-size: 12px;
  line-height: 1.5;
  word-break: break-all;
}

.log-empty {
  padding: 18px 0;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 13px;
}

.log-item {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 6px 10px;
  padding: 10px 0;
  border-top: 1px solid var(--color-border);
  font-size: 12px;
}

.log-time {
  color: var(--color-text-muted);
}

.log-action {
  color: var(--color-primary-dark);
  font-weight: 600;
}

.log-detail {
  grid-column: 2;
  color: var(--color-text-secondary);
  word-break: break-all;
}
</style>
