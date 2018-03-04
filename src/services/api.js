import axios from 'axios'
import Customer from '@/models/Customer.js'
// constructor (name, surname, email, passportNumber, phoneNumber, dateOfBirth)
export default class Api {
  constructor () {
    this.baseUrl = 'http://ecco.local'
  }
  getSuggestedCustomers () {
    var promise = Promise.resolve([
      new Customer('Haris', 'Zenovic', 'zenovicharis@gmail.com', '51155054', '+381654261211', '21/09/1993'),
      new Customer('Sulejman', 'Karisik', 'karisiks@gmail.com', '51155054', '+381654261211', '31/12/1994'),
      new Customer('Merdan', 'Sabotic', 'saboticm@gmail.com', '51155054', '+381654261211', '19/09/1995'),
      new Customer('Dzenan', 'Imamovic', 'imamovicdze@gmail.com', '51155054', '+381654261211', '4/03/1995')
    ])

    return promise
  }

  saveCustomer (customer) {
    axios.post(this.baseUrl + '/api/addCustomer', customer).then(
      response => {
        console.log(response)
      }, errorMsg => {
        console.log(errorMsg)
      }
    )
  }
}
