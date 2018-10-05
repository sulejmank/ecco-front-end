export default class PicklistOption {
  constructor (delimeter, id, title, description) {
    this.id = null
    this.title = title || null
    this.delimeter = delimeter || null
    this.description = description || null
    this.value = null
  }
}
