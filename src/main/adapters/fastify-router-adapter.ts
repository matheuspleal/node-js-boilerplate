import {
  type FastifyReply,
  type FastifyRequest,
  type RouteHandlerMethod,
} from 'fastify'

import { type HttpController } from '@/core/presentation/controllers/http-controller'

export function fastifyRouterAdapter<Request, Response>(
  controller: HttpController<Request, Response>,
): RouteHandlerMethod {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const payload: Request = {
      ...(request.body as any),
      ...(request.params as any),
      ...(request.query as any),
    }
    const { statusCode, body } = await controller.handle(payload)
    const isSuccess = statusCode > 199 && statusCode < 400
    const json = isSuccess ? body : { error: body.message }
    reply.status(statusCode).send(json)
  }
}
