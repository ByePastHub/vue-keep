import type { RouteLocationNormalized } from 'vue-router'
import type { NameMatcher } from '../types/public'

/**
 * 判断给定 name 是否匹配 matcher 规则
 */
export function matchName(
  matcher: NameMatcher,
  name: string,
  route?: RouteLocationNormalized,
): boolean {
  if (typeof matcher === 'string') {
    return matcher === name
  }
  if (matcher instanceof RegExp) {
    return matcher.test(name)
  }
  if (Array.isArray(matcher)) {
    return matcher.some((m) => (typeof m === 'string' ? m === name : m.test(name)))
  }
  if (typeof matcher === 'function') {
    return matcher(name, route!)
  }
  return false
}
