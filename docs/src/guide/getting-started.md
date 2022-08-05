# Get started quickly

## Register to use
**main.js**
<CodeGroup>
  <CodeGroupItem title="Vue2.x" active>

  ```js
  import Vue from 'vue';
  import keep from '@bye_past/vue-keep'
  import App from './App.vue';
  import router from './router';

  Vue.use(keep, router)

  new Vue({
    router,
    render: (h) => h(App)
  }).$mount('#app');
  ```

  </CodeGroupItem>

  <CodeGroupItem title="Vue3.x">

  ```js
  import { createApp } from 'vue';
  import keep from '@bye_past/vue-keep'
  import router from './router/index';
  import App from './App.vue';

  const app = createApp(App);
  app.use(router);
  app.use(keep, router);
  app.mount('#app');
  ```

  </CodeGroupItem>
</CodeGroup>

**App.vue**
::: tip
Where you need to cache page components, replace `<router-view />` with `<keep-router-view />`
:::
```vue
<template>
  <keep-router-view />
</template>
```

## Component properties

<table class="table table-bordered table-striped table-condensed">
  <tr>
    <td>max (Number)</td>
	  <td>Maximum number of pages cached (default: 5)</td>
  </tr>
  <tr>
    <td>exclude (Array | String)</td>
	  <td>String or regular expression. Any component whose name matches will not be cached</td>
  </tr>
</table>

## Router object

**`Route`**: Add (destroy/cache) page component properties, namely `destory`, `cache`, `constCache`.
   > **`destory`(String|Array)**: Whether to destroy some page components when jumping (destroy all `destory: 'ALL'`), the parameter is `route.name`.
   > **`cache`(Boolean)**: Whether to use the cached page to jump to the next page, if `cache` is not provided, the default jump will belong to the new page.
   > **`constCache`(Boolean)**: The biggest difference between `constCache` and `cache` is that `cache` can be dynamically changed, constCache is a jump is a mandatory cache, usually with `beforeEach` for highly customized caching.
```js
// Jump to the Goods page, which is a new page
$router.push({ name: 'Goods' });

// Jump to the Cart page, if the Cart has been cached, the page is a cached page
$router.replace({ name: 'Cart', cache: true });

// Jump to the Goods page, delete the Cart page component, if the Goods has been cached, the page belongs to the cached page
$router.push({ name: 'Goods', destory: 'Cart', cache: true });

// Jump to the Goods page and delete the Cart and User page components. If the Goods has been cached, the page is a cached page
$router.push({ name: 'Goods', destory: ['Cart', 'User'], cache: true });

// Jump to the Goods page, delete all page caches, this page is a new page
$router.push({ name: 'Goods', destory: 'ALL', cache: true });
```


### Jump
---

#### `router.jump` is a jump method added by `VueKepp`, which can be used to replace `go`, `forword`, and `back` methods in some scenarios.
The existence of the >`jump` method is mainly to provide a convenient way of destruction in the above jump, and to jump to the cache page.
```js
router.jump({ type: 'forword', cache: true }); // forword
router.jump({ type: 'back', cache: true }); // back
router.jump(-1, { type: 'go', cache: true }); // go
router.jump(-1, { cache: true}); // go can write no type
```

**[About destroy](./destroy.md)**