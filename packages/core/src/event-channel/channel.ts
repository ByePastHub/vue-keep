import type { EventChannel, EventHandler } from './types'
import { warn } from '../utils/warn'

declare const __DEV__: boolean | undefined

export function createEventChannel<T extends Record<string, unknown> = Record<string, unknown>>(
  id: string,
): EventChannel<T> {
  const listeners = new Map<keyof T, Set<EventHandler>>()
  let destroyed = false

  function getListeners<K extends keyof T>(event: K): Set<EventHandler> {
    if (!listeners.has(event)) {
      listeners.set(event, new Set())
    }
    return listeners.get(event)!
  }

  const channel: EventChannel<T> = {
    emit<K extends keyof T>(event: K, payload: T[K]) {
      if (destroyed) {
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
          warn(`EventChannel(${id}) 已销毁，emit('${String(event)}') 被忽略`)
        }
        return
      }
      const handlers = listeners.get(event)
      if (handlers) {
        handlers.forEach((handler) => handler(payload))
      }
    },

    on<K extends keyof T>(event: K, handler: EventHandler<T[K]>) {
      if (destroyed) return () => {}
      const set = getListeners(event)
      set.add(handler as EventHandler)
      return () => set.delete(handler as EventHandler)
    },

    once<K extends keyof T>(event: K, handler: EventHandler<T[K]>) {
      const off = channel.on(event, ((payload: T[K]) => {
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

  return channel
}
