import { makeFetchPersonsUseCase } from '@/main/factories/persons/application/use-cases/fetch-persons-use-case-factory'
import { FetchPersonsController } from '@/modules/persons/presentation/controllers/fetch-persons-controller'

export function makeFetchPersonsController() {
  return new FetchPersonsController(makeFetchPersonsUseCase())
}
