import type { Router } from 'vue-router'
import type {
  DestroyTarget,
  KeepLocation,
  KeepNavigateOptions,
  KeepNavigationGuard,
  KeepRouter,
} from '../types/public'
import type { CoreStore } from '../store/core-store'
import type { ChannelRegistry } from '../event-channel/registry'
import { IntentTracker } from './intent-tracker'
import { createKeepState } from '../store/persistence'
import { genId } from '../store/id-allocator'

export function createKeepMethods(
  router: Router,
  store: CoreStore,
  intentTracker: IntentTracker,
  channelRegistry: ChannelRegistry,
): KeepRouter {
  function resolveLocation(to: KeepLocation) {
    return typeof to === 'string' ? { path: to } : to
  }

  async function push(to: KeepLocation, opts?: KeepNavigateOptions) {
    const location = resolveLocation(to)
    const resolved = router.resolve(location)
    let channelId: string | null = null

    // 如果有 events，创建 EventChannel 并注册来源页面的监听器
    if (opts?.events) {
      channelId = genId()
      const channel = channelRegistry.create(channelId)
      for (const [event, handler] of Object.entries(opts.events)) {
        channel.on(event, handler)
      }
    }

    intentTracker.set({
      method: 'push',
      delta: 1,
      cache: opts?.cache,
      constCache: opts?.constCache,
      destroy: opts?.destroy,
      metadata: opts?.metadata,
      channelId,
      sentAt: Date.now(),
    })

    const state = createKeepState(genId(), Math.max(0, resolved.matched.length - 1), 'push')

    await router.push({ ...location, state })
  }

  async function replace(to: KeepLocation, opts?: KeepNavigateOptions) {
    const location = resolveLocation(to)
    const resolved = router.resolve(location)

    intentTracker.set({
      method: 'replace',
      delta: 0,
      cache: opts?.cache,
      constCache: opts?.constCache,
      destroy: opts?.destroy,
      metadata: opts?.metadata,
      sentAt: Date.now(),
    })

    const state = createKeepState(genId(), Math.max(0, resolved.matched.length - 1), 'replace')

    await router.replace({ ...location, state })
  }

  function back(delta: number = 1) {
    intentTracker.set({
      method: 'back',
      delta: -Math.abs(delta),
      sentAt: Date.now(),
    })
    router.go(-Math.abs(delta))
  }

  async function reLaunch(to: KeepLocation) {
    const location = resolveLocation(to)
    const resolved = router.resolve(location)

    intentTracker.set({
      method: 'reLaunch',
      delta: 0,
      sentAt: Date.now(),
    })

    const state = createKeepState(genId(), Math.max(0, resolved.matched.length - 1), 'reLaunch')

    await router.replace({ ...location, state })
  }

  async function switchTab(to: KeepLocation) {
    const location = resolveLocation(to)
    const resolved = router.resolve(location)

    const tabKey =
      (resolved.meta as any)?.keep?.tabKey ??
      (typeof resolved.name === 'string' ? resolved.name : null) ??
      resolved.path

    intentTracker.set({
      method: 'switchTab',
      delta: 0,
      targetTabKey: tabKey,
      sentAt: Date.now(),
    })

    const state = createKeepState(genId(), Math.max(0, resolved.matched.length - 1), 'switchTab')

    await router.replace({ ...location, state })
  }

  function destroy(target: DestroyTarget) {
    store.destroy(target)
  }

  function beforeEach(guard: KeepNavigationGuard): () => void {
    return store.addGuard(guard)
  }

  return {
    push,
    replace,
    back,
    reLaunch,
    switchTab,
    destroy,
    beforeEach,
  }
}
