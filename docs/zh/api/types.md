# 类型参考

## 导航方向

```ts
const NavigationDirection = {
  Forward: 'forward',
  Back: 'back',
  None: 'none',
} as const
type NavigationDirection = 'forward' | 'back' | 'none'
```

## 导航方式

```ts
const NavigationMethod = {
  Push: 'push',
  Replace: 'replace',
  Back: 'back',
  ReLaunch: 'reLaunch',
  SwitchTab: 'switchTab',
} as const
type NavigationMethod = 'push' | 'replace' | 'back' | 'reLaunch' | 'switchTab'
```

## ScrollPosition

```ts
interface ScrollPosition {
  left: number
  top: number
  scrollWidth?: number
  scrollHeight?: number
}
```

## PageStackEntry

```ts
interface PageStackEntry {
  id: string
  position: number
  fullPath: string
  name: string
  route: Readonly<RouteLocationNormalizedLoaded>
  constCache: boolean
  tabKey: string | null
  depth: number
  createdAt: number
  lastActiveAt: number
  scrollPositions: Map<string, ScrollPosition>
  channelId: string | null
  metadata: Readonly<Record<string, unknown>>
}
```

## NameMatcher

```ts
type NameMatcher =
  | string
  | RegExp
  | (string | RegExp)[]
  | ((name: string, route: RouteLocationNormalized) => boolean)
```

## TransitionPreset

```ts
type TransitionPreset = 'slide' | 'fade' | 'zoom'
```

## TransitionConfig

```ts
interface TransitionConfig {
  name?: string | ((direction: NavigationDirection) => string)
  mode?: 'out-in' | 'in-out' | 'default'
  appear?: boolean
  duration?: number | { enter: number; leave: number }
  onBeforeEnter?: (el: Element) => void
  onAfterEnter?: (el: Element) => void
  onBeforeLeave?: (el: Element) => void
  onAfterLeave?: (el: Element) => void
}
```

## ScrollBehaviorStrategy

```ts
type ScrollBehaviorStrategy = 'auto' | 'always' | 'none' | ScrollBehaviorFn

type ScrollBehaviorFn = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  direction: NavigationDirection,
  savedPositions: ReadonlyMap<string, ScrollPosition>,
) => ScrollPosition | ScrollPosition[] | false | Promise<ScrollPosition | false>
```

## DestroyTarget

```ts
type DestroyTarget = string | string[] | 'ALL' | ((entry: PageStackEntry) => boolean)
```

## KeepLocation

```ts
type KeepLocation = string | RouteLocationRaw
```

## 声明合并

### 扩展 RouteMeta

```ts
// types/router.d.ts
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    keep?:
      | {
          constCache?: boolean
          tabKey?: string
        }
      | false
  }
}
```

### 扩展 PageEventMap

```ts
// types/vue-keep.d.ts
declare module '@bye_past/vue-keep' {
  interface PageEventMap {
    onSave: (data: SaveData) => void
    onCancel: () => void
  }
}
```
