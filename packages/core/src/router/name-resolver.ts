import { defineComponent, h, type Component } from 'vue'
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import { warn } from '../utils/warn'

declare const __DEV__: boolean | undefined

// 包装组件缓存
const wrapCache = new WeakMap<Component, Component>()

// 解析组件名称
export function resolveComponentName(
  component: Component | undefined,
  route: RouteLocationNormalizedLoaded,
  depth?: number,
): string | null {
  // 优先使用组件自身的 name
  if (component && typeof component === 'object') {
    if ('name' in component && typeof component.name === 'string' && component.name) {
      return component.name
    }
    if ('__name' in component && typeof (component as any).__name === 'string') {
      return (component as any).__name
    }
  }

  // 其次使用路由 name
  const matchedDepth = depth ?? Math.max(0, route.matched.length - 1)
  const matched = route.matched[matchedDepth]
  if (matched?.name && typeof matched.name === 'string') {
    return matched.name
  }

  // 也检查路由自身的 name
  if (route.name && typeof route.name === 'string') {
    return route.name
  }

  return null
}

// 创建薄包装组件
export function wrapWithName(component: Component, name: string): Component {
  const cached = wrapCache.get(component)
  if (cached) return cached

  const wrapped = defineComponent({
    name,
    setup(_, { slots }) {
      return () => h(component, null, slots)
    },
  })

  wrapCache.set(component, wrapped)
  return wrapped
}

// 确保组件有 name
export function ensureComponentName(
  component: Component,
  route: RouteLocationNormalizedLoaded,
  depth?: number,
): { component: Component; name: string } {
  const name = resolveComponentName(component, route, depth)

  if (name) {
    // 组件自身有 name，确保属性存在
    if (typeof component === 'object' && !('name' in component && component.name)) {
      ;(component as any).name = name
    }
    return { component, name }
  }

  // 用 route.name 或 fullPath 作为 fallback
  const fallbackName =
    (typeof route.name === 'string' ? route.name : null) ??
    `__vue_keep_${route.fullPath.replace(/[^a-zA-Z0-9]/g, '_')}`

  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    warn(`路由 ${route.fullPath} 的组件没有 name，使用 "${fallbackName}" 作为缓存键`)
  }

  const wrapped = wrapWithName(component, fallbackName)
  return { component: wrapped, name: fallbackName }
}

// 在 router.beforeResolve 中自动解析组件名称，并将 name 写入 meta 供 stackManager 使用
export function setupNameResolver(router: Router): () => void {
  const removeGuard = router.beforeResolve((to) => {
    const names: Record<number, string> = {}

    for (let i = 0; i < to.matched.length; i++) {
      const record = to.matched[i]!
      const component = record.components?.default
      if (!component) continue

      const { component: resolved, name } = ensureComponentName(
        component as Component,
        to as RouteLocationNormalizedLoaded,
        i,
      )

      names[i] = name

      if (resolved !== component) {
        record.components!.default = resolved as any
      }
    }

    ;(to.meta as any).__keepComponentNames = names
  })
  return removeGuard
}
