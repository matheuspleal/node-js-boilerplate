export class InternalServerError extends Error {
  constructor(error?: Error) {
    super('Server failed')
    this.name = 'InternalServerError'
    this.stack = error?.stack
  }
}
