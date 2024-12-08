import { makeGetPersonByIdUseCase } from '@/main/factories/persons/application/use-cases/get-person-by-id-use-case-factory'
import { GetPersonByIdController } from '@/modules/persons/presentation/controllers/get-person-by-id-controller'

export function makeGetPersonByIdController() {
  return new GetPersonByIdController(makeGetPersonByIdUseCase())
}
