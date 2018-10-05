export default class Room {
  constructor (id, roomContents, roomType, passangers) {
    this.id = null
    this.RoomContentId = roomContents || null
    this.RoomContent = null
    this.RoomTypeId = roomType || null
    this.RoomType = null
    this.passangers = passangers || []
    this.active = false
  }
}
