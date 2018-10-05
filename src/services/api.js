import axios from 'axios'
import toast from './toast'
// import Customer from '@/models/Customer.js'
// import Suggestion from '@/models/Suggestion.js'
import queryString from 'query-string'

export default class Api {
  constructor () {
    axios.defaults.withCredentials = true
    axios.defaults.crossDomain = true
    axios.defaults.handleErrors = false
    this.baseUrl = process.env.ROOT_URL // vrati na ecco.local
    axios.interceptors.response.use(
      response => response,
      this.errorResponseHandler)
  }

  errorResponseHandler (error) {
    // console.log(error, error.config.hasOwnProperty('errorHandle'), error.config.errorHandle === false)
    if (error.config.hasOwnProperty('errorHandle') && error.config.errorHandle === false) {
      return Promise.reject(error)
    }
    // if has response show the error
    if (error.response) {
      toast.error(error.response.data.message)
      return error
    }
  }

  getSuggestedCustomers (input) {
    return axios.get(this.baseUrl + '/api/relevant/client?search=' + input)
  }

  getSuggestedPassanger (input) {
    return axios.get(this.baseUrl + '/api/relevant/passanger?search=' + input)
  }

  getCompanySuggestion (input) {
    return axios.get(this.baseUrl + '/api/relevant/company?search=' + input)
  }

  getAgentSuggestion (input) {
    return axios.get(this.baseUrl + '/api/relevant/agent?search=' + input)
  }

  getHotelSuggestion (input) {
    return axios.get(this.baseUrl + '/api/relevant/hotel?search=' + input)
  }

  deleteCustomer (id) {
    return axios.post(this.baseUrl + '/api/client/' + id)
  }

  uploadPhoto (event) {
    let data = new FormData()
    data.append('image', event.target.files[0])

    return axios.post(this.baseUrl + '/api/upload', queryString.stringify(data))
  }
  saveCustomer (customer) {
    delete customer.updatedAt
    delete customer.createdAt
    delete customer.kupac
    return axios.post(this.baseUrl + '/api/addClient', queryString.stringify(customer))
  }
  addPassenger (idAngazmana, idPutnika) {
    return axios.post(this.baseUrl + '/api/addtoang', queryString.stringify({idPutnika: idPutnika, idAngazmana: idAngazmana}))
  }
  getAngazmani () {
    return axios.get(this.baseUrl + '/api/angazmani')
  }
  saveArrangement (ang) {
    return axios.post(this.baseUrl + '/api/arrangement', queryString.stringify(ang))
  }
  savePlan (checkout) {
    return axios.post(this.baseUrl + '/api/plan', queryString.stringify(checkout))
  }
  savePassanger (passanger) {
    return axios.post(this.baseUrl + '/api/passanger', queryString.stringify(passanger))
  }

  savePassangerWithRoom (passanger) {
    return axios.post(this.baseUrl + '/api/passanger/room', queryString.stringify(passanger))
  }

  saveRoom (room) {
    return axios.post(this.baseUrl + '/api/room', queryString.stringify(room))
  }
  saveTicket (ticket) {
    return axios.post(this.baseUrl + '/api/ticket', queryString.stringify(ticket))
  }
  getKarte () {
    return axios.get(this.baseUrl + '/api/karte')
  }
  checkTicket (uid) {
    return axios.post(this.baseUrl + '/api/ticket/check', queryString.stringify({id: uid}))
  }
  uncheckTicket (uid) {
    return axios.post(this.baseUrl + '/api/ticket/uncheck', queryString.stringify({id: uid}))
  }
  getPutnik (id) {
    return axios.post(this.baseUrl + '/api/putnik', queryString.stringify({id: id}))
  }
  getNoveKupovine () {
    return axios.get(this.baseUrl + '/api/purchases')
  }
  getCustomers () {
    return axios.get(this.baseUrl + '/api/list')
  }
  getFlightTickets () {
    return axios.get(this.baseUrl + '/api/tickets/flight')
  }
  getBusTickets () {
    return axios.get(this.baseUrl + '/api/tickets/bus')
  }
  getTickets (type) {
    return axios.get(this.baseUrl + '/api/tickets/' + type)
  }
  getArrangements () {
    return axios.get(this.baseUrl + '/api/arrangements')
  }
  getPlaceSuggestion (input) {
    return axios.get(this.baseUrl + '/api/search' + '?input=' + encodeURI(input))
  }
  updatePlan (plan) {
    return axios.put(this.baseUrl + '/api/plan/' + plan.id, queryString.stringify(plan))
  }
  euroToRsd () {
    return axios.get('https://free.currencyconverterapi.com/api/v5/convert?q=EUR_RSD&compact=y&callback=sampleCallback')
  }
  getPlans () {
    return axios.get(this.baseUrl + '/api/plans')
  }

  getPlansById (id) {
    return axios.get(this.baseUrl + '/api/plan/' + id)
  }

  getCustomerById (id) {
    return axios.get(this.baseUrl + '/api/client/' + id)
  }

  deletePlansById (id) {
    return axios.get(this.baseUrl + '/api/plan/' + id + '/delete')
  }

  login (username, password) {
    return axios.post(this.baseUrl + '/api/login', queryString.stringify({username: username, password: password}))
  }

  logout () {
    return axios.post(this.baseUrl + '/api/logout')
  }

  isLoggedIn () {
    return axios.get(this.baseUrl + '/api/isLoggedin')
  }

  getBillInWordDocument (id) {
    // console.log(this.baseUrl + 'api/bill/' + id)
    return axios.get(this.baseUrl + '/api/bill/' + id, {
      responseType: 'blob'
    })
  }

  getBillPreviewInWordDocument (id) {
    return axios.get(this.baseUrl + '/api/billPreview/' + id)
  }

  removePreviewBill (id) {
    return axios.post(this.baseUrl + '/api/billRemove/' + id)
  }

  makePayment (id, payment) {
    return axios.post(this.baseUrl + '/api/payment/' + id, queryString.stringify(payment))
  }

  getAllPayments (id) {
    return axios.get(this.baseUrl + '/api/payment/' + id)
  }

  deletePayment (id) {
    return axios.delete(this.baseUrl + '/api/payment/' + id)
  }

  getTicketById (id) {
    return axios.get(this.baseUrl + '/api/ticket/' + id)
  }

  saveChangedTicket (ticket) {
    return axios.put(this.baseUrl + '/api/ticket/' + ticket.id, queryString.stringify(ticket))
  }

  saveChangedArrangement (arrangement) {
    return axios.put(this.baseUrl + '/api/arrangement/' + arrangement.id, queryString.stringify(arrangement))
  }

  saveDestination (destination) {
    return axios.post(this.baseUrl + '/api/destination', queryString.stringify(destination))
  }

  removeAllPassangersFromTicket (id) {
    return axios.post(this.baseUrl + '/api/passanger/tickets/' + id)
  }

  removeAllRoomsFromArrangement (id) {
    return axios.post(this.baseUrl + '/api/room/arrangement/' + id)
  }

  getPicklist (delimeter) {
    return axios.get(this.baseUrl + '/api/picklist?delimeter=' + delimeter)
  }

  getDestinations () {
    return axios.get(this.baseUrl + '/api/destinations')
  }

  getAllUsers () {
    return axios.get(this.baseUrl + '/api/users')
  }

  addUser (user) {
    return axios.post(this.baseUrl + '/api/user', queryString.stringify(user))
  }

  deleteUser (id) {
    return axios.delete(this.baseUrl + '/api/user/' + id)
  }

  addPicklistOption (picklist) {
    return axios.post(this.baseUrl + '/api/picklist', queryString.stringify(picklist))
  }

  deletePicklistOption (id) {
    return axios.delete(this.baseUrl + '/api/picklist/' + id)
  }

  addCompany (company) {
    return axios.post(this.baseUrl + '/api/company', queryString.stringify(company))
  }

  addClientAsPassanger (ticketId, clientId, brojRezervacije) {
    return axios.post(this.baseUrl + '/api/passanger/' + clientId + '/ticket/' + ticketId, queryString.stringify({brojRezervacije: brojRezervacije}))
  }

  getCompanies () {
    return axios.get(this.baseUrl + '/api/companies')
  }

  deleteCompany (id) {
    return axios.delete(this.baseUrl + '/api/company/' + id)
  }

  addAgent (agent) {
    return axios.post(this.baseUrl + '/api/agent', queryString.stringify({name: agent, id: null}))
  }

  getAgents () {
    return axios.get(this.baseUrl + '/api/agents')
  }

  deleteAgent (id) {
    return axios.delete(this.baseUrl + '/api/agent/' + id)
  }

  addHotel (hotel) {
    return axios.post(this.baseUrl + '/api/hotel', queryString.stringify({name: hotel, id: null}))
  }

  getHotels () {
    return axios.get(this.baseUrl + '/api/hotels')
  }

  deleteHotel (id) {
    return axios.delete(this.baseUrl + '/api/hotel/' + id)
  }

  addPassangerOnArrangement (passanger) {
    return axios.post(this.baseUrl + '/api/passanger/arrangement', queryString.stringify(passanger))
  }

  removeAllPassangersFromArrangement (id) {
    return axios.post(this.baseUrl + '/api/passanger/arrangement/' + id)
  }

  setClientAsPassangerOnArrangement (id, arrangementId) {
    return axios.post(this.baseUrl + '/api/passanger/' + id + '/arrangement/' + arrangementId)
  }

  getCustomerStatistics () {
    return axios.get(this.baseUrl + '/api/statistics/customers')
  }

  getDestinationsStatistics () {
    return axios.get(this.baseUrl + '/api/statistics/destinations')
  }

  generateMemorandum (id) {
    return axios.post(this.baseUrl + '/api/upload/' + id)
  }

  downloadFile (id) {
    return axios.get(this.baseUrl + '/api/download/' + id, {dataType: 'binary', responseType: 'arraybuffer', timeout: 30000, processData: false})
  }
}
