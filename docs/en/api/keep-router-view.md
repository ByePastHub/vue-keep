# KeepRouterView

Drop-in replacement for `<router-view>`. Wraps the route component with `<KeepAlive>` and optional `<Transition>`, managed by the page-stack system.

## Props

| Prop               | Type                                            | Default        | Description                                        |
| ------------------ | ----------------------------------------------- | -------------- | -------------------------------------------------- |
| `max`              | `number`                                        | Global `max`   | Max stack depth for this container                 |
| `cacheMax`         | `number`                                        | Same as `max`  | `<KeepAlive>` instance cache limit                 |
| `exclude`          | `NameMatcher`                                   | `undefined`    | Container-level exclude rule                       |
| `include`          | `NameMatcher`                                   | `undefined`    | Container-level include rule                       |
| `containerId`      | `string`                                        | Auto-generated | Manual container identifier for nested scenarios   |
| `transition`       | `false \| TransitionPreset \| TransitionConfig` | Global config  | Override transition animation for this container   |
| `scrollContainers` | `string[]`                                      | `[]`           | Extra CSS selectors for scroll containers to track |

## Basic Usage

Replace `<router-view>` in your layout:

```vue
<template>
  <KeepRouterView />
</template>
```

With transition disabled:

```vue
<template>
  <KeepRouterView :transition="false" />
</template>
```

## Custom Transition

```vue
<template>
  <KeepRouterView transition="fade" />
</template>
```

Or with a full config object:

```vue
<template>
  <KeepRouterView
    :transition="{
      name: (dir) => `my-${dir}`,
      mode: 'out-in',
      duration: 300,
    }"
  />
</template>
```

## Nested Routes

For nested `<router-view>` scenarios, place a second `<KeepRouterView>` inside the parent layout. The component auto-increments `depth` and generates a unique `containerId`.

```vue
<!-- layouts/MainLayout.vue -->
<template>
  <nav>...</nav>
  <KeepRouterView />
</template>
```

```vue
<!-- views/Settings.vue (has child routes) -->
<template>
  <aside>...</aside>
  <KeepRouterView />
</template>
```

If auto-detection doesn't work for your layout, set `containerId` explicitly:

```vue
<KeepRouterView container-id="settings-children" />
```

## Scoped Slot

Access internal state via the default slot:

```vue
<KeepRouterView v-slot="{ Component, route, direction, containerId, state }">
  <transition :name="`custom-${direction}`">
    <keep-alive :include="state.stack.map(e => e.name)">
      <component :is="Component" :key="route.fullPath" />
    </keep-alive>
  </transition>
</KeepRouterView>
```

| Slot Prop       | Type                            | Description               |
| --------------- | ------------------------------- | ------------------------- |
| `Component`     | `Component \| null`             | Current route component   |
| `route`         | `RouteLocationNormalizedLoaded` | Current route             |
| `direction`     | `NavigationDirection`           | Last navigation direction |
| `containerId`   | `string`                        | Container identifier      |
| `state.stack`   | `PageStackEntry[]`              | Current page stack        |
| `state.current` | `PageStackEntry \| undefined`   | Current stack entry       |
| `state.depth`   | `number`                        | Nesting depth             |
