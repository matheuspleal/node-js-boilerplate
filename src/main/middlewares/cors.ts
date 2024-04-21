import cors from '@fastify/cors'
import { type FastifyInstance } from 'fastify'

export function corsSetup(app: FastifyInstance) {
  app.register(cors, {
    origin: '*',
  })
}
