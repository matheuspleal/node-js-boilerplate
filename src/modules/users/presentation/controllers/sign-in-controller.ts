import { HttpController } from '@/core/presentation/controllers/http-controller'
import { ok, unauthorized } from '@/core/presentation/helpers/http-helpers'
import { type HttpResponse } from '@/core/presentation/protocols/http'
import { BuilderValidator } from '@/core/presentation/validators/builder-validator'
import { type ValidatorRule } from '@/core/presentation/validators/contracts/validator-rule'
import { type UnauthorizedError } from '@/modules/users/application/errors/unauthorized-error'
import { type SignInUseCase } from '@/modules/users/application/use-cases/sign-in-use-case'

export namespace SignIn {
  export interface Request {
    email: string
    password: string
  }

  export type Response = UnauthorizedError | { accessToken: string }
}

export class SignInController extends HttpController<
  SignIn.Request,
  SignIn.Response
> {
  constructor(private readonly signInUseCase: SignInUseCase) {
    super()
  }

  override buildValidators(request: SignIn.Request): ValidatorRule[] {
    const allRequiredFields: Array<keyof SignIn.Request> = ['email', 'password']
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
  }: SignIn.Request): Promise<HttpResponse<SignIn.Response>> {
    const result = await this.signInUseCase.execute({
      email,
      password,
    })
    if (result.isLeft()) {
      return unauthorized()
    }
    return ok<SignIn.Response>(result.value)
  }
}
