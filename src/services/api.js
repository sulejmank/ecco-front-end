import axios from 'axios'
// import Customer from '@/models/Customer.js'
import Suggestion from '@/models/Suggestion.js'

export default class Api {
  constructor () {
    this.baseUrl = 'http://localhost:3000' // vrati na ecco.local
  }
  getSuggestedCustomers (input) {
    return axios.get(this.api.baseUrl + '/api/relevantKlijent?search=' + input).then(
      res => {
        if (res.data !== undefined) {
          var customerSuggestions = res.data.map(el => {
            return new Suggestion(el.ime + ', ' + el.prezime, el.struka, el)
          })
          return customerSuggestions
        }
        return []
      }, err => {
        return err
      })
  }

  uploadPhoto (event) {
    let data = new FormData()
    data.append('image', event.target.files[0])

    return axios.post(this.baseUrl + '/api/upload', data)
  }
  saveCustomer (customer) {
    return axios.post(this.baseUrl + '/api/addKlijent', customer)
  }

  addPassToAng (idPutnika, idAngazmana) {
    return axios.post(this.baseUrl + '/api/addtoang', {idPutnika: idPutnika, idAngazmana: idAngazmana})
  }

  getAngazmani () {
    return axios.get(this.baseUrl + '/api/angazmani')
  }

  saveAngazman (ang) {
    return axios.post(this.baseUrl + '/api/addAng', ang)
  }

  savePassanger (customer) {
    customer.putnik = true
    return axios.post(this.baseUrl + '/api/addKlijent', customer)
  }

  makePurchase (flightTickets) {
    return axios.post(this.baseUrl + '/api/addAvio', flightTickets[0])
  }

  getKarte () {
    return axios.get(this.baseUrl + '/api/karte')
  }

  checkTicket (uid) {
    return axios.post(this.baseUrl + '/api/checkTicket', {id: uid})
  }
  
  getPutnik (id) {
    return axios.post(this.baseUrl + '/api/putnik', {id: id})
  }

  getNoveKupovine () {
    return axios.get(this.baseUrl + '/api/purchases')
  }

  getPlaceSuggestion (input) {
    return axios.get(this.api.baseUrl + '/api/search' + '?input=' + encodeURI(input)).then(
      res => {
        console.log(res)
        if (res.data !== undefined) {
          var placesSuggestions = res.data.map(el => {
            return new Suggestion(el.structured_formatting.main_text, el.structured_formatting.secondary_text, el.structured_formatting.main_text + ', ' + el.structured_formatting.secondary_text)
          })
          return placesSuggestions
        }
        return []
      }, err => {
        return err
      })
  }
}
