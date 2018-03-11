import axios from 'axios'
// import Customer from '@/models/Customer.js'
import Suggestion from '@/models/Suggestion.js'

export default class Api {
  constructor () {
    this.baseUrl = 'http://ecco.local'
  }
  getSuggestedCustomers (input) {
    return axios.get(this.api.baseUrl + '/api/relevantCustomer?search=' + input).then(
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

  saveCustomer (customer) {
    return axios.post(this.baseUrl + '/api/addCustomer', customer)
  }

  savePassanger (customer) {
    customer.putnik = true
    return axios.post(this.baseUrl + '/api/addCustomer', customer)
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
