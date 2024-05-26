import { ServerError } from '@/core/presentation/errors/server-error'
import {
  StatusCode,
  badDomainRequest,
  badValidatorRequest,
  conflict,
  created,
  ok,
  serverError,
} from '@/core/presentation/helpers/http-helpers'
import { type HttpResponse } from '@/core/presentation/protocols/http'
import { ValidationCompositeError } from '@/core/presentation/validators/errors/validation-composite-error'

import { type FakeNamespace } from '#/core/presentation/@mocks/fake-namespace-stub'

describe('HttpHelpers', () => {
  describe('ok [status code = 200]', () => {
    it('should be able to return HttpResponse with status code equals 200 and data equals any', () => {
      const expectedResponse: HttpResponse<any> = {
        statusCode: StatusCode.OK,
        data: 'fake_data',
      }

      const sut = ok<any>('fake_data')

      expect(sut).toMatchObject(expectedResponse)
    })

    it('should be able to return HttpResponse with status code equals 200 and data equal to the type passed in generic', () => {
      const expectedResponse: HttpResponse<FakeNamespace.Response> = {
        statusCode: StatusCode.OK,
        data: {
          fullName: 'John Doe',
        },
      }

      const sut = ok<FakeNamespace.Response>({
        fullName: 'John Doe',
      })

      expect(sut).toMatchObject(expectedResponse)
    })
  })

  describe('created  [status code = 201]', () => {
    it('should be able to return HttpResponse with status code equals 201 and data equals any', () => {
      const expectedResponse: HttpResponse<any> = {
        statusCode: StatusCode.CREATED,
        data: 'fake_data',
      }

      const sut = created<any>('fake_data')

      expect(sut).toMatchObject(expectedResponse)
    })

    it('should be able to return HttpResponse with status code equals 201 and data equal to the type passed in generic', () => {
      const expectedResponse: HttpResponse<FakeNamespace.Response> = {
        statusCode: 201,
        data: {
          fullName: 'John Doe',
        },
      }

      const sut = created<FakeNamespace.Response>({
        fullName: 'John Doe',
      })

      expect(sut).toMatchObject(expectedResponse)
    })
  })

  describe('badDomainRequest [status code = 400]', () => {
    it('should be able to return HttpResponse with status code equals 400 and data equals any error', () => {
      const fakeError = new Error('fake_error')

      const expectedResponse: HttpResponse = {
        statusCode: StatusCode.BAD_REQUEST,
        data: fakeError,
      }

      const sut = badDomainRequest(fakeError)

      expect(sut).toMatchObject(expectedResponse)
    })
  })

  describe('badValidatorRequest [status code = 400]', () => {
    it('should be able to return HttpResponse with status code equals 400 and data equals any error', () => {
      const fakeError = new Error('fake_error')

      const expectedResponse: HttpResponse = {
        statusCode: StatusCode.BAD_REQUEST,
        data: new ValidationCompositeError([fakeError]),
      }

      const sut = badValidatorRequest(fakeError)

      expect(sut).toMatchObject(expectedResponse)
    })

    it('should be able to return HttpResponse with status code equals 400 and data equals any list of errors', () => {
      const fakeError = new Error('fake_error')

      const expectedResponse: HttpResponse = {
        statusCode: StatusCode.BAD_REQUEST,
        data: new ValidationCompositeError([fakeError, fakeError]),
      }

      const sut = badValidatorRequest([fakeError, fakeError])

      expect(sut).toMatchObject(expectedResponse)
    })
  })

  describe('conflict [status code = 409]', () => {
    it('should be able to return HttpResponse with status code equals 409 and data with conflict error', () => {
      const fakeError = new Error('fake_error')

      const expectedResponse: HttpResponse = {
        statusCode: StatusCode.CONFLICT,
        data: fakeError,
      }

      const sut = conflict(fakeError)

      expect(sut).toMatchObject(expectedResponse)
    })
  })

  describe('serverError [status code = 500]', () => {
    it('should be able to return HttpResponse with status code equals 500 and data equals ServerError', () => {
      const expectedResponse: HttpResponse = {
        statusCode: StatusCode.SERVER_ERROR,
        data: new ServerError(),
      }

      const sut = serverError()

      expect(sut).toMatchObject(expectedResponse)
    })

    it('should be able to return HttpResponse with status code equals 500 and data equals ServerError when unknown error is reported', () => {
      const fakeError = new Error('fake_error')
      const fakeServerError = new ServerError(fakeError)

      const expectedResponse: HttpResponse = {
        statusCode: StatusCode.SERVER_ERROR,
        data: fakeServerError,
      }

      const sut = serverError(fakeError)

      expect(sut).toMatchObject(expectedResponse)
    })
  })
})
