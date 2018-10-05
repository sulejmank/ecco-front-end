export default class Plan {
  constructor (id, clientId, totalnaCena, status, rokUplate, avans, napomena) {
    this.id = id || 0
    this.ClientId = clientId || 0
    this.totalnaCena = totalnaCena || 0
    this.status = status || false
    this.avans = avans || 0
    this.rokUplate = rokUplate || null
    this.napomena = napomena || null
  }
}
