import scalar from '@scalar/fastify-api-reference'
import { type FastifyInstance } from 'fastify'

import { api } from '@/core/shared/config/env'
import setup from '@/main/docs/openapi'

export function openApiSetup(app: FastifyInstance) {
  app.register(scalar, {
    routePrefix: `/api/${api.currentVersion}/reference`,
    configuration: {
      theme: 'purple',
      spec: {
        content: setup,
      },
    },
  })
}
