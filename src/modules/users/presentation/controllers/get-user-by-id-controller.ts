import { HttpController } from '@/core/presentation/controllers/http-controller'
import { notFound, ok } from '@/core/presentation/helpers/http-helpers'
import { type HttpResponse } from '@/core/presentation/protocols/http'
import { BuilderValidator } from '@/core/presentation/validators/builder-validator'
import { type ValidatorRule } from '@/core/presentation/validators/contracts/validator-rule'
import { type UserNotFoundError } from '@/modules/users/application/errors/user-not-found-error'
import { type UserDTO } from '@/modules/users/application/use-cases/dtos/user-dto'
import { type GetUserByIdUseCase } from '@/modules/users/application/use-cases/get-user-by-id-use-case'

export namespace GetUsersById {
  export interface Request {
    id: string
  }

  export type Response =
    | UserNotFoundError
    | {
        user: UserDTO
      }
}

export class GetUsersByIdController extends HttpController<
  GetUsersById.Request,
  GetUsersById.Response
> {
  constructor(private readonly getUserByIdUseCase: GetUserByIdUseCase) {
    super()
  }

  override buildValidators(request: GetUsersById.Request): ValidatorRule[] {
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
  }: GetUsersById.Request): Promise<HttpResponse<GetUsersById.Response>> {
    const result = await this.getUserByIdUseCase.execute({
      id,
    })
    if (result.isLeft()) {
      return notFound(result.value)
    }
    return ok<GetUsersById.Response>(result.value)
  }
}
