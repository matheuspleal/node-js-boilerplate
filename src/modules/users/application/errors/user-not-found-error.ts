import { type UseCaseError } from '@/core/application/use-cases/errors/use-case-error'

export class UserNotFoundError extends Error implements UseCaseError {
  constructor(id: string) {
    super(`User with id "${id}" not found`)
    this.name = 'UserNotFoundError'
  }
}
