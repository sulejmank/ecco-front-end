// const BusTicketType = 'bus'
// const FlightTicketType = 'flight'

export default class Ticket {
  constructor (type, id, putovanjeOd, putovanjeDo, jedanParvac, datumPolaska, datumDolaska, avioKompanija, potvrdjeno, datumRezervacije, planId) {
    this.id = null
    this.putovanjeOd = putovanjeOd || null
    this.putovanjeDo = putovanjeDo || null
    this.jedanParvac = jedanParvac || false
    this.datumPolaska = datumPolaska || null
    this.datumDolaska = datumDolaska || null
    this.avioKompanija = avioKompanija || null
    this.potvrdjeno = potvrdjeno || false
    this.datumRezervacije = datumRezervacije || null
    this.ClientId = id || 0
    this.PlanId = planId || 0
    this.putovanjeOdObj = null
    this.putovanjeDoObj = null
    this.avioKompanijaObj = {}
    this.type = type
  }
}
