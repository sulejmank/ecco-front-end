export default class Destination {
  constructor (destination, googleId, localId) {
    this.description = destination || null
    this.id = googleId || null
    this.localId = localId || null
  }
}
