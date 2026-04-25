import {
  defineComponent,
  inject,
  ref,
  onMounted,
  onActivated,
  onDeactivated,
  type PropType,
  type ComponentPublicInstance,
} from 'vue'
import { isBrowser } from '../utils/env'
import { KEEP_STORE_KEY, KEEP_OPTIONS_KEY } from '../symbols'
import type { CoreStore } from '../store/core-store'
import type { KeepOptionsResolved } from '../types/public'
import { detectScrollContainers } from '../scroll/container-detect'
import { captureScrollPositions } from '../scroll/capture'
import { restoreScrollPositions } from '../scroll/restore'

export const KeepPageShell = defineComponent({
  name: 'KeepPageShell',
  props: {
    containerId: { type: String, required: true },
    entryId: { type: String, default: '' },
    scrollContainers: { type: Array as PropType<string[]> },
  },
  setup(props, { slots }) {
    const store = inject(KEEP_STORE_KEY) as CoreStore
    const options = inject(KEEP_OPTIONS_KEY, null) as KeepOptionsResolved | null
    const componentRef = ref<ComponentPublicInstance | null>(null)

    function getExtraSelectors(): string[] {
      const entry = store.getCurrentEntry(props.containerId)
      const fromProps = props.scrollContainers ?? []
      const fromMeta = (entry?.metadata.__scrollSelectors as string[] | undefined) ?? []
      return [...fromProps, ...fromMeta]
    }

    onMounted(() => {
      if (!isBrowser || options?.scrollBehavior === 'none') return
      const containers = detectScrollContainers(componentRef.value?.$el, getExtraSelectors())
      for (const el of containers) {
        if (el === document.scrollingElement || el === document.documentElement) {
          window.scrollTo({ top: 0, left: 0 })
        } else {
          el.scrollTop = 0
          el.scrollLeft = 0
        }
      }
    })

    onActivated(() => {
      if (options?.scrollBehavior === 'none') return
      const entry = store.getCurrentEntry(props.containerId)
      if (entry?.scrollPositions.size) {
        const containers = detectScrollContainers(componentRef.value?.$el, getExtraSelectors())
        restoreScrollPositions(containers, entry.scrollPositions)
      }
    })

    onDeactivated(() => {
      if (options?.scrollBehavior === 'none') return
      const entry = store.getCurrentEntry(props.containerId)
      if (entry) {
        const containers = detectScrollContainers(componentRef.value?.$el, getExtraSelectors())
        const positions = captureScrollPositions(containers)
        store.updateEntry(props.containerId, entry.id, {
          scrollPositions: positions,
        })
      }
    })

    return () => {
      const content = slots.default?.()
      return content
    }
  },
})
