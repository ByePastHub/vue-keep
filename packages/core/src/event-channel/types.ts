export type EventHandler<T = unknown> = (payload: T) => void

export interface EventChannel<T extends Record<string, unknown> = Record<string, unknown>> {
  emit<K extends keyof T>(event: K, payload: T[K]): void
  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): () => void
  once<K extends keyof T>(event: K, handler: EventHandler<T[K]>): () => void
  off<K extends keyof T>(event: K, handler?: EventHandler<T[K]>): void
  destroy(): void
}

export interface ChannelEvents {
  [event: string]: EventHandler
}
