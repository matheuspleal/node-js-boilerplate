import { faker } from '@faker-js/faker'

import { BaseController } from '@/core/presentation/controllers/base.controller'
import { BuilderValidator } from '@/core/presentation/validators/builder.validator'
import { type ValidatorRule } from '@/core/presentation/validators/contracts/validator-rule.contract'
import { ValidationCompositeError } from '@/core/presentation/validators/errors/validation-composite.error'

interface FakeRequest {
  firstName: string
  lastName: string
}

interface FakeResponse {
  fullName: string
}

class FakeBaseController extends BaseController<FakeRequest, FakeResponse> {
  constructor() {
    super()
  }

  override async handle(request: FakeRequest): Promise<FakeResponse> {
    const errors = this.validate(request)
    if (errors !== undefined) {
      throw new ValidationCompositeError(errors)
    }
    return Promise.resolve({
      fullName: `${request.firstName} ${request.lastName}`,
    })
  }
}

class FakeBaseWithCustomValidatorController extends BaseController<
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

  override async handle(request: FakeRequest): Promise<FakeResponse> {
    const errors = this.validate(request)
    if (errors !== undefined) {
      throw new ValidationCompositeError(errors)
    }
    return Promise.resolve({
      fullName: `${request.firstName} ${request.lastName}`,
    })
  }
}

describe('BaseController', () => {
  describe('default', () => {
    let sut: BaseController<FakeRequest, FakeResponse>

    beforeAll(() => {
      sut = new FakeBaseController()
    })

    it('should be able to handle with request and response', async () => {
      const response = await sut.handle({
        firstName: 'John',
        lastName: 'Doe',
      })

      expect(response).toEqual({
        fullName: 'John Doe',
      })
    })
  })

  describe('override buildValidator', () => {
    let sut: BaseController<FakeRequest, FakeResponse>

    beforeAll(() => {
      sut = new FakeBaseWithCustomValidatorController()
    })

    it('should be able to throw ValidationError if any validation is failed', async () => {
      await expect(
        sut.handle({
          firstName: 'John',
          lastName: faker.helpers.arrayElement([
            null,
            undefined,
          ]) as any as string,
        }),
      ).rejects.toThrowError(Error)
    })

    it('should be able to return the response if all validations pass', async () => {
      const response = await sut.handle({
        firstName: 'John',
        lastName: 'Doe',
      })

      expect(response).toEqual({
        fullName: 'John Doe',
      })
    })
  })
})
