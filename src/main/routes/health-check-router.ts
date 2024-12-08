import {
  type FastifyReply,
  type FastifyRequest,
  type FastifyInstance,
} from 'fastify'

const healthCheckRouterPrefix = '/health-check'

export default async function usersRouter(app: FastifyInstance) {
  app.get(
    healthCheckRouterPrefix,
    (request: FastifyRequest, reply: FastifyReply) => {
      reply.status(200).send({ message: 'Ok!' })
    },
  )
}
