import { HttpController } from '@/core/presentation/controllers/http.controller'
import { notFound, ok } from '@/core/presentation/helpers/http.helper'
import { type HttpResponse } from '@/core/presentation/protocols/http.protocol'
import { BuilderValidator } from '@/core/presentation/validators/builder.validator'
import { type ValidatorRule } from '@/core/presentation/validators/contracts/validator-rule.contract'
import { type UserNotFoundError } from '@/modules/users/application/errors/user-not-found.error'
import { type UserDTO } from '@/modules/users/application/use-cases/dtos/user.dto'
import { type GetUserByIdUseCase } from '@/modules/users/application/use-cases/get-user-by-id.use-case'

export interface GetUserByIdControllerRequest {
  id: string
}

export type GetUserByIdControllerResponse =
  | UserNotFoundError
  | { user: UserDTO }

export class GetUserByIdController extends HttpController<
  GetUserByIdControllerRequest,
  GetUserByIdControllerResponse
> {
  constructor(private readonly getUserByIdUseCase: GetUserByIdUseCase) {
    super()
  }

  override buildValidators(
    request: GetUserByIdControllerRequest,
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
  }: GetUserByIdControllerRequest): Promise<
    HttpResponse<GetUserByIdControllerResponse>
  > {
    const result = await this.getUserByIdUseCase.execute({
      id,
    })
    if (result.isLeft()) {
      return notFound(result.value)
    }
    return ok<GetUserByIdControllerResponse>(result.value)
  }
}
