# 导航守卫
---

## 全局前置守卫
**beforeEach** 方法跟`router`中的**beforeEach**有点相似，但有不完全一样。`VueKeep`中的beforeEach主要是为了更灵活的动态销毁该页面组件。

你可以使用 keepRouter.beforeEach 注册一个全局前置守卫：
```js
import { beforeEach } from '@bye_past/vue-keep'

const unBeforeEach = beforeEach((to, from) => {
  // 当router发生跳转时就会触发
})

setTimeout(() => {
  unBeforeEach() // 20秒后销毁该全局前置守卫
}, 20000)
```


## 页面前置守卫
你也可以使用 keepRouter.beforeEach 注册一个`页面前置守卫`来按需优化你的程序：
> 第一个参数为`route`中的`name`
```js
created() {
  // GOOD
  const query = this.$route.query

  this.beforeEach = this.$keepRouter.beforeEach('Goods', (to, from) => {
    if (to.query.id !== query.id) {
      // 重新加载新页面
      return to.cache = false
    }
    // 旧页面
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
     * 如果to.triggerType = 'beforeChange'，
     * 那么路由尚未发生变化，此时this.$route属于上一个页面的 route，导致 this.$route.query.id 获取出错
     */
    if (to.query.id !== this.$route.query.id) {
      // 重新加载新页面
      return to.cache = false
    }
    // 旧页面
    to.cache = true
  })
},

destroy() {
  this.unBeforeEach()
}
```

+ `VueKeep`中的 beforeEach 并不打算提供`next`方法。
+ `VueKeep`中的 beforeEach 同样提供了跟`router.beforeEach`中的`to`跟`from`参数。
---
  - **`triggerType`(String)**: 触发类型分别是: beforeChange/change
    >+ **`beforeChange`**: 路由还没发生变化，基本上属于`javaScript`触发跳转的是beforeChange
    >+ **`change`**: 路由已经发生变化，基本上不属于`javaScript`触发跳转的是change
  - **`cache`(Boolean)**: 该跳转是否使用缓存页面(如果已经缓存过)，如果`triggerType`属于`beforeChange`，那么你可以手动动态修改是否使用缓存。
  - **`direction`(String)**: 该跳转属于forward/back。
  - **`method`(String)**: 触发跳转的方法。
  - **`state`(Object)**: state对象提供了当前页面在浏览器历史栈中的位置、返回页面路由、前进页面路由、当前跳转前页面路由，跳转后页面路由。

### 关于`keepRouer.beforeEach`执行时机
---
::: warning
`keepRouer.beforeEach`无论`triggerType`是**beforeChange**还是**change**，总是比`router.beforeEach`执行要早。








