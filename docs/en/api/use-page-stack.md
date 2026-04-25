# usePageStack

Composable for reading the page stack state of a container.

## Signature

```ts
function usePageStack(containerId?: string): {
  stack: ComputedRef<PageStackEntry[]>
  current: ComputedRef<PageStackEntry | undefined>
  size: ComputedRef<number>
  depth: number
  containerId: string
  has(name: string): boolean
  find(name: string): Readonly<PageStackEntry> | undefined
}
```

## Return Value

| Property      | Type                                            | Description                                                       |
| ------------- | ----------------------------------------------- | ----------------------------------------------------------------- |
| `stack`       | `ComputedRef<PageStackEntry[]>`                 | Reactive array of all entries in the stack                        |
| `current`     | `ComputedRef<PageStackEntry \| undefined>`      | The currently active stack entry                                  |
| `size`        | `ComputedRef<number>`                           | Number of entries in the stack                                    |
| `depth`       | `number`                                        | Nesting depth of the current container (top-level is `0`)         |
| `containerId` | `string`                                        | Resolved container identifier                                     |
| `has(name)`   | `(name: string) => boolean`                     | Check if a page with the given component name exists in the stack |
| `find(name)`  | `(name: string) => PageStackEntry \| undefined` | Find a stack entry by component name                              |

## Example

```vue
<script setup lang="ts">
import { usePageStack } from '@bye_past/vue-keep'

const { stack, size, current, has } = usePageStack()
</script>

<template>
  <div>
    <p>Stack depth: {{ size }}</p>
    <p>Current page: {{ current?.name }}</p>
    <p>Has Detail page: {{ has('Detail') }}</p>
    <ul>
      <li v-for="entry in stack" :key="entry.id">{{ entry.name }} — {{ entry.fullPath }}</li>
    </ul>
  </div>
</template>
```
