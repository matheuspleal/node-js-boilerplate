import { InternalServerError } from '@/core/presentation/errors/internal-server-error'
import {
  StatusCode,
  badDomainRequest,
  badValidatorRequest,
  conflict,
  created,
  noContent,
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

      expect(sut).toEqual(expectedResponse)
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

      expect(sut).toEqual(expectedResponse)
    })
  })

  describe('created  [status code = 201]', () => {
    it('should be able to return HttpResponse with status code equals 201 and data equals any', () => {
      const expectedResponse: HttpResponse<any> = {
        statusCode: StatusCode.CREATED,
        data: 'fake_data',
      }

      const sut = created<any>('fake_data')

      expect(sut).toEqual(expectedResponse)
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

      expect(sut).toEqual(expectedResponse)
    })
  })

  describe('no content [status code = 204]', () => {
    it('should be able to return HttpResponse with status code equals 204 and data equals undefined', () => {
      const expectedResponse: HttpResponse<undefined> = {
        statusCode: StatusCode.NO_CONTENT,
        data: undefined,
      }

      const sut = noContent()

      expect(sut).toEqual(expectedResponse)
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

      expect(sut).toEqual(expectedResponse)
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

      expect(sut).toEqual(expectedResponse)
    })

    it('should be able to return HttpResponse with status code equals 400 and data equals any list of errors', () => {
      const fakeError = new Error('fake_error')

      const expectedResponse: HttpResponse = {
        statusCode: StatusCode.BAD_REQUEST,
        data: new ValidationCompositeError([fakeError, fakeError]),
      }

      const sut = badValidatorRequest([fakeError, fakeError])

      expect(sut).toEqual(expectedResponse)
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

      expect(sut).toEqual(expectedResponse)
    })
  })

  describe('serverError [status code = 500]', () => {
    it('should be able to return HttpResponse with status code equals 500 and data equals InternalServerError', () => {
      const expectedResponse: HttpResponse = {
        statusCode: StatusCode.SERVER_ERROR,
        data: new InternalServerError(),
      }

      const sut = serverError()

      expect(sut).toEqual(expectedResponse)
    })

    it('should be able to return HttpResponse with status code equals 500 and data equals InternalServerError when unknown error is reported', () => {
      const fakeError = new Error('fake_error')
      const fakeInternalServerError = new InternalServerError(fakeError)

      const expectedResponse: HttpResponse = {
        statusCode: StatusCode.SERVER_ERROR,
        data: fakeInternalServerError,
      }

      const sut = serverError(fakeError)

      expect(sut).toEqual(expectedResponse)
    })
  })
})
