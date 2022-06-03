# destroy
---

If you need to destroy the cached page components, you can use destroy to destroy
- destroy property and method parameters are Route.name `String | Array`, the only special value: `ALL` destroy all
- Provide the `$keepRouter` global object in the Vue instance

### Destroy inside Vue instance
---

```vue
<router-link :to="{name: 'Home', destroy: 'About'}">
  Jump to the Home page and destroy the About page
</router-link>

<button @click="$router.replace({name: 'Home', destroy: 'About'})">
  Jump to the Home page and destroy the About page
<button>

<button @click="$router.push({name: 'Home', destroy: ['Page1', 'Page2']})">
  Jump to the Home page and destroy the Page1 and Page2 pages
<button>

<button @click="$router.push({name: 'Home', destroy: 'ALL'})">
  Jump to the Home page and destroy all cached pages
<button>

<button
  @click="() => {
    $router.push({name: 'Home'});
    $keepRouter.destroy('About');
  }"
> Jump to the Home page and destroy the About page <button>
```

### Destroy outside the Vue instance
---

```js
import { destroy } from 'vue-keep';

destroy(['Page1', 'Page2']);
```