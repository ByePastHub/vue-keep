import Vue from "vue";
import App from "./App.vue";
import keepRouterView from "../../../dist/vue-keep.cjs";
import router from "./router";
import { Toast } from "vant";
// import keepRouterView from "vue-with-keep-alive";

Vue.config.productionTip = false;

Vue.use(keepRouterView, router);
Vue.use(Toast);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
