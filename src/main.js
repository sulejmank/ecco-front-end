import '@babel/polyfill'
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import './assets/styles/index.scss'
import 'vuetify/dist/vuetify.min.css'
// import 'babel-polyfill'
import Vue from 'vue'
// import HighchartsVue from 'highcharts-vue'
// import Highcharts from 'highcharts'
// import stockInit from 'highcharts/modules/stock'
// import mapInit from 'highcharts/modules/map'
// import pieInit from 'highcharts/modules/pie'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'
import VeeValidate from 'vee-validate'
// import VueAsyncProperties from 'vue-async-properties'
import { store } from './store/store.js'
import AsyncComputed from 'vue-async-computed'
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "$" }] */
// import { $ } from 'jquery'
// import 'bootstrap'
import DisableAutocomplete from 'vue-disable-autocomplete'
// Helpers
import colors from 'vuetify/es5/util/colors'
import VueHighcharts from 'vue2-highcharts'
// stockInit(Highcharts)
// mapInit(Highcharts)
// pieInit(Highcharts)
Vue.use(Vuetify, {
  theme: {
    primary: colors.teal.darken4,
    accent: colors.teal.accent4,
    secondary: colors.amber.base,
    info: colors.lightBlue.base,
    warning: colors.orange.darken2,
    error: colors.red.lighten1,
    success: colors.green.lighten1
  }
})

Vue.use(DisableAutocomplete)
// Vue.use(VueAsyncProperties)
Vue.use(AsyncComputed)
Vue.use(VueHighcharts)
// import 'bootstrap/js/dist/dropdown'
// import BootstrapVue from 'bootstrap-vue'

Vue.config.productionTip = false
Vue.use(VeeValidate)
// Vue.use(BootstrapVue)

/* eslint-disable no-new */
new Vue({
  store: store,
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
