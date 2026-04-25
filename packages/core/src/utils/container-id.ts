import type { RouteLocationNormalizedLoaded } from 'vue-router'

export interface ResolveContainerIdParams {
  depth: number // 当前 KeepRouterView 所在层级
  route: RouteLocationNormalizedLoaded // 当前命中的路由对象
  parentContainerId?: string | null // 父级容器 id
  viewName: string // RouterView 名称
}

/**
 * 生成容器 ID
 * 顶层容器：keep:0:root:${viewName}
 * 子层容器：keep:${depth}:${parentRecordKey}:${viewName}
 */
export function resolveContainerId(params: ResolveContainerIdParams): string {
  const { depth, route, viewName } = params

  if (depth === 0) {
    return `keep:0:root:${viewName}`
  }

  const parentRecord = route.matched[depth - 1]
  const parentRecordKey =
    (parentRecord?.name && typeof parentRecord.name === 'string'
      ? parentRecord.name
      : parentRecord?.path) ?? 'unknown'

  return `keep:${depth}:${parentRecordKey}:${viewName}`
}
