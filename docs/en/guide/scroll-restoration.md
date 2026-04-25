# Scroll Restoration

Vue Keep automatically saves and restores scroll positions when navigating between cached pages, just like native mobile apps.

## How It Works

When a user navigates away from a page, Vue Keep captures the scroll position of all detected scroll containers. When the user navigates back, positions are restored using a 3-tier defense mechanism:

1. **nextTick** -- Immediately attempts to restore after the DOM updates.
2. **ResizeObserver** -- Watches for content height changes (e.g. lazy-loaded images, async data) and re-applies positions until the layout stabilizes.
3. **Timeout fallback** -- After 600ms (default), forces a final restore to guarantee the position is applied even if ResizeObserver never fires.

This layered approach handles the common problem where content hasn't fully rendered when scroll restoration runs.

## Scroll Behavior Strategies

Configure the global strategy via the `scrollBehavior` option:

```ts
import { createKeepRouter } from '@bye_past/vue-keep'

const keepRouter = createKeepRouter({
  router,
  scrollBehavior: 'auto', // default
})
```

| Strategy   | Behavior                                                            |
| ---------- | ------------------------------------------------------------------- |
| `'auto'`   | Restore on back navigation only. Forward navigation scrolls to top. |
| `'always'` | Always restore saved positions, regardless of direction.            |
| `'none'`   | Disable scroll restoration entirely.                                |
| `function` | Custom function for full control.                                   |

### Custom Function

The function signature provides full context for making scroll decisions:

```ts
import { createKeepRouter } from '@bye_past/vue-keep'
import type { ScrollBehaviorFn } from '@bye_past/vue-keep'

const customScroll: ScrollBehaviorFn = (to, from, direction, savedPositions) => {
  // Don't restore scroll for a specific route
  if (to.name === 'search') return false

  // Use saved positions on back navigation
  if (direction === 'back') {
    const pos = savedPositions.get('__document__')
    return pos ?? { top: 0, left: 0 }
  }

  // Scroll to top on forward navigation
  return { top: 0, left: 0 }
}

const keepRouter = createKeepRouter({
  router,
  scrollBehavior: customScroll,
})
```

## Custom Scroll Containers

By default, Vue Keep tracks the document's main scrolling element. For custom scrollable areas, mark them with the `data-scroll-container` attribute:

```html
<div data-scroll-container="sidebar" class="overflow-y-auto h-screen">
  <!-- sidebar content -->
</div>

<div data-scroll-container="main-content" class="overflow-y-auto flex-1">
  <!-- main content -->
</div>
```

The attribute value becomes the container's key in the saved positions map. If omitted, the element's `id` or a generated CSS selector path is used as the key.

You can also pass extra selectors via the `KeepRouterView` component:

```html
<KeepRouterView :scroll-containers="['.my-scroll-area', '#chat-list']" />
```

## Container Detection

Vue Keep detects scroll containers in this order:

1. The document's main scrolling element (`document.scrollingElement`)
2. All elements with `[data-scroll-container]`
3. Any extra selectors passed via `scrollContainers` prop

Duplicates are automatically removed.

## createKeepScrollBehavior

If you use Vue Router's built-in `scrollBehavior` option, you can integrate it with Vue Keep using `createKeepScrollBehavior`. This helper disables Vue Router's scroll handling on back navigation (since Vue Keep handles it), while delegating forward navigation to your custom logic:

```ts
import { createRouter, createWebHistory } from 'vue-router'
import { createKeepRouter, createKeepScrollBehavior } from '@bye_past/vue-keep'
import { useNavigationDirection } from '@bye_past/vue-keep'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: createKeepScrollBehavior(
    // Provide a getter for the current navigation direction
    () => direction,
    // Optional: fallback for non-back navigations
    (to, from, savedPosition) => {
      if (savedPosition) return savedPosition
      return { top: 0 }
    },
  ),
})
```

When the direction is `'back'`, `createKeepScrollBehavior` returns `false` to prevent Vue Router from interfering with Vue Keep's own scroll restoration. For other directions, it delegates to your fallback function.

## useScrollRestoration

The `useScrollRestoration` composable gives you manual control over scroll saving and restoring within a component:

```ts
import { useScrollRestoration } from '@bye_past/vue-keep'

const scroll = useScrollRestoration()

// Manually save current scroll positions
scroll.save()

// Manually restore saved positions
await scroll.restore()

// Pause automatic scroll capture (e.g. during animations)
scroll.pause()

// Resume automatic scroll capture
scroll.resume()

// Register an additional scroll container by selector
scroll.registerContainer('.dynamic-list')
```

### API Reference

```ts
interface ScrollRestorationControls {
  save(): void // Capture and store current scroll positions
  restore(): Promise<void> // Restore saved positions (3-tier defense)
  pause(): void // Pause automatic scroll capture
  resume(): void // Resume automatic scroll capture
  registerContainer(selector: string): void // Add a scroll container
}
```

### Example: Pause During Custom Transitions

```vue
<script setup lang="ts">
import { useScrollRestoration } from '@bye_past/vue-keep'

const scroll = useScrollRestoration()

function onTransitionStart() {
  scroll.pause()
}

function onTransitionEnd() {
  scroll.resume()
  scroll.restore()
}
</script>
```

## ScrollPosition Type

```ts
interface ScrollPosition {
  left: number // Horizontal scroll offset
  top: number // Vertical scroll offset
  scrollWidth?: number // Container width at capture time
  scrollHeight?: number // Container height at capture time
}
```

The `scrollWidth` and `scrollHeight` fields are captured alongside the position, which can be useful for proportional restoration when content dimensions change (e.g. responsive layouts).
