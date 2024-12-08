import {
  type FastifyReply,
  type FastifyRequest,
  type FastifyInstance,
} from 'fastify'
import request from 'supertest'

import { StatusCode } from '@/core/presentation/helpers/http-helpers'
import { appSetup } from '@/main/setup/app-setup'

describe('HealthCheckRouter', () => {
  let app: FastifyInstance
  let fakeError: Error

  beforeAll(async () => {
    app = await appSetup()
    fakeError = new Error('Fake Error')
    app.get(
      '/api/v1/fake-error-endpoint',
      async (request: FastifyRequest, reply: FastifyReply) =>
        reply.status(500).send(fakeError),
    )
    await app.ready()
  })

  describe('[GET] /health-check', () => {
    test('returns status code 200 when server is listening', async () => {
      const { statusCode, body } = await request(app.server).get(
        '/api/v1/health-check',
      )

      expect(statusCode).toEqual(StatusCode.OK)
      expect(body).toEqual({
        message: 'Ok!',
      })
    })

    test('returns status code 500 when server is failed', async () => {
      const { statusCode, body } = await request(app.server).get(
        '/api/v1/fake-error-endpoint',
      )

      expect(statusCode).toEqual(StatusCode.SERVER_ERROR)
      expect(body).toEqual({
        statusCode: StatusCode.SERVER_ERROR,
        error: 'Internal Server Error',
        message: fakeError.message,
      })
    })
  })
})
