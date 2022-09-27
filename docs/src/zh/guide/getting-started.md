# 快速上手

## 注册使用

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
在需要缓存页面组件的地方，将 `<router-view />` 替换为 `<keep-router-view />`
:::
```vue
<template>
  <keep-router-view />
</template>
```

## 组件属性

<table class="table table-bordered table-striped table-condensed">
  <tr>
    <td>max (Number)</td>
	  <td>页面最大缓存数量 (default: 5)</td>
  </tr>
  <tr>
    <td>exclude (Array | String)</td>
	  <td>字符串或正则表达式。任何名称匹配的组件都不会被缓存</td>
  </tr>
</table>

## Router 对象

- **`Route`**: 添加(销毁/缓存)页面组件属性，分别是`destroy`、`cache`、`constCache`。
  > **`destroy`(String|Array)**: 跳转时是否要销毁某些页面组件(销毁全部`destroy: 'ALL'`)，参数为`route.name`。
  > **`cache`(Boolean)**: 跳转到下一个页面是否使用缓存页面，如果`cache`没有提供，默认跳转都是属于新页面。
  > **`constCache`(Boolean)**: `constCache`跟`cache`最大的区别是`cache`可以被动态改变的，constCache是跳转是强制缓存，一般是配合`beforeEach`做高度定制化缓存使用的。(v1.2.1)
```js
// 跳转到 Goods 页面，该页面属于新页面
$router.push({ name: 'Goods' });

// 跳转到 Cart 页，如果Cart已经被缓存过，该页面属于缓存页面
$router.replace({ name: 'Cart', cache: true });

// 跳转到 Cart 页，如果Cart已经被缓存过，该页面属于缓存页面
$router.replace({ name: 'Cart', cache: false, constCache: true });

// 跳转到 Goods 页面 ，删除 Cart 页面组件，如果 Goods 已经被缓存过，该页面属于缓存页面
$router.push({ name: 'Goods', destroy: 'Cart', cache: true });

// 跳转到 Goods 页面 ，删除 Cart、User 页面组件，如果 Goods 已经被缓存过，该页面属于缓存页面
$router.push({ name: 'Goods', destroy: ['Cart', 'User'], cache: true });

// 跳转到 Goods 页面，删除全部页面缓存，该页面属于新页面
$router.push({ name: 'Goods', destroy: 'ALL', cache: true });
```


### Jump
---

#### `router.jump`是`VueKepp`跳添加的转方法，某些场景下可以用作替换`go`、`forword`、`back`方法。
>`jump`方法的存在，主要为了提供上面跳转中便捷的销毁方式，以及跳转缓存页面。
```js
router.jump({ type: 'forword', cache: true }); // forword
router.jump({ type: 'back', cache: true }); // back
router.jump(-1, { type: 'go', cache: true }); // go
router.jump(-1, { cache: true}); // go 可以不写类型
```

**[关于 destroy](./destroy.md)**