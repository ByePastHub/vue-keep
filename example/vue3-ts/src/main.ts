import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// import keep from '@bye_past/vue-keep'
import keep from '../../../dist/vue-keep.esm.js';
import { Toast } from 'vant'

const app = createApp(App);
app.use(keep, router);
app.use(Toast)
app.use(router);
app.use(Toast);
app.mount('#app');