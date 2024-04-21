import { makeCreateUserPrismaRepository } from '@/main/factories/users/infra/repositories/create-user-prisma-repository-factory'
import { makeFindUserByEmailPrismaRepository } from '@/main/factories/users/infra/repositories/find-user-by-email-prisma-repository-factory'
import { CreateUserUseCase } from '@/modules/users/application/use-cases/create-user-use-case'

export function makeCreateUserUseCase() {
  return new CreateUserUseCase(
    makeFindUserByEmailPrismaRepository(),
    makeCreateUserPrismaRepository(),
  )
}
