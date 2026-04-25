# Migration from v1

## Overview

Vue Keep v2 is a complete rewrite with an API design inspired by WeChat Mini Program's page stack model.

## Installation

```diff
- import VueKeep from '@bye_past/vue-keep'
+ import { createKeepRouter } from '@bye_past/vue-keep'
```

## Initialization

```diff
- app.use(VueKeep, router)
+ const keepRouter = createKeepRouter({ router })
+ app.use(keepRouter)
```

## Navigation

v1 hijacked `router.push` / `router.replace`. v2 provides dedicated methods:

```diff
- router.push('/detail/1')
- router.go(-1)
+ const keepRouter = useKeepRouter()
+ keepRouter.push('/detail/1')
+ keepRouter.back()
```

New methods: `reLaunch`, `switchTab`.

## Cache Control

```diff
- { path: '/', meta: { constCache: true } }
+ { path: '/', meta: { keep: { constCache: true } } }
```

## Events

v1 used `window` CustomEvent. v2 uses EventChannel:

```diff
- window.addEventListener('KEEP_ROUTE_CHANGE', handler)
+ keepRouter.push('/form', {
+   events: { onSave(data) { /* ... */ } }
+ })
```

## Lifecycle Hooks

New in v2:

```ts
import { onPageShow, onPageHide } from '@bye_past/vue-keep'

onPageShow((ctx) => {
  if (ctx.isFirstShow) {
    /* first load */
  } else {
    /* restored from cache */
  }
})
```

## Removed Features

| v1                             | v2 Replacement            |
| ------------------------------ | ------------------------- |
| `destroy()` global             | `keepRouter.destroy()`    |
| `beforeEach()` global          | `keepRouter.beforeEach()` |
| `window` CustomEvent           | EventChannel              |
| `history.state` injection      | Internal IntentTracker    |
| `sessionStorage` history stack | Internal CoreStore        |

## Migration Steps

1. Update installation: `createKeepRouter` replaces default export
2. Replace navigation: `router.push` → `keepRouter.push`
3. Update route meta: `meta.constCache` → `meta.keep.constCache`
4. Replace events: CustomEvent → EventChannel
5. Add lifecycle hooks: `onPageShow` / `onPageHide`
6. Import animation CSS if needed
