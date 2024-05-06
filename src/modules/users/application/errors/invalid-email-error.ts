import { type UseCaseError } from '@/core/application/use-cases/errors/use-case-error'

export class InvalidEmailError extends Error implements UseCaseError {
  readonly field?: string
  readonly value?: string

  constructor(email: string) {
    super(`Email "${email}" is invalid`)
    this.name = 'InvalidEmailError'
    this.field = 'email'
    this.value = email
  }
}
