import { hasInjectionContext, inject } from 'vue'
import { KEEP_ROUTER_KEY } from '../symbols'
import type { KeepRouter } from '../types/public'
import { getActiveKeepRouter } from '../router/active-keep-router'

/** 获取 KeepRouter 实例，组件内优先使用注入，组件外使用已安装的默认实例 */
export function useKeepRouter(): KeepRouter {
  if (hasInjectionContext()) {
    const keepRouter = inject(KEEP_ROUTER_KEY) as KeepRouter | undefined
    if (!keepRouter) {
      throw new Error('[vue-keep] useKeepRouter() 必须在 createKeepRouter() 安装后的组件中调用')
    }
    return keepRouter
  }

  const keepRouter = getActiveKeepRouter()
  if (keepRouter) return keepRouter

  throw new Error('[vue-keep] useKeepRouter() 必须在 app.use(createKeepRouter(...)) 之后调用')
}

/** 获取组件外可用的 KeepRouter 实例 */
export function getKeepRouter(): KeepRouter {
  const keepRouter = getActiveKeepRouter()
  if (!keepRouter) {
    throw new Error('[vue-keep] getKeepRouter() 必须在 app.use(createKeepRouter(...)) 之后调用')
  }
  return keepRouter
}
