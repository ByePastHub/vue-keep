# Navigation Methods

`@bye_past/vue-keep` provides a `KeepRouter` instance with 5 navigation methods, a cache destroyer, and a navigation guard. Access it via `useKeepRouter()` or `this.$keepRouter`.

```ts
import { useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()
```

## push

Navigate forward to a new page. The current page is cached by default.

```ts
// Simple path
await keepRouter.push('/detail/1')

// Route location object
await keepRouter.push({ name: 'Detail', params: { id: 1 } })

// With options
await keepRouter.push('/detail/1', {
  cache: true, // Cache the target page (default: true)
  constCache: true, // Mark target as permanently cached (survives LRU eviction)
  destroy: 'Home', // Destroy specific cache before navigating
  metadata: { from: 'list' }, // Attach custom metadata to the stack entry
  events: {
    // EventChannel listeners (received by target page)
    onResult: (data) => console.log(data),
  },
})
```

## replace

Replace the current page in the stack. The old page cache is destroyed.

```ts
await keepRouter.replace('/new-page')

await keepRouter.replace('/new-page', {
  cache: true,
  constCache: false,
  destroy: ['PageA', 'PageB'],
})
```

## back

Go back by popping pages off the stack. Popped pages are destroyed.

```ts
// Go back 1 step (default)
keepRouter.back()

// Go back 3 steps
keepRouter.back(3)
```

> `back()` is synchronous — it calls `router.go()` internally.

## reLaunch

Clear the entire stack and navigate to a new page. All cached pages are destroyed.

```ts
await keepRouter.reLaunch('/home')
```

Useful for "reset to home" scenarios or login redirects.

## switchTab

Switch to a tab page. Tab pages are identified by a stable `tabKey` and are reused rather than recreated.

```ts
await keepRouter.switchTab('/tab/home')
```

The `tabKey` is resolved in order:

1. `route.meta.keep.tabKey`
2. `route.name` (if string)
3. `route.path`

```ts
// Define tabKey in route config
const routes = [
  {
    path: '/tab/home',
    name: 'TabHome',
    component: Home,
    meta: { keep: { tabKey: 'home' } },
  },
]
```

## destroy

Manually destroy cached pages without navigating.

```ts
// Destroy by component name
keepRouter.destroy('Detail')

// Destroy multiple
keepRouter.destroy(['Detail', 'Settings'])

// Destroy all
keepRouter.destroy('ALL')

// Conditional destroy
keepRouter.destroy((entry) => entry.fullPath.startsWith('/temp'))
```

## beforeEach

Register a navigation guard that runs before each keep-router navigation. Returns an unregister function.

```ts
const removeGuard = keepRouter.beforeEach((to, from, direction) => {
  // Optionally return cache control overrides
  return {
    cache: false, // Don't cache the target page
    constCache: true, // Force permanent cache
    destroy: 'OldPage', // Destroy specific cache
  }
})

// Later: remove the guard
removeGuard()
```

Guard signature:

```ts
type KeepNavigationGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  direction: NavigationDirection, // 'forward' | 'back' | 'none'
) => KeepGuardReturn | void | Promise<KeepGuardReturn | void>

interface KeepGuardReturn {
  cache?: boolean
  constCache?: boolean
  destroy?: string | string[] | 'ALL'
}
```

## KeepNavigateOptions

All forward navigation methods (`push`, `replace`, `reLaunch`, `switchTab`) accept an options object:

| Option       | Type                       | Default | Description                                |
| ------------ | -------------------------- | ------- | ------------------------------------------ |
| `cache`      | `boolean`                  | `true`  | Whether to cache the target page           |
| `constCache` | `boolean`                  | `false` | Mark as permanently cached (immune to LRU) |
| `destroy`    | `DestroyTarget`            | —       | Destroy caches before navigating           |
| `metadata`   | `Record<string, unknown>`  | —       | Custom data attached to the stack entry    |
| `events`     | `Record<string, Function>` | —       | EventChannel listeners (push only)         |

> `reLaunch` and `switchTab` do not support the `events` option.
