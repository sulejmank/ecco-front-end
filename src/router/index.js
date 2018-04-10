import Vue from 'vue'
import Router from 'vue-router'
import Customer from '@/components/Customer'
import Navigation from '@/components/Navigation'
import FlightTicket from '@/components/FlightTicket'
import Checkout from '@/components/Checkout'
import Angazman from '@/components/Angazman'
import Statistic from '@/components/Statistic'
import Transfers from '@/components/Transfers'


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
    },
    {
      path: '/angazman',
      name: 'Angazman',
      component: Angazman
    },
    {
      path: '/statistic',
      name: 'Statistic',
      component: Statistic
    },
    {
      path: '/transfers',
      name: 'Transfer',
      component: Transfers
    }
  ]
})
