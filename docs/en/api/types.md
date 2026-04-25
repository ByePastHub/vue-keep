# Type Reference

All public types are exported from `@bye_past/vue-keep`.

```ts
import type {
  NavigationDirection,
  NavigationMethod,
  ScrollPosition,
  PageStackEntry,
  NameMatcher,
  TransitionPreset,
  TransitionConfig,
  ScrollBehaviorStrategy,
  DestroyTarget,
  KeepLocation,
  KeepOptions,
  KeepNavigateOptions,
  KeepRouter,
  PageShowContext,
  PageHideContext,
} from '@bye_past/vue-keep'
```

## NavigationDirection

```ts
const NavigationDirection = {
  Forward: 'forward',
  Back: 'back',
  None: 'none',
} as const

type NavigationDirection = 'forward' | 'back' | 'none'
```

## NavigationMethod

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
  left: number // Horizontal scroll offset
  top: number // Vertical scroll offset
  scrollWidth?: number // Container width at capture time (for proportional restore)
  scrollHeight?: number // Container height at capture time
}
```

## PageStackEntry

```ts
interface PageStackEntry {
  id: string // Unique ID bound to history.state.__vueKeepId
  position: number // Index in the stack
  fullPath: string // Route fullPath
  name: string // Route/component name (KeepAlive include key)
  route: Readonly<RouteLocationNormalizedLoaded> // Full route snapshot
  constCache: boolean // Permanently cached (immune to LRU eviction)
  tabKey: string | null // Stable tab identity for switchTab
  depth: number // Nesting level (top-level is 0)
  createdAt: number // Creation timestamp
  lastActiveAt: number // Last activation timestamp (LRU basis)
  scrollPositions: Map<string, ScrollPosition> // Scroll container position map
  channelId: string | null // Associated EventChannel instance ID
  metadata: Readonly<Record<string, unknown>> // User-defined metadata
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

Used by `include` / `exclude` options to match component names.

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
type DestroyTarget =
  | string // By component name
  | string[] // Multiple names
  | 'ALL' // All cached pages
  | ((entry: PageStackEntry) => boolean) // Predicate
```

## KeepLocation

```ts
type KeepLocation = string | RouteLocationRaw
```

## Declaration Merging

### RouteMeta

Vue Keep extends Vue Router's `RouteMeta`:

```ts
declare module 'vue-router' {
  interface RouteMeta {
    keep?: {
      cache?: boolean // Cache this route page
      constCache?: boolean // Permanently cache this route page
      destroy?: string | string[] | 'ALL'
      exclude?: boolean // Exclude this route from caching
      tabKey?: string // Stable tab identity for switchTab
    }
  }
}
```

Usage in route config:

```ts
const routes = [
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('./views/Settings.vue'),
    meta: {
      keep: { constCache: true },
    },
  },
]
```

### ComponentCustomProperties

```ts
declare module 'vue' {
  interface ComponentCustomProperties {
    $keepRouter: KeepRouter
  }
}
```

Access in Options API:

```ts
export default {
  methods: {
    goDetail() {
      this.$keepRouter.push('/detail/1')
    },
  },
}
```

### PageEventMap

Extend for type-safe EventChannel:

```ts
declare module '@bye_past/vue-keep' {
  interface PageEventMap {
    select: string
    confirm: { id: number; value: string }
  }
}
```
