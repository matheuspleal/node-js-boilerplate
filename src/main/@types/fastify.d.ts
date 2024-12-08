// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FastifyRequest } from 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    locals: Record<string, any>
  }
}
