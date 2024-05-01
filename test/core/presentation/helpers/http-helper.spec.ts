import { ServerError } from '@/core/presentation/errors/server-error'
import {
  badRequest,
  created,
  ok,
  serverError,
} from '@/core/presentation/helpers/http-helpers'
import { type HttpResponse } from '@/core/presentation/protocols/http'

import { type FakeNamespace } from '#/core/presentation/@mocks/fake-namespace-stub'

describe('HttpHelpers', () => {
  describe('ok [status code = 200]', () => {
    it('should be able to return HttpResponse with status code equals 200 and body equals any', () => {
      const expectedResponse: HttpResponse<any> = {
        statusCode: 200,
        body: 'fake_body',
      }

      const sut = ok<any>('fake_body')

      expect(sut).toMatchObject(expectedResponse)
    })

    it('should be able to return HttpResponse with status code equals 200 and body equal to the type passed in generic', () => {
      const expectedResponse: HttpResponse<FakeNamespace.Response> = {
        statusCode: 200,
        body: {
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
    it('should be able to return HttpResponse with status code equals 201 and body equals any', () => {
      const expectedResponse: HttpResponse<any> = {
        statusCode: 201,
        body: 'fake_body',
      }

      const sut = created<any>('fake_body')

      expect(sut).toMatchObject(expectedResponse)
    })

    it('should be able to return HttpResponse with status code equals 201 and body equal to the type passed in generic', () => {
      const expectedResponse: HttpResponse<FakeNamespace.Response> = {
        statusCode: 201,
        body: {
          fullName: 'John Doe',
        },
      }

      const sut = created<FakeNamespace.Response>({
        fullName: 'John Doe',
      })

      expect(sut).toMatchObject(expectedResponse)
    })
  })

  describe('badRequest [status code = 400]', () => {
    it('should be able to return HttpResponse with status code equals 400 and body equals any error', () => {
      const fakeError = new Error('fake_error')

      const expectedResponse: HttpResponse = {
        statusCode: 400,
        body: fakeError,
      }

      const sut = badRequest(fakeError)

      expect(sut).toMatchObject(expectedResponse)
    })
  })

  describe('serverError [status code = 500]', () => {
    it('should be able to return HttpResponse with status code equals 500 and body equals ServerError', () => {
      const fakeError = new Error('fake_error')
      const fakeServerError = new ServerError(fakeError)

      const expectedResponse: HttpResponse = {
        statusCode: 500,
        body: fakeServerError,
      }

      const sut = serverError(fakeError)

      expect(sut).toMatchObject(expectedResponse)
    })
  })
})
