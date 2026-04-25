import { inject, computed } from 'vue'
import { KEEP_STORE_KEY, CONTAINER_ID_KEY, DEPTH_KEY } from '../symbols'
import type { CoreStore } from '../store/core-store'
import type { PageStackEntry } from '../types/public'

export function usePageStack(containerId?: string) {
  const store = inject(KEEP_STORE_KEY) as CoreStore
  const depth = inject(DEPTH_KEY, 0)
  const injectedContainerId = inject(CONTAINER_ID_KEY, undefined)
  const cid = containerId ?? injectedContainerId ?? 'keep:0:root:default'

  return {
    stack: computed(() => store.getStack(cid)),
    current: computed(() => store.getCurrentEntry(cid)),
    size: computed(() => store.getStack(cid).length),
    depth,
    containerId: cid,

    has(name: string): boolean {
      return store.getStack(cid).some((e) => e.name === name)
    },

    find(name: string): Readonly<PageStackEntry> | undefined {
      return store.getStack(cid).find((e) => e.name === name)
    },
  }
}
