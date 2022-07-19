export default class InvalidArgsError extends Error {

  constructor(message) {
    super(message)
    this.name = "InvalidArgsError"
  }

}