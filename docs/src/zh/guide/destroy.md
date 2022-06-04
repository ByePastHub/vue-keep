# 销毁
---

如果需要销毁已缓存的页面组件，可以使用 destroy 来进行销毁
- destroy 属性跟方法参数为 Route.name `String | Array`，唯一特殊值: `ALL` 销毁全部
- 在Vue实例中提供`$keepRouter`全局对象

### 在Vue实例内部销毁
---

```vue
<router-link :to="{name: 'Home', destroy: 'About'}">
  跳转到Home页面，并销毁About页面
</router-link>

<button @click="$router.replace({name: 'Home', destroy: 'About'})">
  跳转到Home页面，并销毁About页面
<button>

<button @click="$router.push({name: 'Home', destroy: ['Page1', 'Page2']})">
  跳转到Home页面，并销毁Page1、Page2页面
<button>

<button @click="$router.push({name: 'Home', destroy: 'ALL'})">
  跳转到Home页面，并销毁全部缓存页面
<button>

<button
  @click="() => {
    $router.push({name: 'Home'});
    $keepRouter.destroy('About');
  }"
>跳转到Home页面，并销毁About页面<button>
```

### 在拿不到Vue实例外销毁
---

```js
import { destroy } from '@bye_past/vue-keep';

destroy(['Page1', 'Page2']);
```
