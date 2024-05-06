import { makeSignUpUseCase } from '@/main/factories/users/application/use-cases/sign-up-use-case-factory'
import { SignUpController } from '@/modules/users/presentation/controllers/sign-up-controller'

export function makeSignUpController() {
  return new SignUpController(makeSignUpUseCase())
}
