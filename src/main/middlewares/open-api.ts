import swagger from '@fastify/swagger'
import scalar from '@scalar/fastify-api-reference'
import { type FastifyInstance } from 'fastify'

import { api } from '@/core/shared/config/env'
import setup from '@/main/docs/openapi'

export async function openApiSetup(app: FastifyInstance) {
  await app.register(swagger, {
    openapi: setup,
    hideUntagged: true,
  })
  await app.register(scalar, {
    routePrefix: `/api/${api.currentVersion}/docs`,
    configuration: {
      theme: 'purple',
    },
  })
}
