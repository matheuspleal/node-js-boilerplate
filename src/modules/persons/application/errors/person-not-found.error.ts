import { ApplicationError } from '@/core/application/errors/application.error'

export class PersonNotFoundError extends ApplicationError {
  constructor(id: string) {
    super(`Person with id "${id}" not found!`)
  }
}
