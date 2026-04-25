import type { RouteLocationNormalized } from 'vue-router'

/**
 * 解析 switchTab 的 tab 身份
 * 优先级：route.meta.keep.tabKey > 顶层路由 name > 顶层路由 path
 */
export function resolveTabKey(route: RouteLocationNormalized): string | null {
  // 优先使用 meta 中显式配置的 tabKey
  const metaTabKey = route.meta?.keep?.tabKey
  if (metaTabKey) return metaTabKey

  // 顶层路由记录
  const topRecord = route.matched[0]
  if (!topRecord) return null

  // 使用路由 name
  if (topRecord.name && typeof topRecord.name === 'string') {
    return topRecord.name
  }

  // 使用路由 path
  return topRecord.path || null
}
