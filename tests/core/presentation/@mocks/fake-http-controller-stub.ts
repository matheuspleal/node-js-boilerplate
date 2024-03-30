import { HttpController } from '@/core/presentation/controllers/http-controller'
import { BuilderValidator } from '@/core/presentation/validators/builder-validator'
import { Validator } from '@/core/presentation/validators/validator'

import { FakeNamespace } from '#/core/presentation/@mocks/fake-namespace-stub'

import { HttpResponse } from '../protocols/http'

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
      body: {
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
      body: {
        fullName: `${request.firstName} ${request.lastName}`,
      },
    })
  }
}
