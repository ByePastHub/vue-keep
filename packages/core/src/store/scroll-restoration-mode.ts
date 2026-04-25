import { isBrowser } from '../utils/env'

// 禁用浏览器原生刷新滚动恢复，避免和 vue-keep 的恢复策略互相抢滚动位置
export function disableNativeScrollRestoration(): void {
  if (!isBrowser) return
  if (!('scrollRestoration' in history)) return
  try {
    history.scrollRestoration = 'manual'
  } catch {
    // 部分环境不允许写入 history.scrollRestoration，静默降级
  }
}

// 判断当前页面是否由浏览器刷新加载
export function isReloadNavigation(): boolean {
  if (!isBrowser || typeof performance === 'undefined') return false
  const entries = performance.getEntriesByType?.('navigation') ?? []
  const navigation = entries[0] as PerformanceNavigationTiming | undefined
  if (navigation) {
    return navigation.type === 'reload'
  }
  return performance.navigation?.type === performance.navigation?.TYPE_RELOAD
}

// 刷新进入页面时回到顶部，避免浏览器带回刷新前的滚动位置
export function resetScrollOnReload(): void {
  if (!isBrowser || !isReloadNavigation()) return
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}
