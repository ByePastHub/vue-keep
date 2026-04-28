import type { App } from 'vue'
import type { RouteLocationNormalized, RouteLocationNormalizedLoaded } from 'vue-router'

// ---- 导航方向 ----

export const NavigationDirection = {
  Forward: 'forward',
  Back: 'back',
  None: 'none',
} as const
export type NavigationDirection = (typeof NavigationDirection)[keyof typeof NavigationDirection]

// ---- 导航方式 ----

export const NavigationMethod = {
  Push: 'push',
  Replace: 'replace',
  Back: 'back',
  ReLaunch: 'reLaunch',
  SwitchTab: 'switchTab',
} as const
export type NavigationMethod = (typeof NavigationMethod)[keyof typeof NavigationMethod]

// ---- 滚动位置 ----

export interface ScrollPosition {
  left: number // 横向滚动位置
  top: number // 纵向滚动位置
  scrollWidth?: number // 抓取时的容器宽度，用于懒加载后按比例恢复
  scrollHeight?: number // 抓取时的容器高度
}

// ---- 页面栈条目 ----

export interface PageStackEntry {
  id: string // 唯一 id，与 history.state.__vueKeepId 绑定
  position: number // 栈内位置索引
  fullPath: string // 路由 fullPath
  name: string // 路由/组件 name，KeepAlive include 的键
  route: Readonly<RouteLocationNormalizedLoaded> // 完整路由快照
  constCache: boolean // 是否常驻缓存
  tabKey: string | null // switchTab 使用的稳定 tab 身份
  depth: number // 嵌套层级（顶层 0）
  createdAt: number // 创建时间戳
  lastActiveAt: number // 最近激活时间戳（LRU 依据）
  scrollPositions: Map<string, ScrollPosition> // 滚动容器位置表
  channelId: string | null // 关联的 eventChannel 实例 id
  metadata: Readonly<Record<string, unknown>> // 用户自定义附加数据
}

// ---- 名称匹配 ----

export type NameMatcher =
  | string
  | RegExp
  | (string | RegExp)[]
  | ((name: string, route: RouteLocationNormalized) => boolean)

// ---- 过渡动画 ----

export type TransitionPreset = 'slide' | 'fade' | 'zoom'

export interface TransitionConfig {
  name?: string | ((direction: NavigationDirection) => string) // transition 名称或名称工厂
  mode?: 'out-in' | 'in-out' | 'default' // Transition 切换模式
  appear?: boolean // 是否在初始渲染时启用动画
  duration?:
    | number
    | {
        enter: number // 进入动画时长
        leave: number // 离开动画时长
      }
  onBeforeEnter?: (el: Element) => void // 进入前钩子
  onAfterEnter?: (el: Element) => void // 进入后钩子
  onBeforeLeave?: (el: Element) => void // 离开前钩子
  onAfterLeave?: (el: Element) => void // 离开后钩子
}

// ---- 滚动行为策略 ----

export type ScrollBehaviorStrategy = 'auto' | 'always' | 'none' | ScrollBehaviorFn

export type ScrollBehaviorFn = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  direction: NavigationDirection,
  savedPositions: ReadonlyMap<string, ScrollPosition>,
) => ScrollPosition | ScrollPosition[] | false | Promise<ScrollPosition | false>

// ---- 销毁目标 ----

export type DestroyTarget =
  | string // 按 name 销毁
  | string[] // 按 name 批量销毁
  | 'ALL' // 销毁全部
  | ((entry: PageStackEntry) => boolean) // 条件销毁

// ---- 全局配置 ----

export interface KeepOptions {
  router: import('vue-router').Router // 必传，Vue Router 实例
  max?: number | Record<number, number> // 栈深上限，默认 10
  exclude?: NameMatcher // 全局排除规则
  include?: NameMatcher // 全局白名单规则
  scrollBehavior?: ScrollBehaviorStrategy // 滚动恢复策略，默认 'auto'
  persist?: boolean // 是否启用刷新恢复，默认 true
  transition?: false | TransitionPreset | TransitionConfig // 动画配置，默认 'slide'
  devtools?: boolean // 是否启用 DevTools
  namespace?: string // 日志命名空间，默认 '[vue-keep]'
  disableFirstTransition?: boolean // 是否跳过首屏动画，默认 true
  onBeforeEvict?: (entry: PageStackEntry) => boolean | void // LRU 淘汰前钩子
}

export interface KeepOptionsResolved {
  router: import('vue-router').Router
  max: number | Record<number, number>
  exclude: NameMatcher | undefined
  include: NameMatcher | undefined
  scrollBehavior: ScrollBehaviorStrategy
  persist: boolean
  transition: false | TransitionPreset | TransitionConfig
  devtools: boolean
  namespace: string
  disableFirstTransition: boolean
  onBeforeEvict: ((entry: PageStackEntry) => boolean | void) | undefined
}

// ---- KeepRouterView Props ----

export interface KeepRouterViewProps {
  max?: number // 页面栈最大深度
  cacheMax?: number // KeepAlive 缓存实例上限
  exclude?: NameMatcher // 当前容器排除规则
  include?: NameMatcher // 当前容器白名单规则
  containerId?: string // 手动指定容器 id
  transition?: false | TransitionPreset | TransitionConfig // 当前容器动画配置
  scrollContainers?: string[] // 额外滚动容器选择器
}

// ---- 导航选项 ----

export type KeepLocation = string | import('vue-router').RouteLocationRaw

export interface KeepNavigateOptions {
  cache?: boolean // 是否缓存目标页（默认 true）
  constCache?: boolean // 是否将目标页标记为常驻缓存
  destroy?: DestroyTarget // 进入目标页前需要销毁的缓存
  events?: Record<string, (...args: any[]) => void> // eventChannel 监听器
  metadata?: Record<string, unknown> // 附加元数据
}

// ---- 导航守卫 ----

export interface KeepGuardReturn {
  cache?: boolean // 是否缓存目标页
  constCache?: boolean // 是否强制常驻缓存
  destroy?: string | string[] | 'ALL' // 导航前需要销毁的缓存
}

export type KeepNavigationGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  direction: NavigationDirection,
) => KeepGuardReturn | void | Promise<KeepGuardReturn | void>

// ---- KeepRouter 实例接口 ----

export interface KeepRouter {
  push(to: KeepLocation, options?: KeepNavigateOptions): Promise<void>
  replace(to: KeepLocation, options?: KeepNavigateOptions): Promise<void>
  back(delta?: number): void
  reLaunch(to: KeepLocation, options?: Omit<KeepNavigateOptions, 'events'>): Promise<void>
  switchTab(to: KeepLocation, options?: Omit<KeepNavigateOptions, 'events'>): Promise<void>
  destroy(target: DestroyTarget): void
  beforeEach(guard: KeepNavigationGuard): () => void
}

export interface KeepRouterPlugin extends KeepRouter {
  install(app: App): void // 安装到 Vue 应用
}

// ---- 页面生命周期上下文 ----

export interface PageShowContext {
  isFirstShow: boolean // 是否首次显示
  direction: NavigationDirection // 当前显示对应的导航方向
  from: RouteLocationNormalizedLoaded | null // 来源路由
}

export interface PageHideContext {
  direction: NavigationDirection // 当前隐藏对应的导航方向
  to: RouteLocationNormalizedLoaded | null // 目标路由
}

export type PageShowHandler = (ctx: PageShowContext) => void
export type PageHideHandler = (ctx: PageHideContext) => void

// ---- EventChannel 声明合并基础 ----

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PageEventMap {}
