import { makeUserPrismaRepository } from '@/main/factories/users/infra/repositories/user-prisma-repository.factory'
import { FetchUsersUseCase } from '@/modules/users/application/use-cases/fetch-users.use-case'

export function makeFetchUsersUseCase() {
  return new FetchUsersUseCase(makeUserPrismaRepository())
}
