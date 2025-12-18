import { type FastifyInstance } from 'fastify'

import { corsSetup } from '@/main/middlewares/cors.middleware'
import { openApiSetup } from '@/main/middlewares/open-api.middleware'

export async function middlewaresSetup(app: FastifyInstance): Promise<void> {
  await corsSetup(app)
  await openApiSetup(app)
}
