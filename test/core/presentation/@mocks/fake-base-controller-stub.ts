import { BaseController } from '@/core/presentation/controllers/base-controller'
import { BuilderValidator } from '@/core/presentation/validators/builder-validator'
import { type ValidatorRule } from '@/core/presentation/validators/contracts/validator-rule'
import { ValidationCompositeError } from '@/core/presentation/validators/errors/validation-composite-error'

import { type FakeNamespace } from '#/core/presentation/@mocks/fake-namespace-stub'

export class FakeBaseController extends BaseController<
  FakeNamespace.Request,
  FakeNamespace.Response
> {
  constructor() {
    super()
  }

  override async handle(
    request: FakeNamespace.Request,
  ): Promise<FakeNamespace.Response> {
    const errors = this.validate(request)
    if (errors !== undefined) {
      throw new ValidationCompositeError(errors)
    }
    return Promise.resolve({
      fullName: `${request.firstName} ${request.lastName}`,
    })
  }
}

export class FakeBaseWithCustomValidatorController extends BaseController<
  FakeNamespace.Request,
  FakeNamespace.Response
> {
  constructor() {
    super()
  }

  override buildValidators(request: FakeNamespace.Request): ValidatorRule[] {
    const validations: ValidatorRule[] = []
    let key: keyof FakeNamespace.Request
    for (key in request) {
      validations.push(
        ...BuilderValidator.of({
          name: key,
          value: request[key],
        })
          .required()
          .build(),
      )
    }
    return validations
  }

  override async handle(
    request: FakeNamespace.Request,
  ): Promise<FakeNamespace.Response> {
    const errors = this.validate(request)
    if (errors !== undefined) {
      throw new ValidationCompositeError(errors)
    }
    return Promise.resolve({
      fullName: `${request.firstName} ${request.lastName}`,
    })
  }
}
