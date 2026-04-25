import type { EventChannel } from './types'
import { createEventChannel } from './channel'

export function createChannelRegistry() {
  const channels = new Map<string, EventChannel>()

  return {
    create<T extends Record<string, unknown> = Record<string, unknown>>(
      id: string,
    ): EventChannel<T> {
      const channel = createEventChannel<T>(id)
      channels.set(id, channel as EventChannel)
      return channel
    },

    get(id: string): EventChannel | undefined {
      return channels.get(id)
    },

    destroy(id: string): void {
      const channel = channels.get(id)
      if (channel) {
        channel.destroy()
        channels.delete(id)
      }
    },

    clear(): void {
      channels.forEach((ch) => ch.destroy())
      channels.clear()
    },

    get size(): number {
      return channels.size
    },
  }
}

export type ChannelRegistry = ReturnType<typeof createChannelRegistry>
