# Transitions

`@bye_past/vue-keep` provides direction-aware page transitions out of the box. Transitions automatically adapt based on navigation direction (forward/back).

## Built-in Presets

Three presets are available: `slide`, `fade`, and `zoom`.

```ts
createKeepRouter({
  router,
  transition: 'slide', // Default
})
```

| Preset  | Forward           | Back               | None              |
| ------- | ----------------- | ------------------ | ----------------- |
| `slide` | `keep-slide-left` | `keep-slide-right` | _(no transition)_ |
| `fade`  | `keep-fade`       | `keep-fade`        | _(no transition)_ |
| `zoom`  | `keep-zoom-in`    | `keep-zoom-out`    | _(no transition)_ |

Each preset maps to CSS class names that you need to define in your styles. Example for `slide`:

```css
/* Slide left (forward navigation) */
.keep-slide-left-enter-active,
.keep-slide-left-leave-active {
  transition: transform 0.3s ease;
}
.keep-slide-left-enter-from {
  transform: translateX(100%);
}
.keep-slide-left-leave-to {
  transform: translateX(-100%);
}

/* Slide right (back navigation) */
.keep-slide-right-enter-active,
.keep-slide-right-leave-active {
  transition: transform 0.3s ease;
}
.keep-slide-right-enter-from {
  transform: translateX(-100%);
}
.keep-slide-right-leave-to {
  transform: translateX(100%);
}
```

## Directionless Navigation

For directionless navigations such as `replace`, `reLaunch`, and `switchTab`, built-in presets do not play a transition. If a custom `TransitionConfig.name` returns an empty string, Vue Keep renders the page directly instead of creating an empty `Transition` wrapper.

## TransitionConfig

For fine-grained control, pass a `TransitionConfig` object:

```ts
createKeepRouter({
  router,
  transition: {
    name: 'my-transition', // Static name
    mode: 'out-in', // Vue Transition mode
    appear: true, // Animate on initial render
    duration: 300, // Duration in ms
  },
})
```

### Dynamic Name

Use a function to compute the transition name based on direction:

```ts
createKeepRouter({
  router,
  transition: {
    name: (direction) => {
      if (direction === 'forward') return 'slide-left'
      if (direction === 'back') return 'slide-right'
      return '' // No transition for 'none'
    },
  },
})
```

### Duration Object

Specify different durations for enter and leave:

```ts
createKeepRouter({
  router,
  transition: {
    name: 'fade',
    duration: {
      enter: 300,
      leave: 200,
    },
  },
})
```

### Lifecycle Hooks

```ts
createKeepRouter({
  router,
  transition: {
    name: 'slide',
    onBeforeEnter: (el) => {
      /* ... */
    },
    onAfterEnter: (el) => {
      /* ... */
    },
    onBeforeLeave: (el) => {
      /* ... */
    },
    onAfterLeave: (el) => {
      /* ... */
    },
  },
})
```

## Per-Container Transition

Override the global transition on individual `<KeepRouterView>` instances:

```vue
<!-- Use fade for this container -->
<KeepRouterView transition="fade" />

<!-- Disable transitions for this container -->
<KeepRouterView :transition="false" />

<!-- Custom config -->
<KeepRouterView :transition="{ name: 'zoom', mode: 'out-in' }" />
```

## Custom CSS Transitions

Define your own transition classes and reference them by name:

```ts
createKeepRouter({
  router,
  transition: {
    name: (direction) => `my-app-${direction}`,
  },
})
```

```css
.my-app-forward-enter-active,
.my-app-forward-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.my-app-forward-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.my-app-forward-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.my-app-back-enter-active,
.my-app-back-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.my-app-back-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.my-app-back-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
```

## Disable Transitions

Globally:

```ts
createKeepRouter({
  router,
  transition: false,
})
```

Per container:

```vue
<KeepRouterView :transition="false" />
```

## First-Screen Skip

By default, the first page render skips the transition animation to avoid a jarring entrance effect. This is controlled by `disableFirstTransition`:

```ts
createKeepRouter({
  router,
  disableFirstTransition: true, // Default: true
})
```

Set to `false` if you want the initial page to animate in:

```ts
createKeepRouter({
  router,
  disableFirstTransition: false,
})
```

Internally, `KeepTransition` tracks `isFirstRender` via `onMounted` and suppresses the transition on the first render when this option is enabled.

## prefers-reduced-motion

For accessibility, respect the user's motion preference by conditionally disabling transitions:

```ts
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

createKeepRouter({
  router,
  transition: prefersReduced ? false : 'slide',
})
```

Or reactively:

```ts
import { ref, watchEffect } from 'vue'

const reducedMotion = ref(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
  reducedMotion.value = e.matches
})
```

```vue
<KeepRouterView :transition="reducedMotion ? false : 'slide'" />
```

## Full TransitionConfig Type

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

type TransitionPreset = 'slide' | 'fade' | 'zoom'
type NavigationDirection = 'forward' | 'back' | 'none'
```
