import { inject, onDeactivated, onUnmounted, getCurrentInstance } from 'vue'
import { KEEP_STORE_KEY } from '../symbols'
import type { CoreStore } from '../store/core-store'
import type { PageHideHandler, PageHideContext } from '../types/public'
import { warn } from '../utils/warn'

declare const __DEV__: boolean | undefined

export function onPageHide(handler: PageHideHandler): void {
  const instance = getCurrentInstance()
  if (!instance) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      warn('onPageHide() 必须在 setup() 中调用')
    }
    return
  }

  const store = inject(KEEP_STORE_KEY) as CoreStore | undefined
  if (!store) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      warn('onPageHide() 必须在 createKeepRouter() 安装后使用')
    }
    return
  }

  onDeactivated(() => {
    const lastNav = store.state.lastNavigation
    const ctx: PageHideContext = {
      direction: lastNav?.direction ?? 'none',
      to: lastNav?.to ?? null,
    }
    handler(ctx)
  })

  onUnmounted(() => {
    const lastNav = store.state.lastNavigation
    const ctx: PageHideContext = {
      direction: lastNav?.direction ?? 'none',
      to: lastNav?.to ?? null,
    }
    handler(ctx)
  })
}
