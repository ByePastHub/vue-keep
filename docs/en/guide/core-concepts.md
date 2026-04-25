# Core Concepts

## Page Stack Model

Vue Keep maintains a page stack, similar to a browser history stack but with precise control over component instance creation and destruction.

```
Initial:        [ Home ]
push /list:     [ Home, List ]
push /detail/1: [ Home, List, Detail ]
back:           [ Home, List ]  ← Detail destroyed, List restored
back:           [ Home ]        ← List destroyed, Home restored
```

## 5 Navigation Methods

| Method          | Stack Operation | Description                             |
| --------------- | --------------- | --------------------------------------- |
| `push(to)`      | Push            | Create new page, cache current          |
| `replace(to)`   | Replace top     | Destroy current, create new             |
| `back(delta?)`  | Pop             | Destroy current, restore previous       |
| `reLaunch(to)`  | Clear & rebuild | Destroy all, create new                 |
| `switchTab(to)` | Switch tab      | Switch to tab page, preserve sub-stacks |

## Navigation Direction

| Direction | Trigger                      |
| --------- | ---------------------------- |
| `forward` | push                         |
| `back`    | back, browser back button    |
| `none`    | replace, reLaunch, switchTab |

Direction is used for transition animations, scroll restoration, and lifecycle hooks.

## KeepAlive Include Sync

Vue Keep uses Vue's native `<KeepAlive>` internally, dynamically maintaining the `include` array:

```
push /list    → include: ['Home', 'List']
push /detail  → include: ['Home', 'List', 'Detail']
back          → include: ['Home', 'List']  ← 'Detail' removed
```

## constCache Protection

Pages marked as `constCache` are protected from LRU eviction:

```ts
// Via route meta
{ path: '/', component: Home, meta: { keep: { constCache: true } } }

// Via navigation options
keepRouter.push('/important', { constCache: true })
```

## LRU Eviction

When cached pages exceed `max`, Vue Keep evicts the least recently used page:

1. Sort by `lastActiveAt` timestamp
2. Skip `constCache: true` pages
3. Evict the oldest non-protected page
4. Intercept via `onBeforeEvict` hook

```ts
createKeepRouter({
  router,
  max: 10,
  onBeforeEvict(entry) {
    if (entry.name === 'ImportantPage') return false
  },
})
```
