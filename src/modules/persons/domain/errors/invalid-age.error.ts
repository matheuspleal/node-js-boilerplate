import { DomainError } from '@/core/domain/errors/domain.error'

export class InvalidAgeError extends DomainError {
  constructor(age: number) {
    super(`The age "${age}" is not valid. It must be at least 18 years old.`)
  }
}
