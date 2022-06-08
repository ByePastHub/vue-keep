# Navigation guard
---

## Global front guard
The **beforeEach** method is somewhat similar to the **beforeEach** in `router`, but not exactly the same. The beforeEach in `VueKeep` is mainly for more flexible dynamic destruction of the page component.

You can use keepRouter.beforeEach to register a global front guard:
```js
import { beforeEach } from '@bye_past/vue-keep'

const unBeforeEach = beforeEach((to, from) => {
  // Triggered when the router jumps
})

setTimeout(() => {
  unBeforeEach() // Destroy the global front guard after 20 seconds
}, 20000)
```


## page front guard
You can also use keepRouter.beforeEach to register a `page front guard` to optimize your program as needed:
> The first parameter is the `name` in `route`
```js
created() {
  // GOOD
  const query = this.$route.query

  this.beforeEach = this.$keepRouter.beforeEach('Goods', (to, from) => {
    if (to.query.id !== query.id) {
      // reload new page
      return to.cache = false
    }
    // old page
    to.cache = true
  })
},

destroy() {
  this.beforeEach()
}
```

```js
// BAD
created() {
  this.unBeforeEach = this.$keepRouter.beforeEach('Goods', (to, from) => {
    /**
     * if to.triggerType = 'beforeChange',
     * Then the route has not changed, at this time this.$route belongs to the route of the previous page, resulting in an error in getting this.$route.query.id
     */
    if (to.query.id !== this.$route.query.id) {
      // reload new page
      return to.cache = false
    }
    // old page
    to.cache = true
  })
},

destroy() {
  this.unBeforeEach()
}
```

+ beforeEach in `VueKeep` is not intended to provide a `next` method.
+ beforeEach in `VueKeep` also provides the `to` and `from` parameters in `router.beforeEach`.
---
  - **`triggerType`(String)**: The trigger types are: beforeChange/change
    >+ **`beforeChange`**: The routing has not changed, basically it belongs to `javaScript` triggering the jump is beforeChange
    >+ **`change`**: The route has changed, and basically it is not a `javaScript` that triggers the jump is change
  - **`cache`(Boolean)**: Whether the jump uses the cached page (if it has been cached), if the `triggerType` belongs to `beforeChange`, then you can manually and dynamically modify whether to use the cache.
  - **`direction`(String)**: The jump belongs to forward/back.
  - **`method`(String)**: The method that triggers the jump.
  - **`state`(Object)**: The state object provides the position of the current page in the browser history stack, the return page route, the forward page route, the page route before the current jump, and the page route after the jump.

### About the execution timing of `keepRouer.beforeEach`
---
::: warning
`keepRouer.beforeEach` is always executed before `router.beforeEach` regardless of whether `triggerType` is **beforeChange** or **change**.