# useKeepRouter

Returns the `KeepRouter` instance — the primary API for navigating with cache control.

## Signature

```ts
function useKeepRouter(): KeepRouter
```

When called inside `setup()` / `<script setup>`, it resolves the instance from Vue injection.
When called from a plain TS / JS module, it resolves the default instance installed by
`app.use(createKeepRouter(...))`.

## KeepRouter Interface

```ts
interface KeepRouter {
  push(to: KeepLocation, options?: KeepNavigateOptions): Promise<void>
  replace(to: KeepLocation, options?: KeepNavigateOptions): Promise<void>
  back(delta?: number): void
  reLaunch(to: KeepLocation, options?: Omit<KeepNavigateOptions, 'events'>): Promise<void>
  switchTab(to: KeepLocation, options?: Omit<KeepNavigateOptions, 'events'>): Promise<void>
  destroy(target: DestroyTarget): void
  beforeEach(guard: KeepNavigationGuard): () => void
}
```

### Methods

| Method       | Description                                                                      |
| ------------ | -------------------------------------------------------------------------------- |
| `push`       | Navigate forward. The current page is cached; the target page is freshly created |
| `replace`    | Replace the current page in the stack (no new history entry)                     |
| `back`       | Go back `delta` steps (default `1`). Target page is restored from cache          |
| `reLaunch`   | Clear the entire stack and navigate to the target page                           |
| `switchTab`  | Switch to a tab page. Preserves tab pages in the stack by `tabKey`               |
| `destroy`    | Manually destroy cached pages by name, array of names, `'ALL'`, or predicate     |
| `beforeEach` | Register a navigation guard. Returns an unregister function                      |

## KeepNavigateOptions

| Property     | Type                                       | Default     | Description                                                         |
| ------------ | ------------------------------------------ | ----------- | ------------------------------------------------------------------- |
| `cache`      | `boolean`                                  | `true`      | Whether to cache the current page when navigating away              |
| `constCache` | `boolean`                                  | `false`     | Mark the target page as permanently cached (immune to LRU eviction) |
| `destroy`    | `DestroyTarget`                            | `undefined` | Destroy specific cached pages before navigating                     |
| `events`     | `Record<string, (...args: any[]) => void>` | `undefined` | EventChannel listeners registered on the source page                |
| `metadata`   | `Record<string, unknown>`                  | `undefined` | Custom metadata attached to the target page stack entry             |

## KeepNavigationGuard

```ts
type KeepNavigationGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  direction: NavigationDirection,
) => KeepGuardReturn | void | Promise<KeepGuardReturn | void>

interface KeepGuardReturn {
  cache?: boolean
  constCache?: boolean
  destroy?: string | string[] | 'ALL'
}
```

## Example

### Inside Components

```vue
<script setup lang="ts">
import { useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()

// Forward navigation — current page cached
async function goDetail(id: number) {
  await keepRouter.push(`/detail/${id}`)
}

// Forward with options
async function goForm() {
  await keepRouter.push('/form', {
    constCache: true,
    metadata: { from: 'home' },
  })
}

// Go back
function goBack() {
  keepRouter.back()
}

// Clear stack and go home
async function goHome() {
  await keepRouter.reLaunch('/')
}

// Destroy specific cache
function clearDetail() {
  keepRouter.destroy('Detail')
}

// Navigation guard
const removeGuard = keepRouter.beforeEach((to, from, direction) => {
  if (to.path === '/checkout') {
    return { constCache: true }
  }
})
</script>
```

### Outside Components

```ts
import { useKeepRouter } from '@bye_past/vue-keep'

export async function navigateToLogin() {
  const keepRouter = useKeepRouter()
  await keepRouter.push('/login')
}
```

Make sure this function is called after `app.use(createKeepRouter(...))`.

## KeepLocation

```ts
type KeepLocation = string | RouteLocationRaw
```

Accepts a path string or any Vue Router location object.

## DestroyTarget

```ts
type DestroyTarget =
  | string // Destroy by component name
  | string[] // Destroy multiple by name
  | 'ALL' // Destroy all cached pages
  | ((entry: PageStackEntry) => boolean) // Conditional destroy
```
