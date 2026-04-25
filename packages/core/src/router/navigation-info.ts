import type { NavigationDirection, NavigationMethod } from '../types/public'
import type { NavigationInfo, NavigationIntent } from '../types/internal'

interface ResolvedNavigation {
  method: NavigationMethod
  direction: NavigationDirection
  delta: number
}

// 根据意图和 history.listen 信息解析最终导航方法/方向/步数
export function resolveNavigation(
  intent: NavigationIntent | null,
  info: NavigationInfo | null,
): ResolvedNavigation {
  // 有明确意图时，直接使用意图
  if (intent) {
    switch (intent.method) {
      case 'push':
        return { method: 'push', direction: 'forward', delta: intent.delta || 1 }
      case 'replace':
        return { method: 'replace', direction: 'none', delta: 0 }
      case 'back':
        return { method: 'back', direction: 'back', delta: intent.delta || -1 }
      case 'reLaunch':
        return { method: 'reLaunch', direction: 'none', delta: 0 }
      case 'switchTab':
        return { method: 'switchTab', direction: 'none', delta: 0 }
    }
  }

  // 无意图时，从 history.listen 信息推断
  if (info) {
    if (info.type === 'pop') {
      if (info.direction === 'back') {
        return { method: 'back', direction: 'back', delta: -(info.delta || 1) }
      }
      // pop + forward = 浏览器前进按钮
      return { method: 'push', direction: 'forward', delta: info.delta || 1 }
    }

    // info.type === 'push'
    if (info.direction === 'forward') {
      return { method: 'push', direction: 'forward', delta: 1 }
    }
    // push + unknown = replace 语义
    if (info.delta === 0) {
      return { method: 'replace', direction: 'none', delta: 0 }
    }
    return { method: 'push', direction: 'forward', delta: 1 }
  }

  // 无意图也无 info（初始化场景）
  return { method: 'push', direction: 'none', delta: 0 }
}
