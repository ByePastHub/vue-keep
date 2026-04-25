# SSR (Server-Side Rendering)

Vue Keep is a client-only library. It depends on browser APIs (`window`, `document`, `history`, `ResizeObserver`) that do not exist in a server environment. This page explains how to safely use Vue Keep in SSR frameworks like Nuxt 3.

## SSR Safety

Vue Keep uses runtime environment detection to guard all browser API access:

```ts
// Internal environment checks
export const isBrowser = typeof window !== 'undefined'
export const isSSR = !isBrowser
export const hasHistory = isBrowser && typeof history !== 'undefined'
export const hasResizeObserver = isBrowser && typeof ResizeObserver !== 'undefined'
```

This means importing Vue Keep on the server will not throw errors. However, the plugin must only be installed on the client side, since it binds to Vue Router's navigation guards and manipulates `history.state`.

## Nuxt 3 Integration

In Nuxt 3, use a `.client.ts` plugin to ensure Vue Keep only runs in the browser:

### plugins/vue-keep.client.ts

```ts
// plugins/vue-keep.client.ts
import { createKeepRouter } from '@bye_past/vue-keep'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  const keepRouter = createKeepRouter({
    router,
    max: 10,
    scrollBehavior: 'auto',
    transition: 'slide',
  })

  nuxtApp.vueApp.use(keepRouter)
})
```

The `.client.ts` suffix tells Nuxt to only execute this plugin in the browser.

### Using KeepRouterView

Wrap `KeepRouterView` in a `<ClientOnly>` component to prevent SSR hydration mismatches:

```vue
<template>
  <ClientOnly>
    <KeepRouterView />
    <template #fallback>
      <NuxtPage />
    </template>
  </ClientOnly>
</template>
```

The `#fallback` slot renders the standard `<NuxtPage>` during SSR, then switches to `<KeepRouterView>` once the client hydrates.

### Using Composables

Vue Keep composables (`useKeepRouter`, `usePageStack`, etc.) rely on `inject()` which requires the plugin to be installed. In SSR context, guard their usage:

```ts
import { useKeepRouter } from '@bye_past/vue-keep'

// Only call in client-side code
if (import.meta.client) {
  const keepRouter = useKeepRouter()
  // ...
}
```

Or use them inside `onMounted`, which only runs on the client:

```ts
import { onMounted } from 'vue'
import { useKeepRouter } from '@bye_past/vue-keep'

onMounted(() => {
  const keepRouter = useKeepRouter()
  keepRouter.push('/some-page')
})
```

## Client-Only Behavior

The following features are entirely client-side and have no server-side effect:

| Feature               | Reason                                                   |
| --------------------- | -------------------------------------------------------- |
| Page stack management | Depends on `history.state`                               |
| Scroll restoration    | Depends on `document.scrollingElement`, `ResizeObserver` |
| KeepAlive caching     | Vue's `<KeepAlive>` is a client-only runtime feature     |
| EventChannel          | Tied to client-side navigation lifecycle                 |
| Transition animations | CSS transitions require the DOM                          |
| State persistence     | Uses `sessionStorage`                                    |
| DevTools integration  | Browser extension API                                    |

## Other SSR Frameworks

The same pattern applies to any SSR framework -- install the plugin only on the client:

### Vite SSR

```ts
// entry-client.ts
import { createKeepRouter } from '@bye_past/vue-keep'

const keepRouter = createKeepRouter({ router })
app.use(keepRouter)
```

```ts
// entry-server.ts
// Do NOT install Vue Keep here
```

### Quasar (SSR mode)

```ts
// src/boot/vue-keep.ts
import { boot } from 'quasar/wrappers'
import { createKeepRouter } from '@bye_past/vue-keep'

export default boot(({ app, router, ssrContext }) => {
  // Only install on client
  if (!ssrContext) {
    const keepRouter = createKeepRouter({ router })
    app.use(keepRouter)
  }
})
```

## Notes

- Vue Keep does not provide server-side page caching. On the server, pages render fresh on every request as usual.
- The `persist` option (which uses `sessionStorage`) is automatically skipped in non-browser environments.
- If you see hydration mismatch warnings, make sure `KeepRouterView` is wrapped in a client-only boundary.
