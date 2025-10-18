import { type FastifyInstance } from 'fastify'

import { corsSetup } from '@/main/middlewares/cors'
import { openApiSetup } from '@/main/middlewares/open-api'

export async function middlewaresSetup(app: FastifyInstance): Promise<void> {
  await corsSetup(app)
  await openApiSetup(app)
}
