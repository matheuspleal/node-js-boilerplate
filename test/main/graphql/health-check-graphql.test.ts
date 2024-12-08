import {
  type FastifyReply,
  type FastifyRequest,
  type FastifyInstance,
} from 'fastify'
import request from 'supertest'

import { StatusCode } from '@/core/presentation/helpers/http-helpers'
import { appSetup } from '@/main/setup/app-setup'

describe('HealthCheckGraphQL', () => {
  let app: FastifyInstance
  let healthCheckQuery: string
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

  describe('healthCheck', () => {
    beforeAll(() => {
      healthCheckQuery = `
        query HealthCheck {
          healthCheck {
            message
          }
        }
      `
    })

    test('returns status code 200 when server is listening', async () => {
      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .send({
          query: healthCheckQuery,
        })

      const { healthCheck } = body.data

      expect(statusCode).toEqual(StatusCode.OK)
      expect(healthCheck).toEqual({
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
