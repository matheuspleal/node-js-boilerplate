import {
  type FastifyReply,
  type FastifyRequest,
  type RouteHandlerMethod,
} from 'fastify'

import { type Middleware } from '@/core/presentation/middlewares/contracts/middleware'

export function fastifyHandlerAdapter<HttpRequest>(
  middleware: Middleware<HttpRequest>,
): RouteHandlerMethod {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const payload: HttpRequest = {
      ...(request.headers as any),
    }
    const { statusCode, data } = await middleware.handle(payload)
    if (statusCode !== 200) {
      reply.status(statusCode).send({ error: data.message })
    }
    const validEntries = Object.entries(data).filter(([, value]) => value)
    request.locals = { ...request.locals, ...Object.fromEntries(validEntries) }
  }
}
