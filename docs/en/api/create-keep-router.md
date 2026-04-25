# createKeepRouter

The plugin factory function. Creates a Vue plugin that installs the page-stack cache system.

## Signature

```ts
function createKeepRouter(options: KeepOptions): Plugin
```

## KeepOptions

| Property                 | Type                                            | Default        | Description                                                                     |
| ------------------------ | ----------------------------------------------- | -------------- | ------------------------------------------------------------------------------- |
| `router`                 | `Router`                                        | **(required)** | Vue Router instance                                                             |
| `max`                    | `number \| Record<number, number>`              | `10`           | Max stack depth. Use an object to set per-depth limits (e.g. `{ 0: 10, 1: 5 }`) |
| `exclude`                | `NameMatcher`                                   | `undefined`    | Global exclude rule — matched pages are never cached                            |
| `include`                | `NameMatcher`                                   | `undefined`    | Global include rule — only matched pages are cached                             |
| `scrollBehavior`         | `ScrollBehaviorStrategy`                        | `'auto'`       | Scroll restoration strategy                                                     |
| `persist`                | `boolean`                                       | `true`         | Enable history.state marker recovery after page refresh                         |
| `transition`             | `false \| TransitionPreset \| TransitionConfig` | `'slide'`      | Page transition animation config                                                |
| `devtools`               | `boolean`                                       | `false`        | Enable Vue DevTools integration                                                 |
| `namespace`              | `string`                                        | `'[vue-keep]'` | Log namespace prefix                                                            |
| `disableFirstTransition` | `boolean`                                       | `true`         | Skip transition animation on initial render                                     |
| `onBeforeEvict`          | `(entry: PageStackEntry) => boolean \| void`    | `undefined`    | Called before LRU eviction. Return `false` to prevent eviction                  |

## Return Value

Returns a standard Vue `Plugin`. Call `app.use()` to install it.

After installation the plugin:

- Disables native browser `history.scrollRestoration` to avoid restoring the previous scroll position after refresh
- Binds `beforeEach` / `afterEach` guards on the router
- Ensures every route component has a stable name for `<KeepAlive>` matching
- Registers the `<KeepRouterView>` component globally
- Provides `keepRouter`, `store`, and `options` via `app.provide`
- Exposes `$keepRouter` on every component instance

## Example

```ts
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createKeepRouter } from '@bye_past/vue-keep'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: () => import('./views/Home.vue') },
    { path: '/detail/:id', name: 'Detail', component: () => import('./views/Detail.vue') },
  ],
})

const keepRouter = createKeepRouter({
  router,
  max: 10,
  scrollBehavior: 'auto',
  transition: 'slide',
  onBeforeEvict(entry) {
    // Prevent eviction of pages marked as constCache
    if (entry.constCache) return false
  },
})

const app = createApp(App)
app.use(router)
app.use(keepRouter)
app.mount('#app')
```

## ScrollBehaviorStrategy

| Value                                          | Behavior                                                            |
| ---------------------------------------------- | ------------------------------------------------------------------- |
| `'auto'`                                       | Restore scroll on back, reset to top on forward                     |
| `'always'`                                     | Always restore saved scroll position                                |
| `'none'`                                       | Never restore scroll position                                       |
| `(to, from, direction, savedPositions) => ...` | Custom function returning `ScrollPosition`, `false`, or a `Promise` |
