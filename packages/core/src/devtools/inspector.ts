import type { CoreStore } from '../store/core-store'

const INSPECTOR_ID = 'vue-keep:stacks'

export function setupInspector(api: any, store: CoreStore): void {
  api.addInspector({
    id: INSPECTOR_ID,
    label: 'Vue Keep Stacks',
    icon: 'layers',
  })

  api.on.getInspectorTree((payload: any) => {
    if (payload.inspectorId !== INSPECTOR_ID) return

    const nodes: any[] = []
    for (const [containerId, stack] of store.state.stacks) {
      nodes.push({
        id: containerId,
        label: containerId,
        tags: [
          {
            label: `${stack.length} pages`,
            textColor: 0xffffff,
            backgroundColor: 0x42b883,
          },
        ],
        children: stack.map((entry, index) => ({
          id: `${containerId}:${entry.id}`,
          label: entry.name,
          tags: [
            ...(entry.constCache
              ? [{ label: 'constCache', textColor: 0xffffff, backgroundColor: 0xe6a23c }]
              : []),
            ...(index === stack.length - 1
              ? [{ label: 'active', textColor: 0xffffff, backgroundColor: 0x409eff }]
              : []),
          ],
        })),
      })
    }
    payload.rootNodes = nodes
  })

  api.on.getInspectorState((payload: any) => {
    if (payload.inspectorId !== INSPECTOR_ID) return

    const nodeId = payload.nodeId as string
    const sepIdx = nodeId.indexOf(':')

    if (sepIdx === -1) {
      const stack = store.getStack(nodeId)
      payload.state = {
        容器信息: [
          { key: 'containerId', value: nodeId },
          { key: 'stackSize', value: stack.length },
          { key: 'includeList', value: store.getIncludeList(nodeId) },
        ],
      }
      return
    }

    const containerId = nodeId.slice(0, sepIdx)
    const entryId = nodeId.slice(sepIdx + 1)
    const stack = store.getStack(containerId)
    const entry = stack.find((e) => e.id === entryId)
    if (!entry) return

    payload.state = {
      基本信息: [
        { key: 'id', value: entry.id },
        { key: 'name', value: entry.name },
        { key: 'fullPath', value: entry.fullPath },
        { key: 'position', value: entry.position },
        { key: 'depth', value: entry.depth },
        { key: 'constCache', value: entry.constCache, editable: true },
      ],
      时间: [
        { key: 'createdAt', value: new Date(entry.createdAt).toLocaleString() },
        { key: 'lastActiveAt', value: new Date(entry.lastActiveAt).toLocaleString() },
      ],
      路由: [
        { key: 'route.name', value: entry.route.name },
        { key: 'route.path', value: entry.route.path },
        { key: 'route.query', value: entry.route.query },
        { key: 'route.params', value: entry.route.params },
        { key: 'route.meta', value: entry.route.meta },
      ],
      滚动位置: Array.from(entry.scrollPositions.entries()).map(([key, pos]) => ({
        key,
        value: `top: ${pos.top}, left: ${pos.left}`,
      })),
      元数据: [
        { key: 'metadata', value: entry.metadata },
        { key: 'channelId', value: entry.channelId },
      ],
    }
  })

  api.on.editInspectorState((payload: any) => {
    if (payload.inspectorId !== INSPECTOR_ID) return

    const nodeId = payload.nodeId as string
    const sepIdx = nodeId.indexOf(':')
    if (sepIdx === -1) return

    const containerId = nodeId.slice(0, sepIdx)
    const entryId = nodeId.slice(sepIdx + 1)

    if (payload.path[0] === '基本信息' && payload.path[1] === 'constCache') {
      store.updateEntry(containerId, entryId, {
        constCache: payload.state.value,
      })
      api.sendInspectorState(INSPECTOR_ID)
    }
  })

  store.onStateChange(() => {
    api.sendInspectorTree(INSPECTOR_ID)
    api.sendInspectorState(INSPECTOR_ID)
  })
}
