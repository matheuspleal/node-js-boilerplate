import cors from '@fastify/cors'
import { type FastifyInstance } from 'fastify'

export async function corsSetup(app: FastifyInstance): Promise<void> {
  await app.register(cors, {
    origin: '*',
  })
}
