# usePageCache

Composable for inspecting and controlling the cache state of the current page.

## Signature

```ts
function usePageCache(containerId?: string): {
  isCached: ComputedRef<boolean>
  markAsCached(): void
  removeFromCache(): void
  setConstCache(value: boolean): void
}
```

## Return Value

| Property               | Type                       | Description                                                                        |
| ---------------------- | -------------------------- | ---------------------------------------------------------------------------------- |
| `isCached`             | `ComputedRef<boolean>`     | Whether the current page is in the KeepAlive include list                          |
| `markAsCached()`       | `() => void`               | Ensure the current page is added to the cache stack                                |
| `removeFromCache()`    | `() => void`               | Remove the current page from cache (equivalent to `destroy` on self)               |
| `setConstCache(value)` | `(value: boolean) => void` | Toggle permanent cache on the current page. `true` makes it immune to LRU eviction |

## Example

```vue
<script setup lang="ts">
import { usePageCache } from '@bye_past/vue-keep'

const { isCached, setConstCache, removeFromCache } = usePageCache()

// Pin this page in cache
function pinPage() {
  setConstCache(true)
}

// Unpin
function unpinPage() {
  setConstCache(false)
}

// Self-destruct cache
function clearSelf() {
  removeFromCache()
}
</script>

<template>
  <div>
    <p>Cached: {{ isCached }}</p>
    <button @click="pinPage">Pin</button>
    <button @click="unpinPage">Unpin</button>
    <button @click="clearSelf">Clear Cache</button>
  </div>
</template>
```
