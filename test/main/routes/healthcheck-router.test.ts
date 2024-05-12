import {
  type FastifyReply,
  type FastifyRequest,
  type FastifyInstance,
} from 'fastify'
import request from 'supertest'

import { appSetup } from '@/main/setup/app-setup'

describe('HealthcheckRouter', () => {
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

  describe('[GET] /healthcheck', () => {
    test('returns status code 200 when server is listening', async () => {
      const { statusCode, body } = await request(app.server).get(
        '/api/v1/healthcheck',
      )

      expect(statusCode).toEqual(200)
      expect(body).toMatchObject({
        message: 'Ok!',
      })
    })

    test('returns status code 500 when server is failed', async () => {
      const { statusCode, body } = await request(app.server).get(
        '/api/v1/fake-error-endpoint',
      )

      expect(statusCode).toEqual(500)
      expect(body).toMatchObject({
        message: fakeError.message,
      })
    })
  })
})
