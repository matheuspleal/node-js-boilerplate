import { makePersonPrismaRepository } from '@/main/factories/persons/infra/repositories/person-prisma-repository.factory'
import { GetPersonByIdUseCase } from '@/modules/persons/application/use-cases/get-person-by-id.use-case'

export function makeGetPersonByIdUseCase() {
  return new GetPersonByIdUseCase(makePersonPrismaRepository())
}
