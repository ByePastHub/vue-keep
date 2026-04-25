# Nested Routes

`@bye_past/vue-keep` fully supports Vue Router's nested route structure. Each `<KeepRouterView>` manages its own independent page stack.

## Basic Setup

Use `<KeepRouterView>` as a drop-in replacement for `<router-view>` at every nesting level:

```vue
<!-- App.vue — top-level (depth 0) -->
<template>
  <KeepRouterView />
</template>
```

```vue
<!-- Layout.vue — nested (depth 1) -->
<template>
  <header>...</header>
  <KeepRouterView />
  <footer>...</footer>
</template>
```

```vue
<!-- Dashboard.vue — deeply nested (depth 2) -->
<template>
  <aside>...</aside>
  <main>
    <KeepRouterView />
  </main>
</template>
```

Route config:

```ts
const routes = [
  {
    path: '/',
    component: Layout, // depth 0 renders Layout
    children: [
      {
        path: 'dashboard',
        component: Dashboard, // depth 1 renders Dashboard
        children: [
          { path: 'stats', component: Stats }, // depth 2
          { path: 'reports', component: Reports }, // depth 2
        ],
      },
      { path: 'settings', component: Settings }, // depth 1
    ],
  },
]
```

## Auto Depth Increment

Each `<KeepRouterView>` automatically increments its depth via Vue's provide/inject. You don't need to configure depth manually.

| Component                        | Depth | Container ID               |
| -------------------------------- | ----- | -------------------------- |
| App.vue `<KeepRouterView>`       | 0     | `keep:0:root:default`      |
| Layout.vue `<KeepRouterView>`    | 1     | `keep:1:Layout:default`    |
| Dashboard.vue `<KeepRouterView>` | 2     | `keep:2:dashboard:default` |

The container ID format is: `keep:{depth}:{parentRecordKey}:{viewName}`

- `parentRecordKey` — the parent route's `name` (if string) or `path`
- `viewName` — always `default` unless using named views

## Independent Stacks

Each container maintains its own page stack. Navigating within a nested `<KeepRouterView>` only affects that container's stack — parent stacks remain untouched.

```
Stack at depth 0: [Layout]
Stack at depth 1: [Home, Detail, Settings]   ← push/back only affects this
Stack at depth 2: [Stats, Reports]           ← independent from depth 1
```

Each stack has its own:

- Include list (for `<KeepAlive>`)
- LRU eviction (respects per-depth `max`)
- Scroll position restoration

### Per-Depth Max

Configure different stack limits for each depth:

```ts
createKeepRouter({
  router,
  max: {
    0: 10, // Top-level: up to 10 pages
    1: 5, // First nesting: up to 5
    2: 3, // Second nesting: up to 3
  },
})
```

## Custom containerId

In rare cases where the auto-generated container ID doesn't work (e.g., dynamic route segments causing ID instability), you can set it manually:

```vue
<KeepRouterView containerId="my-stable-container" />
```

This is useful when:

- Parent route uses dynamic params that change the matched record key
- You need a predictable container ID for programmatic access
- Multiple named `<router-view>` slots exist at the same level

## Per-Container Props

Each `<KeepRouterView>` accepts its own configuration:

```vue
<KeepRouterView
  :max="5"
  :cache-max="20"
  :exclude="['DebugPanel']"
  :include="['Home', 'Detail']"
  :transition="'fade'"
  :scroll-containers="['.custom-scroller']"
/>
```

| Prop               | Type                                            | Description                           |
| ------------------ | ----------------------------------------------- | ------------------------------------- |
| `max`              | `number`                                        | Max stack depth for this container    |
| `cacheMax`         | `number`                                        | KeepAlive instance cache limit        |
| `exclude`          | `NameMatcher`                                   | Exclude pages from caching            |
| `include`          | `NameMatcher`                                   | Only cache matching pages             |
| `containerId`      | `string`                                        | Manual container ID override          |
| `transition`       | `false \| TransitionPreset \| TransitionConfig` | Transition config for this container  |
| `scrollContainers` | `string[]`                                      | Additional scroll container selectors |

## Scoped Slot

For advanced rendering control, use the scoped slot:

```vue
<KeepRouterView v-slot="{ Component, route, direction, containerId, renderPage, state }">
  <Transition :name="`custom-${direction}`">
    <KeepAlive :include="state.stack.map(e => e.name)">
      <component :is="Component" :key="route.fullPath" />
    </KeepAlive>
  </Transition>
</KeepRouterView>
```

Slot props:

| Prop          | Type                            | Description                                |
| ------------- | ------------------------------- | ------------------------------------------ |
| `Component`   | `Component`                     | The matched route component                |
| `route`       | `RouteLocationNormalizedLoaded` | Current route                              |
| `direction`   | `NavigationDirection`           | `'forward'` / `'back'` / `'none'`          |
| `containerId` | `string`                        | This container's ID                        |
| `renderPage`  | `() => VNode`                   | Helper to render the page with correct key |
| `state`       | `object`                        | `{ stack, current, depth }`                |
