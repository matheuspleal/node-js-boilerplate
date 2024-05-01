import { HttpController } from '@/core/presentation/controllers/http-controller'
import {
  unauthorizedError,
  created,
} from '@/core/presentation/helpers/http-helpers'
import { type HttpResponse } from '@/core/presentation/protocols/http'
import { BuilderValidator } from '@/core/presentation/validators/builder-validator'
import { type Validator } from '@/core/presentation/validators/validator'
import { type EmailAlreadyExistsError } from '@/modules/users/application/errors/email-already-exists-error'
import { type SignInUseCase } from '@/modules/users/application/use-cases/sign-in-use-case'

export namespace SignIn {
  export interface Request {
    email: string
    password: string
  }

  export type Response = EmailAlreadyExistsError | { token: string }
}

export class SignInController extends HttpController<
  SignIn.Request,
  SignIn.Response
> {
  constructor(private readonly signInUseCase: SignInUseCase) {
    super()
  }

  override buildValidators(request: SignIn.Request): Validator[] {
    const allRequiredFields = ['email', 'password'] as const
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
    email,
    password,
  }: SignIn.Request): Promise<HttpResponse<SignIn.Response>> {
    const result = await this.signInUseCase.execute({
      email,
      password,
    })
    if (result.isLeft()) {
      return unauthorizedError(result.value)
    }
    return created<SignIn.Response>(result.value)
  }
}
