export default class Customer {
  constructor (destinacija, hotel, strukturaSobe, usluga, datumPocetka, datumZavrsetka, usluznaKompanija, cena, brPutnika) {
    this.id = undefined
    this.destinacija = destinacija || ''
    this.hotel = hotel || ''
    this.strukturaSobe = strukturaSobe || ''
    this.usluga = usluga || ''
    this.datumPocetka = this.datumPocetka || ''
    this.datumZavrsetka = this.datumZavrsetka || ''
    this.usluznaKompanija = this.usluznaKompanija || ''
    this.cena = cena || 0.00
    this.brPutnika = brPutnika || 0
  }
}
