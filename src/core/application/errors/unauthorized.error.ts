import { ApplicationError } from '@/core/application/errors/application.error'

export class UnauthorizedError extends ApplicationError {
  constructor() {
    super('Invalid Credentials!')
  }
}
