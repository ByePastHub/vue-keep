import { inject } from 'vue'
import { KEEP_STORE_KEY, CONTAINER_ID_KEY, CHANNEL_REGISTRY_KEY } from '../symbols'
import type { CoreStore } from '../store/core-store'
import type { EventChannel } from '../event-channel/types'
import type { ChannelRegistry } from '../event-channel/registry'

// 延迟解析 channel，因为 setup() 阶段 entry 可能还未入栈
export function useEventChannel<
  T extends Record<string, unknown> = Record<string, unknown>,
>(): EventChannel<T> {
  const store = inject(KEEP_STORE_KEY) as CoreStore
  const cid = inject(CONTAINER_ID_KEY, 'keep:0:root:default')
  const registry = inject(CHANNEL_REGISTRY_KEY) as ChannelRegistry | undefined

  function resolve(): EventChannel<T> | null {
    if (!registry) return null
    const entry = store.getCurrentEntry(cid)
    if (!entry?.channelId) return null
    return (registry.get(entry.channelId) as EventChannel<T>) ?? null
  }

  return {
    emit(event, payload) {
      resolve()?.emit(event, payload)
    },
    on(event, handler) {
      return resolve()?.on(event, handler) ?? (() => {})
    },
    once(event, handler) {
      return resolve()?.once(event, handler) ?? (() => {})
    },
    off(event, handler) {
      resolve()?.off(event, handler)
    },
    destroy() {
      resolve()?.destroy()
    },
  }
}
