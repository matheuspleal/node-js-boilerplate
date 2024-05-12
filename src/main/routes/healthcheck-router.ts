import {
  type FastifyReply,
  type FastifyRequest,
  type FastifyInstance,
} from 'fastify'

const healthcheckRouterPrefix = '/healthcheck'

export default async function usersRouter(app: FastifyInstance) {
  app.get(
    healthcheckRouterPrefix,
    (request: FastifyRequest, reply: FastifyReply) => {
      reply.status(200).send({ message: 'Ok!' })
    },
  )
}
