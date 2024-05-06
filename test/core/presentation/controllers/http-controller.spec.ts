import { faker } from '@faker-js/faker'

import { type HttpController } from '@/core/presentation/controllers/http-controller'
import { ServerError } from '@/core/presentation/errors/server-error'
import { RequiredError } from '@/core/presentation/validators/errors/required-error'
import { ValidationCompositeError } from '@/core/presentation/validators/errors/validation-composite-error'

import {
  FakeHttpController,
  FakeHttpWithCustomValidatorController,
} from '#/core/presentation/@mocks/fake-http-controller-stub'
import { type FakeNamespace } from '#/core/presentation/@mocks/fake-namespace-stub'

describe('HttpController', () => {
  describe('default', () => {
    let sut: HttpController<FakeNamespace.Request, FakeNamespace.Response>

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

      expect(response.statusCode).toEqual(500)
      expect(response.data).toBeInstanceOf(ServerError)
    })

    it('should be able to perform with request and response handling the execution of standard validations', async () => {
      const response = await sut.handle({
        firstName: 'John',
        lastName: 'Doe',
      })

      expect(response).toMatchObject({
        statusCode: 200,
        data: {
          fullName: 'John Doe',
        },
      })
    })
  })

  describe('override buildValidator', () => {
    let sut: HttpController<FakeNamespace.Request, FakeNamespace.Response>

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

      expect(response.statusCode).toEqual(500)
      expect(response.data).toBeInstanceOf(ServerError)
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

      expect(response).toMatchObject({
        statusCode: 400,
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

      expect(response).toMatchObject({
        statusCode: 200,
        data: {
          fullName: 'John Doe',
        },
      })
    })
  })
})
