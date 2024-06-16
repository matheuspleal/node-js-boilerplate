import { type UseCaseError } from '@/core/application/use-cases/errors/use-case-error'

export class PersonNotFoundError extends Error implements UseCaseError {
  constructor(id: string) {
    super(`Person with id "${id}" not found!`)
    this.name = 'PersonNotFoundError'
  }
}
