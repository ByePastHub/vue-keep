import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
// import keep from '../../../dist/vue-keep.esm.js';
import keep from './vue-keep.esm.js';
// import keep from './vue-keep.esm.js';
// import keep from '@bye_past/vue-keep';
import { Toast } from 'vant';

// keep.beforeEach((to) => {
//   console.log('to', to);
// });

const app = createApp(App);
app.use(keep, router);
app.use(router);
app.use(Toast);
app.mount('#app');
