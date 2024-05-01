import { makeBcryptAdapterFactory } from '@/main/factories/core/infra/gateways/bcrypt-adapter-factory'
import { makeCreateUserPrismaRepository } from '@/main/factories/users/infra/repositories/create-user-prisma-repository-factory'
import { makeFindUserByEmailPrismaRepository } from '@/main/factories/users/infra/repositories/find-user-by-email-prisma-repository-factory'
import { SignUpUseCase } from '@/modules/users/application/use-cases/sign-up-use-case'

export function makeSignUpUseCase() {
  return new SignUpUseCase(
    makeFindUserByEmailPrismaRepository(),
    makeCreateUserPrismaRepository(),
    makeBcryptAdapterFactory(),
  )
}
