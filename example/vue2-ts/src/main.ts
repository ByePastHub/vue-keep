import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import keep, { beforeEach } from '@bye_past/vue-keep'
// import keep, { beforeEach } from '../../../dist/vue-keep.esm.js'
import 'wowjs/css/libs/animate.css'
import wow from 'wowjs'
import { Toast } from 'vant'

Vue.config.productionTip = false

beforeEach((to, from) => {
  console.log('keepBeforeEach', to, from)
})

Vue.prototype.$wow = wow
Vue.use(Toast)
Vue.use(keep, router)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
