import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import keep, { beforeEach } from '../../../dist/vue-keep.esm.js';
// import keep, { beforeEach } from './vue-keep.esm.js';
// import keep, { beforeEach } from '@bye_past/vue-keep';
import { Toast } from 'vant';

beforeEach((to, from) => {
  console.log('keepBeforeEach', to, from);
});

const app = createApp(App);
app.use(keep, router);
app.use(router);
app.use(Toast);
app.mount('#app');
