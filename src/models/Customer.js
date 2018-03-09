export default class Customer {
  constructor (name, surname, email, passportNumber, phoneNumber, dateOfBirth, occupation, adresa) {
    this.id = undefined
    this.ime = name || ''
    this.prezime = surname || ''
    this.putnik = false
    this.email = email || ''
    this.brojPasosa = passportNumber || ''
    this.brojTelefona = phoneNumber || ''
    this.datumRodjenja = dateOfBirth || ''
    this.struka = occupation || ''
    this.adresa = adresa || ''
  }
}
