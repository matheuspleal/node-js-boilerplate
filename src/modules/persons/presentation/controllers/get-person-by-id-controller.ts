import { HttpController } from '@/core/presentation/controllers/http-controller'
import { notFound, ok } from '@/core/presentation/helpers/http-helpers'
import { type HttpResponse } from '@/core/presentation/protocols/http'
import { BuilderValidator } from '@/core/presentation/validators/builder-validator'
import { type ValidatorRule } from '@/core/presentation/validators/contracts/validator-rule'
import { type PersonNotFoundError } from '@/modules/persons/application/errors/person-not-found-error'
import { type PersonDTO } from '@/modules/persons/application/use-cases/dtos/person-dto'
import { type GetPersonByIdUseCase } from '@/modules/persons/application/use-cases/get-person-by-id-use-case'

export interface GetPersonByIdControllerRequest {
  id: string
}

export type GetPersonByIdControllerResponse =
  | PersonNotFoundError
  | { person: PersonDTO }

export class GetPersonByIdController extends HttpController<
  GetPersonByIdControllerRequest,
  GetPersonByIdControllerResponse
> {
  constructor(private readonly getPersonByIdUseCase: GetPersonByIdUseCase) {
    super()
  }

  override buildValidators(
    request: GetPersonByIdControllerRequest,
  ): ValidatorRule[] {
    return BuilderValidator.of({
      name: 'id',
      value: request.id,
    })
      .required()
      .isValidUUID()
      .build()
  }

  override async perform({
    id,
  }: GetPersonByIdControllerRequest): Promise<
    HttpResponse<GetPersonByIdControllerResponse>
  > {
    const result = await this.getPersonByIdUseCase.execute({
      id,
    })
    if (result.isLeft()) {
      return notFound(result.value)
    }
    return ok<GetPersonByIdControllerResponse>(result.value)
  }
}
