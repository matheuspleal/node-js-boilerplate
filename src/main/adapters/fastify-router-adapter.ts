import {
  type FastifyReply,
  type FastifyRequest,
  type RouteHandlerMethod,
} from 'fastify'

import { type HttpController } from '@/core/presentation/controllers/http-controller'
import { formatError } from '@/main/helpers/format-error'

export function fastifyRouterAdapter<HttpRequest, Data>(
  controller: HttpController<HttpRequest, Data>,
): RouteHandlerMethod {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const payload: HttpRequest = {
      ...(request.body as any),
      ...(request.params as any),
      ...(request.query as any),
    }
    const { statusCode, data } = await controller.handle(payload)
    const isSuccess = statusCode > 199 && statusCode < 400
    const json = isSuccess ? data : formatError(data.message)
    reply.status(statusCode).send(json)
  }
}
