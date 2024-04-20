import { HttpController } from '@/core/presentation/controllers/http-controller'
import { badRequest, created } from '@/core/presentation/helpers/http-helpers'
import { type HttpResponse } from '@/core/presentation/protocols/http'
import { BuilderValidator } from '@/core/presentation/validators/builder-validator'
import { type Validator } from '@/core/presentation/validators/validator'
import { type EmailAlreadyExistsError } from '@/modules/users/application/errors/email-already-exists-error'
import { type CreateUserUseCase } from '@/modules/users/application/use-cases/create-user-use-case'
import { type UserDTO } from '@/modules/users/contracts/dtos/user-dto'

export namespace CreateUser {
  export interface Request {
    name: string
    email: string
    birthdate: string
  }

  export type AttributesResponse = Omit<
    UserDTO,
    'id' | 'createdAt' | 'updatedAt'
  > & {
    timestamps: {
      createdAt: Date
      updatedAt: Date
    }
  }

  export type Response = EmailAlreadyExistsError | { user: UserDTO }
}

export class CreateUserController extends HttpController<
  CreateUser.Request,
  CreateUser.Response
> {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {
    super()
  }

  override buildValidators(request: CreateUser.Request): Validator[] {
    const allRequiredFields = ['name', 'email', 'birthdate'] as const
    return BuilderValidator.of(
      allRequiredFields.map((field) => ({
        name: field,
        value: request[field],
      })),
    )
      .required()
      .build()
  }

  override async perform({
    name,
    email,
    birthdate,
  }: CreateUser.Request): Promise<HttpResponse<CreateUser.Response>> {
    const result = await this.createUserUseCase.execute({
      name,
      email,
      birthdate: new Date(birthdate),
    })
    if (result.isLeft()) {
      return badRequest(result.value)
    }
    return created<CreateUser.Response>(result.value)
  }
}
