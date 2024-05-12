import { HttpController } from '@/core/presentation/controllers/http-controller'
import {
  badDomainRequest,
  conflict,
  created,
} from '@/core/presentation/helpers/http-helpers'
import { type HttpResponse } from '@/core/presentation/protocols/http'
import { BuilderValidator } from '@/core/presentation/validators/builder-validator'
import { type ValidatorRule } from '@/core/presentation/validators/contracts/validator-rule'
import { EmailAlreadyExistsError } from '@/modules/users/application/errors/email-already-exists-error'
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

  override buildValidators(request: SignUp.Request): ValidatorRule[] {
    const allRequiredFields: Array<keyof SignUp.Request> = [
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
  }: SignUp.Request): Promise<HttpResponse<SignUp.Response>> {
    const result = await this.signUpUseCase.execute({
      name,
      email,
      password,
      birthdate: new Date(birthdate),
    })
    if (result.isLeft()) {
      const error =
        result.value instanceof EmailAlreadyExistsError
          ? conflict(result.value)
          : badDomainRequest(result.value)
      return error
    }
    return created<SignUp.Response>(result.value)
  }
}
