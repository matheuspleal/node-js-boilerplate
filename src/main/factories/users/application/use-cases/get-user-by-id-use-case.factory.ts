import { makeUserPrismaRepository } from '@/main/factories/users/infra/repositories/user-prisma-repository.factory'
import { GetUserByIdUseCase } from '@/modules/users/application/use-cases/get-user-by-id.use-case'

export function makeGetUserByIdUseCase() {
  return new GetUserByIdUseCase(makeUserPrismaRepository())
}
