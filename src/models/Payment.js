import moment from 'moment'

export default class Payment {
  constructor (timeStamp, amount) {
    this.paymentDate = timeStamp || moment().format('YYYY-MM-DD')
    this.payment = amount || ''
  }
}
