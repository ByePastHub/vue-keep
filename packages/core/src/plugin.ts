import type { App, Plugin } from 'vue'
import type { KeepOptions, KeepRouter } from './types/public'
import { resolveOptions } from './utils/options'
import { createCoreStore } from './store/core-store'
import { createStackManager } from './store/stack-manager'
import { createChannelRegistry } from './event-channel/registry'
import { IntentTracker } from './router/intent-tracker'
import { bindRouter } from './router/bind-router'
import { createKeepMethods } from './router/methods'
import { setupNameResolver } from './router/name-resolver'
import { setNamespace } from './utils/warn'
import { KEEP_STORE_KEY, KEEP_OPTIONS_KEY, KEEP_ROUTER_KEY, CHANNEL_REGISTRY_KEY } from './symbols'
import { createKeepScrollBehavior } from './scroll/keep-scroll-behavior'
import { KeepRouterView } from './components/KeepRouterView'
import { disableNativeScrollRestoration } from './store/scroll-restoration-mode'

declare const __DEV__: boolean | undefined

export function createKeepRouter(rawOptions: KeepOptions): Plugin {
  const options = resolveOptions(rawOptions)
  const store = createCoreStore()
  const intentTracker = new IntentTracker()
  const stackManager = createStackManager(options)
  const channelRegistry = createChannelRegistry()

  // 注入栈管理器和通道注册表
  store.setStackManager(stackManager)
  store.setChannelRegistry(channelRegistry)

  let teardown: (() => void) | null = null
  let removeNameResolver: (() => void) | null = null

  return {
    install(app: App) {
      // 1. 设置命名空间
      setNamespace(options.namespace)

      // 2. 绑定路由
      disableNativeScrollRestoration()
      teardown = bindRouter(options.router, store, options, intentTracker)

      // 2.5 接入滚动行为
      const originalScrollBehavior = options.router.options.scrollBehavior
      options.router.options.scrollBehavior = createKeepScrollBehavior(
        () => store.state.lastNavigation?.direction ?? 'none',
        originalScrollBehavior,
        () => store.getPreparedMethod() ?? store.state.lastNavigation?.method,
      )

      // 3. 设置组件名解析
      removeNameResolver = setupNameResolver(options.router)

      // 4. 创建 keepRouter 方法集
      const methods = createKeepMethods(options.router, store, intentTracker, channelRegistry)
      const keepRouter: KeepRouter = {
        ...methods,
      }

      // 5. provide 注入
      app.provide(KEEP_STORE_KEY, store)
      app.provide(KEEP_OPTIONS_KEY, options)
      app.provide(KEEP_ROUTER_KEY, keepRouter)
      app.provide(CHANNEL_REGISTRY_KEY, channelRegistry)

      // 6. 全局属性
      app.config.globalProperties.$keepRouter = keepRouter

      // 7. 注册全局组件
      app.component('KeepRouterView', KeepRouterView)

      // 8. DevTools
      if (typeof __DEV__ !== 'undefined' && __DEV__ && options.devtools) {
        import('./devtools/setup-hook').then(({ setupDevtools }) => {
          setupDevtools(app, store)
        })
      }

      // 9. 清理
      if (typeof app.onUnmount === 'function') {
        app.onUnmount(() => {
          teardown?.()
          removeNameResolver?.()
          channelRegistry.clear()
        })
      }
    },
  }
}
