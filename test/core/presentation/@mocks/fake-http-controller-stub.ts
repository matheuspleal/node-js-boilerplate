import { HttpController } from '@/core/presentation/controllers/http-controller'
import { type HttpResponse } from '@/core/presentation/protocols/http'
import { BuilderValidator } from '@/core/presentation/validators/builder-validator'
import { type Validator } from '@/core/presentation/validators/validator'

import { type FakeNamespace } from '#/core/presentation/@mocks/fake-namespace-stub'

export class FakeHttpController extends HttpController<
  FakeNamespace.Request,
  FakeNamespace.Response
> {
  constructor() {
    super()
  }

  override async perform(
    request: FakeNamespace.Request,
  ): Promise<HttpResponse<FakeNamespace.Response>> {
    return Promise.resolve({
      statusCode: 200,
      data: {
        fullName: `${request.firstName} ${request.lastName}`,
      },
    })
  }
}

export class FakeHttpWithCustomValidatorController extends HttpController<
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

  override async perform(
    request: FakeNamespace.Request,
  ): Promise<HttpResponse<FakeNamespace.Response>> {
    return Promise.resolve({
      statusCode: 200,
      data: {
        fullName: `${request.firstName} ${request.lastName}`,
      },
    })
  }
}
