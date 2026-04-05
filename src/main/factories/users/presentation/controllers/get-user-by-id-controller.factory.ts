import { makeGetUserByIdUseCase } from '@/main/factories/users/application/use-cases/get-user-by-id-use-case.factory'
import { GetUserByIdController } from '@/modules/users/presentation/controllers/get-user-by-id.controller'

export function makeGetUserByIdController() {
  return new GetUserByIdController(makeGetUserByIdUseCase())
}
