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
      return [{
        'avioKompanija': 'Nis Ekspres',
        'brojRezervacije': '12333213',
        'cena': 40,
        'datumDolaska': '22/06/2018 21:56',
        'datumPolaska': '30/05/2018 21:57',
        'datumRezervacije': 'Mon Mar 12 2018 19: 20: 56 GMT + 0100(CET)',
        'idPutnika': 8,
        'jedanParvac': true,
        'potvrdjeno': false,
        'putovanjeDo': 'Belgrade, Serbia',
        'putovanjeOd': 'Skopje, Macedonia (FYROM)'
      }, {
        'avioKompanija': 'Wizair',
        'brojRezervacije': '123949594',
        'cena': 200,
        'datumDolaska': '07/05/2018 14:00',
        'datumPolaska': '30/04/2018 15:50',
        'datumRezervacije': 'Mon Mar 12 2018 19: 19: 12 GMT + 0100(CET)',
        'idPutnika': 2,
        'jedanParvac': true,
        'potvrdjeno': false,
        'putovanjeDo': 'Paris, France',
        'putovanjeOd': 'Skopje, Macedonia (FYROM)'
      }, {
        'avioKompanija': 'Aurora',
        'brojRezervacije': '1230349',
        'cena': 10,
        'datumDolaska': '',
        'datumPolaska': '07/04/2018 10:10',
        'datumRezervacije': 'Mon Mar 12 2018 19: 19: 12 GMT + 0100(CET)',
        'idPutnika': 2,
        'jedanParvac': false,
        'potvrdjeno': false,
        'putovanjeDo': 'Novi Pazar, Serbia',
        'putovanjeOd': 'Skopje, Macedonia (FYROM)'
      }]
    }, // return state.tickets
    getAllPassengers: state => {
      return [{
        'adresa': 'Sutenovacka 13',
        'brojPasosa': '011512B',
        'brojTelefona': '0654261211',
        'cardId': 'asd',
        'createdAt': '2018-03-09T21:43:14.000Z',
        'datumRodjenja': '1993-09-21',
        'email': 'hariszenovic@gmail.com',
        'id': 2,
        'ime': 'Haris',
        'prezime': 'Zenovic',
        'putnik': false,
        'struka': 'Programer',
        'updatedAt': '2018-03-09T21:43:14.000Z',
        'urlSlike': 'https://s.ytimg.com/yts/img/avatar_720-vflYJnzBZ.png'
      },
      {
        'adresa': 'Tashko Karadza',
        'brojPasosa': '123123123',
        'brojTelefona': '01239495123',
        'cardId': '123123123',
        'createdAt': '2018-03-09T21:43:14.000Z',
        'datumRodjenja': '1994-04-22',
        'email': 'hamzakujovic@gmail.com',
        'id': 8,
        'ime': 'Sulejman',
        'prezime': 'Karisik',
        'putnik': true,
        'struka': 'Programer',
        'updatedAt': '2018-03-09T21:43:14.000Z',
        'urlSlike': 'https://s.ytimg.com/yts/img/avatar_720-vflYJnzBZ.png'
      }
      ]
    }, // return state.allPassangers
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
