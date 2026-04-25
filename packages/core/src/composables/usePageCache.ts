import { inject, computed } from 'vue'
import { KEEP_STORE_KEY, CONTAINER_ID_KEY } from '../symbols'
import type { CoreStore } from '../store/core-store'

export function usePageCache(containerId?: string) {
  const store = inject(KEEP_STORE_KEY) as CoreStore
  const injectedContainerId = inject(CONTAINER_ID_KEY, undefined)
  const cid = containerId ?? injectedContainerId ?? 'keep:0:root:default'

  const currentEntry = computed(() => store.getCurrentEntry(cid))

  return {
    isCached: computed(() => {
      const entry = currentEntry.value
      if (!entry) return false
      return store.getIncludeList(cid).includes(entry.name)
    }),

    markAsCached() {
      const entry = currentEntry.value
      if (entry) {
        store.ensureInStack(cid, entry)
      }
    },

    removeFromCache() {
      const entry = currentEntry.value
      if (entry) {
        store.destroy((e) => e.id === entry.id)
      }
    },

    setConstCache(value: boolean) {
      const entry = currentEntry.value
      if (entry) {
        store.updateEntry(cid, entry.id, { constCache: value })
      }
    },
  }
}
