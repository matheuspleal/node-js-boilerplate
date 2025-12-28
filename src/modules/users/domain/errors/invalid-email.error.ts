import { DomainError } from '@/core/domain/errors/domain.error'

export class InvalidEmailError extends DomainError {
  constructor(email: string) {
    super(`The email "${email}" is not valid.`)
  }
}
