import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    customer: {},
    currentPassenger: {},
    passangers: [],
    allPassangers: [],
    products: [],
    tickets: []
  },
  mutations: {
    setCustomer: (state, customer) => {
      state.customer = customer
    },
    setCurrentPassenger: (state, customer) => {
      state.currentPassenger = customer
    },
    setCustomerId: (state, id) => {
      state.customer.id = id
    },
    setCurrentPassengerId: (state, id) => {
      state.currentPassenger.id = id
    },
    storePassenger: state => {
      state.passangers.push(state.currentPassenger)
      state.currentPassenger = {}
    },
    removePassanger: (state, index) => {
      state.passangers = state.passangers.filter((el, i) => {
        return i !== index
      })
    },
    removeAllPassanger: state => {
      state.allPassangers = state.allPassangers.concat(state.passangers)
      state.passangers = []
    },
    addFlightTickets: (state, newTickets) => {
      newTickets.forEach(el => state.tickets.push(el))
    }
  },
  getters: {
    getCustomerId: state => {
      return state.customer.id
    },
    getCustomer: state => {
      return state.customer
    },
    getCurentPassengerId: state => {
      return state.currentPassenger.id
    },
    getCurentPassengers: state => {
      return state.passangers
    },
    getFlightTickets: state => {
      return state.tickets
    },
    getAllPassengers: state => {
      return state.allPassangers
    },
    getPassangerById: (state, id) => {
      var passenger
      state.allPassangers.forEach(el => {
        if (el.id === id) {
          passenger = el
        }
      })
      return passenger
    }
  },
  actions: {
    storePushPassanger: (context, payload) => {
      context.commit('setCurrentPassenger', payload)
      context.commit('storePassenger')
    }
  }
})
