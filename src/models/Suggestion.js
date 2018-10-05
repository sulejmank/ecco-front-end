export default class Suggestion {
  constructor (mainData, subData, objectEntity) {
    this.mainData = mainData || ''
    this.subData = subData || ''
    this.objectEntity = objectEntity || {}
  }
}
