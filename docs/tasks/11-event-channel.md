# 模块 11：EventChannel 页面通信

> 阶段：Phase 2 | 预估：1 天 | 前置依赖：模块 04、08

## 目标

实现类似微信小程序 `EventChannel` 的页面间通信机制。允许 push 时传递事件监听器，目标页面通过 `emit` 回传数据给来源页面。通道与页面栈条目绑定，页面销毁时自动清理。

---

## 文件清单

| 文件                                               | 职责                   |
| -------------------------------------------------- | ---------------------- |
| `packages/core/src/event-channel/channel.ts`       | EventChannel 类实现    |
| `packages/core/src/event-channel/registry.ts`      | 通道注册表（全局管理） |
| `packages/core/src/event-channel/types.ts`         | 类型定义               |
| `packages/core/src/composables/useEventChannel.ts` | composable 封装        |

---

## 任务清单

### T11-01：EventChannel 类型定义

文件：`packages/core/src/event-channel/types.ts`

- [✅] 定义核心类型：

  ```ts
  // 事件处理器
  export type EventHandler<T = unknown> = (payload: T) => void

  // 事件通道接口
  export interface EventChannel<T extends Record<string, unknown> = Record<string, unknown>> {
    emit<K extends keyof T>(event: K, payload: T[K]): void // 触发事件
    on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): () => void // 注册监听
    once<K extends keyof T>(event: K, handler: EventHandler<T[K]>): () => void // 注册一次性监听
    off<K extends keyof T>(event: K, handler?: EventHandler<T[K]>): void // 移除监听
    destroy(): void // 销毁通道
  }

  // push 时传递的事件监听器
  export interface ChannelEvents {
    [event: string]: EventHandler // 事件名到监听器的映射
  }
  ```

**验收**：类型定义完整，泛型约束正确

### T11-02：EventChannel 类实现

文件：`packages/core/src/event-channel/channel.ts`

- [✅] 实现 EventChannel 类：

  ```ts
  export function createEventChannel<
    T extends Record<string, unknown> = Record<string, unknown>
  >(id: string): EventChannel<T> {
    const listeners = new Map<keyof T, Set<EventHandler>>()
    let destroyed = false

    function getListeners<K extends keyof T>(event: K): Set<EventHandler> {
      if (!listeners.has(event)) {
        listeners.set(event, new Set())
      }
      return listeners.get(event)!
    }

    return {
      emit<K extends keyof T>(event: K, payload: T[K]) {
        if (destroyed) {
          if (__DEV__) {
            warn(`[vue-keep] EventChannel(${id}) 已销毁，emit('${String(event)}') 被忽略`)
          }
          return
        }
        const handlers = listeners.get(event)
        if (handlers) {
          handlers.forEach(handler => handler(payload))
        }
      },

      on<K extends keyof T>(event: K, handler: EventHandler<T[K]>) {
        if (destroyed) return () =>
        const set = getListeners(event)
        set.add(handler as EventHandler)
        return () => set.delete(handler as EventHandler)
      },

      once<K extends keyof T>(event: K, handler: EventHandler<T[K]>) {
        const off = this.on(event, ((payload: T[K]) => {
          off()
          handler(payload)
        }) as EventHandler<T[K]>)
        return off
      },

      off<K extends keyof T>(event: K, handler?: EventHandler<T[K]>) {
        if (handler) {
          listeners.get(event)?.delete(handler as EventHandler)
        } else {
          listeners.delete(event)
        }
      },

      destroy() {
        destroyed = true
        listeners.clear()
      },
    }
  }
  ```

- [✅] `emit`：触发指定事件的所有监听器
- [✅] `on`：注册监听器，返回取消函数
- [✅] `once`：注册一次性监听器
- [✅] `off`：移除指定监听器，不传 handler 则移除该事件的所有监听器
- [✅] `destroy`：销毁通道，清理所有监听器，后续 emit 被忽略

**验收**：

- [✅] `on('submit', handler)` → `emit('submit', data)` → handler 被调用
- [✅] `once('submit', handler)` → 第二次 emit 不触发
- [✅] `off('submit', handler)` 后 emit 不触发
- [✅] `off('submit')` 移除所有 submit 监听器
- [✅] `destroy()` 后 emit 被忽略且开发模式打印警告

### T11-03：通道注册表

文件：`packages/core/src/event-channel/registry.ts`

- [✅] 实现全局通道注册表：

  ```ts
  export function createChannelRegistry() {
    const channels = new Map<string, EventChannel>()

    return {
      // 创建并注册通道
      create<T extends Record<string, unknown>>(id: string): EventChannel<T> {
        const channel = createEventChannel<T>(id)
        channels.set(id, channel as EventChannel)
        return channel
      },

      // 获取通道
      get(id: string): EventChannel | undefined {
        return channels.get(id)
      },

      // 销毁通道
      destroy(id: string): void {
        const channel = channels.get(id)
        if (channel) {
          channel.destroy()
          channels.delete(id)
        }
      },

      // 清空所有通道
      clear(): void {
        channels.forEach((ch) => ch.destroy())
        channels.clear()
      },

      // 通道数量（调试用）
      get size(): number {
        return channels.size
      },
    }
  }
  ```

- [✅] 通道 ID 与 PageStackEntry 的 `channelId` 关联
- [✅] 在 plugin 中创建 registry，并通过 `CHANNEL_REGISTRY_KEY` provide 给 composables
- [✅] 页面栈条目被移除时，自动销毁对应通道

**验收**：

- [✅] `create('ch-1')` 后 `get('ch-1')` 返回通道
- [✅] `destroy('ch-1')` 后 `get('ch-1')` 返回 undefined
- [✅] `clear()` 后所有通道被销毁

### T11-04：与 keepRouter.push 集成

文件：`packages/core/src/router/methods.ts`（修改）

- [✅] 扩展 `push` 方法支持 events 参数：

  ```ts
  async push(to: KeepLocation, opts?: KeepNavigateOptions) {
    const location = typeof to === 'string' ? { path: to } : to
    const resolved = router.resolve(location)
    let channelId: string | null = null

    // 如果有 events，创建 EventChannel
    if (opts?.events) {
      channelId = genId()
      const channel = channelRegistry.create(channelId)
      // 注册来源页面的事件监听器
      for (const [event, handler] of Object.entries(opts.events)) {
        channel.on(event, handler)
      }
    }

    intentTracker.set({
      method: 'push',
      delta: 1,
      cache: opts?.cache,
      constCache: opts?.constCache,
      destroy: opts?.destroy,
      metadata: opts?.metadata,
      channelId,
      sentAt: Date.now(),
    })

    const state = createKeepState(
      genId(),
      Math.max(0, resolved.matched.length - 1),
      'push',
    )

    await router.push({
      ...location,
      state,
    })
  }
  ```

- [✅] 使用方式：
  ```ts
  keepRouter.push('/form', {
    events: {
      formSubmitted: (data) => {
        console.log('表单提交了', data)
      },
    },
  })
  ```

**验收**：

- [✅] push 时传递 events，目标页面 emit 后来源页面收到数据
- [✅] 不传 events 时行为不变

### T11-05：useEventChannel composable

文件：`packages/core/src/composables/useEventChannel.ts`

- [✅] 实现：

  ```ts
  export function useEventChannel<
    T extends Record<string, unknown> = Record<string, unknown>,
  >(): EventChannel<T> | null {
    const store = inject(KEEP_STORE_KEY)!
    const cid = inject(CONTAINER_ID_KEY, 'keep:0:root:default')

    const entry = store.getCurrentEntry(cid)
    if (!entry?.channelId) return null

    const registry = inject(CHANNEL_REGISTRY_KEY)!
    const channel = registry.get(entry.channelId)

    return (channel as EventChannel<T>) ?? null
  }
  ```

- [✅] 在目标页面中使用：

  ```ts
  // 在被 push 到的页面中
  const channel = useEventChannel<{ formSubmitted: FormData }>()

  function handleSubmit(data: FormData) {
    channel?.emit('formSubmitted', data)
    keepRouter.back()
  }
  ```

- [✅] 如果当前页面没有关联的 EventChannel，返回 null

**验收**：

- [✅] 在有 channel 的页面中返回 EventChannel 实例
- [✅] 在无 channel 的页面中返回 null
- [✅] emit 后来源页面的 handler 被调用
- [✅] 页面销毁后 channel 自动清理

### T11-06：自动清理

文件：`packages/core/src/store/stack-manager.ts`（修改）

- [✅] 在栈条目被移除时（Back、ReLaunch、evict、LRU 淘汰），自动销毁关联的 EventChannel：
  ```ts
  // 在 applyBack、applyReLaunch、evict 等方法中
  for (const removed of removedEntries) {
    if (removed.channelId) {
      channelRegistry.destroy(removed.channelId)
    }
  }
  ```
- [✅] 确保不会内存泄漏

**验收**：

- [✅] back 后来源页面的 channel 被销毁
- [✅] reLaunch 后所有 channel 被销毁
- [✅] LRU 淘汰的条目的 channel 被销毁
- [✅] 销毁后 emit 不报错（静默忽略）

### T11-07：TypeScript 声明合并支持

文件：`packages/core/src/types/public.ts`（补充）

- [✅] 支持用户通过声明合并定义全局事件类型：
  ```ts
  // 用户可以在自己的项目中扩展
  declare module '@bye_past/vue-keep' {
    interface PageEventMap {
      '/form': {
        // 表单页的事件定义
        formSubmitted: {
          // 表单提交事件
          name: string // 表单字段名
          value: string // 表单字段值
        }
      }
      '/picker': {
        // 选择器页的事件定义
        itemSelected: {
          // 选择项回传事件
          id: number // 被选中项的主键
        }
      }
    }
  }
  ```
- [ ] 推荐写法：
  ```ts
  const channel = useEventChannel<PageEventMap['/form']>()
  ```
- [ ] 没有声明合并时继续使用泛型参数
- [ ] 当前阶段不承诺基于运行时 route 自动零成本推断类型，避免过度设计

**验收**：

- [ ] 声明合并后 `useEventChannel<PageEventMap['/form']>()` 拿到精确类型
- [ ] 不声明合并时通过泛型参数获得类型安全

---

## 完成标准

- [ ] EventChannel 支持 emit/on/once/off/destroy
- [ ] 与 keepRouter.push 的 events 参数集成
- [ ] useEventChannel composable 在目标页面中可用
- [ ] 页面销毁时自动清理通道
- [ ] TypeScript 类型安全（泛型 + 声明合并）
- [ ] 单元测试覆盖：emit/on/once/off、销毁后行为、自动清理
- [ ] `pnpm typecheck` 通过
