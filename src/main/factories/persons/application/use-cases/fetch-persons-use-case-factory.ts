import { makeCountPersonsPrismaRepository } from '@/main/factories/persons/infra/repositories/count-persons-prisma-repository-factory'
import { makeFindManyPersonsPrismaRepository } from '@/main/factories/persons/infra/repositories/find-many-persons-prisma-repository-factory'
import { FetchPersonsUseCase } from '@/modules/persons/application/use-cases/fetch-persons-use-case'

export function makeFetchPersonsUseCase() {
  return new FetchPersonsUseCase(
    makeCountPersonsPrismaRepository(),
    makeFindManyPersonsPrismaRepository(),
  )
}
