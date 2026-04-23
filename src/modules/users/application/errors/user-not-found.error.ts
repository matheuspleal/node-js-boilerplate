import { ApplicationError } from '@/core/application/errors/application.error'

export class UserNotFoundError extends ApplicationError {
  constructor(id: string) {
    super(`User with id "${id}" not found!`)
  }
}
