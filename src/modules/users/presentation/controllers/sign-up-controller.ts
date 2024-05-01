import { HttpController } from '@/core/presentation/controllers/http-controller'
import { badRequest, created } from '@/core/presentation/helpers/http-helpers'
import { type HttpResponse } from '@/core/presentation/protocols/http'
import { BuilderValidator } from '@/core/presentation/validators/builder-validator'
import { type Validator } from '@/core/presentation/validators/validator'
import { type EmailAlreadyExistsError } from '@/modules/users/application/errors/email-already-exists-error'
import { type SignUpUseCase } from '@/modules/users/application/use-cases/sign-up-use-case'
import { type UserDTO } from '@/modules/users/contracts/dtos/user-dto'

export namespace SignUp {
  export interface Request {
    name: string
    email: string
    password: string
    birthdate: string
  }

  export type Response = EmailAlreadyExistsError | { user: UserDTO }
}

export class SignUpController extends HttpController<
  SignUp.Request,
  SignUp.Response
> {
  constructor(private readonly signUpUseCase: SignUpUseCase) {
    super()
  }

  override buildValidators(request: SignUp.Request): Validator[] {
    const allRequiredFields = [
      'name',
      'email',
      'password',
      'birthdate',
    ] as const
    const requiredFieldsValidator = BuilderValidator.of(
      allRequiredFields.map((field) => ({
        name: field,
        value: request[field],
      })),
    )
      .required()
      .build()
    const passwordFieldValidator = BuilderValidator.of([
      { name: 'password', value: request.password },
    ])
      .isValidPassword()
      .build()
    return [...requiredFieldsValidator, ...passwordFieldValidator]
  }

  override async perform({
    name,
    email,
    password,
    birthdate,
  }: SignUp.Request): Promise<HttpResponse<SignUp.Response>> {
    const result = await this.signUpUseCase.execute({
      name,
      email,
      password,
      birthdate: new Date(birthdate),
    })
    if (result.isLeft()) {
      return badRequest(result.value)
    }
    return created<SignUp.Response>(result.value)
  }
}
