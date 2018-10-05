export default class Customer {
  constructor (name, surname, email, passportNumber, phoneNumber, dateOfBirth, occupation, adresa) {
    this.id = null
    this.ime = name || null
    this.prezime = surname || null
    this.putnik = false
    this.email = email || null
    this.brojPasosa = passportNumber || null
    this.brojTelefona = phoneNumber || null
    this.datumRodjenja = dateOfBirth || null
    this.struka = occupation || null
    this.adresa = adresa || null
    this.brojRezervacije = null
  }
}
