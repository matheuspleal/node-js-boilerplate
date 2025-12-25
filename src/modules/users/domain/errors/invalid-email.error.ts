import { type DomainError } from '@/core/domain/errors/domain.error'

export class InvalidEmailError extends Error implements DomainError {
  constructor(email: string) {
    super(`The email "${email}" is not valid.`)
    this.name = 'InvalidEmailError'
  }
}
