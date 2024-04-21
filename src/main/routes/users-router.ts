import { type FastifyInstance } from 'fastify'

import { fastifyRouterAdapter } from '@/main/adapters/fastify-router-adapter'
import { makeCreateUserController } from '@/main/factories/users/presentation/controllers/create-user-controller-factory'
import { makeFetchUsersController } from '@/main/factories/users/presentation/controllers/fetch-users-controller-factory'
import { type CreateUser } from '@/modules/users/presentation/controllers/create-user-controller'
import { type FetchUsers } from '@/modules/users/presentation/controllers/fetch-users-controller'

const usersRouterPrefix = '/users'

export default async function userRouter(app: FastifyInstance) {
  app.get(
    usersRouterPrefix,
    fastifyRouterAdapter<FetchUsers.Request, FetchUsers.Response>(
      makeFetchUsersController(),
    ),
  )
  app.post(
    usersRouterPrefix,
    fastifyRouterAdapter<CreateUser.Request, CreateUser.Response>(
      makeCreateUserController(),
    ),
  )
}
