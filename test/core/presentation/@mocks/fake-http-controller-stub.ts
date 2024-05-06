import { HttpController } from '@/core/presentation/controllers/http-controller'
import { type HttpResponse } from '@/core/presentation/protocols/http'
import { BuilderValidator } from '@/core/presentation/validators/builder-validator'
import { type ValidatorRule } from '@/core/presentation/validators/contracts/validator-rule'

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
