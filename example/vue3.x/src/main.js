import { createApp } from 'vue';
import App from './App.vue';
import keepRouterView from '../../../dist/vue-keep.esm.js';
import router from './router/index.js';
import { Toast } from 'vant';

// keepRouterView.beforeEach((to) => {
//   console.log('to', to);
// });

const app = createApp(App);
app.use(keepRouterView, router);
app.use(router);
app.use(Toast);
app.mount('#app');
