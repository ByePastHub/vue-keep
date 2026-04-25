import { inject } from 'vue'
import { KEEP_ROUTER_KEY } from '../symbols'
import type { KeepRouter } from '../types/public'

export function useKeepRouter(): KeepRouter {
  const keepRouter = inject(KEEP_ROUTER_KEY) as KeepRouter | undefined
  if (!keepRouter) {
    throw new Error('[vue-keep] useKeepRouter() 必须在 createKeepRouter() 安装后的组件中调用')
  }
  return keepRouter
}
