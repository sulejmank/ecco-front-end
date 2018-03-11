import Vue from 'vue'
import Router from 'vue-router'
import Customer from '@/components/Customer'
import Navigation from '@/components/Navigation'
import FlightTicket from '@/components/FlightTicket'
import Checkout from '@/components/Checkout'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/customer',
      name: 'Customer',
      component: Customer
    },
    {
      path: '/navigation',
      name: 'Navigation',
      component: Navigation
    },
    {
      path: '/flight-ticket',
      name: 'FlightTicket',
      component: FlightTicket
    },
    {
      path: '/check-out',
      name: 'Checkout',
      component: Checkout
    }
  ]
})
