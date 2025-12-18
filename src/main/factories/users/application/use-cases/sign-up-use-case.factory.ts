import { makeBcryptAdapterFactory } from '@/main/factories/core/infra/gateways/bcrypt-adapter.factory'
import { makeUserPrismaRepository } from '@/main/factories/users/infra/repositories/user-prisma-repository.factory'
import { SignUpUseCase } from '@/modules/users/application/use-cases/sign-up.use-case'

export function makeSignUpUseCase() {
  return new SignUpUseCase(
    makeUserPrismaRepository(),
    makeBcryptAdapterFactory(),
  )
}
