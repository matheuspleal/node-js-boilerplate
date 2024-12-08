import { type UseCaseError } from '@/core/application/use-cases/errors/use-case-error'

export class UnauthorizedError extends Error implements UseCaseError {
  constructor() {
    super('Invalid Credentials!')
    this.name = 'UnauthorizedError'
  }
}
