import { BaseController } from '@/core/presentation/controllers/base-controller'
import { BuilderValidator } from '@/core/presentation/validators/builder-validator'
import { Validator } from '@/core/presentation/validators/validator'

import { FakeNamespace } from '#/core/presentation/@mocks/fake-namespace-stub'

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
    const error = this.validate(request)
    if (error !== undefined) {
      throw new Error(error.message)
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

  override buildValidators({
    firstName,
    lastName,
  }: FakeNamespace.Request): Validator[] {
    return BuilderValidator.of([
      {
        name: 'firstName',
        value: firstName,
      },
      {
        name: 'lastName',
        value: lastName,
      },
    ])
      .required()
      .build()
  }

  override async handle(
    request: FakeNamespace.Request,
  ): Promise<FakeNamespace.Response> {
    const error = this.validate(request)
    if (error !== undefined) {
      throw new Error(error.message)
    }
    return Promise.resolve({
      fullName: `${request.firstName} ${request.lastName}`,
    })
  }
}
