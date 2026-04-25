import type { RouteLocationNormalizedLoaded } from 'vue-router'

export interface ContainerInfo {
  containerId: string // 容器唯一标识
  depth: number // 嵌套层级
}

/**
 * 容器解析器
 * 管理多层 KeepRouterView 的注册与路由匹配
 */
export class ContainerResolver {
  private _containers = new Map<string, ContainerInfo>()

  /** 注册一个容器 */
  register(containerId: string, depth: number): void {
    this._containers.set(containerId, { containerId, depth })
  }

  /** 注销一个容器 */
  unregister(containerId: string): void {
    this._containers.delete(containerId)
  }

  /** 根据路由匹配深度解析出目标容器 */
  resolve(route: RouteLocationNormalizedLoaded): ContainerInfo | null {
    const matchedDepth = route.matched.length - 1
    for (const info of this._containers.values()) {
      if (info.depth === matchedDepth) {
        return info
      }
    }
    return null
  }

  /** 获取指定容器信息 */
  get(containerId: string): ContainerInfo | null {
    return this._containers.get(containerId) ?? null
  }

  /** 获取所有已注册容器 */
  getAll(): ContainerInfo[] {
    return Array.from(this._containers.values())
  }

  /** 已注册容器数量 */
  get size(): number {
    return this._containers.size
  }
}
