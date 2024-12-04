import { HttpController } from '@/core/presentation/controllers/http-controller'
import {
  badDomainRequest,
  conflict,
  created,
} from '@/core/presentation/helpers/http-helpers'
import { type HttpResponse } from '@/core/presentation/protocols/http'
import { BuilderValidator } from '@/core/presentation/validators/builder-validator'
import { type ValidatorRule } from '@/core/presentation/validators/contracts/validator-rule'
import { type EmailAlreadyExistsError } from '@/modules/users/application/errors/email-already-exists-error'
import { type SignUpUseCase } from '@/modules/users/application/use-cases/sign-up-use-case'
import {
  SignUpPresenter,
  type SignUpPresenterOutput,
} from '@/modules/users/presentation/presenters/sign-up-presenter'

export interface SignUpControllerRequest {
  name: string
  email: string
  password: string
  birthdate: string
}

export type SignUpControllerResponse =
  | EmailAlreadyExistsError
  | SignUpPresenterOutput

export class SignUpController extends HttpController<
  SignUpControllerRequest,
  SignUpControllerResponse
> {
  constructor(private readonly signUpUseCase: SignUpUseCase) {
    super()
  }

  override buildValidators(request: SignUpControllerRequest): ValidatorRule[] {
    const allRequiredFields: Array<keyof SignUpControllerRequest> = [
      'name',
      'email',
      'password',
      'birthdate',
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
    validations.push(
      ...BuilderValidator.of({ name: 'password', value: request.password })
        .isValidPassword()
        .build(),
    )
    return validations
  }

  override async perform({
    name,
    email,
    password,
    birthdate,
  }: SignUpControllerRequest): Promise<HttpResponse<SignUpControllerResponse>> {
    const result = await this.signUpUseCase.execute({
      name,
      email,
      password,
      birthdate: new Date(birthdate),
    })
    if (result.isLeft()) {
      const error =
        result.value.name === 'EmailAlreadyExistsError'
          ? conflict(result.value)
          : badDomainRequest(result.value)
      return error
    }
    const { person, user } = result.value
    return created<SignUpPresenterOutput>(
      SignUpPresenter.toHttp({ person, user }),
    )
  }
}
