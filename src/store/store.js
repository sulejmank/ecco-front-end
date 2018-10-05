import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: {},
    plan: {},
    room: {},
    customer: {},
    currentPassenger: {},
    tickets: [],
    passangers: [],
    arrangements: [],
    allPassangers: [],
    editingTicket: {},
    dinarEuroDiffernece: 0
  },
  mutations: {
    setFlightTicket: (state, ticket) => {
      state.editingTicket = ticket
    },
    setRoom: (state, room) => {
      state.room = room
    },
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
    },
    addFlightTicket: (state, newTicket) => {
      state.tickets.push(newTicket)
    },
    addArrangement: (state, arrangement) => {
      state.arrangements.push(arrangement)
    },
    addMultipleArrangement: (state, newArrangements) => {
      newArrangements.forEach(el => (state.arrangements.push(el)))
    },
    setAllFlightTickets: (state, context) => {
      state.tickets = context
    },
    setAllArrangement: (state, context) => {
      state.arrangements = context
    },
    removeFlightTicket: (state, index) => {
      state.tickets = state.tickets.filter((el, i) => {
        return i !== index
      })
    },
    removeArrangement: (state, index) => {
      state.arrangements = state.arrangements.filter((el, i) => {
        return i !== index
      })
    },
    setPlan: (state, plan) => {
      state.plan = plan
    },
    setCurrencyDifference: (state, difference) => {
      state.dinarEuroDiffernece = difference
    },
    setLoggedInUser: (state, user) => {
      state.user = user
    }
  },
  getters: {
    getEditingFlightTicket: state => {
      return state.editingTicket
    },
    getPlan: state => {
      return state.plan
    },
    getRoom: state => {
      return state.room
    },
    getCustomerId: state => {
      return state.customer.id
    },
    getCustomer: state => {
      return state.customer
    },
    getCurentPassengerId: state => {
      return state.currentPassenger.id
    },
    getCurrentPassenger: state => {
      return state.currentPassenger
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
    },
    getArrangements: (state) => {
      return state.arrangements
    },
    getCurrencyDifference: (state) => {
      return state.dinarEuroDiffernece
    },
    getUser: (state) => {
      return state.user
    },
    isLoggedIn: (state) => {
      return state.user.id !== undefined
    }
  },
  actions: {
    storePushPassanger: (context, payload) => {
      context.commit('setCurrentPassenger', payload)
      // context.commit('storePassenger') TODO: make it be added by different action
    },
    storePushPassangerToGroup: (context, payload) => {
      context.commit('storePassenger')
    },
    restartPlan: (context, payload) => {
      context.commit('setPlan', {})
      context.commit('setCustomer', {})
      context.commit('removeAllPassanger', {})
      context.commit('setCurrentPassenger', {})
      context.commit('setAllArrangement', [])
      context.commit('setAllFlightTickets', [])
    }
  }
})
