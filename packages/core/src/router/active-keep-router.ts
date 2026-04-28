import type { KeepRouter } from '../types/public'

let activeKeepRouter: KeepRouter | null = null

/** 设置当前默认 KeepRouter 实例 */
export function setActiveKeepRouter(keepRouter: KeepRouter): void {
  activeKeepRouter = keepRouter
}

/** 在应用卸载时清理当前默认 KeepRouter 实例 */
export function unsetActiveKeepRouter(keepRouter: KeepRouter): void {
  if (activeKeepRouter === keepRouter) {
    activeKeepRouter = null
  }
}

/** 获取当前默认 KeepRouter 实例 */
export function getActiveKeepRouter(): KeepRouter | null {
  return activeKeepRouter
}
