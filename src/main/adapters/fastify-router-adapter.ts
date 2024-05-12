import {
  type FastifyReply,
  type FastifyRequest,
  type RouteHandlerMethod,
} from 'fastify'

import { type HttpController } from '@/core/presentation/controllers/http-controller'
import { ServerError } from '@/core/presentation/errors/server-error'
import { StatusCode } from '@/core/presentation/helpers/http-helpers'

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
    switch (statusCode) {
      case StatusCode.OK:
      case StatusCode.CREATED:
      case StatusCode.NO_CONTENT:
        return reply.status(statusCode).send(data)
      case StatusCode.BAD_REQUEST:
        'errors' in data
          ? reply.status(statusCode).send({ errors: data.errors })
          : reply.status(statusCode).send({ error: data.message })
        return
      case StatusCode.UNAUTHORIZED:
      case StatusCode.NOT_FOUND:
      case StatusCode.CONFLICT:
        return reply.status(statusCode).send({ error: data.message })
      default:
        return reply
          .status(statusCode)
          .send({ error: new ServerError().message })
    }
  }
}
