import { type UseCaseError } from '@/core/application/use-cases/errors/use-case-error'

export class UnauthorizedError extends Error implements UseCaseError {
  constructor() {
    super('Invalid credentials')
    this.name = 'UnauthorizedError'
  }
}
