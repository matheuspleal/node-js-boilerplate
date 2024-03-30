import { BaseController } from '@/core/presentation/controllers/base-controller'

import {
  FakeBaseController,
  FakeBaseWithCustomValidatorController,
} from '#/core/presentation/@mocks/fake-base-controller-stub'
import { FakeNamespace } from '#/core/presentation/@mocks/fake-namespace-stub'

describe('BaseController', () => {
  describe('default', () => {
    let sut: BaseController<FakeNamespace.Request, FakeNamespace.Response>

    beforeAll(() => {
      sut = new FakeBaseController()
    })

    it('should be able to handle with request and response', async () => {
      const response = await sut.handle({
        firstName: 'John',
        lastName: 'Doe',
      })

      expect(response).toMatchObject({
        fullName: 'John Doe',
      })
    })
  })

  describe('override buildValidator', () => {
    let sut: BaseController<FakeNamespace.Request, FakeNamespace.Response>

    beforeAll(() => {
      sut = new FakeBaseWithCustomValidatorController()
    })

    it('should be able to throw ValidationError if any validation is failed', async () => {
      await expect(
        sut.handle({ firstName: 'John', lastName: undefined as any as string }),
      ).rejects.toThrowError(Error)
    })

    it('should be able to return the response if all validations pass', async () => {
      const response = await sut.handle({
        firstName: 'John',
        lastName: 'Doe',
      })

      expect(response).toMatchObject({
        fullName: 'John Doe',
      })
    })
  })
})
