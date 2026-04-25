# Lifecycle Hooks

Vue Keep provides two page-level lifecycle hooks that fire when a cached page becomes visible or hidden. They complement Vue's built-in `onActivated` / `onDeactivated` by providing navigation context.

## onPageShow

Called when a page becomes visible — either on first mount or when restored from cache.

```ts
function onPageShow(handler: PageShowHandler): void

type PageShowHandler = (ctx: PageShowContext) => void

interface PageShowContext {
  isFirstShow: boolean // true on initial mount, false on re-activation
  direction: NavigationDirection // 'forward' | 'back' | 'none'
  from: RouteLocationNormalizedLoaded | null // source route (null on first load)
}
```

### Example

```vue
<script setup lang="ts">
import { onPageShow } from '@bye_past/vue-keep'

onPageShow(({ isFirstShow, direction, from }) => {
  if (isFirstShow) {
    // First mount — fetch data
    fetchData()
  } else {
    // Returned from a sub-page — maybe refresh a list
    if (direction === 'back') {
      refreshList()
    }
  }
})
</script>
```

## onPageHide

Called when a page is hidden — either deactivated into cache or unmounted.

```ts
function onPageHide(handler: PageHideHandler): void

type PageHideHandler = (ctx: PageHideContext) => void

interface PageHideContext {
  direction: NavigationDirection // 'forward' | 'back' | 'none'
  to: RouteLocationNormalizedLoaded | null // destination route
}
```

### Example

```vue
<script setup lang="ts">
import { onPageHide } from '@bye_past/vue-keep'

onPageHide(({ direction, to }) => {
  if (direction === 'forward') {
    // User is going deeper — save draft
    saveDraft()
  }
})
</script>
```

## Comparison with Vue Lifecycle

| Scenario                 | Vue Hook        | Vue Keep Hook                       |
| ------------------------ | --------------- | ----------------------------------- |
| Component first mounted  | `onMounted`     | `onPageShow` (`isFirstShow: true`)  |
| Page restored from cache | `onActivated`   | `onPageShow` (`isFirstShow: false`) |
| Page hidden into cache   | `onDeactivated` | `onPageHide`                        |
| Component destroyed      | `onUnmounted`   | `onPageHide`                        |

Key differences:

- `onPageShow` / `onPageHide` provide `direction` and route context, so you know _why_ the page appeared or disappeared.
- `onPageShow` fires on both first mount and re-activation, with `isFirstShow` to distinguish them.
- `onPageHide` fires on both deactivation and unmount.
- Must be called inside `setup()` after `createKeepRouter` is installed.
