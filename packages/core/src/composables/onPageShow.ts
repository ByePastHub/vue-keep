import { inject, onMounted, onActivated, getCurrentInstance } from 'vue'
import { KEEP_STORE_KEY } from '../symbols'
import type { CoreStore } from '../store/core-store'
import type { PageShowHandler, PageShowContext } from '../types/public'
import { warn } from '../utils/warn'

declare const __DEV__: boolean | undefined

export function onPageShow(handler: PageShowHandler): void {
  const instance = getCurrentInstance()
  if (!instance) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      warn('onPageShow() 必须在 setup() 中调用')
    }
    return
  }

  const store = inject(KEEP_STORE_KEY) as CoreStore | undefined
  if (!store) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      warn('onPageShow() 必须在 createKeepRouter() 安装后使用')
    }
    return
  }

  let isFirstShow = true

  onMounted(() => {
    const ctx: PageShowContext = {
      isFirstShow: true,
      direction: store.state.lastNavigation?.direction ?? 'none',
      from: store.state.lastNavigation?.from ?? null,
    }
    handler(ctx)
  })

  onActivated(() => {
    if (isFirstShow) {
      isFirstShow = false
      return
    }
    const lastNav = store.state.lastNavigation
    const ctx: PageShowContext = {
      isFirstShow: false,
      direction: lastNav?.direction ?? 'none',
      from: lastNav?.from ?? null,
    }
    handler(ctx)
  })
}
