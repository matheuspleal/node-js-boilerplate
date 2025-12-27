import { type DomainError } from '@/core/domain/errors/domain.error'

export class InvalidAgeError extends Error implements DomainError {
  constructor(age: number) {
    super(`The age "${age}" is not valid. It must be at least 18 years old.`)
    this.name = 'InvalidAgeError'
  }
}
