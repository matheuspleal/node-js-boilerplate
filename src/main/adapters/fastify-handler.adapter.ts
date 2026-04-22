import {
  type FastifyReply,
  type FastifyRequest,
  type preHandlerHookHandler,
} from 'fastify'

import { StatusCode } from '@/core/presentation/helpers/http.helper'
import { type Middleware } from '@/core/presentation/middlewares/contracts/middleware'

export function fastifyHandlerAdapter<HttpRequest>(
  middleware: Middleware<HttpRequest>,
): preHandlerHookHandler {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const payload: HttpRequest = {
      ...(request.headers as any),
    }
    const { statusCode, data } = await middleware.handle(payload)
    if (statusCode !== StatusCode.OK) {
      reply.status(statusCode).send({ error: data.message })
    }
    const validEntries = Object.entries(data).filter(([, value]) => value)
    request.locals = { ...request.locals, ...Object.fromEntries(validEntries) }
  }
}
