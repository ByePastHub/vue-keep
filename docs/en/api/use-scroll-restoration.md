# useScrollRestoration

Composable for manual control over scroll position save/restore. Useful when the automatic scroll restoration doesn't cover your use case (virtual lists, lazy-loaded content, multiple scroll containers).

## Signature

```ts
function useScrollRestoration(): ScrollRestorationControls
```

## ScrollRestorationControls

```ts
interface ScrollRestorationControls {
  save(): void
  restore(): Promise<void>
  pause(): void
  resume(): void
  registerContainer(selector: string): void
}
```

| Method                        | Description                                                                                                 |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `save()`                      | Manually capture scroll positions of all detected containers and store them in the current page stack entry |
| `restore()`                   | Restore previously saved scroll positions. Returns a Promise that resolves after restoration                |
| `pause()`                     | Pause automatic scroll capture (calls to `save()` become no-ops)                                            |
| `resume()`                    | Resume automatic scroll capture                                                                             |
| `registerContainer(selector)` | Register an additional CSS selector as a scroll container for the current page                              |

## Example

### Basic Manual Control

```vue
<script setup lang="ts">
import { useScrollRestoration } from '@bye_past/vue-keep'

const scroll = useScrollRestoration()

// Save before leaving
function beforeLeave() {
  scroll.save()
}

// Restore after data loads
async function onDataLoaded() {
  await scroll.restore()
}
</script>
```

### Register Extra Scroll Containers

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useScrollRestoration } from '@bye_past/vue-keep'

const scroll = useScrollRestoration()

onMounted(() => {
  // Track a sidebar scroll container
  scroll.registerContainer('.sidebar-scroll')
  // Track a chat message list
  scroll.registerContainer('#message-list')
})
</script>
```

### Pause During Animations

```vue
<script setup lang="ts">
import { useScrollRestoration } from '@bye_past/vue-keep'

const scroll = useScrollRestoration()

function startAnimation() {
  scroll.pause()
}

function endAnimation() {
  scroll.resume()
}
</script>
```
