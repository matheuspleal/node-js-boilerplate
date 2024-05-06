import { makeFindUserByIdPrismaRepository } from '@/main/factories/users/infra/repositories/find-user-by-id-prisma-repository-factory'
import { GetUserByIdUseCase } from '@/modules/users/application/use-cases/get-user-by-id-use-case'

export function makeGetUserByIdUseCase() {
  return new GetUserByIdUseCase(makeFindUserByIdPrismaRepository())
}
