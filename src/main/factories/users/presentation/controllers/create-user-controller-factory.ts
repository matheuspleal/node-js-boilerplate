import { makeCreateUserUseCase } from '@/main/factories/users/application/use-cases/create-user-use-case-factory'
import { CreateUserController } from '@/modules/users/presentation/controllers/create-user-controller'

export function makeCreateUserController() {
  return new CreateUserController(makeCreateUserUseCase())
}
