import { type FastifyInstance } from 'fastify'

import { fastifyHandlerAdapter } from '@/main/adapters/fastify-handler-adapter'
import { fastifyRouterAdapter } from '@/main/adapters/fastify-router-adapter'
import { makeAuthenticationMiddleware } from '@/main/factories/core/presentation/middlewares/authentication-middleware-factory'
import { makeFetchUsersController } from '@/main/factories/users/presentation/controllers/fetch-users-controller-factory'
import { makeGetUserByIdController } from '@/main/factories/users/presentation/controllers/get-user-by-id-controller-factory'
import { type FetchUsers } from '@/modules/users/presentation/controllers/fetch-users-controller'
import { type GetUsersById } from '@/modules/users/presentation/controllers/get-user-by-id-controller'

const usersRouterPrefix = '/users'

export default async function usersRouter(app: FastifyInstance) {
  app.get(
    usersRouterPrefix,
    {
      preHandler: [fastifyHandlerAdapter(makeAuthenticationMiddleware())],
    },
    fastifyRouterAdapter<FetchUsers.Request, FetchUsers.Response>(
      makeFetchUsersController(),
    ),
  )
  app.get(
    `${usersRouterPrefix}/:id`,
    {
      preHandler: [fastifyHandlerAdapter(makeAuthenticationMiddleware())],
    },
    fastifyRouterAdapter<GetUsersById.Request, GetUsersById.Response>(
      makeGetUserByIdController(),
    ),
  )
}
