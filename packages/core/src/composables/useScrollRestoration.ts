import { inject } from 'vue'
import { KEEP_STORE_KEY, CONTAINER_ID_KEY } from '../symbols'
import type { CoreStore } from '../store/core-store'
import { detectScrollContainers } from '../scroll/container-detect'
import { captureScrollPositions } from '../scroll/capture'
import { restoreScrollPositions } from '../scroll/restore'

export interface ScrollRestorationControls {
  save(): void
  restore(): Promise<void>
  pause(): void
  resume(): void
  registerContainer(selector: string): void
}

export function useScrollRestoration(): ScrollRestorationControls {
  const store = inject(KEEP_STORE_KEY) as CoreStore
  const cid = inject(CONTAINER_ID_KEY, 'keep:0:root:default')
  let paused = false

  return {
    save() {
      if (paused) return
      const entry = store.getCurrentEntry(cid)
      if (!entry) return
      const containers = detectScrollContainers()
      const positions = captureScrollPositions(containers)
      store.updateEntry(cid, entry.id, { scrollPositions: positions })
    },

    async restore() {
      const entry = store.getCurrentEntry(cid)
      if (!entry?.scrollPositions.size) return
      const containers = detectScrollContainers()
      await restoreScrollPositions(containers, entry.scrollPositions)
    },

    pause() {
      paused = true
    },

    resume() {
      paused = false
    },

    registerContainer(selector: string) {
      const entry = store.getCurrentEntry(cid)
      if (entry) {
        const existing = (entry.metadata.__scrollSelectors as string[] | undefined) ?? []
        if (!existing.includes(selector)) {
          store.updateEntry(cid, entry.id, {
            metadata: {
              ...entry.metadata,
              __scrollSelectors: [...existing, selector],
            },
          })
        }
      }
    },
  }
}
