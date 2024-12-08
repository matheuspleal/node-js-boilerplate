import { HttpController } from '@/core/presentation/controllers/http-controller'
import { ok, unauthorized } from '@/core/presentation/helpers/http-helpers'
import { type HttpResponse } from '@/core/presentation/protocols/http'
import { BuilderValidator } from '@/core/presentation/validators/builder-validator'
import { type ValidatorRule } from '@/core/presentation/validators/contracts/validator-rule'
import { type UnauthorizedError } from '@/modules/users/application/errors/unauthorized-error'
import { type SignInUseCase } from '@/modules/users/application/use-cases/sign-in-use-case'

export interface SignInControllerRequest {
  email: string
  password: string
}

export type SignInControllerResponse =
  | UnauthorizedError
  | { accessToken: string }

export class SignInController extends HttpController<
  SignInControllerRequest,
  SignInControllerResponse
> {
  constructor(private readonly signInUseCase: SignInUseCase) {
    super()
  }

  override buildValidators(request: SignInControllerRequest): ValidatorRule[] {
    const allRequiredFields: Array<keyof SignInControllerRequest> = [
      'email',
      'password',
    ]
    const validations: ValidatorRule[] = []
    validations.push(
      ...allRequiredFields.flatMap((requiredField) =>
        BuilderValidator.of({
          name: requiredField,
          value: request[requiredField],
        })
          .required()
          .build(),
      ),
    )
    return validations
  }

  override async perform({
    email,
    password,
  }: SignInControllerRequest): Promise<HttpResponse<SignInControllerResponse>> {
    const result = await this.signInUseCase.execute({
      email,
      password,
    })
    if (result.isLeft()) {
      return unauthorized()
    }
    return ok<SignInControllerResponse>(result.value)
  }
}
