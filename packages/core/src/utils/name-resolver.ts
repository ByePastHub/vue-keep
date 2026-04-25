import type { RouteLocationNormalizedLoaded } from 'vue-router'

let counter = 0

/**
 * 解析路由对应的组件名称
 * KeepAlive 的 include 依赖组件 name，此函数确保每个路由组件都有唯一名称
 */
export function resolveComponentName(route: RouteLocationNormalizedLoaded, depth: number): string {
  const matched = route.matched[depth]
  if (!matched) return ''

  const component = matched.components?.default
  if (!component) return ''

  // 优先使用组件自身的 name
  if (typeof component === 'object' && 'name' in component && component.name) {
    return component.name as string
  }

  // 其次使用路由 name
  if (matched.name && typeof matched.name === 'string') {
    return matched.name
  }

  // 兜底：基于路径生成稳定名称
  return `__vue_keep_${matched.path || `anonymous_${counter++}`}`
}

/**
 * 确保组件有 name 属性（KeepAlive 需要）
 * 如果组件没有 name，注入一个
 */
export function ensureComponentName(component: any, name: string): void {
  if (component && typeof component === 'object' && !component.name) {
    component.name = name
  }
}
