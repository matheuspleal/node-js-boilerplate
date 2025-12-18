import { makePersonPrismaRepository } from '@/main/factories/persons/infra/repositories/person-prisma-repository.factory'
import { FetchPersonsUseCase } from '@/modules/persons/application/use-cases/fetch-persons.use-case'

export function makeFetchPersonsUseCase() {
  return new FetchPersonsUseCase(makePersonPrismaRepository())
}
