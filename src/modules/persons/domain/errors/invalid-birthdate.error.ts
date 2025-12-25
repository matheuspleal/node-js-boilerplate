import { type DomainError } from '@/core/domain/errors/domain.error'

export class InvalidBirthdateError extends Error implements DomainError {
  constructor(birthdate: Date) {
    super(
      `The birthdate "${birthdate.toISOString()}" is not valid. It must be a past date.`,
    )
    this.name = 'InvalidBirthdateError'
  }
}
