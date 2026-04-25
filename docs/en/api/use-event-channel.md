# useEventChannel

Composable that retrieves the `EventChannel` associated with the current page. Used for cross-page communication — typically between a source page and a target page opened via `keepRouter.push`.

## Signature

```ts
function useEventChannel<
  T extends Record<string, unknown> = Record<string, unknown>,
>(): EventChannel<T> | null
```

Returns `null` if no channel is associated with the current page.

## EventChannel Interface

```ts
interface EventChannel<T extends Record<string, unknown>> {
  emit<K extends keyof T>(event: K, payload: T[K]): void
  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): () => void
  once<K extends keyof T>(event: K, handler: EventHandler<T[K]>): () => void
  off<K extends keyof T>(event: K, handler?: EventHandler<T[K]>): void
  destroy(): void
}

type EventHandler<T = unknown> = (payload: T) => void
```

| Method                 | Description                                                                     |
| ---------------------- | ------------------------------------------------------------------------------- |
| `emit(event, payload)` | Emit an event with a payload to all listeners                                   |
| `on(event, handler)`   | Register a listener. Returns an unsubscribe function                            |
| `once(event, handler)` | Register a one-time listener. Returns an unsubscribe function                   |
| `off(event, handler?)` | Remove a specific handler, or all handlers for the event if no handler is given |
| `destroy()`            | Destroy the channel and clear all listeners                                     |

## Example

### Source Page (registers listeners via push options)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()
const selectedAddress = ref('')

async function pickAddress() {
  await keepRouter.push('/address-picker', {
    events: {
      select(address: string) {
        selectedAddress.value = address
      },
    },
  })
}
</script>
```

### Target Page (emits events back)

```vue
<script setup lang="ts">
import { useEventChannel, useKeepRouter } from '@bye_past/vue-keep'

const channel = useEventChannel<{ select: string }>()
const keepRouter = useKeepRouter()

function confirm(address: string) {
  channel?.emit('select', address)
  keepRouter.back()
}
</script>
```

## Type-Safe Channels

Extend `PageEventMap` for global type safety:

```ts
// types/vue-keep.d.ts
declare module '@bye_past/vue-keep' {
  interface PageEventMap {
    select: string
    confirm: { id: number; value: string }
  }
}
```

Then use with the generic parameter:

```ts
const channel = useEventChannel<PageEventMap>()
channel?.emit('select', 'some address') // type-checked
```
