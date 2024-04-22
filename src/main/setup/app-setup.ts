import Fastify, { type FastifyInstance } from 'fastify'

import { middlewaresSetup } from '@/main/setup/middlewares-setup'
import { routesSetup } from '@/main/setup/routes-setup'

export async function appSetup(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true,
  })
  await middlewaresSetup(app)
  await routesSetup(app)
  return app
}
