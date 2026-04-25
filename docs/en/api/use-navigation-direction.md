# useNavigationDirection

Composable that returns the current navigation direction as a reactive computed ref.

## Signature

```ts
function useNavigationDirection(): ComputedRef<NavigationDirection>
```

## Return Value

A `ComputedRef<NavigationDirection>` that updates after every navigation.

```ts
type NavigationDirection = 'forward' | 'back' | 'none'
```

| Value       | Meaning                                                       |
| ----------- | ------------------------------------------------------------- |
| `'forward'` | User navigated forward (push, replace, reLaunch, switchTab)   |
| `'back'`    | User navigated back                                           |
| `'none'`    | No navigation has occurred yet, or direction is indeterminate |

## Example

```vue
<script setup lang="ts">
import { useNavigationDirection } from '@bye_past/vue-keep'

const direction = useNavigationDirection()
</script>

<template>
  <div :class="`page-${direction}`">
    <p>Direction: {{ direction }}</p>
  </div>
</template>
```

### Use with CSS Transitions

```vue
<script setup lang="ts">
import { useNavigationDirection } from '@bye_past/vue-keep'

const direction = useNavigationDirection()
</script>

<template>
  <transition :name="`slide-${direction}`">
    <router-view />
  </transition>
</template>

<style>
.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-back-enter-active,
.slide-back-leave-active {
  transition: transform 0.3s ease;
}
.slide-forward-enter-from {
  transform: translateX(100%);
}
.slide-forward-leave-to {
  transform: translateX(-100%);
}
.slide-back-enter-from {
  transform: translateX(-100%);
}
.slide-back-leave-to {
  transform: translateX(100%);
}
</style>
```
