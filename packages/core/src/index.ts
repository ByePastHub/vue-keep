// 类型声明合并（side-effect import）
import './types/augment'

// Public 类型与常量
export {
  NavigationDirection,
  NavigationMethod,
  type ScrollPosition,
  type PageStackEntry,
  type NameMatcher,
  type TransitionPreset,
  type TransitionConfig,
  type ScrollBehaviorStrategy,
  type ScrollBehaviorFn,
  type DestroyTarget,
  type KeepOptions,
  type KeepOptionsResolved,
  type KeepRouterViewProps,
  type KeepLocation,
  type KeepNavigateOptions,
  type KeepGuardReturn,
  type KeepNavigationGuard,
  type KeepRouter,
  type PageShowContext,
  type PageHideContext,
  type PageShowHandler,
  type PageHideHandler,
  type PageEventMap,
} from './types/public'

// 工具函数
export { matchName } from './utils/match'
export { resolveOptions } from './utils/options'
export { isBrowser, isSSR, hasHistory, hasResizeObserver } from './utils/env'
export { warn, error, setNamespace } from './utils/warn'

// Store
export { createCoreStore, type CoreStore } from './store/core-store'
export { genId, resetIdCounter } from './store/id-allocator'
export { createStackManager } from './store/stack-manager'

// 工具
export { evictLeastRecentlyUsed } from './utils/lru'

// 路由绑定
export { bindRouter } from './router/bind-router'
export { resolveNavigation } from './router/navigation-info'
export { createKeepMethods } from './router/methods'
export { IntentTracker } from './router/intent-tracker'
export { ContainerResolver } from './router/container-resolver'
export { createKeepState, readKeepState, injectInitialState } from './store/persistence'

// 组件名解析
export {
  resolveComponentName,
  wrapWithName,
  ensureComponentName,
  setupNameResolver,
} from './router/name-resolver'

// 插件工厂
export { createKeepRouter } from './plugin'

// 组件
export { KeepRouterView } from './components/KeepRouterView'
export { KeepPageShell } from './components/KeepPageShell'
export { KeepTransition } from './components/KeepTransition'

// Symbols
export {
  KEEP_STORE_KEY,
  KEEP_OPTIONS_KEY,
  KEEP_ROUTER_KEY,
  CHANNEL_REGISTRY_KEY,
  DEPTH_KEY,
  CONTAINER_ID_KEY,
} from './symbols'

// EventChannel
export { createEventChannel } from './event-channel/channel'
export { createChannelRegistry } from './event-channel/registry'
export type { EventChannel, EventHandler, ChannelEvents } from './event-channel/types'
export type { ChannelRegistry } from './event-channel/registry'

// Animation
export { PRESET_MAP } from './animation/presets'
export {
  resolveTransitionName,
  resolveTransitionProps,
  type TransitionProps,
} from './animation/direction-class'

// Scroll
export {
  detectScrollContainers,
  captureScrollPositions,
  restoreScrollPositions,
  createKeepScrollBehavior,
} from './scroll'

// Composables
export {
  useKeepRouter,
  usePageCache,
  useNavigationDirection,
  usePageStack,
  useEventChannel,
  useScrollRestoration,
  type ScrollRestorationControls,
  onPageShow,
  onPageHide,
} from './composables'
