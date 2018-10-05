import Vue from 'vue'
import Router from 'vue-router'
// import LoginOld from '@/screens/LoginOld'
import Login from '@/screens/Login'
import Settings from '@/screens/Settings'
import PlansList from '@/screens/PlansList'
import UsersList from '@/screens/UsersList'
import Navigation from '@/components/Navigation'
import Dashboard from '@/views/Dashboard'
import CustomersList from '@/screens/CustomersList'
import ArrangmentStore from '@/entities/ArrangmentStore'
import ArrangementsList from '@/screens/ArrangementsList'
import BusTicketStore from '@/entities/BusTicketStore'
import TicketsList from '@/screens/TicketsList'
import FlightTicketStore from '@/entities/FlightTicketStore'
import TicketStore from '@/entities/TicketStore'
import Arrangement from '@/components/Arrangement'

Vue.use(Router)

const router = new Router({
  routes: [
    // { path: '', name: 'PlansList', component: PlansList },
    // { path: '/', name: 'PlansList', component: PlansList },
    { path: '/', name: 'Login', component: Login },
    // {
    //   path: '/customers',
    //   name: 'CustomersList',
    //   component: CustomersList
    // },
    {
      path: '/arrangement',
      name: 'Arrangement',
      component: Arrangement
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: '',
          name: 'Navigation',
          component: Navigation
        },
        {
          path: 'settings',
          name: 'Settings',
          component: Settings
        },
        {
          path: 'users',
          name: 'UsersList',
          component: UsersList
        },
        {
          path: 'customers',
          name: 'CustomersList',
          component: CustomersList
        },
        {
          path: 'arrangements',
          name: 'ArrangementsList',
          component: ArrangementsList
        },
        {
          path: 'plans',
          name: 'PlansList',
          component: PlansList
        },
        {
          path: 'tickets-store/:type',
          name: 'TicketStore',
          component: TicketStore
        },
        {
          path: 'flight-tickets-store',
          name: 'FlightTicketStore',
          component: FlightTicketStore
        },
        {
          path: 'flight-tickets-store/:id',
          name: 'FlightTicketStore',
          component: FlightTicketStore
        },
        {
          path: 'bus-tickets-store',
          name: 'BusTicketStore',
          component: BusTicketStore
        },
        {
          path: 'bus-tickets-store/:id',
          name: 'BusTicketStore',
          component: BusTicketStore
        },
        {
          path: 'tickets/:type',
          name: 'TicketsList',
          component: TicketsList
        },
        {
          path: 'arrangment-store',
          name: 'ArrangmentStore',
          component: ArrangmentStore
        },
        {
          path: 'arrangment-store/:id',
          name: 'ArrangmentStore',
          component: ArrangmentStore
        }
      ]
    }
  ],
  mode: 'history'
})

export default router
