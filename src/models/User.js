export default class User {
  constructor (name, surname, email, username, password, role) {
    this.id = null
    this.name = name || null
    this.surname = surname || null
    this.email = email || null
    this.username = username || null
    this.password = password || null
    this.role = role || null
  }
}
