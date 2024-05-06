import { type UseCaseError } from '@/core/application/use-cases/errors/use-case-error'

export class EmailAlreadyExistsError extends Error implements UseCaseError {
  readonly field?: string
  readonly value?: string

  constructor(email: string) {
    super(`Email "${email}" already exists`)
    this.name = 'EmailAlreadyExistsError'
    this.field = 'email'
    this.value = email
  }
}
