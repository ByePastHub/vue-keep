import type { CoreStore } from '../store/core-store'

const TIMELINE_LAYER_ID = 'vue-keep:navigations'

export function setupTimeline(api: any, store: CoreStore): void {
  api.addTimelineLayer({
    id: TIMELINE_LAYER_ID,
    label: 'Vue Keep Navigations',
    color: 0x42b883,
  })

  store.onNavigationCommit((nav) => {
    api.addTimelineEvent({
      layerId: TIMELINE_LAYER_ID,
      event: {
        time: Date.now(),
        title: `${nav.method} → ${nav.to.fullPath}`,
        subtitle: `direction: ${nav.direction}`,
        data: {
          method: nav.method,
          direction: nav.direction,
          delta: nav.delta,
          from: nav.from?.fullPath ?? '(none)',
          to: nav.to.fullPath,
          stackSize: nav.stackSize,
          includeList: nav.includeList,
        },
        groupId: nav.id,
      },
    })
  })
}
