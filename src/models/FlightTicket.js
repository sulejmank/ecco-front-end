export default class FlightTicket {
  constructor (id, putovanjeOd, putovanjeDo, jedanParvac, datumPolaska, datumDolaska, brojRezervacije, avioKompanija, potvrdjeno, cena, datumRezervacije
  ) {
    this.putovanjeOd = putovanjeOd || ''
    this.putovanjeDo = putovanjeDo || ''
    this.jedanParvac = jedanParvac || false
    this.datumPolaska = datumPolaska || ''
    this.datumDolaska = datumDolaska || ''
    this.brojRezervacije = brojRezervacije || ''
    this.avioKompanija = avioKompanija || ''
    this.potvrdjeno = potvrdjeno || false
    this.cena = cena || ''
    this.datumRezervacije = datumRezervacije || ''
    this.idPutnika = id || 0
  }
}
