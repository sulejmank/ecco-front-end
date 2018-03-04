export default class Customer {
  constructor (name, surname, email, passportNumber, phoneNumber, dateOfBirth) {
    this.name = name || ''
    this.surname = surname || ''
    this.email = email || ''
    this.passportNumber = passportNumber || ''
    this.phoneNumber = phoneNumber || ''
    this.dateOfBirth = dateOfBirth || ''
  }
}
