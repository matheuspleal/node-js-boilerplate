import { makeSignInUseCase } from '@/main/factories/users/application/use-cases/sign-in-use-case-factory'
import { SignInController } from '@/modules/users/presentation/controllers/sign-in-controller'

export function makeSignInController() {
  return new SignInController(makeSignInUseCase())
}
