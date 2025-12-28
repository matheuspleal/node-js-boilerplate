import { ApplicationError } from '@/core/application/errors/application.error'

export class EmailAlreadyExistsError extends ApplicationError {
  constructor(email: string) {
    super(`Email "${email}" already exists!`)
  }
}
