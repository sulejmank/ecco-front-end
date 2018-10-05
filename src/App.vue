<template>
  <div id="app">
    <!--<div>
       #Left Sidebar
      <sidebar v-show="!isLoginScreen"></sidebar>
       #Main
      <div :class="{'page-container': true, 'pl-0':isLoginScreen}">
        ### $Topbar ###
        <navigation v-show="!isLoginScreen"></navigation>
        ### $App Screen Content ###
        <router-view/>

         ### $App Screen Footer ###
        <footer class="bdT ta-c p-30 lh-0 fsz-sm c-grey-600">
          <span>Copyright © 2017 Designed by <a href="https://colorlib.com" target='_blank' title="Colorlib">Colorlib</a>. All rights reserved.</span>
        </footer>
      </div>
    </div> -->
    <router-view></router-view>
  </div>
</template>

<script>
import router from '@/router'
import Navigation from '@/components/Navigation'
import { store } from './store/store.js'
// import Api from '@/services/api.js'

router.beforeEach((to, from, next) => {
  if (store.getters.isLoggedIn || to.name === 'Login') {
    next()
  } else {
    if (window.localStorage.getItem('user')) {
      var user = JSON.parse(window.localStorage.getItem('user'))
      store.commit('setLoggedInUser', user)
      next()
    } else {
      next('login')
    }
  }
})

export default {
  name: 'App',
  components: {
    'navigation': Navigation
  },
  computed: {
    isCurrentProductPlacement () {
      return router.history.current.name !== 'ProductPlacement'
    },
    isLoginScreen () {
      return router.history.current.name === 'Login'
    },
    isLoggedIn () {
      return this.$store.getters.isLoggedIn
    }
  },
  methods: {
    toCheckout () {
      router.push('check-out')
    }
  }
}
</script>
<style>
.application .theme--light.v-list .v-list__group__header:hover, .application .theme--light.v-list .v-list__tile--highlighted, .application .theme--light.v-list .v-list__tile--link:hover, .theme--light .v-list .v-list__group__header:hover, .theme--light .v-list .v-list__tile--highlighted, .theme--light .v-list .v-list__tile--link:hover {
    background: rgb(102, 170, 255) !important;
    color: #fff !important;
}
</style>
