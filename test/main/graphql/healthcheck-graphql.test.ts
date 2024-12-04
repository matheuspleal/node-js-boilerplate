import {
  type FastifyReply,
  type FastifyRequest,
  type FastifyInstance,
} from 'fastify'
import request from 'supertest'

import { appSetup } from '@/main/setup/app-setup'

describe('HealthcheckGraphQL', () => {
  let app: FastifyInstance
  let healthcheckQuery: string
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

  describe('healthcheck', () => {
    beforeAll(() => {
      healthcheckQuery = `
        query Healthcheck {
          healthcheck {
            message
          }
        }
      `
    })

    test('returns status code 200 when server is listening', async () => {
      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .send({
          query: healthcheckQuery,
        })

      const { healthcheck } = body.data

      expect(statusCode).toEqual(200)
      expect(healthcheck).toEqual({
        message: 'Ok!',
      })
    })

    test('returns status code 500 when server is failed', async () => {
      const { statusCode, body } = await request(app.server).get(
        '/api/v1/fake-error-endpoint',
      )

      expect(statusCode).toEqual(500)
      expect(body).toEqual({
        message: fakeError.message,
      })
    })
  })
})
