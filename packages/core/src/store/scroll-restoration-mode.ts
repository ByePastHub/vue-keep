import { isBrowser } from '../utils/env'

export interface NavigatorLike {
  userAgent: string // 用户代理字符串
  platform: string // 平台标识
  maxTouchPoints?: number // 最大触点数量
}

// 判断是否为 iOS WebKit 浏览器
export function isIOSWebKitBrowser(nav?: NavigatorLike): boolean {
  const currentNavigator = nav ?? (typeof navigator !== 'undefined' ? navigator : null)
  if (!currentNavigator) return false

  const platform = currentNavigator.platform
  const maxTouchPoints = currentNavigator.maxTouchPoints ?? 0
  const isIOS = /iP(ad|hone|od)/.test(platform) || (platform === 'MacIntel' && maxTouchPoints > 1)
  const isWebKit = /WebKit/i.test(currentNavigator.userAgent)

  return isIOS && isWebKit
}

// 判断是否为微信内置浏览器
export function isWeChatBrowser(nav?: NavigatorLike): boolean {
  const currentNavigator = nav ?? (typeof navigator !== 'undefined' ? navigator : null)
  if (!currentNavigator) return false

  return /MicroMessenger/i.test(currentNavigator.userAgent)
}

// 解析原生滚动恢复模式，iOS 保留 auto 以兼容系统返回快照
export function resolveNativeScrollRestorationMode(nav?: NavigatorLike): ScrollRestoration {
  return isIOSWebKitBrowser(nav) ? 'auto' : 'manual'
}

// 配置浏览器原生滚动恢复，避免和 vue-keep 的恢复策略互相抢滚动位置
export function disableNativeScrollRestoration(): void {
  if (!isBrowser) return
  if (!('scrollRestoration' in history)) return
  try {
    history.scrollRestoration = resolveNativeScrollRestorationMode()
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
