import type { RouterScrollBehavior } from 'vue-router'
import type { NavigationDirection, NavigationMethod } from '../types/public'

export function createKeepScrollBehavior(
  getDirection: () => NavigationDirection,
  fallback?: RouterScrollBehavior,
  getMethod?: () => NavigationMethod | null | undefined,
): RouterScrollBehavior {
  return (to, from, savedPosition) => {
    const method = getMethod?.()
    if (getDirection() === 'back') {
      return false
    }
    if (method === 'switchTab') {
      return false
    }
    if (fallback) {
      return fallback(to, from, savedPosition)
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
}
