import { type UseCaseError } from '@/core/application/use-cases/errors/use-case-error'

export class InvalidEmailError extends Error implements UseCaseError {
  constructor(email: string) {
    super(`Email "${email}" is invalid!`)
    this.name = 'InvalidEmailError'
  }
}
