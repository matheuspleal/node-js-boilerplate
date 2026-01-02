import { faker } from '@faker-js/faker'

import { HttpController } from '@/core/presentation/controllers/http.controller'
import { InternalServerError } from '@/core/presentation/errors/internal-server.error'
import { StatusCode } from '@/core/presentation/helpers/http.helper'
import { type HttpResponse } from '@/core/presentation/protocols/http.protocol'
import { BuilderValidator } from '@/core/presentation/validators/builder.validator'
import { type ValidatorRule } from '@/core/presentation/validators/contracts/validator.rule'
import { RequiredError } from '@/core/presentation/validators/errors/required.error'
import { ValidationCompositeError } from '@/core/presentation/validators/errors/validation-composite.error'

interface FakeRequest {
  firstName: string
  lastName: string
}

interface FakeResponse {
  fullName: string
}

class FakeHttpController extends HttpController<FakeRequest, FakeResponse> {
  constructor() {
    super()
  }

  override async perform(
    request: FakeRequest,
  ): Promise<HttpResponse<FakeResponse>> {
    return Promise.resolve({
      statusCode: 200,
      data: {
        fullName: `${request.firstName} ${request.lastName}`,
      },
    })
  }
}

class FakeHttpWithCustomValidatorController extends HttpController<
  FakeRequest,
  FakeResponse
> {
  constructor() {
    super()
  }

  override buildValidators(request: FakeRequest): ValidatorRule[] {
    const validations: ValidatorRule[] = []
    let key: keyof FakeRequest
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
    request: FakeRequest,
  ): Promise<HttpResponse<FakeResponse>> {
    return Promise.resolve({
      statusCode: 200,
      data: {
        fullName: `${request.firstName} ${request.lastName}`,
      },
    })
  }
}

describe('HttpController', () => {
  describe('default', () => {
    let sut: HttpController<FakeRequest, FakeResponse>

    beforeAll(() => {
      sut = new FakeHttpController()
    })

    it('should be able to return a server error if the run method throws an unexpected exception', async () => {
      const fakeError = new Error('Fake Error')
      vi.spyOn(sut, 'perform').mockRejectedValueOnce(fakeError)

      const response = await sut.handle({
        firstName: 'John',
        lastName: 'Doe',
      })

      expect(response.statusCode).toEqual(StatusCode.SERVER_ERROR)
      expect(response.data).toBeInstanceOf(InternalServerError)
    })

    it('should be able to perform with request and response handling the execution of standard validations', async () => {
      const response = await sut.handle({
        firstName: 'John',
        lastName: 'Doe',
      })

      expect(response).toEqual({
        statusCode: StatusCode.OK,
        data: {
          fullName: 'John Doe',
        },
      })
    })
  })

  describe('override buildValidator', () => {
    let sut: HttpController<FakeRequest, FakeResponse>

    beforeAll(() => {
      sut = new FakeHttpWithCustomValidatorController()
    })

    it('should be able to return a server error if the run method throws an unexpected exception', async () => {
      const fakeError = new Error('Fake Error')
      vi.spyOn(sut, 'perform').mockRejectedValueOnce(fakeError)

      const response = await sut.handle({
        firstName: 'John',
        lastName: 'Doe',
      })

      expect(response.statusCode).toEqual(StatusCode.SERVER_ERROR)
      expect(response.data).toBeInstanceOf(InternalServerError)
    })

    it('should be able to return ValidationCompositeError if any validation is failed', async () => {
      const lastName = faker.helpers.arrayElement([
        null,
        undefined,
      ]) as any as string

      const response = await sut.handle({
        firstName: 'John',
        lastName,
      })

      expect(response).toEqual({
        statusCode: StatusCode.BAD_REQUEST,
        data: new ValidationCompositeError([
          new RequiredError('lastName', lastName),
        ]),
      })
    })

    it('should be able to return the response if all validations pass', async () => {
      const response = await sut.handle({
        firstName: 'John',
        lastName: 'Doe',
      })

      expect(response).toEqual({
        statusCode: StatusCode.OK,
        data: {
          fullName: 'John Doe',
        },
      })
    })
  })
})
