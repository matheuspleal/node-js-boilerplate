import { makeFetchUsersUseCase } from '@/main/factories/users/application/use-cases/fetch-users-use-case-factory'
import { FetchUsersController } from '@/modules/users/presentation/controllers/fetch-users-controller'

export function makeFetchUsersController() {
  return new FetchUsersController(makeFetchUsersUseCase())
}
