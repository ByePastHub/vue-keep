# Conditional Caching

Vue Keep caches pages by default. Here are several ways to control caching behavior at different levels.

## Navigation-Time Control

Pass `cache: false` when navigating to prevent the current page from being cached:

```vue
<script setup lang="ts">
import { useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()

// Navigate forward but don't cache the current page
async function goLogin() {
  await keepRouter.push('/login', { cache: false })
}
```

## Route Meta Configuration

Set caching rules in route config:

```ts
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/Login.vue'),
    meta: {
      keep: {
        cache: false, // Never cache this page
      },
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('./views/Dashboard.vue'),
    meta: {
      keep: {
        constCache: true, // Always keep in cache (immune to LRU eviction)
      },
    },
  },
  {
    path: '/temp',
    name: 'TempPage',
    component: () => import('./views/TempPage.vue'),
    meta: {
      keep: {
        exclude: true, // Exclude from caching entirely
      },
    },
  },
]
```

## beforeEach Guard

Use `keepRouter.beforeEach` for dynamic caching decisions:

```ts
const keepRouter = useKeepRouter()

keepRouter.beforeEach((to, from, direction) => {
  // Don't cache pages when navigating to login
  if (to.path === '/login') {
    return { cache: false }
  }

  // Force constCache for checkout flow
  if (to.path.startsWith('/checkout')) {
    return { constCache: true }
  }

  // Destroy all cache when logging out
  if (to.path === '/logout') {
    return { destroy: 'ALL' }
  }
})
```

## Component-Level Control

Use `usePageCache` inside a component to control its own cache state:

```vue
<script setup lang="ts">
import { usePageCache } from '@bye_past/vue-keep'

const { setConstCache, removeFromCache } = usePageCache()

// Pin this page when form has unsaved changes
function onFormDirty() {
  setConstCache(true)
}

// Unpin after saving
function onFormSaved() {
  setConstCache(false)
}

// Self-destruct after submission
function onSubmitted() {
  removeFromCache()
}
</script>
```

## Global Include / Exclude

Filter which pages can be cached at the plugin level:

```ts
createKeepRouter({
  router,
  // Only cache these pages
  include: ['Home', 'List', 'Detail'],
})
```

```ts
createKeepRouter({
  router,
  // Never cache these pages
  exclude: ['Login', 'Register'],
})
```

With regex:

```ts
createKeepRouter({
  router,
  exclude: /^(Login|Register|Reset)/,
})
```

With a function:

```ts
createKeepRouter({
  router,
  exclude: (name, route) => {
    return route.meta.keep?.exclude === true
  },
})
```

## Destroy on Navigate

Clean up specific caches when navigating:

```vue
<script setup lang="ts">
import { useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()

// Destroy the form page cache after successful submission
async function onSuccess() {
  await keepRouter.push('/success', {
    destroy: 'Form',
  })
}

// Destroy multiple pages
async function resetFlow() {
  await keepRouter.push('/home', {
    destroy: ['Step1', 'Step2', 'Step3'],
  })
}

// Destroy all and start fresh
async function logout() {
  await keepRouter.reLaunch('/login')
}
</script>
```
