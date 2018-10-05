export default class Checkout {
  constructor (netoPrice, brutoPrice, avans, dueDate, notes, customerId = null) {
    this.id = null
    this.neto = netoPrice || null
    this.bruto = brutoPrice || null
    this.avans = avans || null
    this.rokUplate = dueDate || null
    this.notes = notes || null
    this.customerId = customerId
    this.avansSet = false
  }
}
