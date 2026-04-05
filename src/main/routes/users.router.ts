import { type FastifyInstance } from 'fastify'

import { fastifyHandlerAdapter } from '@/main/adapters/fastify-handler.adapter'
import { fastifyRouterAdapter } from '@/main/adapters/fastify-router.adapter'
import { makeAuthenticationMiddleware } from '@/main/factories/core/presentation/middlewares/authentication.middleware.factory'
import { makeFetchUsersController } from '@/main/factories/users/presentation/controllers/fetch-users-controller.factory'
import { makeGetUserByIdController } from '@/main/factories/users/presentation/controllers/get-user-by-id-controller.factory'
import {
  type FetchUsersControllerRequest,
  type FetchUsersControllerResponse,
} from '@/modules/users/presentation/controllers/fetch-users.controller'
import {
  type GetUserByIdControllerRequest,
  type GetUserByIdControllerResponse,
} from '@/modules/users/presentation/controllers/get-user-by-id.controller'

const userRouterPrefix = '/users'

export default async function userRouter(app: FastifyInstance) {
  app.get(
    userRouterPrefix,
    {
      preHandler: [fastifyHandlerAdapter(makeAuthenticationMiddleware())],
    },
    fastifyRouterAdapter<
      FetchUsersControllerRequest,
      FetchUsersControllerResponse
    >(makeFetchUsersController()),
  )
  app.get(
    `${userRouterPrefix}/:id`,
    {
      preHandler: [fastifyHandlerAdapter(makeAuthenticationMiddleware())],
    },
    fastifyRouterAdapter<
      GetUserByIdControllerRequest,
      GetUserByIdControllerResponse
    >(makeGetUserByIdController()),
  )
}
