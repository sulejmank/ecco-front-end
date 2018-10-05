export default class Arrangement {
  constructor (destinacija, hotel, agent, usluga, datumPocetka, datumZavrsetka, usluznaKompanija, cena, brPutnika, brojDana, tipAngazmana, clientId, planId, mestoPolaska, mestoPristanista) {
    this.id = null
    this.destinacija = destinacija || null
    this.hotel = hotel || null
    this.hotelObj = null
    this.agent = agent || null
    this.agentObj = null
    this.rooms = []
    this.passangers = []
    this.roomDescription = null
    this.ServiceId = usluga || null
    this.datumPocetka = datumPocetka || null
    this.datumZavrsetka = datumZavrsetka || null
    this.usluznaKompanija = usluznaKompanija || null
    this.cena = cena || null
    this.brPutnika = brPutnika || null
    this.brojDana = brojDana || null
    this.TypeId = tipAngazmana || null
    this.ClientId = clientId || 0
    this.PlanId = planId || 0
    this.mestoPolaska = mestoPolaska || null
    this.mestoPolaskaObj = null
    // this.mestoPristanista = mestoPristanista || null
    // this.mestoPristanistaObj = null
    this.destinacijaObj = null
  }
}
