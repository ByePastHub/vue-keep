import type { NavigationMethod } from '../types/public'
import type { VueKeepState } from '../types/internal'
import { isBrowser } from '../utils/env'

// 创建 vue-keep 的 history.state 数据
export function createKeepState(
  id: string,
  depth: number,
  _method: NavigationMethod,
): Record<string, string | number> {
  return {
    __vueKeepId: id,
    __vueKeepPosition: depth,
    __vueKeepContainerId: `keep:${depth}:root:default`,
  }
}

// 从 history.state 中安全读取 vue-keep 状态
export function readKeepState(state: unknown): VueKeepState | null {
  if (!state || typeof state !== 'object') return null
  const s = state as Record<string, unknown>
  if (typeof s.__vueKeepId !== 'string') return null
  return {
    __vueKeepId: s.__vueKeepId,
    __vueKeepPosition: typeof s.__vueKeepPosition === 'number' ? s.__vueKeepPosition : 0,
    __vueKeepContainerId:
      typeof s.__vueKeepContainerId === 'string' ? s.__vueKeepContainerId : 'keep:0:root:default',
  }
}

// 首次加载时注入初始 state
export function injectInitialState(id: string): void {
  if (!isBrowser) return
  try {
    const current = history.state ?? {}
    history.replaceState(
      {
        ...current,
        __vueKeepId: id,
        __vueKeepPosition: 0,
        __vueKeepContainerId: 'keep:0:root:default',
      },
      '',
    )
  } catch {
    // SSR 或 history 不可用时静默忽略
  }
}
