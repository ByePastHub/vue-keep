import { nextTick } from 'vue'
import type { ScrollPosition } from '../types/public'
import { ensureDocumentScrollSpace, cleanupDocumentScrollSpace } from './document-placeholder'
import { applyPositions, watchResize } from './resize-watcher'

// 维护当前进行中的恢复任务，新的恢复启动时先中断上一次，避免上一次的 ResizeObserver 或 setTimeout 在新页面上误改滚动位置
let activeAbort: (() => void) | null = null

// 三道防线恢复滚动位置
export async function restoreScrollPositions(
  containers: Element[],
  positions: Map<string, ScrollPosition>,
  options?: { timeout?: number },
): Promise<void> {
  // 中断上一次仍在进行的恢复，防止其残留的 observer/timer 闭包用旧 positions 覆盖新的滚动位置
  activeAbort?.()

  const timeout = options?.timeout ?? 600

  let canceled = false
  let observerCleanup: (() => void) | null = null
  let timer: ReturnType<typeof setTimeout> | null = null

  const shouldCleanupDocumentSpace = ensureDocumentScrollSpace(positions)

  const abort = () => {
    if (canceled) return
    canceled = true
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    observerCleanup?.()
    cleanupDocumentScrollSpace(shouldCleanupDocumentSpace)
  }
  activeAbort = abort

  // 第一道防线：同步恢复，避免缓存页先以顶部位置绘制一帧
  applyPositions(containers, positions)

  // 第二道防线：nextTick 后再次恢复，覆盖 DOM 激活后的尺寸变化
  await nextTick()
  if (canceled) return
  applyPositions(containers, positions)

  // 第三道防线：ResizeObserver 监听高度变化
  const { promise, cleanup } = watchResize(containers, positions)
  observerCleanup = cleanup

  // 第四道防线：超时兜底
  timer = setTimeout(() => {
    if (canceled) return
    applyPositions(containers, positions)
    cleanup()
  }, timeout)

  await Promise.race([promise, new Promise<void>((r) => setTimeout(r, timeout))])
  if (canceled) return
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  applyPositions(containers, positions)
  cleanup()
  cleanupDocumentScrollSpace(shouldCleanupDocumentSpace)

  if (activeAbort === abort) activeAbort = null
}
