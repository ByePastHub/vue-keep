import type { RouteLocationNormalized, RouteLocationNormalizedLoaded } from 'vue-router'
import type { DestroyTarget, NavigationDirection, NavigationMethod } from './public'

// ---- Vue Router history.listen 回调参数 ----

export interface NavigationInfo {
  type: 'pop' | 'push' // history 触发类型
  direction: 'forward' | 'back' | 'unknown' // Vue Router 推断的导航方向
  delta: number // 本次导航跨越的历史步数
}

// ---- 导航意图（keepRouter 方法写入、beforeEach 消费） ----

export interface NavigationIntent {
  method: NavigationMethod // 本次导航希望执行的方法
  delta: number // 本次导航的步数偏移
  cache?: boolean | undefined // 是否缓存目标页
  constCache?: boolean | undefined // 是否常驻缓存目标页
  destroy?: DestroyTarget | undefined // 导航前需要销毁的缓存
  metadata?: Readonly<Record<string, unknown>> | undefined // 导航附带的元数据
  channelId?: string | null | undefined // 关联的 eventChannel id
  targetTabKey?: string | null | undefined // switchTab 使用的目标 tab 身份
  sentAt: number // 写入意图的时间戳
}

// ---- 导航准备参数 ----

export interface PrepareNavigationParams {
  containerId: string // 本次导航命中的容器 id
  to: RouteLocationNormalizedLoaded // 目标路由
  from: RouteLocationNormalizedLoaded | null // 来源路由
  method: NavigationMethod // 结算后的导航方法
  direction: NavigationDirection // 结算后的导航方向
  delta: number // 结算后的导航步数
  hints: NavigationHints // 本次导航附带的缓存与通道提示
}

// ---- 导航提示 ----

export interface NavigationHints {
  cache?: boolean | undefined // 是否缓存目标页
  constCache?: boolean | undefined // 是否常驻缓存目标页
  destroy?: DestroyTarget | undefined // 导航前需要销毁的缓存
  metadata?: Readonly<Record<string, unknown>> | undefined // 导航元数据
  channelId?: string | null | undefined // 关联的 eventChannel id
  targetTabKey?: string | null | undefined // switchTab 使用的 tab 身份
}

// ---- 栈管理器输入输出 ----

export interface ApplyParams {
  containerId: string // 本次操作作用的容器 id
  to: RouteLocationNormalizedLoaded // 目标路由
  from: RouteLocationNormalized | null // 来源路由
  method: NavigationMethod // 本次执行的导航方法
  direction: NavigationDirection // 本次执行的导航方向
  delta: number // 本次执行的导航步数
  hints: NavigationHints // 本次执行附带的缓存与通道提示
}

export interface ApplyResult {
  added: import('./public').PageStackEntry[] // 新增的栈条目
  removed: import('./public').PageStackEntry[] // 被移除的栈条目
  updated: import('./public').PageStackEntry[] // 被更新的栈条目
}

// ---- 栈管理器接口 ----

export interface StackManager {
  apply(stack: import('./public').PageStackEntry[], params: ApplyParams): ApplyResult
}

// ---- EventChannel 注册表接口 ----

export interface ChannelRegistry {
  destroy(channelId: string): void
}

// ---- 导航提交事件 ----

export interface NavigationCommitEvent {
  id: string // 本次导航提交 id
  method: import('./public').NavigationMethod // 本次导航方法
  direction: import('./public').NavigationDirection // 本次导航方向
  delta: number // 本次导航步数
  containerId: string // 受影响的容器 id
  from: RouteLocationNormalizedLoaded | null // 来源路由
  to: RouteLocationNormalizedLoaded // 目标路由
  added: import('./public').PageStackEntry[] // 新增条目
  removed: import('./public').PageStackEntry[] // 移除条目
  updated: import('./public').PageStackEntry[] // 更新条目
  stackSize: number // 提交后的栈大小
  includeList: string[] // 提交后的 include 列表
  timestamp: number // 提交时间戳
}

// ---- history.state 中的 vue-keep 状态 ----

export interface VueKeepState {
  __vueKeepId: string // 条目 id
  __vueKeepPosition: number // 栈位置
  __vueKeepContainerId: string // 容器 id
}
