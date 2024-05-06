import { type FastifyInstance } from 'fastify'

import { corsSetup } from '@/main/middlewares/cors'

export async function middlewaresSetup(app: FastifyInstance): Promise<void> {
  corsSetup(app)
}
