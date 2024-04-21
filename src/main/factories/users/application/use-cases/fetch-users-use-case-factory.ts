import { makeCountUsersPrismaRepository } from '@/main/factories/users/infra/repositories/count-users-prisma-repository-factory'
import { makeFindManyUsersPrismaRepository } from '@/main/factories/users/infra/repositories/find-many-users-prisma-repository-factory'
import { FetchUsersUseCase } from '@/modules/users/application/use-cases/fetch-users-use-case'

export function makeFetchUsersUseCase() {
  return new FetchUsersUseCase(
    makeCountUsersPrismaRepository(),
    makeFindManyUsersPrismaRepository(),
  )
}
