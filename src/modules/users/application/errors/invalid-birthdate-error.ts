import { type UseCaseError } from '@/core/application/use-cases/errors/use-case-error'

export class InvalidBirthdateError extends Error implements UseCaseError {
  constructor(birthdate: Date) {
    super(`Birthdate "${birthdate.toISOString()}" is invalid`)
    this.name = 'InvalidBirthdateError'
  }
}
