# Cache Control

`@bye_past/vue-keep` offers multiple layers of cache control — from static route config to runtime APIs.

## Route-Level Config (`route.meta.keep`)

Define caching behavior directly in your route definitions:

```ts
const routes = [
  {
    path: '/home',
    component: Home,
    meta: {
      keep: {
        cache: true, // Enable caching for this route (default: true)
        constCache: true, // Permanently cached, immune to LRU eviction
        exclude: true, // Exclude this route from caching entirely
        tabKey: 'home', // Stable identity for switchTab
        destroy: 'Detail', // Destroy named cache when entering this route
      },
    },
  },
]
```

| Field        | Type                          | Default | Description                             |
| ------------ | ----------------------------- | ------- | --------------------------------------- |
| `cache`      | `boolean`                     | `true`  | Whether this page should be cached      |
| `constCache` | `boolean`                     | `false` | Permanent cache, survives LRU eviction  |
| `exclude`    | `boolean`                     | `false` | Completely exclude from caching         |
| `tabKey`     | `string`                      | —       | Stable tab identity for `switchTab`     |
| `destroy`    | `string \| string[] \| 'ALL'` | —       | Destroy caches when entering this route |

## Navigation-Time Control

Override cache behavior per navigation call:

```ts
const keepRouter = useKeepRouter()

// Don't cache the target page
await keepRouter.push('/temp-page', { cache: false })

// Mark as permanently cached
await keepRouter.push('/important', { constCache: true })

// Destroy specific caches before navigating
await keepRouter.push('/home', { destroy: ['Detail', 'Settings'] })

// Destroy all caches
await keepRouter.push('/login', { destroy: 'ALL' })
```

Priority (highest to lowest):

1. `beforeEach` guard return values
2. Navigation-time options (`push`/`replace` options)
3. Route meta config (`route.meta.keep`)

## usePageCache

A composable for controlling the current page's cache from within the component:

```ts
import { usePageCache } from '@bye_past/vue-keep'

const { isCached, markAsCached, removeFromCache, setConstCache } = usePageCache()

// Check if current page is cached
console.log(isCached.value)

// Manually add current page to cache
markAsCached()

// Remove current page from cache
removeFromCache()

// Toggle permanent cache
setConstCache(true)
setConstCache(false)
```

## destroy Method

Programmatically destroy cached pages:

```ts
const keepRouter = useKeepRouter()

// By component name
keepRouter.destroy('Detail')

// Multiple names
keepRouter.destroy(['Detail', 'Settings'])

// All caches
keepRouter.destroy('ALL')

// Conditional — destroy pages matching a predicate
keepRouter.destroy((entry) => entry.metadata.temporary === true)
```

The `DestroyTarget` type:

```ts
type DestroyTarget =
  | string // By component name
  | string[] // Multiple names
  | 'ALL' // Everything
  | ((entry: PageStackEntry) => boolean) // Predicate function
```

## Global Exclude / Include

Control which pages are eligible for caching at the plugin level:

```ts
import { createKeepRouter } from '@bye_past/vue-keep'

const keepPlugin = createKeepRouter({
  router,
  exclude: /^Admin/, // Regex: exclude all Admin* pages
  include: ['Home', 'Detail', 'List'], // Only cache these pages
})
```

Per-container overrides via `<KeepRouterView>` props:

```vue
<KeepRouterView :exclude="['DebugPanel']" :include="(name, route) => !route.meta.noCache" />
```

The `NameMatcher` type supports multiple formats:

```ts
type NameMatcher =
  | string // Exact name match
  | RegExp // Regex match
  | (string | RegExp)[] // Array of matchers
  | ((name: string, route: RouteLocationNormalized) => boolean) // Function
```

## LRU Eviction

When the page stack exceeds `max` (default: 10), the least recently used non-`constCache` page is evicted.

```ts
const keepPlugin = createKeepRouter({
  router,
  max: 15, // Global max stack depth
})
```

`max` can also be configured per depth level for nested routes:

```ts
const keepPlugin = createKeepRouter({
  router,
  max: { 0: 10, 1: 5, 2: 3 }, // depth 0 → 10, depth 1 → 5, depth 2 → 3
})
```

### onBeforeEvict Hook

Intercept LRU eviction to protect specific pages:

```ts
const keepPlugin = createKeepRouter({
  router,
  max: 10,
  onBeforeEvict(entry) {
    // Return false to prevent eviction
    if (entry.metadata.important) return false

    // Return void/true to allow eviction
  },
})
```

Pages with `constCache: true` are always immune to LRU eviction. The `onBeforeEvict` hook only runs for non-`constCache` candidates.
