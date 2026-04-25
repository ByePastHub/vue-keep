# EventChannel

EventChannel enables communication between pages during navigation, inspired by WeChat Mini Program's `EventChannel`. It lets a source page listen for events that the target page emits after being opened.

## Concept

A common pattern in mobile apps: Page A opens Page B (e.g. a picker or form), and Page B sends data back to Page A without coupling the two pages together. EventChannel solves this by creating a temporary, typed communication channel tied to a single navigation.

```
Page A (source)                    Page B (target)
─────────────────                  ─────────────────
push('/page-b', {                  const channel = useEventChannel()
  events: {
    onSelect(data) {               channel.emit('onSelect', { id: 1 })
      // receives { id: 1 }
    }
  }
})
```

## Basic Usage

### Source Page: Push with Events

Use `keepRouter.push` with the `events` option to register listeners before navigating:

```ts
import { useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()

async function openCityPicker() {
  await keepRouter.push('/city-picker', {
    events: {
      onCitySelected(city) {
        console.log('Selected city:', city)
      },
      onCancel() {
        console.log('User cancelled')
      },
    },
  })
}
```

### Target Page: Emit Events

In the target page, use `useEventChannel` to get the channel instance and emit events back:

```ts
import { useEventChannel } from '@bye_past/vue-keep'
import { useKeepRouter } from '@bye_past/vue-keep'

const channel = useEventChannel()
const keepRouter = useKeepRouter()

function selectCity(city: { name: string; code: string }) {
  // Emit the event to the source page
  channel?.emit('onCitySelected', city)
  // Navigate back
  keepRouter.back()
}

function cancel() {
  channel?.emit('onCancel', undefined)
  keepRouter.back()
}
```

## Complete Example

Here's a full example with a product list page and a filter page:

### ProductList.vue (Source)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()
const activeFilters = ref<{ category: string; priceRange: [number, number] }>()

async function openFilters() {
  await keepRouter.push('/filters', {
    events: {
      onApply(filters: { category: string; priceRange: [number, number] }) {
        activeFilters.value = filters
        fetchProducts(filters)
      },
      onReset() {
        activeFilters.value = undefined
        fetchProducts()
      },
    },
    // Pass current filters as metadata so the filter page can pre-fill
    metadata: { currentFilters: activeFilters.value },
  })
}

function fetchProducts(filters?: any) {
  // fetch logic...
}
</script>

<template>
  <div>
    <button @click="openFilters">Filters</button>
    <!-- product list -->
  </div>
</template>
```

### FilterPage.vue (Target)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useEventChannel, useKeepRouter } from '@bye_past/vue-keep'

const channel = useEventChannel()
const keepRouter = useKeepRouter()

const category = ref('all')
const priceRange = ref<[number, number]>([0, 1000])

function apply() {
  channel?.emit('onApply', {
    category: category.value,
    priceRange: priceRange.value,
  })
  keepRouter.back()
}

function reset() {
  channel?.emit('onReset', undefined)
  keepRouter.back()
}
</script>

<template>
  <div>
    <select v-model="category">
      <option value="all">All</option>
      <option value="electronics">Electronics</option>
      <option value="clothing">Clothing</option>
    </select>
    <button @click="apply">Apply</button>
    <button @click="reset">Reset</button>
  </div>
</template>
```

## EventChannel API

```ts
interface EventChannel<T extends Record<string, unknown>> {
  emit<K extends keyof T>(event: K, payload: T[K]): void
  on<K extends keyof T>(event: K, handler: (payload: T[K]) => void): () => void
  once<K extends keyof T>(event: K, handler: (payload: T[K]) => void): () => void
  off<K extends keyof T>(event: K, handler?: (payload: T[K]) => void): void
  destroy(): void
}
```

| Method                 | Description                                                 |
| ---------------------- | ----------------------------------------------------------- |
| `emit(event, payload)` | Send an event with data to all listeners                    |
| `on(event, handler)`   | Register a listener. Returns an unsubscribe function        |
| `once(event, handler)` | Register a one-time listener. Auto-removes after first call |
| `off(event, handler?)` | Remove a specific handler, or all handlers for the event    |
| `destroy()`            | Destroy the channel and clear all listeners                 |

## TypeScript Type Safety

Vue Keep supports declaration merging on `PageEventMap` to provide type-safe event channels across your app.

### Declare Your Events

Create a type declaration file (e.g. `src/keep-events.d.ts`):

```ts
// src/keep-events.d.ts
import '@bye_past/vue-keep'

declare module '@bye_past/vue-keep' {
  interface PageEventMap {
    onCitySelected: { name: string; code: string }
    onApply: { category: string; priceRange: [number, number] }
    onReset: undefined
    onConfirm: { id: number; value: string }
  }
}
```

### Use Typed Channels

Once declared, `useEventChannel` and `push` events are fully typed:

```ts
// Type-safe: TypeScript knows the payload shape
const channel = useEventChannel<PageEventMap>()

// OK
channel?.emit('onCitySelected', { name: 'Beijing', code: 'BJ' })

// Type error: missing 'code' property
channel?.emit('onCitySelected', { name: 'Beijing' })

// Type-safe event listeners in push
keepRouter.push('/city-picker', {
  events: {
    // TypeScript infers the parameter type
    onCitySelected(city) {
      // city is { name: string; code: string }
    },
  },
})
```

## Lifecycle

- A channel is created when `keepRouter.push` is called with `events`.
- The channel ID is stored on the target page's stack entry (`channelId`).
- The target page retrieves the channel via `useEventChannel()`.
- The channel is destroyed when the target page's stack entry is removed (on back navigation or cache eviction).
- Emitting on a destroyed channel is a no-op (with a dev-mode warning).

## Notes

- `useEventChannel()` returns `null` if no channel is associated with the current page. Always use optional chaining (`channel?.emit`).
- EventChannel is only available with `keepRouter.push`. It is not supported with `replace`, `reLaunch`, or `switchTab`.
- Channels are one-to-one: one source page, one target page. For broadcasting across multiple pages, use a global state manager instead.
