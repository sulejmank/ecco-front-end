export default class FlightTicket {
  constructor (putovanjeOd, putovanjeDo, jedanParvac, datumPolaska, datumDolaska, brojRezervacije, avioKompanija, potvrdjeno, cena, datumRezervacije
  ) {
    this.putovanjeOd = putovanjeOd || ''
    this.putovanjeDo = putovanjeDo || ''
    this.jedanParvac = jedanParvac || true
    this.datumPolaska = datumPolaska || ''
    this.datumDolaska = datumDolaska || ''
    this.brojRezervacije = brojRezervacije || ''
    this.avioKompanija = avioKompanija || ''
    this.potvrdjeno = potvrdjeno || false
    this.cena = cena || ''
    this.datumRezervacije = datumRezervacije || ''
  }
}
