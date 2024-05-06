import Fastify, { type FastifyInstance } from 'fastify'

import { apolloServerSetup } from '@/main/setup/apollo-server-setup'
import { middlewaresSetup } from '@/main/setup/middlewares-setup'
import { routesSetup } from '@/main/setup/routes-setup'

export async function appSetup(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true,
  })
  await middlewaresSetup(app)
  await apolloServerSetup(app)
  await routesSetup(app)
  return app
}
