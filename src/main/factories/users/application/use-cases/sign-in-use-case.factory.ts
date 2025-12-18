import { makeBcryptAdapterFactory } from '@/main/factories/core/infra/gateways/bcrypt-adapter.factory'
import { makeJwtAdapterFactory } from '@/main/factories/core/infra/gateways/jwt-adapter.factory'
import { makeUserPrismaRepository } from '@/main/factories/users/infra/repositories/user-prisma-repository.factory'
import { SignInUseCase } from '@/modules/users/application/use-cases/sign-in.use-case'

export function makeSignInUseCase() {
  return new SignInUseCase(
    makeUserPrismaRepository(),
    makeBcryptAdapterFactory(),
    makeJwtAdapterFactory(),
  )
}
