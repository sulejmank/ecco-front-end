// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'bootstrap'
import Vue from 'vue'
import App from './App'
import router from './router'
import VeeValidate from 'vee-validate'
import { store } from './store/store.js'
import BootstrapVue from 'bootstrap-vue'

Vue.config.productionTip = false
Vue.use(VeeValidate)
Vue.use(BootstrapVue)

/* eslint-disable no-new */
new Vue({
  store: store,
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
