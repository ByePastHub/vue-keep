import type { KeepOptions, KeepOptionsResolved } from '../types/public'

declare const __DEV__: boolean | undefined

/**
 * 将用户传入的 KeepOptions 填充默认值
 */
export function resolveOptions(raw: KeepOptions): KeepOptionsResolved {
  return {
    router: raw.router,
    max: raw.max ?? 10,
    exclude: raw.exclude,
    include: raw.include,
    scrollBehavior: raw.scrollBehavior ?? 'auto',
    persist: raw.persist ?? true,
    transition: raw.transition ?? 'slide',
    devtools: raw.devtools ?? (typeof __DEV__ !== 'undefined' && __DEV__),
    namespace: raw.namespace ?? '[vue-keep]',
    disableFirstTransition: raw.disableFirstTransition ?? true,
    onBeforeEvict: raw.onBeforeEvict,
  }
}
