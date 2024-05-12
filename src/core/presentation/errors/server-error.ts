export class ServerError extends Error {
  constructor(error?: Error) {
    super('Server failed')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}
