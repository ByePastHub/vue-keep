import { setupDevtoolsPlugin } from '@vue/devtools-api'
import type { App } from 'vue'
import type { CoreStore } from '../store/core-store'
import { setupTimeline } from './timeline'
import { setupInspector } from './inspector'

const DEVTOOLS_PLUGIN_ID = 'vue-keep'
const DEVTOOLS_LABEL = 'Vue Keep'

export function setupDevtools(app: App, store: CoreStore): void {
  setupDevtoolsPlugin(
    {
      id: DEVTOOLS_PLUGIN_ID,
      label: DEVTOOLS_LABEL,
      packageName: '@bye_past/vue-keep',
      homepage: 'https://github.com/user/vue-keep',
      app,
      enableEarlyProxy: true,
    },
    (api) => {
      setupTimeline(api, store)
      setupInspector(api, store)
    },
  )
}
